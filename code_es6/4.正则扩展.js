/**
 * ES5
 */
//邮箱验证
console.log(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test('gzf@163.com'));
//手机号码
console.log(/^1[3|4|5|7|8]\d{9}$/.test('13810001000'));
//身份证号码
console.log(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test('230903198710201455'))
//邮政编码
console.log(/[1-9]\d{5}(?!\d)/.test('154600'));
//消除空格
console.log(' 123 '.replace(/(^\s*|\s*$)/g,''));

// length>=5  ,    大字母、小写字母、数字、符号 ? 0|1 
//密码1: 5位以上的字母，数字的组合至少包含一位大写字母以及一位数字
//  分析: Step1：预判字符串不全是数字和小写字母 (?![0-9a-z]+$) 可能包含大写或特殊符号
//        Step2：预判字符串不全是字母 (?![a-zA-Z]+$) 可能包含数字或特殊符号
//        Step3: 只能用数字和字母 [0-9a-zA-Z]{5,}
console.log(/^(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{5,}$/.test('abvS2'));

//密码2: 5位以上的字母，数字、特殊字符的组合，必须含有至少数字，字母和特殊字符，并且不能包含空格
//  分析: step1:不能全是数字和字母 ~~  可能包含特殊字符
//        step2:不能全是字母和特殊字符 ~~ 可能包含数字
//        step3:不能全是数字和特殊字符 ~~ 可能包含字母
//        step4:只能是非空字符
console.log(/^(?![0-9a-zA-Z]+$)(?![a-zA-Z\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$)(?![0-9\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$)[\S]{5,}$/.test('123_b'));

//常用replace，如果reg是一个字符串，只会匹配第一个字符串，如果不加g也是只会匹配第一个字符串
console.log('abbbbacc'.replace('a','0'));//0bbbbacc
console.log('abbbbacc'.replace(/a/,'0'));//0bbbbacc
console.log('abbbbacc'.replace(/a/g,'0'));//0bbbb0cc


/**
 * ES6  暂时先不讲
 */
//1.RegExp构造函数