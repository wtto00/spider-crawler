import { CheerioAPI, load } from 'cheerio';
import type { ResultsHandler, ResultsMapHandler } from '../types';

function handleCheerio(results: ResultsHandler | ResultsMapHandler, cheerioNode: CheerioAPI, $: CheerioAPI) {
  const result: Record<string, never> = {};
  // Object.entries(results).forEach(([resultKey, resultHandlers]) => {
  //   let res: never;
  //   resultHandlers.forEach((resultHandler) => {
  //     const { selector, handlers } = resultHandler;
  //   });
  //   result[resultKey] = res;
  // });

  return result;
}

function handleResult(html: string, results: ResultsHandler) {
  const result: Record<string, never> = {};

  if (!html || !results) return result;

  const $ = load(html);

  return handleCheerio(results, $, $);
}

export default handleResult;
