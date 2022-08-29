# spider-crawler

![coverage](https://img.shields.io/azure-devops/coverage/wtto00/spider-crawler/25/master)

定义一个 json 格式的爬虫规则，Nodejs 按照该规则爬取所需要的内容

## To Do

- [x] api 类型使用定义好的方法推导
- [x] url path resolve(fillUrl)
- [x] class or function
- [ ] selector fail callback
- [x] crawl json data

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

| 字段  | 类型                    | 备注         |
| ----- | ----------------------- | ------------ |
| json  | string                  | json 字符串  |
| rules | [JsonRules](#JsonRules) | 取值处理规则 |

### JsonRules

```typescript
type JsonRules = Record<string, JsonRule>;
```

#### JsonRule

| 字段     | 类型                  | 必填 | 备注                                                     |
| -------- | --------------------- | ---- | -------------------------------------------------------- |
| selector | string                | 是   | [json 取值规则](https://www.lodashjs.com/docs/lodash.at) |
| handlers | [Handler](#Handler)[] | 否   | 数据处理方法集合                                         |

JsonRule 的 Handler 中的 Method，只有 `prefix`,`substring`,`replace`,`trim`,`number`,`br2nl`。其他处理方法为无效值。

## CrawlFromHtml Options

| 字段    | 类型            | 必填 | 备注                                  |
| ------- | --------------- | ---- | ------------------------------------- |
| baseUrl | string          | 否   | baseUrl 用于 html 中某些 url 属性处理 |
| html    | string          | 是   | html 字符串                           |
| rules   | [Rules](#Rules) | 是   | 取值处理规则                          |

## Options

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

| 字段     | 类型                  | 必填 | 备注                                                                                                   |
| -------- | --------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| selector | string                | 否   | [cheerio 选择器](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#%E9%80%89%E6%8B%A9%E5%99%A8) |
| handlers | [Handler](#Handler)[] | 是   | 爬虫爬取到的元素的处理方法集合                                                                         |

#### Handler

```typescript
interface Handler {
  method: Method;
  args?: Args;
}
```

#### Method & Args

下边列举所有的可以方法以及相对应的参数

- **prefix**  
  开头添加字符串  
  `args: [string]`
- **substring**  
  对字符串结果进行截取  
  `args: [number,?number]`
- **replace**  
  字符串全局替换  
  `args: [string,string]`
- **trim**  
  去除开头与结尾的空格  
  不需要`args`
- **resolveUrl**  
  获得的路径与当前请求地址相混合  
  不需要`args`
- **number**  
  把字符串转为数字  
  不需要`args`
- **br2nl**  
  把 `html` 中的 `br` 替换成文本换行符`\n`  
  匹配`<br />,<br/><br >,<br>`以及其中的空格以及`\n`换行符  
  不需要`args`
- **decode**  
  html 字符串反序列化到正常的阅读文本  
  不需要`args`
- **attr**  
  [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#attr-name-value--1)  
  获取属性的方法。  
  在匹配集合中只能获取的第一个元素的属性值。  
  `args?: [string]`
- **find**
  [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#findselector)  
  通过选择器、jQuery 对象或元素来过滤，获取每个匹配元素的后代。  
  `args: [string]`
- **eq**
  [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#eq-i-)  
  根据索引来确定元素。使用 .eq(-i) 的则是倒过来计数。  
  `args: [number]`
- **text**
  [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#text-textstring-)  
  获取元素集合中的每个元素的合并文本内容，包括它们的后代  
  不需要`args`
- **html**
  [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#html-htmlstring-)  
  获取第一个选中元素的 HTML 内容字符串  
  不需要`args`
- **map**
  [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#map-functionindex-element--1)  
  通过每个在匹配函数产生的匹配集合中的匹配元素，产生一个新的包含返回值的 cheerio 对象。  
  该函数可以返回一个单独的数据项或一组数据项被插入到所得到的集合中。  
  如果返回一个数组，数组中的元素插入到集合中。  
  如果函数返回空或未定义，则将插入任何元素。  
  `args: [Rules]`
