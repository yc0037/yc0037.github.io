---
layout: article
title: "HTML学习笔记"
categories: "FrontEnd"
aside:
    toc: true
---

## HTML头部`<head>`

### `<title>`

- 标签页的标题
- 加入收藏夹的默认书签名

### `<meta>`

- `<meta charset="utf-8">`处理各种语言的字符. 
- `name`和`content`属性定义各种meta信息. 
  - `author`指明页面的作者
  - `description`显示在搜索引擎的结果中
  - `keyword`作为搜索引擎的索引
- `http-equiv`代替`name`属性可以将meta信息添加到HTTP request header中. 

## 文字排版

### 描述列表(Description List)

```html
<dl>
  <dt>内心独白</dt>
    <dd>戏剧中, 某个角色对自己的内心活动或感受进行念白表演, 这些台词只面向观众, 而其他角色不会听到. </dd>
  <dt>语言独白</dt>
    <dd>戏剧中, 某个角色把自己的想法直接进行念白表演, 观众和其他角色都可以听到. </dd>
  <dt>旁白</dt>
    <dd>戏剧中, 为渲染幽默或戏剧性效果而进行的场景之外的补充注释念白, 只面向观众, 内容一般都是角色的感受、想法、以及一些背景信息等. </dd>
</dl>
```

效果如下: 

<dl>
  <dt>内心独白</dt>
    <dd>戏剧中, 某个角色对自己的内心活动或感受进行念白表演, 这些台词只面向观众, 而其他角色不会听到. </dd>
  <dt>语言独白</dt>
    <dd>戏剧中, 某个角色把自己的想法直接进行念白表演, 观众和其他角色都可以听到. </dd>
  <dt>旁白</dt>
    <dd>戏剧中, 为渲染幽默或戏剧性效果而进行的场景之外的补充注释念白, 只面向观众, 内容一般都是角色的感受、想法、以及一些背景信息等. </dd>
</dl>

### 引用

`<blockquote>`: 块引用, 用`cite`属性指向被引用的资源. 效果: 
<blockquote cite="https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting#%E5%B1%95%E7%A4%BA%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%BB%A3%E7%A0%81">
如果一个块级内容（一个段落、多个段落、一个列表等）从其他地方被引用, 你应该把它用&lt;blockquote&gt;元素包裹起来表示, 并且在cite属性里用URL来指向引用的资源. 
</blockquote>

`<q>`: 内联引用. 效果: <q>内联引用</q>

使用`<cite>`来标注引用的来源. 

### 缩略语

使用`<abbr>`标签. 如: 
```html
这是一个<abbr title="超文本标记语言">HTML</abbr>学习笔记. 
```
效果为: 这是一个<abbr title="超文本标记语言">HTML</abbr>学习笔记. 

### 一些语义元素

使用`<address>`标记网页编写者的联系方式. 效果: 
<address>
  <p>Page written by <a href="https://yc0037.github.io/">lyc</a>.</p>
</address>

使用`<sup>`和`<sub>`表示上下标. 

使用`<code>`标记代码, `<pre>`包裹代码块来保留空白字符, `<var>`标记变量名, `<kbd>`标记输入, `<samp>`标记输出. 

使用`<time>`标记时间和日期. 代码: 
```html
<time datetime="2020-06-30">2020年6月30日</time>
```

效果: <time datetime="2020-06-30">2020年6月30日</time>

## 语义化的文档结构元素

`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`

具体参见<a href="https://developer.mozilla.org/zh-CN/docs/learn/HTML/Introduction_to_HTML/%E6%96%87%E4%BB%B6%E5%92%8C%E7%BD%91%E7%AB%99%E7%BB%93%E6%9E%84">MDN上的介绍</a>. 