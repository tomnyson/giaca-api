import { Expo } from "expo-server-sdk";

// let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
let expo = new Expo();
export const pushMessage = async () => {
  console.log("pushMessage");
  let messages = [];
  const listToken = ["ExponentPushToken[yRX3sNFgaL59AuiAmFFgDe]"];
  for (let pushToken of listToken) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: pushToken,
      sound: "default",
      body: "This is a test notification",
      data: { withSome: "data" },
    });
  }
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
