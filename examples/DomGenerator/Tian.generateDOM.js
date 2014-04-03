(function () {

	function encode(str) {
		if (!str) return null;
		str = str.replace(/\\/g, "\\\\");
		str = str.replace(/';/g, "\\'");
		// 行末空格+下一行行首^ = \n
		str = str.replace(/\s+^/mg, "\\n");

		return str;
	}

	function checkForVariable(v) {
		if (!~v.indexOf('$')) {
			// 若无$，则为常量
			v = '\'' + v + '\'';
		} else {
			// 获得$后的字符子串
			v = v.substring(v.indexOf('$') + 1);
			requireVariables += 'var ' + v + ';\n';
		}

		return v;
	}

	var domCode = '',
		nodeNameCounters = [],
		requireVariables = '',
		newVariables = '';

	function generate(strHTML, strRoot) {
		// 将HTML代码添加到页面主体中，以便能够遍历相应的DOM树
		var domRoot = document.createElement('div');
		domRoot.innerHTML = strHTML;

		// 重置变量
		domCode = '',
		nodeNameCounters = [],
		requireVariables = '',
		newVariables = '';

		// 使用processNode()处理domRoot中所有节点
		var node = domRoot.firstChild;
		while (node) {
			TIAN.walkTheDOM(processNode, node, 0, strRoot);
			node = node.nextSibling;
		}

		// 输出生成代码
		domCode =
			'/* requireVariables in this code\n' + requireVariables + '*/\n\n' + domCode + '\n\n' + '/* new objects in this code\n' + newVariables + '*/\n\n';

		return domCode;
	}

	function processNode(tabCount, refParent) {
		// 根据树深度级别重复制表符，以便控制缩进
		var tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');

		// 确定节点类型并处理元素和文本节点
		switch (this.nodeType) {
			case TIAN.node.ELEMENT_NODE:
				// 创建node标签计数器
				if (nodeNameCounters[this.nodeName]) {
					++nodeNameCounters[this.nodeName];
				} else {
					nodeNameCounters[this.nodeName] = 1;
				}

				var ref = this.nodeName.toLowerCase() + nodeNameCounters[this.nodeName];

				// 添加创建这个元素的DOM代码行
				domCode += tabs + 'var ' + ref + ' = document.createElement(\'' + this.nodeName + '\');\n';

				// 将新变量添加到列表中
				newVariables += ' ' + ref + ';\n';

				// 检查是否存在属性，如果是则循环遍历这些属性
				// 并使用processAttribute()方法遍历DOM树
				if (this.attributes) {
					for (var i = 0, len = this.attributes.length; i < len; i++) {
						TIAN.walkTheDOM(processAttribute, this.attributes[i], tabCount, ref);
					}
				}

				break;
			case TIAN.node.TEXT_NODE:
				// 检测文本节点中除了空白符之外的值
				var value = (this.nodeValue ? encode(this.nodeValue.trim()) : '');
				if (value) {
					// 创建计数器
					if (nodeNameCounters['txt']) {
						++nodeNameCounters['txt'];
					} else {
						nodeNameCounters['txt'] = 1;
					}

					var ref = 'txt' + nodeNameCounters['txt'];

					// 检查是不是$var格式的值
					value = checkForVariable(value);

					// 添加创建这个元素的DOM代码；
					domCode += tabs + 'var ' + ref + ' = document.createTextNode(' + value + ');\n';
					newVariables += ' ' + ref + ';\n';
				} else {
					return;
				}

				break;
			default:
				break; // 若处理其他节点，可通过case扩展
		}

		// 添加将这个节点添加到其父节点的代码中
		if (refParent) {
			domCode += tabs + refParent + '.appendChild(' + ref + ');\n';
		}
		return ref;
	}

	function processAttribute(tabCount, refParent) {
		// 跳过非属性节点
		if (this.nodeType != TIAN.node.ATTRIBUTE_NODE) return;

		var attrValue = (this.nodeValue ? encode(this.nodeValue.trim()) : '');
		//if( this.nodeName == 'cssText' ) alert(true);
		if (!attrValue) return;

		var tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');
		// 根据nodeName处理，class和style需要 特殊处理
		switch (this.nodeName) {
			case 'class':
			domCode += tabs + refParent + '.className = ' + checkForVariable(attrValue) + ';\n';
			break;
			case 'style':
			// 使用正则表达式基于；和邻近的空格符来分割样式
			var style = attrValue.split(/\s*;\s*/);
			if (style) {
				for (pair in style) {
					if (!style[pair]) continue;

					var prop = style[pair].split(/\s*:\s*/);
					if (!prop[1]) continue; //若有属性无值则直接跳过

					// 转换css属性格式
					prop[0] = TIAN.camelize(prop[0]);

					var propValue = checkForVariable(prop[1]);
					if (prop[0] == 'float') {
						// float是关键，需特殊处理
						// 同时处理cssFloat和ie styleFloat
						domCode += tabs + refParent + '.style.cssFloat = ' + propValue + ';\n';
						domCode += tabs + refParent + '.style.styleFloat = ' + propValue + ';\n';				
					}else{
						domCode += tabs + refParent + '.style.'+prop[0]+' = ' + propValue + ';\n';
					}

				}
			}
			break;
			default:
			if (this.nodeName.substring(0, 2) == 'on') {
				// 创建事件属性
				domCode += tabs + refParent + '.' + this.nodeName + ' = function(){' + attrValue + '}\n';
			} else {
				domCode += tabs + refParent + '.setAttribute(\'' + this.nodeName + '\', ' + checkForVariable(attrValue) + ');\n';
			}
			break;
		}
	}

	window['TIAN']['generateDOM'] = generate;
})();