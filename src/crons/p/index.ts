import { CronJob } from 'cron';
import { random } from 'lodash';
import { logger } from '../../initializers/logger';
import { octokit } from '../../initializers/octokit';
import { App } from '../../types';

const { SLACK_PROMISE_CHANNEL_ID: PROMISE_CHANNEL } = process.env;

export const pCron = (app: App): void => {
  const sayP = async () => {
    const fileName = encodeURIComponent('約束事');
    const res = await octokit.repos
      .getContents({
        owner: 'sugarshin',
        repo: 'myfam',
        path: `cd/${fileName}.md`,
        headers: {
          Accept: 'application/vnd.github.v3.raw',
        },
      })
      .catch((err: Error) => {
        logger.error(err.message);
      });

    if (!res || !res.data) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const content = res.data as string;
    const splited = content.split('\n');
    const headers = splited
      .filter(row => /^##\s+.+/.test(row))
      .map(row => ({
        text: row,
        index: splited.indexOf(row),
      }));

    const commonHeader = headers.find(h => /^##\s+共通/.test(h.text));
    const orderedListRegex = /^\d+\.\s+.+/;

    const selectCommon = () => {
      if (!commonHeader) {
        return null;
      }
      const commonPromises = splited
        .slice(commonHeader.index + 1, headers[1].index)
        .filter(row => orderedListRegex.test(row));
      return commonPromises[random(0, commonPromises.length - 1)];
    };

    const promises0 = splited
      .slice(headers[1].index + 1, headers[2].index)
      .filter(row => orderedListRegex.test(row));
    const promises1 = splited
      .slice(headers[2].index + 1, splited.length)
      .filter(row => orderedListRegex.test(row));

    const selectedCommon = selectCommon();
    const { promise, name } = [
      {
        name: headers[1].text.replace(/^##\s+/, ''),
        promise: promises0,
      },
      {
        name: headers[2].text.replace(/^##\s+/, ''),
        promise: promises1,
      },
    ][random(0, 1)];
    const selectedPerson = promise[random(0, promise.length - 1)];

    return await app.client.chat
      .postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: PROMISE_CHANNEL as string,
        text: `\
👨‍👩‍👧‍👧 約束事 👨‍👩‍👧‍👧

${
  commonHeader && selectedCommon
    ? `✅ ${commonHeader.text.replace(/^##\s+/, '')}： ${selectedCommon}`
    : ''
}
✅ ${name}： ${selectedPerson}

<https://github.com/sugarshin/myfam/blob/master/cd/${fileName}.md|約束事を見る> <!here>\
`,
      })
      .catch((err: Error) => {
        logger.error(err.message);
      });
  };

  new CronJob('0 00 13,21 * * 0-6', sayP).start();
};
