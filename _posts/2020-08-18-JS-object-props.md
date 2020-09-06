---
layout: article
title: "JS笔记-对象：属性"
categories: "FrontEnd"
aside:
    toc: true
---

JavaScript使用对象（object）来表达键值对和复杂实体。

一个对象通常是这样的：
``` js
// 直接使用花括号来声明对象，称为字面量的语法
let obj = {
    name        : "Alice",      // 键: 值, (使用逗号分隔每个键值对)
    age         : 17,
    friend      : ["Bob", "Carol"],
    isMarried   : true,
    son         : null,         // 值可以是任何类型
    "user id"   : 11037,        // 键为字符串，带空格的必须用引号包围
    subObj      : {
        prop1   : "val1",
        prop2   : "val2",
    },                          // 值也可以是对象
    prop        : "val",        // 习惯上，最后一个属性后面也要加一个逗号
                                // 称为尾随（trailing）或者悬挂（hanging）逗号
                                // 方便我们添加、删除或移动属性
};

// 使用new运算符来声明对象，称为构造函数的语法
let obj2 = new Object();
```

## 属性的访问
使用点（`.`）运算符可以访问对象的属性。
``` js
console.log(obj.name);  // Alice
```
另一种方式是使用方括号。这种方式通常用来访问属性名中包含空格的属性，这样的属性无法用点运算符访问：
``` js
// Error: console.log(obj.user id);
console.log(obj["user id"]);

// 上下两组语句是等价的
let prop = "user id";
console.log(obj[prop]);
```

## 属性的增删改
直接访问属性就可以对属性进行添加和修改。
``` js
// 修改属性name的值为"Bob"
obj.name = "Bob";
// 添加一个属性anotherProp，值为"anotherValue"
obj.anotherProp = "anotherValue";
```
使用`delete`运算符删除对象的一个已有的属性。
``` js
delete obj.anotherProp;
```
使用`const`修饰的变量的属性同样可以被修改。换言之，`const`只限制变量本身的值（对于指向对象的变量来说，它的值就是变量的地址/引用）。

## 计算属性
在创建对象时，我们也可以在对象字面量（花括号表示）的键上使用方括号，表示该键（也就是属性名）要通过方括号中的表达式计算得到。
``` js
let prop = "name";

let obj = {
    [prop + "s"]: "Alice",
}

console.log(obj.names);  // Alice
```

## 属性值缩写
一种常见的场景是，使用一个已存在的变量作为属性名，属性值与变量值相同。此时可以采用属性值缩写的方法：
``` js
function makeUser(name, age) {
    return {
        name,       // 等价于name: name
        age,
    }
}

let usr = makeUser("Alice", 17);
console.log(usr.name);      // Alice
```

## 判断属性是否存在
我们可以访问一个对象的任何属性，无论它是否存在。如果不存在的话，将会得到`undefined`。

所以，我们可以通过判断一个属性的值是否为`undefined`来判断对象是否存在这个属性。但是，存在这样的情况：对象存在某个属性，但它的取值为`undefined`。

一种更加可靠的方式是使用`in`操作符：
``` js
let obj = {
    name: "Alice",
    age: 17,
};

function printProp(obj, prop) {
    if (prop in obj) {
        console.log(obj[prop]);
    } else {
        console.log(`Property ${prop} does not exist.`)
    }
}

printProp(obj, "name");     // Alice
printProp(obj, "home");     // does not exist

console.log("age" in obj);  // true
```

## 可选链`?.`
### 动机
在访问对象属性时，我们时常会遇到这样的情况：
``` js
let obj = {
    name: {
        first: "Alan",
        last: "Turing",
    },
};

console.log(obj.name.first);    // Alan
```
如果`obj`没有`name`属性，上面的语句就会报错。

一种解决方法是使用`&&`：
``` js
console.log(obj && obj.name && obj.name.first);
```
表达式会在第一个`undefined`处返回`undefined`。但这个方法写起来非常繁琐。

可选链给出一种简洁的写法来解决这个问题。
### 可选链
可选链的行为是，如果`?.`前面的部分是`null`或`undefined`，那么停止对表达式的求值，返回`undefined`。这意味着如下几个事实：
- 可选链开头的对象不能是未声明的。例如，`obj?.name?.first`中，`obj`必须已经声明，否则会出错。
- 可选链是短路的——遇到`null`或`undefined`之后的代码部分不会执行。

可选链有三种用法：
- 通过`?.`来访问一个可能不存在的对象的属性：

``` js
let obj = { 
    // ... 
    // where property *name* does not exist
};

console.log(obj.name?.first);   // undefined
```
- 通过`?.()`来调用一个可能不存在的函数：

``` js
let obj1 = {
    run() {
        console.log("Run!");
    }
};

let obj2 = {
    // ...
    // function *run* does not exist
};

obj1.run?.();   // Run!
obj2.run?.();   // do nothing
```
- 通过`?.[]`访问可能不存在的对象的属性：

``` js
let obj1 = {
    name: {
        first: "Alice",
        last: "Unknown",
    },
    age: 17,
};

let obj2 = {
    age: 18,
};

console.log(obj1.name?.["first"]);  // Alice
console.log(obj2.name?.["first"]);  // undefined
```

显然，不能使用可选链来赋值。

## 遍历属性
使用`for ... in`循环可以遍历对象的所有属性。
``` js
// 将对象转化为字符串
let obj = {
    name: "Alice",
    age: 17,
    arr: [1, 2],
    subObj: {
        name: "Hey",
        "What the hell": 11234,
        sso: {
            prop: "val",
            2: 222,
            prop2: "val2",
            3: 2223,
            1: 111,
        },
        sy: () => {},
    },
    myToString: function f() {
        let res = "";
        if (typeof this === "function") {
            res = `[function ${this.name || "Function"}]`;
        } else if (Array.isArray(this)) {
            res = "[ ";
            for (let elem of this) {
                res += `${f.apply(elem)}, `;
            }
            res += "]";
        } else if (typeof this === "object") {
            res = "{ ";
            for (let key in this) {
                let prop = "";
                prop = f.apply(this[key]);
                res += `"${key}": ${prop}, `;
            }
            res += "}";
        } else {
            res += this;
        }
        return res;
    }
}

console.log(obj.myToString());
// { "name": Alice, "age": 17, "arr": [ 1, 2, ], "subObj": { "name": Hey, "What the hell": 11234, "sso": { "1": 111, "2": 222, "3": 2223, "prop": val, "prop2": val2, }, "sy": [function sy], }, "myToString": [function f], }
```

我们遍历属性时的顺序是怎样的呢？回答是：如果属性名是整数属性（也就是说，它可以在不做任何更改的情况下与整数相互转换），那么按照属性名升序排列，放在属性列表的最前面；其他属性按照创建时的顺序进行排列。

还有一些其他方法能够遍历对象的属性：

<table>
<tr>
    <th>方法</th>
    <th>说明</th>
</tr>
<tr>
    <td><code>Object.keys(obj)</code></td>
    <td>与Map中的同名方法类似，返回对象<b>自身（不包括继承而来的）</b>所有可枚举的字符串属性的属性名。</td>
</tr>
<tr>
    <td><code>Object.values(obj)</code></td>
    <td>与Map中的同名方法类似，返回对象<b>自身</b>（不包括继承而来的）所有可枚举的字符串属性的属性值。</td>
</tr>
<tr>
    <td><code>Object.entries(obj)</code></td>
    <td>与Map中的同名方法类似，返回对象<b>自身</b>（不包括继承而来的）所有可枚举的字符串属性的键-值对。</td>
</tr>
<tr>
    <td><code>Object.getOwnPropertySymbols(boj)</code></td>
    <td>返回一个由<b>自身</b>所有symbol类型键组成的数组。</td>
</tr>
<tr>
    <td><code>Object.getOwnPropertyNames(boj)</code></td>
    <td>返回一个由<b>自身</b>所有字符串键组成的数组。</td>
</tr>
<tr>
    <td><code>obj.hasOwnProperty(key)</code></td>
    <td>如果对象<code>obj</code><b>自身</b>（不包括继承而来的）含有名为<code>key</code>的属性，那么返回<code>true</code>。</td>
</tr>
</table>

## 属性标志和属性描述符
### 属性标志
可以通过配置对象属性（properties）的**属性标志**来改变其特性（attributes）。有三种属性标志：
- `writeable`：设置属性值是否可修改。
- `enumerable`：设置属性是否会在循环中被列出。若为`false`，则`for ... in`循环和`Object.key()`这样的过程都不会访问到该属性。
- `configurable`：设置属性是否能被删除，属性标志能否被`defineProperty`修改。如果该项为`false`，那么它的`configurable`，`enumerable`和`writable`标志不能被修改。注意，这不意味着对象属性本身不能被修改。

默认情况下，这些属性的值都是`true`。

在严格模式下，违反属性标志的操作会报Error；非严格模式下，引擎会静默地忽略这些操作。

### 属性描述符
#### 获取属性信息
JS提供一个方法`Object.getOwnPropertyDescriptor`来获取属性的信息：
``` js
let obj = {
    name: "Alice",
    age: 17,
};

let propertyName = "name";

// obj: 需要获取属性信息的对象
// propertyName: 目标属性的名称
// 返回值: 一个属性描述符对象，包括属性的值以及标志信息
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
console.log(descriptor);
/* {
  value: 'Alice',
  writable: true,
  enumerable: true,
  configurable: true
} */
```
#### 修改属性
另外一个方法`Object.defineProperty`允许我们修改属性标志。
``` js
// 语法：
// Object.defineProperty(obj, propertyName, descriptor);
// 其中descriptor是一个属性描述符对象
Object.defineProperty(obj, "name", { writable: false, });
```
如果目标属性存在，那么它将修改目标属性的属性标志。否则将会用给定的值和标志创建这个属性，这种情况下，未提供值的标志将默认为`false`。
``` js
Object.defineProperty(obj, "school", { value: "Top3" });

let descriptor = Object.getOwnPropertyDescriptor(obj, "school");
console.log(descriptor);
/* {
  value: 'Top3',
  writable: false,
  enumerable: false,
  configurable: false
} */
```

此方法返回对象本身。
#### 一次定义多个属性
`Object.defineProperties`允许一次定义多个属性。
``` js
Object.defineProperties(obj, {
    prop1: descriptor1,
    prop2: descriptor2,
    // ...
});
```

有一个方法`Object.getOwnPropertyDescriptors`，可以一次性获取所有属性描述符。配合上面的方法，我们可以实现一种克隆对象的方式：
``` js
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

另外，有一些对整个对象的属性访问限制进行设置的方法，参见[现代JS教程 - 属性标志和属性描述符](https://zh.javascript.info/property-descriptors#she-ding-yi-ge-quan-ju-de-mi-feng-dui-xiang)。

## 访问器属性
上面我们提到的属性都是**数据属性**。下面我们介绍**访问器属性**。
### getter/setter
在对象字面量中，数据属性通过“键-值”（“属性名-属性值”）的形式表示。而访问器属性通过"getter"和"setter"方法表示：
``` js
let obj = {
    get propName() {
        // 读取obj.propName时会调用getter方法，得到它的返回值
    },
    
    set propName(value) {
        // 执行obj.propName = value时，会调用setter方法
    }
}
```
使用访问器属性的一个场景是，对象的某个属性的值与其他属性有关。如下例，对象的`fullName`是由它的`name`和`surname`相连得来的：
``` js
let user = {
    name: "Alan",
    surname: "Turing",

    get fullName() {
        return [this.name, this.surname].join(" ");
    },

    set fullName(value) {
        [this.name, this.surname] = value.split(" ");
    }
};

console.log(user.fullName);     // Alan Turing
user.fullName = "Donald Knuth";
console.log(user.surname);      // Knuth
```
### 访问器描述符
访问器属性与数据属性的描述符不同：它没有`value`和`writable`属性，而代之以`get`和`set`函数。

也可以用`Object.defineProperty`来为对象添加访问器属性：
``` js
let obj = Object.defineProperty({}, "time", {
    get() {
        return this._time;
    },
    
    set(value) {
        this._time = value;
    }
});

obj.time = new Date();
console.log(obj.time);      // 2020-08-22T04:39:48.746Z
```
如果同时为属性描述符设置`get`/`set`和`value`/`writable`，就会出错。

注意到，这里的做法是将属性值存放在一个以下划线`_`开头的变量中。这个变量是能够从外部访问到的（也就是说，可以通过`obj._time`来访问同一个属性），但是习惯上约定下划线开头的属性为对象的内部属性，我们不从外部访问它。
