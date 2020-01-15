import { ExpressReceiver } from '@slack/bolt';
import got from 'got';
import { App } from '../initializers/bolt';

export const keepalive = (app: App, receiver: ExpressReceiver) => {
  if (!process.env.KEEPALIVE_URL) {
    console.error('`keepalive` included, but missing KEEPALIVE_URL.');
    return
  }

  const wakeUpTime = (process.env.KEEPALIVE_WAKEUP_TIME || '6:00').split(':').map(i => parseInt(i, 10));
  const sleepTime =  (process.env.KEEPALIVE_SLEEP_TIME || '22:00').split(':').map(i => parseInt(i, 10));
  const wakeUpOffset = (60 * wakeUpTime[0] + wakeUpTime[1]) % (60 * 24);
  const awakeMinutes = (60 * (sleepTime[0] + 24) + sleepTime[1] - wakeUpOffset) % (60 * 24);
  const keepaliveInterval = process.env.KEEPALIVE_INTERVAL ? parseFloat(process.env.KEEPALIVE_INTERVAL) : 5;

  const client = got.extend({
    prefixUrl: process.env.KEEPALIVE_URL
  });

  if (keepaliveInterval > 0.0) {
    app.context.keepaliveIntervalId = setInterval(
      async () => {
        console.info('keepalive ping');

        const now = new Date();
        const elapsedMinutes = (((60 * (now.getHours() + 24)) + now.getMinutes()) - wakeUpOffset) % (60 * 24);

        if (elapsedMinutes < awakeMinutes) {
          try {
            const res = await client.post('keepalive');
            console.info(`keepalive pong: ${res.statusCode} ${res.body}`);
          } catch (error) {
            console.info(`keepalive pong: ${error}`);
            app.action('error', error);
          }
        } else {
          console.info('Skipping keep alive, time to rest');
        }
      },
      keepaliveInterval * 60 * 1000
    );
  } else {
    console.info(`keepalive is ${keepaliveInterval}, so not keeping alive`);
  }

  receiver.app.post('/keepalive', (_, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('OK');
  });
};
