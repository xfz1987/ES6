/**
 * 背景：
 *   ES5 的对象属性名都是字符串，这容易造成属性名的冲突。
 *   比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。
 *   如果有一种机制，保证每个属性的名字都是独一无二的就好了，
 *   这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因
 */
var obj = {
	'name': '123'
}

/**
 * 新的原始数据类型Symbol，表示独一无二的值,它是一种类似于字符串的数据类型
 *   ES5六种基本数据类型: undefined、null、布尔值、字符串、数值、对象
 *   第七种: Symbol
 *   Symbol 值通过Symbol函数生成
 *   
 *  注意: 
 *     1.Symbol函数前不能使用new命令,因为生成的 Symbol 是一个原始类型的值，不是对象
 *     2.Symbol 值不能与其他类型的值进行运算  
 *     3.Symbol 值可以显式转为字符串,Symbol 值也可以转为布尔值，但是不能转为数值
 */
var s1 = Symbol('foo');
var s2 = Symbol('bar');
s1;// Symbol(foo)
s2;// Symbol(bar)
s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"

// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();
s1 === s2 // false
// 有参数的情况
var s1 = Symbol('foo');
var s2 = Symbol('foo');
s1 === s2 // false