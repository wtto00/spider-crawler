import { AnyNode, CheerioAPI, load } from 'cheerio';
import { CrawlerError, ErrorCode } from './result.js';
import type { CEle, CrawlerApi, Handler, Rules } from './types.js';
import { pickObject } from './util.js';

interface CrawlerOptions {
  url?: string;
  rules: Rules;
  source: CEle | string;
  dataType?: 'html' | 'json';
  $?: CheerioAPI;
}

export class Api implements CrawlerApi {
  /**
   * 输入字符串：json或者html或者AnyNode
   */
  protected source: any;

  /**
   * 处理中间变量
   */
  private processVar: any;

  /**
   * 结果对象
   */
  results: Record<string, any> = {};

  /**
   * 基准url
   */
  private url: string | undefined;

  /**
   * CheerioAPI
   */
  private $: CheerioAPI | undefined;

  constructor(options: CrawlerOptions) {
    const { url, source, dataType = 'html', rules, $ } = options;
    if (!rules || !source) return;

    this.url = url;

    if (dataType === 'json') {
      try {
        this.source = JSON.parse(source as string);
      } catch (error) {
        throw new CrawlerError(ErrorCode.ILLEGALJSON);
      }
    } else {
      this.source = source;
      this.$ = $ || load(source as string);
    }

    Object.keys(rules).forEach((key) => {
      const rule = rules[key];

      if (dataType === 'json' || rule.dataType === 'json') {
        /**
         * json
         */
        if (rule.selector) {
          this.processVar = pickObject(this.source, rule.selector);
        } else {
          this.processVar = this.source;
        }

        (rule.handlers || []).forEach((handler) => {
          if (handler.method in Object.getPrototypeOf(this)) {
            const args = (handler.args || []) as unknown as [never, never];
            this.processVar = this[handler.method](...args);
          } else {
            throw new CrawlerError(ErrorCode.ILLEGALMETHOD, { method: handler.method });
          }
        });
      } else {
        /**
         * html
         */
        if (typeof source !== 'string') this.processVar = source;

        if (rule.selector) {
          this.processVar = (this.$ as CheerioAPI)(rule.selector);
          if (this.processVar.length === 0) {
            this.results[key] = null;
            return;
          }
        }

        (rule.handlers || []).forEach((handler) => {
          if (handler.method in Object.getPrototypeOf(this)) {
            const args = (handler.args || []) as unknown as [never, never];
            this.processVar = this[handler.method](...args);
          } else {
            throw new CrawlerError(ErrorCode.ILLEGALMETHOD, { method: handler.method });
          }
        });
      }

      this.results[key] = this.processVar;
    });
  }

  /**
   * 开头添加字符串
   * @param str 要添加的字符串
   * @returns
   */
  prefix(str: string) {
    return `${str || ''}${this.processVar as string}`;
  }

  /**
   * 对字符串结果进行截取
   * @param start 开始截取位置
   * @param end 结束截取位置
   * @returns
   */
  substring(start: number, end?: number) {
    let endIndex = end ?? this.processVar.length;
    if (endIndex < 0) endIndex = this.processVar.length + endIndex;
    return (this.processVar as string).substring(start, endIndex);
  }

  /**
   * 字符串全局替换
   * @param searchValue 将要被替换的文本
   * @param replaceValue 替换为
   * @returns
   */
  replace(searchValue: string, replaceValue: string) {
    const search = new RegExp(searchValue, 'g');
    return (this.processVar as string).replace(search, replaceValue);
  }

  /**
   * 去除开头与结尾的空格
   * @returns
   */
  trim() {
    return (this.processVar as string).trim();
  }

  /**
   * 把字符串转为数字
   * @returns
   */
  number() {
    return Number(this.processVar as string) || 0;
  }

  /**
   * 把html中的br替换成文本换行符
   * 匹配<br />,<br/><br >,<br>以及其中的空格以及\n换行符
   * @returns
   */
  br2nl() {
    return (this.processVar as string).replace(
      /(<br\s?\/?>|\n)+((\s+\n+)|(\s+<br\s?\/?>+)|\n+|<br\s?\/?>+)*/gi,
      '\n\n',
    );
  }

  /**
   * 把一组数据转换为数字并相加，非数字自动忽略
   * @returns
   */
  sum() {
    let total = 0;
    (this.processVar as string[]).forEach((item: string) => {
      total += Number(item) || 0;
    });
    return total;
  }

  /**
   * 获得的路径与当前请求地址相混合
   * @returns
   */
  resolveUrl() {
    return new URL(this.processVar as string, this.url).href;
  }

  /**
   * HTML entities decode
   * html字符串反序列化到正常的阅读文本
   * @returns
   */
  decode() {
    return (this.$ as CheerioAPI)('<div />')
      .html(this.processVar as string)
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
    if (name) return (this.processVar as CEle).attr(name) || '';
    return (this.processVar as CEle).attr() || {};
  }

  /**
   * 通过选择器、jQuery对象或元素来过滤，获取每个匹配元素的后代。
   * @param selector 选择器
   * @returns
   */
  find(selector: string) {
    return (this.processVar as CEle).find(selector || '');
  }

  /**
   * 根据索引来确定元素。使用 .eq(-i) 的则是倒过来计数。
   * @param index 元素所在索引
   * @returns
   */
  eq(index: number) {
    return (this.processVar as CEle).eq(index);
  }

  /**
   * 获取元素集合中的每个元素的合并文本内容，包括它们的后代
   * @returns
   */
  text() {
    return (this.processVar as CEle).text();
  }

  /**
   * 获取第一个选中元素的HTML内容字符串
   * @returns
   */
  html() {
    return (this.processVar as CEle).html();
  }

  /**
   * 通过每个在匹配函数产生的匹配集合中的匹配元素，产生一个新的包含返回值的数组。
   * 该函数可以返回一个单独的数据项或一组数据项被插入到所得到的集合中。
   * 如果返回一个数组，数组中的元素插入到集合中。
   * 如果函数返回空或未定义，则将插入任何元素。
   * @param rules map循环的内部规则
   * @returns
   */
  map(rules: Rules) {
    return (this.processVar as CEle)
      .map((_: number, eleItem: AnyNode) => {
        const api = new Api({
          url: this.url,
          rules,
          $: this.$,
          source: (this.$ as CheerioAPI)(eleItem),
        });
        return api.results;
      })
      .toArray();
  }

  /**
   * 对一个cheerio对象循环进行一些处理，得到一个新的数组。
   * 此方法与 map 方法的不同在于，map 总是返回一个对象数组，而 each 不一定返回对象数组。
   * @param handlers 循环处理的方法集合
   * @returns
   */
  each(handlers: Handler[]) {
    const res: any[] = [];
    (this.processVar as CEle).each((_: number, eleItem: AnyNode) => {
      const api = new Api({
        url: this.url,
        rules: { temp: { handlers } },
        $: this.$,
        source: (this.$ as CheerioAPI)(eleItem),
      });
      res.push(api.results?.['temp']);
    });
    return res;
  }
}
