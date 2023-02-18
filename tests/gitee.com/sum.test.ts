import { crawlFromUrl, CrawlerUrlOptions, ResultCodes } from '../../src/index.js';

const options: CrawlerUrlOptions = {
  url: 'https://gitee.com/wtto00/badge-test/issues',
  rules: {
    total: {
      selector: '#git-issues-filters a.item div.label',
      handlers: [{ method: 'each', args: [[{ method: 'text' }, { method: 'number' }]] }, { method: 'sum' }],
    },
  },
};

test('for & sum', () => {
  return crawlFromUrl(options).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect(res.data['total']).toBe(12);
  });
});
