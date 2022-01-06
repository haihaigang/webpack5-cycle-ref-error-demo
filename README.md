# Uncaught ReferenceError: Cannot access 'createAction' before initialization

## 原因

在 升级项目到 webpack5 后，重新启动后遇到如题所述的错误。原因是因为有文件循环引用，在开启 sideEffects 后编译的代码改变引用文件先后顺序造成问题。


文件引用关系如下：

```
         <---------
        /          \
index.js ----------> service.js
        \           /
         -> wx.js -> 
         
wx.js 中直接调用 service.js 中的 createAction 方法

```

## 解决

解决的办法就是移除循环引用，这里断开 servcie.js 对 index.js 的引用

## 源码

```
// App.js

import { createAction } from "./common"
```

## 未开启 sideEffects 编译后

```
...

/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common */ "./src/common/index.js");
...

// 编译后先引用 ./src/common/index.js 文件

// 调用堆栈如下：
- createAction
- ./src/common/wx.js
- ./src/common/index.js
- ./src/App.js

// 最后执行 createAction 时 service.js 已执行完成，所以运行正确

```

## 开启 sideEffects 编译后

```
...

/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common */ "./src/common/service.js");
...

// 编译后先引用 ./src/common/service.js 文件

// 调用堆栈如下：
- createAction
- ./src/common/wx.js
- ./src/common/index.js
- ./src/common/service.js
- ./src/App.js

// 最后调用 createAction 时 servcie.js 还在等待依赖文件执行结束，service.js 还没初始化好，运行它的方法就报错了

```

## 附录

- 可以参照以下 demo
[https://github.com/haihaigang/webpack5-cycle-ref-error-demo](https://github.com/haihaigang/webpack5-cycle-ref-error-demo)

- 详细错误堆栈如下：

```
index.js:8 Uncaught ReferenceError: Cannot access 'createAction' before initialization
    at Module.createAction (index.js:8)
    at Object.init (wx.js:6)
    at Module../src/common/wx.js (wx.js:10)
    at Module.options.factory (react refresh:6)
    at __webpack_require__ (bootstrap:24)
    at fn (hot module replacement:61)
    at Module../src/common/index.js (App.js:27)
    at Module.options.factory (react refresh:6)
    at __webpack_require__ (bootstrap:24)
    at fn (hot module replacement:61)
createAction	@	index.js:8
init	@	wx.js:6
./src/common/wx.js	@	wx.js:10
options.factory	@	react refresh:6
__webpack_require__	@	bootstrap:24
fn	@	hot module replacement:61
./src/common/index.js	@	App.js:27
options.factory	@	react refresh:6
__webpack_require__	@	bootstrap:24
fn	@	hot module replacement:61
./src/common/service.js	@	index.js:8
options.factory	@	react refresh:6
__webpack_require__	@	bootstrap:24
fn	@	hot module replacement:61
./src/App.js	@	logo.svg:34
options.factory	@	react refresh:6
__webpack_require__	@	bootstrap:24
fn	@	hot module replacement:61
./src/index.js	@	wx.js:12
options.factory	@	react refresh:6
__webpack_require__	@	bootstrap:24
(anonymous)	@	startup:7
(anonymous)	@	startup:7
```
