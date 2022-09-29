import { App } from '../../../types';
import { logger } from '../../../initializers/logger';

export const ping = (app: App): void => {
  app.event('app_mention', async ({ body, say }) => {
    try {
      if (body.event.text.replace(/<@\w+>/g, '').trim() !== 'ping') {
        return;
      }
      await say('pong');
    } catch (error) {
      logger.error(error);
    }
  });
};
