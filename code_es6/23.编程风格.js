/**
 * 块级作用域
 *    1. let 取代 var
 *    2. 全局常量: 在let和const之间，建议优先使用const，尤其是在全局环境，不应该设置变量，只应设置常量
 *    
 */
// bad
var a = 1, b = 2, c = 3;
// good
const a = 1;
const b = 2;
const c = 3;
// best
const [a, b, c] = [1, 2, 3];

/**
 * 字符串
 *  静态字符串一律使用单引号或反引号，不使用双引号。动态字符串使用反引号
 */
// bad
const a = "foobar";
const b = 'foo' + a + 'bar';
// acceptable
const c = `foobar`;
// good
const a = 'foobar';
const b = `foo${a}bar`;
const c = 'foobar';

/**
 * 解构赋值
 *    使用数组成员对变量赋值时，优先使用解构赋值
 *    函数的参数如果是对象的成员，优先使用解构赋值
 *    如果函数返回多个值，优先使用对象的解构赋值，而不是数组的解构赋值。这样便于以后添加返回值，以及更改返回值的顺序
 */
const arr = [1, 2, 3, 4];
// bad
const first = arr[0];
const second = arr[1];
// good
const [first, second] = arr;

// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;
}
// good
function getFullName(obj) {
  const { firstName, lastName } = obj;
}
// best
function getFullName({ firstName, lastName }) {
	console.log(firstName,lastName);
}
getFullName({firstName:'Gao',lastName:'zf'});//Gao zf

// bad
function processInput(input) {
  return [left, right, top, bottom];
}
// good
function processInput(input) {
  return { left, right, top, bottom };
}
const { left, right } = processInput(input);

/**
 * 对象
 *    单行定义的对象，最后一个成员不以逗号结尾。多行定义的对象，最后一个成员以逗号结尾
 *    对象尽量静态化，一旦定义，就不得随意添加新的属性。如果添加属性不可避免，要使用Object.assign方法
 *    如果对象的属性名是动态的，可以在创造对象的时候，使用属性表达式定义
 *    对象的属性和方法，尽量采用简洁表达法，这样易于描述和书写
 */
// bad
const a = { k1: v1, k2: v2, };
const b = {
  k1: v1,
  k2: v2
};
// good
const a = { k1: v1, k2: v2 };
const b = {
  k1: v1,
  k2: v2,
};

// bad
const a = {};
a.x = 3;
// if reshape unavoidable
const a = {};
Object.assign(a, { x: 3 });
// good
const a = { x: null };
a.x = 3;

// bad
const obj = {
  id: 5,
  name: 'San Francisco',
};
obj[getKey('enabled')] = true;
// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
};

var ref = 'some value';
// bad
const atom = {
  ref: ref,
  value: 1,
  addValue: function (value) {
    return atom.value + value;
  },
};
// good
const atom = {
  ref,
  value: 1,
  addValue(value) {
    return atom.value + value;
  },
};

/**
 * 数组
 *   使用扩展运算符（...）拷贝数组
 *   使用Array.from方法，将类似数组的对象转为数组。
 */
// bad
const len = items.length;
const itemsCopy = [];
let i;
for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}
// good
const itemsCopy = [...items];

const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);

/**
 * 函数
 *    立即执行函数可以写成箭头函数的形式
 *    那些需要使用函数表达式的场合，尽量用箭头函数代替。因为这样更简洁，而且绑定了this
 *    箭头函数取代Function.prototype.bind，不应再用self/_this/that绑定 this
 *    所有配置项都应该集中在一个对象，放在最后一个参数，布尔值不可以直接作为参数
 *    不要在函数体内使用arguments变量，使用rest运算符（...）
 *    使用默认值语法设置函数参数的默认值
 */
(() => {
  console.log('Welcome to the Internet.');
})();

// bad
[1, 2, 3].map(function (x) {
  return x * x;
});
// good
[1, 2, 3].map((x) => {
  return x * x;
});
// best
[1, 2, 3].map(x => x * x);

// bad
const self = this;
const boundMethod = function(...params) {
  return method.apply(self, params);
}
// acceptable
const boundMethod = method.bind(this);
// best
const boundMethod = (...params) => method.apply(this, params);

// bad
function divide(a, b, option = false ){}// good
function divide(a, b, { option = false } = {}){}

// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}
// good
function concatenateAll(...args) {
  return args.join('');
}

// bad
function handleThings(opts) {
  opts = opts || {};
}
// good
function handleThings(opts = {}) {
  // ...
}

/**
 * Map结构
 *   注意区分Object和Map，只有模拟现实世界的实体对象时，才使用Object。如果只是需要key: value的数据结构，使用Map结构。因为Map有内建的遍历机制
 */

/**
 * Class
 *   用Class，取代需要prototype的操作
 *   使用extends实现继承，因为这样更简单，不会有破坏instanceof运算的危险
 */
// bad
function Queue(contents = []) {
  this._queue = [...contents];
}
Queue.prototype.pop = function() {
  const value = this._queue[0];
  this._queue.splice(0, 1);
  return value;
}
// good
class Queue {
  constructor(contents = []) {
    this._queue = [...contents];
  }
  pop() {
    const value = this._queue[0];
    this._queue.splice(0, 1);
    return value;
  }
}

// bad
const inherits = require('inherits');
function PeekableQueue(contents) {
  Queue.apply(this, contents);
}
inherits(PeekableQueue, Queue);
PeekableQueue.prototype.peek = function() {
  return this._queue[0];
}

// good
class PeekableQueue extends Queue {
  peek() {
    return this._queue[0];
  }
}

/**
 * 模块
 *   Module语法是JavaScript模块的标准写法，坚持使用这种写法。使用import取代require
 *   使用export取代module.exports
 *   不要在模块输入中使用通配符。因为这样可以确保你的模块之中，有一个默认输出（export default）
 *   如果模块默认输出一个函数，函数名的首字母应该小写。
 *   如果模块默认输出一个对象，对象名的首字母应该大写。
 */
// bad
const moduleA = require('moduleA');
const func1 = moduleA.func1;
const func2 = moduleA.func2;
// good
import { func1, func2 } from 'moduleA';

// commonJS的写法
var React = require('react');
var Breadcrumbs = React.createClass({
  render() {
    return <nav />;
  }
});
module.exports = Breadcrumbs;

// ES6的写法
import React from 'react';
class Breadcrumbs extends React.Component {
  render() {
    return <nav />;
  }
};
export default Breadcrumbs;

// bad
import * as myObject './importModule';
// good
import myObject from './importModule';

function makeStyleGuide() {
}
export default makeStyleGuide;

const StyleGuide = {
  es6: {}
};
export default StyleGuide;

/**
 * ESLint的使用
 *   ESLint是一个语法规则和代码风格的检查工具，可以用来保证写出语法正确、风格统一的代码
 * 
 * 安装: 1.安装ESLint            npm i -g eslint
 *       2.安装Airbnb语法规则    npm i -g eslint-config-airbnb
 * 配置: 在项目的根目录下新建一个.eslintrc文件
 *       {"extends": "eslint-config-airbnb"}
 * 
 * sublime: SublimeLinte 、 SublimeLinter-contrib-eslint
 */

