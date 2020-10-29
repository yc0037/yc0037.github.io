---
layout: article
title: "Virtual DOM"
categories: "FrontEnd"
aside:
    toc: true
---

## Virtual DOM
Virtual DOM 是一种编程模式——它建立了 DOM 元素（UI）与内存中数据结构（JavaScript对象）之间的映射。

### 数据结构
Virtual DOM 将 UI 元素映射为内存中的数据结构，亦即JavaScript对象。这样的对象往往包含`tag`，`props`和`children`三个属性，分别表示HTML标签名、标签的属性和标签的子元素。

以 React DOM 对象为例：
``` js
const ele = (
  <h1>
    Hello!
    <div>
      World
    </div>
  </h1>
);

alert(JSON.stringify(ele));

// 输出
{
  "type":"h1",
  "key":null,
  "ref":null,
  "props": {
    "children": [
      "Hello!",
      {
        "type":"div",
        "key":null,
        "ref":null,
        "props": {
          "children":"World"
        },
        "_owner":null,
        "_store":{}
      }
    ]
  },
  "_owner":null,
  "_store":{}
}
```

### 更新 DOM
使用 Virtual DOM 的框架中，UI 是状态（`state`）的映射。页面（或者说 DOM）更新，当且仅当`state`发生了变化。

当`state`发生变化时，它所属的 Virtual DOM 结点会被重新生成。自然地，它的所有子结点也会被重新生成。紧接着，框架会比较新旧 Virtual DOM 结点对象的差异（事实上，可以是新的 Virtual DOM 结点与原本的 DOM）并更新 DOM。

React 的更新算法参见[React 文档 - 协调](https://zh-hans.reactjs.org/docs/reconciliation.html)。

#### 使用`key`属性来优化列表更新
设想我们需要更新一个列表，在它最前面增加一个`<li>0</li>`。
``` html
<ul>
  <!-- <li>0</li> -->
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```
如果我们单纯通过遍历 DOM 来检查`ul`的子结点的变化，就会引起所有子结点的重新生成和渲染。现在，我们为每个`<li>`增加一个`key`属性：
``` html
<ul>
  <!-- <li key="zero">0</li> -->
  <li key="one">1</li>
  <li key="two">2</li>
  <li key="three">3</li>
</ul>
```
这样，框架在更新 Virtual DOM 时就能够知道后面三个元素是不变的，不需要重新渲染，只要增加一个`<li key="zero">0</li>`子元素就可以了。

#### 异步更新
如果每个`state`更新都要重新渲染页面，那么会极大增加开销。React 这样的框架采用了异步更新的策略（见[浅入深出setState](https://segmentfault.com/a/1190000015615057)），简单来说就是，每次调用`setState`来更新`state`时，框架并不会立刻调用`render`方法，而是将这个更新放到一个更新队列里。更新页面作为一个异步的操作，会在一定的时间之后发生（例如，作为一个微任务，在一个事件循环的最后发生），此时框架会合并（并且去重）队列中对 DOM 进行修改的操作，再进行一次页面更新。

## 参考

- [React 文档 - Virtual DOM 及内核](https://zh-hans.reactjs.org/docs/faq-internals.html)
- [React 文档 - 元素渲染](https://zh-hans.reactjs.org/docs/rendering-elements.html)
- [React 文档 - 不使用 JSX 的 React](https://zh-hans.reactjs.org/docs/react-without-jsx.html)
- [React 生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [React 文档 - 协调](https://zh-hans.reactjs.org/docs/reconciliation.html)
- [你不知道的Virtual DOM](https://segmentfault.com/a/1190000016129036)
- [浅入深出setState](https://segmentfault.com/a/1190000015615057)
- [React Fiber 原理介绍](https://segmentfault.com/a/1190000018250127)