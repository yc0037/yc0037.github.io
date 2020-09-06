---
layout: article
title: "JS笔记-对象：class"
categories: "FrontEnd"
aside:
    toc: true
---

ES5以前，我们使用构造函数来生成一系列结构相似的对象。ES6提供了更接近传统面向对象编程语言（如Java）的写法——`class`。

## 基本语法
JavaScript的`class`语法如下：
``` js
class MyClass {
    constructor() { ... }
    method1() { ... }
    method2() { ... }
    method3() { ... }
    // ...
}

let obj = new MyClass();
```
当我们调用`new MyClass()`时，它创建了一个新对象，使用传入的参数运行`constructor`函数来初始化它，最后返回这个新对象。
### getter/setter
在`class`中，我们可以非常方便地添加访问器属性，也就是get和set方法。
``` js
class User {
    constructor(name) {
        this.name = name;       // 会调用setter
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
}
```
事实上，这些get和set方法是被添加到了`User.prototype`上。
### 计算属性
也可以为`class`中定义的属性方法的名字使用计算属性。
``` js
let funcName = "greet";

class User {
    constructor(name) {
        this.name = name;
    }
    [funcName]() {
        console.log(this.name + ": Hello!");
    }
}

let user = new User("Alice");
user.greet();       // Alice: Hello!
```
### 类字段（class field）
还可以直接为类添加属性。
``` js
class User {
    name = "Alice";
    constructor(age) {
        this.age = age;
    }
}

let user = new User(17);
console.log(user.name, user.age);   // Alice 17
```
值得注意的是，这些属性会出现在每个对象中，而不是在对象原型中。而且它们的值在各对象中是独立的，无论它们是数值类型还是引用类型。

### 使用类字段绑定方法
我们之前讨论过[对象属性方法作为参数传递时会丢失`this`](/frontend/2020/08/14/JS-function-method.html#bind)的问题。组合使用类字段和箭头函数给出了另一种解决方案：
``` js
class Button {
    constructor(value) {
        this.value = value;
    }
    click = () => {
        alert(this.value);
    }
}

let button = new Button(15);
setTimeout(button.click, 1000);
```
在这个例子中，每个从类`Button`实例化出来的对象中都包含了`click`函数的一个副本。由于它使用了箭头函数，所以它的`this`为外部的`this`，也就是自己所在的`Button`的实例（这里可以将`Button`看成构造函数）。所以，无论将`button.click`传递到哪里，它的`this`总是正确的。

### 类表达式
既然[类是一种函数](#类是一种函数)，那么类也可以向函数那样使用表达式进行声明，并被赋值给变量，作为函数参数或者返回值。
``` js
let User = class {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(this.name + ": Hello!");
    }
}

let user = new User("Alice");
user.greet();   // Alice: Hello!
```
类表达式也可以有自己的名字，这个名字只有类内部可见，就像命名函数表达式一样：
``` js
let User = class MyClass {
    // ...
}
```

## 类是一种函数
不难想象，`class`其实应该被看作一种“语法糖”，而不是真正地实现了Java那种基于类的面向对象系统。

事实上，在JavaScript中，`class`是一种函数。

`class User { ... }`实际上生成了一个名为`User`的函数，它的代码来自`constructor`方法。而声明中所有的方法都将被存储到`User.prototype`中。
``` js
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`From ${this.name}: Hello World!`);
    }
}

console.log(typeof User);                                   // function
console.log(User == User.prototype.constructor);            // true
console.log(Object.getOwnPropertyNames(User));              // [ 'length', 'prototype', 'name' ]
console.log(Object.getOwnPropertyNames(User.prototype));    // [ 'constructor', 'greet' ]
```
换句话说，我们可以不用`class`，而是完全用函数来实现同样的功能：
``` js
// 创建构造函数，初始化对象
function User(name) {
    this.name = name;
}

// 将方法绑定到对象原型上
User.prototype.greet = function() {
    console.log(`From ${this.name}: Hello World!`);
}

let user = new User("Alice");
user.greet();       // From Alice: Hello World!
```
但是，它们内部存在许多重要的差异：
- 通过`class`创建的函数内部具有`[[FunctionKind]]:"classConstructor"`标记，而单纯的构造函数没有。这个标记会在很多地方被检查。一个例子是，使用`class`创建的函数必须使用`new`操作符来调用，否则会报错。
- 类的方法不可枚举。也就是说，类的`prototype`中的所有方法属性的`enumerable`标记都为`false`。这意味着，我们使用`Object.keys(obj)`和`for ... in`循环都无法访问到类的方法。
- 类构造部分中的所有代码自动进入严格模式。

## 类继承
JavaScript用`extends`关键字来表示class之间的继承关系。
``` js
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    showSelf() {
        console.log(`User #${this.id}: ${this.name}`);
    }
}

class Admin extends User {
    constructor(id, name) {
        super(id, name);
        this.isAdmin = true;
    }
    showAdmin() {
        console.log("I am an admin!");
    }
}

let admin = new Admin(1551, "Alice");

admin.showSelf();       // User #1551: Alice
admin.showAdmin();      // I am an admin!
```
`extends`后面可以跟任意表达式——只要它最后的求值是一个`class`。

在内部，类继承的本质仍然是原型继承。在上面的例子中，`extends`将`Admin.prototype.[[Prototype]]`设置为`User.prototype`，这样。当我们调用`admin.showSelf`时，JavaScript先在`admin`中找这个方法，没找到，就去`admin.[[Prototype]]`（也就是`Admin.prototype`）中找，仍然找不到，于是继续沿着原型链上溯到`User.prototype`。

### 方法重写
在子类中重新定义父类中已经存在的方法，就会形成方法重写（Override）。这一点与传统的面向对象语言是相同的。
``` js
// class User略

class Admin extends User {
    constructor(id, name) {
        super(id, name);
        this.isAdmin = true;
    }
    showSelf() {
        console.log("I am an admin, I have no name.");
    }
    showAdmin() {
        console.log("I am an admin!");
    }
}

let admin = new Admin(11521, "Bob");
admin.showSelf();       // I am an admin, I have no name.
```
也可以在现有的父类方法上进行扩展。此时就要用到`super`关键字：
<p id="#super"></p>

``` js
// class User略

class Admin extends User {
    constructor(id, name) {
        super(id, name);                // 使用super(args)来调用父类的构造方法
        this.isAdmin = true;
    }
    showSelf() {
        console.log("####Admin: ####");
        super.showSelf();               // 使用super.method()来访问父类的方法
    }
    showAdmin() {
        console.log("I am an admin!");
    }
}

let admin = new Admin(11521, "Bob");
admin.showSelf();       // ####Admin: ####
                        // User #11521: Bob
```
当然，箭头函数也没有`super`。
### 构造方法（constructor）的重写
默认情况下，如果一个类继承了另一个类，且没有为其指定构造方法，那么会生成一个默认的构造方法：
``` js
constructor(...args) {
    super(...args);
}
```
这也就是说，它会调用父类的构造方法，将参数原样传递。

在[上面的例子](#super)里，我们为子类`Admin`定义了新的构造方法，它首先调用父类的构造方法，再添加自己独有的属性。

为了理解构造方法的内部机制，我们来看两个例子。

第一个例子里，继承`Base`类的`Derive`类在构造函数中并没有通过`super`调用父类的构造函数，而是又写了一遍父类构造函数的函数体。这样是不能运行的，原因在于派生类（子类）的构造函数具有一个内部属性`[[ConstructorKind]]: "derived"`。一般的函数通过`new`调用时都会创建一个空对象并将其赋给`this`，但是在拥有这个内部属性的构造函数（也就是子类的构造函数）执行时，它期望父类的构造函数做这件事。因此，**子类的构造函数必须在任何对`this`的调用以及最终返回之前调用父类的构造函数**，也就是执行`super()`语句。
``` js
class Base {
    constructor(name, val) {
        this.name = name;
        this.val = val;
    }
}

class Derived extends Base {
    constructor(name, val, ext) {
        this.name = name;
        this.val = val;
        this.ext = ext;
    }
}

let obj = new Derived("myVar", 17, null);   // Error！
```

第二个例子关于类字段的继承与重写。在这个例子中，`Base`的构造函数首先打印类字段`name`的值，再调用`showMsg`方法。`Derived`类继承`Base`，但重写了类字段`name`和方法`showMsg`。问题出现了：在`Derived`的构造方法被调用时，重写后的`showMsg`方法确实被调用了，但打印的类字段`name`仍然是父类的类字段的值，我们对类字段的重写在构造函数执行时并没有反映出来。
``` js
class Base {
    name = "Base"
    constructor() {
        console.log(`name: ${this.name}`);
        this.showMsg();
    }
    showMsg() {
        console.log(`msg: Base!`);
    }
}

class Derived extends Base {
    name = "Derived"
    constructor() {
        super();
        console.log(`And now ... name: ${this.name}`);
    }
    showMsg() {
        console.log(`msg: Derived!`);
    }
}

let base = new Base();          // name: Base
                                // msg: Base!
let derived = new Derived();    // name: Base
                                // msg: Derived!
                                // And now ... name: Derived
```
引发这个问题的原因是JavaScript初始化对象的顺序。**如果一个类没有继承任何类，那么类字段会在它的构造方法执行前初始化。但如果一个类继承了其他类，那么类字段会在父类的构造函数执行完毕后初始化。**上面这个例子中创建`derived`对象打印的第三条信息就说明了这一特性：构造函数执行完毕后，类字段变为重写之后的值。

### `super`关键字的内部实现：`[[HomeObject]]`
我们已经看到，通过`super`关键字可以调用父类的方法和构造方法。本质上来说，JavaScript要到当前对象的原型上查找这些方法。

一种简单的思路是通过`this.__proto__`来获取原型上的方法。请看下例（为了方便理解，我们采用对象而不是类来说明，其本质是一样的）：
``` js
let base = {
    name: "base",
    run() {
        console.log(`Run with ${this.name}!`);
    }
};

let derived = {
    __proto__: base,
    name: "derived",
    run() {
        this.__proto__.run.call(this);
    }
};

let derivedAgain = {
    __proto__: derived,
    name: "derivedAgain",
    run() {
        this.__proto__.run.call(this);
    }
}

derived.run();          // Run with derived!
derivedAgain.run();     // RangeError: Maximum call stack size exceeded
```
可以看到，在`derived`对象中，这种方法确实起作用了。`this.__proto__.run`从它的原型`base`对象中获取到了`run`函数，并绑定自身进行调用，结果是正确的。但当原型链延长，在`derivedAgain`对象中，情况发生了变化：JavaScript抛出了一个Error。

让我们看看发生了什么。首先，在`derivedAgain`的`run`中，`this.__proto__.run`获取到它的原型，也就是`derived`对象，然后通过`call`绑定`derivedAgain`调用`derived`对象中的`run`函数。注意，此时`this`仍然是`derivedAgain`——这意味着`this.__proto__.run`将调用自身，也就是`derived.run`，`call`的参数也同样是`derivedAgain`。这个动作会不断重复，直到调用栈溢出。函数调用永远不会沿着原型链继续向上传递。

这意味着，单纯使用`this.__proto__`不足以实现`super`。

事实上，JavaScript为每个函数添加了一个内部属性`[[HomeObject]]`。当一个函数被定义为对象方法或者类方法时，它的`[[HomeObject]]`属性就会被设置为这个对象。

这样一来，在上面的例子中，`derived.run.[[HomeObject]]`就为`derived`，`derivedAgain.run.[[HomeObject]]`就为`derivedAgain`。`super`关键字不需要通过`this`就能够获取当前对象，从而找到它的原型。

有两个问题是需要注意的。
1. 只有在对象方法和类方法上，`[[HomeObject]]`才是有效的。也就是说，形如`method: function() { ... }`的方式定义的函数不会设置`[[HomeObject]]`属性，从而不能通过`super`访问。
2. 任何一个在内部使用了`super`的函数都不应该在对象之间进行复制。这是因为，`[[HomeObject]]`永久地、静态地绑定了一个对象，随意将它复制给其他对象可能会导致预期之外的结果。比如下面的例子，将`obj1`的`run`复制给`obj2`，但内部的`super`不会变化，仍然是`obj1`，这当然是不符合预期的。

``` js
let base1 = {
    run() {
        console.log("Base1!");
    }
};

let obj1 = {
    __proto__: base1,
    run() {
        super.run();
    }
};

let base2 = {
    run() {
        console.log("Base2!");
    }
};

let obj2 = {
    __proto__: base2,
    run: obj1.run,
};

obj1.run();     // Base1!
obj2.run();     // Base1!
```

## 静态属性和方法
### 静态方法
我们已经知道，类方法都在类的函数的`prototype`上。我们称那些被直接赋值给类的函数本身的方法为**静态方法**。这个定义与传统面向对象语言的定义是一致的——静态方法并不属于类的对象（实例），而是属于类本身。

JavaScript中的静态方法以关键字`static`开头：
``` js
class Demo {
    static method() {
        console.log("I am a static method!");
    }
}

// 上面的声明与下面的赋值等价：
Demo.anotherMethod = function() {
    console.log("I am a static method too!");
}

Demo.method();  // I am a static method!
Demo.anotherMethod();  // I am a static method too!
```
### 静态属性
与静态方法类似，我们也可以用`static`关键字来修饰一个类字段使得它成为静态的，此时这个字段只存在于类本身，而不存在于任何一个类对象。
``` js
class User {
    static className = "User";
}

// 上面的声明与下面的赋值等价
User.anotherProp = "something"

console.log(User.className);        // User
```
### 静态方法和属性的继承
静态方法和属性都是可以被继承的。
``` js
class Base {
    static answer = 42;
    static sayAnswer() {
        console.log(`The answer is ${this.answer}!`);
    }
}

class Derived extends Base {}

console.log(Derived.answer);    // 42
Derived.sayAnswer();            // The answer is 42!
```
由此可见，`extends`关键字不仅将`Derived.prototype.[[Prototype]]`设为`Base.prototype`，还将`Derived.[[Prototype]]`设为`Base`。

## 属性访问权限
与很多面向对象语言一样，JavaScript也提供了控制属性访问权限的方式。我们可以将属性设为受保护、只读和私有的。受保护和私有的属性/方法称为内部接口，他们只能通过该类的其他方法访问（受保护的属性/方法还可以通过继承的类访问）。相应地，公共属性/方法被称为外部接口，任何人都可以访问它们。默认状态下，所有属性都是公共的。
### 受保护的属性
很多语言提供`protected`关键字表示属性或方法受保护，只有当前类和它的子类内部能够访问。JavaScript没有在语言级别上实现这一特性，而是约定：

**所有以下划线`_`为前缀的属性和方法都是受保护的方法。不应当从类/对象的外部访问它们。**

一种常见的使用受保护属性的场景是，我们需要控制某个属性的取值范围，例如，不小于零。在下面这个例子中，我们用一个受保护属性来存储值，然后通过一个访问器属性来读写它。
``` js
class Demo {
    _nonNegative = 0;
    get nonNegative() {
        return this._nonNegative;
    }
    set nonNegative(value) {
        if (value < 0) {
            console.log("The value of nonNegative should not be negative!");
        } else {
            this._nonNegative = value;
        }
    }
};

let obj = new Demo();

obj.nonNegative = 10;
console.log(obj.nonNegative);   // 10
obj.nonNegative = -1;           // The value of nonNegative should not be negative!
```

### 只读属性
使用上面的方式还可以创建只读属性——只要把setter函数去掉就可以了。注意到，这里并没有使用`get`和`set`函数，而是用一个普通的类方法进行封装。这样做的好处是，访问属性时可以带更多参数，使用更加灵活。
``` js
class Demo {
    _readOnly = 0;
    constructor(value) {
        this._readOnly = value;
    }
    getReadOnly() {
        return this._readOnly;
    }
};

let obj = new Demo(42);
console.log(obj.getReadOnly()); // 42
// 没有setter函数，无法修改readOnly的值
```
### 私有属性
ES2019添加了对私有属性的语言级支持。

私有属性和方法以`#`开头。它们只能在类本身的内部访问，不能从类的外部访问，也不能从子类的内部访问。我们来看一个例子。在这个例子中，我们设置了一个私有属性`#answer`，然后通过访问器属性`answer`来访问它。从这里可以发现，`#answer`和`answer`互不冲突。
``` js
class Demo {
    #answer = 42
    get answer() {
        // 使用方括号语法访问私有属性是没有意义的，会得到undefined
        // return this["#answer"];
        return this.#answer;
    }
    set answer(value) {
        this.#answer = value;
    }
}

let obj = new Demo();

console.log(obj.#answer);       // SyntaxError: Private field '#answer' must be declared in an enclosing class
console.log(obj.answer);        // 42
obj.answer = -42;
console.log(obj.answer);        // -42
```

## 扩展内建类
可以扩展（继承）`Array`，`Map`等内建类。
``` js
class MyArray extends Array {
    isEmpty() {
        return this.length === 0;
    }
}

let arr = new MyArray([1, 2, 3, 4, 5]);

let square = arr.filter(value => value * value);

console.log(arr.isEmpty());                 // false

console.log(square instanceof MyArray);     // true
```
在这个例子中，我们定义了一个新的类`MyArray`，它继承了内建类`Array`，并添加了一个新的方法`isEmpty`。它的实例对象`arr`既拥有新定义的`isEmpty`方法，又拥有`Array`的方法（例如`filter`和构造方法）。

一个有趣的事实是，`MyArray`的`filter`和`map`等方法返回的是`MyArray`的对象。这是通过`arr.constructor`来实现的——在内部，它们通过这个属性来调用当前类的构造函数来创建返回对象。这种行为是可以修改的。下面的例子中，我们为扩展的内部类添加了一个静态的getter，名为`Symbol.species`。这样一来，这些内建方法使用它的值作为构造函数来创建返回对象，在这个例子中为`Array`。
``` js
class MyArray extends Array {
    isEmpty() {
        return this.length === 0;
    }
    static get [Symbol.species]() {
        return Array;
    }
}

let arr = new MyArray([1, 2, 3, 4, 5]);

let square = arr.filter(value => value * value);

console.log(square instanceof Array);       // true
console.log(square instanceof MyArray);     // false
```

## Mixin模式
我们已经知道，JavaScript仅支持单继承。有些时候，我们希望一个类继承它的父类，同时拥有其他类的功能。Mixin就解决了这个问题——它提供一些实现特定行为的方法，我们将它添加到其他类中，从而无需继承就能为类添加特定的功能。

我们来看一个mixin的例子。在这个例子中，我们定义了两个mixin对象：`sayMixin`和`saySthMixin`。前者实现了`say`方法，而后者以之为原型，通过调用它的`say`方法实现了`sayHi`和`sayBye`。我们还定义了`Base`类和继承它的`Derived`类。在这之后，我们将`saySthMixin`的方法拷贝到`Derived`类，使得`Derived`类的对象`obj`具有了`saySthMixin`的方法。这就是mixin的工作方式，它允许类不通过继承也能获得其他类/对象的方法。

可以看到，mixin之间也可以具有继承关系。
``` js
let sayMixin = {
    say(msg) {
        console.log(`Message: ${msg}`)
    }
};

let saySthMixin = {
    __proto__: sayMixin,
    sayHi() {
        super.say("Hi!");
    },
    sayBye() {
        super.say("Bye!");
    }
};

class Base {
    answer = 42;
}

class Derived extends Base {}

Object.assign(Derived.prototype, saySthMixin);

let obj = new Derived();

obj.sayHi();    // Message: Hi!
obj.sayBye();   // Message: Bye!
```
