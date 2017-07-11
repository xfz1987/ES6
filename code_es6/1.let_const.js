/**   
 * const
 *   声明的是常量。一旦声明，常量的值就不能改变
 *   const的作用域与let命令相同：只在声明所在的块级作用域内有效
 *   要点: 不存在变量提升
 *         const一旦声明变量，就必须立即初始化，不能留到以后赋值
 *         const声明的常量，也与let一样不可重复声明
 */

const x = 3;
//x = 2;//Uncaught SyntaxError: Identifier 'x' has already been declared
// const x = 5;
if(true){
	const MAX = 5;
}
// console.log(MAX);//ReferenceError

//const声明的的变量是引用类型，只要指针不变，就没问题
const foo1 = {};
foo1.name = 'lw';
//foo = {};//TypeError: "foo" is read-only,将 foo 指向另一个对象，就会报错
const arr = [];
arr.push(1);
arr.length = 0;
// arr = ['shit'];//报错

/** 
 * let
 *   背景: JS没有块级作用域，容易造成变量的混淆
 *   基本用法: 用来声明变量。它的用法类似于var
 *   要点: 1.所声明的变量，只在let命令所在的代码块内有效
 *         2.不存在变量提升、暂时性死区,防止在变量声明前就使用这个变量，从而导致意料之外的行为
 *         3.不允许在相同作用域内，重复声明同一个变量
 *         4.不能在函数内部重新声明参数
 */
{
	let a = 10;
	var b = 1;
}
//console.log(a);// ReferenceError: a is not defined.
console.log(b);//1

for (let i = 0; i < 10; i++) {}
//console.log(i);//ReferenceError: i is not defined

//for循环 
var a = [];
for (var i = 0; i < 10; i++) {
  	var c = i;//i是全局变量
  	a[i] = function () {
    	console.log(c);
  	};
}
a[6]();//9

var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6]();//6

//for循环还有一个特别之处，就是循环语句部分是一个父作用域，而循环体内部是一个单独的子作用域。
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
//abc 3次

//不存在变量提升
console.log(foo); //undefined
var foo = 2;
// console.log(bar);//ReferenceError
// let bar;
//ES5
var u = 'outer';
function test(flag){
	if(flag){
		var u = 'inner';//作用于整个function，声明的变量会提升
		//u = 'inner';//初始化的变量不会被提升,而是全局变量，最后结果会是 outer
		return u;
	}
	return u;
}
console.log(test(false));//undefined;因为尽管没有执行 if 代码块，但 var u = 'inner'; 也会被提升;
console.log(test(true));//inner;
//ES6
var r = 'outer';
function test(flag){
	if(flag){
		let r = 'inner';
		return r;
	}
	return r;
}
console.log(test(false));//outer
console.log(test(true));//inner;

//暂时性死区（TDZ）：只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响
//ES6明确规定，如果区块中存在let或const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
//总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”
var tmp = 123;
if(true){
	tmp = 'abc';//ReferenceError
	//let tmp;
}
//上面代码中，存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp，导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错

var t1 = 123;
if(true){
	// //TDZ开始
	// tmp = 'abc';//ReferenceError
	// console.log(tmp); // ReferenceError

	let t1; // TDZ结束
	console.log(t1); //undefined
	t1 = 'xyx';
	console.log(t1);//xyx;
}
console.log(t1);//123

//“暂时性死区”也意味着typeof不再是一个百分之百安全的操作
// typeof m;//ReferenceErro
// let m;
//如果一个变量根本没有被声明，使用typeof反而不会报错
console.log(typeof undeclared_variable) // "undefined"

//let这样设计是为了让大家养成良好的编程习惯，变量一定要在声明之后使用，否则就报错
//有些“死区”比较隐蔽，不太容易发现
// function bar(x = y, y = 2){
// 	return [x, y];
// }
// bar();
//ReferenceError: y is not defined
//应该这么做
function bar(y = 2,x = y){
	return [x,y];
}
console.log(bar());

var k = k;//ok
// let l = l;//ReferenceError TDZ

//不允许重复声明
// function f1(){
// 	let a = 10;
// 	var a = 1;
// }
// function f2(){
// 	let a = 10;
// 	let a = 1;
// }

// 不能在函数内部重新声明参数
// function f3(arg){
// 	let arg;
// }
function f4(arg){
	{
		let arg;
	}
}
//不报错，因为{}是一个子块作用域

/** 
 * 块级作用域
 *   ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景
 *   ES6 允许块级作用域的任意嵌套 {{{}}}
 *   块级作用域的出现，使得立即执行函数(IIFE),不再必要了
 *      IIFE 写法 (function(){...}());
 *      块级作用域写法 {let a = xxx; ....}
 *   避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句
 */
//场景一: 内层变量可能会覆盖外层变量
var now = new Date(),type = 'PER';
function getTime(){
	console.log(tmp);
	if(type == 'AFTER'){
		var tmp = now.setDate(now.getDate()+1);
	}
}
console.log(getTime());//undefinded,变量提升
//场景二: 用来计数的循环变量泄露为全局变量
var s = 'hello',sk;
for(var i = 0;i<s.length;i++){
	sk = s[i];
}
console.log(i);//5,变量i只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量

//块级作用域
function fun1(){
	let n = 5;
	if(true){
		let n = 10;
	}
	console.log(n);
}
//两个块，fun1一个, if()一个,这表示外层代码块不受内层代码块的影响
fun1();//5

//ES6 允许块级作用域的任意嵌套
// {{{{
//   {let insane = 'Hello World'}
//   console.log(insane); // 报错
// }}}};
// {{{{
//   let insane = 'Hello World';
//   {let insane = 'Hello World'}
// }}}};

// 考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。
// {
// 	let a = 'secret';
// 	function f(){
// 		return a;
// 	}
// }
// 应改为
// {
// 	let a = 'secret';
// 	let f = function(){
// 		return a;
// 	}
// }

//顶层对象属性
window.a1 = 1;
console.log(a1);//1
var a1 = 2;
window.a1;//2

let a2 = 1;
window.a2;//undefined