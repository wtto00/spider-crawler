import type { RequestInit } from 'node-fetch';
import type { CrawlerResultCode } from './utils/enum';

interface HandlerMethods {
  attr: (name: string) => string;
  // prop: (name: string) => string;
  // data: (data?: string) => string;
  // val: () => string;
  find: (selector: string) => [];
  text: () => string;
  trim: () => string;
  prefix: (prefix: string) => string;
}

export type HandlerMethodKeys = keyof HandlerMethods;

interface SelectorEmptyArgsHandlerType<T extends HandlerMethodKeys> {
  method: T;
}
interface SelectorArgsHandlerType<T extends HandlerMethodKeys> {
  method: T;
  args: Parameters<HandlerMethods[T]>;
}
type AllSelectorArgsHandler = {
  [K in HandlerMethodKeys]: Parameters<HandlerMethods[K]> extends []
    ? SelectorEmptyArgsHandlerType<K>
    : SelectorArgsHandlerType<K>;
};
export type SelectorArgsHandler = AllSelectorArgsHandler[HandlerMethodKeys];

export interface ResultMapHandler {
  handlers: SelectorHandler[];
}
export type ResultsMapHandler = Record<string, ResultMapHandler[]>;
export interface SelectorMapHandler {
  method: 'map';
  results: ResultsMapHandler;
}

export type SelectorHandler = SelectorMapHandler | SelectorArgsHandler;

export interface ResultHandler {
  selector: string;
  handlers: SelectorHandler[];
}

export type ResultsHandler = Record<string, ResultHandler[]>;
export interface CrawlerOptions {
  url: string;
  options?: RequestInit;
  results: ResultsHandler;
}

export interface CrawlerResult {
  // 是否结果正确
  code: CrawlerResultCode;
  // 信息说明
  message: string;
  // 结果信息
  data: Record<string, never>;
}
