import type { RequestInit } from 'node-fetch';
import type { CheerioApi, CrawlerApi } from './api';

type Apis = CheerioApi & CrawlerApi;
export type Method = keyof Apis;

type AllMethods = {
  [K in Method]: Parameters<Apis[K]> extends [] ? EmprtyHandlerType<K> : HandlerType<K>;
};
interface EmprtyHandlerType<T extends Method> {
  method: T;
}
interface HandlerType<T extends Method> {
  method: T;
  args: Parameters<Apis[T]>;
}
export type Handler = AllMethods[Method];

export interface Rule {
  selector?: string;
  handlers: Handler[];
}

export type Rules = Record<string, Rule>;
// ----- url -----
interface DataTypeRules {
  html: Rules;
  json: JsonRules;
}
export type CrawlDataType = keyof DataTypeRules;
interface CrawlerUrlBaseOptions {
  url: string;
  fetchOptions?: RequestInit;
}
export interface CrawlerOptionsType<T extends CrawlDataType> extends CrawlerUrlBaseOptions {
  dataType: T;
  rules: DataTypeRules[T];
}
type AllCrawlerOptions = {
  [K in CrawlDataType]: CrawlerOptionsType<K>;
};
export interface CrawlerUrlNoDataTypeOptions extends CrawlerUrlBaseOptions {
  rules: Rules;
}
export type CrawlerUrlOptions = AllCrawlerOptions[CrawlDataType] | CrawlerUrlNoDataTypeOptions;

// ----- html -----
export interface CrawlerHtmlOptions {
  baseUrl?: string;
  html: string;
  rules: Rules;
}

// ----- json -----
export type JsonMethod = keyof CrawlerApi;
type AllJsonMethods = {
  [K in JsonMethod]: Parameters<Apis[K]> extends [] ? EmprtyHandlerType<K> : HandlerType<K>;
};
export type JsonHandler = AllJsonMethods[JsonMethod];
export interface JsonRule {
  selector: string;
  handlers?: JsonHandler[];
}
export type JsonRules = Record<string, JsonRule>;
export interface CrawlerJsonOptions {
  json: string;
  rules: JsonRules;
}
