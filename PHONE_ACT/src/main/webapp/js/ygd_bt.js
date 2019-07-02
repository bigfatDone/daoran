var KEY_BACK 		 = 8; 	// 返回/0008
var KEY_ENTER 		 = 13; 	// 确定/00013
var KEY_EXT			 = 27;  // 退出/0027
var KEY_PAGE_UP		 = 306;	// 上翻页/00306
var KEY_PAGE_DOWN    = 307; // 下翻页/00307
var KEY_LEFT		 = 65;  // 左/00065
var KEY_UP			 = 87;  // 上/00087
var KEY_RIGHT 		 = 68;	// 右/00068
var KEY_DOWN 		 = 83;	// 下/00083

var KEY_0 			 = 48;  // 0/00048       
var KEY_1 			 = 49;  // 1/00049
var KEY_2 			 = 50;  // 2/00050
var KEY_3 			 = 51;  // 3/00051
var KEY_4 			 = 52;  // 4/00052
var KEY_5			 = 53;  // 5/00053
var KEY_6 			 = 54;  // 6/00054
var KEY_7 			 = 55;  // 7/00055
var KEY_8 			 = 56;  // 8/00056
var KEY_9 			 = 57;  // 9/00057

var middleWare = top.Middleware;
if(middleWare == undefined || middleWare =="undefined" || middleWare == ""){
	KEY_BACK = 0x0008; 	// 返回/删除
	KEY_ENTER = 0x000D; 	// 确定
	KEY_LEFT = 0x0025;  // 左
	KEY_UP = 0x0026;  // 上
	KEY_RIGHT = 0x0027;	// 右
	KEY_DOWN = 0x0028;	// 下
}

//字符串去空格
function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g,'');
}

//常用函数
function G(id){return document.getElementById(id);}
function S(id){G(id).style.display='block';}
function H(id){G(id).style.display='none';}

// 命名空间
var Epg = {
	/** 调用函数 */
	call: function(fn, args){
		if(typeof fn == "string"){
			return eval("("+fn+")");
		}else if(typeof fn == "function"){
			if(this.isArray(args)){
				return fn.apply(window, args);
			}
		}
	},// end of call
	
	/** iPanel3.0,webkit可用 */
	ajax: function(config){
		var url = config.url;
		var data = config.data;
		var type = (config.type || 'GET').toUpperCase();
		var contentType = config.contentType||'application/x-www-form-urlencoded';
		var dataType = config.dataType;
		var headers = config.headers || [];
		var fnSuccess = config.success;
		var fnError = config.error;
		var xmlhttp;
		if(window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest();
		}else{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState==4){
				var rsp = xmlhttp.responseText||xmlhttp.responseXML;
				if(dataType=='json'){
					rsp = eval("("+rsp+")");
				}
				if(xmlhttp.status==200){
					Epg.call(fnSuccess, [xmlhttp, rsp]);
				}else{
					Epg.call(fnError, [xmlhttp, rsp]);
				}
	   		}
	    };
	    
		xmlhttp.open(type,url,true);
		for(var i=0; i<headers.length; ++i){
			xmlhttp.setRequestHeader(headers[i].name, headers[i].value);
		}
		xmlhttp.setRequestHeader('Content-Type', contentType);
		
		if(typeof data == 'object' && contentType=='application/x-www-form-urlencoded'){
			var s = '';
			for(attr in data){
				s += attr+'='+data[attr]+'&';
			}
			if(s){
				s = s.substring(0,s.length-1);
			}
			xmlhttp.send(s);
		}else{
			xmlhttp.send(data);
		}
		
	}, // end of ajax
	
	getContextPath: function(){
		var contextPath = '/' + window.location.href.split('/')[3];
		return contextPath;
	}, // end of getContextPath
	
	getParent: function(){
		return window==window.parent?window.top:window.parent;
	}, // end of getParent
	
	isArray: function(o){
		return Object.prototype.toString.call(o) === '[object Array]' || (o instanceof Array); 
	}
};
//自定义按钮
Epg.Button = {
	/** 初始化按钮 */
	init: function(config){
		this.previous = null,
		this._buttonStore = {};
		var preloadImages = [];
		for(var i=0,max=config.buttons.length; i<max; ++i){
			var button = config.buttons[i];
			this._buttonStore[button.id] = button;
			if(button.eager || config.eager){ // 热抓取图片如果需要
				if(button.focusImage){
					preloadImages.push(button.focusImage);
				}
				if(button.bgImage){
					preloadImages.push(button.bgImage);
				}
			}
			if(button.bkImage){
				if(G(button.id)){
					G(button.id).style.background = 'url(' + button.bkImage + ')  no-repeat';
				}
			}
		}
		var tempObj={};
		for(var i=0; i<preloadImages.length; ++i){
			tempObj[preloadImages[i]] = 1;
		}
		for(var attr in tempObj){
			var img = new Image();
			img.src = attr;
		}
		
		//设置默认获得焦点的按钮
		if(typeof config.defaultButtonId=="string"){
			this.current = this.get(config.defaultButtonId);
		}else if(Epg.isArray(config.defaultButtonId)){
			for(var i=0,max=config.defaultButtonId.length; i<max; ++i){
				var button = this.get(config.defaultButtonId[i]);
				if(button){
					this.current = button;
					break;
				}
			}
		}
		this.update();
	},// end of init
	
	/** 获取按钮 */
	get: function(id){
		if(G(id)){
			return this._buttonStore[id];
		}
	},// end of get
	
	/** 移动 */
	move: function(dir){
		var button;
		var nextButtonId = this.current[dir];
		if(typeof nextButtonId == "string"){
			button = this.get(nextButtonId);
			if(button && G(button.id).style.display != 'none'){
				this.previous = this.current;
				this.current = button;
			}else{
				this.previous = this.current;
			}
		}else if(Epg.isArray(nextButtonId)){
			for(var i=0,max=nextButtonId.length; i<max; ++i){
				button = this.get(nextButtonId[i]);
				if(button && G(nextButtonId[i]).style.display != 'none' && G(nextButtonId[i]).parentNode.style.display != 'none'
						&& G(nextButtonId[i]).parentNode.parentNode.style.display != 'none'){
					break;
				}
			}
			if(button && G(button.id).style.display != 'none'){
				this.previous = this.current;
				this.current = button;
			}else{
				this.previous = this.current;
			}
		}
			
		this.update();
		Epg.call(this.current.moveHandler, [this.previous, this.current, dir]);
	},// end of move
	
	/** 显示设置初始获得焦点的按钮 */
	set: function(buttonId){
		this.previous = this.current;
		this.current = this.get(buttonId);
		this.update();
	}, // end of set
	
	/** 点击确定按钮 */
	click: function(interceptor){
//		var log = this.current.log;
//		if(log){// 异步统计按钮点击
//			Epg.Log.access(log.source, log.target, log.targetType);
//		}
		
		Epg.call(interceptor, [this.current]); // 在点击按钮前可以执行一个自定义函数，比如统计按钮点击功能
		Epg.call(this.current.action, [this.current]);
	},// end of click
	
	/** 更新 */
	update: function(){
		var prev = this.previous;
		var current = this.current;
		if(prev){
			if(prev.linkImage){
				G(prev.id).src = prev.linkImage;
			}
			if(prev.bgImage){
				if(prev.bkImage){
					G(prev.id).style.background = 'url(' + prev.bkImage + ')  no-repeat';
				}else{
					G(prev.id).style.background = 'url('+proUrl+'/images/common/unfocus.png)  no-repeat';
				}
			}
			Epg.call(prev.blurHandler, [prev]);
		}
		if(current){
			if(current.focusImage){
				G(current.id).src = current.focusImage;
			}
			if(current.bgImage){
				G(current.id).style.background = 'url(' + current.bgImage + ')  no-repeat';
			}
			Epg.call(current.focusHandler, [current]);
		}
	}// end of update
};

/** 按键处理 */
//浏览器消息捕获
document.onkeypress = function(e){
	e = e || window.event;
	var keyCode = e.which || e.keyCode;
	return Epg.eventHandler(keyCode);
};

//项目名称
var proUrl = Epg.getContextPath();
