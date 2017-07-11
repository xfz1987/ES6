/**
 * 属性的简洁表示法
 */
function f(x, y){return {x, y};}
console.log(f(1,2));//{ x: 1, y: 2 }

//实际应用
function getPoint() {
  var x = 1;
  var y = 10;
  return {x, y};
}
console.log(getPoint());//{ x: 1, y: 10 }

//属性名为变量名, 属性值为变量的值
var o = {
	test(){
		return 'test';
	}
}

console.log(o.test());//'test'
//test: function(){}

var birth = '2000/01/01';
var Person = {
  name: '张三',
  //等同于birth: birth
  birth: ,  //不建议这么用，因为有可能被其他开发者污染
  // 等同于hello: function ()...
  hello() { console.log('我的名字是' + this.name + ';我的年龄是' + this.birth);}
};
console.log(Person.hello());

/**
 * 属性名表达式
 *   定义对象的属性，有两种方法
 *     obj.foo = true;
 *     obj['a' + 'bc'] = 123;
 *   注意: 属性名表达式与简洁表示法，不能同时使用
 */
var lastWord = 'last word';

var a = {
  'first word': 'hello',
  [lastWord]: 'world'
};

a['first word'] // "hello"
a[lastWord] // "world"
a['last word'] // "world"

// 表达式还可以用于定义方法名
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};

obj.hello() // hi

/**
 * Object.is()
 *   背景: es5 == 和 === 它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身 以及+0等于-0
 *   它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致
 */
Object.is('foo','foo');//true
Object.is({},{});//false
+0 === -0;//true
NaN === NaN;//false
Object.is(+0,-0);//false
Object.is(NaN,NaN);//true

/**
 * Object.assign(target, source1,...sourcen)
 *   用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）
 *   注意: 如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性
 *         如果只有一个参数，Object.assign会直接返回该目标对象
 *         如果该参数不是对象，则会先转成对象，然后返回
 *         由于undefined和null无法转成对象，所以如果它们作为参数，就会报错
 *         Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是chang说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用
 *   常见用途:
 *      1.为对象添加属性
 *      2.为对象添加方法
 *      3.克隆对象(深拷贝)
 *      4.合并多个对象
 *      5.为属性指定默认值
 */
var target = { a: 1 };
var source1 = { b: 2 };
var source2 = { c: 3 };
Object.assign(target, source1, source2);
console.log(target);//{ a: 1, b: 2, c: 3 }

var target = { a: 1, b: 1 };
var source1 = { b: 2, c: 2 };
var source2 = { c: 3 };
Object.assign(target, source1, source2);
console.log(target);// {a:1, b:2, c:3}

function finalObj(tar,items){
	return Object.assign(tar, ...items);
}
var items = [{b:2},{c:3}];
console.log(finalObj({a:1},items));//{ a: 1, b: 2, c: 3 }
//items = []; // { a: 1 }
// console.log(Object.assign({a:1}, ...[{b:2},{c:3}]));

// Object.assign(undefined) // 报错
// Object.assign(null) // 报错

//如果非对象参数出现在源对象的位置（即非首参数），那么处理规则有所不同。首先，这些参数都会转成对象，如果无法转成对象，就会跳过。这意味着，如果undefined和null不在首参数，就不会报错。
let objx = {a: 1};
Object.assign(objx, undefined) === objx // true
Object.assign(objx, null) === objx // true

var obj1 = {a: {b: 1}};
var obj2 = Object.assign({}, obj1);
obj1.a.b = 2;
obj2.a.b // 2

//常见用途
class Point{
	constructor(x, y) {
    	Object.assign(this, {x, y});
  	}
}

var SomeClass = function(){};
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {},
  anotherMethod(){}
});
// 等同于下面的写法 SomeClass.prototype = {someMethod:function(){},anotherMethod:function(){}}

function clone(origin) {
  return Object.assign({}, origin);
}
//不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

//很想jQuery的extend方法
function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
}
processContent();//{ logLevel: 0, outputFormat: 'html' }

/**
 * 属性的可枚举性
 *  对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象
 */
let myo = { foo: 123 };
Object.getOwnPropertyDescriptor(myo, 'foo');
//  {
//    value: 123,
//    writable: true,
//    enumerable: true, //可枚举性 , 如果该属性为false，就表示某些操作会忽略当前属性
//    configurable: true
//  }

//ES5有三个操作会忽略enumerable为false的属性。
//for...in循环：只遍历对象自身的和继承的可枚举的属性
//Object.keys()：返回对象自身的所有可枚举的属性的键名
//JSON.stringify()：只串行化对象自身的可枚举的属性

/**
 * 属性的遍历
 *   ES6一共有5种方法可以遍历对象的属性
 *     for...in ：循环遍历对象自身的和继承的可枚举属性，不含Symbol属性
 *     Object.keys(obj) ：返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol属性）
 *     Object.getOwnPropertyNames(obj) ： 返回一个数组，包含对象自身的所有属性（不含Symbol属性，但是包括不可枚举属性）
 *     Object.getOwnPropertySymbols(obj) ：返回一个数组，包含对象自身的所有Symbol属性
 *     Reflect.ownKeys(obj) ：返回一个数组，包含对象自身的所有属性，不管属性名是Symbol或字符串，也不管是否可枚举
 */

/**
 * __proto__属性 ：用来读取或设置当前对象的prototype对象。目前，所有浏览器（包括 IE11）都部署了这个属性
 * 实现上，__proto__调用的是Object.prototype.__proto__
 */
var someOtherObj = {};
// es5的写法
var noj = Object.create(someOtherObj);
noj.method = function(){};
// es6的写法
var noj = {
  method: function(){}
};
obj.__proto__ = someOtherObj;

//Object.keys(),返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名
var o1 = { foo: 'bar', baz: 42 };
console.log(Object.keys(o1));//[ 'foo', 'baz' ]
//暂时不支持，Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值
// var o2 = { foo: 'bar', baz: 42 };
// Object.values(o2)；//["bar", 42]
//暂时不支持，Object.entries(), 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组
// var o3 = { foo: 'bar', baz: 42 };
// console.log(Object.entries(o3));

//继承的例子
var human = {
	breathe(){
		console.log('breathing...');
	}
};
var worker = {
	__proto__ : human,//设置此对象的原型为human,相当于继承human
	company : 'APPLE',
	work(){
		console.log('working...');
	}
};
worker.breathe();//breathing...
worker.work();//输出 working...’

/**
 * 对象的扩展运算符 
 *  暂时不支持
 */
// 先来看一下数组的扩展
const [a1, ...b1] = [1, 2, 3];
a1; // 1
b1; // [2, 3]

/**
 * 提案
 * Null 传导运算符
 *   如果读取对象内部的某个属性，往往需要判断一下该对象是否存在
 */
// const firstName = (message
//   && message.body
//   && message.body.user
//   && message.body.user.firstName) || 'default';

// const firstName = message?.body?.user?.firstName || 'default';