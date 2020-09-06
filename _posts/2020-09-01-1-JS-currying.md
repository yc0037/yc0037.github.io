---
layout: article
title: "JS笔记-函数柯里化（Currying）"
categories: "FrontEnd"
aside:
    toc: true
---

## 定义
柯里化（Currying）是一种函数转换，它是指将函数从`f(a, b, c)`转换成`f(a)(b)(c)`。

我们举例说明。Lodash库提供了[`_.curry`](https://lodash.com/docs#curry)来对函数进行柯里化。

``` js
let _ = require("lodash");

function sum(a, b, c) {
    return a + b + c;
}

let curriedSum = _.curry(sum);

console.log( curriedSum(1, 2, 3) );     // 6
console.log( curriedSum(1)(2, 3) );     // 6
console.log( curriedSum(1)(2)(3) );     // 6
```
可以看到，经过柯里化后的函数既可以通过原本的方式进行调用，又可以通过[偏函数](/frontend/2020/08/14/JS-function-method.html#偏函数partial-functions)的方式进行调用。<span style="color: #bbbbbb; font-size: smaller;">为什么说是偏函数的方式呢？这是因为，<code>curriedSum(1)</code>返回的函数在调用方式上与绑定了第一个参数之后的<code>sum</code>是相同的。</span>

## 动机
引入函数柯里化的动机实际上与使用偏函数是一致的：我们希望基于一些通用的函数生成一些应用于具体场景的函数，从而避免重复传入同样的参数。但相对于偏函数，柯里化的形式更加灵活。

## 实现
首先我们来看一个简单的情形：函数参数的数目是固定的，只有两个，并且不要求函数能以原来的形式（也就是说`func(a, b)`）被调用。
``` js
function curryTwoArgs(func) {
    return function fa(a) {
        return function fb(b) {
            func(a, b);
        }
    }
}

function sum(a, b) {
    return a + b;
}

let curriedSum = curryTwoArgs(sum);

console.log(curriedSum(1)(2));      // 3
```
这段代码的原理不难理解：`curryTwoArgs(sum)`返回一个接收一个参数的函数`fa`（为了叙述方便，两个返回的函数都采用命名函数表达式的方式，实际上这是不必要的）。调用`curriedSum(1)`，返回另一个接收一个参数的函数`fb`。再调用`curriedSum(1)(2)`，也就是`fb(2)`，这是一个闭包——传给`fa`的值`1`对于`fb`是可见的。`fb`最终返回`func(1, 2)`，也就是被包装函数通过依次传入的参数调用的结果。

那么，如果参数的数目不固定，同时要求每次传入任意数量的参数进行调用，要怎么实现柯里化函数呢？
``` js
// 每次传入参数的数量是任意的！
curriedSum(1, 2, 3, 4, 5);
curriedSum(1)(2, 3, 4, 5);
curriedSum(1, 2)(3, 4)(5);
curriedSum(1)(2)(3)(4)(5);
```

我们可以做这样的实现：
``` js
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function pass(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}
```
让我们来看看这段代码是怎么工作的。

`curry`返回一个包装后的函数`curried`。它的行为取决于传入参数的个数：
- 如果传入参数的个数与被包装函数`func`接收参数的个数相同，或者传入的参数更多，那么直接将这些参数传递给`func`并调用它。
- 如果传入参数的个数少于`func`接收参数的个数，那么返回另一个函数`pass`。它收集后续传入的参数`args2`，并使用已经接收的参数`args`和后续传入的参数`args2`来重新调用`curried`函数。

换句话说，使用`curry`进行柯里化之后的函数会把已经接收到的参数列表保存在作用域里。每次调用时，它都会将收到的参数添加到这个列表中，并检查参数数量是否足够调用原来的函数。如果足够，那么就用参数列表中的参数调用它。如果不够，就继续收集参数。

由此可见，柯里化与偏函数本质上相似。柯里化可以使我们更方便地获取偏函数。

## 参考
- [柯里化 - 现代JavaScript教程](https://zh.javascript.info/currying-partials)
- [Lodash的curry实现](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L10157)
    - 可以看到，这个实现允许参数占位符（如`func(1)(_, 3)(2)`），功能更加强大。