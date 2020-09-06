---
layout: article
title: "JS笔记-函数方法：call, apply和bind"
categories: "FrontEnd"
aside:
    toc: true
---

## `call`与`apply`
JS的函数内部包含两个方法`call`和`apply`，用来在特定的作用域中调用函数。它们的用法见下面的例子：
``` js
function setName(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    console.log(firstName, lastName);
}

// 使用var而不是let/const声明变量
// 在浏览器中，它们会成为全局对象window的属性
var firstName = "Default";
var lastName = "Anonymous";
console.log(firstName, lastName); // Default Anonymous

// 严格模式下，下面的语句会报错，因为this的值为undefined
// 非严格模式下，在浏览器中，下面的语句会修改变量firstName和lastName的值
setName("Alice", "Margatroid");
console.log(firstName, lastName); // Alice Margatroid

let president = new Object();
// Function.call(context, ...args)
// context是用来作为函数调用中this的对象，args是传给函数的参数列表
// 如果使用扩展运算符，那么args应当为一个可迭代对象
setName.call(president, "Donald", "Trump");
console.log(president.firstName, president.lastName); // Donald Trump

let he = new Object();
// Function.apply(context, arguments)
// context用来设置函数调用中的this，arguments是一个存放参数的类数组对象
setName.apply(he, ["Karl", "Marx"]);
console.log(he.firstName, he.lastName); // Karl Marx

// 事实上，上面两种方法与下面的过程效果相同
// 区别在于，它们不会为对象增加一个函数属性
let someone = new Object();
someone.setName = setName;
someone.setName("Test", "Try");
console.log(someone.firstName, someone.lastName); // Test Try
```
经过观察不难发现，`call`和`apply`在设定函数作用域方面的功能是一致的——它们都为函数调用设定了`this`的值。唯一的区别在于传递参数的方式：

- `call`可以将参数逐一列出，自然也可以用扩展运算符的方式传参，但这要求参数集合为可迭代对象。
- `apply`要求传入的参数为一个类数组对象（就像函数的`arguments`对象一样）。

通常来说，如果目标参数为数组，那么采用两种方式都可以，但`apply`的效率更高。

另一方面，使用`call`和`apply`来对对象调用函数，事实上降低了函数与对象的耦合，这也是它们的一个主要的好处。下面我们还会看到`call`和`apply`的其他应用场景。

## 装饰器
装饰器（或者包装器）是一种特殊的函数，它可以改变函数的行为而不必修改函数本身。

下面给出一个简单的装饰器的实现，它计数被装饰函数被调用的次数，并在每次调用时输出这个次数。
``` js
function callCounter(func) {
    let ret = function f() {    // 对原函数func进行包装
        ++f.counter;            // 每次调用增加计数
        console.log(f.counter); // 并输出被调用次数
        func(...arguments);     // 调用原函数，传入所有参数
    }
    ret.counter = 0;            // 初始化计数变量
    return ret;                 // 返回包装后的函数
}

function doNothing() {}

doNothing = callCounter(doNothing); // 用包装好的函数替代原函数

doNothing();  // 1
doNothing();  // 2
doNothing();  // 3
```
使用装饰器来改变函数的行为有如下的好处：
- 装饰器的功能是可重用的。
- 装饰器与被装饰函数之间相互独立。这在被装饰函数来自第三方库或者十分复杂时很有帮助。
- 可以在同一个函数上应用多个装饰器，它们互不影响。

上面这个装饰器的实现在包装对象方法时会发生错误。例如：
``` js
let obj = {
    val: 0,
    increment() {
        this.val++;
    }
}

// 使用上面定义的callCounter装饰器来包装对象方法
obj.increment = callCounter(obj.increment);

obj.increment(); // TypeError: Cannot read property 'val' of undefined
```
问题在于`this`的值。`callCounter`返回的函数内部调用`obj.increment`时，丢失掉了它的上下文信息，`this`取到默认值`undefined`，从而导致对象方法不能正常地被调用。

使用`call`和`apply`恰恰能够解决这个问题。
``` js
function callCounter(func) {
    let ret = function f() {
        ++f.counter;
        console.log(f.counter);
        // 使用call/apply来调用被包装函数
        // 两种写法在结果上是等价的
        func.call(this, ...arguments);
        // func.apply(this, arguments);
    }
    ret.counter = 0;
    return ret;
}
```
让我们来看看修改后的装饰器如何传递`this`。
1. 使用装饰器包装成员方法，`obj.increment`现在是包装后的函数`f`。
2. 调用`obj.increment()`，参数在`arguments`中，而`this`为`obj`，因为它出现在成员方法调用的`.`运算符前面。
3. 在包装后的函数内部，`call`/`apply`方法将`this`和参数传给被装饰函数。

装饰器的一个缺点是，它会丢掉被包装函数的属性。

## 方法借用（method borrowing）
使用`call`和`apply`能够实现的另一个有意思的功能是方法借用。设想我们要处理函数的`arguments`对象。它是一个类数组对象，也是一个可迭代对象，但它不是一个真正的数组——它没有数组方法。试图调用`arguments.join(",")`这样的语句会引发错误。这种情况下，我们可以利用方法借用的机制，从数组里“借来”`join`方法：
``` js
[].join.call(arguments);
```
我们能够这样做的原因在于，`join`的内部实现用到了`this`——它向结果字符串依次追加`this[0]`，`glue`，`this[1]`，`glue`，……，直到所有数组元素都被加到结果字符串中。

## `bind`
从上面的讨论我们可以知道，将对象方法作为参数传递时，会丢失调用的上下文`this`。下面是一个常见的发生这种问题的场景，我们设定在一段时间后调用某个对象方法：
``` js
let obj = {
    msg: "Hello World!",
    greet() {
        console.log(this.msg);
    }
};

setTimeout(obj.greet, 1000);    // undefined
```
我们看到，它并没有按照预期的方式执行，这是因为将`obj.greet`作为参数传递给`setTimeout`的时候，它的`this`丢失了，从而取到默认值。在浏览器中，这个默认值通常为全局对象`window`，而在Node.js里是一个计时器（Timer）对象（这是因为它作为`setTimeout`的参数被传递）。

一个解决方案是，通过一个包装函数显式地调用对象方法：
``` js
setTimeout(() => obj.greet(), 1000);    // Hello World!
```
但这是不安全的。如果在函数被调用之前，`obj`的值发生了变化，调用就不能按照预期进行：
``` js
setTimeout(() => obj.greet(), 1000);    // Goodbye!
obj = Object.assign({}, obj, { msg: "Goodbye!" });
```
JS提供了一个`bind`方法，可以将函数与调用上下文（`this`）绑定：
``` js
let objGreet = obj.greet.bind(obj);
setTimeout(objGreet, 1000);     // Hello World!
obj = Object.assign({}, obj, { msg: "Goodbye!" });
```
这样一来，调用`objGreet`时传入的参数会被原样传递给`obj.greet`，并且将调用上下文`obj`也传递给`obj.greet`，它执行时的`this`值将被设定为`obj`。

事实上，`bind`绑定的似乎是对象的引用/地址。如果在函数调用之前对象本身发生了修改，那么这种修改对`bind`它之后的函数调用是可见的。
``` js
let objGreet = obj.greet.bind(obj);
setTimeout(objGreet, 1000);     // Goodbye！
obj.msg = "Goodbye!";
```

## 偏函数（partial functions）
`bind`方法不仅可以绑定`this`，还可以绑定参数：
``` js
func.bind(context[, arg1[, arg2 ...]]);

// 一个例子
function mul(a, b) { return a * b; }
let double = mul.bind(null, 2);
console.log(double(4));     // 8
```
如果希望在上下文还不知道的情况下绑定参数，怎么办呢？我们可以配合`call`/`apply`来实现一个`partial`包装函数：
``` js
function partial(func, ...argsBound) {
    return function(...args) {
        func.call(this, ...argsBound, ...args)
    }
}

let obj = {
    id: 10011,
    saySomething(msg, end) {
        console.log(`From ${this.id}: ${msg}! -- ${end}`)
    }
};

obj.saySomething = partial(obj.saySomething, "Hello World");
obj.saySomething("Alice");     // From 10011: Hello World! -- Alice
```
事实上，[lodash](https://lodash.com/docs/4.17.15#partial)这样的库也提供了`partial`的实现。
