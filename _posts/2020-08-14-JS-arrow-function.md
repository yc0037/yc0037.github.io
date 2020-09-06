---
layout: article
title: "JS笔记-箭头函数"
categories: "FrontEnd"
aside:
    toc: true
---

ES6标准增加了一种定义函数的方式，称为**箭头函数**。
## 用法
``` js
/****    参数 => 返回值    ****/
let func1 = v => v * v;

/****    可以用圆括号括起参数    ****/
let func2 = () => 3.14;
let func3 = (arg1, arg2) => arg1 + arg2;

/****    多于一行的函数体用花括号括起    ****/
let func4 = (msg) => {
    console.log(msg);
    return msg;
}

/****    返回对象时要给对象加一个圆括号    ****/
let func5 = () => ({name: "Alice", age: 17});

/****    使用解构赋值传参    ****/
function print(...args) {
    console.log(...args);
    return 1;
}
// 函数体语句仅有一条，且不返回任何值时，在语句前加一个void
let func6 = ({first, last}) => void print(first, last);
let obj = { first: "Alan", last: "Turing" };
console.log(func6(obj));    // Alan Turing undefined
```

## 箭头函数的`this`
箭头函数没有自己的`this`。箭头函数中`this`的值取决于它外部函数的`this`值。
``` js
function showThis() {
    let run = () => console.log(this);
    let run2 = function() { console.log(this); }
    run();
    run2();
}

showThis();
// undefined undefined
let obj1 = { name: "obj1" };
let obj2 = { name: "obj2", son: { name: "obj2's son" } };
obj1.showThis = showThis;
obj1.showThis();
// { name: 'obj1', showThis: [Function: showThis] } undefined
obj2.son.showThis = showThis;
obj2.son.showThis();
// { name: "obj2's son", showThis: [Function: showThis] } undefined
```

可以看到，箭头函数`run`中的`this`随着外部函数`showThis`的`this`变化而变化，而普通函数表达式`run2`的`this`始终为默认值`undefined`。

这意味着箭头函数不能作为构造函数。

## 箭头函数没有`arguments`
箭头函数中没有`arguments`对象。只能使用rest参数来处理非命名参数。

这意味着我们可以在箭头函数中直接访问外层函数的`arguments`对象。

## 总结
我们可以看到，箭头函数没有`this`和`arguments`，亦即它不存在自己的上下文，而是在自己所在的上下文中发挥作用。