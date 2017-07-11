/**
 * Promise对象
 *   它是异步编程的一种解决方案，简单说它就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果
 *   Promise 是一个对象，从它可以获取异步操作的消息
 *   特点：
 *      1.对象的状态不受外界影响,三种状态:Pending（进行中）、Resolved（已完成，又称 Fulfilled）和Rejected（已失败）
 *      2.一旦状态改变，就不会再变，任何时候都可以得到这个结果
 *        Promise对象的状态改变，只有两种可能：从Pending变为Resolved和从Pending变为Rejected
 *        有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易
 *   缺点: 
 *      1.无法取消Promise，一旦新建它就会立即执行，无法中途取消
 *      2.如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
 *      3.当处于Pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成)
 */
/**
 * 基本用法
 *   Promise对象是一个构造函数，用来生成Promise实例
 *   
 */

var TT = function(){};
TT.prototype.test = function(callback){
  var a = 1;
  callback(function(a){});
};
var t = new TT();
t.test(function(function(a){}){
  a = 1;
})


// 示例
// var promise = new Promise(function(resolve,reject){
// 	//...some code
// 	if(/*异步操作成功*/){
// 		resolve(value);//resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 Pending 变为 Resolved）
// 	}else{
// 		reject(error);//reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 Pending 变为 Rejected）
// 	}
// });
// Promise实例生成以后，可以用then方法分别指定Resolved状态和Reject状态的回调函数
// promise.then(function(value){
// 	    //sucess
// }, function(error){
// 		//fail
// });

// reject(new Error('wrong'));

// //例子
// function timeout(ms){
// 	return new Promise((resolve, reject) => {
// 		setTimeout(resolve, ms, 'done');
// 	});
// }
// timeout(100).then((value) => {
// 	console.log(value);//done
// }, error => {
//  console.log(error)
// });

//Promise 新建后就会立即执行
// let promise = new Promise(function(resolve, reject) {
//   console.log('Promise');
//   resolve();
// });
// promise.then(function() {
//   console.log('Resolved.');
// });
// console.log('Hi!');
// // Promise
// // Hi!
// // Resolved

// //异步加载图片的例子
// function loadImageAsync(url){
// 	return new Promise((resolve,reject) => {
// 		var image = new Image();
// 		image.onload = function(){
// 			resolve(image);
// 		};
// 		image.onerror = function(){
// 			reject(new Error('Could not load image at ' + url));
// 		};
// 		image.src = url;
// 	});
// }

var image = loadImageAsync('a.png').then(data => {
  // document.body.appendChild(changeToDom(data));
},err => {
  console.log(err);
})

//用Promise对象实现的 Ajax 操作
var getJSON = function(url){
	return new Promise((resolve,reject) => {
		var client = window.XMLHttpRequest ? (new XMLHttpRequest()) : (new ActiveXObject("Microsoft.XMLHttp"));
		client.open('GET', url);
		client.onreadystatechange = () => {
			if(this.readyState !== 4) return false;
			this.status === 200 ? resolve(this.response) : reject(new Error(this.statusText));
		};
		client.responseType = 'json';
		client.setRequestHeader = ('Accept', 'application/json');
		client.send();
	});
}

getJSON('test.json').then((json) => {
	console.log(json);
}, (error) => {
	console.log('Error: ' + error);
});

//状态传递
var p1 = new Promise(function (resolve, reject) {
  // ...
});
var p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
});
//p1和p2都是Promise的实例，但是p2的resolve方法将p1作为参数，即一个异步操作的结果是返回另一个异步操作
//这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态
//如果p1的状态是Pending，那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是Resolved或者Rejected，那么p2的回调函数将会立刻执行
var p3 = new Promise((resolve, reject) => {
	setTimeout(() => reject(new Error('fail')), 3000);
});
var p4 = new Promise((resolve, reject) => {
	setTimeout(() => resolve(p3), 1000);
});
p4.then(result => console.log(result))
  .catch(error => console.log(error));//Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数
//fail
//p3是一个Promise，3秒之后变为rejected。p4的状态在1秒之后改变，resolve方法返回的是p3。
//由于p4返回的是另一个 Promise，导致p4自己的状态无效了，由p3的状态决定p4的状态。
//所以，后面的then语句都变成针对后者（p）。又过了2秒，p1变为rejected，导致触发catch方法指定的回调函数


//then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法
//promise.then(func).then(func) : 第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数
//采用链式的then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用

//p.then((val) => console.log('fulfilled:', val)).catch((err) => console.log('rejected', err));
// 等同于
// p.then((val) => console.log('fulfilled:', val)).then(null, (err) => console.log("rejected:", err));

//如果Promise状态已经变成Resolved，再抛出错误是无效的
var promise = new Promise(function(resolve, reject) {
  resolve('ok');//因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
//ok

//Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
//一般来说，不要在then方法里面定义Reject状态的回调函数（即then的第二个参数），总是使用catch方法
//catch可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）
// bad
promise.then(function(data){}, function(err){});
// good
promise.then(function(data){}).catch(function(err){});



//需要注意的是，catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法
var someAsyncThing = function() {
	return new Promise(function(resolve, reject) {
    	// 下面一行会报错，因为x没有声明
    	resolve(2);
  	});
};
someAsyncThing().then(data => {
  console.log(data);
}).catch(e){
  console.log(e);
}

someAsyncThing().catch(function(error) {
  console.log('oh no', error);
}).then(function() {
  console.log('carry on');
})
// oh no [ReferenceError: x is not defined]
// carry on
// 如果不报错就会跳过catch，而去执行then，此时，要是then方法里面报错，就与前面的catch无关了

//catch方法之中，还能再抛出错误
var someAsyncThing = function() {
  	return new Promise(function(resolve, reject) {
    	resolve(x + 2);
  	});
};

someAsyncThing().then(function(){
  	return someOtherAsyncThing();
}).catch(function(error) {
  	console.log('oh no', error);
  	// 下面一行会报错，因为y没有声明
  	y + 2;
}).then(function(){//换成catch， 结果 carry on [ReferenceError: y is not defined]
  	console.log('carry on');
    resolve(par);
}).then(function(data){},function(err){}};
// oh no [ReferenceError: x is not defined]

/**
 * var p = Promise.all([p1,p2,p3]),数组里的每一项都是Promise实例，如果不是就会先调用Promise.resolve方法，将参数转为 Promise 实例，再进一步处理
 *   参数可以不是数组，但必须具有Iterator接口,且返回的每个成员都是 Promise 实例
 * p的状态由p1,p2,p3决定，分两种情况 
 *   1. 只有p1、p2、p3的状态都变成Resolved()，p状态才会变成Resolved，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数
 *   2. 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数
 */
var promises = [2, 3, 5, 7, 11, 13].map(id => getJSON('/post/' + id + '.json'));
Promise.all(promises).then(posts => {}).catch(error => {});

//例子
// const databasePromise = connectDatabase();
// const booksPromise = databasePromise.then(findAllBooks);
// const userPromise = databasePromise.then(getCurrentUser);
// Promise.all([booksPromise,userPromise])
//        .then(([books, user]) => pickTopRecommentations(books, user));

//注意，如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法
const p1 = new Promise((resolve, reject) => {resolve('hello');}).then(result => result).catch(e => e);
const p2 = new Promise((resolve, reject) => {throw new Error('报错了');}).then(result => result).catch(e => e;);
Promise.all([p1, p2]).then(result => console.log(result)).catch(e => console.log(e));
// ["hello", Error: 报错了]
//p1会resolved，p2首先会rejected，但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，p2指向的实际上是这个实例。该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved，因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数
//如果p2没有自己的catch方法，就会调用Promise.all()的catch方法, Error: 报错了

/**
 * Promise.race([p1,p2,p3])方法同样是将多个Promise实例，包装成一个新的Promise实例
 *   只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数
 *   Promise.race方法的参数与Promise.all方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理
 */
const pos = Promise.race([
	fetch('/resource-that-may-take-a-while'),
	new Promise((resolve, reject) => {
		setTimout(() => reject(new Error('request timeout')), 5000);
	})
]).then(response => console.log(response)).catch(error => console.log(error)));
//如果5秒之内fetch方法无法返回结果，变量p的状态就会变为rejected，从而触发catch方法指定的回调函数

/**
 * Promise.resolve : 将现有对象转为Promise对象
 *    Promise.resolve('foo') 等价于 new Promise(resolve => resolve('foo'))
 * 参数分4种情况:
 *    1.参数是一个Promise实例 : Promise.resolve将不做任何修改、原封不动地返回这个实例
 *    2.参数是一个thenable对象 : thenable对象指的是具有then方法的对象,Promise.resolve方法会将这个对象转为Promise对象，然后就立即执行thenable对象的then方法
 *    3.参数不是具有then方法的对象，或根本就不是对象 : Promise.resolve方法返回一个新的Promise对象，状态为Resolved
 *    4.不带有任何参数 : 直接返回一个Resolved状态的Promise对象
 *      立即resolve的Promise对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时
 */
// var jsPromise = Promise.resolve($.ajax(url));
// 将jQuery生成的deferred对象，转为一个新的Promise对象

//2.thenable对象
let thenable = {
  then: function(resolve, reject){resolve(42);}
};
Promise.resolve(thenable).then(function(value){
  console.log(value);// 42
});

//3.参数不是具有then方法的对象，或根本就不是对象 
Promise.resolve('Hello').then(function(s){
  console.log(s)
});
// Hello

//4.不带有任何参数, 所以，如果希望得到一个Promise对象，比较方便的方法就是直接调用Promise.resolve()
var p = Promise.resolve();
p.then(function () {
  // ...
});
//例子
setTimeout(function(){
  console.log('three');
}, 0);
Promise.resolve().then(function(){
  console.log('two');
});
console.log('one');
// one  two  three
// setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出

/**
 * Promise.reject(reason)方法也会返回一个新的 Promise 对象，该实例的状态为rejected
 * Promise.reject('出错了') 等同于 new Promise((resolve, reject) => reject('出错了'))
 * 注意Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数
/

/**
 * done() : done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误
 * finally() : 不管Promise对象最后状态如何，都会执行的操作。它与done方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行
 * server.listen(0).then(function () {}).catch(function(err){}).finally(server.stop);
 */

