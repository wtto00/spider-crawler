import type { CrawlerOptions } from './types';
import handleResult from './utils/handle';
import request from './utils/request';
import { CrawlerError, CrawlerResult, ErrorCode } from './utils/result';

async function crawl(crawlerOptions: CrawlerOptions): Promise<CrawlerResult> {
  try {
    const { url, options, results } = crawlerOptions;

    const html = await request(url, options);

    const data = handleResult(html, results);

    return new CrawlerResult(data);
  } catch (error) {
    if (error instanceof CrawlerError) {
      return new CrawlerResult(error);
    }
    return new CrawlerResult(new CrawlerError(ErrorCode.UNKNOWN));
  }
}

export default crawl;
