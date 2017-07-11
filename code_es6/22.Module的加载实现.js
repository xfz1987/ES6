/**
 * 浏览器加载
 *   传统方法: 在 HTML 网页中，浏览器通过<script>标签加载 JavaScript 脚本
 *             <script src="1.js" defer></script>  渲染完再执行
 *             <script src="2.js" async></script>  下载完就执行
 *             
 *   ES6: <script type="module" src="foo.js"></script>   由于type属性设为module，所以浏览器知道这是一个 ES6 模块
 *        浏览器对于带有type="module"的<script>，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了<script>标签的defer属性
 *        ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致  
 *        <script type="module">
  			   import utils from "./utils.js";
  			   // other code
		  </script>
		  模块之中，可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用export命令输出对外接口
		  模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的
		  同一个模块如果加载多次，将只执行一次
 */

/**
 * ES6 模块与 CommonJS 模块的差异
 *    CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
 *    CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
 */