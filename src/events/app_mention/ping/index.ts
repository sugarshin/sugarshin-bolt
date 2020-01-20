import { App } from '../../../types';

export const ping = (app: App) => {
  console.log('ffsd');
  app.event('app_mention', async a => {
    a.context.botUserId
    console.log(a);
  // try {
  //   const result = await app.client.chat.postMessage({
  //     token: context.botToken,
  //     channel: welcomeChannelId,
  //     text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
  //   });
  //   console.log(result);
  // }
  // catch (error) {
  //   console.error(error);
  // }
  });
};
