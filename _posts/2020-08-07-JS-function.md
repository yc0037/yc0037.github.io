---
layout: article
title: "JS笔记-函数"
categories: "FrontEnd"
aside:
    toc: true
---

## 定义函数
有三种方式可以定义函数。
``` js
// 函数声明
function sum(num1, num2) {
    return num1 + num2;
}

// 函数表达式
let sum = function(num1, num2) {
    return num1 + num2;
}
// 或者可以使用箭头函数
let sum = (num1, num2) => (num1 + num2);

// 使用Function构造函数（不建议使用，影响性能）
let sum = Function("num1", "num2", "return num1 + num2");
```
三种方式在意义上没有区别。
### 函数声明提升
使用函数表达式和函数声明来定义函数，唯一的区别在于，在代码开始之前，解析器会先读取所有的函数声明，并将它们放在源代码树的顶部，这一过程叫做**函数声明提升**。这样一来，通过函数声明定义的函数就可以在任何地方调用——包括代码中定义它的位置之前；而通过函数表达式定义的函数只有在定义之后才能使用。
``` js
// correct
alert(sum(10, 20));
function sum(num1, num2) {
    return num1 + num2;
}

// wrong
alert(sum(10, 20));
let sum = function(num1, num2) {
    return num1 + num2;
}
```

## 作为值的函数
事实上，JavaScript的函数是一种引用类型，函数名本质上是指向函数对象的引用（指针）。

所以，函数可以像普通变量一样作为函数的参数或者返回值。下面是两个例子。
``` js
// 函数作为返回值
// 定义一个函数，返回比较对象特定属性的函数
function createCompareFunction(propertyName) {
    return function(obj1, obj2) {
        let val1 = obj1[propertyName];
        let val2 = obj2[propertyName];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

let objs = [
    {
        attr1: "val1",
        attr2: "val2",
        // ...
    },
    // ...
]

// 函数作为参数
// 将上面函数的返回值作为sort函数的参数
objs.sort(createCompareFunction("attr1"));
```

## 参数
### 传参
JavaScript的函数传参都是按值传递。

对于原始类型，传参与复制的行为相同，相当于在函数内部创建了参数值的一个副本，修改参数值不会影响函数外部看到的变量的值。

对于引用类型，传参与复制的行为相同，“形参”与“实参”指向同一片内存区域，但对“形参”重新赋值（如`para = new Object();`）后，所有的修改不会再对外部生效，因为它们不再指向同一片内存区域。

### `arguments`对象

JavaScript的函数参数在内部通过一个数组来表示。这意味着调用函数时传入的参数数量不必与定义一致。可以通过`arguments`对象加方括号（如`arguments[0]`）访问传入函数的参数，但这并不意味着`arguments`是一个`Array`的实例。事实上，它是一个类数组对象。

在严格模式下，修改命名参数不会影响`arguments`的值。换句话说，`arguments`对象只反映函数调用时传入参数的情况。

在非严格模式下，修改命名参数对`arguments`值会不会产生影响，取决于参数中是否含有剩余参数/默认参数/解构赋值。如果有，那么修改命名参数不会影响`arguments`的值，这与严格模式下的行为一致。如果没有，那么`arguments`的值会随着命名参数的修改而改变。
``` js
function test(a, b, c, d) {
    console.log(JSON.stringify(arguments));
    b = 5;
    console.log(JSON.stringify(arguments));
}

function test2(a, b, ...args) {
    console.log(JSON.stringify(arguments));
    b = 5;
    console.log(JSON.stringify(arguments));
}

test(1, 2, 3, 4);   /* 非严格模式：
                     * {"0":1,"1":2,"2":3,"3":4}
                     * {"0":1,"1":5,"2":3,"3":4}
                     * 严格模式：
                     * {"0":1,"1":2,"2":3,"3":4}
                     * {"0":1,"1":2,"2":3,"3":4} */
test2(1, 2, 3, 4);
                    /* 两种模式的结果一致：
                     * {"0":1,"1":2,"2":3,"3":4}
                     * {"0":1,"1":2,"2":3,"3":4} */
```

### Rest参数
ES6标准引入了rest参数来替代`arguments`获取非命名参数。请看下例：
``` js
function sum(a, b, ...args) {
    let res = a + b;
    return res + args.reduce((res, elem) => res + elem);
}

alert(sum(1, 2, 3, 4, 5, 6, 7)); // 28
```
可以看到，所有的非命名参数都被收集到`args`数组中。`args`（相比于`arguments`来说）是一个真正的数组对象，可以在它上面应用所有的数组方法。

### 扩展运算符（spread）
ES6标准引入扩展运算符，用来将数组展开成参数/属性序列。

事实上，扩展运算符可以展开所有的**可迭代对象**。

下面的例子说明了它的用法：
``` js
// spread运算符展开数组作为函数参数
let args = [2, 3, 5];

function sum5(a, b, c, d, e) {
    return a + b + c + d + e;
}

// 等价的写法：
// sum5(1, ...[2, 3, 5], 4);
alert(sum5(1, ...args, 4)); // 15
```
另一种用法是，用扩展运算符来复制数组或对象。
``` js
// 复制数组
let arr = [1, 2, 3];
let cpArr = [...arr];
alert(cpArr); // [1, 2, 3]

// 复制对象
let obj = { name: "Alice", age: 17 };
let cpObj = { ...obj };
alert(cpObj); // { name: 'Alice', age: 17 }
let addObj = { year: "2017", ...obj };
alert(addObj); // { year: '2017', name: 'Alice', age: 17 }
```
用这种方式可以得到数组/对象的深拷贝。

## 重载
JavaScript不支持重载，因为它不具有函数签名的机制。

两次定义函数名相同的函数时，前面的定义会被后面的定义覆盖。从函数也是对象的角度来看，这实际上相当于对同一个变量赋值两次，前一次赋值自然会被后一次覆盖。

通过`arguments`对象检查传入的参数可以实现类似重载的功能。

## 函数内部属性
### `arguments`
<a href="#arguments对象">上面</a>已经介绍过`arguments`对象保存函数参数的功能。这里补充介绍`arguments`对象的一个属性：`callee`。

`callee`属性是一个函数指针，指向拥有这个`arguments`对象的函数。它的一个作用是**解除递归调用与函数名的耦合**。请看下例：
``` js
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}
let newFactorial = factorial;
factorial = () => 0;
alert(newFactorial(5));  // 0 —— Wrong answer!
```

由于函数的递归调用与函数名形成了强耦合，所以一旦原函数变量被修改，从它复制来的函数变量就无法正确执行。使用`callee`来替换函数名可以解决这个问题：
``` js
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}

let newFactorial = factorial;
factorial = () => 0;
alert(newFactorial(5));  // 120 —— It works!
```

严格模式下，这种方法会报错。解决方案参见<a href="#命名函数表达式（NFE）">命名函数表达式</a>一节。
{:.warning}

### `this`
JavaScript中的`this`变量与Java或C++中的`this`变量意义类似。

区别在于，JavaScript的`this`变量的值是在运行时动态计算出来的，亦即根据函数被赋予哪个变量来决定。请看下例：
``` js
let obj1 = {
    name: "Alice",
    age: "17"
};

let obj2 = {
    name: "Bob",
    age: "19"
};

function showName() {
    alert(this.name);
}

obj1.showName = showName;
obj2.showName = showName;
obj1.showName(); // "Alice"
obj2.showName(); // "Bob"
```
在严格模式下，在没有对象的情况下使用`this`会报错。否则`this`会指向全局对象（在浏览器中往往是`window`）。

### `caller`
函数的`caller`属性保存调用这个函数的函数的引用。如果在全局作用域中调用函数，那么`caller`的值为`null`。例如：
``` js
// 以下代码只能在*非严格模式*下运行
// 出于安全考虑，严格模式禁止直接访问arguments, caller和callee
function inner() {
    // alert(inner.caller);
    // 下面的写法更好：
    alert(arguments.callee.caller);
}

function outer() {
    inner();
}

outer(); // 会显示函数outer的源代码
```
注意到这里访问`caller`的方式与`arguments`不同。事实上，`caller`是函数对象的一个属性变量（`Function.caller`），而`arguments`相当于是函数作用域中的一个局部变量。所以我们可以像使用命名参数一样使用`arguments`，但当访问`caller`的时候，必须通过函数对象，亦即`arguments.callee.caller`。

### `name`
`name`属性存储函数的名字。对于函数声明来说，函数的名字就是声明时的名字。对于函数表达式来说，引擎会根据上下文推测函数名（往往是表达式被赋值给的那个变量的名字），这一特性叫做“上下文命名”。在无法推断的情况下，`name`属性会是一个空字符串。
示例参考[现代JavaScript教程 - 函数对象](https://zh.javascript.info/function-object#shu-xing-name)。

### `length`
`length`属性表示函数希望接收的命名参数的数量。

### 自定义参数
由于JS的函数本质是一种对象，所以我们可以向它添加自定义的属性。

## 命名函数表达式（NFE）
在<a href="#arguments"><code>arguments</code></a>一节我们介绍了`callee`属性的用法。事实上，对于函数表达式，我们还有一种方式能够实现同样的功能，那就是命名函数表达式。请看下例：
``` js
let factorial = function func(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * func(num - 1);
    }
}

let newFac = factorial;
factorial = null;
console.log(newFac(5)); // 120
```
在这个例子中，我们为函数表达式的函数赋予了一个名字`func`。它有两个特点：
- 用这个名字在函数内部可以引用自身
- 这个名字对外部不可见
如此一来，不论这个函数对象被赋值给哪一个变量，它都可以安全地调用自身。

需要再次说明的是，这一特性仅适用于函数表达式。函数声明不具有这种内部命名的特性。

## 参考
[MDN文档 - `arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)
[MDN文档 - `Function.caller`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/caller)