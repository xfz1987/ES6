/**
 * Set
 *   类似于数组，但是成员的值都是唯一的，没有重复值的无序集合，添加重复值不会加入到set中
 *   Set 本身是一个构造函数，用来生成 Set 数据结构
 *   两种方式: 
 *      1. var s = new Set(); s.add(1).add(2);
 *      2. var s = new Set([1,2,3]);
 *   属性和方法：
 *      size：返回成员总数
 *      add(value)：添加某个值，返回当前set对象，因此可以链式写法,例如，add(1).add(2).add(3)...
 *      delete(value)：删除某个值,返回一个布尔值，表示删除是否成功
 *      has(value)：返回一个布尔值，表示该值是否为set的成员
 *      clear()：清除所有成员
 *      forEach 遍历元素 : keys、 values、 entries, Set的遍历顺序就是插入顺序。
 *         这个特性有时非常有用，比如使用Set保存一个回调函数列表，调用时就能保证按照添加顺序调用
 *         由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致
 *      
 *      把Set转成数组: var a1 = Array.from(set) 或者 var a1 = [...set]
 *      利用Set给数组去重:  Array.from(new Set(arr));
 */
const s1 = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s1.add(x));
console.log(s1);// Set { 2, 3, 5, 4 }
console.log([...s1]);//[ 2, 3, 5, 4 ]
console.log(s1.size);//4
console.log(s1.has(2));//true
console.log(s1.delete(2));//true
console.log(s1.has(2));//false;

console.log(new Set([1, 2, 3, 4, 4]));//Set { 1, 2, 3, 4 }

let s2 = new Set();
let a = {};
let b = {};
s2.add({});
s2.add({});
console.log([...s2]);//[ {}, {} ],因为 {} !== {}

//对象与set的使用对比
const props = {'width':1,'height':2};
if(props['width']){
	console.log('lalala');
}
const proper = new Set(['width','height']);
if(proper.has('width')){
	console.log('bili');
}

let s3 = new Set(['red', 'green', 'blue']);
for (let item of s3.keys()) {
  console.log(item);
}
//red green blue
for (let item of s3.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

//Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。这意味着，可以省略values方法，直接用for...of循环遍历 Set。
for(let x of s3){
	console.log(x);
}
//red green blue
s3.forEach((value, key) => console.log('color:'+value));
//color:red  color:green  color:blue

let s4 = new Set([1, 2, 3]);
s4 = new Set([...s4].map(x => x * 2));
console.log(s4);//Set { 2, 4, 6 }

let s5 = new Set([1, 2, 3, 4, 5]);
s5 = new Set([...s5].filter(x => (x % 2) == 0));
console.log(s5);//Set { 2, 4 }

//Set 可以很容易地实现并集、交集和差集
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 并集
let union = new Set([...a, ...b]);
console.log(union);// Set {1, 2, 3, 4}
// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect);// set {2, 3}
// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
console.log(difference);// Set {1}

//如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。
//方法一： 利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；
//方法二： 利用Array.from方法。
//方法一
let s6 = new Set([1, 2, 3]);
s6 = new Set([...s6].map(val => val * 2));
//方法二
let s7 = new Set([1, 2, 3]);
s7 = new Set(Array.from(s7, val => val * 2));


/**
 * Map
 *   它类似于对象,本质上是键值对的集合（Hash 结构）,但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键
 *   键值对的数据结构，Map 比 Object 更合适
 *   如果对同一个键多次赋值，后面的值将覆盖前面的值
 *   var map = new Map([["name", "John"], ["age", "29"]])
 *   var map = new Map();
 * 属性和方法
 *   size：返回成员总数
 *   set(key, value)：设置一个键值对
 *   get(key)：读取一个键
 *   has(key)：返回一个布尔值，表示某个键是否在Map数据结构中
 *   delete(key)：删除某个键，它对应的值也会被删除,返回true。如果删除失败，返回false
 *   clear()：清除所有成员
 *
 *
 * 	     * 遍历key
           for (var key of map.keys()) {
               console.log(key)
           }
 
         * 遍历value
		   for (var val of map.values()) {
		       console.log(val)
		   }

		 * 遍历key和value
		   for(var [key,value] of map){
				console.log(key + ':' + value);
		   }

		 * 遍历实体的简写
           for (var [key, val] of map.entries()) {
               console.log('key: ' + key + ', value: ' + val)
           }
 */
var m = new Map();
var o = {p: "Hello World"};
m.set(o, "content");//"content"
m.set('test','1');
m.set(undefined,'fuck');
console.log(m);//Map { {p: "Hello World"} => "content", "test" => "1",undefined => 'fuck'}
console.log(m.size);//3
console.log(m.has('test'));//true
console.log(m.get('test'));//1
console.log(m.delete('test'));//true;
console.log(m.get('test'));//undefined
console.log(m.has('test'));//false

//Set和Map都可以用来生成新的 Map
const set1 = new Set([['foo', 1],['bar', 2]]);
const m1 = new Map(set1);
m1.get('foo') // 1
const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3

//如果对同一个键多次赋值，后面的值将覆盖前面的值
const m4 = new Map();
m4.set(1, 'aaa').set(1, 'bbb');
m4.get(1) // "bbb"

//注意: 只有对同一个对象的引用，Map 结构才将其视为同一个键
//      如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，
//      包括0和-0，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。虽然NaN不严格相等于自身，但 Map 将其视为同一个键
const m5 = new Map();
m5.set(['a'], 555);
m5.get(['a']) // undefined

var xx = ['b'];
var yy = ['b'];
m5.set(xx,555);
m5.set(yy,666);
console.log(m5.get(xx));//555
console.log(m5.get(yy));//666
var zz = ['b'];
m5.set(zz,777);
console.log(m5.get(xx));//555

const map1 = new Map([[1, 'one'],[2, 'two'],[3, 'three']]);
console.log([...map1.keys()]);//[ 1, 2, 3 ]
console.log([...map1.values()]);//[ 'one', 'two', 'three' ]
console.log([...map1.entries()]);//[ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]
console.log([...map1]);//[ [ 1, 'one' ], [ 2, 'two' ], [ 3, 'three' ] ]

const map2 = new Map().set(1, 'a').set(2, 'b').set(3, 'c');
// console.log([...map2]);//[ [ 1, 'a' ], [ 2, 'b' ], [ 3, 'c' ] ]
const rm1 = new Map(
  [...map2].filter(([k, v]) => k < 3)
);
console.log(rm1);//Map { 1 => 'a', 2 => 'b' }

//forEach方法还可以接受第二个参数，用来绑定this
// const reporter = {
//   report: function(key, value) {
//     console.log("Key: %s, Value: %s", key, value);
//   }
// };
// map.forEach(function(value, key, map) {
//   this.report(key, value);
// }, reporter);
//forEach方法的回调函数的this，就指向reporter

//与其他数据结构的互相转换
//1. Map 转为数组   ---  [...map]
//2. 数组 转为 Map  ---  new Map([[true, 7],[{foo: 3}, ['abc']]])
//3，Map 转为对象（所有键都是字符串才可以）   ---  
  function strMapToObj(strMap){
  	let obj = Object.create(null);
  	for(let [k,v] of strMap){
  		obj[k] = v;
  	}
  	return obj;
  }
//4. 对象转为 Map
  function objToStrMap(obj){
  	let strMap = new Map();
  	for(let k of Object.keys(obj)){
  		strMap.set(k, obj[k]);
  	}
  	return strMap;
  }

//5. Map 转为 JSON
  function strMapToJson(strMap){
  	return JSON.stringify(strMapToObj(strMap));
  }
  // let myMap = new Map().set('yes', true).set('no', false);
  // strMapToJson(myMap);//'{"yes":true,"no":false}'
//Map 的键名有非字符串，这时可以选择转为数组 JSON
  function mapToArrayJson(map) {
  	return JSON.stringify([...map]);
  }
  //let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
  // mapToArrayJson(myMap)
//6. JSON 转为 Map
  function jsonToStrMap(jsonStr) {
  	return objToStrMap(JSON.parse(jsonStr));
  }
  jsonToStrMap('{"yes": true, "no": false}')//Map {'yes' => true, 'no' => false}
//整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为Map
  function jsonToMap(jsonStr) {
  	return new Map(JSON.parse(jsonStr));
  }
  jsonToMap('[[true,7],[{"foo":3},["abc"]]]');//Map {true => 7, Object {foo: 3} => ['abc']}