/**
 * generator 生成器
 *   背景 : 某些情况下，我们需要的是一个内部状态的遍历器。每调用一次遍历器，对象的内部状态发生一次改变（可以理解成发生某些事件）
 *   实现 : 
 *     1. generator函数，作用就是返回一个内部状态的遍历器，主要特征是函数内部使用了yield语句
 *     2. 定义的generator函数，需要在function关键字后面，加一个星号*,然后，函数内部使用yield语句
 *     3. yield，类似于return语句，都能返回一个值，区别在于每次遇到yield，函数返回紧跟在yield后面的那个表达式的值，然后暂停执行，下一次从该位置继续向后执行，而return语句不具备位置记忆的功能
 *   调用 :
 *     当调用generator函数的时候，该函数并不执行，而是返回一个遍历器（可以理解成暂停执行）
 *     以后，每次调用这个遍历器的next方法，就从函数体的头部或者上一次停下来的地方开始（yield表达式或return语句）执行（可以理解成恢复执行）
 *     直到遇到下一个yield语句为止，并返回该yield或return语句的值
 *     yield表达式是暂停执行的标记，而next方法可以恢复执行
 *     value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束
 *     yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”
 *   注意 : next方法有参数，则上一次yield语句的返回值将会等于该参数
 *          yield表达式只能用在 Generator 函数里面，用在其他地方都会报错
 *          yield表达式如果用在另一个表达式之中，必须放在圆括号里面 
 *             console.log('Hello' + (yield)); // OK
 *             console.log('Hello' + (yield 123)); // OK
 *          yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号
 *            function* demo() {
 *                foo(yield 'a', yield 'b'); // OK
 *                let input = yield; // OK
 *            }
 *     
 */
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator();
console.log(hw);//{}
//该函数有三个状态：hello，world 和 return 语句（结束执行）
hw.next();//{ value: 'hello', done: false }
//Generator 函数开始执行，直到遇到第一个yield表达式为止。next方法返回一个对象，它的value属性就是当前yield表达式的值hello，done属性的值false，表示遍历还没有结束
hw.next();//{ value: 'world', done: false }
//第二次调用，Generator 函数从上次yield表达式停下的地方，一直执行到下一个yield表达式。next方法返回的对象的value属性就是当前yield表达式的值world，done属性的值false，表示遍历还没有结束
hw.next();//{ value: 'ending', done: true }
//第三次调用，Generator 函数从上次yield表达式停下的地方，一直执行到return语句（如果没有return语句，就执行到函数结束）。next方法返回的对象的value属性，就是紧跟在return语句后面的表达式的值（如果没有return语句，则value属性的值为undefined），done属性的值true，表示遍历已经结束
hw.next();//{ value: undefined, done: true }
//第四次调用，此时 Generator 函数已经运行完毕，next方法返回对象的value属性为undefined，done属性为true。以后再调用next方法，返回的都是这个值

//Generator 函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数
function* f(){
	console.log('执行了');
}
var gen = f();
setTimeout(function(){
	gen.next();
}, 2000);

//例子
function* t(){
	for(var i=0;true;i++){
		var rest = yield i;//a行
		console.log('rest:' + rest);
		console.log('i:' + i);
		if(rest){i = -1;}//b行
	}
}
var g = t(); //内部状态是 i, yield i表达式直接返回了，并不能给rest赋值
console.log(g.next());//{value:0,done:false} 停止在 a行,遇到了yield,停止了,函数直接返回紧跟在yield后面的表达式值，所以并未给rest赋值，下次next时 rest=undefined
console.log(g.next());//rest:undefined 0 {value:1,done:false} reset = undefined
console.log(g.next());//rest:undefined 1 {value:2,done:false} reset = undefined
console.log(g.next(true));//rest:true 2  {value:0,done:false;} reset = true;
// console.log(g.next());//rest:undefined 0  {value: 1, done: false }
//next方法有参数，则上一次yield语句的返回值将会等于该参数, 这时会使rest = true
//var rest = true, i从0开始

//例子
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}
var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}
var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false } --> y = 2 * 12  y/3
b.next(13) // { value:42, done:true } --> z = 13  x = 5  y = 24   

//注意，由于next方法的参数表示上一个yield表达式的返回值，所以第一次使用next方法时，不能带有参数

//一个通过next方法的参数，向 Generator 函数内部输入值的例子
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}
let genObj = dataConsumer();
genObj.next();// Started
genObj.next('a');// 1. a
genObj.next('b');// 2. b

//例子
var arr = [1, [[2, 3], 4], [5, 6]];
var flat = function* (a) {
  	var length = a.length;
  	// a.forEach(function(item){
  	// 	yield xxx;//会报错，因为本身的函数不是Generator，即使最外层是Generator
  	// }
  	for(var i = 0;i < length;i++) {
  	  	var item = a[i];
  	  	if(typeof item !== 'number') {
  	  	  yield* flat(item);
  	  	}else{
  	  	  yield item;
  	  	}
  	}
};
for(var f of flat(arr)){
  	// console.log(f);
}
// 1, 2, 3, 4, 5, 6

/**
 * 与 Iterator 接口的关系 
 *   任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象
 *   因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口
 * for...of循环可以自动遍历 Generator 函数时生成的Iterator对象，且此时不再需要调用next方法
 *
 */
var myIterable = {};
myIterable[Symbol.iterator] = function* (){
	yield 1;
	yield 2;
	yield 3;
};
[...myIterable];//[1,2,3]

function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}
// 扩展运算符
[...numbers()]; // [1, 2]
// Array.from 方法
Array.from(numbers()); // [1, 2]
// 解构赋值
let [x, y] = numbers(); //x=1,y=2
// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1  2

/**
 * Generator.prototype.throw()
 *   Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获
 *   throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法
 *   throw方法可以接受一个参数，该参数会被catch语句接收，建议抛出Error对象的实例
 *   注意 ：不要混淆遍历器对象的throw方法和全局的throw命令，用遍历器对象的throw方法抛出的，可以被遍历器对象内部的catch捕获，而用throw命令抛出的错误只能被函数体外的catch语句捕获
 *          如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获
 *          如果 Generator 函数内部和外部，都没有部署try...catch代码块，那么程序将报错，直接中断执行
 *          Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的catch捕获
 */
var g = function* (){
	try{
		yield;
	}catch(e){
		console.log('内部捕获', e);
	}
}
var i = g();
i.next();
try{
	i.throw('a');
	i.throw('b');
}catch(e){
	console.log('外部捕获', e);
}
//内部捕获 a  外部捕获 b
//遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的catch语句捕获。i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。

var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};
var i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！
// 

var g = function* () {
  while (true) {
    try {
      yield;
    } catch (e) {
      if (e != 'a') throw e;
      console.log('内部捕获', e);
    }
  }
};
var i = g();
i.next();
try {
  throw new Error('a');
  throw new Error('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 [Error: a]

//如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a

//Generator 函数内部没有部署try...catch代码块
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a

//throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}
var g = gen();
g.next() // a
g.throw() // b
g.next() // c

//Generator 函数体内抛出的错误，也可以被函数体外的catch捕获
function* foo() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}
var it = foo();
it.next(); // { value:3, done:false }
try {
  it.next(42);
} catch (err) {
  console.log(err);
}

/**
 * Generator.prototype.return()
 *   可以返回给定的值，并且终结遍历Generator函数
 *   如果return方法调用时，不提供参数，则返回值的value属性为undefined
 *   如果 Generator 函数内部有try...finally代码块，那么return方法会推迟到finally代码块执行完再执行
 */

//return(parm)
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }

//return()
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next()        // { value: 1, done: false }
g.return() // { value: undefined, done: true }

//try...finally
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
//调用return方法后，就开始执行finally代码块，然后等到finally代码块执行完，再执行return方法

/**
 * yield* 表达式
 *   如果在 Generator 函数内部，调用另一个 Generator 函数，默认情况下是没有效果的
 *   yield*表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数
 */
function* foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  foo();
  yield 'y';
}
for (let v of bar()){
  console.log(v);
}
// "x"  "y"

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}
for (let v of bar()){
  console.log(v);
}
// "x"  "a"  "b"  "y"

function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}
// 等同于
function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}

//如果yield*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员
function* gen(){
  yield* ["a", "b", "c"];
}
gen().next() // { value:"a", done:false }

let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();
read.next().value // "hello"
read.next().value // "h"


//如果被代理的 Generator 函数有return语句，那么就可以向代理它的 Generator 函数返回数据
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}
function* bar() {
  yield 1;
  var v = yield* foo();
  console.log( "v: " + v );
  yield 4;
}
var it = bar();
it.next();// {value: 1, done: false}
it.next();// {value: 2, done: false}
it.next();// {value: 3, done: false}
it.next();// "v: foo"  {value: 4, done: false}
it.next();// {value: undefined, done: true}

console.log('--------------')

//例子
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// 值为 [ 'a', 'b' ]

// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}
// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if(t){
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}
// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}
result;//['a', 'b', 'c', 'd', 'e', 'f', 'g']

/**
 * Generator函数作为对象属性
 *   可以简写成下面的形式
 *   let obj = { 
 *     * myGeneratorMethod(){}
 *   }
 */

/**
 * Generator 函数的this
 *   Generator 函数总是返回一个遍历器，因此这个遍历器继承了 Generator 函数的prototype对象上的方法
 *   Generator函数也不能跟new命令一起用，会报错 -> new generater()
 *   如何获取this对象: 首先，生成一个空对象，使用call方法绑定 Generator 函数内部的this
 */
function* g(){}
g.prototype.hello = function () {
  return 'hi!';
};
let obj = g();//g返回的总是遍历器对象，而不是this对象
obj instanceof g;//true
obj.hello();//'hi!'

function* g(){
  this.a = 11;
}
let obj = g();
obj.a //undefined

function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj); //obj对象也就成了F的实例
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}
obj.a // 1
obj.b // 2
obj.c // 3

//执行的是遍历器对象f，但是生成的对象实例是obj，如何将这两个对象统一
//方法一: 将obj换成F.prototype
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var f = F.call(F.prototype);
//var f = new (F.call(F.prototype));
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}
f.a // 1
f.b // 2
f.c // 3

/**
 * Generator 是实现状态机的最佳结构
 */
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}
//两种状态: Tick和Tock

var clock = function* (){
	while(true){
		console.log('Tick!');
		yield;
		console.log('Tick!');
		yield;
	}
};

/**
 * 应用：
 *   1.异步操作的同步化表达：处理异步操作，改写回调函数
 *   2.控制流管理: 处理异步的回掉函数
 *   3.部署 Iterator 接口
 *   4.作为数据结构 : Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口
 */
//1. 登陆应用实例
function* loadUI(){
	showLoadingScreen();
	yield loadUIDataAsynchronously();
	hideLoadingScreen();
}
var loader = loadUI();
//加载UI
loader.next()
//卸载UI
loader.next()
// 上面代码表示，第一次调用loadUI函数时，该函数不会执行，仅返回一个遍历器。下一次对该遍历器调用next方法，则会显示登录窗口，并且异步加载数据。再一次使用next方法，则会隐藏登录窗口。可以看到，这种写法的好处是所有登录窗口的逻辑，都被封装在一个函数，按部就班非常清晰。

//Ajax 是典型的异步操作，通过 Generator 函数部署 Ajax 操作，可以用同步的方式表达
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}
function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}
var it = main();
it.next();

//通过 Generator 函数逐行读取文本文件
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}

//2.
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

//promise写法
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4){
    // Do something with value4
  }, function (error){
    // Handle any error from step1 through step4
  })
  .done();

//Generator 函数可以进一步改善代码运行流程
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
//然后，使用一个函数，按次序自动执行所有步骤
scheduler(longRunningTask(initialValue));
function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task);
  }
}

//3.利用 Generator 函数，可以在任意对象上部署 Iterator 接口
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}
let myObj = { foo: 3, bar: 7 };
for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}
// foo 3    bar 7

//4.
function *doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
for (task of doStuff()){
  // task是一个函数，可以像回调函数那样使用它
}