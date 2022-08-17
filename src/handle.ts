import type { AnyNode, Cheerio, CheerioAPI } from 'cheerio';

export default class Handle {
  $: CheerioAPI;

  result: any;

  constructor($: CheerioAPI, cheerioNode?: Cheerio<AnyNode>) {
    this.$ = $;
    this.result = cheerioNode;
  }

  prefix() {}
}
