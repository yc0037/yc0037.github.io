---
layout: article
title: "CSS笔记-盒模型"
categories: "前端"
aside:
    toc: true
---

## 组成部分

CSS的盒模型由四个部分组成, 如下图.

<div style="text-align: center;">
<img src="https://media.prod.mdn.mozit.cloud/attachments/2019/03/19/16558/29c6fe062e42a327fb549a081bc56632/box-model.png" width="50%">
</div>

### Content box

Content box区域用来显示内容. 通过设置`width`和`height`属性可以调整它的大小.

#### 标准盒模型与替代(IE)盒模型

CSS默认采用标准盒模型, 在这种条件下, `width`和`height`属性设置的是content box本身的大小, 而整个盒子的width为$w_c+2w_p+2w_b$, height为$h_c+2h_p+2h_b$. 注意到**margin box的大小并不计算入盒子的大小**, 但是会影响盒子外部的空间.

而在替代(IE)盒模型下, `width`和`height`属性设置的是**整个盒子**的大小, 而content box的大小要减去边框和内边距. 

如果要对某个元素应用替代盒模型, 只需要设置它的`box-sizing`属性为`border-box`. 若要为所有元素应用替代盒模型, 则按如下设置, 使得所有元素继承根元素的规则:

```css
html {
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: inherit;
}
```

IE8以前的IE默认应用的是替代盒模型且不可切换, IE8+支持通过`box-sizing`进行切换.

### Padding box

Padding box表示内边距, 即包裹在content box外部的空白区域. 通过设置`padding`属性可以改变它的大小, 数值取值只能为0或正数. 内边距会<q>push the content away from the border</q>.

可以使用`padding`简写属性来设置它的大小, 也可以单独设置每一边: 

- `padding-top`
- `padding-right`
- `padding-bottom`
- `padding-left`

关于简写属性: 
```css
/* 设置上下左右内边距都为10px */
.box1 {
    padding: 10px;
}

/* 设置上下内边距为10px, 左右内边距为20px */
.box2 {
    padding: 10px 20px;
}

/* 设置上内边距为10px, 左右内边距为20px, 下内边距为30px */
.box3 {
    padding: 10px 20px 30px;
}

/* 设置上、右、下、左内边距依次为10px, 20px, 30px, 40px */
.box4 {
    padding: 10px 20px 30px 40px;
}
```

### Border box

Border box表示盒子的边框. 通过设置`border`属性可以改变盒子边框的样式.

可以用来设置边框样式的属性有:

- `border`: 设置所有边框的宽度、颜色和样式. 如`border: 1px black solid;`.
- `border-left`: 单独设置某条边框的宽度、颜色和样式. 如`border-left: 2px dotted blue;`.
- `border-width`/`border-style`/`border-color`: 设置所有边框的宽度、样式或颜色. 该属性同样可以通过上述简写属性的方式分别对每条边框进行设置.
- `border-top-color`: 单独设置某条边框的宽度、样式或颜色.

边框样式`border-style`可能的取值包括:
- `none`: 无边框. 这是该属性的默认取值, 也就是说, 如果不设置`border-style`, 那么对其他边框样式属性的设置都不会显示, `border-width`会被计算为0. 
- `hidden`: 隐藏边框. 它的效果与`none`相同, 区别在于, 如果存在重叠的边框, 在`none`的条件下, 其他重叠的边框会显示, 而在`hidden`的条件下, 没有边框会显示.
- `solid`/`double`: 边框为实线/双实线.
- 其他可能的取值参见<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-style">MDN参考文档-<code>border-style</code></a>.

### Margin box

Margin box表示外边距, 亦即包裹整个盒子的外部空白区域. 通过设置`margin`属性可以改变它的大小, 数值取值可以为负数、0或正数. Margin box会将其他元素从盒子周围推开. 

同样可以通过简写属性和等价的普通属性来控制margin box的大小, 这里略去.

如果有两个外边距相接的元素, 那么这两个外边距会合并为一个外边距, 其大小取较大的外边距的大小. 会导致外边距重叠的情况参见<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing">MDN参考文档-外边距重叠</a>.

## 外部显示类型

盒子的外部显示类型决定它在**页面流**(page flow)和**元素之间的关系**方面表现出的行为. 通过对`display`属性的设置可以改变盒子的外部显示类型.

### 块级盒子

设置盒子的`display`属性为`block`时, 盒子的外部显示类型被定义为块(block)级. 它会表现出以下行为:

- 盒子在所在行(inline)的方向上扩展, 占据该方向上的所有可用空间, 绝大多数情况下意味着与父容器等宽.
- 每个盒子都会换行.
- `width`属性和`height`属性会发挥作用.
- 内外边距和边框会起作用, 并把其他元素从当前盒子周围推开.

### 内联盒子

设置盒子的`display`属性为`inline`时, 盒子的外部显示类型被定义为内联(inline). 它会表现出以下行为:

- 盒子不会产生换行.
- `width`和`height`属性不起作用.
- **垂直**方向的内外边距和边框会被应用, 但是**不会**把其他处于inline状态的盒子推开.
- **水平**方向的内外边距和边框会被应用, 同时**会**把其他处于inline状态的盒子推开.

用做链接的`<a>`元素, `<span>`, `<em>`以及`<strong>`等元素都是默认处于inline状态的.

### `inline-block`

介于`inline`和`block`之间的一种外部显示模式. 它的行为模式与块级盒子一致, 除了**不会引起换行**之外.

下面是一些例子:

<style>
    .cbm {
        border: 1px solid black;
        background-color: #b0d5df;
        width: 10em;
        height: 3em;
        padding: 10px;
        margin: 30px;
    }
    .cbm.block {
        display: block;
    }
    .cbm.inline-height {
        display: inline;
        height: 100px;
    }
    .cbm.inline-padding {
        display: inline;
        padding: 50px;
    }
    .cbm.inline-block {
        display: inline-block;
    }
</style>
<div class="example">
<p>Lorem ipsum dolor sit amet, <b>block示例</b>&rarr;<span class="cbm block">示例文字</span> consectetur adipiscing elit. Nulla iaculis magna non tortor sagittis, vel tempor lectus finibus.Aenean vestibulum consectetur efficitur. Sed et lorem at nisi porta accumsan vitae sed ante.</p>
<hr />
<p>Lorem ipsum dolor sit amet, <b>inline示例, 应用height</b>&rarr;<span class="cbm inline-height">示例文字</span> consectetur adipiscing elit. Nulla iaculis magna non tortor sagittis, vel tempor lectus finibus.Aenean vestibulum consectetur efficitur. Sed et lorem at nisi porta accumsan vitae sed ante.</p>
<hr />
<p>Lorem ipsum dolor sit amet, <b>inline示例, 应用padding</b>&rarr;<span class="cbm inline-padding">示例文字</span> consectetur adipiscing elit. Nulla iaculis magna non tortor sagittis, vel tempor lectus finibus.Aenean vestibulum consectetur efficitur. Sed et lorem at nisi porta accumsan vitae sed ante.</p>
<hr />
<p>Lorem ipsum dolor sit amet, <b>inline-block示例</b>&rarr;<span class="cbm inline-block">示例文字</span> consectetur adipiscing elit. Nulla iaculis magna non tortor sagittis, vel tempor lectus finibus.Aenean vestibulum consectetur efficitur. Sed et lorem at nisi porta accumsan vitae sed ante.</p>
</div>

使用的CSS如下:
```css
    .cbm {
        border: 1px solid black;
        background-color: #b0d5df;
        width: 10em;
        height: 3em;
        padding: 10px;
        margin: 30px;
    }
    .cbm.block {
        display: block;
    }
    .cbm.inline-height {
        display: inline;
        height: 100px;
    }
    .cbm.inline-padding {
        display: inline;
        padding: 50px;
    }
    .cbm.inline-block {
        display: inline-block;
    }
```