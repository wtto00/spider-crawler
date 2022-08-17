import type { RequestInit } from 'node-fetch';
import type Api from './api';

export type Method = Exclude<keyof Api, 'results'>;

type AllMethods = {
  [K in Method]: Parameters<Api[K]> extends [] ? EmprtyHandlerType<K> : HandlerType<K>;
};
interface EmprtyHandlerType<T extends Method> {
  method: T;
}
interface HandlerType<T extends Method> {
  method: T;
  args: Parameters<Api[T]>;
}
export type Handler = AllMethods[Method];

export interface Rule {
  selector?: string;
  handlers: Handler[];
}

export type Rules = Record<string, Rule>;
export interface CrawlerOptions {
  url: string;
  options?: RequestInit;
  rules: Rules;
}
