import type { CheerioAPI } from 'cheerio';

export function prefix(res: string, _: CheerioAPI, prefixStr: string) {
  return `${prefixStr || ''}${res || ''}`;
}

export function suffix(res: string, _: CheerioAPI, suffixStr: string) {
  return `${res || ''}${suffixStr || ''}`;
}
