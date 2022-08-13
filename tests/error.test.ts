import type { CrawlerOptions, ResultsHandler } from '../src/types';
import { crawl } from '../src/index';
import { ResultCodes } from '../src/utils/result';

const requestErrorOptions: CrawlerOptions = {
  url: 'asdasda.dfadf',
  results: {},
};

test('request error', () =>
  crawl(requestErrorOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.UNKNOWN);
  }));

const resultsEmptyOptions: CrawlerOptions = {
  url: 'https://www.baidu.com',
  results: undefined as unknown as ResultsHandler,
};

test('results empty', () =>
  crawl(resultsEmptyOptions).then((res) => {
    expect(res.data).toEqual({});
  }));
