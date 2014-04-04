/*
 *-------------------------------------------------------
 * Tian JavaScript Library v1.0.0
 *
 * 使用原生JavaScript实现的一些常用功能，类似jQuery语法和结构
 * 不断完善中
 *
 * @author: 有田十三 || yooungt@gmail.com
 * @Weibo ：http://weibo.com/yooungt
 * @date  : 2014-04-04
 * @Github: https://github.com/yooungt13
 *
 * Copyright (c) 2014 有田十三
 * -----------------------------------------------------
 */

(function() {

	// 版本
	Tian.VERSION = '1.0.0';

	// 注册到window对象和$
	var Tian = window.Tian = window.$ = function(selector) {
		return new Tian.fn.init(selector);
	};

	// 创建fn的命名空间,该内容为框架基础功能
	// Tian.fn保存Tian.prototype;
	Tian.fn = Tian.prototype = {
		constructor: Tian,
		// initialize [初始化]
		init: function(selector) {
			selector = selector || document;

			// 如果selector是DOM对象，则返回该对象
			if (selector.nodeType) {
				this[0] = selector;
				return this;
			}

			// 如果selector是string，则当作ID返回DOM对象
			if (typeof selector === "string") {
				this[0] = document.getElementById(selector);
			}
			return this;
		}
	};


	// 内部处理实例创建，定义prototype方法保证多实例共享方法减少资源开支
	Tian.fn.init.prototype = Tian.fn;

	// 扩展Tian.js对象。用来在fn命名空间上增加新函数
	Tian.extend = Tian.fn.extend = function(obj, property) {
		if (!property) {
			property = obj;
			obj = this;
		}
		// obj用以扩展的对象，prop为扩展的函数集。
		// 如果参数只有一个,则扩展新函数到obj对象上
		for (var i in property) {
			obj[i] = property[i];
		}
		return obj;
	};

	// 给fn添加的功能，需要先选择节点，然后才能操作
	// 调用方式： $("id").val();
	Tian.extend(Tian.prototype, {

	});
})()