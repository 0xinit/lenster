import { APP_NAME } from "@hey/data/constants";

const sendDiscordMessage = async ({
  message,
  footer,
  topic
}: { message: string; footer?: string; topic: string }) => {
  try {
    const response = await fetch(`https://discord.com/api/webhooks/${topic}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: `${APP_NAME} Bot`,
        avatar_url: "https://github.com/heyverse.png",
        embeds: [
          {
            title: message,
            footer: { text: footer },
            timestamp: new Date().toISOString()
          }
        ]
      })
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export default sendDiscordMessage;
