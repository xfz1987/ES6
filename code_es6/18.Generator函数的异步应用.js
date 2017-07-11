/**
 * 背景 : javascript是单线程的
 * 传统 : 回调函数、事件监听、发布/订阅、Promise 对象
 * Generator函数 : 协程，多个线程互相协作，完成异步任务
 *   协程有点像函数，又有点像线程。它的运行流程大致如下
 *     第一步，协程A开始执行
 *     第二步，协程A执行到一半，进入暂停，执行权转移到协程B
 *     第三步，（一段时间后）协程B交还执行权给A
 *     第四步，协程A恢复执行
 *    
 */
//以读取文件为例
//回调函数(Node)
// fs.readFile('etc/test','utf-8', function(err,data){
// 	if(err) throw err;
// 	console.log(data);
// });

//Promise
// var readFile = require('fs-readfile-promise');
// readFile(fileA).then(data => {
// 	console.log(data);
// }).then(() => {
// 	return readFile(fileB);
// }).then(data => {
// 	console.log(data);
// });

//Generator 异步操作需要暂停的地方，都用yield语句注明
function* gen(x){
	var y = yield x + 2;
	return y;
}
var g = gen(1);
g.next();//{ value: 3, done: false }
g.next();//{ value: undefined, done: true }

//异步任务的封装
var fetch = require('node-fetch');//Fetch模块返回的是一个 Promise 对象
function* gen(){
	var result = yield fetch('https://api.github.com/users/github');
	console.log(result.bio);
}
var g = gen();
var result = g.next();
result.value.then(data => {
	return data.json;
}).then(data => g.next(data));


/**
 * Thunk 函数是自动执行 Generator 函数的一种方法
 *   它是“传名调用”的一种实现策略，用来替换某个表达式，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数
 */
function f(m){
	return m * 2;
}
f(x + 5);
//等同于
var thunk = function(){
	return x + 5;
};
function f(thunk){
	return thunk() * 2;
}

//基于 Thunk 函数的 Generator 执行器，函数的自动流程管理
function run(fn) {
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data);
    if(result.done) return;
    result.value(next);
  }
  next();
}
function* g() {
  var f1 = yield readFile('fileA');
  var f2 = yield readFile('fileB');
  // ...
  var fn = yield readFile('fileN');
}
run(g);

/**
 * co 模块 : 用于Generator函数的自动执行
 */
var gen = function* (){
	var f1 = yield readFile('etc/a');
	var f2 = yield readFile('etc/b');
	console.log(f1.toString);
	console.log(f2.toString);
}
var co = require('co');
co(gen).then(() => {
	console.log('Generator 函数执行完成');
});

//处理并发的异步操作
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);


co(function* () {
  var values = [n1, n2, n3];
  yield values.map(somethingAsync);
});

function* somethingAsync(x) {
  // do something async
  return y
}