/**
 * Class类
 *   优势: 避免直接直接操纵 prototype。为什么？因为它让代码更加简洁和易于理解，避免使用空的构造函数。如果没有指定，类有一个默认的构造函数。
 *         constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实例对象可以共享的
 *   类，完全可以看作构造函数的另一种写法
 *   类的内部所有定义的方法，都是不可枚举的（non-enumerable）
 *   注意:类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用
 */  
//ES5
function _Point(x, y) {
  this.x = x;
  this.y = y;
}
_Point.prototype = {
	toString: function(){return '(' + this.x + ', ' + this.y + ')';},
	test: function(){}
};
var p = new _Point(1, 2);

//ES6: 注意方法之间不需要要逗号分隔，加了会报错
class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	toString(){
		return '(' + this.x + ', ' + this.y + ')';
	}
	test(){}
}
var p = new Point(1, 2);
console.log(Point);//[Function: Point]
console.log(Point === Point.prototype.constructor);//true
console.log(p.constructor === Point.prototype.constructor);//true
console.log(p.toString());//(1, 2)
console.log(p.hasOwnProperty('x'));// true
console.log(p.hasOwnProperty('toString'));// false  , toString是原型对象的属性
console.log(p.__proto__.hasOwnProperty('toString'));// true
//类的所有实例共享一个原型对象
var p1 = new Point(3, 4);
console.log(p.__proto__ === p1.__proto__);//true   p和P1实例共享一个原型对象
//不推荐使用实例的__proto__属性为“类”添加方法或属性，因为这会改变“类”的原始定义，影响到所有实例
//p1.__proto__.xxx= function(){};

// 类的内部所有定义的方法，都是不可枚举的（non-enumerable）
class Point1 {
  constructor(x, y){}
  toString(){}
}
Object.keys(Point1.prototype);// []
Object.getOwnPropertyNames(Point1.prototype);// ["constructor","toString"]

// 类的属性名，可以采用表达式
let methodName = 'getArea';
class Square {
  constructor(length){}
  [methodName](){}
}

/**
 * constructor方法是类的默认方法
 *   通过new命令生成对象实例时，自动调用该方法。
 *   一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加
 *   class P(){}  等同于   class P(){constructor(){}} 
 *   constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象
 *   类的实例对象要 new ,否则报错
 */
class Foo {
  constructor() {
    return Object.create(null);
  }
}
console.log(new Foo() instanceof Foo);//false

/**
 * Class表达式
 *   
 */
//使用表达式定义了一个类。需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类
const myClass = class Me{
	getClassName(){
		return Me.name;
	}
};
let inst = new myClass();
inst.getClassName();//Me
//Me.name;//ReferenceError: Me is not defined

//立即执行的Class
let person = new class{
	constructor(name){
		this.name = name;
	}
	sayName(){
		console.log(this.name);
	}
}('小红');
person.sayName();//小红

/**
 * 类不存在变量提升
 */
// new Foo();//ReferenceError
// class Foo{};

/**
 * 私有方法:
 *   1.在命名上加以区别
 *   2.将私有方法移出模块，因为模块内部的所有方法都是对外可见的
 *   3.利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值
 */
class Widget{
	//共有方法
	foo(baz){
		this._bar(baz);
	}
	//私有方法
	_bar(baz){
		return this.name = baz;
	}
}

class Widget1{
	foo(baz){
		bar.call(this, baz);
	}
}
function bar(baz){
	return this.name = baz;
}

const barT = Symbol('bar');
const name = Symbol('snaf');
class Widget3{
	//共有
	foo(baz){
		this[barT](baz);
	}
	//私有
	[barT](baz){
		return this[name] = baz;
	}
}

/**
 * 私有属性
 *   提案： 在属性名之前，使用#表示
 */
// class Point {
//   #x;

//   constructor(x = 0) {
//     #x = +x; // 写成 this.#x 亦可
//   }

//   get x() { return #x }
//   set x(value) { #x = +value }
// }


/**
 * this指向
 *   类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错
 */
// class Logger {
//   printName(name = 'there') {
//     this.print(`Hello ${name}`);
//   }
//   print(text) {
//     console.log(text);
//   }
// }
// const logger = new Logger();
// const { printName } = logger; //对象解构
//printName(); // TypeError: Cannot read property 'print' of undefined
//printName方法中的this，默认指向Logger类的实例。但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境，因为找不到print方法而导致报错

//解决办法一 : 在构造方法中绑定this
class Logger {
  constructor(){
  	this.printName = this.printName.bind(this);
  }
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}
const logger = new Logger();
const { printName } = logger;
printName();//Hello there

//解决办法二: 箭头函数
class Logger1 {
	constructor(){
		this.printName1 = (name = 'there') => {
			this.print(`Hello ${name}`);
		}
	}
	print(text) {
    	console.log(text);
 	}
}
const logger1 = new Logger1();
const { printName1 } = logger1;
printName1();//Hello there

//解决办法三: Proxy，获取方法的时候，自动绑定this
class Logger2 {
  printName2(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}

function selfish(target){
	const cache = new WeakMap();
	const handler = {
    	get (target, key) {
    	  const value = Reflect.get(target, key);
    	  if (typeof value !== 'function') {
    	    return value;
    	  }
    	  if (!cache.has(value)) {
    	    cache.set(value, value.bind(target));
    	  }
    	  return cache.get(value);
    	}
  	};
  	return new Proxy(target, handler);
}
const logger2 = selfish(new Logger2());
const { printName2 } = logger2; //对象解构
printName2();//Hello there

/**
 * Class 的 Generator 方法
 *   如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数
 */
class Foo1 {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}
for (let x of new Foo1('hello', 'world')) {
  console.log(x);
}
//hello world

/**
 * Class 的静态方法
 *   类相当于实例的原型，所有在类中定义的方法，都会被实例继承。
 *   如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”
 */
class Fun {
	static classMethod(){
		return 'static method';
	}
}
Fun.classMethod(); // 'static method'
var fun = new Fun();
//fun.classMethod();//fun.classMethod is not a function

//父类的静态方法，可以被子类继承
class Honey extends Fun{}
Honey.classMethod();//static method

//静态方法也是可以从super对象上调用的
class Bar extends Fun{
	static classMethod(){
		return super.classMethod() + ', too';
	}
}
Bar.classMethod();//static method, too

/**
 * Class 的静态属性和实例属性
 *   静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性
 *   ES6 明确规定，Class 内部只有静态方法，没有静态属性，只能通过其他方式实现
 */
class F{}
F.prop = 1;
console.log(F.prop);//1;

// class my1{
// 	static myProp = 42;//Unexpected token =
// 	constructor(){
// 		console.log(this.myProp);//42
// 	}
// }


/**
 * new.target属性
 *   ES6 为new命令引入了一个new.target属性，该属性一般用在在构造函数之中，返回new命令作用于的那个构造函数
 *   如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的
 * Class 内部调用new.target，返回当前 Class
 *   注意： 子类继承父类时，new.target会返回子类
 *          利用这个特点，可以写出不能独立使用、必须继承后才能使用的类
 */
function Human(name) {
  	if(new.target !== undefined){ // 或 if(new.target === Human){ 或 if(this === Human){
  	  	this.name = name;
  	}else{
  	  	return new Human(name);
  	  	//throw new Error('必须使用new生成实例');
  	}
}
Human.prototype.sayName = function(){
	console.log(`It's name is ${this.name}`);
}
var hum = Human('张三'); // var hum = new Human('张三');
hum.sayName();//It's name is 张三

class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}
var obj = new Rectangle(3, 4);//true

class Squ extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}
var obj = new Squ(3); // 输出 false，因为new.target === Squ

//利用这个特点，可以写出不能独立使用、必须继承后才能使用的类
//Shape类不能被实例化，只能用于继承
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rect extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}
// var x = new Shape();  // 报错
var y = new Rect(3, 4);  // 正确