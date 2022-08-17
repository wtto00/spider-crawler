import type { CrawlerOptions } from '../src/types';
import { crawl } from '../src/index';
import { ResultCodes } from '../src/result';

const prefixOptions: CrawlerOptions = {
  url: 'https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest',
  rules: {
    emptyStr: {
      selector: '.versionHistoryTab-loader-container',
      handlers: [{ method: 'text' }, { method: 'prefix', args: ['prefix'] }, { method: 'prefix', args: [''] }],
    },
  },
};

test('prefix', () =>
  crawl(prefixOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect(res.data['emptyStr']).toBe('prefix');
  }));
