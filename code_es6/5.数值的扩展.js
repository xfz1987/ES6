//1. Number.isFinite()： 用来检查一个数值是否为有限的（finite）
console.log(Number.isFinite(15));//true
console.log(Number.isFinite(NaN));//false
console.log(Number.isFinite(Infinity));//false
console.log(Number.isFinite(-Infinity));//false
console.log(Number.isFinite('foo'));//false
console.log(Number.isFinite('15'));//false
console.log(Number.isFinite(true));//false

//2.Number.isNaN()用来检查一个值是否为NaN
console.log(Number.isNaN(NaN));//true
console.log(Number.isNaN(15));//false
console.log(Number.isNaN('15'));//false
console.log(Number.isNaN(true));//false
console.log(Number.isNaN(9/NaN));//true
console.log(Number.isNaN('true'/0));//true
console.log(Number.isNaN('true'/'true'));//true

//3.Number.parseInt(), Number.parseFloat()
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45

// 这样做的目的，是逐步减少全局性方法，使得语言逐步模块化
Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true

//Number.isInteger() ： 用来判断一个值是否为整数。需要注意的是，在JavaScript内部，整数和浮点数是同样的储存方法，所以3和3.0被视为同一个值
console.log(Number.isInteger(25)); // true
console.log(Number.isInteger(25.0)); // true
console.log(Number.isInteger(25.1)); // false
console.log(Number.isInteger("15")); // false
console.log(Number.isInteger(true)); // false

//Number.EPSILON ： 一个极小的常量Number.EPSILON，用于为浮点数计算，设置一个误差范围
console.log(0.1 + 0.2);//0.30000000000000004
//但是如果这个误差能够小于Number.EPSILON，我们就可以认为得到了正确结果
//误差检查函数
function withinErrorMargin(left, right){
	return Math.abs(left - right) < Number.EPSILON;
}
console.log(withinErrorMargin(0.1 + 0.2, 0.3));//true

/**
 * Math对象的扩展
 *   1.Math.trunc() : 用于去除一个数的小数部分，返回整数部分
 *     对于非数值，Math.trunc内部使用Number方法将其先转为数值
 *     对于空值和无法截取整数的值，返回NaN
 *   2.Math.sign : 用来判断一个数到底是正数、负数、还是零
 *     参数为正数，返回+1；
 *     参数为负数，返回-1；
 *     参数为0，返回0；
 *     参数为-0，返回-0;
 *     其他值，返回NaN
 *   3.Math.cbrt : 用于计算一个数的立方根
 */
console.log(Math.trunc(4.1));//4
console.log(Math.trunc(-4.1));//-4
console.log(Math.trunc('123.456'));//123
console.log(Math.trunc('foo'));//NaN
console.log(Math.trunc());//NaN
Math.trunc = Math.trunc || function(x){
	return x < 0 ? Math.ceil(x) : Math.floor(x);
}

console.log(Math.sign(-5)); // -1
console.log(Math.sign(5)); // +1
console.log(Math.sign(0)); // +0
console.log(Math.sign(-0)); // -0
console.log(Math.sign(NaN)); // NaN
console.log(Math.sign('foo')); // NaN
console.log(Math.sign());      // NaN

Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};
