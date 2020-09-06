---
layout: article
title: "JS笔记-对象：原型"
categories: "FrontEnd"
aside:
    toc: true
---

<style>
    ol ol {
        list-style-type: lower-roman;
    }
</style>

继承是面向对象编程中的一个重要的概念。JavaScript通过**原型（prototype）**的方式模拟继承，我们称之为**原型继承（prototypal inheritance）**。

## `[[Prototype]]`
用两对方括号括起的属性表示JavaScript的内部属性。`[[Prototype]]`就是对象的一个隐藏的内部属性，它往往为另一个对象的引用（或`null`），这个对象称为当前对象的“**原型**”。

有两种方式可以访问到对象的原型。其一是通过`obj.__proto__`，它相当于`[[Prototype]]`的getter/setter（[具体实现](https://es6.ruanyifeng.com/#docs/object-methods#__proto__%E5%B1%9E%E6%80%A7)）。这个属性已经被规范标记为deprecated，且必须仅在浏览器环境下才得到支持，但是事实上，几乎所有环境都支持这个属性。另一种方式是通过对象的原型方法`Object.getPrototypeOf(obj)`和`Object.setPrototypeOf(obj, proto)`，这也是现代JavaScript推荐使用的方法。

`[[Prototype]]`的作用是，当我们试图访问对象的某个属性时，如果对象不存在这个属性，那么JavaScript会自动到`[[Prototype]]`中去获取这个属性。我们会在下面详细讨论`[[Prototype]]`的这个特点，现在我们先看一个例子：
``` js
let base = {
    name: "base",
    say() {
        console.log(this.name);
    }
};

let derived = {
    __proto__: base,
    self: "derived",
};

let anotherDerived = {
    self: "anotherDerived",
}

Object.setPrototypeOf(anotherDerived, base);

console.log(derived.name, derived.self);                    // base derived
console.log(anotherDerived.name, anotherDerived.self);      // base anotherDerived

derived.say();      // base
```
当我们想要读取`derived`的`name`时，JavaScript在它的原型`base`上找到了这个属性。

有几点值得注意：
- 对象的原型（`[[Prototype]]`）只能是对象或者`null`，其他的类型会被忽略。
- JavaScript不允许多继承。一个对象只能有零或一个原型。
- 循环继承也是不被允许的。如果原型链出现环，JavaScript会报错。
- `for ... in`循环会迭代到所有继承来的属性。

### `[[Get]]`和`[[Put]]`
现在我们来看一看，当我们读取和赋值类的属性时，究竟发生了什么。

首先是读取属性。
``` js
let obj = {
    val: 42,
};

console.log(obj.val);   // 42
```
当我们通过`obj.val`读取对象属性时，实际上是调用了对象内部的`[[Get]]`操作。它首先在对象本身的属性中查找`val`，如果找到，就会返回这个属性的值。

但如果没有找到这个属性，那么`[[Get]]`会沿着原型链向上查找。也就是说，查看`obj`的`[[Prototype]]`上是否存在这个属性，如果存在，则返回；如果不存在，则到它的`[[Prototype]]`上去找，直到找到对应的属性，或者`[[Prototype]]`为空。

<br />

对属性进行赋值的情况更加复杂。

当我们对属性进行赋值时，事实上是调用了对象的`[[Put]]`操作。注意，我们现在讨论的仅是使用等号`=`进行赋值的情况：
``` js
obj.attr = "something";
```

<div id="prop-shadowing"></div>

如果被赋值的属性**已经存在**于当前对象，那么`[[Put]]`会进行如下操作：
1. 查看属性是否为访问描述符。如果是，并且存在setter方法，那么就调用它。
2. 查看属性描述符中的`writable`是否为`false`。如果是，那么在非严格模式下会静默失败，在严格模式下会报`TypeError`。
3. 如果都不是，则设置属性值。

另一种情况下，被赋值的属性（`attr`）**并不存在**于当前对象（`obj`）。这种情况下，`[[Put]]`的行为比较复杂：
1. 遍历原型链，查找`attr`。如果找不到，那么就会在当前对象`obj`上创建这个属性并赋值。
2. 如果在原型链上的某个对象里找到了属性`attr`，那么将有三种情况：
    1. 如果`attr`是数据属性且`writable`为`true`，那么**会在当前对象`obj`上添加一个名为`attr`的新属性**。这种特性称为**屏蔽属性**。也就是说，`obj`用一个新的属性屏蔽了本该继承而来的同名属性。
    2. 如果`attr`是数据属性，但`writable`为`false`，那么**没有属性会被修改**。严格模式下，这个操作会导致一个Error；非严格模式下，这条赋值语句会被忽略。
    3. 如果`attr`是访问器属性（也就是说，通过setter来进行赋值），那么**会调用这个setter**（相当于执行了一次函数调用）。对属性的修改会作用到原型链上的属性。`attr`的setter不会被修改。`obj`上也不会创建一个新的`attr`。
这种怪异的行为主要是在模拟类属性的继承——亦即，你不能修改从父类继承而来的只读属性。

然而，如果使用`Object.defineProperty`方法来添加或修改属性，那么属性总是会被添加到`obj`上，成为一个屏蔽属性。

有些时候，属性屏蔽会以一种极其微妙的方式发生。请看此例：
``` js
let base = {
    a: 42,
};

let derived = {
    __proto__: base,
};

console.log(base.a, derived.a);             // 42 42

console.log(base.hasOwnProperty("a"));      // true
console.log(derived.hasOwnProperty("a"));   // false

derived.a++;    // 属性屏蔽发生了！

console.log(base.a, derived.a);             // 42 43

console.log(derived.hasOwnProperty("a"));   // true
```
这其中的关键之处在于自增运算符`++`：它相当于`derived.a = derived.a + 1`。也就是说，它首先读取`derived.a`，这一步通过原型链找到了`base`中属性`a`的值。然后，它对`derived.a`进行赋值，根据上面的讨论，JavaScript会在`derived`中创建一个新的`a`，屏蔽掉`base`中的同名属性。

## 构造函数的`prototype`
我们已经知道，使用形如`new F()`的方式可以从函数`F`创建新的对象。如果我们想要为通过`F`创建的所有对象都设置某个特定的原型（直接父类），要怎么做呢？手动为每个对象设置`__proto__`当然是一种办法，但更方便的方式是设置`F.prototype`。

每个函数`F`都有`prototype`属性。如果`F.prototype`是一个对象，那么当我们通过`new`操作符调用`F`时，生成的所有对象的`[[Prototype]]`都会指向这个对象。

我们用一个例子来说明：
``` js
let animal = {
  eats: true
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

let rabbit = new Rabbit("White Rabbit"); //  rabbit.__proto__ == animal

alert( rabbit.eats ); // true
```

通过设置函数`Rabbit`的`prototype`属性，`new Rabbit(...)`创建的对象的`__proto__`都被设置成了`Rabbit.prototype`指向的对象。用图来表示这种关系更加清晰直观：

<div style="text-align: center;">
<img src="http://lyc0037.gitee.io/pics/img/20200826112253.png" width="60%">
</div>

注意：`prototype`只是一个普通的属性，与其他属性没有本质上的区别。只有在使用`new`调用函数时，`prototype`才会被用来给新创建的对象的`[[prototype]]`赋值。

### 深入`prototype`属性：`constructor`
每个函数都有`prototype`属性。默认情况下，它是一个只有`constructor`属性的对象，这个属性指向函数本身。

之前我们知道，通过构造函数创建的对象都拥有一个`constructor`属性，指向用来创建自身的构造函数。现在我们知道，这个`constructor`属性实质上是通过自身的原型进行访问的。
``` js
function F() {}

console.log(F.prototype.constructor === F);     // true

let f = new F();                // f.__proto__ === F.prototype
console.log(f.constructor);     // [Function: F]
                                // 这是因为，对f.constructor的读取沿原型链上溯，
                                // 其实是读取f.__proto__.constructor，
                                // 也就是F.prototype.constructor，即F本身
```
可以使用对象的`constructor`属性来创建与当前对象使用相同构造函数的新对象。
``` js
function F(val) {
    this.val = val;
    this.run = () => {
        console.log(this.val);
    }
}

let f1 = new F(17);
f1.run();   // 17
let f2 = new f1.constructor(18);
f2.run();   // 18
```
但需要注意的是，JavaScript引擎不保证`constructor`的值。我们可以任意修改和删除它，甚至替换掉整个`prototype`对象，以至于`prototype`中根本没有`constructor`属性。

所以，正常情况下，我们改写函数的`prototype`属性时，一定注意不要丢掉`constructor`。

## `Object.create`
可以使用`Object.create(proto[, descriptor])`方法来创建一个新的空对象，使得它以指定对象`proto`为原型（`[[Prototype]]`），并为它添加`descriptor`中的属性描述符表示的所有属性。

利用这个方法，我们可以实现一个更加完整的对象拷贝方式，它能拷贝对象自身所有的属性，无论它们是否可枚举、是数据类型还是访问器类型，并且带有正确的`[[Prototype]]`：
``` js
let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

## 原型风格的“类”
现在，我们可以用原型来模拟面向对象中“类”的行为，使之大体按照我们期望的那样工作。
``` js
function Base(value) {
    this.value = value;                                 // (0)
}

Base.prototype.getValue = function() {                  // (1)
    return this.value;
}

function Derived(value, label) {
    Base.call(this, value);                             // (2)
    this.label = label;
}

Derived.prototype = Object.create(Base.prototype);      // (3)
Derived.prototype.constructor = Derived;                // (4)

Derived.prototype.getLabel = function() {               // (5)
    return this.label;
}

let obj = new Derived(42, "answer");

console.log(obj.getValue());                            // 42
console.log(obj.getLabel());                            // answer
```
对代码中的几处要点进行说明：

**（0）**在构造函数中初始化类的属性。这样一来，所有通过这个构造函数创建的实例都具有各自独立的属性，互不影响。

**（1）**“类”的方法定义在构造函数的`prototype`上。这是为了让所有通过这个构造函数创建的实例共享同一个函数的引用（通过`[[Prototype]]`）。这一方面节省了内存，另一方面能够保证同一个“类”的对象的行为是一致的。

**（2）**`Derived`类“继承”`Base`类。如果我们不使用`super`关键字的话，就只能显式地调用`Base`的构造函数，这种方式被称为**显式伪多态**。显然，这远非一种优雅的写法。

**（3）**这是这段代码的关键之处：它使用`Object.create`创建了一个新的空对象，它的`[[Prototype]]`是`Base.prototype`，并用它来替换`Derived.prototype`。这样一来，通过`Derived`创建的所有对象都拥有了`Base.prototype`上的方法。

这行代码有两种替代的写法：
``` js
// 第一种使用__proto__，它在ES6被写入标准，可能不被所有平台兼容
Derived.prototype.__proto__ = Base.prototype;

// 第二种使用Object.setPrototypeOf，它也是ES6增加的访问原型的方法
// 它的好处在于，可以在原本的Derived.prototype上进行修改，规避了新建对象带来的性能开销
// 但它的语法更加复杂
Object.setPrototypeOf(Derived.prototype, Base.prototype);
```

**（4）**由于（3）行替换了默认的`Derived.prototype`，`constructor`随之丢失，需要将它原样恢复。
**（5）**在关联`Base`和`Derived`的`prototype`之后，我们才能向`Derived.prototype`添加方法。

## 参考阅读
[原型简史](https://zh.javascript.info/prototype-methods#yuan-xing-jian-shi)
