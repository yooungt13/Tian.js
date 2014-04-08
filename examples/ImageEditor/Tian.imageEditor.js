(function() {

	// 返回一个数组，浏览器窗口的宽度和高度
	function getWindowSize() {
		if (self.innerHeight) {
			return {
				'width': self.innerWidth,
				'height': self.innerHeight
			};
		} else if (document.documentElement && document.documentElement.clientHeight) {
			// MSIE严格模式
			return {
				'width': document.documentElement.clientWidth,
				'height': document.documentElement.clientHeight
			};
		} else if (document.body) {
			return {
				'width': document.body.clientWidth,
				'height': document.body.clientHeight
			}
		}
	}

	// 返回一个对象，以所提供元素的height,width,top,left作为属性
	function getDimensions(e) {
		return {
			top: e.offsetTop,
			left: e.offsetLeft,
			width: e.offsetWidth,
			height: e.offsetHeight
		};
	}

	// 设置元素的top,left,right,bottom及width,height属性
	function setNumericStyle(e, dim, updateMessage) {
		// 检查信息
		updateMessage = updateMessage || false;

		var style = {};
		for (var i in dim) {
			if (!dim.hasOwnProperty(i)) continue;
			style[i] = (dim[i] || '0') + 'px';
		}
		TIAN.setStyle(style);

		// 如果存在信息则更新
		if (updateMessage) {
			imageEditor.elements.cropSizeDisplay.firstChild.nodeValue = dim.width + 'x' + dim.height;
		}
	}

	function imageEditor() {}
	imageEditor = {
		info: {
			resizeCropArea: false,
			pointerStart: null,
			resizeStart: null,
			cropAreaStart: null,
			imgSrc: null
		},
		elements: {
			'backdrop': null,
			'editor': null,
			'resizeHandle': null,
			'cropSizeDisplay': null,
			'resizee': null,
			'resizeeCover': null,
			'cropResizeHandle': null,
			'saveHandle': null,
			'cancelHandle': null
		},
		load: function(e) {
			// 取得页面中所有带ImageEditor类名的表单元素
			var forms = TIAN.getElementsByClassName('imageEditor', 'FORM');

			// 在符合条件的表单中查找图像
			for (var i = 0, len = forms.length; i < len; i++) {
				var images = forms[i].getElementsByTagName('img');
				if (!images[0]) {
					// 这个表单中不包含图像则返回
					continue;
				}

				// 为图像添加imageEditor.imageClick事件
				TIAN.addEvent(images[0], 'click', imageEditor.imageClick);

				// 修改类名以便CSS按照需要修改其样式
				forms[0].className += ' imageEditorModified';

				// 如果表单的类名被修改，则会应用CSS中包含修改页面样式的额外规则

			}
		},
		unload: function(e) {
			// 移除编辑、背景
		},
		imageClick: function(e) {
			// 创建Image对象
			var image = new Image();

			// this引用被单击的图像元素
			image.src = imageEditor.info.imgSrc = this.src;

			// 为放置背景和剧终编辑器而取得页面大小
			var windowSize = getWindowSize();

			// 创建背景div，并使其撑满整个页面
			var backdrop = document.createElement('div');
			imageEditor.elements.backdrop = backdrop;
			TIAN.setStyle(backdrop, {
				'position': 'absolute',
				'background-color': 'black',
				'opacity': '0.8',
				'width': '100%',
				'height': '100%',
				'z-index': 10000,
				// 对MISE需要使用滤镜
				'filter': 'alpha(opacity=80)'
			});
			document.body.appendChild(backdrop);

			// 创建编辑器div以包含编辑器工具的GUI
			var editor = document.createElement('div');

			// 创建缩放手柄

			// 创建可缩放的图像

			// 创建半透明的蒙板

			// 创建裁剪大小显示区域

			// 创建裁剪区域

			// 在裁剪区域中创建图像的副本

			// 创建保存手柄

			// 创建取消缩放手柄

			// 向DOM元素添加事件

			// 缩放手柄的翻转图

			// 裁剪手柄的翻转图

			// 保存手柄的翻转图

			// 取消手柄的翻转图

			// 启动裁剪区域拖动事件流

			// 单击保存手柄或双击裁剪区域时保存图像

			// 防止取消手柄启动裁剪拖动事件流

			// 在单击时取消改变

			// 如果窗口大小改变则调整背景的大小
			alert(1);
		},
		resizeMouseDown: function(e) {
			// 保存当前的位置和尺寸

			// 添加其余事件以启动拖动

			// 停止事件流
		},
		resizeMouseMove: function(e) {
			// 取得当前鼠标指针所在位置

			// 基于鼠标指针来计算
			// 图像新的高度和宽度

			// 最小尺寸是42

			// 计算基于原始值的百分比

			// 如果按下了shift键，则按比例缩放

			// 计算裁剪区域的新尺寸

			// 缩放对象

			// 停止事件流
		},
		resizeMouseUp: function(e) {
			// 移除事件监听器以停止拖动
			// 停止事件流
		},
		cropMouseDown: function(e) {
			// 包含缩放以限制裁剪区域的移动
			// 停止事件流
		},
		cropMouseMove: function(e) {
			var pointer = TIAN.getPointerPosition(e);
			if (imageEditor.info.resizeCropArea) {
				// 缩放裁剪区域

				// 如果按下了Shift键，则按比例缩放
				// 计算基于原始值的百分比

				// 检查新位置是否超出了边界
			} else {
				// 移动裁剪区域

				// 检查新位置是否超出了边界
			}
			// 停止事件流
		},
		cropMouseUp: function(e) {
			// 移除所有事件
			// 停止事件流
		},
		saveClick: function(e) {
			// 如果成功则卸载编辑器
		},
		cancelClick: function(e) {}
	};

	window['TIAN']['imageEditor'] = imageEditor;

	TIAN.addLoadEvent(imageEditor.load);
})();