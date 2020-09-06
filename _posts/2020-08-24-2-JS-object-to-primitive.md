---
layout: article
title: "JS笔记-对象：原始值转换"
categories: "FrontEnd"
aside:
    toc: true
---

## 对象何时被转换成原始值？
对象向不同原始值的转换发生在不同的场景。
- 所有的对象在需要转换为布尔类型时都是`true`。
- 在对象相减或者被应用数学函数时，它们会被转换成数值类型。
- 在类似于需要输出一个对象的场景中，对象会被转换成字符串类型。

## 对象如何被转换成原始值？
[ECMA262标准](https://tc39.es/ecma262/#sec-toprimitive)规范了类型转换的行为。具体来说，为了将一个对象转换成原始值，JavaScript引擎会：
1. 调用`obj[Symbol.toPrimitive](hint)`，如果这个方法存在。
2. 否则，如果`hint`为`"string"`，那么依次尝试`obj.toString()`和`obj.valueOf()`。
3. 否则，如果`hint`为`"number"`或者`"default"`，那么依次尝试`obj.valueOf()`和`obj.toString()`。

`hint`指示应当做哪种转换。`"string"`将对象转为字符串，用于对一个对象执行期望一个字符串的操作。`"number"`将对象转为数字，通常发生在数学运算、比较大小等场景。如果运算符无法确定期望值的类型，那么`hint`为`"default"`。例如，二进制加法`+`可以用来连接字符串也可以用来对数字相加，因为无法确定期望的类型，所以按照`"default"`来进行转换。另一个例子是，如果将对象与其他非对象类型进行`==`比较，那么也会按照`"default"`来进行转换。（而`===`不会做任何转换——类型不同时会直接返回`false`）。事实上，绝大多数内部类型（除了`Date`）的`"default"`转换的实现都与`"number"`一致。

### `Symbol.toPrimitive`
`Symbol.toPrimitive`是一个内部Symbol，用来给转换方法命名。通过实现`obj[Symbol.toPrimitive]`方法，可以定义对象如何向原始值转换。请看下例：
``` js
let obj = {
    name: "Alice",
    age: 17,
    [Symbol.toPrimitive]: function(hint) {
        if (hint === "string") {
            return `Name: ${this.name}, Age: ${this.age}`;
        } else if (hint === "number" || hint == "default") {
            return this.age;
        }
    }
};

alert(obj);             // Name: Alice, Age: 17
console.log(+obj);      // 17
console.log(obj + 10);  // 27
```
### `toString`和`valueOf`
在没有`Symbol.toPrimitive`的时代，JavaScript使用`toString`和`valueOf`来将对象转换成原始值。

`toString`和`valueOf`必须返回一个原始类型，否则它们的返回值将被忽略，就好像不存在这个方法一样。

默认情况下，对象的`toString`方法返回一个固定的字符串`"[object Object]"`，而`valueOf`方法返回对象本身，这意味着它将被忽略。

通过`toString`和`valueOf`的组合，能够实现和上面使用`Symbol.toPrimitive`的方法一样的结果：
``` js
let obj = {
    name: "Alice",
    age: 17,
    toString: function() {
        return `Name: ${this.name}, Age: ${this.age}`;
    },
    valueOf: function() {
        return this.age;
    }
};

alert(obj);             // Name: Alice, Age: 17
console.log(+obj);      // 17
console.log(obj + 10);  // 27
```
实践中大多数情况下，通常只定义一个`toString`方法就已经足够了。


