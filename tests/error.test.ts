import type { CrawlerOptions, Rules } from '../src/types';
import { crawl } from '../src/index';
import { ResultCodes } from '../src/result';

const requestErrorOptions: CrawlerOptions = {
  url: 'asdasda.dfadf',
  rules: {},
};

test('request error', () =>
  crawl(requestErrorOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.UNKNOWN);
  }));

const resultsEmptyOptions: CrawlerOptions = {
  url: 'https://www.baidu.com',
  rules: undefined as unknown as Rules,
};

test('results empty', () =>
  crawl(resultsEmptyOptions).then((res) => {
    expect(res.data).toEqual({});
  }));
