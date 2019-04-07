diffChineseBot
===========

## 介绍
该模块对两个字符串进行比较并输出差异。

它基于John Resig的Javascript Diff算法，并大量借鉴了该算法。

主要区别在于，该模块支持在包含中文或其他使用多字节字符和不使用空格分隔单词的语言的字符串中查找差异。

使用效果:

![Image text](./diff-example.png)


## npm安装
```bash
$ npm install diffchinesebot
```

## RequireJS
```javascript
require.config({
	paths: {
		diffChineseBot: './diffChineseBot/index.js'
	}
});

require( [ 'diffChineseBot' ], function( diffChineseBot ) {
	...
});

```

## 直接引用
```html
<script src="./diffChineseBot.js"></script>
<script>
window.diffChineseBot(beforeString, afterString, option)
</script>
```

## 使用方式

diffChineseBot包只包含一个函数diffChinese，可以这样使用:
```javascript
var beforeString = 'the quick brown fox';
var afterString = 'the quick brown dog';

var diff = diffChineseBot( beforeString, afterString, option);

// => { before: 'the quick brown <span class="del-text">fox</span>', after: 'the quick brown <span class="new-text">dog</span>' }
```

- diffChineseBot( beforeString, afterString, option)
- option对象参数值：
<table>
  <thead>
    <tr>
        <td>名称</td>
        <td>功能</td>
        <td>默认值</td>
        <td>可选值</td>
    </tr>
  </thead>
  <tobody>
    <tr>
      <td>point</td>
      <td>设置文本比对差异率上限 超出设定值后不再处理文本元素 什么也不会发生</td>
      <td>空</td>
      <td>0-1 Number</td>
    </tr>
    <tr>
      <td>beforeClass</td>
      <td>设置旧文本和新文本不同处的样式类名</td>
      <td>del-text</td>
      <td>String</td>
    </tr>
    <tr>
      <td>afterClass</td>
      <td>设置新文本和旧文本不同处的样式类名</td>
      <td>new-text</td>
      <td>String</td>
    </tr>
  </tobody>
</table>
