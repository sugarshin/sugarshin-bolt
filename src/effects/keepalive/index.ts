import { ExpressReceiver } from '@slack/bolt';
import got from 'got';
import { logger } from '../../initializers/logger';
import { App } from '../../types';

export const keepalive = (app: App, receiver: ExpressReceiver): void => {
  if (!process.env.KEEPALIVE_URL_BASE) {
    logger.error('`keepalive` included, but missing KEEPALIVE_URL_BASE.');
    return;
  }

  const wakeUpTime = (process.env.KEEPALIVE_WAKEUP_TIME || '6:00')
    .split(':')
    .map(i => parseInt(i, 10));
  const sleepTime = (process.env.KEEPALIVE_SLEEP_TIME || '22:00')
    .split(':')
    .map(i => parseInt(i, 10));
  const wakeUpOffset = (60 * wakeUpTime[0] + wakeUpTime[1]) % (60 * 24);
  const awakeMinutes = (60 * (sleepTime[0] + 24) + sleepTime[1] - wakeUpOffset) % (60 * 24);
  const keepaliveInterval = process.env.KEEPALIVE_INTERVAL
    ? parseFloat(process.env.KEEPALIVE_INTERVAL)
    : 5;

  const client = got.extend({
    prefixUrl: process.env.KEEPALIVE_URL_BASE,
  });

  if (keepaliveInterval > 0) {
    app.context.keepaliveIntervalId = setInterval(async () => {
      logger.info('keepalive ping');

      const now = new Date();
      const elapsedMinutes =
        (60 * (now.getHours() + 24) + now.getMinutes() - wakeUpOffset) % (60 * 24);

      if (elapsedMinutes < awakeMinutes) {
        try {
          const res = await client.post('keepalive');
          logger.info(`keepalive pong: ${res.statusCode} ${res.body}`);
        } catch (error) {
          logger.info(`keepalive pong: ${error}`);
          app.action('error');
        }
      } else {
        logger.info('Skipping keep alive, time to rest');
      }
    }, keepaliveInterval * 60 * 1000);
  } else {
    logger.info(`keepalive is ${keepaliveInterval}, so not keeping alive`);
  }

  receiver.app.post('/keepalive', (_, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('OK');
  });
};
