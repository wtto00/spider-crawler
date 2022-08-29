import type { CrawlerJsonOptions } from './src/types.js';
import { crawlFromJson } from './src/index.js';

const jsonOptions: CrawlerJsonOptions = {
  json: JSON.stringify({}),
  rules: {
    // pickUndefined: {
    //   selector: 'a.b',
    // },
    // selectorEmpty: {
    //   selector: '',
    // },
    quotePick: {
      selector: "a['\nb']",
    },
  },
};

crawlFromJson(jsonOptions);
// .then((res) => {
//   console.log(JSON.stringify(res));
// });
