import type { CrawlerOptions } from '../src/types';
import { crawl } from '../src/index.js';
import { ResultCodes } from '../src/result.js';

const prefixOptions: CrawlerOptions = {
  url: 'https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest',
  rules: {
    emptyStr: {
      selector: '.versionHistoryTab-loader-container',
      handlers: [{ method: 'text' }, { method: 'prefix', args: ['prefix'] }, { method: 'prefix', args: [''] }],
    },
    installers: {
      selector: '.installs-text',
      handlers: [
        { method: 'text' },
        { method: 'trim' },
        { method: 'substring', args: [0, -9] },
        { method: 'replace', args: [',', ''] },
        { method: 'number' },
      ],
    },
  },
};

test('prefix substring replace number', () =>
  crawl(prefixOptions).then((res) => {
    expect(res.code).toBe(ResultCodes.SUCCESS);
    expect(res.data['emptyStr']).toBe('prefix');
    expect(res.data['installers']).toBeGreaterThan(0);
  }));
