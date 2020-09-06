---
layout: article
title: "JS笔记-对象：引用与复制"
categories: "FrontEnd"
aside:
    toc: true
---

## 通过引用来访问和复制对象
JavaScript中，变量通过引用的方式来访问对象，这可以类比到C++中的指针类型，或者Java中对于对象的引用方式。这意味着，变量存储的并不是对象本身，而是相当于对象所在的内存地址。

这一特性最直观的反映就体现在对象发生复制时。我们首先观察原始类型值进行复制后的表现：
``` js
let val1 = 10;
let val2 = val1;
console.log(val1, val2);    // 10 10
val2 = 20;
console.log(val1, val2);    // 10 20
```
可以看到，`val2 = val1`只是将`val1`的值赋给`val2`，修改`val2`的值不会影响到`val1`。

而对象的复制并不相同：
``` js
let obj1 = {
    name: "Alice",
    age: 17,
};
let obj2 = obj1;
console.log(obj1.name, obj2.name);      // Alice Alice
obj2.name = "Bob";
console.log(obj1.name, obj2.name)       // Bob Bob
```
语句`obj2 = obj1`实质上将变量`obj1`指向的对象的引用赋给了`obj2`，两个变量指向同一个对象，同一片内存地址，通过其中一个变量修改对象会影响到另一个对象。

因此，无论使用`==`还是`===`来比较两个指向对象的变量是否相等，实质上都是看它们是否指向同一个对象。

## 浅拷贝
如果我们希望为对象创建一个完全相同但互不影响的副本，怎么办呢？

一种简单的想法是，遍历这个对象的所有属性，并将其逐个添加到新的空对象中。
``` js
let obj = {
    name: "Alice",
    age: 17,
    isGraduated: false,
    school: {
        code: 110357,
        addr: "St.3 No.57",
    }
};

let copy = {};

for (let prop in obj) {
    copy[prop] = obj[prop];
}

copy.age = 18;
console.log(obj.age, copy.age);                 // 17 18
copy.school.code = 111445;
console.log(obj.school.code, copy.school.code); // 111445 111445
```
可以看到，对于原始类型的属性，`obj`和`copy`是互不影响的。但对于对象类型的属性，这种方式仍然是按引用复制，`obj`和`copy`共用同一个属性对象。我们称这种复制对象的方式为**浅拷贝**。
### `Object.assign`
ES6提供了`Object.assign`方法，用来合并多个对象。它本质上也是一种浅拷贝。

语法如下：
``` js
Object.assign(dest, [src1, src2, ..., srcN]);
```
其中：
- `dest`是目标对象，方法会修改这个对象。
- `src1, ..., srcN`是源对象。源对象的所有属性会被依次浅拷贝到`dest`中。如果源对象和一个或多个目标对象有同名属性，那么后面的对象的属性会覆盖前面的。
- 返回值为合并后的`dest`对象。

自然，可以用`Object.assign`来进行浅拷贝：
``` js
let obj = { ... };
let copy = Object.assign({}, obj);
```

事实上，`Object.assign`的内部就是采用`=`进行赋值，所以它不会复制属性描述符。
## 深拷贝
由上面的讨论可以知道，当属性是一个对象时，对象和它的浅拷贝共用这个对象。如果我们希望对象与它的拷贝拥有嵌套对象的两个互不影响的副本，那么就要用到**深拷贝**。

### 循环引用
深拷贝的实现比较复杂。一个主要的问题是循环引用。我们来看这样一个例子：
``` js
function func() {}

let arr = [];

let obj2 = { attr: "val", };

let obj = {
    a: 2,
    b: func,
    c: arr,
    d: obj2, 
};

arr.push(obj, obj2);
```
在这段代码中，`obj`的属性`c`是数组`arr`的引用，而数组`arr`中又包含对象`obj`的引用。如果采用深拷贝的方式，那么在复制`obj`时，要复制`arr`，而复制`arr`时又要复制`obj`，这就形成了一个死循环。

### 使用JSON对象来实现深拷贝
对于可序列化/JSON安全的对象，有一种巧妙的深拷贝方法：
``` js
let copy = JSON.parse(JSON.stringify(obj));
```

### 参考
- [结构化拷贝算法](https://html.spec.whatwg.org/multipage/structured-data.html#safe-passing-of-structured-data)
- [lodash的深拷贝实现](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L2620)
- [深拷贝终极探索](https://segmentfault.com/a/1190000016672263)
