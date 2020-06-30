---
layout: article
title: "HTML语义化"
categories: "前端"
aside:
    toc: true
---

# HTML语义化

> 整理<a href="http://justineo.github.com/slideshows/semantic-html/">顾轶灵的HTML语义化讲义</a>

## 动机

让机器能够理解HTML文档的内容。

## HTML语义

元素+属性+属性值(+文档结构)

### 全局属性

- `id`属性用于引用，不应依赖其语义
- `class`属性的值应当表达元素的语义
- `title`属性
    - 链接：描述目标信息
    - 图片：版权/描述
    - 引用：来源信息
    - 交互元素：操作指南
    - ……
- `lang`属性表示内容的语言

### 元数据(metadata)

放在`<head>`元素中
- `<title>`元素表示文档对外的标题
    - 窗口标题
    - 历史记录
    - 搜索结果
    - ……
- `<meta>`元素
    - `name`/`http-equiv`(控制一些HTTP header字段)/`charset`
    - `name`属性决定种类，`content`属性表示内容
    - 标准名称：`application-name`, `author`, **`description`**, `generator`, **`keywords`**
    - 扩展名称
        - `robots`告诉搜索引擎如何对待文档。`noindex`不要索引, `noarchive`不要存档/缓存, `nofollow`不要继续搜索本页中的链接等
        - 还有其他扩展名称，参见<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta">MDN文档</a>。

### 链接

#### 外部资源链接

元数据中的`<link>`标签表示当前文档与外部资源之间的关系。

该标签必须包含`rel`和`href`属性。

`rel`属性的取值表示链接目标的类型。

- `rel="stylesheet"`: 链接到层叠样式表
- `rel="alternate"`: 链接到当前文档的其他形式
- `rel="alternate stylesheet"`: 链接到可替换的样式表(Firefox支持快速切换样式表)
- `rel="prev"`, `rel="next"`: 链接到该页面的前/后一页
- `rel="icon"`: 链接到当前文档的favicon
- 更多类型参见<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types">MDN文档</a>。

#### 超链接

`<a>`标签包裹的内容为超链接。没有`href`属性时为超链接占位符。

`<a>`标签也可以有`rel`属性。
- `rel="prev"`, `rel="next"`: 链接到该页面的前/后一页
- `rel="nofollow"`: 指示搜索引擎不建议爬取该链接对应的文档
    - 不可信赖的内容
    - 付费链接
    - 注册、登录界面等低优先级的文档

### 语义化的结构元素

<dl>
<dt><code>&lt;article&gt;</code></dt>
<dd>独立的文档、页面、应用、站点等。</dd>
<dt><code>&lt;section&gt;</code></dt>
<dd>将内容分组，通常有标题，希望内容出现在文档的大纲中。</dd>
<dd>子元素中的&lt;h1&gt;元素语义上等价于父元素中的&lt;h2&gt;。如图：</dd>
<div style="text-align: center; margin: 30px;">
<img src="http://lyc0037.gitee.io/pics/img/20200630p1.png" width="70%">
</div>
<dt><code>&lt;nav&gt;</code></dt>
<dd>导航栏。示例：</dd>
</dl>
```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/news">News</a></li>
    <li><a>Examples</a></li>
  </ul>
</nav>
```
<dl>
<dt><code>&lt;aside&gt;</code></dt>
<dd>侧边栏内容，往往与周围内容关系不密切。</dd>
<dt><code>&lt;header&gt;</code></dt>
<dd>介绍性描述或导航信息，如目录、搜索框、logo等。</dd>
<dd>通常包含<code>h1</code>-<code>h6</code>。</dd>
<dd><b>不影响</b>文档提纲的生成。</dd>
<dd>用法示例见<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/header">MDN参考文档</a>。</dd>
<dt><code>&lt;footer&gt;</code></dt>
<dd>代表最近的父级区块内容的页脚。</dd>
<dd>作者信息，版权信息，相关文档。</dd>
<dd><b>不影响</b>文档提纲的生成。</dd>
</dl>

一个示例：
<div style="text-align: center; margin: 30px;">
<img src="http://lyc0037.gitee.io/pics/img/20200630194928.png" width="95%">
</div>

### 文本级语义

#### `em` vs `strong`

`em`元素表示侧重点的强调，位置不同，文本的含义也会不同。通常渲染为<em>斜体</em>。
`strong`元素表示内容本身的重要性，位置不同，文本的含义不改变。通常渲染为<strong>粗体</strong>。

#### 语义化的文字标签

从表达样式的标签变成表达语义的标签。

`i`表示另一种叙述方式，如画外音/外来语/分类学名词等，建议与`class`或`lang`属性搭配使用。

`b`表示某种需要引起注意却又没有其他额外语义的内容，如关键词句等，建议与`class`属性搭配使用。

`small`用来表达所谓的fine print，如免责声明/许可证声明/注意事项等。

`s`用来表达不再准确或不再相关的内容，如：
```html
¥ <strong>76.5</strong> <s>原价79.0</s>
```

效果为：¥ <strong>76.5</strong> <s>原价79.0</s>

`u`元素表示用非文本进行的标注的内容，如中文专有名词/拼写检查的错误等。

#### 其他语义标签

`dfn`元素用来展现一个术语的定义实例，最接近的父级段落、定义列表组或区块内容必须包含 dfn 元素指定术语的定义。这有助于搜索引擎抽取特定术语的含义，来回答「What is ...?」类的问题。

`mark`元素有两种用法。
- 用于引文中，表示<mark>当前文档</mark>需要强调但原文并未强调的内容，如对引文的批注。
- 表示与用户行为相关的内容，如<mark>高亮</mark>搜索关键词。

`ruby`元素表示带注音的CJK文字。如：
```html
<ruby>和<rp>(</rp><rt>hé</rt><rp>)</rp>谐<rp>(</rp><rt>xié</rt><rp>)</rp>社<rp>(</rp><rt>shè</rt><rp>)</rp>会<rp>(</rp><rt>huì</rt><rp>)</rp></ruby>
```

效果如下：

<ruby>和<rp>(</rp><rt>hé</rt><rp>)</rp>谐<rp>(</rp><rt>xié</rt><rp>)</rp>社<rp>(</rp><rt>shè</rt><rp>)</rp>会<rp>(</rp><rt>huì</rt><rp>)</rp></ruby>

<div style="text-align: center; margin: 30px;">
<img src="http://lyc0037.gitee.io/pics/img/20200630212525.png" width="85%">
</div>

### 编辑记录

使用`ins`和`del`元素表示对当前文档的删改，记录文档的编辑历史。

用`cite`属性指向对某个修改的说明页面。

用`datetime`属性表示该修改发生的时间。

### 微格式(Microformats)

Microformats 是 HTML 的扩展，用来标注人物/组织/事件/地点/简历/菜谱等，很多格式已是业界的事实标准。

用HTML已有的元素和属性，通过对属性值语义的扩展(主要是`class`属性)和文档结构的约定来表达特定的语义。下图是一个例子：

<div style="text-align: center; margin: 30px;">
<img src="http://lyc0037.gitee.io/pics/img/20200630213621.png" width="85%">
</div>

其他微格式：<a href="http://microformats.org/wiki/hcalendar">hCalendar</a>(用于发布待办事件)，<a href="http://microformats.org/wiki/hreview">hReview</a>(用于发表书评/影评等)

对HTML `rel`属性值的扩展定义也是微格式的一种形式

### 微数据(Microdata)

允许在文档中插入一组键值对的集合。

用`itemscope`属性来标记项的位置，还可以用`itemtype`给出项的模式，用`itemid`给出当前项的全局ID。

用`itemprop`属性标记当前项的属性名。

通过一系列的取值规范和统一词汇表来使得搜索引擎能够理解文档的语义。

一个实例：
<div style="text-align: center; margin: 30px;">
<img src="http://lyc0037.gitee.io/pics/img/20200630215158.png" width="75%">
</div>