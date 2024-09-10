import type { Cheerio } from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import type { RequestInit } from 'node-fetch';

export type CEle = Cheerio<AnyNode>;

export type DataType = 'html' | 'json';

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
  abstract length(): number;

  abstract attr(name?: string): string | Record<string, string>;
  abstract find(selector: string, target?: string): Cheerio<Element> | object;
  abstract eq(index: number): Cheerio<AnyNode>;
  abstract text(): string;
  abstract html(): string | null;
  abstract map(rules: Rules): any[];
  abstract each(handers: Handler[]): any[];
}

type Method = keyof CrawlerApi;

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
  dataType?: DataType;
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
  dataType?: DataType;
  rules: Rules;
}
