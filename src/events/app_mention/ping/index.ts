import { App } from '../../../types';
import { logger } from '../../../initializers/logger';

export const ping = (app: App): void => {
  app.event('app_mention', async ({ say, message }) => {
    console.log('message is: ', message);
    try {
      await say('pong');
    } catch (error) {
      logger.error(error);
    }
  });
};
