import { formatString } from './util.js';

export enum ErrorCode {
  /** 未知的结果 */
  UNKNOWN = 100,
  /** 空结果 */
  EMPTY = 101,
  /** 非法的method */
  ILLEGALMETHOD = 102,
  /** 缺失url */
  MISSURL = 103,
  /** 缺失爬取规则 */
  MISSRULES = 104,
  /** 非法的JSON数据 */
  ILLEGALJSON = 105,
}
export enum SuccessCode {
  SUCCESS = 0,
}
const errors: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN]: '出错了',
  [ErrorCode.EMPTY]: '未查到结果',
  [ErrorCode.ILLEGALMETHOD]: '非法的解析方法:${method}',
  [ErrorCode.MISSURL]: '缺失请求url',
  [ErrorCode.MISSRULES]: '缺失爬取规则',
  [ErrorCode.ILLEGALJSON]: '非法的JSON数据',
};

export class CrawlerError extends Error {
  code: ErrorCode;

  constructor(errorType: ErrorCode, values?: string | Record<string, any>) {
    let message = errors[errorType];
    if (values) {
      if (typeof values === 'string') message = values;
      else message = formatString(message, values);
    }
    super(message || errors[ErrorCode.UNKNOWN]);
    this.code = errorType;
  }
}

export const ResultCodes = { ...ErrorCode, ...SuccessCode };

export class CrawlerResult {
  code: ErrorCode | SuccessCode;

  message: string;

  data: Record<string, any>;

  constructor(option: Record<string, any> | CrawlerError) {
    if (option instanceof CrawlerError) {
      this.code = option.code;
      this.message = option.message;
      this.data = {};
    } else {
      this.code = ResultCodes.SUCCESS;
      this.message = 'success';
      this.data = option;
    }
  }
}
