/**
 * 数组的解构赋值
 * 基本用法: ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值
 *           等号左右两边都是数组，否则报错
 *           变量的声明和赋值是一体的。对于let和const来说，变量不能重新声明
 */
let [a,b,c,d] = [1,2,3];
console.log(a);//1
console.log(d);//undefined
let [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(bar);//2
let [ , , third] = ["foo", "bar", "baz"];
console.log(third);//baz
let [x, , y] = [1, 2, 3];
console.log(y);//3
let [head, ...tail] = [1, 2, 3, 4];
console.log(tail);//[2, 3, 4]
let [x1, x2, ...x3] = ['a'];
console.log(x1);//'a'
console.log(x2);//undefined
console.log(x3);//[]
//不完全解构: 即等号左边的模式，只匹配一部分的等号右边的数组
let [y1,y2] = [1,2,3];
console.log(y1);//1
console.log(y2);//2
let [a1,[a2],a3] = [1,[2,3],4];
console.log(a2);//2
console.log(a3);//4
let [z1,z2,z3] = new Set(['a','b','c']);
console.log(z1);//a

// function* fibs() {
//   let a = 0;
//   let b = 1;
//   while (true) {
//     yield a;
//     [a, b] = [b, a + b];
//   }
// }
// let [first, second, third, fourth, fifth, sixth] = fibs();
// sixth // 5

//默认值：undefinded,不生效，null生效，会覆盖默认值
let [foo1 = true] = [];
console.log(foo1);//true
let [xx, yy = 'b'] = ['a'];
console.log(xx,yy);//'a','b'
let [x4, y4 = 'f'] = ['a', undefined];
console.log(x4, y4);//'a','f'
//ES6 内部使用严格相等运算符（===）,判断一个位置是否有值。所以，如果一个数组成员不严格等于undefined，默认值是不会生效的
let [x5 = 1] = [undefined];
console.log(x5);//1
let [x6 = 1] = [null];
console.log(x6);//null
//null不严格等于undefined
//如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值
function f(){
	console.log('aaa');
	return 2;
}
let [x7 = f()] = [];
console.log('----------------')
console.log(x7);//1; 因为x能取到值，所以函数f根本不会执行
//默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
let [m1 = 1, n1 = m1] = [];     // 1; 1
let [m2 = 1, n2 = m2] = [2];    // 2; 2
let [m3 = 1, n3= m3] = [1, 2];  // 1; 2
// let [m4 = n4, n4 = 1] = [];     // ReferenceError

/**
 * 对象的解构赋值
 * 对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值
 */
console.log('对象的解构赋值');
let {fo,ba} = {ba:'b',fo:'a'};
console.log(fo,ba);//a,b
let {ba1,fo1} = {fo1:'a',ba1:'b'};
console.log(fo1,ba1);//a,b
let { bo } = { foo: "aaa", bar: "bbb" };
console.log(bo)// undefined; 变量没有对应的同名属性，导致取不到值，最后等于undefined

// 如果变量名与属性名不一致，必须写成下面这样
var {foo1:baz1} = {foo1:'aaa',bar1:'bbb'};
console.log(baz1);//'aaa'
let obj = {first: 'hello', last: 'world'};
let {first:ff, last: l} = obj;
console.log(ff);//'hello'
console.log(l);//'world'
//对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者
let {foo2:baz2} = {foo2:'aaa',bar2:'bbb'};
console.log(baz2);//'aaa';
// console.log(foo2);//ReferenceError

// 变量的声明和赋值是一体的。对于let和const来说，变量不能重新声明
// 可以用下面的方式赋值
let fuk;
({fuk} = {fuk:1});//ok
let buz;   
({bar:baz} = {bar: 1});//ok
//解析器会将起首的大括号，理解成一个代码块，而不是赋值语句

//嵌套赋值
let obj1 = {};
let arr1 = [];
( {foo:obj1.prop, bar:arr1[0]} = {foo: 123, bar: true} );
console.log(obj1);//{prop:123}
console.log(arr1);//[true]

//对象解构默认值
var {v1 = 3} = {};
console.log(v1);//3
var {v2,w2 = 5} = {v2:1};
console.log(v2,w2)//1,5
var {v3:w3=3} = {};
console.log(w3);//3
// console.log(v3);//ReferenceError
var {v4:w4=3} = {v4:5};
//console.log(v4);//ReferenceError
console.log(w4);//5
var {message: msg='fuck'} = {};
console.log(msg);//fuck
//默认值生效的条件是，对象的属性值严格等于undefined
var {v5 = 3} = {v5: undefined};
console.log(v5);//3
var {v6 = 3} = {v6: null};
console.log(v6);//null

//对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量
let { log, sin, cos } = Math;
console.log(log);//[Function: log]
console.log(sin);//[Function: sin]
console.log(cos);//[Function: cos]

//由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构
let array = [1,2,3];
let {0 : first, [array.length - 1] : last} = array;
console.log(first, last);//1,3


/**
 * 字符串的解构赋值
 *   解构时，字符串被转换成了一个类似数组的对象
 */
const [s1,s2,s3,s4] = 'hel';
console.log(s1,s2,s3,s4);//h,e,l,undefined
let {length: len} = 'hello';
console.log(len);

/** 
 * 数值和布尔值的解构赋值
 *   解构赋值时，如果等号右边是数值和布尔值，则会先转为对象
 *   解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。
 *   由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错
 */
let {toString: s} = 123;
console.log(s);//[Function: toString]
console.log(s === Number.prototype.toString);//true
let {toString: ss} = true;
console.log(ss === Boolean.prototype.toString);//true

/**
 * 函数参数的解构赋值
 * 
 */
function add([b1,c1]){
	return b1 + c1;
}
// let [b1,c1] = [1,2];
console.log(add([1,2]));//3
// 函数add的参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构成变量x和y。对于函数内部的代码来说，它们能感受到的参数就是x和y

console.log([[1, 2], [3, 4]].map(([b2, c2]) => b2 + c2));//[3,7]
// var ress = [1,2,3].map(function(item){
// 	return item + 1;
// });

//函数参数的解构也可以使用默认值
console.log('------')
function move(b4 = 0, c4 = 0){
	return [b4,c4];
}
console.log(move({b4: 3, c4: 8})); // [ { b4: 3, c4: 8 }, 0 ]
console.log(move({b4: 3})); [ { b4: 3 }, 0 ]
console.log(move({})); // [ {}, 0 ]
console.log(move()); // [0, 0]

console.log('++++++');
// let {b5, c5} = {};
function move({b5, c5} = { b5: 0, c5: 0 }) {
  return [b5, c5];
}
console.log(move({b5: 3, c5: 8})); // [3, 8]
console.log(move({b5: 3})); // [3, undefined]
console.log(move({})); // [undefined, undefined]
console.log(move()); // [0, 0]
//上面代码是为函数move的参数指定默认值，而不是为变量x和y指定默认值

console.log('-------')
// let {b3 = 0, c3 = 0} = {};
function move({b3 = 0, c3 = 0} = {}){
	return [b3,c3];
}
console.log(move({b3: 3, c3: 8})); // [3, 8]
console.log(move({b3: 3})); // [3, 0]
console.log(move({})); // [0, 0]
console.log(move()); // [0, 0]

console.log('______');
// let {b6 = 0, c6 = 0} = {};
function move1({b6 = 0, c6 = 0} = { b6: 1, c6: 0 }) {
  return [b6, c6];
}
console.log(move1({b6: 3, c6: 8})); // [ 3, 8 ]
console.log(move1({b6: 3})); // [ 3, 0 ]
console.log(move1({})); // [ 0, 0 ]
console.log(move1()); // [ 1, 0 ]

//undefined就会触发函数参数的默认值。
console.log([1, undefined, 3].map((bb = 'yes') => bb));//[ 1, 'yes', 3 ]


/**
 * 圆括号问题
 *   ES6规定: 只要有可能导致解构的歧义，就不得使用圆括号,规则实际上不那么容易辨别
 *            因此，建议只要有可能，就不要在模式中放置圆括号
 */
//1.变量声明语句中，不能带有圆括号
// 全部报错
// let [(a)] = [1];
// let {x: (c)} = {};
// let ({x: c}) = {};
// let {(x: c)} = {};
// let {(x): c} = {};
// let { o: ({ p: p }) } = { o: { p: 2 } };

//2.函数参数中，模式不能带有圆括号
// function f([(z)]) { return z; }

//3.赋值语句中，不能将整个模式，或嵌套模式中的一层，放在圆括号之中
// ({ p: a }) = { p: 42 };
// ([a]) = [5];

//可以使用圆括号的情况
// [(b)] = [3]; // 正确
// ({ p: (d) } = {}); // 正确
// [(parseInt.prop)] = [3]; // 正确
//因为首先它们都是赋值语句，而不是声明语句；其次它们的圆括号都不属于模式的一部分

/** 
 * 解构的用途
 *   1.交换变量的值
 *   2.从函数返回多个值
 *   3.函数参数的定义
 *   4.提取JSON数据
 *   5.函数参数的默认值
 *   6.遍历Map结构
 *   7.输入模块的指定方法
 *   8.参数匹配的解构
 */
//1.交换变量的值
let k1 = 1;
let l1 = 2;
[k1, l1] = [l1, k1];
console.log(k1,l1);//2,1

//2.从函数返回多个值
let [kk,ll,nn] = (() => [1,2,3])();
console.log(kk,ll,nn);//1,2.3

//3.函数参数的定义
// 参数是一组有次序的值
function f1([x,y,z]){return x+y+z};
console.log(f1([1, 2, 3]));//6
//没啥意义，不如直接来
function f2(x,y,z){return x+y+z};
console.log(f2(1,2,3));//6

// 参数是一组无次序的值
function f3({x, y, z}){return x+y+z};
console.log(f3({z: 3, y: 2, x: 1}));//6

//4.提取JSON数据
let jsonData = {
	id: 1,
	status: 'OK',
	data: [555,2222]
};
let {id, status, data:number} = jsonData;
console.log(id, status, number);
//或
// let {id, status, data} = jsonData;
// console.log(id, status, data);

//5.函数参数的默认值
// jQuery.ajax = function (url, {
//   async = true,
//   beforeSend = function () {},
//   cache = true,
//   complete = function () {},
//   crossDomain = false,
//   global = true,
//   // ... more config
// }) {
//   // ... do stuff
// };

//6.遍历Map结构
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
for(let [key,value] of map){
	console.log(key + ':' + value);
}
//first:hello   second:world
//如果只想获取键名，或者只想获取键值，可以写成下面这样。
for (let [key] of map) {
  console.log(key);
}
//first  second
for (let [,val] of map) {
  console.log(val);
}
//hello  world

//7.输入模块的指定方法
// 加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰
// const { SourceMapConsumer, SourceNode } = require("source-map");

//8.参数匹配的解构
let user = {name:'xfz',love:'girl'};
function getMES({name,love}){
	return `${name}:${love}`;
}
console.log(getMES(user));//xfz:girl

//深度匹配
//ES5
function setting(){
	return {
		display: {color:'red'},
		keyboard: {layout: 'query'}
	}
}
var tmp = setting();
var co = tmp.display.color;
var kb = tmp.keyboard.layout;
//ES6
let {display:{color:discolor},keyboard:{layout:kbl}} = setting();
console.log(discolor,kbl);//red query