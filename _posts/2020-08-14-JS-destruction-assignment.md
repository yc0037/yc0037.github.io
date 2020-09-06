---
layout: article
title: "JS笔记-解构赋值"
categories: "FrontEnd"
aside:
    toc: true
---

解构赋值是ES6标准新增的一种特性，它允许我们方便地从数组和对象中提取某些值到变量中。

## 数组的解构
我们从一个例子开始：
``` js
let arr = ["Alan", "Turing"];

let [firstName, lastName] = arr;

console.log(`firstName: ${firstName}, lastName: ${lastName}`);
// firstName: ${Alan}, lastName: ${Turing}
```
可以看到，数组中每一个元素按照顺序被赋值给左边的变量。

这个例子更实用的使用方式是配合返回值是数组的函数：
``` js
let [firstName, lastName] = "Alan Turing".split(" ");

console.log(`firstName: ${firstName}, lastName: ${lastName}`);
// firstName: ${Alan}, lastName: ${Turing}
```
下面我们给出若干代码片段来说明数组解构赋值的一些特性和用法。
### 丢弃元素
``` js
// 添加逗号来跳过元素，最后的元素会被自动丢弃
let arr = ["Elizabeth", "Alexandra", "Mary", "Windsor", "..."];
let [name, , , family] = arr;

console.log(name);      // Elizabeth
console.log(family);    // Windsor
```
### 解构可迭代对象
``` js
let map = new Map([
    [ "Alice", 17 ],
    [ "Bob", 18 ],
    [ "Carol", 19 ],
    [ "Dave", 20 ]
]);
for (let [key, value] of map.entries()) {
    console.log(`${key} is ${value} years old.`);
}
```
### 交换变量
``` js
let val1 = 1;
let val2 = 2;
[val1, val2] = [val2, val1];

console.log(`${val1}, ${val2}`);    // 2, 1
```
### 结合扩展运算符
``` js
let arr = [1, 2, 3, 4, 5];
let [first, second, ...rest] = arr;
// 报错！扩展运算符的项只能出现在列表最后
// let [first, ...rest, last] = arr;

console.log(rest);  // [3, 4, 5]
```
### 设定默认值
``` js
let arr = ["Elizabeth"];
let [firstName = "Alice", lastName = "Anonymous"] = arr;

console.log(firstName); // Elizabeth
console.log(lastName);  // Anonymous
```

## 对象的解构
我们通过一个例子来展示对于对象的解构赋值：
``` js
let options = {
    width: 100,
    height: 200,
    title: "Menu",
    author: "Alice",    // 不需要的属性将被丢弃
    time: "2020-08-14"  // 或被收入rest变量中
};

let { width,            // 提取特定属性到同名变量中
      height = 100,     // 可以为变量设置默认值
      user: u = "Bob",  // 可以指定将特定属性提取到特定变量中
      ...rest           // 可以使用扩展运算符将剩余属性保存在rest对象中
    } = options;

console.log(`${width}, ${height}, ${u}, ${JSON.stringify(rest)}`);
// 100, 200, Bob, {"title":"Menu","author":"Alice","time":"2020-08-14"}
```
自然，也可以使用已有的变量进行解构赋值，但是会发生一些问题。请看下例：
``` js
let options = {
    width: 100,
    height: 200,
    title: "Menu"
};

let h, w, t;

// 无法执行！解释器会将花括号中的内容视为代码块。
// {height: h, width: w, title: t} = options;
// 将赋值语句用圆括号括起来就能解决这个问题：
({height: h, width: w, title: t} = options);

console.log(h, w, t);   // 200 100 Menu
```

## 嵌套结构的解构
解构赋值也可以支持复杂的嵌套结构。

对于嵌套的数组：
``` js
let arr = [1, 3, [5, 7], 9];

let [val1, , [val2, val3]] = arr;

console.log(val1, val2, val3); // 1 5 7
```
对于嵌套的对象：
``` js
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true               // 被丢弃
};

let {
  size: {                   // 把 size 赋值到这里
    width: w,
    height
  },
  items: [item1, item2],    // 把 items 赋值到这里
  title = "Menu"            // 在对象中不存在（使用默认值）
} = options;

console.log(width, height, item1, item2, title);
// 100 200 Cake Donut Menu
```

## 利用解构赋值处理函数参数
我们同样通过一个例子来说明如何利用解构赋值处理函数参数。
``` js
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

function showMenu({             // 通过解构赋值将传入的对象
  title = "Untitled",           // 解构成若干参数变量
  width: w = 100,
  height: h = 200,
  items: [item1, item2]         
} = {}) {                       // 设置参数默认值为空对象，
                                // 保证无参数时函数也能正常执行
  console.log( title, w, h );   // My Menu 100 200
  console.log( item1 );         // Item1
  console.log( item2 );         // Item2
}

showMenu(options);              // 调用时只需要构造并传入一个参数对象即可
```
## 其他类型的解构赋值
对于一些非对象的类型做解构赋值时，引擎首先尝试将变量转换成对象，然后进行解构赋值。
- 字符串类型的变量将被转换成一个类数组对象。
- 数值和布尔类型的变量将被转换成它对应的包装对象。
- `null`和`undefined`无法转换为对象，对它们进行解构赋值会出错。


