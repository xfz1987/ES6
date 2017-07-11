/*
 * 函数参数的默认值
 *   参数变量是默认声明的，所以不能用let或const再次声明
 *   使用参数默认值时，函数不能有同名参数
 */
//在ES6之前，不能直接为函数的参数指定默认值，只能采用变通的方法
//比较下面两种写法
function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World

function log(x, y = 'World') {
  console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', undefined) // Hello

// function foo(x = 5) {
//   let x = 1; // error
//   const x = 2; // error
// }

// function foo(x, x, y = 1) {
  
// }

//另外，一个容易忽略的地方是，如果参数默认值是变量，那么参数就不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo();//100
x = 100;
foo();//101

/**
 * 与解构赋值默认值结合使用
 */
function foo1({x, y = 5}){
	console.log(x, y);
}
//let {x, y = 5} = {}
foo1({});//undefined,5
foo1({x: 1});// 1, 5
foo1({x: 1, y: 2})// 1, 2
// foo1(); // TypeError: Cannot read property 'x' of undefined
// 因为foo1调用时的参数不是对象，无法解构赋值，x，y不会生成


// function fetch(url, { body = '', method = 'GET', headers = {} }) {
//   console.log(method);
// }
// fetch('http://example.com', {})//"GET"
// fetch('http://example.com')//报错

function fetch(url, { method = 'GET' } = {}) {
  console.log(method);
}
fetch('http://example.com')//GET
// 上面代码中，函数fetch没有第二个参数时，函数参数的默认值就会生效，然后才是解构赋值的默认值生效，变量method才会取到默认值GET


//下面两种写法有什么差别？
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}
// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
// 函数没有参数的情况
console.log(m1()); // [0, 0]
console.log(m2()); // [0, 0]
// x和y都有值的情况
console.log(m1({x: 3, y: 8})); // [3, 8]
console.log(m2({x: 3, y: 8})); // [3, 8]
// x有值，y无值的情况
console.log(m1({x: 3})); // [3, 0]
console.log(m2({x: 3})); // [3, undefined]
// x和y都无值的情况
console.log(m1({})); // [0, 0];
console.log(m2({})); // [undefined, undefined]
console.log(m1({z: 3})); // [0, 0]
console.log(m2({z: 3})); // [undefined, undefined]
//上面两种写法都对函数的参数设定了默认值，区别是写法一函数参数的默认值是空对象，但是设置了对象解构赋值的默认值；写法二函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值

/**
 * 参数默认值的位置
 *   通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的
 */
// 例一
function f(x = 1, y) {
  return [x, y];
}
console.log(f()); // [1, undefined]
console.log(f(2)); // [2, undefined])
// f(,1) // 报错
console.log(f(undefined, 1)); // [1, 1]

// 例二
function f1(x, y = 5, z) {
  return [x, y, z];
}
console.log(f()); // [undefined, 5, undefined]
console.log(f(1)); // [1, 5, undefined]
// f(1, ,2) // 报错
console.log(f(1, undefined, 2)); // [1, 5, 2]
//如果传入undefined，将触发该参数等于默认值，null则没有这个效果
function f3(x = 5, y = 6) {
  console.log(x, y);
}
f3(undefined, null);//5 null

/**
 * 函数的 length 属性
 *  指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真
 *  length属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，rest参数也不会计入length属性
 *  如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了
 */
console.log((function (a) {}).length); // 1
console.log((function (a = 5) {}).length); // 0
console.log((function (a, b, c = 5) {}).length) // 2
console.log((function(...args) {}).length); // 0
console.log((function (a = 0, b, c) {}).length); // 0
console.log((function (a, b = 1, c) {}).length); // 1

/**
 * 作用域
 *   一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的
 */
 var xx = 1;
 function f(xx, yy = xx){
    console.log(yy);
 }
 f(2);//2;
 //参数y的默认值等于变量x。调用函数f时，参数形成一个单独的作用域。在这个作用域里面，默认值变量x指向第一个参数x，而不是全局变量x，所以输出是2
 
 let x1 = 1;
 function f1(y1 = x1){
    let x1 = 2; //1 1
    console.log(x1, y1);
 }
 f1();//2 1

//error
// function f(y = x) {
//   let x = 2;
//   console.log(y);
// }
// f() // ReferenceError: x is not defined

//??????????
// var x5 = 1;
// function foo(x5 = x5) { //let x = x，由于暂时性死区的原因
//   // ...
// }
// foo() // ReferenceError: x is not defined

//如果参数的默认值是一个函数，该函数的作用域也遵守这个规则
let fu = 'outer';
function bar(func = x => fu){
    let fu = 'inner';
    console.log(func());
}
bar();//'outer'

var a = 1;
function A(a, b = function(){a = 2;}){
    var a = 3;
    b();
    console.log(a);
}
A();//3;
console.log(a);//1

var a2 = 1;
function A2(a2, b2 = function() { a2 = 2; }) {
  a2 = 3;
  b2();
  console.log(a2);
}
A2() // 2
console.log(a2) // 1

var a = 1;
function test(){
    a += 1;
}

//函数foo的内部变量a2指向第一个参数a2，与匿名函数内部的a2是一致的，所以最后输出的就是2，

/**
 * 应用：
 *   1.利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误
 *   2.可以将参数默认值设为undefined，表明这个参数是可以省略的
 */
// 1
function throwIfMissing(){
    throw new Error('Missing param');
}
function foo1(mustBeProvided = throwIfMissing()){//表明参数的默认值不是在定义时执行
    return mustBeProvided;
}
foo1(1);
// 2
function foo2(optional = undefined){}

/**
 * rest 参数
 *   形式为“...变量名”,不需要使用arguments对象了,rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中
 *   注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错
 *   函数的length属性，不包括 rest 参数
 */
//ES5
function printf(format){
    var params = [].slice.call(arguments,1);
    console.log('params:',params);//['adrian',321,Math.PI]
    console.log('format:',format);//%s %d &.2f
}
printf('%s %d &.2f','adrian',321,Math.PI);
//ES6
function printb(format,...params){
    console.log(params);//["adrian", 321, 3.141592653589793]
    console.log(format);//%s %d &.2f
}
printb('%s %d &.2f','adrian',321,Math.PI);

function add(...vals){
    let sum = 0;
    for(var val of vals){
        sum += val;
    }
    return sum;
}
console.log(add(2,5,3));//10

//例子
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}
// rest参数的写法
var sortNumbers = (...numbers) => numbers.sort();

function push(array,...items){
    items.forEach(function(item){
        array.push(item);
        console.log(item);
    });
}
let c = [];
push(c,1,2,3);

/**
 * 扩展运算符
 *   扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列
 *   应用:主要用于函数调用
 */
console.log(...[1,2,3]);//1 2 3
console.log(1,...[2,3,4],5);//1 2 3 4 5
function push1(array,...items){
    array.push(...items);
    return array;
}
console.log(push1([], 5, 6, 7));//[ 5, 6, 7 ]
function add(m,n){
    return m+n;
}
var nums = [4,30];
console.log(add(...nums));//34

/**
 * 替代数组的apply方法
 *   由于扩展运算符可以展开数组，所以不再需要apply方法，将数组转为函数的参数了
 */
var args = [0, 1, 2];
//ES5
function q(x,y,z){}
q.apply(null, args);
//ES6
function q(x, y, z) {}
f(...args);
//应用实例
//求数组中的最大值
//es5
Math.max.apply(null, [14,3,77]);
//es6
Math.max(...[14,3,77]);//等同于 Math.max(14, 3, 77);
//将一个数组添加到另一个数组的尾部
//es5
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);
//es6
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1.push(...arr2);

/**
 * 扩展运算符的应用
 */
//1.合并数组
var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];
//es5
arr1.concat(arr2, arr3);
//es6
console.log([...arr1, ...arr2, ...arr3]);// [ 'a', 'b', 'c', 'd', 'e' ]

//2.与解构赋值结合
// ES5
// a = list[0], rest = list.slice(1)
// // ES6
// [a, ...rest] = list

const [first, ...rest] = [1, 2, 3, 4, 5];
first; // 1
rest;  // [2, 3, 4, 5]

const [first1, ...rest1] = [];
first1; // undefined
rest1; // []

const [first2, ...rest2] = ["foo"];
first2;  // "foo"
rest2;   // []

//如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错
// const [...butLast, last] = [1, 2, 3, 4, 5];
// const [first, ...middle, last] = [1, 2, 3, 4, 5];

//3.函数的返回值
// var dateFields = readDateFields(database);
// var d = new Date(...dateFields);

//4.字符串
//扩展运算符还可以将字符串转为真正的数组
[...'hello'];// [ "h", "e", "l", "l", "o" ]
//实现了Iterator接口的对象
// var nodeList = document.querySelectorAll('div');
// var array = [...nodeList];
//Map和Set结构，Generator函数
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
var go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

var ms = [...go()] // [1, 2, 3]
// 如果对没有iterator接口的对象，使用扩展运算符，将会报错。
// var obj = {a: 1, b: 2};//{a: 1, b: 2, length: 2}
// let arr = [...obj]

/**
 * 箭头函数
 *   注意:
 *     1.*函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象,例如vue,或写jquery插件时使用更便捷
 *     2.不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
 *     3.不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替
 *     4.不可以使用yield命令，因此箭头函数不能用作 Generator 函数
 *   绑定this对象，ES7 ::
 */
var f = v => v;//等同于 var f = function(v){return v;};
//如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分
var f = () => 5;//var f = function () { return 5 };
var sum = (n1,n2) => n1+n2;//var sum = function(num1, num2) {return num1 + num2;};
//如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回
var sum = (num1, num2) => { if(num1 && num2){return num1 + num2;}}
console.log(sum(3,2));//5;
//由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号
var getTempItem = id => ({ id: id, name: "Temp" });
//箭头函数可以与变量解构结合使用
const full = ({ first, last }) => first + ' ' + last;
//function full(person) {return person.first + ' ' + person.last;}
//箭头函数使得表达更加简洁
const isEven = n => n % 2 == 0;
const square = n => n * n;
//简化回调函数
[1,2,3].map(x => x * x);
//[1,2,3].map(function (x) {return x * x;});
var result = [5,1,9].sort((a, b) => a - b);

//var result = values.sort(function (a, b) {return a - b;});
//rest 参数与箭头函数结合
const headAndTail = (head, ...tail) => [head, tail];
console.log(headAndTail(1, 2, 3, 4, 5));//[ 1, [ 2, 3, 4, 5 ] ]

var id = 21;
function food(){
    setTimeout(()=>{
        console.log('id:',this.id);
    },100);
}
food.call({id:42});//42
//如果是普通函数，执行时this应该指向全局对象window，这时应该输出21。但是，箭头函数导致this总是指向函数定义生效时所在的对象（本例是{id: 42}），所以输出的是42
//箭头函数可以让setTimeout里面的this，绑定定义时所在的作用域，而不是指向运行时所在的作用域
// food({id:42});//Cannot read property 'id' of undefined
// function food(){var _this = this;setTimeout(function(){...},100)};


//this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。
//由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。

         var handler = {
            id : '123',
            init : function(){
                document.addEventListener('click',
                    event => this.doSomething(event.type,false) //this 为 handler 对象
                ,false);
            },
            // doSomething : function(type){
            //  console.log(`Handing ${type} for ${this.id}`);
            // }
            doSomething : type => {console.log(`Handing ${type} for ${this.id}`)}
                
         };
         handler.init();