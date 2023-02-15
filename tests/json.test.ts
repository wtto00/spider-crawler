import { CrawlerJsonOptions, CrawlerUrlOptions, crawlFromJson, crawlFromUrl, ResultCodes } from '../src/index.js';

const options: CrawlerUrlOptions = {
  dataType: 'json',
  url: 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
  fetchOptions: {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json;api-version=7.1-preview.1;excludeUrls=true',
    },
    body: JSON.stringify({
      assetTypes: null,
      filters: [
        {
          criteria: [{ filterType: 7, value: 'Orta.vscode-jest' }],
          direction: 2,
          pageSize: 100,
          pageNumber: 1,
          sortBy: 0,
          sortOrder: 0,
          pagingToken: null,
        },
      ],
      flags: 2151,
    }),
  },
  rules: {
    tags: {
      selector: 'results[0].extensions[0].tags',
    },
  },
};

test('json crawler', () =>
  crawlFromUrl(options).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect(res.data['tags'].length).toBeGreaterThan(1);
  }));

const jsonData = { test: '1', a: { c: 'e' } };

const jsonOptions: CrawlerJsonOptions = {
  json: JSON.stringify(jsonData),
  rules: {
    pickUndefined: {
      selector: 'a.b',
    },
    selectorEmpty: {
      selector: '',
    },
    quotePick: {
      selector: 'a["c"]',
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
  expect(res.data['selectorEmpty']).toEqual(jsonData);
  expect(res.data['quotePick']).toBe('e');
  expect(res.data['handlers']).toBe(1);
  expect(res.data['methodArgs']).toBe('21');
});
