import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import type { ResultsHandler, ResultsMapHandler } from '../types';
import * as apis from './apis';

export function handleCheerio(
  results: ResultsHandler | ResultsMapHandler,
  $: CheerioAPI,
  cheerioNode?: Cheerio<AnyNode>,
) {
  const result: Record<string, any> = {};

  Object.keys(results).forEach((resultKey) => {
    const resultHandler = results[resultKey];
    let res: any = cheerioNode;
    if ('selector' in resultHandler) {
      res = $(resultHandler.selector);
    }

    resultHandler.handlers.forEach((handler) => {
      if (handler.method in apis) {
        if ('results' in handler) {
          res = apis[handler.method](res, $, handler.results);
        } else {
          res = apis[handler.method](res, $, 'args' in handler ? handler.args : []);
        }
      }
    });

    result[resultKey] = res;
  });

  return result;
}

function handleResult(html: string, results: ResultsHandler) {
  const result: Record<string, any> = {};

  if (!html || !results) return result;

  const $ = load(html);

  return handleCheerio(results, $);
}

export default handleResult;
