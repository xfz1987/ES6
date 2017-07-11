/**
 * Iterator（遍历器）的概念
 *    “集合”的数据结构：Array、Object、Map、Set
 *    数组的成员是Map，Map的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构
 *
 * 遍历器（Iterator）：为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署Iterator接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）
 *    任何数据结构只要部署Iterator接口，就可以完成遍历操作，ES6提供一种新遍历命令 for...of循环
 *    Iterator的遍历过程:
 *      1.创建一个指针对象，指向当前数据结构的起始位置
 *      2.第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
 *      3.第二次调用指针对象的next方法，指针就指向数据结构的第二个成员
 *      4.不断调用指针对象的next方法，直到它指向数据结构的结束位置
 *    每一次调用next方法，都会返回数据结构的当前成员的信息{value:xxx,done:true/false},value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束
 */
//模拟next方法返回值的例子
var it = makeIterator(['a','b']);
function makeIterator(array){
	var nextIndex = 0;
	return {
		next(){
			return nextIndex < array.length ? {value: array[nextIndex++], done: false} : {value: undefined, done: true};
		}
	}
}
console.log(it.next());//{ value: 'a', done: false }
console.log(it.next());//{ value: 'b', done: false }
console.log(it.next());//{ value: undefined, done: true }

/**
 * 数据结构的默认Iterator接口
 *   一种数据结构只要部署了Iterator接口，我们就称这种数据结构是”可遍历的“（iterable）
 *   当使用for...of循环遍历某种数据结构时，该循环会自动寻找Iterator接口
 */
//为对象添加Iterator接口实例
let obj = {
	data: ['hello', 'world'],
	[Symbol.iterator](){
		const self = this;
		let index = 0;
		return {
			next(){
				return (index < self.data.length ? {value: self.data[index++], done: false} : {value: undefined, done: true});
			}
		}
	}
}

//部署Iterator接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的Iterator接口
// NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// // 或者
// NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
// [...document.querySelectorAll('div')] // 可以执行了
let iterable = {
	0: 'a',
	1: 'b',
	2: 'c',
	length: 3,
	[Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for(let item of iterable){
	console.log(item);
}
//a  b  c

//注意，普通对象部署数组的Symbol.iterator方法，并无效果
let iter = {
  a: 'a',
  b: 'b',
  c: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iter) {
  console.log(item); // undefined, undefined, undefined
}

/**
 * 调用Iterator接口的场合
 *   1.解构赋值 : 会默认调用Symbol.iterator方法
 *   2.扩展运算符 : 只要某个数据结构部署了Iterator接口，就可以对它使用扩展运算符，将其转为数组
 *   3.yield*
 *   4.其他场合 : 由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口
 *                for...of 、 Array.from() 、 Map(), Set(), WeakMap(), WeakSet() 
 *                Promise.all()、Promise.race()
 */               
// 1.解构赋值
let set = new Set().add('a').add('b').add('c');
let [x, y] = set; //x = 'a', y = 'b'
let [first,...rest] = set;//first = 'a', rest = ['b','c'];

//2.扩展运算符
var str = 'hello';
[...str]; // ['h','e','l','l','o']
var arr = ['b','c'];
['a',...arr, 'd'];//['a', 'b', 'c', 'd']

//3.yield*
var generator = function* (){
	yield 1;
	yield* [2,3,4];
	yield 5;
};
var itv = generator();
itv.next();//{ value: 1, done: false }
itv.next();//{ value: 2, done: false }
itv.next();//{ value: 3, done: false }
itv.next();//{ value: 4, done: false }
itv.next();//{ value: 5, done: false }
itv.next();//{ value: undefined, done: true }


/**
 * 字符串的Iterator接口
 *   字符串是一个类似数组的对象，也原生具有Iterator接口
 */


/**
 * Iterator接口与Generator函数
 */
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable] // [1, 2, 3] 
// 或者采用下面的简洁写法
let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};
for (let x of obj) {
  console.log(x);
}
//hello  world

/**
 * 遍历器对象的return()，throw()
 *   return用来提前退出for...of循环(通常是因为出错，或者有break语句或continue语句) 或 在一个对象完成遍历前，清理或释放资源
 *   throw方法主要是配合Generator函数使用，一般的遍历器对象用不到这个方法
 */
function readLinesSync(file){
	return {
		next(){
			if(file.isAtEndOfFile()){
				file.close();
				return {done: true};
			}
		},
		return(){
			file.close();
			return {done: true};
		}
	}
}
for(let line of readLinesSync(filename)){
	console.log(line);
	break;
}

/**
 * for...of循环
 *    一个数据结构只要部署了Symbol.iterator属性，就可以用for...of循环遍历它的成员
 *    for...of循环可以代替数组实例的forEach方法
 */
const arr = ['red', 'green', 'blue'];
for(let v of arr) {
  console.log(v); // red green blue
}
const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);
for(let v of obj) {
  console.log(v); // red green blue
}
//空对象obj部署了数组arr的Symbol.iterator属性，结果obj的for...of循环，产生了与arr完全一样的结果

//对于普通对象，for...in循环可以遍历键名，for...of循环会报错
//两种解决方法
for(var key of Object.keys(someObject)){
	console.log(key,someObject(key));
}
function* entries(obj){
	for(let key of Object.keys(obj)){
		yield [key, obj[key]];
	}
}
for(let [key, value] of entries(obj)){
	console.log(key, value);
}


/**
 * 与其它遍历方式的比较
 */
		//ES5
		console.log('=========for=========');
		var arr = ['a','b','c'];
		for(var i=0;i<arr.length;i++){
			console.log(arr[i]);
		}

		console.log('=========forEach=========');
		arr.forEach(function(el){
			console.log(el);
			//forEach已经很简便了，但是有一个小缺陷:
			//没有break语句来中断循环，也不能使用return语句返回到外层函数。
		});

		console.log('=========for...in=========');
		for(var a in arr){
			console.log(arr[a]);
		}
		//for...in循环读取键名

		console.log('=========for...of=========');
		for(var b of arr){
			console.log(b);
		}
		//for...of循环读取键值
		
		console.log('=========for...of循环还可以遍历对象=========');
		var engines = new Set(['gz','sb','nb']);
		for(var e of engines){
			console.log(e);
		}

		var map = new Map();
		map.set('edition',6);
		map.set('auther','xfz');
		map.set('year','2012-12-31');
		for(var [name,value] of map){
			console.log(name + ': ' + value);//edition: 6 auther: xfz year: 2012-12-31
		}

		for(var x of map){
			console.log(x);//["edition", 6]  ["auther", "xfz"]  ["year", "2012-12-31"]
		}