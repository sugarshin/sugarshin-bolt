import { App as BoltApp } from '@slack/bolt';

export interface App extends BoltApp {
  context: {
    [key: string]: any;
  };
}
