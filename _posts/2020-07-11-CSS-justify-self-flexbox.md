---
layout: article
title: "在flexbox中实现分别左右对齐的效果"
categories: "FrontEnd"
aside:
    toc: true
---

> 参见<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Alignment/Box_Alignment_in_Flexbox">MDN参考文档-flexbox中的盒子对齐</a>。

要在flexbox的布局模式下实现一组元素左对齐，而另一组元素右对齐，可以采用这样的方式：

```html
<div class="box">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div class="push">Four</div>
  <div>Five</div>
</div>
```

```css
.box {
    display: flex;
}
.push {
    margin-left: auto;
}
```

效果：

<style>
    .box {
        display: flex;
        height: 80px;
    }
    .ex-box {
        border: 2px solid #1a94bc;
        border-radius: 10px;
        flex: 0 1 6em;
        text-align: center;
        line-height: 80px;
        font-size: 1.2em;
        background-color: #5cb3cc;
    }
    .push {
        margin-left: auto;
    }
</style>
<div class="example">
    <div class="box">
        <div class=" ex-box">One</div>
        <div class=" ex-box">Two</div>
        <div class=" ex-box">Three</div>
        <div class="push ex-box">Four</div>
        <div class=" ex-box">Five</div>
    </div>
</div>