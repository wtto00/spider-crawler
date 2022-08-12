import type { AnyNode, Cheerio, CheerioAPI } from 'cheerio';
import type { ResultsMapHandler } from '../types';
import { handleCheerio } from './handle';

export function prefix(res: string, _$: CheerioAPI, args: any[]) {
  return `${args[0] || ''}${res || ''}`;
}
export function suffix(res: string, _$: CheerioAPI, args: any[]) {
  return `${res || ''}${args[0] || ''}`;
}
export function trim(res: string, _$: CheerioAPI, _args: any) {
  return res.trim();
}

export function attr(ele: Cheerio<AnyNode>, _$: CheerioAPI, args: []) {
  return ele.attr(...args);
}

export function find(ele: Cheerio<AnyNode>, _$: CheerioAPI, args: []) {
  return ele.find(...args);
}
export function text(ele: Cheerio<AnyNode>, _$: CheerioAPI, _args: any) {
  return ele.text();
}

/**
 * cheerio-map
 * https://github.com/cheeriojs/cheerio/wiki/Chinese-README#map-functionindex-element--1
 * @param ele 节点
 * @param $ CheerioAPI
 * @param results 规则
 * @returns
 */
export function map(ele: Cheerio<AnyNode>, $: CheerioAPI, results: ResultsMapHandler) {
  return ele.map((_, eleItem) => {
    return handleCheerio(results, $, $(eleItem));
  });
}
