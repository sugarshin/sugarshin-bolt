import { App } from '../../../types';
import { logger } from '../../../initializers/logger';

export const ping = (app: App): void => {
  app.event('app_mention', async ({ body, say }) => {
    console.log('body is: ', body);
    try {
      await say('pong');
    } catch (error) {
      logger.error(error);
    }
  });
};
