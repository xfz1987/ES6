/**
 * 有时候我们会把对象作为一个对象的键用来存放属性值
 *   普通集合类型比如简单对象会阻止垃圾回收器对这些作为属性键存在的对象的回收,有造成内存泄漏的危险
 *   而WeakMap,WeakSet则更加安全些,这些作为属性键的对象如果没有别的变量在引用它们，则会被回收释放掉 
 *
 * WeakSet只存储对象类型元素
 *   只有add/delete/clear/has三个方法，不能遍历，没有size属性等
 *   WeakSet主要用来储存DOM节点，当这些节点从文档移除时，不会引发内存泄漏
 * 
 * WeakMap与Map用法的区别：
 *   WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名
 *   没有keys、values、entries和size
 *   WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏
 *   注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用
 */
const ws1 = new WeakSet();
// ws1.add(1);//TypeError: Invalid value used in weak set
// ws1.add(Symbol());// TypeError: invalid value used in weak set
ws1.add({data:42});
ws1.add({levl:1});
//因为添加到ws1的这个临时对象没有其他变量引用它，所以ws不会保存它的值，也就是说这次添加其实没有意义
var arr = Array.from(ws1);//[]
console.log(ws1.has({data:42}));//false

var foo = {data:111},foo2 = {levl:222};
const ws2 = new WeakSet();
ws2.add(foo);
ws2.add(foo2);
console.log(Array.from(ws2));//[]
console.log(ws2.has(foo));//true

//WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用
/*
  const e1 = document.getElementById('foo');
  const e2 = document.getElementById('bar');
  const arr = [[e1, 'foo 元素'],[e2, 'bar 元素']];
*/
//形成了arr对e1和e2的引用,一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放e1和e2占用的内存,会造成内存泄露
//利用weakMap可以解决这个问题,WeakMap 里面对对象的引用就是弱引用，不会被计入垃圾回收机制，一旦消除对该节点的引用，它占用的内存就会被垃圾回收机制释放。Weakmap 保存的这个键值对，也会自动消失。
/*
  const wm = new WeakMap();
  const el = document.getElementById('example');
  wm.set(el, 'some information');
*/

//WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用
const wm1 = new WeakMap();
let key = {},obj = {foo:1};
wm1.set(key, obj);
obj = null;
console.log(wm1.get(key));//{ foo: 1 }
//即使在 WeakMap 外部消除了obj的引用，WeakMap 内部的引用依然存在

//weakMap的典型应用场景：DOM节点作为键名
let myElement = document.getElementById('logo');
let myWeakMap = new WeakMap();
myWeakMap.set(myElement, {timesClicked: 0});
myElement.addEventListener('click', function(){
	let logoData = myWeakMap.get(myWeakMap);
	logoData.timesClicked++;
}, false);
//每当发生click事件，就更新一下状态,一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险
//其实不如将状态数据注册在节点上，jQuery的data(),原生就存在属性当中

//注册监听事件的listener对象，就很合适用 WeakMap 实现
const listener = new WeakMap();
listener.set(element1, handler1);
listener.set(element2, handler2);
element1.addEventListener('click', listener.get(element1), false);
element2.addEventListener('click', listener.get(element2), false);
//监听函数放在 WeakMap 里面。一旦 DOM 对象消失，跟它绑定的监听函数也会自动消失

//WeakMap 的另一个用处是部署私有属性
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    _counter.set(this, --counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE

//Countdown类的两个内部属性_counter和_action，是实例的弱引用，
//所以如果删除实例，它们也就随之消失，不会造成内存泄漏