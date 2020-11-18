---
layout: article
title: "JS笔记-元素大小与滚动"
categories: "FrontEnd"
aside:
    toc: true
---

<style>
  .info-box {
    margin: 10px;
    padding: 10px 20px;
    background-color: #bae7ff;
    border: 1px solid #1890ff;
    border-radius: 5px;
  }
</style>

## 计算样式值
事实上，`style`属性只对 HTML 标签的`style`特性起作用。我们无法通过`style`属性读取来自 CSS 类的样式信息。那么，我们如何获取元素当前样式属性的值呢？

JavaScript 提供了`getComputedStyle`方法。它的语法如下：
``` js
getComputedStyle(element, [pseudo]);
```

其中，`element`是要读取样式的元素，`pseudo`表示目标元素是`element`的伪元素，为空的话则为`element`元素本身。返回值是一个具有样式属性的对象，包括了 CSS 中的样式属性。

<div class="info-box">
  <p><b>计算值与解析值</b></p>
  <p>计算（样式）值是指一个元素在应用了所有 CSS 规则之后的样式值，这包括它应用到自身的 CSS 样式和继承而来的 CSS 样式。它看起来像是<code>height: 1em</code>或者<code>font-size: 125%</code>。</p>
  <p>解析（样式）值是指最终应用于元素的样式值。浏览器将计算样式值转换为固定的、绝对单位表示的值，就是解析样式值，例如<code>height: 20px</code>或者<code>width: 16.5px</code>。</p>
  <p>历史上，<code>getComputedStyle</code>获取的是元素的计算值。但现在，它返回的是元素的<b>解析值</b>。</p>
</div>

## 元素大小
但是，`getComputedStyle`并不适合取元素`width`和`height`的解析值。原因主要有三个：
1. 元素的`width`和`height`的取值会受到`box-sizing`属性的影响。在不知道`box-sizing`取值的情况下，我们得到的`width`和`height`的取值可能并不是元素正确的宽度和高度值。
2. 元素的`width`和`height`的取值可能为`auto`。例如，inline 元素的`width`就为`auto`。在这种情况下，我们获取到`auto`对于计算没有任何意义。
3. 存在滚动条的情况下，不同浏览器中`getComputedStyle`的行为不同。Chrome 等浏览器会从元素宽度中减去滚动条的宽度，而 Firefox 等浏览器则不会。

因此，我们应当使用下面这些属性来获取元素的实际大小：
<img src="https://gitee.com/lyc0037/pics/raw/master/img/20201028210641.png"/>

其中，`offsetLeft`和`offsetTop`是相对于`offsetParent`计算的。一个元素的`offsetParent`为满足下列条件之一的最近祖先：
- `position`为`absolute`、`relative`或`fixed`
- `<td>`、`<th>`或`<table>`
- `<body>`

而在以下几种条件下，元素的`offsetParent`为`null`：
- 未显示的元素。例如，元素的`display`为`none`，或者元素不在文档中
- `<body>`和`<html>`
- 元素的`position`为`fixed`

## 窗口大小
通常我们通过`document.documentElement`（也就是`<html>`标签对应的 DOM 对象）的`clientHeight`和`clientWidth`属性来获取窗口的高度和宽度。

另一种方式是通过`window.innerHeight`和`window.innerWidth`。但这种方法的缺点是，它不会去掉滚动条的宽度，而我们想要的往往是去掉滚动条的、能够真正用来显示元素的空间。所以我们通常不使用这种方法。

## 文档大小
出于一些历史原因，为了可靠地获得文档的高度，我们需要取下列属性的最大值：
``` js
let scrollHeight = Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
);
```

## 滚动
### CSS 的`overflow`属性
CSS 的`overflow`属性指示元素的内容太大以至于无法适应 BFC 时应当做什么。它事实上是`overflow-x`和`overflow-y`的简写属性。

设置一个块的`overflow`属性为`visible`以外的值时，会创建一个新的 BFC。

为了使`overflow`属性有效果，块容器必须有一个指定的高度（如设置了`height`或`max-height`，对于垂直方向滚动条），或者设置了`white-space`为`nowrap`（对于水平方向滚动条）。

#### 取值
`overflow`属性的取值有五种：
- `visible`：默认值，内容不会被修剪，而是直接呈现在元素框外。
- `hidden`：不允许滚动，溢出的内容会被修剪且不可见。
- `scroll`：溢出的内容会被修剪。滚动条总是显示。
- `auto`：如果有内容溢出，就会被修剪并显示滚动条。
- `inherit`：从父元素继承`overflow`属性的值。

### 元素的滚动
我们可以通过`scrollLeft`和`scrollTop`属性来读取和设置元素内部的滚动情况。

通过设置`scrollTop`和`scrollLeft`可以改变元素的滚动位置。

### 文档的滚动
#### 获取滚动状态
可以通过`window.pageXOffset`和`window.pageYOffset`来获取文档当前的滚动状态。这两个属性都是**只读**的。

#### 滚动页面
可以通过`window.scrollBy(x, y)`和`window.scrollTo(pageX, pageY)`来滚动页面。

`window.scrollBy(x, y)`将页面滚动到相对于当前位置的(x, y)位置。例如，`window.scrollBy(0, 10)`将页面向下滚动10px。

`window.scrollTo(pageX, pageY)`滚动页面，使得可见部分的左上角相对于文档左上角的坐标为(pageX, pageY)。

`element.scrollIntoView(top)`滚动页面使得元素`element`可见。如果`top`为`true`，那么`element`位于窗口顶部且上边缘与窗口顶部对齐，否则位于窗口底部且下边缘与窗口底部对齐。

#### 禁止滚动
只需要设置元素的`overflow`属性为`hidden`就可以禁止滚动。

需要注意的是，如果元素原本有滚动条，那么禁止滚动之后滚动条会消失。如果不希望这种情况影响页面布局，可以通过比较`clientWidth`来判断滚动条是否消失，并且在禁止滚动之后为页面设置滚动条宽度大小的 padding。

另一方面，即便设置了`overflow`为`hidden`，修改`scrollTop`和`scrollLeft`属性仍然能滚动元素。
