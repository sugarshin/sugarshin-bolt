import { App, SayFn } from '@slack/bolt';
import { toNumber, head, last, isNull, isUndefined } from 'lodash';
import cheerio from 'cheerio';
import { createPoll } from './helpers/create-poll';
import { fetchHtm } from './helpers/fetch-htm';
import { salonMap } from './helpers/salon-map';
import { parseWaitingOrderText } from './helpers/parse-waiting-order-text';

const getWaitingResultPageUrl = (salonId: string) => `https://wb.goku.ne.jp/FaSS${salonId}HtmlResult/WaitingResultPage.htm`;
const selectors = {
  waitingOrder: 'body > div > DIV',
  outsideHours: ':contains("ただいまの時間は営業時間外です")',
};

const getWaitingOrder = (html: string) => parseWaitingOrderText(cheerio.load(html)(selectors.waitingOrder).text());

const existsSalon = (say: SayFn, match: RegExpMatchArray) => {
  if (!salonMap[match[1].toLowerCase()]) {
    say(`I don't know such a salon: \`${match[1]}\`. You can check with \`hubot fass ls\``);
    return false;
  }
  return true;
};

export const fassReservation = (app: App) => {
  app.command('/fass', async ({ body, ack, say }) => {
    ack();

    let m: RegExpMatchArray | null;
    if (m = body.text.match(/^\s*([a-z0-9]+)\s+r(?:sv|eserve)\s*$/i)) {
      if (!existsSalon(say, m)) {
        return;
      }
      say('Not implemented yet. Please ask https://sugarshin.net/');
      return;
    }

    if (m = body.text.match(/^\s*l(?:s|ist)\s*$/i)) {
      const text = Object.keys(salonMap)
        .map(k => [`${salonMap[k]} - ${k}`, `  e.g., \`/fass ${k} w\``].join('\n')).join('\n\n');
      say(text);
      return;
    }

    if (m = body.text.match(/^\s*([a-z0-9]+)\s+w(?:aiting)?(?:\s+(\d+))?\s*$/i)) {
      if (!existsSalon(say, m)) {
        return;
      }

      const waitingResultPageUrl = getWaitingResultPageUrl(m[1]);

      fetchHtm(waitingResultPageUrl)
        .then((html: string) => {
          const $ = cheerio.load(html);
          if ($(selectors.outsideHours).length > 0) {
            say('営業時間外です');
            return;
          }
          if (isUndefined((m as RegExpMatchArray)[2])) {
            say($(selectors.waitingOrder).text());
            return;
          }

          const numberStr = (m as RegExpMatchArray)[2];
          const waitingOrder = getWaitingOrder(html);
          const lastWaitingOrder = last(waitingOrder) || [];
          if (toNumber(lastWaitingOrder[1]) < toNumber(numberStr)) {
            say('その番号では予約されていません');
            return;
          }
          const headWaitingOrder = head(waitingOrder) || [];
          if (toNumber(headWaitingOrder[1]) > toNumber(numberStr)) {
            say('すでに来店済みです');
            return;
          }

          let prevIndex: number;
          const fetchHtmPolling = createPoll(
            fetchHtm,
            (html: string) => {
              const currentWaitingOrder = getWaitingOrder(html);
              const currentIndex = currentWaitingOrder.findIndex(o => o[1] === numberStr);
              const currentHeadWaitingOrder = head(currentWaitingOrder) || [];
              if ((currentIndex === -1) || (toNumber(currentHeadWaitingOrder[1]) > toNumber(numberStr))) {
                say('施術を開始したか、予約が取り消されました');
                return true;
              }

              if (currentIndex === 0) {
                say(`<@${body.user_id}> 順番がきました`);
                return true;
              }

              if ((currentIndex === 3) && (isNull(prevIndex) || (currentIndex < prevIndex))) {
                say(`<@${body.user_id}> あと 3 人で順番がきます`);
              } else if ((currentIndex === 5) && (isNull(prevIndex) || (currentIndex < prevIndex))) {
                say(`<@${body.user_id}> あと 5 人で順番がきます`);
              }
              prevIndex = currentIndex;
              return false;
            });

          say(`\`${numberStr}\` 番の監視を開始します`);
          fetchHtmPolling(waitingResultPageUrl).catch(err => say(`エラーが発生しました ${err.toString()}`));
        });

      return;
    }
  });
};
