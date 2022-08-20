import type { AnyNode, Cheerio, CheerioAPI } from 'cheerio';
import type { Rules } from './types';
import { CrawlerError, ErrorCode } from './result';

type CEle = Cheerio<AnyNode>;

export default class Api {
  private url: string;

  private $: CheerioAPI;

  private source: any;

  results: Record<string, any> = {};

  constructor(url: string, rules: Rules, $: CheerioAPI, cheerioNode?: CEle) {
    this.url = url;
    this.$ = $;

    // 开始根据规则 解析
    Object.keys(rules).forEach((key) => {
      const rule = rules[key];
      this.source = cheerioNode || $;

      // Rules
      if ('selector' in rule) {
        this.source = $(rule.selector);
        if (this.source.length === 0) {
          this.results[key] = null;
          return;
        }
      }

      // Handlers
      rule.handlers.forEach((handler) => {
        if (handler.method in Object.getPrototypeOf(this)) {
          if ('args' in handler) {
            this.source = this[handler.method](...(handler.args as unknown as [never, never]));
          } else {
            this.source = this[handler.method]();
          }
        } else {
          throw new CrawlerError(ErrorCode.ILLEGALMETHOD, { method: handler.method });
        }
      });

      this.results[key] = this.source;
    });
  }

  /**
   * 开头添加字符串
   * @param str 要添加的字符串
   * @returns
   */
  prefix(str: string) {
    return `${str || ''}${this.source as string}`;
  }

  /**
   * 对字符串结果进行截取
   * @param start 开始截取位置
   * @param end 结束截取位置
   * @returns
   */
  substring(start: number, end?: number) {
    let endIndex = end ?? this.source.length;
    if (endIndex < 0) endIndex = this.source.length + endIndex;
    return (this.source as string).substring(start, endIndex);
  }

  /**
   * 字符串全局替换
   * @param searchValue 将要被替换的文本
   * @param replaceValue 替换为
   * @returns
   */
  replace(searchValue: string, replaceValue: string) {
    const search = new RegExp(searchValue, 'g');
    return (this.source as string).replace(search, replaceValue);
  }

  /**
   * 去除开头与结尾的空格
   * @returns
   */
  trim() {
    return (this.source as string).trim();
  }

  /**
   * 获得的路径与当前请求地址相混合
   * @returns
   */
  resolveUrl() {
    return new URL(this.source as string, this.url).href;
  }

  /**
   * 把字符串转为数字
   * @returns
   */
  number() {
    return Number(this.source as string);
  }

  /**
   * 把html中的br替换成文本换行符
   * 匹配<br />,<br/><br >,<br>以及其中的空格以及\n换行符
   * @returns
   */
  br2nl() {
    return (this.source as string).replace(/(<br\s?\/?>|\n)+((\s+\n+)|(\s+<br\s?\/?>+)|\n+|<br\s?\/?>+)*/gi, '\n\n');
  }

  /**
   * HTML entities decode
   * html字符串反序列化到正常的阅读文本
   * @returns
   */
  decode() {
    return this.$('<div />')
      .html(this.source as string)
      .text();
  }

  /**
   * 获取属性的方法。
   * 在匹配集合中只能获取的第一个元素的属性值。
   * @param name 属性名称
   */
  attr(): Record<string, string>;
  attr(name: string): string;
  attr(name?: string): string | Record<string, string> {
    if (name) return (this.source as CEle).attr(name) || '';
    return (this.source as CEle).attr() || {};
  }

  /**
   * 通过选择器、jQuery对象或元素来过滤，获取每个匹配元素的后代。
   * @param selector 选择器
   * @returns
   */
  find(selector: string) {
    return (this.source as CEle).find(selector || '');
  }

  /**
   * 根据索引来确定元素。使用 .eq(-i) 的则是倒过来计数。
   * @param index 元素所在索引
   * @returns
   */
  eq(index: number) {
    return (this.source as CEle).eq(index);
  }

  /**
   * 获取元素集合中的每个元素的合并文本内容，包括它们的后代
   * @returns
   */
  text() {
    return (this.source as CEle).text();
  }

  /**
   * 获取第一个选中元素的HTML内容字符串
   * @returns
   */
  html() {
    return (this.source as CEle).html();
  }

  /**
   * 通过每个在匹配函数产生的匹配集合中的匹配元素，产生一个新的包含返回值的cheerio对象。
   * 该函数可以返回一个单独的数据项或一组数据项被插入到所得到的集合中。
   * 如果返回一个数组，数组中的元素插入到集合中。
   * 如果函数返回空或未定义，则将插入任何元素。
   * @param rules map循环的内部规则
   * @returns
   */
  map(rules: Rules) {
    return (this.source as CEle).map((_: number, eleItem: AnyNode) => {
      const api = new Api(this.url, rules, this.$, this.$(eleItem));
      return api.results;
    });
  }
}
