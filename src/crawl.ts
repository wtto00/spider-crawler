import { CrawlerResultCode } from './utils/enum';
import type { CrawlerOptions, CrawlerResult } from './types';
import handleResult from './utils/handle';
import request from './utils/request';

async function crawl(crawlerOptions: CrawlerOptions): Promise<CrawlerResult> {
  try {
    const { url, options, results } = crawlerOptions;

    const html = await request(url, options);

    const data = handleResult(html, results);

    return {
      code: CrawlerResultCode.SUCCESS,
      message: 'success',
      data: data,
    };
  } catch (error) {
    return {
      code: CrawlerResultCode.UNKNOWN,
      message: (error as Error).message,
      data: {},
    };
  }
}

export default crawl;
