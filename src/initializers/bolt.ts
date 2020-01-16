import { App as BoltApp, ExpressReceiver } from '@slack/bolt';
import { logger, logLevel } from './logger';
import { App } from '../types';

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
});

const app = new BoltApp({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
  logger,
  logLevel,
}) as App;

app.context = {};

export { app };
