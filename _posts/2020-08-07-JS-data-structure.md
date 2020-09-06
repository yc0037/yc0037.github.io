---
layout: article
title: "JS笔记-数据结构"
categories: "FrontEnd"
aside:
    toc: true
---

## 原始类型
JavaScript中有7个原始类型：`string`，`number`，`bigint`，`boolean`，`symbol`，`null`，`undefined`。

### 方法调用
原始类型不是对象（object），不能存储额外的属性数据。但JavaScript提供了在一些原始类型上使用方法的机制，称为对象包装器。
``` js
let str = "Hello World!";
alert(str.toUpperCase());
```
上面的代码对一个原始类型字符串`str`调用了`toUpperCase`方法。事实上，在访问`str`的属性方法时，会创建一个临时对象，包含了字符串的值和相关方法。然后，该方法运行，返回结果。最后，该临时对象被销毁，而原始变量仍然保留。

### 复制
原始类型的复制是“**按值复制**”。
``` js
let num1 = 42;
let num2 = num1;
```
上面的代码会在内存/寄存器中存储值`42`的两个副本，每个变量指向其中一个，修改`num1`对`num2`不会产生影响，反之亦然。

## 数组
JavaScript的数组是一种**引用类型**。
JavaScript的数组通过引用进行复制。如下例：
``` js
let fruits = ["Banana"]
let arr = fruits;           // 通过引用复制 (两个变量引用的是相同的数组)
alert( arr === fruits );    // true
arr.push("Pear");           // 通过引用修改数组
alert( fruits );            // Banana, Pear — 现在有 2 项了
```
事实上，所有引用类型都是按照这种方式进行复制的，也就是“**按引用复制**”。复制后的两个变量指向同一片内存区域，通过一个引用变量对引用类型对象进行操作会影响到另一个变量。

值得注意的是，如果对于一个引用变量进行重新赋值（如`arr2 = [];`），那么这两个变量就不再指向同一片内存区域，因而对它们的修改不会互相影响。

可以类比C/C++中的指针来理解引用类型的变量。Java中也有类似的概念。
### 内部实现
JavaScript内部对数组进行了优化。例如，引擎会将元素存储在一片连续的内存中，就像C/C++那样。
但是，如果为数组赋予非存储元素的属性，或者出现不连续的下标，那么这种优化就会被取消。考虑到性能，不应当如此使用数组。

### 类数组对象
有一类对象虽然不是数组，但也具有索引属性和`length`属性，我们称这类对象为**类数组对象**。

### 遍历数组
除了`for (let i = 0; i < arr.length; ++i)`之外，还可以通过`for (let elem of arr)`来遍历数组，缺点是不能获得数组的索引。

注意：不应该使用`for (let key in arr) { arr[key] ... }`这样的方式来处理数组。原因有二：
1. `for ... in`会遍历到<a href="#类数组对象">类数组对象</a>中非索引的`key`，从而访问到不属于数组中存储元素的其他属性。
2. `for ... in`循环对普通对象进行了优化，但对数组使用可能会造成性能问题。

### `length`
数组的一个属性，值为最大的索引数加一。
``` js
let arr = [];
arr[123] = 1;
alert(arr.length);  // 124
```
修改数组的`length`属性可以扩展和截断数组。

扩展出的元素值为`undefined`。

可以用`arr.length = 0`来清空数组。

### 数组方法

<style>
    th, td {
        text-align: center;
    }
</style>
<table>
    <tr>
        <th>方法</th>
        <th>说明</th>
    </tr>
    <tr>
        <td><code>arr.pop()</code></td>
        <td>取出并返回数组末端的元素。<br />执行时，清理对应的索引，修改数组的<code>length</code>属性，返回元素的值。</td>
    </tr>
    <tr>
        <td><code>arr.push(...elem)</code></td>
        <td>在数组末端插入一些新元素<code>elem</code>，并返回最后一个参数。</td>
    </tr>
    <tr>
        <td><code>arr.shift()</code></td>
        <td>在数组首端取出并返回一个元素，并将整个队列前移。可以想见，该方法运行比较慢。</td>
    </tr>
    <tr>
        <td><code>arr.unshift(...elem)</code></td>
        <td>在数组首端插入一些新元素<code>elem</code>，并返回最后一个参数。</td>
    </tr>
    <tr>
        <td><code>Array.isArray(arr)</code></td>
        <td>判定变量<code>arr</code>是否是一个数组。</td>
    </tr>
    <tr>
        <td><code>arr.toString()/<br />arr.toLocaleString()</code></td>
        <td>返回一个由数组各元素的字符串形式（通过调用每个元素的<code>toString</code>/<code>toLocaleString</code>方法得到）拼接而成，并使用逗号分隔的字符串。</td>
    </tr>
    <tr>
        <td><code>arr.valueOf()</code></td>
        <td>返回数组本身。</td>
    </tr>
    <tr>
        <td><code>arr.splice(index[, deleteCount, elem1, ... elemN])</code></td>
        <td>从下标<code>index</code>开始删除<code>deleteCount</code>个元素，再插入<code>elem1</code>到<code>elemN</code>，最后返回已删除元素的数组。<br/>如果设置<code>deleteCount</code>为<code>0</code>，那么就不会删除元素。</td>
    </tr>
    <tr>
        <td><code>arr.slice([start], [end])</code></td>
        <td>返回数组<code>arr</code>从下标<code>start</code>到下标<code>end</code>（不包括<code>end</code>）的元素组成的数组。如果不传入参数，那么返回原数组的副本。</td>
    </tr>
    <tr>
        <td><code>arr.concat(arg1, arg2, ...)</code></td>
        <td>接受任意数量的参数，返回由原数组元素和参数组成的新数组。如果参数是数组，那么会将它的所有元素放入返回的新数组，否则直接将参数放入新数组。<br />如果一个类似数组的对象具有<code>Symbol.isConcatSpreadable</code>属性，那么<code>concat</code>方法会将其展开。参见<a href="#concat-example">示例代码</a>。</td>
    </tr>
    <tr>
        <td><code>arr.forEach(function(item, index, array) { ... })</code></td>
        <td>对数组的每个元素运行参数中的函数。参数分别是元素本身，元素的下标和数组本身的引用。</td>
    </tr>
    <tr>
        <td><code>arr.indexOf/lastIndexOf(item, from)</code></td>
        <td>从下标<code>from</code>开始顺序/逆序搜索元素<code>item</code>，如果找到则返回索引值，否则返回<code>-1</code>。</td>
    </tr>
    <tr>
        <td><code>arr.include(item, from)</code></td>
        <td>从索引<code>from</code>开始搜索元素<code>item</code>，返回一个布尔值（找到为<code>true</code>，找不到为<code>false</code>）。</td>
    </tr>
    <tr>
        <td><code>arr.find/findIndex(function(item, index, array) { ... })</code></td>
        <td>对数组的每个元素执行参数中的函数，返回第一个使得函数执行结果为<code>true</code>的元素/元素的索引（只要找到，就停止搜索），如果没有，那么返回<code>undefined</code>。</td>
    </tr>
    <tr>
        <td><code>arr.filter(function(item, index, array) { ... })</code></td>
        <td>与<code>find</code>类似，但返回所有使函数执行结果为<code>true</code>的元素组成的集合。</td>
    </tr>
    <tr>
        <td><code>arr.map(function(item, index, array) { ... })</code></td>
        <td>对数组的每个元素执行参数中的函数，返回执行结果组成的数组。</td>
    </tr>
    <tr>
        <td><code>arr.sort([function(elem1, elem2) { ... }])</code></td>
        <td><b>修改数组</b>，对数组进行原地排序并返回排序后的数组。如果不传入参数，那么默认按照字符串字典序进行排序。传入的参数比较两个任意值的大小，如果<code>elem1</code>大于<code>elem2</code>则返回正数，小于返回负数，相等则返回零。</td>
    </tr>
    <tr>
        <td><code>arr.reverse()</code></td>
        <td><b>修改数组</b>，将数组中的元素顺序颠倒，返回颠倒后的数组。</td>
    </tr>
    <tr>
        <td><code>str.split(delim[, limit])</code></td>
        <td><code>str</code>和<code>delim</code>都是字符串。这个方法将<code>str</code>用给定的分隔符<code>delim</code>分割成一个数组。<br />如果<code>delim</code>为空字符串，那么会将字符串分割成单个字母的数组。<br />参数<code>limit</code>限制结果数组的长度，超出长度的部分会被丢弃。</td>
    </tr>
    <tr>
        <td><code>arr.join(glue)</code></td>
        <td>返回将数组元素转换成字符串，并用字符串<code>glue</code>连接后得到的字符串。</td>
    </tr>
    <tr>
        <td><code>arr.reduce/reduceRight(function(accumulator, item, index, array) { ... }, [initial])</code></td>
        <td>顺序/逆序对数组的每个元素应用参数中的函数，并在元素之间传递参数<code>accumulator</code>的值。<br />参数<code>initial</code>设置了<code>accumulator</code>的初始值。</td>
    </tr>
    <tr>
        <td><code>arr.some(function(item, index, array) { ... })</code></td>
        <td>对数组中的每个元素执行参数中的函数。只要有一次执行结果为<code>true</code>，就返回<code>true</code>，否则返回<code>false</code>。</td>
    </tr>
    <tr>
        <td><code>arr.every(function(item, index, array) { ... })</code></td>
        <td>对数组中的每个元素执行参数中的函数。如果每次执行结果都为<code>true</code>，那么返回<code>true</code>，否则返回<code>false</code>。</td>
    </tr>
    <tr>
        <td><code>arr.fill(value, start, end)</code></td>
        <td><b>修改数组</b>，从索引<code>start</code>到<code>end</code>（不包括<code>end</code>），用重复的值<code>value</code>填充数组。</td>
    </tr>
</table>

<div id="concat-example"></div>

``` js
let arr = [1, 2];

let arrayLike = {
  0: "something",
  1: "else",
  [Symbol.isConcatSpreadable]: true,
  length: 2
};

let anotherArrayLike = {
  0: "something",
  1: "else",
  length: 2
}

alert( arr.concat(arrayLike, anotherArrayLike) ); // 1,2,something,else,[object Object]
```

#### `thisArg`
对于那些接受函数作为参数的方法来说，它们都还接受一个可选参数`thisArg`，用来指示参数中的函数被调用时`this`的值。如下例，如果不传入参数`army`，那么在`army.canJoin`被调用时，`this`会被解析为`undefined`。
``` js
let army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  }
};

let users = [ {age: 16}, {age: 20}, {age: 23}, {age: 30} ];

// 找到 army.canJoin 返回 true 的 user
let soldiers = users.filter(army.canJoin, army);

alert(soldiers.length); // 2
alert(soldiers[0].age); // 20
alert(soldiers[1].age); // 23
```
使用箭头函数`user => army.canJoin(user)`可以达到同样效果。

## `Iterable`
`Iterable`是一类可以使用`for ... of`循环进行遍历的对象。

数组和字符串都是典型的可迭代对象。

注意`Iterable`（可迭代）和“Array-like”（<a href="#类数组对象">类数组对象</a>）是不同的概念。
### `Symbol.iterator`
想要让对象成为可迭代的，就要为它实现`Symbol.iterator`方法。

例如，我们要实现一个`range`对象来表示一个闭区间。`for (let num of range) { ... }`会遍历从`range.from`到`range.to`的每个数字。亦即满足：
``` js
// range.from = 1, range.to = 5
// 所以下面的循环依次 alert 1, 2, 3, 4, 5
for (let num of range) {
    alert(num);
}
```

实现如下：
``` js
let range = {
    from: 1,
    to: 5
};

range[Symbol.iterator] = function() {
    return {
        current: this.from,
        last: this.to,

        next() {
            if (this.current <= this.last) {
                return { done: false, value: this.current++ };
            } else {
                return { done: true };
            }
        }
    };
};
```

在`for ... of`循环调用时，它会首先调用`range[Symbol.iterator]`方法，该方法返回一个迭代器（`iterator`）对象。接下来的操作仅与迭代器有关。

`for ... of`循环通过调用迭代器对象的`next()`方法来获取“下一个值”。`next()`方法的返回值格式必须为`{ done: Boolean. value: any }`，`done`属性指示迭代是否结束，`value`属性表示“下一个值”。

另一种实现方法是将对象自身作为迭代器。这种实现的优点是代码比较简洁，缺点是不能在同一个对象上执行两个`for ... of`循环，因为它们会共享同一个迭代器——对象本身。
``` js
let range = {
    from: 1,
    to: 5,

    [Symbol.iterator]() {
        this.current = this.from;
        return this;
    },

    next() {
        if (this.current <= this.to) {
            return { done: false, value: this.current++ };
        } else {
            return { done: true };
        }
    }
};
```

也可以通过显式地调用迭代器来对可迭代对象进行更加灵活的遍历操作。
``` js
let name = "JavaScript";

let iter = name[Symbol.iterator]();

while(true) {
    let res = iter.next();
    if (res.done) break;
    alert(res.value);
}
```

### `Array.from`
使用`Array.from`函数可以将一个可迭代对象或者类数组对象转化成真正的数组，从而能够使用<a href="#数组方法">数组方法</a>。

函数调用的完整语法为`Array.from(obj[, mapFn, thisArg])`。`obj`为需要转换的可迭代对象或类数组对象。如果传入了`mapFn`，那么它会被应用在每一个元素上，并将返回值放入结果数组的对应位置。

## `Map`
JavaScript提供了与Java类似的map数据结构。

与object类型相比，map允许键为任意类型，包括对象。

<table>
    <tr>
        <th>方法</th>
        <th>说明</th>
    </tr>
    <tr>
        <td><code>new Map()</code></td>
        <td>创建一个新的<code>Map</code>。</td>
    </tr>
    <tr>
        <td><code>map.set(key, value)</code></td>
        <td>设置<code>map</code>中键<code>key</code>的值为<code>value</code>，返回<code>map</code>本身，所以可以链式调用<code>set</code>方法插入多个值。<br /><code>map.set(1, "a").set(2, "b");</code></td>
    </tr>
    <tr>
        <td><code>map.get(key)</code></td>
        <td>返回<code>map</code>中键<code>key</code>对应的值<code>value</code>。若<code>key</code>不存在，那么返回<code>undefined</code>。</td>
    </tr>
    <tr>
        <td><code>map.has(key)</code></td>
        <td>如果<code>map</code>中存在<code>key</code>，那么返回<code>true</code>，否则返回<code>false</code>。</td>
    </tr>
    <tr>
        <td><code>map.delete(key)</code></td>
        <td>删除<code>map</code>中键<code>key</code>对应的值。</td>
    </tr>
    <tr>
        <td><code>map.clear()</code></td>
        <td>清空<code>map</code>。</td>
    </tr>
    <tr>
        <td><code>map.size</code></td>
        <td>返回<code>map</code>中元素的个数。</td>
    </tr>
    <tr>
        <td><code>map.keys()</code></td>
        <td>返回<code>map</code>中所有键组成的可迭代对象。</td>
    </tr>
    <tr>
        <td><code>map.values()</code></td>
        <td>返回<code>map</code>中所有值组成的可迭代对象。</td>
    </tr>
    <tr>
        <td><code>map.entries()</code></td>
        <td>返回<code>map</code>中所有的键值对<code>[key, value]组成的可迭代对象</code>。</td>
    </tr>
    <tr>
        <td><code>map.forEach(function(value, key, map) { ... })</code></td>
        <td>对<code>map</code>中每个元素应用参数中的函数。</td>
    </tr>
</table>

通常情况下不应当使用`map[key]`的方式来访问`map`。

### 在`Map`和对象之间转换
#### `Object.entries`
可以使用键值对数组来初始化`Map`。
``` js
let map = new Map([
    [1, "a"],
    [2, "b"],
    [3, "c"]
]);
```
方法`Object.entries(obj)`可以将`obj`对象转换为键值对数组，进而用来初始化`Map`。
``` js
let obj = {
    "A": "one",
    "B": "two",
    "C": "three"
};
let map = new Map(Object.entries(obj));
```
#### `Object.fromEntries`
`Object.fromEntries`将键值对数组转换成对象。
``` js
let kv = [
    ["A", "one"],
    ["B", "two"],
    ["C", "three"]
];
let obj = Object.fromEntries(kv);
alert(obj.A); // one
```
自然，它也可以用来将`Map`类型的变量转换为对象。
``` js
let map = new Map();
map.set("A", "one")
   .set("B", "two")
   .set("C", "three");
let obj = Object.fromEntries(map.entries());
// 事实上，Object.fromEntries接受一个可迭代对象为参数
// 而map的标准迭代同样会返回[key, value]键值对
// 所以下面的代码与上面的代码等价：
// let obj = Object.fromEntries(map);
```
## `Set`
<table>
    <tr>
        <th>方法</th>
        <th>说明</th>
    </tr>
    <tr>
        <td><code>new Set()</code></td>
        <td>创建一个新的<code>Set</code>。</td>
    </tr>
    <tr>
        <td><code>set.add(value)</code></td>
        <td>向<code>set</code>中插入值<code>value</code>，返回<code>set</code>本身。</td>
    </tr>
    <tr>
        <td><code>set.has(value)</code></td>
        <td>如果<code>set</code>中存在<code>value</code>，那么返回<code>true</code>，否则返回<code>false</code>。</td>
    </tr>
    <tr>
        <td><code>set.delete(value)</code></td>
        <td>删除<code>set</code>中的值<code>value</code>。</td>
    </tr>
    <tr>
        <td><code>set.clear()</code></td>
        <td>清空<code>set</code>。</td>
    </tr>
    <tr>
        <td><code>set.size</code></td>
        <td>返回<code>set</code>中元素的个数。</td>
    </tr>
    <tr>
        <td><code>set.keys()</code></td>
        <td>返回<code>set</code>中所有值组成的可迭代对象。</td>
    </tr>
    <tr>
        <td><code>set.values()</code></td>
        <td>返回<code>set</code>中所有值组成的可迭代对象。</td>
    </tr>
    <tr>
        <td><code>set.entries()</code></td>
        <td>返回<code>set</code>中所有的实体<code>[value, value]组成的可迭代对象</code>。</td>
    </tr>
    <tr>
        <td><code>set.forEach(function(value, valueAgain, set) { ... })</code></td>
        <td>对<code>set</code>中每个元素应用参数中的函数。</td>
    </tr>
</table>

注意到，为了兼容`Map`类型，`Set`拥有`Map`的所有迭代方法，即使有的方法是重复的。

`Map`和`Set`的迭代都是按照元素的插入顺序进行的。

## `WeakMap`和`WeakSet`
### 动机
我们已经知道，如果没有任何引用指向一个对象，那么该对象占用的内存将在某个特定时间被垃圾回收器回收释放。如果一个对象被放入`Map`或者`Set`中，那么只要该对象还存在于集合里，它就不会被回收，即使不存在其他指向它的引用。在某些情形下，我们需要一种机制来自动地从集合中清除这些对象（和它对应的value）。`WeakMap`和`WeakSet`就提供了这样的机制。
### 原理
`WeakMap`只接受对象作为它的key。类似地，只能向`WeakSet`中添加对象。

当一个对象不存在任何其他指向它的引用时，它在`WeakMap`和`WeakSet`中的值（以及以它为key的键值对）可以被垃圾回收器清除。

`WeakMap`只有`get`，`set`，`has`，`delete`方法，`WeakSet`只有`add`，`has`，`delete`方法。它们不允许迭代，因为垃圾回收器回收“废弃”元素的时机是不确定的。
### 应用
例如我们需要对一些对象进行计算，将结果存放在缓存中以便下次需要时直接取用。当对象被回收时，我们需要将缓存中该对象对应的条目清除，否则缓存会变得非常大，而且充满无用数据。使用`WeakMap`就能够很好地解决这个问题。
