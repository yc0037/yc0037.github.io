---
layout: article
title: "JS笔记-异步：Promise"
categories: "FrontEnd"
aside:
    toc: true
---

## 回调
### 动机
设想我们需要在网页中加载一段脚本，并使用其中的函数。我们可以这样做：
``` js
// bar.js
let msg = "Hello!";

function getMsg() {
    return msg;
}

// main.js
function loadScript(src) {
    let script = document.createElement("script");
    script.src = src;

    document.head.append(script);
}

loadScript("./bar.js");

// 运行bar.js中的方法func
console.log(getMsg());
```
这里有一个问题：`loadScript`只是创建了一个`<script>`标签指示浏览器应当获取某个脚本文件，`getMsg()`不会等到`loadScript`加载完再执行，而是在它执行完毕后开始执行。如此一来，引擎可能找不到需要执行的`getMsg`函数，因为它所在的脚本文件可能还没有被加载。

我们希望告诉引擎，一旦脚本加载完毕，就立即调用`getMsg`函数。这就要用到回调：
``` js
function loadScript(src, callback) {
    let script = document.createElement("script");
    script.src = src;
    script.onload = callback;

    document.head.append(script);
}

loadScript("./bar.js", () => {
    document.getElementById("target").innerText = getMsg();
});
```
我们为`loadScript`添加了一个新参数`callback`，并通过`script`标签的`onload`属性设置其行为，使得`script`标签中一旦加载完毕，就立即执行`callback`函数的内容。

这就是**回调**：为异步执行的某个函数设置在相应事件发生时应当执行的代码。

### 回调地狱
有些时候，我们需要依次加载多个脚本文件，只有当前一个加载完毕，才开始下一个加载。一种实现是将后续的加载写到前次的回调函数中：
``` js
loadScript("./1.js", function() {
    console.log("1.js loaded!");

    loadScript("./2.js", function() {
        console.log("2.js loaded!")
        // ...
    });
});
```
另一方面，我们希望跟踪调用过程中发生的错误。可以在回调函数中增加一个参数`error`，用来让用户知道加载是否失败。
``` js
loadScript("./1.js", function(error, script) {
    if (error) {
        console.log("An error happens!")
    } else {
        console.log("1.js loaded!");

        loadScript("./2.js", function(error, script) {
            // ...
        });
    }
});
```
这种方式称为“Error优先回调”。它约定：
- 回调函数`callback`的第一个参数用来存放`error`，一旦发生`error`，就会调用`callback(error)`。
- `callback`剩余的参数会在异步行为成功后被使用，相当于调用`callback(null, arg1, arg2, ...)`。

但问题在于，如果有多个需要依次执行的异步行为，那么就会发生非常深层的嵌套调用：
``` js
loadScript("./1.js", function(error, script) {
    if (error) {
        console.log("An error happens!")
    } else {
        console.log("1.js loaded!");

        loadScript("./2.js", function(error, script) {
            if (error) {
                console.log("An error happens!")
            } else {
                console.log("2.js loaded!");

                loadScript("./3.js", function(error, script) {
                    if (error) {
                        console.log("An error happens!")
                    } else {
                        console.log("3.js loaded!");

                        // ...
                    }
                });
            }
        });
    }
});
```
有人称之为“回调地狱”。这样的代码非常难以编写、阅读和维护。

一种改进的方式是把每个回调函数都单独声明：
``` js
function step1(error, script) {
    if (error) {
        console.log("An error happens!")
    } else {
        console.log("1.js loaded!");

        loadScript("./2.js", step2);
    }
};

function step2(error, script) {
    if (error) {
        console.log("An error happens!")
    } else {
        console.log("2.js loaded!");

        loadScript("./3.js", step3);
    }
};

function step3(error, script) {
    if (error) {
        console.log("An error happens!")
    } else {
        console.log("3.js loaded!");

        // ...
    }
};

loadScript("./1.js", step1);
```
这解决了多层回调嵌套的问题，但是引入了两个新的问题：
1. 代码的可读性变差了。你需要在若干个函数之间跳转才能理清代码的行为。
2. 许多不会被复用的代码段被声明成了函数，占用了命名空间。

为了解决这些问题，我们需要Promise。

## Promise
如前所言，Promise旨在连接“生产者”与“消费者”，使得“消费者”能及时获取到“生产者”经过一段时间产生出来的数据。

### “生产者”，Promise对象
Promise对象的构造器语法如下：
``` js
let promise = new Promise( function(resolve, reject) { ... } );
```
传递给构造器的函数即为“生产者”代码，或称executor。它会在Promise对象创建时开始运行，并“生产”出结果。Executor执行完毕后，必须调用以下两个回调函数之一：
- `resolve(value)`，如果执行成功，结果为`value`。
- `reject(error)`，如果执行失败，错误对象为`error`。`error`最好是一个继承自`Error`的对象。

一个executor只能以一个`resolve`或`reject`为终点。如果已经调用了一个`resolve`或`reject`，那么后续的调用都会被忽略。

`resolve`和`reject`都最多只接收一个参数，多余的参数会被忽略。

Promise对象具有两个内部属性， 它们的取值与`executor`的执行状态和结果有关：
- `state`：表达Promise中`executor`的执行状态。起初是`"pending"`，调用`resolve`后变为`"fullfilled"`，调用`reject`后变为`"rejected"`。
- `result`：表达Promise中`executor`的执行结果。起初是`undefined`，调用`resolve(value)`后变为`value`，调用`reject(error)`后变为`error`。

下面是Promise的状态转换图：
<div style="text-align: center;"><img src="https://gitee.com/lyc0037/pics/raw/master/img/20200902153354.png" width="70%"></div>

### “消费者”，`then`，`catch`与`finally`
Promise的`state`和`result`都是内部属性，需要通过`then`，`catch`和`finally`来注册处理这些状态的回调函数。

#### `then`
`then`的语法如下：
``` js
promise.then(
    function(result) { ... },
    function(error)  { ... }
);
```
`then`接收两个函数作为参数。第一个函数在Promise resolve之后运行，接收`result`中的运行结果。第二个函数在Promise reject之后运行，接收`result`中的`error`。也可以不传入第二个参数，这样`then`就只用来处理成功执行的结果。

#### `catch`
`.catch(errorHandler)`用来处理Promise reject的情况，本质上等于`.then(null, errorHandler)`。

值得注意的是，在Promise链上抛出的Error也会被自动转换成reject，传递给最近的`errorHandler`。
``` js
new Promise((resolve, reject) => { throw new Error("Something Wrong!"); })
    .then(
        (result) => console.log(`Resolved: ${result}`),
        (error) => console.log(`Rejected: ${error}`),
    );      // Rejected: Error: Something Wrong!
```

JavaScript的`try..catch`并不能捕获异步方法中的错误！例如，下面这段代码中的错误是无法被捕获的：
{:.error}

``` js
try {
    new Promise((resolve, reject) => { throw (new Error("Something Wrong!")) })
        .then((result) => console.log(`Resolved: ${result}`));
} catch (error) {
    console.log(error);
}
```

如果一个reject或者Error没有被捕获，那么它会被JavaScript引擎追踪到。在浏览器中，它会产生一个全局的uncaught error显示在控制台中；在Node.js中，它会直接导致程序异常终止。显然，我们不希望这样的事情发生。

HTML标准中定义了一个`unhandledrejection`事件，可以用来捕获这类rejection：
``` js
window.addEventListener('unhandledrejection', function(event) {
  // 这个事件对象有两个特殊的属性：
  alert(event.promise); // [object Promise] - 生成该全局 error 的 promise
  alert(event.reason); // Error: Whoops! - 未处理的 error 对象
});
```

在Node.js中，可以通过绑定`unhandledRejection`事件来捕获未处理的rejection：
``` js
process.on('unhandledRejection', (reason, promise) => {
    console.log('未处理的拒绝：', promise, '原因：', reason);
    // 记录日志、抛出错误、或其他逻辑。
  });
  
Promise.resolve(1).then((res) => {
    return JSON.pasre(res); // 故意输错 (`pasre`)。
}); // 没有 `.catch()` 或 `.then()`。
```

#### `finally`
`finally(f)`意味着`f`总是会在Promise settled之后被执行，无论它被resolve还是reject。从这个角度上说，`.finally(f)`相当于`.then(f, f)`，但二者在细节上有所不同：
- `.finally(f)`中，`f`没有参数，因为我们在`finally`子句中要做的事情与Promise的结果无关。
- `.finally(f)`会将结果（`result`或`error`）传递给Promise链上的下一个处理程序。

#### 使用Promise重写`loadScript`
``` js
function loadScript(src) {
    return new Promise( function(resolve, reject) {
        let script = document.createElement("script");
        script.src = src;

        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error("Script load error!"))
        
        document.head.append(script);
    } );
}

let promise = loadScript("./bar.js")
    .then(
        script => {
            document.getElementById("target").innerText = getMsg();
            return script;
        },
        error => {
            alert(error.message);
            return error;
        }
    )
    .then(result => alert(result));

promise.then(
    script => alert(script.src)
);
```
有几点值得注意：
- 同一个promise上可以有多个`then`对它进行处理，它们相互不影响。
- 可以使用Promise链将结果在回调函数间传递，优雅地解决了回调地狱的问题。

### Promise链
我们已经看到了一个Promise链的例子。它在Promise上连续调用`then`/`catch`/`finally`，它们都返回一个`thenable`的对象（也就是具有`then`方法的对象，例如Promise），后一个处理程序在前一个处理程序返回的Promise settled之后继续执行，后一个处理程序的参数是前一个处理程序的返回值。

下面就是一个返回Promise对象的`then`的例子。
``` js
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result); // 1

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 4

});
```

使用Promise链可以有效解决回调地狱。仍以`loadScript`为例，可以看到，所有`then`的调用都是平级的。
``` js
loadScript("./1.js")
    .then(
        script => {
            alert(`Successfully load ${script.src}!`);
            loadScript("./2.js");
        },
        error => alert(error.message)
    )
    .then(
        script => {
            alert(`Successfully load ${script.src}!`);
            loadScript("./3.js");
        },
        error => alert(error.message)
    )
    // ...
```

另一个使用Promise链的例子是ES6加入的`fetch`方法。

### Promise类的静态方法
#### `Promise.all`
`Promise.all`并行执行多个Promise，等待它们全部完成后，收集结果并返回。
``` js
// 参数：   一个数组，存放希望并行执行的所有Promise。不是Promise的参数将被原样传递到result
// 返回值： 一个新的Promise对象
//          如果所有Promise都执行成功，那么result为所有Promise执行结果依次组成的数组
//          只要有一个Promise reject，就直接settled，error为这个reject对应的error
let promise = Promise.all([...promises...]);

// 在下面的例子中，promise对象在3s后settled，resolve得到的结果为[ 1, 2, 3 ]
Promise.all([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)),
    new Promise(resolve => setTimeout(() => resolve(2), 2000)),
    new Promise(resolve => setTimeout(() => resolve(3), 1000)),
    4,
]).then(console.log);

// 在下面的例子中，promise对象在2s后settled，reject得到的结果为“promise2 rejected”
// 其余两个Promise的结果被忽略了
Promise.all([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("promise2 rejected")), 2000)),
    new Promise(resolve => setTimeout(() => resolve(3), 1000)),
]).then(console.log, console.log);      // Error: promise2 rejected
```
#### `Promise.allSettled`
`Promise.allSettled`与`Promise.all`非常相似，唯一的区别在于，无论每个Promise是resolved还是rejected，它们的结果都会被放到返回Promise对象的result中。这个result数组的元素结构如下：
- `{ status: "fulfilled", value: result }`，如果对应的Promise resolved。
- `{ status: "rejected", reason: error }`，如果对应的Promise rejected。

``` js
Promise.allSettled([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("promise2 rejected")), 2000)),
    new Promise(resolve => setTimeout(() => resolve(3), 1000)),
]).then(console.log);

// 输出
[
  { status: 'fulfilled', value: 1 },
  {
    status: 'rejected',
    reason: Error: promise2 rejected
        // <call stack>
  },
  { status: 'fulfilled', value: 3 }
]
```

#### `Promise.race`
`Promise.race`与`Promise.all`的语法类似。区别在于，`Promise.race`在第一个Promise settled之后就会settled，并只保留这个Promise的结果。其他的Promise将会继续运行，但结果会被忽略。
``` js
Promise.race([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error("promise2 rejected")), 500)),
    new Promise(resolve => setTimeout(() => resolve(3), 1000)),
]).then(
    (result) => console.log(`Resolved: ${result}`),
    (error) => console.log(`Rejected: ${error}`)
);      // Rejected: Error: promise2 rejected
```

#### `Promise.resolve`/`Promise.reject`
事实上，这两个方法已经过时了，可以用`async`/`await`来取代它们。

`Promise.resolve(value)`将值`value`包装到一个已经resolved的Promise对象里。它等价于`new Promise(resolve => resolve(value))`。

`Promise.reject(error)`将错误信息`error`包装到一个已经rejected的Promise对象里。它等价于`new Promise((resolve, reject) => reject(error))`。

### Promisification
Promisification即Promise化（Promisify），也就是将一个接收回调的函数转换为一个返回Promise对象的函数。

一个简单的promisify函数的实现如下：
``` js
function promisify(f) {
    return function fP(...args) {
        return new Promise((resolve, reject) => {
            function callback(error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }

            args.push(callback);
            f.apply(this, args);
        });
    }
}
```
当然，这个实现有一个缺陷：它假设原始函数`f`的回调函数的参数格式为`(error, result)`。如果回调函数的参数设计不同，那么这个实现的结果就是错误的。

需要注意的是，promisify不能完全替代回调。如果回调函数需要多次执行，那么就无法用promisify来实现。

较为完整的promisification可以使用一些库，如[es6-promisify](https://github.com/digitaldesignlabs/es6-promisify)或者Node.js内建的`util.promisify`函数。

### `async`/`await`
`async`和`await`简化了使用promise的语法。
#### `async`
`async`关键字可以用来修饰函数。被`async`修饰的函数，它的返回值会被自动地包裹在一个resolved的promise中。请看下例：
``` js
async function run() {
    return 1;
}

// 等价于
function run() {
    return new Promise(resolve => resolve(1));
}

run().then(console.log);        // 1
```
#### `await`
`await`关键字只能在`async`函数内部使用。它用来修饰一个promise对象，指示引擎等待直到这个对象settled，然后返回结果。
``` js
async function run() {
    let result = await new Promise((resolve) => setTimeout(() => resolve(1), 2000));

    console.log(result);

    return result;
}

run();
```
有几点需要注意：
- `await`实际上可以修饰任何thenable的对象，也就是具有`then`方法的对象。
- `await`必须在一个`async`函数的内部才能使用。我们可以通过一个`async`的IIFE来包裹`await`语句：
``` js
(async () => {
    await new Promise(resolve => {
        setTimeout(() => console.log("Hello!"), 1000);
    });
})();
```
- 使用`await`修饰的promise对象rejected时会抛出Error。这个error（在`async`函数内部）可以使用`try..catch`来捕获和处理，也可以用`.catch(errorHandler)`来处理。

### 微任务
现在，让我们来深入观察promise的内部细节。首先看这个例子：
``` js
let promise = Promise.resolve();

promise.then(() => console.log("Promise resolved!"));

console.log("I'm here!");
```
这段代码并不会像我们想象的那样，先输出"Promise resolved!"，再输出"I'm here!"，而是恰恰相反。这意味着，`promise.then`并非如我们期待的那样，在程序中按出现的顺序执行。

事实上，JavaScript内部维护一个队列`PromiseJobs`，通常被称为**微任务队列**。它的运行机制如下：
- 微任务队列是一个先进先出的队列，先进入队列的任务先运行。
- 当一个promise准备就绪时，它的`.then/catch/finally`处理程序会被添加到微任务队列中。
- 当JavaScript引擎没有其他任务正在运行时，它才会到微任务队列中取得任务并执行。

对于上面的代码，如果我们关心两条信息输出的顺序，就只能使用`.then`将输出后一条信息的代码也加入到微任务队列中：
``` js
let promise = Promise.resolve();

promise.then(() => console.log("Promise resolved!"))
       .then(() => console.log("I'm here!"));
```

另一个有趣的特点来自[promise对reject和error的处理](#catch)。如果我们延迟`.catch`的执行，会发生什么呢？
``` js
// Node.js

let promise = Promise.reject(new Error("Something wrong again!"));

setTimeout(() => promise.catch(error => console.log(error.message)), 1000);

process.on("unhandledRejection", (e) => {
    console.log(`Unhandled rejection: ${e.message}`);
});
```
答案是，会先触发`unhandledRejection`，再执行`catch`处理程序。

这与`unhandledRejection`（或者浏览器中`unhandledrejection`）的生成时机有关：如果有一个rejection在微任务队列的末尾还没有被处理，就会触发这个事件。

所以，上一段代码执行的过程中发生了这样的事情：我们创建了一个Promise对象，它在创建后立即rejected，抛出了一个Error，此时微任务队列为空，而这个Error还没有被处理，于是触发了`unhandledRejection`事件。1000毫秒后，`catch`处理程序姗姗来迟，进入微任务队列，捕获到了这个Error，于是执行这个处理程序，输出结果。

这告诉我们，rejection的处理不应该是异步的。事实上，这样做会引发一个warning。

Promise揭示了JavaScript处理异步程序的机制的一部分。更多内容参考[事件循环](/frontend/2020/09/04/1-JS-event-loop.html)。