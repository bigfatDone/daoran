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
		var urlArray = window.location.href.split('/');
		var contextPath = urlArray[0] + '/' + urlArray[1] + '/' + urlArray[2] + '/' + urlArray[3];
		return contextPath;
	}, // end of getContextPath
	
	getParent: function(){
		return window==window.parent?window.top:window.parent;
	}, // end of getParent
	
	isArray: function(o){
		return Object.prototype.toString.call(o) === '[object Array]' || (o instanceof Array); 
	}
};

function getbytelength(str){ //返回字符串的长度（汉字占2个字节）
	var byteLen=0,len=str.length;
	if(str){
		for(var i=0;i<len;i++)
		{
		   if(str.charCodeAt(i)>255)
		      byteLen+=2;
		   else
		      byteLen++;
		}
	    return byteLen;
	}
	    return 0;
}

//项目名称
var proUrl = Epg.getContextPath();

//判断各种浏览器，找到正确的方法
function launchFullscreen(element) {
 if(element.requestFullscreen) {
  element.requestFullscreen();
 } else if(element.mozRequestFullScreen) {
  element.mozRequestFullScreen();
 } else if(element.webkitRequestFullscreen) {
  element.webkitRequestFullscreen();
 } else if(element.msRequestFullscreen) {
  element.msRequestFullscreen();
 }
}
// 启动全屏!
launchFullScreen(document.documentElement); // 整个网页