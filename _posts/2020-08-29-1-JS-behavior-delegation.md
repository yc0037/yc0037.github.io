---
layout: article
title: "JS笔记-对象：委托"
categories: "FrontEnd"
aside:
    toc: true
---

我们已经知道，JavaScript并不是一个面向类和继承设计的面向对象语言。一种常见的实践是，使用原型链和显式伪多态来模拟类和继承的行为。事实上，存在一种更接近JavaScript原型机制本质、表达方式更加简洁的设计模式——**行为委托模式**。

行为委托的核心思想是，如果一个对象的某些行为需要借助另一个对象的方法来完成，那么就使用原型链将它们关联起来。

我们还是通过一个例子来说明行为委托的实现。
``` js
let Foo = {
    init(value) {
        this.value = value;
    },
    getValue() {
        return this.value;
    }
};

let Bar = Object.create(Foo);
Bar.create = function create(value) {
    this.init(value);
    console.log(`A Bar is created.`);
}
Bar.printValue = function printValue() {
    console.log(`My value is ${this.getValue()}!`);
}

/** 
 ** 另一种更现代的实现是使用Object.setPrototypeOf **

let Bar = {
    create(value) {
        this.init(value);
        console.log(`A Bar is created.`);
    }

    printValue() {
        console.log(`My value is ${this.getValue()}!`);
    }
}

Object.setPrototypeOf(Bar, Foo);

*/


let bar1 = Object.create(Bar);
bar1.create(42);                // A Bar is created.
bar1.printValue();              // My value is 42!

let bar2 = Object.create(Bar);
bar2.create(21);                // A Bar is created.
bar2.printValue();              // My value is 21!
```
在这段代码实现里，有几个值得注意的点：
1. 不存在类。虽然在这里，有的对象名以大写字母开头，但它们并不是类。一切都是对象，它们位于同一层次，通过行为委托的方式相互关联。
2. 不是用方法重写，而是用内部委托。`Bar`的`create`方法在内部通过委托的方式调用`Foo`的`init`方法，而不是直接重写`init`方法。事实上，委托的设计模式要求尽量避免原型链上的方法出现相同的命名。一方面，这样可以规避JavaScript的一些难以理解的机制（如[属性屏蔽](http://localhost:4000/frontend/2020/08/25/1-JS-object-prototype.html#prop-shadowing)）；另一方面，这可以增强程序的可读性（例如，函数名的描述性更强）。
3. 这种实现下对象的所有行为表现都和使用类与继承时没有区别——我们只是抛弃了类和继承的概念。

