/**
 * codePointAt() 不讲
 */
let s1 = '𠮷';
console.log(s1.length);//2
console.log(s1.charAt(0));//�
console.log(s1.charAt(1));//�
console.log(s1.charCodeAt(0));//55362
console.log(s1.charCodeAt(1));//55362
console.log(s1.codePointAt(0));

/**
 * String.fromCodePoint()  不讲
 * 用于从码点返回对应字符,但是这个方法不能识别32位的UTF-16字符（Unicode编号大于0xFFFF）
 */
console.log(String.fromCharCode(0x20BB7));//ஷ

/**
 * 字符串的遍历器接口 （没太大用处）
 * ES6为字符串添加了遍历器接口(Iterator),使得字符串可以被for...of循环遍历
 */
for(let codePoint of 'foo'){
	console.log(codePoint);
}
//'f'  'o'  'o'

/**
 * at() (提案)  不讲
 * ES5对字符串对象提供charAt方法，返回字符串给定位置的字符,该方法不能识别码点大于0xFFFF的字符
 * at方法，可以识别Unicode编号大于0xFFFF的字符，返回正确的字符
 */
// console.log('abc'.at(0)); // "a"
// console.log('𠮷'.at(0)); // "𠮷"

/**
 * includes()   - 表示是否找到了参数字符串
 * startsWith() - 表示参数字符串是否在源字符串的头部
 * endsWith()   - 表示参数字符串是否在源字符串的尾部
 * 这三个方法都支持第二个参数，表示开始搜索的位置
 */
var s2 = 'hello world!';
console.log(s2.startsWith('hello'));//true
console.log(s2.endsWith('!'));//true
console.log(s2.includes('o'));//true
console.log(s2.startsWith('world',6));//true
console.log(s2.endsWith('hello',5));//true
console.log(s2.includes('hello',6));//false

/**
 * repeat(n) 
 * 返回一个新字符串，表示将原字符串重复n次
 * 如果n为小数，则floor
 * 如果n为负数或者Infinity，会报错
 * 如果n为0到-1之间的小数，则等同于0，结果返回的是空字符串
 * 如果n为NAN，则等同为0
 * 如果n为字符串，则会先隐式转换为数字
 */
console.log('x'.repeat(3));//'xxx'
console.log('hello'.repeat(2));// "hellohello"
console.log('ma'.repeat(0));//''
console.log('na'.repeat(2.9));//"nana"
// console.log('ff'.repeat(-1));//RangeError
console.log('na'.repeat(-0.9)); // ""
console.log('na'.repeat(NaN)); // ""
console.log('na'.repeat('na')); // "",转为NAN，然后结果为0
console.log('na'.repeat('2')); // "nana"

/**
 * 不讲
 * ES2017: 字符串补全长度的功能,如果某个字符串不够指定长度，会在头部或尾部补全
 * padStart()
 * padEnd() 
 */
// 'x'.padStart(5, 'ab') // 'ababx'
// 'x'.padStart(4, 'ab') // 'abax'
// 'x'.padEnd(5, 'ab') // 'xabab'
// 'x'.padEnd(4, 'ab') // 'xaba'
//如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串
// 'xxx'.padStart(2, 'ab') // 'xxx'
// 'xxx'.padEnd(2, 'ab') // 'xxx'
//如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。
// 'abc'.padStart(10, '0123456789')//'0123456abc'
// 如果省略第二个参数，默认使用空格补全长度
// 'x'.padStart(4) // '   x'
// 'x'.padEnd(4) // 'x   '
//用途1:padStart的常见用途是为数值补全指定位数。下面代码生成10位的数值字符串
// '1'.padStart(10, '0') // "0000000001"
// '12'.padStart(10, '0') // "0000000012"
// '123456'.padStart(10, '0') // "0000123456"
//用途2:提示字符串格式
// '12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
// '09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"

/**
 * 模板字符串
 * 用反引号 ` 标识,它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量
 */
// 普通字符串
console.log(`In JavaScript '\n' is a line-feed.`);
// 多行字符串：省去了ES5的 + 号,ES6的拼接，模板字符串中所有的空格、新行、缩进，都会原样输出在生成的字符串中
console.log(`In JavaScript this is
 not legal.`);
// $('#list').html(`
// <ul>
//   <li>first</li>
//   <li>second</li>
// </ul>
// `.trim());
// 字符串中嵌入变量: ${}
let name = '小明',age = 20;
console.log(`你好, ${name}, 你今年${age}岁了!`);
// 如果在模板字符串中需要使用反引号，则前面要用反斜杠转义
console.log(`\`Yo\` World!`);
// {} 内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性
let x = 1,y =2,obj = {x:1,y:2};
console.log(`${x}+${y}=${x+y}`);//1+2=3
console.log(`${obj.x} + ${obj.y}`);//1 + 2
//模板字符串之中还能调用函数
function fn(){
	return 'hello world!';
}
console.log(`a is ${fn()} of`);//a is hello world! of
//如果需要引用模板字符串本身，在需要时执行
let str1 = 'return ' + '`hello ${name}`',
    func1 = new Function('name', str1);
console.log(func1('Jack'));//hello Jack

/**
 * 单纯的模板字符串还存在着很多的局限性
 *   1.不能自动转义特殊的字符串。（这样很容易引起注入攻击）
 *   2.不能很好的和国际化库配合（即不会格式化特定语言的数字，日期，文字等）
 *   3.没有内建循环语法，（甚至连条件语句都不支持， 只可以使用模板套构的方法）
 * 解决办法：使用标签模板，
 *   语法：标签`字符串内容`
 *   标签模板其实不是模板，而是函数调用的一种特殊形式,标签就是一个函数,紧跟在后面的模板字符串就是它的参数
 *   但是，如果模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数
 *   以变量为界限，进行拆分
 * 重要应用:
 *   1.过滤HTML字符串，防止用户输入恶意内容
 *   2.使用标签模板，在JavaScript语言之中嵌入其他语言
 */
console.log`123`;//等同于console.log('123');
let a = 5,b = 10;
tag`hello ${a+b} world ${a*b}`;//等同于 tag(['Hello ', ' world ', ''], 15, 50);
function tag(stringArr, val1, val2){
	console.log(stringArr,val1,val2);
}//function tag(stringArr,...values);


/** HTML 标签转义
 * 防止用户输入恶意内容
 * @param {Array.<DOMString>} templateData 字符串类型的tokens
 * @param {...} ..vals 表达式占位符的运算结果tokens
 */
let sender = '<script>alert("abc")</script>';// 恶意代码
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
function SaferHTML(templateData){
	let _s = templateData[0];
	for (let i=1,len=arguments.length;i<len;i++){
    	let arg = String(arguments[i]);
		// Escape special characters in the substitution.
    	_s += arg.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
       	// Don't escape special characters in the template.
    	_s += templateData[i];
  	}
  	return _s;
}
console.log(message);//<p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>

