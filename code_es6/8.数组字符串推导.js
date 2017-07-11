/**
 * ES6提供简洁写法，允许直接通过现有数组生成新数组，这被称为数组推导（array comprehension）。
 * 数组推导可以代替 map 和 filter 方法
 * 注意：暂不支持
 */
var a1 = [1,2,3,4];
var a2 = [i * 2 for(i of a1)];//[2, 4, 6, 8];

//ES5
[1,2,3].map(function(i){return i*i};);
[1,4,2,3,-8].filter(function(i){return i<3};);

//ES6
[for(i of [1,2,3]) i * i];
[i for (i of [1,4,2,3,-8]) if (i < 3)];

//多重推导
var a1 = ["x1", "y1"];
var a2 = ["x2", "y2"];
var a3 = ["x3", "y3"];
[(console.log(s + w + r)) for (s of a1) for (w of a2) for (r of a3)];
//x1x2x3  x1x2y3 x1y2x3 x1y2y3 y1x2x3 y1x2y3 y1y2x3 y1y2y3

//字符串推导
[c for (c of 'abcde') if (/[aeiou]/.test(c))].join('');//'ae'

[c+'0' for (c of 'abcde')].join('') // 'a0b0c0d0e0'