import { CronJob } from 'cron';
import got from 'got';
import { logger } from '../../initializers/logger';

const { BLOG_BUILDER_CIRCLE_TOKEN: TOKEN } = process.env;

export const mrBlogCron = (): void => {
  const executeMonthlyReport = async () => {
    try {
      const res = await got.post(
        `https://circleci.com/api/v1/project/sugarshin/build.blog.sugarshin.net/tree/monthly-report?circle-token=${TOKEN}`,
      );
      logger.info(`successfully requested: ${res.statusCode} ${res.statusMessage}`);
    } catch (error) {
      logger.error(error);
    }
  };

  new CronJob('0 01 00 01 * *', executeMonthlyReport).start();
};
