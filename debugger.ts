import type { CrawlerOptions } from './src/types';
import { crawl } from './src/index';

const searchOptions: CrawlerOptions = {
  url: 'https://www.bswtan.com/7/7657/4846088.html',
  rules: {
    title: {
      selector: '.bookname>h1',
      handlers: [{ method: 'text' }],
    },
    previousChapter: {
      selector: '.bottem1>a',
      handlers: [{ method: 'eq', args: [1] }, { method: 'attr', args: ['href'] }, { method: 'resolveUrl' }],
    },
    nextChapter: {
      selector: '.bottem1>a',
      handlers: [{ method: 'eq', args: [3] }, { method: 'attr', args: ['href'] }, { method: 'resolveUrl' }],
    },
    content: {
      selector: '#content',
      handlers: [{ method: 'html' }, { method: 'br2nl' }, { method: 'text' }, { method: 'trim' }],
    },
  },
};

crawl(searchOptions).then((res) => {
  console.log({ ...res });
});
