<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.iptv.epg.store.*" %>
<%@ page import="com.iptv.epg.util.*" %>
<%@ page import="com.iptv.epg.vo.*" %>
<%@ page import="com.dr.iptv.util.*" %>
<%@ include file="act_constant.jsp"%>
<%
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
    String uri = request.getRequestURI();  
    
    if(userId != null && userId.length() > 0){
    	LogVo logVo=new LogVo();
  	    logVo.setDateTime(DateUtil.getNow());
  	    logVo.setUserId(userId);
  	    logVo.setEntryId(userStore.getEntryId());
  	    logVo.setAccessPath(uri);
  	    logVo.setpId(userStore.getPid());
  	    logVo.setStbName(userStore.getStbName());
  	    logVo.setStbType(userStore.getStbType());
  	    logVo.setStbVersion(userStore.getStbVersion());
        LogUtil.log(JsonUtils.toString(logVo));
    }
%>
