---
layout: article
title: "JS笔记-异步：调度执行"
categories: "FrontEnd"
aside:
    toc: true
---

某些时候我们希望等待一段时间之后再执行某个函数。这可以通过两个函数来实现：
- `setTimeout`设定函数在一段时间之后再执行。
- `setInterval`设定函数在一段之间之后开始以一定时间间隔重复运行。

它们不是JavaScript规范中的方法，但是被绝大多数的运行环境（包括所有浏览器和Node.js）支持。

### `setTimeout`
#### 语法
``` js
let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...);
```
#### 参数
- `func`：被调度执行的函数。
- `code`：被调度执行的代码，通过字符串形式传入。通常不建议这样传入。
- `delay`：函数被调用执行前的延时。单位为毫秒，默认值为`0`。
- `arg1`，`arg2`，...：要传递给被调度执行的函数的参数。

#### 返回值
- `timerId`：定时器标识符。可以用这个标识符来取消调度。

#### 示例
``` js
let timerId = setTimeout( function say(msg) {
    console.log(msg);
}, 1000, "Hello!" );

clearTimeout(timerId);      // 如果执行这条语句，那么上面的调度会被取消
                            // 于是什么都不会发生
```
### `setInterval`
#### 语法
``` js
let timerId = setInterval(func|code, [delay], [arg1], [arg2], ...)
```
参数和返回值的意义与`setTimeout`相同，不加赘述。

可以用`clearInterval(timerId)`来停止重复调用。

### 周期性调度
有两种方式实现周期性调度。

第一种是使用`setInterval`：
``` js
setInterval(() => console.log("tick"), 2000);
```
这种方式的问题有两个。第一，它只能设置函数以固定的间隔反复执行，不够灵活。第二，它设置的时间间隔较另一种方式更加不准确。请看下例：
``` js
let i = 1;

function func(n) {
    // 运行时间较长
}

setInterval( function run() {
    func(i++);
}, 100 );
```
在这个例子中，我们希望使用`setInterval`来让`run`每隔100毫秒运行一次。`run`内部调用的函数`func`运行时间较长，我们假设它小于100毫秒，但不能忽略不计。在这种情况下，引擎内部的执行情况实际上是这样的：

<div style="text-align: center;"><img src="https://gitee.com/lyc0037/pics/raw/master/img/20200831204741.png" width="80%"></div>

也就是说，调用`run`的实际间隔小于100毫秒。如果`func`的执行时间大于100毫秒，那么引擎会等待它执行完毕后立即再度调用它。这并不符合我们的期待。

第二种实现周期调度的方式是使用嵌套的`setTimeout`。这种方法解决了上面的问题。
``` js
let i = 1;

function func(n) {
    // 运行时间较长
}

setTimeout( function run() {
    func(i++);
    setTimeout(run, 100);
}, 100 );
```
在这种实现里，每次调度延时执行`run`时，`run`首先执行`func`函数，然后设定一定时间间隔之后再度调用自身，从而实现了周期性调度自身。也就是说，每次对`run`的延时调度都是由前一次执行发起的。

由于每次通过`setTimeout`发起对下一次执行的延时调度都发生在`func`执行完毕之后，所以两次`func`执行之间的时间大致上与设定的相同，至少不会受到`func`本身执行时间的影响。

<div style="text-align: center;"><img src="https://gitee.com/lyc0037/pics/raw/master/img/20200831210316.png" width="80%"></div>

另一方面，这种方式可以更加灵活地设置调用的时间间隔。例如，我们希望在服务器过载时降低请求频率，使得每次请求的时间间隔都是前次的两倍，直到服务器不再过载，就维持这个请求频率。
``` js
let i = 1;

let delay = 100;

function func(n) {
    // 运行时间较长
    return isOverloaded;
}

setTimeout( function run() {
    let isOverloaded = func(i++);
    if (isOverloaded) {
        delay = delay * 2;
    }
    setTimeout(run, delay);
}, delay );
```
### 零延时的`setTimeout`
如果使用`setTimeout(func, 0)`或者`setTimeout(func)`来设置延迟调用，那么效果会是，在当前脚本代码全部执行完毕后立即执行`func`。

另一方面，在浏览器环境中，零延时实际上并不为零。按照规范，当`setTimeout`或`setInterval`的嵌套调用超过五层时，两次调用函数之间应当有不低于4毫秒的间隔。

### HTML5规范中的定时器
[HTML5规范定义了浏览器中定时器的行为](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)。有几个值得注意的点需要在此列出：
- 全局作用域上存在一个活动定时器表。`clearTimeout`和`clearInterval`本质上就是在这个活动定时器表上将定时器的活动性清除，从而在定时器初始化阶段终止定时调度。
- 延时`timeout`不小于零。小于零的会被自动设为零。
- 所谓的嵌套调用层数，本质上是`setTimeout`和`setInterval`一共被调用了多少次。每一次调用都会增加一层嵌套深度。当深度超过5时，`timeout`就会被设定为不小于4。