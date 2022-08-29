import type { CrawlerJsonOptions, CrawlerUrlOptions } from '../src/types';
import { crawlFromJson, crawlFromUrl } from '../src/index.js';
import { ResultCodes } from '../src/result.js';

const prefixOptions: CrawlerUrlOptions = {
  url: 'https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest',
  rules: {
    emptyStr: {
      selector: '.versionHistoryTab-loader-container',
      handlers: [{ method: 'text' }, { method: 'prefix', args: ['prefix'] }, { method: 'prefix', args: [''] }],
    },
    installers: {
      selector: '.installs-text',
      handlers: [
        { method: 'text' },
        { method: 'trim' },
        { method: 'substring', args: [0, -9] },
        { method: 'replace', args: [',', ''] },
        { method: 'number' },
      ],
    },
  },
};

test('prefix substring replace number', () =>
  crawlFromUrl(prefixOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect(res.data['emptyStr']).toBe('prefix');
    expect(res.data['installers']).toBeGreaterThan(0);
  }));

const jsonOptions: CrawlerJsonOptions = {
  json: JSON.stringify({ test: '1' }),
  rules: {
    pickUndefined: {
      selector: 'a.b',
    },
    selectorEmpty: {
      selector: '',
    },
    quotePick: {
      selector: 'a["b"]',
    },
    handlers: {
      selector: 'test',
      handlers: [{ method: 'number' }],
    },
    methodArgs: {
      selector: 'test',
      handlers: [{ method: 'prefix', args: ['2'] }],
    },
  },
};

test('json coverage', () => {
  const res = crawlFromJson(jsonOptions);

  expect(res.code).toBe(ResultCodes.SUCCESS);
  expect(res.data['pickUndefined']).toBe(undefined);
  expect(res.data['selectorEmpty']).toEqual({ test: '1' });
  expect(res.data['handlers']).toBe(1);
});
