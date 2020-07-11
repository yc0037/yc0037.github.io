---
layout: article
title: "CSS笔记-弹性盒子"
categories: "FrontEnd"
aside:
    toc: true
---

<style>
    .ex-box {
        border: 2px solid #248067;
        border-radius: 10px;
        padding: 10px 10px;
        margin: 1.5% 3px;

        background-color: #b9dec9;
    }

    .flex {
        display: flex;
    }

    .l-container {
        border: 2px solid #808080;
        margin: 5px 0;
        width: 75%;
        
        background-color: #495c69;
    }

    .wider-box {
        flex: 1 0 200px;
    }
</style>

弹性盒子(flexbox)是一种用于按行或按列布局元素的一维布局方法。它能够满足使用`float`和`position`难以简洁而方便地实现的布局需求，例如：

- 在父级元素里垂直居中一个块内容。
- 使容器的所有子元素占用相等的宽度/高度，而容器本身的宽度/高度是可变的。
- 使多列布局中的所有列高度相同，即便它们的内容的高度不同。

## flex模型

一个flex模型是这样布局的：

<div style="text-align: center;">
<img src="http://lyc0037.gitee.io/pics/img/20200706101714.png" alt="flex模型示意图" width="60%">
</div>

<dl>
    <dt>Main axis</dt>
    <dd>沿着flex元素放置的方向延伸的轴。轴的开始和结束分别被称为<b>main start</b>和<b>main end</b>。</dd>
    <dt>Cross axis</dt>
    <dd>垂直于flex元素放置方向的轴。轴的开始和结束被称为<b>cross start</b>和<b>cross end</b>。</dd>
    <dt>flex容器(flex container)</dt>
    <dd>设置了<code>display: flex</code>的父元素称为flex容器。</dd>
    <dt>flex子元素(flex item)</dt>
    <dd>在flex容器中表现为柔性的盒子元素被称为flex子元素。</dd>
</dl>

默认状态下，flex容器中所有flex子元素表现出如下行为：

- `flex-direction`的值为`row`，即元素从左到右排列成一行。
- 元素从main axis的起始线开始排布。
- 元素不会在main axis上拉伸，但是可以缩小。
- 元素在cross axis上会拉伸直到填满整个轴线的长度。
- `flex-basis`为`auto`。这意味着块的大小参照该块的`height`和`width`属性。(参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-basis">MDN文档-<code>flex-basis</code></a>)
- `flex-wrap`为`nowrap`。这意味着超出容器宽度的元素不会换行，而是向外溢出。

一个例子：

<div class="example">
    <div class="flex">
        <div class="ex-box">flex</div>
        <div class="ex-box">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc enim sapien, dictum varius mollis eget, rhoncus quis odio. Aliquam vitae mi in turpis vulputate dictum dapibus sed massa. Curabitur gravida sagittis justo, vitae commodo dolor mattis et.</div>
        <div class="ex-box">弹性盒子(flexbox)是一种用于按行或按列布局元素的一维布局方法。它能够满足使用<code>float</code>和<code>position</code>难以简洁而方便地实现的布局需求。</div>
    </div>
    <div class="flex">
        <div class="ex-box">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc enim sapien, dictum varius mollis eget, rhoncus quis odio. Aliquam vitae mi in turpis vulputate dictum dapibus sed massa. Curabitur gravida sagittis justo, vitae commodo dolor mattis et.</div>
        <div class="ex-box">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc enim sapien, dictum varius mollis eget, rhoncus quis odio. Aliquam vitae mi in turpis vulputate dictum dapibus sed massa. Curabitur gravida sagittis justo, vitae commodo dolor mattis et.</div>
        <div class="ex-box">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc enim sapien, dictum varius mollis eget, rhoncus quis odio. Aliquam vitae mi in turpis vulputate dictum dapibus sed massa. Curabitur gravida sagittis justo, vitae commodo dolor mattis et.</div>
    </div>
</div>

## flex容器的属性

### `flex-direction`

设置`flex-direction`属性可以改变flex元素的排列方向(即main axis的方向以及main start和main end的方向)。该属性可能的取值包括：

- `row`：默认值。Main axis为水平轴，元素从左向右排列。
- `column`：Main axis为垂直轴，元素从上向下排列。
- `row-reverse`：Main axis为水平轴，元素从右向左排列。
- `column-reverse`：Main axis为垂直轴，元素从下向上排列。

<div class="example">
    <div class="flex" style="flex-direction: row;">
        <div class="ex-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
    <div class="flex" style="flex-direction: column;">
        <div class="ex-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
    <div class="flex" style="flex-direction: row-reverse;">
        <div class="ex-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
    <div class="flex" style="flex-direction: column-reverse;">
        <div class="ex-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
</div>

### `flex-wrap`

如果flex子元素的总宽度超过flex容器的宽度，在默认情况下(即`flex-wrap: nowrap;`)，flex子元素会首先收缩，如果收缩之后总宽度仍然超出容器的宽度，那么内容就会溢出容器。如下例：

<div class="example">
    flex子元素首先收缩：
    <div class="l-container flex">
        <div class="ex-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box"><b>Par4</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
    设置<code>flex-shrink: 0</code>之后，flex子元素不能收缩，于是只能溢出：
    <div class="l-container flex">
        <div class="ex-box wider-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box wider-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box wider-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box wider-box"><b>Par4</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
</div>

而如果设置了`flex-wrap: wrap;`，那么超过容器宽度的flex子元素会换行，显示到下一行，如下例：

<div class="example">
    <div class="l-container flex" style="flex-wrap: wrap;">
        <div class="ex-box wider-box"><b>Par1</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box wider-box"><b>Par2</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box wider-box"><b>Par3</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
        <div class="ex-box wider-box"><b>Par4</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut quam commodo.</div>
    </div>
</div>

### `flex-flow`

`flex-flow`是`flex-direction`和`flex-wrap`的缩写属性。

```css
.example {
    flex-flow: row wrap;
}
```

## flex子元素的属性

通过设置flex子元素的`flex`属性(或者说，三个属性`flex-basis`，`flex-grow`和`flex-shrink`)，可以控制flex子元素在main axis上占有的宽度比例。

> 本节主要参考了<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax">MDN Guides-控制Flex子元素在主轴上的比例</a>。

### flex子元素宽度的确定

一个子元素的宽度总是在`min-content`和`max-content`之间。`min-content`要求内容在块内尽可能换行来减少宽度。不难发现，内容字符串中最长的单词决定了`min-content`的大小。`max-content`则相反，内容在块中从不换行，一直沿着同一行延伸，乃至溢出容器。

若干个flex子元素出现在容器中时，首先根据它们的`flex-basis`属性来计算子元素基础宽度的总和。Flex容器的宽度与子元素宽度总和的差即为自由空间(free space)。当容器宽度大于子元素宽度总和时，自由空间的宽度为正数，反之为负数。子元素的实际宽度等于它的基础宽度加上自由空间的宽度的一部分(若为负数，则相当于减去绝对值)，这个加值的大小受到`flex-grow`和`flex-shrink`的影响。

### `flex-basis`

该属性的初始值为`auto`。浏览器会先检查flex子元素是否设置了`weight`或者`height`，如果有，则直接用它来作为该属性的值，否则会将子元素的`max-content`大小作为该属性的值。

如果设置`flex-basis`为0，那么main axis上所有的空间都为可以用来分配的自由空间。

### `flex-grow`

该属性指定了子元素分配正自由空间(positive free space)的比例。在分配正自由空间时，每个子元素会按照自身`flex-grow`属性占所有子元素`flex-grow`属性之和的比例分到正自由空间的宽度。

该属性的初始值为0，这意味着该元素不允许沿main axis拉伸。

### `flex-shrink`

该属性指定了子元素分配负自由空间(negative free space)的比例。值越大，子元素收缩越明显。但子元素的宽度不会收缩到`min-content`以下。

该属性的初始值为1。

### `flex`

上述三种属性的简写。依次为`flex-grow`，`flex-shrink`和`flex-basis`。

```css
.example {
    flex: 1 1 auto;
}
```

## 对齐与空间分配

> 这部分内容可以参考<a href="http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html">阮一峰的Flex布局教程</a>。

### `align-items`

设置在flex容器上，决定元素在cross axis上的对齐方式。可能的取值包括：

- `stretch`：默认值，所有子元素在cross axis方向上拉伸填满整个高度。
- `flex-start`：所有子元素按flex容器的上部(即cross start)对齐。
- `flex-end`：所有子元素按flex容器的下部(即cross end)对齐。
- `center`：所有子元素按flex容器的cross axis居中对齐。

<div class="example flex" >
    <div class="flex" style="align-items: stretch;">
        <div class="ex-box">Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
    </div>
    <div class="flex" style="align-items: flex-start;">
        <div class="ex-box">Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
    </div>
    <div class="flex" style="align-items: flex-end;">
        <div class="ex-box">Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
    </div>
    <div class="flex" style="align-items: center;">
        <div class="ex-box">Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
        <div class="ex-box">Par<br />Par<br />Par<br />Par<br />Par<br />Par</div>
    </div>
</div>

### `justify-content`

设置在flex容器上，设置元素在main axis上的对齐方式。

- `stretch`：默认值。
- `flex-start`：左对齐。
- `flex-end`：右对齐。
- `center`：居中。
- `space-around`：分配正自由空间，使得每个子元素左右空白相等。
- `space-between`：分配正自由空间，使得每个子元素之间的空白相等。

### `order`

设置在flex子元素上，决定子元素在容器中出现的顺序。默认值为1，值越小，出现顺序越靠前。

### `align-self`

设置在flex子元素上，单独设置某一子元素沿cross axis的对齐方式。

## 参考

- <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax">MDN Guides-控制Flex子元素在主轴上的比例</a>
- <a href="http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html">阮一峰的Flex布局教程-概念</a>
- <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox">MDN Guides-Flex布局的基本概念</a>
- <a href="http://www.ruanyifeng.com/blog/2015/07/flex-examples.html">阮一峰的Flex布局教程-示例</a>
