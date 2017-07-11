/** 
 * Array.from()方法用于将两类对象转为真正的数组
 *   类似数组的对象 和 可遍历（iterable）的对象，例如Set和Map
 *   如果参数是一个真正的数组，Array.from会返回一个一模一样的新数组
 *   Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组
 *   Array.from还可以传入第三个参数，用来绑定this
 *   Array.from()可以将各种值转为真正的数组，并且还提供map功能。这实际上意味着，只要有一个原始的数据结构，你就可以先对它的值进行处理，然后转成规范的数组结构，进而就可以使用数量众多的数组方法
 */
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3//去掉这个属性，那么返回[]
};

// ES5的写法
console.log([].slice.call(arrayLike));//['a', 'b', 'c']
// ES6的写法
console.log(Array.from(arrayLike));// ['a', 'b', 'c']

// 实际应用：常见的类似数组的对象是DOM操作返回的NodeList集合，以及函数内部的arguments对象。Array.from都可以将它们转为真正的数组
// NodeList对象
// let ps = document.querySelectorAll('p');
// Array.from(ps).forEach(function(p){
//   console.log(p);
// });
// // arguments对象
// function foo() {
//   var args = Array.from(arguments);
// }

console.log(Array.from('hello'));//['h', 'e', 'l', 'l', 'o']
let namesSet = new Set(['a', 'b'])
console.log(Array.from(namesSet));//[ 'a', 'b' ]
// Array.from(arrayLike, x => x*x);
// //等同于
// Array.from(arrayLike).map(x => x * x);

console.log(Array.from([1, , 2, , 3], (n) => n || 0));[ 1, 0, 2, 0, 3 ]
console.log(Array.from({ length: 2 }, () => 'jack'));// ['jack', 'jack']

//Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种Unicode字符，可以避免JavaScript将大于\uFFFF的Unicode字符
function countSymbols(string){
	return Array.from(string).length;
}
console.log(countSymbols('test'));

/**
 * Array.of方法用于将一组值，转换为数组
 *   Array.of基本上可以用来替代Array()或new Array()
 */
console.log(Array.of(3, 11, 8)); // [3,11,8]
console.log(Array.of(3)); // [3]
console.log(Array.of(3).length); // 1
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
function ArrayOf(){
  return [].slice.call(arguments);
}

/**
 * 数组实例的copyWithin方法
 *    在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组
 *    - target（必需）：从该位置开始替换数据。
 *    - start（可选）：从该位置开始读取数据，默认为0。如果为负值，表示倒数。
 *    - end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
 */
console.log([1, 2, 3, 4, 5].copyWithin(0, 3));//[ 4, 5, 3, 4, 5 ]
// 上面代码表示将从3号位直到数组结束的成员（4和5），复制到从0号位开始的位置，结果覆盖了原来的1和2
console.log([1, 2, 3, 4, 5].copyWithin(0, 3, 4));//[4, 2, 3, 4, 5]

/**
 * 数组实例的find()和findIndex()
 *   find: 用于找出第一个符合条件的数组成员,
 *   findIndex: 返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1
 *   这两个方法都可以接受第二个参数，用来绑定回调函数的this对象
 *   这两个方法都可以发现NaN，弥补了数组的IndexOf方法的不足
 */
console.log([1,4,-5,10].find((n) => n < 0));//-5
let res = [1, 5, 10, 15].find(function(value, index, arr) {
	return value > 9;
});
console.log(res);//10
let res1 = [1, 5, 10, 15].findIndex(function(value, index, arr) {
	return value > 9;
});
console.log(res1);//2
[NaN].indexOf(NaN);//-1
// [NaN].findIndex(y => Object.is(NaN, y))

/**
 * 数组实例的fill() 
 *   使用给定值，填充一个数组
 *   fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置（不包含结束位置）
 *   应用: fill方法用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去
 */
console.log(['a', 'b', 'c'].fill(7));//[ 7, 7, 7 ]
console.log(new Array(3).fill(7));//[ 7, 7, 7 ]
console.log(['a', 'b', 'c'].fill(7, 1, 2));//['a',7,'c']

/**
 * 数组实例的entries()，keys()和values()
 *   用于遍历数组，keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历
 */
console.log('-------------------')
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}//0  1
// for (let elem of ['c', 'd'].values()) {
//   console.log(elem);
// }????????
//'c'  'd'
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 'a'   1 'b'
// 如果不使用for...of循环，可以手动调用遍历器对象的next方法，进行遍历
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']

/**
 * 数组实例的includes()
 *   表示某个数组是否包含给定的值，与字符串的includes方法类似。该方法属于ES7
 *   第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始
 */
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, NaN].includes(NaN); // true
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true -1最后一个位置
