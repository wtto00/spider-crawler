# Change Log

All notable changes to the "newVueComponent" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.1]

#### 第一个版本

- 可通过爬虫规则的 json 配置，爬取相应的结果
- 爬虫规则包含以下处理方法：
  - **prefix**: 开头添加字符串
  - **substring**: 对字符串结果进行截取
  - **replace**: 字符串全局替换
  - **trim**: 去除开头与结尾的空格
  - **resolveUrl**: 获得的路径与当前请求地址相混合
  - **number**: 把字符串转为数字
  - **br2nl**: 把 `html` 中的 `br` 替换成文本换行符`\n`
  - **decode**: html 字符串反序列化到正常的阅读文本
  - **attr**: [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#attr-name-value--1) 获取元素的属性
  - **find**: [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#findselector) 通过选择器、jQuery 对象或元素来过滤，获取每个匹配元素的后代
  - **eq**: [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#eq-i-) 根据索引来确定元素。使用 .eq(-i) 的则是倒过来计数。
  - **text**: [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#text-textstring-) 获取元素集合中的每个元素的合并文本内容，包括它们的后代
  - **html**: [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#html-htmlstring-) 获取第一个选中元素的 HTML 内容字符串
  - **map**: [cheerio 方法](https://github.com/cheeriojs/cheerio/wiki/Chinese-README#map-functionindex-element--1) 通过每个在匹配函数产生的匹配集合中的匹配元素，产生一个新的包含返回值的对象。

## [Unreleased]

- Initial release
