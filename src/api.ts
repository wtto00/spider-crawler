import type { AnyNode, Cheerio, CheerioAPI } from 'cheerio';
import type { Rules } from './types';
import { CrawlerError, ErrorCode } from './result';

type CEle = Cheerio<AnyNode>;

export default class Api {
  private $: CheerioAPI;

  private source: any;

  results: Record<string, any> = {};

  private variableSource: any;

  constructor(rules: Rules, $: CheerioAPI, cheerioNode?: CEle) {
    this.$ = $;
    this.source = cheerioNode;

    // 开始根据规则 解析
    Object.keys(rules).forEach((key) => {
      const rule = rules[key];
      this.variableSource = cheerioNode;

      // Rules
      if ('selector' in rule) {
        this.variableSource = $(rule.selector);
        if (this.variableSource.length === 0) {
          throw new CrawlerError(ErrorCode.EMPTY);
        }
        if (!this.source) {
          this.source = $(rule.selector);
        }
      }

      // Handlers
      rule.handlers.forEach((handler) => {
        if (handler.method in Object.getPrototypeOf(this)) {
          if ('args' in handler) {
            this.variableSource = this[handler.method](...(handler.args as unknown as [any]));
          } else {
            this.variableSource = this[handler.method]();
          }
        } else {
          throw new CrawlerError(ErrorCode.ILLEGALMETHOD, { method: handler.method });
        }
      });

      this.results[key] = this.variableSource;
    });
  }

  /**
   * 开头添加字符串
   * @param str 要添加的字符串
   * @returns
   */
  prefix(str: string) {
    return `${str || ''}${this.variableSource as string}`;
  }

  /**
   * 去除开头与结尾的空格
   * @returns
   */
  trim() {
    return (this.variableSource as string).trim();
  }

  /**
   * 读取html某个元素的某个属性的值
   * 空参数则读取全部属性的值
   */
  attr(): Record<string, string>;
  attr(name: string): string;
  attr(name?: string): string | Record<string, string> {
    if (name) return (this.variableSource as CEle).attr(name) || '';
    return (this.variableSource as CEle).attr() || {};
  }

  /**
   * 在某个元素下查找元素
   * @param selector 选择器
   * @returns
   */
  find(selector: string) {
    return (this.variableSource as CEle).find(selector || '');
  }

  /**
   * 获取元素的内部文本字符串
   * @returns
   */
  text() {
    return (this.variableSource as CEle).text();
  }

  /**
   * 多个元素的集合循环处理获得一组数据
   * @param rules map循环的内部规则
   * @returns
   */
  map(rules: Rules) {
    return (this.variableSource as CEle).map((_: number, eleItem: AnyNode) => {
      const api = new Api(rules, this.$, this.$(eleItem));
      return api.results;
    });
  }
}
