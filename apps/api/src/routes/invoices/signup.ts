import type { Handler } from 'express';

import LensEndpoint from '@hey/data/lens-endpoints';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import invoiceRates from 'src/data/invoice-rates';
import catchedError from 'src/helpers/catchedError';
import { HEY_USER_AGENT } from 'src/helpers/constants';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const client = createClickhouseClient();

    const [rows, lensResponse] = await Promise.all([
      client.query({
        format: 'JSONEachRow',
        query: `
          SELECT city, region, country
          FROM events
          WHERE 
            actor = '${id}'
            AND city IS NOT NULL
            AND region IS NOT NULL
            AND country IS NOT NULL
          ORDER BY created ASC
          LIMIT 1;
        `
      }),
      axios.post(
        LensEndpoint.Mainnet,
        {
          query: `
            query Profile {
              profile(request: { forProfileId: "${id}" }) {
                id
                handle {
                  localName
                }
                metadata {
                  displayName
                }
                createdAt
              }
            }
          `
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-agent': HEY_USER_AGENT
          }
        }
      )
    ]);

    const leafwatchData = await rows.json<{
      actor: string;
      city: string;
      country: string;
      created: string;
      region: string;
    }>();

    const lensData = lensResponse.data;

    const lensProfile = {
      createdAt: lensData.data.profile.createdAt,
      id: `SIGNUP-${parseInt(lensData.data.profile.id)}`,
      name:
        lensData?.data.profile.metadata?.displayName ||
        lensData.data.profile.handle?.localName ||
        lensData.data.profile.id
    };

    const rate = invoiceRates.find((rate) => rate.date.getTime() <= Date.now());

    const result = {
      ...leafwatchData[0],
      ...lensProfile,
      rate: rate?.rate || 600
    };

    logger.info(`Fetched invoice data for ${id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
