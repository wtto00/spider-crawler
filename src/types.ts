import type { AnyNode, Cheerio, Element } from 'cheerio';
import type { RequestInit } from 'node-fetch';

export type CEle = Cheerio<AnyNode>;

export abstract class CrawlerApi {
  abstract prefix(str: string): string;
  abstract substring(start: number, end?: number): string;
  abstract replace(searchValue: string, replaceValue: string): string;
  abstract trim(): string;
  abstract number(): number;
  abstract br2nl(): string;
  abstract sum(): number;
  abstract resolveUrl(): string;
  abstract decode(): string;

  abstract attr(name?: string): string | Record<string, string>;
  abstract find(selector: string): Cheerio<Element>;
  abstract eq(index: number): Cheerio<AnyNode>;
  abstract text(): string;
  abstract html(): string | null;
  abstract map(rules: Rules): any[];
  abstract each(handers: Handler[]): any[];
}

type Method =
  | 'prefix'
  | 'substring'
  | 'replace'
  | 'trim'
  | 'number'
  | 'br2nl'
  | 'sum'
  | 'resolveUrl'
  | 'decode'
  | 'attr'
  | 'find'
  | 'eq'
  | 'text'
  | 'html'
  | 'map'
  | 'each';

export interface HandlerType<T extends Method> {
  method: T;
  args?: Parameters<CrawlerApi[T]>;
}
type AllMethods = {
  [K in Method]: HandlerType<K>;
};

export type Handler = AllMethods[Method];

export interface Rule {
  selector?: string;
  dataType?: 'html' | 'json';
  handlers?: Handler[];
}

export type Rules = Record<string, Rule>;

export interface CrawlerJsonOptions {
  json: string;
  rules: Rules;
}
export interface CrawlerHtmlOptions {
  baseUrl?: string;
  html: string;
  rules: Rules;
}

export interface CrawlerUrlOptions {
  url: string;
  fetchOptions?: RequestInit;
  dataType?: 'html' | 'json';
  rules: Rules;
}
