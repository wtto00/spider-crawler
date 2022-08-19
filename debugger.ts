import type { CrawlerOptions } from './src/types';
import { crawl } from './src/index';
const illegalMethodOptions: CrawlerOptions = {
  url: 'https://www.baidu.com',
  rules: {
    test: {
      selector: '.cp-feedback',
      // just test error
      handlers: [{ method: 'aaa' as any }],
    },
  },
};

crawl(illegalMethodOptions).then((res) => {
  console.log(res);
});
