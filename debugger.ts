import type { CrawlerOptions } from './src/types.js';
import { crawl } from './src/index.js';

const options: CrawlerOptions = {
  url: 'https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest',
  rules: {
    name: {
      selector: '.ux-item-name',
      handlers: [{ method: 'text' }, { method: 'trim' }],
    },
    author: {
      selector: '.ux-item-publisher',
      handlers: [{ method: 'text' }, { method: 'trim' }],
    },
    installs: {
      selector: '.installs-text',
      handlers: [
        { method: 'text' },
        { method: 'substring', args: [0, -9] },
        { method: 'trim' },
        { method: 'replace', args: [',', ''] },
        { method: 'number' },
      ],
    },
    tags: {
      selector: '.meta-data-list-link',
      handlers: [
        {
          method: 'map',
          args: [
            {
              text: { handlers: [{ method: 'text' }] },
              link: { handlers: [{ method: 'attr', args: ['href'] }, { method: 'resolveUrl' }] },
            },
          ],
        },
      ],
    },
  },
};

crawl(options).then((res) => {
  console.log(JSON.stringify(res));
});
