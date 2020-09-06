---
layout: article
title: "JS笔记-事件循环"
categories: "FrontEnd"
aside:
    toc: true
---

JavaScript代码的执行流程是基于**事件循环（event loop）**的。事件循环是**宏任务（macrotask）**、**微任务（microtask）**和浏览器**渲染（render）**进行调度的方式。

## 宏任务（macrotask）
宏任务基本上涵盖了JavaScript运行过程中引擎需要处理的所有事件。典型的宏任务包括：
- 网页中一个外部脚本`<script src="...">`加载完成，需要被执行
- 用户移动鼠标或者点击按钮，触发`mousemove`或`click`事件，需要执行处理程序
- 使用`setTimeout`指定的某段代码到了设定的运行时间
- ...

JavaScript引擎只能同时执行一个宏任务。所有已经产生但并未被执行的宏任务会被放入**宏任务队列**中，按照先进先出的顺序被引擎依次处理。

自然地，当JavaScript引擎正在执行宏任务时，浏览器不会进行渲染，不会执行其他任务，也不会对用户事件作出响应。这意味着，当我们在JavaScript脚本中执行一个用时较长的任务时，网页内容不会更新，用户无法与网页进行交互。下面的例子说明了这个问题，我们执行一个耗时较长的任务（从1数到1,000,000,000），紧随其后的是输出一条问候消息。这条问候消息将会在计数任务结束之后被输出，在此之前，引擎不会做其他任何事情（除了数数）。
``` js
let i = 0;

let start = new Date();

for (let j = 0; j < 1e9; ++j) {
    ++i;
}

console.log(`${new Date() - start}ms`);
console.log("Hello!");
```

## 微任务（microtask）
在[异步：Promise](/frontend/2020/09/02/1-JS-async-promise.html#微任务)中我们浅要地介绍了微任务的概念。简要来说，对`.then/catch/finally`处理程序的执行就会成为微任务，`await`隐式处理promise的结果，也会形成微任务。此外，函数`queueMicrotask(func)`可以将函数`func`加入微任务队列：
``` js
function greet() {
    console.log("Hello!");
}

Promise.resolve("Aloha!").then(console.log);
queueMicrotask(greet);

// 输出：
// Aloha!
// Hello!
```

## 事件循环
JavaScript引擎处于“等待任务——执行任务——等待任务”的事件循环中。简要来说，事件循环的算法是这样的：
1. 从宏任务队列中取出并执行最早的任务
2. 执行微任务队列中所有的任务
3. 执行渲染
4. 如果宏任务队列为空，则休眠等待新的宏任务到来
5. 新的宏任务到来，转到1

换言之，引擎将以这样的顺序执行代码：一个宏任务——所有微任务——渲染——下一个宏任务——...。

下面这段代码说明了这一顺序：
``` js
function createAnotherMicrotask(name) {
    return function() {
        console.log("Another microtask " + name);
    }
}

Promise.resolve("A microtask")
       .then(console.log);
       
queueMicrotask(createAnotherMicrotask(1));

setTimeout(() => console.log("Macrotask"));

setTimeout(() => {
    Promise.resolve("A microtask again")
        .then(console.log);
        
    queueMicrotask(createAnotherMicrotask("again"));
}, 1000);

console.log("Not in event loop");

// 输出
// Not in event loop
// A microtask
// Another microtask 1
// Macrotask
// A microtask again
// Another microtask again
```

## 应用
### 拆分高CPU负载任务
设想我们需要执行一个高CPU负载任务。它将长期占据引擎，直到执行完毕，在此期间网页不会被重新渲染，也不会响应用户事件。这是不好的。

我们可以利用`setTimeout`将高负载任务拆分成若干宏任务，在这些宏任务中间，渲染和微任务将正常进行。
``` js
// 一个高负载的任务：从1数到1 000 000 000
// 先输出"Count finished..."，后输出"Microtask!"
let i = 0;

let start = new Date();

for (let j = 0; j < 1e9; ++j) {
    ++i;
}

console.log(`Count finished with ${new Date() - start}ms.`);

Promise.resolve("Microtask!").then(console.log);

// 拆分成多个宏任务
// 先输出"Microtask!"，后输出"Count finished..."
let i = 0;

let start = new Date();

function count() {
    for (let j = 0; j < 1e7; ++j) {
        ++i;
    }
    if (i < 1e9) {
        setTimeout(count);
    } else {
        console.log(`Count finished with ${new Date() - start}ms.`);
    }
}

count();

Promise.resolve("Macrotask!").then(console.log);
```
### 进度指示
拆分高负载任务还可以让我们展示任务执行的进度。

下面这段代码实现了一个进度条。

<style>
.progress-container {
    height: 15px;
    background-color: #eeeeee;
    padding: 0;
    border-radius: 10px;
}

.progress {
    height: 15px;
    margin: 0;
    padding: 0;
    border-radius: 9px;
    text-align: center;
    color: #ffffff;
    background-color: #40a9ff;
}

.flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    margin: 20px 0px;
    color: #aaaaaa
}

.button {
    width: 80px;
    height: 30px;
    border-radius: 5px;
    border: 0;
    color: #eeeeee;
    background-color: #1890ff;
}

.button:disabled {
    background-color: #dddddd;
    color: #aaaaaa;
}

#target-container {
    width: 450px;
    margin-right: 20px;
}

#target-container div {
    width: 0%;
}

#target-label {
    width: 50px;
}
</style>
<div class="container flex">
    <div class="container flex">
        <div id="target-container" class="progress-container">
            <div id="target" class="progress"></div>
        </div>
        <div id="target-label">0%</div>
    </div>
    <div class="flex">
        <button class="button" id="start-button">Start!</button>
    </div>
</div>

<script>
"use strict";

let progress = document.getElementById("target");
let progressLabel = document.getElementById("target-label");
let button = document.getElementById("start-button");

let job = 0;

function run() {
    for (let i = 0; i < 1e6; ++i) {
        ++job;
    }

    progressLabel.innerText = `${job / 1e7}%`;
    progress.style.width = `${job / 1e7}%`;

    if (job < 1e9) {
        setTimeout(run);
    } else {
        button.disabled = false;
        button.innerText = "Restart!";
    }
}

button.onclick = () => {
    job = 0;
    progressLabel.innerText = `${job / 1e7}%`;
    progress.style.width = `${job / 1e7}%`;
    button.disabled = true;
    button.innerText = "Running...";
    run();
}
</script>

``` js
let progress = document.getElementById("target");
let progressLabel = document.getElementById("target-label");
let button = document.getElementById("start-button");

let job = 0;

function run() {
    for (let i = 0; i < 1e6; ++i) {
        ++job;
    }

    progressLabel.innerText = `${job / 1e7}%`;
    progress.style.width = `${job / 1e7}%`;

    if (job < 1e9) {
        setTimeout(run);
    } else {
        button.disabled = false;
        button.innerText = "Restart!";
    }
}

button.onclick = () => {
    job = 0;
    progressLabel.innerText = `${job / 1e7}%`;
    progress.style.width = `${job / 1e7}%`;
    button.disabled = true;
    button.innerText = "Running...";
    run();
}
```

另外，也可以通过事件循环的机制安排一个行为在当前正在处理的事件完成之后执行。具体做法是，在事件处理函数内部使用一个零延迟的`setTimeout`来安排一个行为。这个行为会进入宏任务队列，在当前事件处理完、微任务队列清空、浏览器重新渲染之后执行，如果它前面没有其他宏任务的话。


## 参考
[HTML标准 - 事件循环](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)