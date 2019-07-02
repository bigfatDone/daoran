<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="common/act_config.jsp" %>
<%
	//用户ID
	String userId = HttpUtil.getString(request, "userId", "");

	//1：正常入口
	String entryId = HttpUtil.getString(request, "entryId", "01");
	
	//机顶盒信息
	String stbType = HttpUtil.getString(request, "stbType", "phone");
	String stbVersion = HttpUtil.getString(request, "stbVersion", "");
	String stbName = HttpUtil.getString(request, "stbName", "");
	
	String actCode =  HttpUtil.getString(request, "actCode", "");
	
	request.setAttribute("actCode", actCode);

	UserStore store = new UserStore(request, response);
	store.setUserId(userId);
	store.setEntryId(entryId);
	store.setPid(province);
	store.setStbName(stbName);
	store.setStbType(stbType);
	store.setStbVersion(stbVersion);
	
	if(LogTimer.RUN_STATUS == 0){
		LogTimer.timer();
	}
	
%>

<script type="text/javascript">
	var actcode = "${actCode}";
	if(actcode == "xydzp"){
		window.location.href = "<%=EPG_URL%>activity/xydzp/index.jsp";
	}
	else if(actcode == "qzz"){
		window.location.href = "<%=EPG_URL%>activity/iptv_qzz/index.jsp";
	}else if(actcode =="lxsjsg"){
		window.location.href = "<%=EPG_URL%>activity/lxsjsg/home.jsp";
	}
	else{
		window.location.href = "<%=EPG_URL%>activity/xydzp/index.jsp";
	}
</script>