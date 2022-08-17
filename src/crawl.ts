import { load } from 'cheerio';
import Api from './api';
import type { CrawlerOptions } from './types';
import request from './request';
import { CrawlerError, CrawlerResult, ErrorCode } from './result';

async function crawl(crawlerOptions: CrawlerOptions): Promise<CrawlerResult> {
  try {
    const { url, options, rules } = crawlerOptions;

    if (!url) throw new CrawlerError(ErrorCode.MISSURL);
    if (!rules) throw new CrawlerError(ErrorCode.MISSRULES);

    const html = await request(url, options);

    if (!html) throw new CrawlerError(ErrorCode.EMPTY);

    const $ = load(html);

    const api = new Api(rules, $);

    return new CrawlerResult(api.results);
  } catch (error) {
    if (error instanceof CrawlerError) {
      return new CrawlerResult(error);
    }
    return new CrawlerResult(new CrawlerError(ErrorCode.UNKNOWN));
  }
}

export default crawl;
