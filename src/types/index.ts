import { App as BoltApp } from '@slack/bolt';

export interface App extends BoltApp {
  context: {
    keepaliveIntervalId?: NodeJS.Timeout;
  };
}
