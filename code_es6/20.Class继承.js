/**
 * 继承：ES6的class结构还允许使用extends关键字，表示继承
 * 注意：
 *    子类必须在constructor方法中调用super方法，否则新建实例时会报错
 *    这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工
 *    如果不调用super方法，子类就得不到this对象
 *    在super()执行时，它指向的是子类构造函数，而不是父类构造函数。也就是说，super()内部的this指向的是子类
 *    super作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错
 *    class B extends A {
         m() {
           super(); // 报错
           super.func();//正确
        }
      }
 *    super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类
 *    注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的
 *          如果属性定义在父类的原型对象上，super就可以取到
 *    class A { constructor(){ this.p = 2; } }
 *    class B extends A{ get m(){ return super.p }};
 *    let b = new B(); b.m;// undefined
 *
 *    class A {}
 *    A.prototype.x = 2;
 *    class B extends A { constructor(){ super();console.log(super.x); }}
 *    let b = new B();//2;
 *
 *    通过super调用父类的方法时，super会绑定子类的this
 *    由于绑定子类的this，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性
 *    如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象
 *
 * 
 * 类只是基于原型的面向对象模式的语法糖，类的继承比 ES5 的通过修改原型链实现继承，要清晰和方便很多
 *
 * 如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有constructor方法
 *   class ColorPoint extends Point {} 等同于 class ColorPoint extends Point{constructor(...args){super(...args);}}
 *   Object.getPrototypeOf(子类)方法可以用来从子类上获取父类
 *   Object.getPrototypeOf(子类) === 父类 可以判断一个类是否继承了另一个类
 *
 */

//ES5
var FunE5 = function(config){
	this.name = config.name;
	this.year = config.year;
}
FunE5.prototype = {
	speak : function(){
		console.log('Hello, ' + this.name);
	}
}
var funE5 = new FunE5({name:'Lucy',year:23});
funE5.speak();//Hello, Lucy

var FF = function(name){
	this.name = name;
}
//1.继承方式一: 别用:如果改变了Student的属性，那么连Person也一起改了
// FF.prototype = FunE5.prototype;
//Object.setPrototypeOf(FF,FunE5);
//2.继承方式二: 别用
// FF.prototype = new FunE5({name:'Lucy',year:23});
//3.继承方式三: 别用
//FF.prototype.constructor = FunE5;
//4.理想方式: 自己的修改不会影响原型链
FF.prototype = Object.create(FunE5.prototype);
var f = new FF('小明');
f.speak();//Hello, 小明

//ES6
class Fun {
	constructor(name, year){
		this.name = name;
		this.year = year;
		this.inner = function(){
			console.log('Private function');
		}
		console.log(new.target.name);
	}
	speak(){
		console.log(`${this.name} makes a noise.`);
	}
}
var fun = new Fun('Lucy');//Fun
fun.speak();//Lucy makes a noise.
fun.inner();//Private function

class Foo extends Fun {
	constructor(name, year, version){
		super(name,year);//super方法，表示调用父类的构造函数,得到this对象
		this.version = version;
	}
	speak(){
		super.speak();//相当于 Fun.proptype.speak(); 通过super调用父类的方法时，super会绑定子类的this
		console.log(`${this.name},${this.version}`);
	}
}
var foo = new Foo('Marry',17,'v1.0');//Foo
foo.speak();
//Marry makes a noise.
//Marry,v1.0
console.log(foo instanceof Foo);//true
console.log(foo instanceof Fun);//true
console.log(Object.getPrototypeOf(Foo) === Fun);//true
//实例对象foo同时是Foo和Fun两个类的实例，这与 ES5 的行为完全一致


//只有调用super方法才能使用this，否则会报错
// class Point {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }
// }
// class ColorPoint extends Point {
//   constructor(x, y, color) {
//     this.color = color; // ReferenceError
//     super(x, y);
//     this.color = color; // 正确
//   }
// }

// class A {
//   constructor() {
//     this.x = 1;
//   }
// }
// class B extends A {
//   constructor() {
//     super();
//     this.x = 2;
//     super.x = 3;
//     console.log(super.x); // undefined
//     console.log(this.x); // 3
//   }
// }
// let b = new B();

//如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }
  myMethod(msg) {
    console.log('instance', msg);
  }
}
class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }
  myMethod(msg) {
    super.myMethod(msg);
  }
}
Child.myMethod(1); // static 1
var child = new Child();
child.myMethod(2); // instance 2
//super在静态方法之中指向父类，在普通方法之中指向父类的原型对象

/**
 * 类的 prototype 属性和__proto__属性
 *   每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链
 *   1. 子类的__proto__属性，表示构造函数的继承，总是指向父类
 *   2. 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性
 */
class A {}
class B extends A {}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
//实现原理
//Object.setPrototypeOf(B.prototype, A.prototype); //B 的实例继承 A 的实例
//  等同于  B.prototype.__proto__ = A.prototype;
//Object.setPrototypeOf(B, A); //B 的实例继承 A 的静态属性
//  等同于  B.__proto__ = A;

//子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型
// var p1 = new Point(2, 3);
// var p2 = new ColorPoint(2, 3, 'red');
// p2.__proto__.__proto__ === p1.__proto__ // true

//分析一下原型
class Animal{
	constructor(name,color){
		this.name = name;
		this.color = color;
	}
	//toString 是原型Object对象上的属性方法
	toString(){
		console.log(`name:${this.name},color:${this.color}`);
		return this;
	}
	active(){
		console.log('叫');
		return this;
	}
}
var animal = new Animal('dog','white');//name:dog,color:white
animal.toString().active();//叫
console.log(animal.hasOwnProperty('name'));//true
console.log(animal.hasOwnProperty('toString')); //false
console.log(animal.__proto__.hasOwnProperty('toString'));//true

class Cat extends Animal {
	constructor(action){
		super('cat','black');
		this.action = action;
	}
	active(){//overwrite
		console.log(this.action);
	}
}
var cat = new Cat('卖萌');
cat.toString();//name:cat,color:black
cat.active();//卖萌
console.log(Cat.__proto__ === Animal);//true
console.log(Cat.prototype.__proto__ === Animal.prototype); //true
console.log(cat instanceof Cat);//true
console.log(cat instanceof Animal);//true
//实例化对象会有一个 __proto__ 指向构造函数的 prototype 属性。
//在 class 中。同时具有 __proto__ 和 prototype 两个属性，存在两条继承链。
//子类的 __proto__ 属性，表示构造函数的继承，总是指向父类。
//子类的 prototype 的 __proto__ 属性表示方法的继承，总是指向父类的 prototype 属性。


/**
 * 原生构造函数的继承：自己看
 *   Boolean()、Number()、String()、Array()、Date()、Function()、RegExp()、Error()、Object()
 */

/**
 * Mixin 模式的实现：将多个类的接口“混入”（mix in）另一个类
 */
//将多个对象合成为一个类
function mix(...mixins){
	class Mix {}
	for(let mixin of mixins){
		copyProperties(Mix, mixin);
		copyProperties(Mix.prototype, mixin.prototype);
	}
	return Mix;
}
function copyProperties(target, source){
	for(let key of Reflect.ownKeys(source)){
    	if(key !== "constructor" && key !== "prototype" && key !== "name"){
      		let desc = Object.getOwnPropertyDescriptor(source, key);
      		Object.defineProperty(target, key, desc);
    	}
  	}
}
class Loggable{}
class Serializable{}
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}