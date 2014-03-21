(function(){
	if(!window.TIAN) { window['TIAN'] = {}; }

	function isCompatible(other){
		// 使用能力检测来检查必要条件
		if( other === false 
			|| !Array.prototype.push
			|| !Object.hasOwnProperty
			|| !document.createElement
			|| !document.getElementByTagName
		) return false;

		return true;
	}
	window['TIAN']['isCompatible'] = isCompatible;

	function $(){
		var elements = [];

		// 查找作为参数提供的所有元素
		for( var i = 0; i < arguments.length; i++ ){
			var element = arguments[i];

			// 如果该参数是一个字符串那假设它是一个id
			if( typeof element == 'string' ){
				element = document.getElementById(element);
			}
			// 如果只提供了一个参数， 即返回这个元素
			if( arguments.length == 1 ) return element;
			// 否则，将它添加到数组中
			elements.push(element);
		}

		return elements;
	}
	window['TIAN']['$'] = $;

	function addEvent(node, type, handler){
		// 检查兼容性以保证平稳退化
		if( !isCompatible() ) return; 

		node.addEventListener?
			node.addEventListener(type,handler,false) :
			node.attachEvent('on'+type,function(){ handler.call(node); });
	}
	window['TIAN']['addEvent'] = addEvent;

	function removeEvent(node, type, handler){
		// 检查兼容性以保证平稳退化
		if( !isCompatible() ) return;

		node.removeEventListener?
			node.removeEventListener(type,handler,false) :
			node.detachEvent('on'+type,function(){ handler.call(node); });

	}
	window['TIAN']['removeEvent'] = removeEvent;

	function getElementByClassName(className, tag, parent){
		parent = parent || document;

		// 查找所有匹配的标签
		var allTags = (tag == '*' && parent.all)? 
			parent.all : parent.getElementByTagName(tag);
		var	matchingElements = [];

		// 创建一个正则表达式，来判断className是否正确
		className = className.replace(/\-/g,"\\-");
		var pattern = new RegExp("(^|\\s)"+className+"(\\s|$)");

		var element;
		// 检查每个元素
		for( var i = 0, len = allTags.length; i < len; i++ ){
			element = allTags[i];
			if(pattern.test(element)){
				matchingElements.push(element);
			} 
		}

		return matchingElements;
	}
	window['TIAN']['getElementByClassName'] = getElementByClassName;

	// 切换display
	function toggleDisplay(node, value){
		if(!(node = $(node))) return; // 如果node不为DOM，则返回

		if( node.style.display != 'none' ){
			node.style.display = 'none';
		}else{
			node.style.display = value || '';
		}
	}
	window['TIAN']['toggleDisplay'] = toggleDisplay;

	function insertAfter (node, referenceNode) {
		if(!(node = $(node))) return;
		if(!(referenceNode = $(referenceNode))) return;

		return referenceNode.parentNode.insertBefore(
			node, referenceNode.nextSibling
		);
	}
	window['TIAN']['insertAfter'] = insertAfter;

	function removeChildren(parent){
		if(!(parent=$(parent))) return;

		// 当存在子节点时删除该子节点
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		}

		// 再返回父节点，以便实现链式方法
		return parent;
	}
	window['TIAN']['removeChildren'] = removeChildren;

	function prependChild (parent,newChild) {
		if(!(parent=$(parent))) return;

		if(parent.firstChild) parent.insertBefore(newChild,parent.firstChild);
		else parent.appendChild(newChild);

		return parent;
	}
	window['TIAN']['prependChild'] = prependChild;

})();