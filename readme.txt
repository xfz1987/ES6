环境及配置
  * nodejs: npm install -g babel
  
  * sublime环境
    1.安装插件 sublime javascriptNext 
    2.在sublime text中依次打开Tools -> Build System -> New Build System... 粘贴以下代码后保存(如ES6.sublime-build), 然后把Build System设成Automatic
	    {
	        "cmd": ["node", "--use-strict", "--harmony", "$file"],
	        "selector": "source.js"
	    }
  
  * 在根目录下新建 配置文件 .babelrc
	  {
	    "presets": ["es2015"],
	    "plugins": []
	  }

  * sublme 查看ES6运行结果 ctrl+b

  * 根目录下 npm init

  * 将ES6转化成es15
    npm install --g babel-cli
    npm install --save-dev babel-cli
    npm install --save-dev babel-preset-es2015  
      
  * 转化命令
    * 转码结果输出到标准输出
      babel example.js

    * 转码结果写入一个文件（--out-file 或 -o 参数指定输出文件）
      babel example.js --out-file compiled.js 

    * 整个目录转码（--out-dir 或 -d 参数指定输出目录）
      babel code_es6 -d code_es5
    
    * -s 参数生成source map文件
      babel code_es6 -d code_es5 -s