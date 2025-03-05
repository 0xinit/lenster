import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountDocument, type AccountFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Address } from "viem";
import sendBuzz from "./sendBuzz";

const sendVerificationBuzz = async ({
  account,
  operation
}: { account: Address; operation: string }): Promise<boolean> => {
  try {
    const { data } = await apolloClient().query({
      query: AccountDocument,
      variables: { request: { address: account } }
    });

    const accountData = data?.account as AccountFragment;

    if (!accountData) {
      return false;
    }

    const { usernameWithPrefix } = getAccount(accountData);

    return sendBuzz({
      message: `🔀 Operation ➜ ${operation}`,
      thumbnail: getAvatar(accountData),
      footer: `By ${usernameWithPrefix}`,
      topic: process.env.DISCORD_EVENT_WEBHOOK_TOPIC
    });
  } catch {
    return false;
  }
};

export default sendVerificationBuzz;
