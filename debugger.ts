import { crawlFromUrl, CrawlerUrlOptions } from './src/index.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const options: CrawlerUrlOptions = {
  url: 'https://www.bswtan.com/modules/article/search.php',
  fetchOptions: {
    method: 'POST',
    body: 'searchkey=灵境',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Host: 'www.biqukun.com' },
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
        {
          method: 'find',
          args: ['name', '灵境行者'],
        },
      ],
    },
  },
};

crawlFromUrl(options).then((res) => {
  console.log(JSON.stringify(res.data));
});
