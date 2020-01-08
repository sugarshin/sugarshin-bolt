import dotenv from 'dotenv';
dotenv.config();

import { app } from './initializers/bolt';
import { fassReservation } from './commands/fass-reservation';
import { pCron } from './crons/p';

fassReservation(app);
pCron(app);

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
