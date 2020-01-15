import { App as BoltApp, LogLevel, ExpressReceiver } from '@slack/bolt';

export interface App extends BoltApp {
  context: {
    [key: string]: any;
  };
}

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
});

const app = new BoltApp({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
  logLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
}) as App;

app.context = {};

export { app };
