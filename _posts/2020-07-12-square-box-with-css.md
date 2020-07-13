---
layout: article
title: "使用CSS画一个正方形"
categories: "FrontEnd"
aside:
    toc: true
---

## 使用一个隐藏图片

让目标`div`元素包含一个用base64编码的正方形图片，就能使得元素始终为正方形。

## 使用`padding-bottom`属性

由于元素的`padding`属性的百分比是相对于父元素的宽度，所以我们可以设置目标`div`元素的`width`属性和`padding-bottom`属性为相同的百分比值来画出一个正方形。

## 画圆怎么办？

再设置`border-radius`为`50%`(`100%`也可以)即可。

## 能不能画三角形？

参见<a href="https://www.cnblogs.com/chengxs/p/11406278.html">CSS画三角形</a>和<a href="https://www.jianshu.com/p/9a463d50e441">原理</a>。