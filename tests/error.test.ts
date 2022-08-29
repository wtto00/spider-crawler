import type { Rules } from '../src/types';
import { crawlFromUrl, crawlFromHtml, crawlFromJson } from '../src/index.js';
import { ResultCodes } from '../src/result.js';

test('request error', () =>
  crawlFromUrl({
    url: 'asdasda.dfadf',
    rules: {},
  }).then((res) => {
    expect(res.code).toBe(ResultCodes.UNKNOWN);
  }));

test('empty url', () =>
  crawlFromUrl({ url: '', rules: {} }).then((res) => {
    expect(res.code).toBe(ResultCodes.MISSURL);
  }));

test('rules empty', () =>
  crawlFromUrl({
    url: 'https://www.baidu.com',
    rules: undefined as unknown as Rules,
  }).then((res) => {
    expect(res.data).toEqual({});
  }));

test("method doesn't exist", () =>
  crawlFromUrl({
    url: 'https://www.baidu.com',
    rules: {
      test: {
        selector: 'noscript',
        // just test error
        handlers: [{ method: 'aaa' as any }],
      },
    },
  }).then((res) => {
    expect(res.code).toBe(ResultCodes.ILLEGALMETHOD);
  }));

test('empty html', () => {
  const res = crawlFromHtml({ html: '', rules: {} });
  expect(res.code).toBe(ResultCodes.EMPTY);
});

test('empty json', () => {
  const res = crawlFromJson({ json: '', rules: {} });
  expect(res.code).toBe(ResultCodes.EMPTY);
});

test('illegal json', () => {
  const res = crawlFromJson({ json: '[12', rules: {} });
  expect(res.code).toBe(ResultCodes.ILLEGALJSON);
});

test('illegal json method', () => {
  const res = crawlFromJson({
    json: '{"test":1}',
    rules: { test: { selector: 'test', handlers: [{ method: 'errorMethod' as any }] } },
  });
  expect(res.code).toBe(ResultCodes.ILLEGALMETHOD);
});
