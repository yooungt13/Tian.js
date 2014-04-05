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

	// 注册到window对象和$
	var Tian = window.Tian = window.$ = function(selector) {
		return new Tian.fn.init(selector);
	};

	// 版本
	Tian.VERSION = '1.0.0';

	// 创建fn的命名空间,该内容为框架基础功能
	// Tian.fn保存Tian.prototype;
	Tian.fn = Tian.prototype = {
		constructor: Tian,
		// 初始化
		init: function(selector) {
			selector = selector || document;

			// 如果selector是DOM对象，则返回该对象
			if (selector.nodeType) {
				// 不可以修改this,用this[0]保存DOM对象
				this[0] = selector;
				return this;
			}

			// 如果selector是string，则当作ID返回DOM对象
			if (typeof selector === "string") {
				this[0] = document.getElementById(selector);
			}
			return this;
		},
		// 页面加载完毕
		ready: function(node) {
			//Tian.Event.readyEvent(node);
			return this;
		},
		// 读写HTML
		html: function(html) {
			if (typeof html !== 'undefined') {
				this[0].innerHTML = html;
				return this;
			} else {
				return this[0].innerHTML;
			}
		},
		// 读写CSS样式
		style: function(prop, value) {
			if (typeof value !== 'undefined') {
				this[0].style[camelizeprop] = value;
				return this;
			} else {
				return Tian.dom.getStyle(this[0], prop);
			}
		},
		// 判断样式是否存在
		hasClass: function(selector) {

		},
		// 添加样式
		addClass: function(selector) {

		},
		// 移除样式
		removeClass: function(selector) {

		},
		// 绑定事件
		bind: function(type, handler) {

		},
		// 移除事件
		unbind: function(type, handler) {

		},
		// 显示元素
		show: function() {
			this.style("display", "block");
			return this;
		},
		// 隐藏元素
		hide: function() {
			this.style("display", "none");
			return this;
		},
		setOpacity: function(number) {

		},
		// 动画效果
		slide: function(options) {

		},

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

	// 添加静态方法
	// 调用方式： $.now();
	Tian.extend({
		// 返回本地格式时间：2014年4月5日
		now: function() {
			return new Date().toLocalString();
		},
		// 获取当前时间：20140405132323
		getTime: function() {
			var now = new Date();

			var year = now.getFullYear(),
				month = now.getMonth() + 1,
				day = now.getDate(),
				hour = now.getHours(),
				minute = now.getMinutes(),
				second = now.getSeconds();

			var clock = year + "";

			if (month < 10) clock += "0";
			clock += month + "";
			if (day < 10) clock += "0";
			clock += (day + hour + minute + second);

			return (clock);
		},

		isString: function(value) {
			return typeof value === 'string';
		},
		isNumber: function(value) {
			return typeof value === 'number';
		},
		isFunction: function(value) {
			return typeof value === 'function';
		},
		isBoolean: function(value) {
			return typeof value === 'boolean';
		},
		isNaN: function(obj) {
			return obj !== obj;
		},
		isNull: function(obj) {
			return obj === null;
		},
		isChinese: function(value) {
			return Tian.regExp.isChinese(value);
		},
		setCookie: function(options) {

		},
		getCookie: function(cookie) {

		},
		deleteCookie: function(cookie) {

		},
		createXHR: function() {

		},
		ajax: function(url, opt) {
			return this;
		},
		// 鼠标位置
		getMousePos: function(e) {
			return Tian.Event.getMousePo(e);
		},
		// 屏幕尺寸
		getWindowSize: function() {
			var de = document.documentElement;
			return {
				'width': (
					window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
				'height': (
					window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
			}
		}
	});

	Tian.Event = {

	};

	Tian.dom = {
		id: function(id) {
			return document.getElementById(id);
		},
		tag: function(tag, el) {
			return (el || document).getElementsByTagName(tag);
		},
		className: function(className, tag, parent) {
			parent = parent || document;
			var elements = tag ? parent.getElementsByTagName(tag) : parent.all,
				matches = [];

			for (var i = 0, len = elements.length; i < len; i++) {
				if (this.hasClass(elements[i], className)) {
					matches.push(elements[i]);
				}
			}

			return matches;
		},
		getStyle: function(el, prop) {
			if (el.style[prop]) { // 检测元素style属性中的值
				return el.style[prop];
			} else if (el.currentStyle) { // IE方法
				return el.currentStyle[prop];
			} else if (document.defaultView && document.defaultView.getComputedStyle) {
				// DOM方法
				prop = prop.replace(/([A-Z])/g, "-$1");
				prop = prop.toLowerCase();
				var s = document.defaultView.getComputedStyle(el, "");
				return s && s.getPropertyValue(prop);
			} else
				return null;
		},
		hasClass: function(el, className) {
			// 创建一个正则表达式，来判断className是否正确
			className = className.replace(/\-/g, "\\-");
			var pattern = new RegExp("\\s*" + className + "\\s*");

			if (pattern.test(el.className)) {
				return true;
			} else {
				return false;
			}
		},
		addClass: function(el, className) {
			if (el.className === '') {
				el.className = className;
			} else {
				if (!this.hasClass(el, className)) {
					el.className += ' ' + className;
				}
			}
		},
		removeClass: function(el, className) {
			if (el.className !== '' && this.hasClass(el, className)) {
				// var classes = getElementByClassName(element),
				// 	length = classes.length;

				// // 循环遍历数组删除匹配的项
				// // 因为从数组中删除会使数组变短，所以反向循环
				// for (var i = length - 1; i >= 0; i--) {
				// 	if (classes[i] === className) {
				// 		delete(classes[i]);
				// 	}
				// }

				// element.className = classes.join(' ');
				// return (length == classes.length ? false : true);
			}
		}
	};

	Tian.cookie = {
		setCookie: function(options) {

		},
		getCookie: function(cookie) {

		},
		deleteCookie: function(cookie) {

		}
	};

	Tian.ajax = {
		createXHR: function() {
			if (typeof XMLHttpRequest != 'undefined') {
				return new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP"); //在IE中创建XMLHttpRequest对象,新版IE
				} catch (e) {
					try {
						return new ActiveXObject("Microsoft.XMLHTTP"); //在IE中创建XMLHttpRequest对象旧版IE
					} catch (e) {}
				}
			} else {
				window.alert("不能创建XMLHttpRequest对象实例");
				return false;
			}
		},
		send: function(url, options) {
			if (!Tian.ajax.createXHR) return;
			var xhr = Tian.ajax.createXHR();

			var _options = {
				method: 'GET',
				querystring: '',
				onerror: function() {},
				onsuccess: function() {}
			};

			for (var key in options) {
				_options[key] = options[key];
			}

			xhr.open(_options.method, url, true);
			xhr.onreadystatechange = onreadystateCallback;
			xhr.send(_options.querystring);

			function onreadystateCallback() {
				if (xhr.readyState == 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						_options.onsuccess(xhr);
					} else {
						_options.onerror(xhr);
					}
				}
			}
		}
	};

	Tian.canvas = {

	};

	Tian.regExp = {
		// 判断是否是中文
		isChinese: function(word) {
			return /[\u4E00-\uFA29]+|[\uE7C7-\uE7F3]+/.test(word);
		}
	};

	Tian.UI = {

	};
})()