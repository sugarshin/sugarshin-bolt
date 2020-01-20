import dotenv from 'dotenv';
dotenv.config();

import { app, receiver } from './initializers/bolt';
import { logger } from './initializers/logger';
import { fassReservation } from './commands/fass-reservation';
import { pCron } from './crons/p';
import { mrBlogCron } from './crons/mr-blog';
import { herokuKeepalive } from './effects/heroku-keepalive';
import { ping } from './events/app_mention/ping';

herokuKeepalive(app, receiver);
fassReservation(app);
pCron(app);
mrBlogCron();
ping(app);

(async () => {
  await app.start(process.env.PORT || 3000);
  logger.info('⚡️ Bolt app is running!');
})();
