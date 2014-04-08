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
	// 缓存初始$使用环境
	var _$ = window.$;

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
		ready: function(fn) {
			Tian.Event.readyEvent(fn);
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
		css: function(prop, value) {
			if (typeof value !== 'undefined') {
				Tian.dom.setStyle(this[0], prop, value);
				return this;
			} else {
				if (typeof prop === 'string') {
					return Tian.dom.getStyle(this[0], prop);
				} else if (typeof prop === 'object') {
					Tian.dom.setStyle(this[0], prop);
					return this;
				}
			}
		},
		// 判断样式是否存在
		hasClass: function(selector) {
			return Tian.dom.hasClass(this[0], selector);
		},
		// 添加样式
		addClass: function(selector) {
			Tian.dom.addClass(this[0], selector);
			return this;
		},
		// 移除样式
		removeClass: function(selector) {
			Tian.dom.removeClass(this[0], selector);
			return this;
		},
		// 绑定事件
		bind: function(type, handler) {
			Tian.Event.addEvent(this[0], type, handler);
		},
		// 移除事件
		unbind: function(type, handler) {
			Tian.Event.removeEvent(this[0], type, handler);
		},
		// 显示元素
		show: function() {
			this.css("display", "block");
			return this;
		},
		// 隐藏元素
		hide: function() {
			this.css("display", "none");
			return this;
		},
		setOpacity: function(number) {
			if (this[0].filters) {
				this[0].style.filter = "alpha(opacity=" + number + ")";
			} else {
				this[0].style.opactiy = number / 100;
			}
		},
		// 动画效果
		slide: function(options) {},
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
	Tian.extend(Tian.prototype, {});

	// 添加静态方法
	// 调用方式： $.now();
	Tian.extend({
		// 放弃对$的控制权
		noConflict: function() {
			// 还原$调用环境
			if (window.$ === Tian) {
				window.$ = _$;
			}
			return Tian;
		},
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
		setCookie: function(options) {},
		getCookie: function(cookie) {},
		deleteCookie: function(cookie) {},
		createXHR: function() {
			return Tian.ajax.createXHR();
		},
		ajax: function(url, opt) {
			Tian.ajax.send(url, opt);
			return this;
		},
		// 鼠标位置
		getMousePos: function(e) {
			return Tian.Event.getMousePos(e);
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
		readyEvent: function(fn) {
			if (!fn) fn = document;
			var oldonload = window.onload;
			if (typeof window.onload != 'function') {
				window.onload = fn;
			} else {
				window.onload = function() {
					oldonload();
					fn();
				}
			}
		},
		addEvent: function(node, type, handler) {
			node.addEventListener ?
				node.addEventListener(type, handler, false) :
				node.attachEvent('on' + type, function() {
					handler.call(node);
				});
		},
		removeEvent: function(node, type, handler) {
			node.removeEventListener ?
				node.removeEventListener(type, handler, false) :
				node.detachEvent('on' + type, function() {
					handler.call(node);
				});
		},
		stopEvent: function(event) {
			this.stopPropagation(event);
			this.preventDefault(event);
		},
		stopPropagation: function(event) {
			event = this.getEvent(event);
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		preventDefault: function(event) {
			event = this.getEvent(event);
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		getEvent: function(event) {
			return event || window.event;
		},
		// 获取事件目标
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		getMousePos: function(event) {
			event = this.getEvent(event);
			var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
				y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
			return {
				'x': x,
				'y': y
			};
		},
		// 鼠标按键被按下事件捕获
		getButton: function(event) {
			event = this.getEvent(event);
			// 使用适当的属性初始化一个对象变量
			var buttons = {
				'left': false,
				'middle': false,
				'right': false
			};
			// 按照W3C标准检查是否含有toString方法，
			// 若包含toString()并返回MouseEvent，则可以按标准进行
			if (event.toString && event.toString().indexOf('MouseEvent') != -1) {
				switch (event.button) {
					case 0:
						buttons.left = true;
						break;
					case 1:
						buttons.middle = true;
						break;
					case 2:
						buttons.right = true;
						break;
					default:
						break;
				}
			} else if (event.button) {
				// 变态IE的button事件检测方法
				switch (event.button) {
					case 1:
						buttons.left = true;
						break;
					case 2:
						buttons.right = true;
						break;
					case 3:
						buttons.left = true;
						buttons.right = true;
						break;
					case 4:
						buttons.middle = true;
						break;
					case 5:
						buttons.left = true;
						buttons.middle = true;
						break;
					case 6:
						buttons.middle = true;
						buttons.right = true;
						break;
					case 7:
						buttons.left = true;
						buttons.middle = true;
						buttons.right = true;
						break;
					default:
						break;
				}
			} else {
				return false;
			}
			return buttons;
		},
		// 取得Keypress事件时，获取按下键的ASCII编码
		getCharCode: function(event) {
			if (typeof event.charCode == "number") {
				return event.charCode;
			} else {
				return event.keyCode;
			}
		}
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
		setStyle: function(el, prop, value) {
			if (typeof value !== 'undefined') {
				if (el.style.setProperty) {
					el.style.setProperty(prop, value);
				} else {
					el.style[camelize(prop)] = value;
				}
			} else {
				// 循环遍历styles对象并应用每个属性
				for (p in prop) {
					// 如果传入样式不存在则跳过
					if (!prop.hasOwnProperty(p)) continue;

					if (el.style.setProperty) {
						el.style.setProperty(p, prop[p]);
					} else {
						el.style[camelize(p)] = prop[p];
					}
				}
			}

			return true;
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
				var classes = getClassNames(el),
					length = classes.length;
				// 循环遍历数组删除匹配的项
				// 因为从数组中删除会使数组变短，所以反向循环
				for (var i = length - 1; i >= 0; i--) {
					if (classes[i] === className) {
						delete(classes[i]);
					}
				}
				el.className = classes.join(' ');
				return (length == classes.length ? false : true);
			}
		},
		getClassNames: function(element) {
			// 用一个空格替换多个空格，然后基于空格分割类名
			return element.className.replace(/\s+/, ' ').split(' ');
		},
		camelize: function(str) {
			// 修改内嵌样式，如font-size转化为fontSize		
			return str.replace(/-(\w)/g, function(match, word) {
				// match为-s,word为(\w)匹配到的s,转化为S
				return word.toUpperCase();
			});
		},
		trim: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		}
	};

	Tian.cookie = {
		setCookie: function(opt) {
			var str = opt.name + '=' + escape(opt.value) + '; ';
			if (opt.days) {
				str += 'expires=' + new Date(new Date().getTime() + opt.days * 24 * 60 * 60 * 1000).toGMTString() + '; ';
			}
			if (opt.domain) {
				str += 'domain=' + opt.domain + '; ';
			}
			if (opt.path) {
				str += 'path=' + opt.path + '; ';
			}
			if (opt.secure) {
				str += 'secure';
			}
			document.cookie = str;
		},
		getCookie: function(name) {
			var pattern = new RegExp('(^|\s*)' + name + "=([^;]*)(;|$)"),
				arr = document.cookie.match(pattern);

			if ( !! arr) {
				return unescape(arr[2]);
			} else {
				return "No cookie!";
			}
		},
		deleteCookie: function(cookie) {}
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

	Tian.canvas = {};

	Tian.regExp = {
		// 判断是否是中文
		isChinese: function(word) {
			return /[\u4E00-\uFA29]+|[\uE7C7-\uE7F3]+/.test(word);
		}
	};

	Tian.UI = {};
})()