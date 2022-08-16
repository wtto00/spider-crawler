import { crawl } from '../../src';
import type { CrawlerOptions } from '../../src/types';
import { ResultCodes } from '../../src/utils/result';

const detaliOptions: CrawlerOptions = {
  url: 'https://www.bswtan.com/7/7657/',
  results: {
    name: {
      selector: "meta[property='og:novel:book_name']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    author: {
      selector: "meta[property='og:novel:author']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    category: {
      selector: "meta[property='og:novel:category']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    cover: {
      selector: "meta[property='og:image']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    description: {
      selector: "meta[property='og:description']",
      handlers: [{ method: 'attr', args: ['content'] }, { method: 'trim' }],
    },
    readUrl: {
      selector: "meta[property='og:novel:read_url']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    status: {
      selector: "meta[property='og:novel:status']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    authorLink: {
      selector: "meta[property='og:novel:author_link']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    updateTime: {
      selector: "meta[property='og:novel:update_time']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    latestChapterName: {
      selector: "meta[property='og:novel:latest_chapter_name']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    latestChapterUrl: {
      selector: "meta[property='og:novel:latest_chapter_url']",
      handlers: [{ method: 'attr', args: ['content'] }],
    },
    chapters: {
      selector: '#list>dl>dd>a',
      handlers: [
        {
          method: 'map',
          results: {
            title: { handlers: [{ method: 'text' }] },
            chapterUrl: {
              handlers: [
                { method: 'attr', args: ['href'] },
                { method: 'prefix', args: ['https://www.bswtan.com/7/7657/'] },
              ],
            },
          },
        },
      ],
    },
    recommends: {
      selector: '#listtj>a',
      handlers: [
        {
          method: 'map',
          results: {
            name: { handlers: [{ method: 'text' }] },
            readUrl: {
              handlers: [
                { method: 'attr', args: ['href'] },
                { method: 'prefix', args: ['https://www.bswtan.com'] },
              ],
            },
          },
        },
      ],
    },
    newBooksRecommend: {
      selector: '#footer>.footer_link>a',
      handlers: [
        {
          method: 'map',
          results: {
            name: { handlers: [{ method: 'text' }] },
            readUrl: {
              handlers: [
                { method: 'attr', args: ['href'] },
                { method: 'prefix', args: ['https://www.bswtan.com'] },
              ],
            },
          },
        },
      ],
    },
  },
};

test('book detail', () =>
  crawl(detaliOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);

    expect(res.data['name']).toEqual('夜的命名术');
    expect(res.data['author']).toEqual('会说话的肘子');
    expect(res.data['category']).toEqual('玄幻小说');
    expect(res.data['cover']).toEqual('https://www.bswtan.com/d/image/7/7657/7657s.jpg');
    expect(res.data['description'].length).toBeGreaterThan(0);
    expect(res.data['readUrl']).toEqual('https://www.bswtan.com/7/7657/');
    expect(res.data['status']).toEqual('连载中');
    expect(res.data['authorLink']).toEqual('https://www.bswtan.com/modules/article/search.php?searchkey=会说话的肘子');
    expect(res.data['updateTime']).toHaveLength(19);
    expect(res.data['latestChapterName'].length).toBeGreaterThan(0);
    expect(res.data['latestChapterUrl'].length).toBeGreaterThan(0);
    expect(res.data['chapters'].length).toBeGreaterThan(0);
    expect(res.data['recommends'].length).toBeGreaterThan(0);
    expect(res.data['newBooksRecommend'].length).toBeGreaterThan(0);
  }));
