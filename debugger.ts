import type { CrawlerOptions } from './src/types';
import { crawl } from './src/index';

const resultsEmptyOptions: CrawlerOptions = {
  url: 'https://www.baidu.com',
  results: undefined as unknown as CrawlerOptions['results'],
};

crawl(resultsEmptyOptions).then((res) => {
  console.log({ ...res });
});
