<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="common/act_config.jsp" %>

<%	
	//用户ID
	String userId = HttpUtil.getString(request, "openid", "");

	String entryId = HttpUtil.getString(request, "EntryId", "1");
	
	String actCode =  HttpUtil.getString(request, "ActCode", "");
	if("".equals(userId)){
		String ip = getIpAddr(request);
		userId = ip;
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="js/mobile-detect.min.js"></script>
<script type="text/javascript">
	//判断数组中是否包含某字符串  
    Array.prototype.contains = function(needle) {  
        for (i in this) {  
            if (this[i].indexOf(needle) > 0)  
                return i;  
        }  
        return -1;  
    } 
	var device_type = navigator.userAgent;//获取userAgent信息  
    var md = new MobileDetect(device_type);//初始化mobile-detect  
    var os = md.os();//获取系统  
    var model = "";  
    if (os == "iOS") {//ios系统的处理  
        os = md.os() + md.version("iPhone");  
        model = md.mobile();  
    } else if (os == "AndroidOS") {//Android系统的处理  
        os = md.os() + md.version("Android");  
        var sss = device_type.split(";");  
        var i = sss.contains("Build/");  
        if (i > -1) {  
            model = sss[i].substring(0, sss[i].indexOf("Build/"));  
        }  
    } 
	function getContextPath(){
		var urlArray = window.location.href.split('/');
		var contextPath = urlArray[0] + '/' + urlArray[1] + '/' + urlArray[2] + '/' + urlArray[3];
		return contextPath;
	}
	window.location.href = getContextPath()+"/welcome.jsp?userId=<%=userId%>&entryId=<%=entryId%>"
		+"&actCode=<%=actCode%>&stbVersion="+os +"&stbType="+model;
	
</script>
</head>
<body>
</body>
</html>