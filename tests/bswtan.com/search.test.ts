import type { CrawlerUrlOptions } from '../../src/types';
import { crawlFromUrl } from '../../src/index.js';
import { ResultCodes } from '../../src/result.js';

const searchOptions: CrawlerUrlOptions = {
  url: 'https://www.bswtan.com/modules/article/search.php',
  fetchOptions: {
    method: 'POST',
    body: 'searchkey=灵境',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  },
  rules: {
    list: {
      selector: '#main>.grid>tbody>tr:nth-child(n+2)',
      handlers: [
        {
          method: 'map',
          args: [
            {
              name: {
                handlers: [{ method: 'find', args: ['td:nth-child(1)'] }, { method: 'text' }, { method: 'trim' }],
              },
              bookUrl: {
                handlers: [
                  { method: 'find', args: ['td:nth-child(1)>a'] },
                  { method: 'attr', args: ['href'] },
                  { method: 'prefix', args: ['https://www.bswtan.com'] },
                ],
              },
              latestChapterName: {
                handlers: [{ method: 'find', args: ['td:nth-child(2)'] }, { method: 'text' }, { method: 'trim' }],
              },
              latestChapterUrl: {
                handlers: [
                  { method: 'find', args: ['td:nth-child(2)>span>a'] },
                  { method: 'attr', args: ['href'] },
                  { method: 'prefix', args: ['https://www.bswtan.com'] },
                ],
              },
              author: {
                handlers: [{ method: 'find', args: ['td:nth-child(3)'] }, { method: 'text' }, { method: 'trim' }],
              },
              updateTime: {
                handlers: [{ method: 'find', args: ['td:nth-child(4)'] }, { method: 'text' }, { method: 'trim' }],
              },
            },
          ],
        },
      ],
    },
  },
};

test('search books', () =>
  crawlFromUrl(searchOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect([...res.data['list']].length).toBeGreaterThan(0);
  }));

const emptyOptions: CrawlerUrlOptions = {
  ...searchOptions,
  fetchOptions: {
    method: 'POST',
    body: 'searchkey=1231232131',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  },
};

test('search books empty', () =>
  crawlFromUrl(emptyOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect(res.data['list']).toBe(null);
  }));
