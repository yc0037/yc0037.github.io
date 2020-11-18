---
layout: article
title: "JS笔记-DOM 节点操作"
categories: "FrontEnd"
aside:
    toc: true
---

<style>
  button {
    margin: 10px 0;
    width: 5em;
    height: 2em;
    line-height: 2em;
    text-align: center;
    background-color: #13c2c2;
    color: #ffffff;
    border: 1px solid #08979c;
    border-radius: 5px;
  }
</style>

## 遍历 DOM 树
通过`document.body`可以访问到`<body>`标签对应的 DOM 节点。

### 子节点
DOM 节点的`childNodes`属性给出了节点的所有直接子节点。

对于嵌入 HTML 文档的脚本，这个属性只能读取到在它之前出现的节点。如下例：

``` html
<div id="message-box"></div>
<div id="my-target">
  <div>div1</div>
  <div>div2</div>
  <div>div3</div>
  <script>
    let mb = document.querySelector("#message-box");
    let target = document.querySelector("#my-target");
    for (let node of target.childNodes) {
      if (node.tagName) {
        let text = document.createElement('p');
        text.style.lineHeight = "1.2em";
        text.innerText = `${node.tagName}: ${node.tagName === 'SCRIPT' ? '...' : node.innerHTML}`;
        mb.append(text);
      }
    }
  </script>
  <div>div4</div>
  <div>div5</div>
</div>
```

<div class="example">
  <div id="message-box"></div>
  <style>
    #message-box {
      border: 1px #40a9ff solid;
      border-radius: 5px;
      margin: 10px;
      padding: 10px;
      background-color: #bae7ff;
    }
  </style>
  <div id="my-target">
    <div>div1</div>
    <div>div2</div>
    <div>div3</div>
    <script>
      let mb = document.querySelector("#message-box");
      let target = document.querySelector("#my-target");
      for (let node of target.childNodes) {
        if (node.tagName) {
          let text = document.createElement('p');
          text.style.lineHeight = "1.2em";
          text.innerText = `${node.tagName}: ${node.tagName === 'SCRIPT' ? '...' : node.innerHTML}`;
          mb.append(text);
        }
      }
    </script>
    <div>div4</div>
    <div>div5</div>
  </div>
</div>

#### `node.firstChild`和`node.lastChild`
可以通过`node.firstChild`和`node.lastChild`属性来访问节点的第一个/最后一个子节点。

还可以用`node.hasChildNodes()`来判断节点是否存在子节点。

### 兄弟节点和父节点
可以通过`node.previousSibling`和`node.nextSibling`属性来访问节点的前一个/后一个兄弟节点。

可以通过`node.parentNode`属性来访问父节点。

### 纯元素导航
如果我们只希望获得一个节点的元素子节点/兄弟节点/父节点，那么可以使用以下的属性：
- `node.children`：所有元素子节点的集合
- `node.firstElementChild`/`node.lastElementChild`：第一个/最后一个元素子节点
- `node.previousElementSibling`/`node.nextElementSibling`：上一个/下一个兄弟元素节点
- `node.parentElement`：父元素节点

通常情况下，父节点总是元素节点。唯一的例外是`document.documentElement`，也就是`<html>`元素。它的父节点是`document`，而`document`不是一个元素节点。因此，`document.documentElement.parentElement`为`null`。
{:.info}

## 节点属性
### 类型
下图给出了 DOM 节点在 JavaScript 中内建的类的继承层次关系：

<img width="60%" src="https://gitee.com/lyc0037/pics/raw/master/img/20201028133102.png"/>

可以用`instanceof`运算符来判断节点的类型，或者使用`toString`方法。更多说明参见[现代 JavaScript 教程 - DOM 节点类](https://zh.javascript.info/basic-dom-node-properties#dom-jie-dian-lei)。

#### `nodeType`
节点的`nodeType`属性也可以用来检查 DOM 节点类型。

- 对于元素节点，`node.nodeType == 1`
- 对于文本节点，`node.nodeType == 3`
- 对于`document`节点，`node.nodeType == 9`
- ......

`nodeType`是一个只读属性。

### 标签（tag）
可以通过`node.tagName`或`node.nodeName`来获取一个 DOM 节点的标签名。它们的区别在于：`tagName`只对元素节点有效，而`nodeName`对所有节点都有效。对于非元素节点，`nodeName`返回一个对应节点类型的字符串。

请看下例：

``` html
<div id="container">文本节点
  <element id="ele"></element>
  <script>
    const container = document.querySelector('#container');
    console.log(container.firstChild.tagName);    // undefined
    console.log(container.firstChild.nodeName);   // #text

    const ele = document.querySelector('#ele');
    console.log(ele.tagName);                     // ELEMENT
    console.log(ele.nodeName);                    // ELEMENT
  </script>
</div>
```

### 内容
### `innerHTML`

这个属性只对元素节点有效。
{:.warning}

通过**元素节点**的`innerHTML`属性可以获取和修改元素内部的 HTML 内容。请看下例：

``` html
<div class="example">
  <div id="c-message"></div>
  <div id="c-content">1</div>
  <script>
    let msg = document.querySelector('#c-message');
    let ctt = document.querySelector('#c-content');
    function flip() {
      if (ctt.innerHTML == '1') {
        ctt.innerHTML = 0;
        msg.innerHTML = 'Turn <b>1</b> to <b>0</b>';
      } else {
        ctt.innerHTML = 1;
        msg.innerHTML = 'Turn <b>0</b> to <b>1</b>';
      }
    }
  </script>
  <button onclick="flip()">Flip!</button>
</div>
```

<div class="example">
  <div id="c-message"></div>
  <div id="c-content">1</div>
  <script>
    let msg = document.querySelector('#c-message');
    let ctt = document.querySelector('#c-content');
    function flip() {
      if (ctt.innerHTML == '1') {
        ctt.innerHTML = 0;
        msg.innerHTML = 'Turn <b>1</b> to <b>0</b>';
      } else {
        ctt.innerHTML = 1;
        msg.innerHTML = 'Turn <b>0</b> to <b>1</b>';
      }
    }
  </script>
  <button onclick="flip()">Flip!</button>
</div>

值得注意的是，当我们使用`innerHTML += ...`的时候，我们事实上重写了 DOM 节点的所有内容——这会导致页面内容的重新加载。因此，这不是一个好的方法。
{:.warning}

### `outerHTML`

`outerHTML`属性包括了节点完整的 HTML 内容，即`innerHTML`外面套上元素标签本身。

对节点`outerHTML`属性的写操作十分微妙：它并不会修改节点对象的属性，而是用写入的新 HTML 来替换文档中的节点对象。请看下例：

``` html
<div class="example">
  <div id="o-message"></div>
  <div id="o-content">1</div>
  <script>
    let omsg = document.querySelector('#o-message');
    let octt = document.querySelector('#o-content');
    function change() {
      octt.outerHTML = '<div id="o-content">Changed!</div>';
      omsg.innerText = ctt.outerHTML;
    }
  </script>
  <button onclick="change()">Change!</button>
</div>
```

<div class="example">
  <div id="o-message"></div>
  <div id="o-content">1</div>
  <script>
    let omsg = document.querySelector('#o-message');
    let octt = document.querySelector('#o-content');
    function change() {
      octt.outerHTML = '<div id="o-content">Changed!</div>';
      omsg.innerText = ctt.outerHTML;
    }
  </script>
  <button onclick="change()">Change!</button>
</div>

### `data`和`nodeValue`
文本节点和注释节点的`data`和`nodeValue`属性给出文本节点的内容。

### `textContent`
`textContent`属性允许我们读取节点中所有的文本，而把所有的 tag 去掉。

写入`textContent`属性会将所有内容以字面值的形式写入，HTML 标签同样会被处理为文本。

<div class="example">
  <p id="tc-src">I have a <b>bold</b> text.</p>
  <p id="msga"></p>
  <p id="msgb"></p>
  <script>
    let tcsrc = document.querySelector('#tc-src');
    let msga = document.querySelector('#msga');
    let msgb = document.querySelector('#msgb');
    msga.innerHTML = `<b>Message</b>: ${tcsrc.textContent}`;
    msgb.textContent = `<b>Message</b>: ${tcsrc.textContent}`;
  </script>
</div>

``` html
<div class="example">
  <p id="tc-src">I have a <b>bold</b> text.</p>
  <p id="msga"></p>
  <p id="msgb"></p>
  <script>
    let tcsrc = document.querySelector('#tc-src');
    let msga = document.querySelector('#msga');
    let msgb = document.querySelector('#msgb');
    msga.innerHTML = `<b>Message</b>: ${tcsrc.textContent}`;
    msgb.textContent = `<b>Message</b>: ${tcsrc.textContent}`;
  </script>
</div>
```

### `hidden`
`hidden`属性指定元素是否可见。设置`hidden`属性为`true`，相当于设置`display: none;`。

### 操作 HTML 标签特性
JavaScript 提供下面的方法来操作 HTML 标签的特性：
- `elem.hasAttribute(name)` — 检查是否存在这个特性。
- `elem.getAttribute(name)` — 获取这个特性值。
- `elem.setAttribute(name, value)` — 设置这个特性值。
- `elem.removeAttribute(name)` — 移除这个特性。
- `elem.attributes` — 所有特性的集合。

### 通过`dataset`添加非标准特性
通过为标签添加非标准特性，我们可以将自定义的数据从 HTML 传递到 JavaScript，或者为 JavaScript 标记 HTML 元素。

<div class="example">
  <div show-info="name">Name: </div>
  <div show-info="age">Age: </div>
  <script>
    let showFlag = false;
    function capitalize(s) {
      return s.slice(0, 1).toUpperCase() + s.slice(1);
    }
    function show() {
      if (showFlag) {
        for (let div of document.querySelectorAll('[show-info]')) {
          div.innerText = capitalize(div.getAttribute('show-info'))+ ': ';
        }
        document.querySelector('#show-button').innerText = 'Show!';
      } else {
        let user = {
          name: "Alice",
          age: 24,
        };
        for (let div of document.querySelectorAll('[show-info]')) {
          div.innerText = capitalize(div.getAttribute('show-info'))
                          + ': '
                          + user[div.getAttribute('show-info')];
        }
        document.querySelector('#show-button').innerText = 'Hide!';
      }
      showFlag = !showFlag;
    }
  </script>
  <button id="show-button" onclick="show()">Show!</button>
</div>

``` html
<div show-info="name">Name: </div>
<div show-info="age">Age: </div>
<script>
  let showFlag = false;
  function capitalize(s) {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
  }
  function show() {
    if (showFlag) {
      for (let div of document.querySelectorAll('[show-info]')) {
        div.innerText = capitalize(div.getAttribute('show-info'))+ ': ';
      }
      document.querySelector('#show-button').innerText = 'Show!';
    } else {
      let user = {
        name: "Alice",
        age: 24,
      };
      for (let div of document.querySelectorAll('[show-info]')) {
        div.innerText = capitalize(div.getAttribute('show-info'))
                        + ': '
                        + user[div.getAttribute('show-info')];
      }
      document.querySelector('#show-button').innerText = 'Hide!';
    }
    showFlag = !showFlag;
  }
</script>
<button id="show-button" onclick="show()">Show!</button>
```

一个问题是，我们如何避免自定义的非标准特性名与将来被收录进标准的特性发生冲突？

HTML 标准规定，所有以`data-`开头的特性名都保留给开发者使用。可以通过`dataset`属性访问这些特性。如下例：

<div class="example">
  <div id="data-msg" data-msg="data message!"></div>
  <script>
    let dmsg = document.querySelector('#data-msg');
    dmsg.innerText = dmsg.dataset.msg;
  </script>
</div>

``` html
<div class="example">
  <div id="data-msg" data-msg="data message!"></div>
  <script>
    let dmsg = document.querySelector('#data-msg');
    dmsg.innerText = dmsg.dataset.msg;
  </script>
</div>
```


## 创建一个元素
有两种方法可以创建一个新的节点：
- `document.createElement(tag)` 用给定的标签`tag`创建一个元素节点。
- `document.createTextNode(text)` 用给定的文本创建一个新的文本节点。

## 向 HTML 文档中插入元素
可以使用`node.append(element)`方法，将节点`element`插入到节点`node`的末尾。类似的方法有：
- `node.append(element)` —— 将节点`element`插入到节点`node`的末尾
- `node.prepend(element)` —— 将节点`element`插入到节点`node`的开头
- `node.before(element)` —— 将节点`element`插入到节点`node`的前面
- `node.after(element)` —— 将节点`element`插入到节点`node`的后面
- `node.replaceWith(element)` —— 用节点`element`来替换节点`node`

注意，这里的`element`既可以是 DOM 节点对象，也可以是字符串。对于`element`是字符串的情况，字符串中所有的字符都会被转义，以字面量的形式被插入文档中。
{:.info}

### `insertAdjacentHTML`
JavaScript 还提供了`node.insertAdjacentHTML(where, html)`方法，将 HTML 代码片段直接插入到文档中。其中，`where`参数指定代码片段相对于`node`的插入位置：
- `"beforebegin"`，将`html`插入到`node`之前
- `"beforeend"`，将`html`插入到`node`开头
- `"afterbegin"`，将`html`插入到`node`结尾
- `"afterend"`，将`html`插入到`node`之后

## 移除节点
`node.remove()`方法可以移除节点。

<div class="example">
  <div id="tbremoved">KEBAB</div>
  <script>
    function removeKebab() {
      document.querySelector('#tbremoved').remove();
    }
  </script>
  <button onclick="removeKebab()">Remove!</button>
</div>

``` html
<div class="example">
  <div id="tbremoved">KEBAB</div>
  <script>
    function removeKebab() {
      document.querySelector('#tbremoved').remove();
    }
  </script>
  <button onclick="removeKebab()">Remove!</button>
</div>
```

另一方面，如果我们要移动元素，那么不需要将它移除。换句话说，所有插入方法都会自动从原位置移除节点。

<div class="example">
  <div id="sw-first">first</div>
  <div id="sw-second">second</div>
  <script>
    let swflag = false;
    function switchDiv() {
      let first = document.querySelector('#sw-first');
      let second = document.querySelector('#sw-second');
      if (swflag) {
        first.after(second);
      } else {
        second.after(first);
      }
      swflag = !swflag;
    }
  </script>
  <button onclick="switchDiv()">Switch!</button>
</div>

``` html
<div class="example">
  <div id="sw-first">first</div>
  <div id="sw-second">second</div>
  <script>
    let swflag = false;
    function switchDiv() {
      let first = document.querySelector('#sw-first');
      let second = document.querySelector('#sw-second');
      if (swflag) {
        first.after(second);
      } else {
        second.after(first);
      }
      swflag = !swflag;
    }
  </script>
  <button onclick="switchDiv()">Switch!</button>
</div>
```

## 克隆节点
`node.clone(flag)`方法可以创建一个节点的克隆。`flag`指示克隆出的节点是否包括原节点的所有子元素。

## 修改节点样式
通过节点的`style`属性可以访问和修改节点的样式。

设置`style`属性，相当于在 CSS 中添加了一个相应的语句。

如果想要移除通过`style`属性设置的节点样式属性，只需要将对应的属性设置为空字符串，如`node.style.display = "";`。

也可以通过对`node.style.cssText`进行赋值，来完全重写对应节点的样式。

## 修改节点的类
相比于直接修改节点样式，修改节点的类更加灵活。JavaScript 通过`className`和`classList`属性来访问和修改节点的类。前者对应 HTML 标签的`class`特性，访问和修改的都是整个`class`特性字符串；后者是节点所有类名组成的可迭代对象，可以通过`add`、`remove`、`toggle`（如果存在这个类，就将它删除，否则添加这个类）、`contains`（检查是否存在这个类）等方法进行访问和修改，也可以通过`for ... of`来迭代。
