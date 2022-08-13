import type { CrawlerOptions } from '../../src/types';
import { crawl } from '../../src/index';
import { ResultCodes } from '../../src/utils/result';

const config: CrawlerOptions = {
  url: 'https://www.bswtan.com/modules/article/search.php',
  options: {
    method: 'POST',
    body: 'searchkey=灵境',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  },
  results: {
    list: {
      selector: '#main>.grid>tbody>tr:nth-child(n+2)',
      handlers: [
        {
          method: 'map',
          results: {
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
        },
      ],
    },
  },
};

test('search right', () =>
  crawl(config).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect([...res.data['list']].length).toBeGreaterThan(0);
  }));

const emptyOptions: CrawlerOptions = {
  ...config,
  options: {
    method: 'POST',
    body: 'searchkey=1231232131',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  },
};

test('search empty', () =>
  crawl(emptyOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.EMPTY);
  }));
