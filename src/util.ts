/**
 * 把值插入到模板字符串中
 * @param str 模板字符串
 * @param values 要插入的值
 * @returns
 */
export function formatString(str: string, values: Record<string, any>) {
  let res = str;
  Object.keys(values).forEach((key) => {
    const reg = new RegExp(`$\{${key}}`, 'g');
    res = res.replace(reg, values[key]);
  });
  return res;
}

const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g',
);
/**
 * 参考[lodash.get](https://www.lodashjs.com/docs/lodash.get)
 * @param obj 要检索的对象
 * @param selector  要获取属性的路径
 * @returns
 */
export function pickObject(obj: Record<string, any>, selector: string) {
  if (!selector) return obj;
  const paths: string[] = [];
  selector.replace(rePropName, (match: string, expression: string, quote: string, subString: string) => {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    } else if (expression) {
      key = expression.trim();
    }
    paths.push(key);
    return '';
  });
  let index = 0;
  const length = paths.length;

  while (obj != null && index < length) {
    obj = obj[paths[index++]];
  }
  return index && index == length ? obj : undefined;
}

/**
 * 检测一个对象是否是Cheerio对象
 * @param obj 要检测的对象
 * @returns
 */
export function isCheerio(obj: any) {
  if (typeof obj !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(obj, '_root');
}
