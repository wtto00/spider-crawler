import { crawl, CrawlerOptions, ResultCodes } from '../../src';

const options: CrawlerOptions = {
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
      handlers: [{ method: 'html' }, { method: 'br2nl' }, { method: 'decode' }, { method: 'trim' }],
    },
  },
};

test('book content', () => {
  return crawl(options).then((res) => {
    console.log(res.data);

    expect(res.code).toBe(ResultCodes.SUCCESS);
  });
});
