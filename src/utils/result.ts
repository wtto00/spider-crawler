export enum ErrorCode {
  /** 未知的结果 */
  UNKNOWN = 100,
  /** 空结果 */
  EMPTY = 101,
}
export enum SuccessCode {
  SUCCESS = 0,
}
const errors: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN]: '出错了',
  [ErrorCode.EMPTY]: '未查到结果',
};

export class CrawlerError extends Error {
  code: ErrorCode;

  constructor(errorType: ErrorCode) {
    super(errors[errorType]);
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
