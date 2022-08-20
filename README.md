# spider-crawler

![coverage](https://img.shields.io/codecov/c/github/wtto00/node-spider-crawler/dev?token=EZWZMSVOM9)

定义一个 json 格式的爬虫规则，Nodejs 按照该规则爬取所需要的内容

For Nodejs v15+

## To Do

- [x] api 类型使用定义好的方法推导
- [x] url path resolve(fillUrl)
- [x] class or function
- [ ] selector fail callback

## 使用

```javascript
import { crawl } from '@wtto00/spider-crawler';

crawl(options).then((res) => {
  console.log(res);
});
```

## 举例

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

crawl(options).then((res) => {
  console.log(res);
});

// {"code":0,"message":"success","data":{"name":"Jest","author":"Orta","installs":1148080,"tags":null}}
```

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
