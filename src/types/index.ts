import { App as BoltApp } from '@slack/bolt';

export interface App extends BoltApp {
  context: {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}
