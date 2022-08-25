import type { CrawlerOptions, Rules } from '../src/types';
import { crawl } from '../src/index.js';
import { ResultCodes } from '../src/result.js';

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

const illegalMethodOptions: CrawlerOptions = {
  url: 'https://www.baidu.com',
  rules: {
    test: {
      selector: 'noscript',
      // just test error
      handlers: [{ method: 'aaa' as any }],
    },
  },
};

test("method doesn't exist", () =>
  crawl(illegalMethodOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.ILLEGALMETHOD);
  }));
