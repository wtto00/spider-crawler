# spider-crawler

[![Lint & Test](https://github.com/wtto00/spider-crawler/actions/workflows/code-format-test.yml/badge.svg)](https://github.com/wtto00/spider-crawler/actions/workflows/code-format-test.yml) ![coverage](https://img.shields.io/codecov/c/github/wtto00/spider-crawler/main) [![downloads](https://img.shields.io/npm/dm/@wtto00/spider-crawler)](https://www.npmjs.com/package/@wtto00/spider-crawler) ![license](https://img.shields.io/github/license/wtto00/spider-crawler)

定义一个 json 格式的爬虫规则，Nodejs 按照该规则爬取所需要的内容

## 使用

```javascript
import { crawlFromUrl, crawlFromJson, crawlFromHtml } from '@wtto00/spider-crawler';

crawlFromUrl(urlOptions).then((res) => {
  console.log(res);
});
crawlFromJson(jsonOptions).then((res) => {
  console.log(res);
});
crawlFromHtml(htmlOptions).then((res) => {
  console.log(res);
});
```

## 示例

#### crawlFromUrl

```javascript
const options = {
  url: 'https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest',
  rules: {
    name: {
      selector: '.ux-item-name',
      handlers: [{ method: 'text' }, { method: 'trim' }],
    },
    author: {
      selector: '.ux-item-publisher',
      handlers: [{ method: 'text' }, { method: 'trim' }],
    },
    installs: {
      selector: '.installs-text',
      handlers: [
        { method: 'text' },
        { method: 'substring', args: [0, -9] },
        { method: 'trim' },
        { method: 'replace', args: [',', ''] },
        { method: 'number' },
      ],
    },
    tags: {
      selector: '.meta-data-list-link',
      handlers: [
        {
          method: 'map',
          args: [
            {
              text: { handlers: [{ method: 'text' }] },
              link: { handlers: [{ method: 'attr', args: ['href'] }, { method: 'resolveUrl' }] },
            },
          ],
        },
      ],
    },
  },
};

crawlFromUrl(options).then((res) => {
  console.log(res);
});

// {"code":0,"message":"success","data":{"name":"Jest","author":"Orta","installs":1148080,"tags":null}}
```

#### crawlFromJson

```javascript
const options = {
  json: JSON.stringify({ test: '1' }),
  rules: {
    test: {
      selector: 'test',
      handlers: [{ method: 'number' }],
    },
  },
};
const res = crawlFromJson(jsonOptions);
// {"code":0,"message":"success","data":{"test":1}}
```

#### crawlFromHtml

```javascript
const options = {
  html: '<p class="test">content</p>',
  rules: {
    content: {
      selector: '.test',
      handlers: [{ method: 'text' }],
    },
  },
};
const res = crawlFromHtml(options);
// {"code":0,"message":"success","data":{"content":"content"}}
```

## CrawlFromJson Options

| 字段  | 类型            | 备注         |
| ----- | --------------- | ------------ |
| json  | string          | json 字符串  |
| rules | [Rules](#Rules) | 取值处理规则 |

## CrawlFromHtml Options

| 字段    | 类型            | 必填 | 备注                                  |
| ------- | --------------- | ---- | ------------------------------------- |
| baseUrl | string          | 否   | baseUrl 用于 html 中某些 url 属性处理 |
| html    | string          | 是   | html 字符串                           |
| rules   | [Rules](#Rules) | 是   | 取值处理规则                          |

## CrawlFromUrl Options

| 字段    | 类型                                                            | 备注     |
| ------- | --------------------------------------------------------------- | -------- |
| url     | string                                                          | 请求地址 |
| options | [RequestInit](https://www.npmjs.com/package/node-fetch#options) | 请求参数 |
| rules   | [Rules](#Rules)                                                 | 爬虫规则 |

### Rules

```typescript
type Rules = Record<string, Rule>;
```

#### Rule

| 字段     | 类型                  | 必填 | 备注                                                                                                                                                                            |
| -------- | --------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| selector | string                | 否   | [cheerio 选择器](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#%E9%80%89%E6%8B%A9%E5%99%A8)                                                                          |
| dataType | 'html'\|'json'        | 否   | selector 是 [cheerio 选择器](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#%E9%80%89%E6%8B%A9%E5%99%A8)，还是 [json 选择器](https://www.lodashjs.com/docs/lodash.at) |
| handlers | [Handler](#Handler)[] | 是   | 爬虫爬取到的元素的处理方法集合                                                                                                                                                  |

#### Handler

```typescript
interface Handler {
  method: Method;
  args?: Args;
}
```

#### Method & Args

下边列举所有的可以方法以及相对应的参数

| 方法`Method` | 参数`args`              | 说明                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prefix       | (string)                | 字符串开头添加字符串                                                                                                                                                                                                                                                                                                                                              |
| substring    | (number,?number)        | 对字符串结果进行截取                                                                                                                                                                                                                                                                                                                                              |
| replace      | (string,string)         | 字符串全局替换                                                                                                                                                                                                                                                                                                                                                    |
| trim         | -                       | 去除开头与结尾的空格                                                                                                                                                                                                                                                                                                                                              |
| number       | -                       | 把字符串转为数字，转换失败时默认为 0                                                                                                                                                                                                                                                                                                                              |
| br2nl        | -                       | 把 `html` 中的 `br` 替换成文本换行符`\n`（匹配`<br />,<br/><br >,<br>`以及其中的空格以及`\n`换行符）                                                                                                                                                                                                                                                              |
| sum          | -                       | 把字符串数组转为数字后相加                                                                                                                                                                                                                                                                                                                                        |
| resolveUrl   | -                       | 获得的路径与当前请求地址相混合                                                                                                                                                                                                                                                                                                                                    |
| decode       | -                       | html 字符串反序列化到正常的阅读文本                                                                                                                                                                                                                                                                                                                               |
| attr         | (?string)               | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#attr-name-value--1)<br />获取属性的方法。<br />在匹配集合中只能获取的第一个元素的属性值。                                                                                                                                                                                                 |
| find         | (string)                | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#findselector)<br />通过选择器、jQuery 对象或元素来过滤，获取每个匹配元素的后代。                                                                                                                                                                                                          |
| eq           | (number)                | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#eq-i-)<br />根据索引来确定元素。使用 .eq(-i) 的则是倒过来计数。                                                                                                                                                                                                                           |
| text         | -                       | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#text-textstring-)<br />获取元素集合中的每个元素的合并文本内容，包括它们的后代                                                                                                                                                                                                             |
| html         | -                       | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#html-htmlstring-)<br />获取第一个选中元素的 HTML 内容字符串                                                                                                                                                                                                                               |
| map          | ([Rules](#Rules))       | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#map-functionindex-element--1)<br/>通过每个在匹配函数产生的匹配集合中的匹配元素，产生一个新的包含返回值的数组。<br />该函数可以返回一个单独的数据项或一组数据项被插入到所得到的集合中。 <br />如果返回一个数组，数组中的元素插入到集合中。<br />如果函数返回空或未定义，则将插入任何元素。 |
| each         | ([Handler](#Handler)[]) | [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#each-functionindex-element-)<br />对一个 cheerio 对象循环进行一些处理，得到一个新的数组。<br />此方法与 map 方法的不同在于，map 总是返回一个对象数组，而 each 不一定返回对象数组。                                                                                                        |
