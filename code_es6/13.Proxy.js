/**
 * Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写
 * 可以译为“代理器”
 * Proxy可以监听对象本身的变化，并在变化后执行相应的操作。可以实现追踪对象，同时在数据绑定方面也很有用处 
 *   var proxy = new Proxy(target, handler);
 *   new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为
 *   注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象进行操作
 */
//定义被侦听的目标对象
var target = { name: 'Joe Sixpack', salary: 50 };
//定义处理程序
var handler = {
  	set: function (receiver, property, value) {
  		//receiver：target
   		console.log(property, 'is changed to', value);
   		receiver[property] = value;//更改target对象
  	}
};
//创建代理以进行侦听
var proxy = new Proxy(target, handler);
//做一些改动来触发代理
proxy.salary = 60;//控制台输出：salary is changed to 60
console.log(target);// {name: "Joe Sixpack", salary: 60}
proxy.name = 'Rose';
console.log(target);// {name: "Rose", salary: 60}

// //如果handler没有设置任何拦截，那就等同于直接通向原对象
// var target1 = {};
// var handler1 = {};
// var proxy1 = new Proxy(target1, handler1);
// proxy1.a = 'b';
// target1.a // "b"

// //一个技巧是将 Proxy 对象，设置到object.proxy属性，从而可以在object对象上调用
// var object = { proxy: new Proxy(target2, handler2) };

// //Proxy 实例也可以作为其他对象的原型对象
// var proxy = new Proxy({},{
// 	get: function(target, property){
// 		return 35;
// 	}
// });
// let obj = Object.create(proxy);
// obj.time//35
//proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截


//同一个拦截器函数，可以设置拦截多个操作
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },
  apply: function(target, thisBinding, args) {
    return args[0];
  },
  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = function(a, b){
	return a + b;
}
// var fproxy = new Proxy(tt, handler);
// var fproxy = new Proxy(function(x, y) {
//   return x + y;
// }, handler);

fproxy(1, 2); // 1
new fproxy(1,2); // {value: 2}
fproxy.prototype === Object.prototype; // true
fproxy.foo; // "Hello, foo"

//get
var person = {name: '张三'};
var proxy = new Proxy(person, {
	get: function(target, property){
		if(property in target){
			return target[property];
		}else{
			throw new ReferenceError('Property \'' + property + '\' does not exist.');
		}
	}
});
proxy.name;//'张三'
proxy.age;//Error

// 下面的例子使用get拦截，实现数组读取负数的索引
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return target[2]
      return Reflect.get(target, propKey, receiver);
      return Reflect.get(['a','b','c'], 2, receiver);
    }
  };

  let target = elements;
  // target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // c

//下面的例子则是利用get拦截，实现一个生成各种DOM节点的通用函数dom
const dom = new Proxy({}, {
  get(target, property) {
    return function(attrs = {}, ...children) {
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);

//如果一个属性不可配置（configurable）和不可写（writable），则该属性不能被代理，通过 Proxy 对象访问该属性会报错。
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});
const handler = {
  get(target, propKey) {
    return 'abc';
  }
};
const proxy = new Proxy(target, handler);
proxy.foo
// TypeError: Invariant check failed

//set
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于age以外的属性，直接保存
    obj[prop] = value;
  }
};


let person = new Proxy({}, validator);
person.age = 100;
person.age // 100
person.age = 'young' // The age is not an integer
person.age = 300 // The age seems invalid

//有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写。
var popAlert = function(xxx){
	this.xxx = xx;
}

var handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
var target = {};
var proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property

//注意，如果目标对象自身的某个属性，不可写也不可配置，那么set不得改变这个属性的值，只能返回同样的值，否则报错。

xxx();  Object.call(null,a) Array.call.prototype.silce.apply([],b);
//apply方法拦截函数的调用、call和apply操作
//方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组
var handler = {
  apply (target, ctx, args) {
    return Reflect.apply(...args);
  }
};

//例子
var target = function(){return 'I am the target';};
var handler = {
	apply: function(){
		return 'I am the proxy';
	}
};
var p = new Proxy(target, handler);
p();//I am the proxy

//例子
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30

//另外，直接调用Reflect.apply方法，也会被拦截
Reflect.apply(proxy, null, [9, 10]) // 38

//has() : 用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符
//下面的例子使用has方法隐藏某些属性，不被in运算符发现
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false

//如果原对象不可配置或者禁止扩展，这时has拦截会报错
var obj = { a: 10 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

'a' in p // TypeError is thrown
//注意has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性
//has拦截对for...in循环不生效

let stu1 = {name: '张三', score: 59};
let stu2 = {name: '李四', score: 99};
let handler = {
  has(target, prop) {
    if (prop === 'score' && target[prop] < 60) {
      console.log(`${target.name} 不及格`);
      return false;
    }
    return prop in target;
  }
}
let oproxy1 = new Proxy(stu1, handler);
let oproxy2 = new Proxy(stu2, handler);
'score' in oproxy1
// 张三 不及格
// false
'score' in oproxy2
// true
for (let a in oproxy1) {
  console.log(oproxy1[a]);
}
// 张三
// 59

//construct方法用于拦截new命令: target: 目标对象,args：构建函数的参数对象
var handler = {
  construct (target, args, newTarget) {
    return new target(...args);
  }
};

//例子
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});
(new p(1)).value
// "called: 1"
// 10

//construct方法返回的必须是一个对象，否则会报错
var p = new Proxy(function() {}, {
  construct: function(target, argumentsList) {
    return 1;
  }
});
new p() // 报错

//deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property

//defineProperty方法拦截了Object.defineProperty操作
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar'
// TypeError: proxy defineProperty handler returned false for property '"foo"'
//defineProperty方法返回false，导致添加新属性会抛出错误

//getPrototypeOf() 方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。
// Object.prototype.__proto__
// Object.prototype.isPrototypeOf()
// Object.getPrototypeOf()
// Reflect.getPrototypeOf()
// instanceof
var proto = {};
var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
});
Object.getPrototypeOf(p) === proto // true

//setPrototypeOf()  方法主要用来拦截Object.setPrototypeOf方法
var handler = {
  setPrototypeOf (target, proto) {
    throw new Error('Changing the prototype is forbidden');
  }
};
var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);
// Error: Changing the prototype is forbidden

//this 问题 : 目标对象内部的this关键字会指向 Proxy 代理
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};
const proxy = new Proxy(target, handler);
target.m() // false
proxy.m()  // true
//一旦proxy代理target.m，后者内部的this就是指向proxy，而不是target

//下面是一个例子，由于this指向的变化，导致 Proxy 无法代理目标对象
const _name = new WeakMap();  => Map {{ Person => Jane }}
class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get();
  }
}
const jane = new Person('Jane');
jane.name; // 'Jane'
const proxy = new Proxy(jane, {});
proxy.name; // undefined
// 上面代码中，目标对象jane的name属性，实际保存在外部WeakMap对象_name上面，通过this键区分。
// 由于通过proxy.name访问时，this指向proxy，导致无法取到值，所以返回undefined。

// 有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);
proxy.getDate();

// TypeError: this is not a Date object.
//getDate方法只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错。这时，this绑定原始对象，就可以解决这个问题
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);
proxy.getDate() // 1

//实例：Web 服务的客户端
//Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端。
//上面代码新建了一个 Web 服务的接口，这个接口返回各种数据。Proxy 可以拦截这个对象的任意属性，所以不用为每一种数据写一个适配方法，只要写一个 Proxy 拦截就可以了
const service = createWebService('http://example.com/data/product.html')；
service.employees().then(json => {
  const employees = JSON.parse(json);
  // ···
});
service.product().then

function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      // return () => httpGet(baseUrl+'/' + propKey);
      return function httpGet(baseUrl+'/' + propKey){

      }
    }
  });

  var baseUrl = 'http://example.com/data;

  httpGet(url).then(response => {

  });

}