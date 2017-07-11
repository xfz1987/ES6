/**
 * ES6允许定义模块。也就是说，允许一个JavaScript脚本文件调用另一个脚本文件
 * 背景: ES5制定了一些模块加载方案，主要有CommonJS 和 AMD 两种
 * ES6: 完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案
 * 设计思想: 尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西
 *           ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入
 * 优点: 1.ES6 模块是编译时加载，使得静态分析成为可能
 *       2.效率高
 * 严格模式: ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";
 *   - 变量必须声明后再使用
 *   - 函数的参数不能有同名属性，否则报错
 *   - 不能使用with语句
 *   - 不能对只读属性赋值，否则报错
 *   - 不能使用前缀0表示八进制数，否则报错
 *   - 不能删除不可删除的属性，否则报错
 *   - 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
 *   - eval不会在它的外层作用域引入变量
 *   - eval和arguments不能被重新赋值
 *   - arguments不会自动反映函数参数的变化
 *   - 不能使用arguments.callee
 *   - 不能使用arguments.caller
 *   - 禁止this指向全局对象
 *   - 不能使用fn.caller和fn.arguments获取函数调用的堆栈
 *   - 增加了保留字（比如protected、static和interface）
 *   其中，尤其需要注意this的限制。ES6 模块之中，顶层的this指向undefined，即不应该在顶层代码使用this
 *
 * export命令: 用于规定模块的对外接口
 * 一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量
 *   // profile.js
 *   export var firstName = 'Gao';
 *   export var lastName = 'zifeng';
 *   //或
 *   var firstName = 'Gao', lastName = 'zifeng';
 *   export {firstName, lastName};
 *   export function getName(f,l){return {f,l};}
 * 通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名
 *   function v1() { ... }
 *   function v2() { ... }
 *   export {
 *   	v1 as v1Method
 *   	v2 as v2Method
 *   }
 *
 * 需要特别注意的是，export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系
 *   export 1;报错  -> export var m = 1;
 *   var m = 1;
 *   export m;//报错  -> export {m};
 *   function和class的输出，也必须遵守这样的写法
 *   function f(){}
 *   export f;//报错  -> export function f(){} -> export{f};
 *
 * export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值
 *   export var foo = 'bar';
 *   setTimeout(() => foo = 'baz', 500);
 *   上面代码输出变量foo，值为bar，500毫秒之后变成baz
 *
 * export命令可以出现在模块的任何位置，只要处于模块顶层就可以，即不能处于块级作用域内
 *   function foo(){export default 'bar'};//SyntaxError
 *   foo();
 *
 * import命令: 用于输入其他模块提供的功能，即加载模块
 *   //main.js
 *   import {firstName, lastName} from './profile';
 *   console.log(firstName + ' ' +  lastName);//Gao zifeng
 *   大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同
 *   如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名
 *   import {lastName as surname} from './profile';
 *   注意：import命令具有提升效果，会提升到整个模块的头部，首先执行
 *   foo();//不会报错，因为import的执行早于foo的调用。这种行为的本质是，import命令是编译阶段执行的，在代码运行之前
 *   import { foo } from 'my_module';
 *
 *   import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径
 *   .js路径可以省略。
 *   如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。
 *
 *   由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构
 *   import { 'f' + 'oo' } from 'my_module';//报错
 *   let module = 'my_module';
 *   import { foo } from module;//报错
 *   x === 1 ? import { foo } from 'module1' : import { foo } from 'module2';//报错
 *
 *   如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次
 *   import 'lodash';
 *   import 'lodash';
 *
 *   import语句是 Singleton 模式
 *   import { foo } from 'my_module';import { bar } from 'my_module';
 *   等同于  import { foo, bar } from 'my_module';
 *
 *   
 * 
 */
//CommonJS 模块就是对象，输入时必须查找对象属性
// let { stat, exists, readFile } = require('fs');
// 过程：整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取3个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”

//ES6
//import { stat, exists, readFile } from 'fs';
//过程: fs模块加载3个方法，其他方法不加载，这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高

/**
 * 模块的整体加载
 *    除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面
 */
//circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}
export function circumference(radius) {
  return 2 * Math.PI * radius;
}
//main.js
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));

/**
 * export default 命令 : 模块指定默认输出
 *   使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载
 * import命令时 可以为该匿名函数指定任意名字
 * 注意:import命令后面，不使用大括号
 */
// export-default.js
export default function foo(){console.log('foo');}
//或 function foo(){console.log('foo');}   export default foo;

// other.js , import命令可以为该匿名函数指定任意名字
import customName from './export-default';
customName(); // 'foo'

//下面比较一下默认输出和正常输出
//默认输出
export default function crc32() {} // 输出
import crc32 from 'crc32'; // 输入
//正常输出
export function crc32() {}; // 输出
import {crc32} from 'crc32'; // 输入

// modules.js
function add(x, y) {return x * y;}
export {add as default};//等同于 export default add
// app.js
import {default as xxx } from 'modules';//等同于 import xxx from 'modules';

// 正确
export var a = 1;
// 正确
var a = 1;
export default a;
// 错误
export default var a = 1;
// 正确
export default 42;
// 报错
export 42;

//如果想在一条import语句中，同时输入默认方法和其他变量，可以写成下面这样
export default function (obj) {}
export function each(obj, iterator, context) {}
export { each as forEach };
import _, { each } from 'lodash';

//export default也可以用来输出类
export default class {}
import MyClass from 'MyClass';
let o = new MyClass();

/**
 * export 与 import 的复合写法
 *   如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起
 */
export { foo, bar } from 'my_module';
//等同于
import { foo, bar } from 'my_module';
export { foo, bar };

//模块的接口改名和整体输出，也可以采用这种写法
// 接口改名
export { foo as myFoo } from 'my_module';
// 整体输出
export * from 'my_module';
// 默认接口
export { default } from 'foo';
//具名接口改为默认接口
export { es6 as default } from './someModule';
// 等同于
import { es6 } from './someModule';
export default es6;
//默认接口改名为具名接口
export { default as es6 } from './someModule';

/**
 * 模块的继承
 */
//circleplus模块，继承了circle模块
// circleplus.js
export * from 'circle';
export var e = 2.71828182846;
export default function(x){
	return Math.exp(x);
}
// main.js
import * as math from 'circleplus';
import exp from 'circleplus'; // 将circleplus模块的默认方法加载为exp方法
console.log(exp(math.e));

/**
 * 跨模块常量
 *   const声明的常量只在当前代码块有效。如果想设置跨模块的常量（即跨多个文件），或者说一个值要被多个模块共享，可以采用下面的写法
 */
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;
// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3
// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3

//如果要使用的常量非常多，可以建一个专门的constants目录，将各种常量写在不同的文件里面
//然后，将这些文件输出的常量，合并在index.js里面。
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};
// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
// constants/index.js
export {db} from './db';
export {users} from './users';
// script.js
import {db, users} from './index';

/**
 * 提案
 * import() : 可以实现像require一样动态加载
 * 适用场合 :
 *    1.按需加载
 *    2.条件加载
 *    3.动态的模块路径
 */
//1.按需加载
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
//2.条件加载
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
//3.动态的模块路径
import(f()).then();//根据函数f的返回结果，加载不同的模块