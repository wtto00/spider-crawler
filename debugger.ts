import { crawlFromUrl, CrawlerUrlOptions } from './src/index.js';

const options: CrawlerUrlOptions = {
  url: 'https://gitee.com/wtto00/badge-test/issues',
  rules: {
    total: {
      selector: '#git-issues-filters a.item div.label',
      handlers: [{ method: 'each', args: [[{ method: 'number' }]] }, { method: 'sum' }],
    },
  },
};

crawlFromUrl(options).then((res) => {
  console.log(res.data);
});
