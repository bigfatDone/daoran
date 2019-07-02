<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
    <head>
	    <script type="text/javascript">
	        var userId = "";
	        var stbName = "";
	        var stbVersion = "";
 	    	
	        var CA_ICNO = top.CA.icNo;
	    	if(CA_ICNO != undefined && CA_ICNO != null && CA_ICNO != ""){
	    		userId = CA_ICNO;
	    	}
	    	
	    	var MIDDLEWARE_NAME = top.Middleware.name;
	    	if(MIDDLEWARE_NAME != undefined && MIDDLEWARE_NAME != null && MIDDLEWARE_NAME != ""){
	    		stbName = MIDDLEWARE_NAME;
	    	}
	    	
	    	var SOFTWARE_VERSION = top.SysInfo.softwareVersion;
	    	if(SOFTWARE_VERSION != undefined && SOFTWARE_VERSION != null && SOFTWARE_VERSION != ""){
	    		stbVersion = SOFTWARE_VERSION;
	    	}
	    	function getContextPath(){
	    		var urlArray = window.location.href.split('/');
	    		var contextPath = urlArray[0] + '/' + urlArray[1] + '/' + urlArray[2] + '/' + urlArray[3];
	    		return contextPath;
	    	}
	    	function getParam(name){
    	        var search = document.location.search;
    	        var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
    	        var matcher = pattern.exec(search);
    	        var items = null;
    	        if(null != matcher){
    	                try{
    	                        items = decodeURIComponent(decodeURIComponent(matcher[1]));
    	                }catch(e){
    	                        try{
    	                                items = decodeURIComponent(matcher[1]);
    	                        }catch(e){
    	                                items = matcher[1];
    	                        }
    	                }
    	        }
    	        return items;
    		}
	    	var actCode=getParam("actCode");
	     	function login(){
	     		window.location.href = getContextPath()+'/welcome.jsp?actCode='+actCode+'&stbType=iptvbox&userId=' + userId 
	     				+ '&stbName='+stbName+'&stbVersion='+stbVersion;
	     	}
	    </script>
    </head>
    <body onload="javascript:login();">
    </body>
</html>