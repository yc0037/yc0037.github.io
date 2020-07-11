---
layout: article
title: "CSS笔记-定位"
categories: "FrontEnd"
aside:
    toc: true
---

<style>
    .pos-box {
        border: 2px solid #c27c88;
        border-radius: 15px;
        background-color: #f1c4cd;
        width: 200px;
        height: 5em;
        margin: 10px 0;

        line-height: 5em;
        text-align: center;
    }

    .bare-box {
        position: absolute;
        top: 10px;
        left: 85%;
        right: 10px;
        bottom: 50%;

        border-radius: 15px;
        border: 2px solid #b78d12;
        margin: 10px 0;

        background-color: #f9d770;

        text-align: center;
    }

    .bare-box::before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 100%;
    }

    .stt {
        position: static;
    }

    .rel {
        position: relative;
        left: 70px;
        top: 20px;
    }

    .abs {
        position: absolute;
        left: 100px;
        top: 50px;
    }

    .fix {
        position: fixed;
        left: 10px;
        top: 60%;
        width: 150px;
        z-index: 99999;
    }
</style>

定位(position)使元素离开正常布局流(normal flow)而表现出不同的行为。

## 正常布局流

正常布局流(normal flow)是元素在页面上进行布局的默认行为。

正常布局流下，块级元素的宽度是父元素的100%，高度与内容高度一致。行内(inline)元素的高度和宽度都与内容一致，并且不可通过CSS属性进行修改。

正常布局流下，块级元素按顺序自上而下排列，中间被外边距(margin)分隔，并且会发生外边距折叠。行内元素不会另起新行，只要父元素内有足够的宽度空间，它就会与其他相邻的行内元素并排放置；如果宽度不够，那么溢出的内容会出现在新的一行。

## 定位

通过设置`position`属性，我们可以改变元素的定位方式，使其脱离正常布局流。

### 静态(static)定位

默认值，将元素放入它在正常布局流中的位置。此时`left`/`right`/`top`/`bottom`和`z-index`属性无效。

### 相对(relative)定位

设置`position`属性为`relative`，然后设置`left`/`right`/`top`/`bottom`来使得元素相对于它在正常文档流中的位置产生偏移。此时元素在正常布局流中的位置被保留，不会影响整个文档的布局。

一个例子：

<div class="example clearfix">
    <div style="float: left; margin-left: 20%">
        <div class="pos-box stt">static</div>
        <div class="pos-box rel">relative</div>
        <div class="pos-box stt">static</div>
    </div>
    <div style="float: right; margin-right: 20%">
        <div class="pos-box stt">static</div>
        <div class="pos-box stt">static</div>
        <div class="pos-box stt">static</div>
    </div>
</div>

### 绝对(absolute)定位

设置`position`属性为`absolute`，然后设置`left`/`right`/`top`/`bottom`来使得元素相对于**最近的非static祖先**产生偏移。此时元素在正常布局流中的位置不被保留。

绝对定位元素的外边距不会被折叠。

如果没有设置元素的宽度和高度，那么可以通过设置`left`/`right`/`top`/`bottom`来改变元素的大小。

例子：

<div class="example clearfix" style="position: relative;">
    <div style="float: left; margin-left: 20%">
        <div class="pos-box stt">static</div>
        <div class="pos-box abs">absolute</div>
        <div class="bare-box">absolute</div>
        <div class="pos-box stt">static</div>
        <div class="pos-box stt">static</div>
    </div>
    <div style="float: right; margin-right: 20%">
        <div class="pos-box stt">static</div>
        <div class="pos-box stt">static</div>
        <div class="pos-box stt">static</div>
        <div class="pos-box stt">static</div>
    </div>
</div>

### 固定(fixed)定位

设置`position`属性为`fixed`，然后设置`left`/`right`/`top`/`bottom`来使得元素相对于浏览器视口进行定位。此时元素在正常布局流中的位置不被保留。

本页左侧的动图就是固定定位元素的一个例子。

<div class="fix"><img src="http://lyc0037.gitee.io/pics/img/quin-chase-fish.gif"></div>

### sticky定位

设置`position`属性为`sticky`，然后设置`left`/`right`/`top`/`bottom`来使得元素在滚动到某一位置前表现为相对定位，而滚动到该位置之后相对于浏览器视口进行定位。此时元素在正常布局流中的位置不被保留。

本页右侧的导航栏就是sticky定位的一个例子。

### `z-index`

`z-index`属性决定重叠元素的上下顺序。

默认情况下，定位的元素会出现在未定位的元素上方；源文档中后定位的元素会出现在先定位的元素上方。事实上，它们的`z-index`属性默认都为`auto`，计算值为0。

设置`z-index`的值可以控制元素堆叠的顺序。该属性只接受无单位索引值，正值使元素向堆叠上层移动，值越大，元素位置越靠上；负值使元素向堆叠下层移动，值越小，元素位置越靠下。