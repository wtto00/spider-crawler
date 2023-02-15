import { Api } from './api.js';
import type { CrawlerHtmlOptions, CrawlerJsonOptions, CrawlerUrlOptions } from './types';
import request from './request.js';
import { CrawlerError, CrawlerResult, ErrorCode } from './result.js';

function catchError(error: Error) {
  if (error instanceof CrawlerError) {
    return new CrawlerResult(error);
  }
  return new CrawlerResult(new CrawlerError(ErrorCode.UNKNOWN));
}

export function crawlFromHtml(options: CrawlerHtmlOptions) {
  try {
    const { html, baseUrl = '', rules } = options;

    if (!html) throw new CrawlerError(ErrorCode.EMPTY);

    const api = new Api({ url: baseUrl, rules, source: html });

    return new CrawlerResult(api.results);
  } catch (error) {
    return catchError(error as Error);
  }
}

export function crawlFromJson(options: CrawlerJsonOptions) {
  try {
    const { json, rules } = options;

    if (!json) throw new CrawlerError(ErrorCode.EMPTY);

    const api = new Api({ source: json, rules, dataType: 'json' });

    return new CrawlerResult(api.results);
  } catch (error) {
    return catchError(error as Error);
  }
}

export async function crawlFromUrl(options: CrawlerUrlOptions): Promise<CrawlerResult> {
  try {
    const { url, fetchOptions } = options;

    if (!url) throw new CrawlerError(ErrorCode.MISSURL);
    if (!options.rules) throw new CrawlerError(ErrorCode.MISSRULES);

    const content = await request(url, fetchOptions);

    if ('dataType' in options && options.dataType === 'json') {
      return crawlFromJson({ json: content, rules: options.rules });
    }

    return crawlFromHtml({ html: content, baseUrl: url, rules: options.rules });
  } catch (error) {
    return catchError(error as Error);
  }
}
