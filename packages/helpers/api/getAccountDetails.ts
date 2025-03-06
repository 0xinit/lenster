import { HEY_API_URL } from "@hey/data/constants";
import type { AccountDetails } from "@hey/types/hey";
import axios from "axios";

export const GET_ACCOUNT_DETAILS_QUERY_KEY = "getAccountDetails";

/**
 * Retrieves the account details for a given address.
 *
 * @param {string} address - The account address.
 * @returns {Promise<null | AccountDetails>} The account details or null if not found.
 */
const getAccountDetails = async (
  address: string
): Promise<null | AccountDetails> => {
  try {
    const { data } = await axios.get(`${HEY_API_URL}/account/get`, {
      params: { address }
    });

    return data.result;
  } catch {
    return null;
  }
};

export default getAccountDetails;
