---
layout: article
title: "JS笔记-对象：构造器，\"new\"操作符"
categories: "FrontEnd"
aside:
    toc: true
---

在以Java为代表的面向对象编程语言中，往往是先有类，再实例化出对象。这在我们需要许多结构类似的实体（如用户，列表项等）时非常有用。下面我们将看到，JavaScript通过构造器和`new`操作符给出了这一特性的一种实现方法。

## 构造器
构造器本质上是一个函数，所以也叫构造函数。习惯上，我们做两个约定：
- 构造器的命名只能由大写字母开头。
- 构造器只能通过`new`操作符来调用。

一个例子：
``` js
function User(name, age) {
    this.name = name;
    this.age = age;
    this.introduce = function() {
        console.log(`Name: ${this.name}, age: ${this.age}`);
    }
}

let user = new User("Alice", 17);
user.introduce();       // Name: Alice, age: 17
```
通过`new`操作符调用构造函数时，实际上执行了这样的操作：
1. 创建一个空对象，并将其赋给`this`。
2. 执行函数体，为`this`添加属性。
3. 返回`this`对象。
这样一来，我们就重用了创建对象的代码。这是构造器最根本的目的。

另一方面，如果创建某个对象的代码非常复杂，而又不需要（或者说，不希望）重用，那么可以用下面的方式将其封装起来：
``` js
let complicatedObject = new function() {
    // 创建对象的代码
}
```

如果构造函数有`return`语句，且`return`语句返回一个对象，那么构造函数将返回这个对象，而不是`this`。如果返回一个原始类型，那么返回值将被忽略，仍为`this`。
{:.warning}

### `constructor`和`instanceof`
从上面的讨论我们可以看到，使用`new`操作符加上构造器来创建对象，看起来与下面的方法没有什么区别：
``` js
function createUser(name, age) {
    let o = new Object();
    o.name = name;
    o.age = age;
    o.introduce = function() {
        console.log(`Name: ${this.name}, age: ${this.age}`);
    }
    return o;
}

let user = createUser("Alice", 17);
user.introduce();       // Name: Alice, age: 17
```
区别在于，使用构造器创建的对象具有一个`constructor`属性，它指向自己的构造函数。
``` js
// user是使用构造器User创建的
console.log(user.constructor);  // [Function: User]
```
这一特性可以用来判断对象的类型。更加可靠的方式是使用`instanceof`操作符，它对于对象在继承关系上的祖先也有效。
``` js
console.log(user instanceof User);      // true
console.log(user instanceof Object);    // true, 因为所有对象都继承自Object
```

### `new.target`
在构造器方法内部，可以通过`new.target`来检查它是否是通过`new`操作符进行调用的。如果是，那么`new.target`的值为构造器本身，否则为`undefined`。
``` js
function Tester() {
    if (new.target) {
        console.log("Called by new!");
    } else {
        console.log("Not called by new!");
    }
}
new Tester();   // Called by new!
Tester();       // Not called by new!
```

## `new`操作符的实现
// 待写



