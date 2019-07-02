<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../common/act_config.jsp"%>
<%!
private String actCode = "qzz";

public void index(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	
	UserActInfoGetResponse actInfo = getUserActInfo( actCode, 0, userId);
	
	VoteInfoGetResponse resp = getUserActInfo(actCode, 0, 8);
	
	request.setAttribute("leftTimes", actInfo.getUserAct().getLeftTimes());
	request.setAttribute("imgUrl", IMG_URL);
	request.setAttribute("pb", resp.getPb());
	
	request.getRequestDispatcher("home.jsp").forward(request, response);
}

//翻页
public void getDataList(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();		
	int cur = HttpUtil.getInt(request, "cur", 1);
	
	VoteInfoGetResponse resp = getUserActInfo(actCode, cur, 8);
	
	request.setAttribute("imgUrl", IMG_URL);
	request.setAttribute("pb",resp.getPb());
	request.getRequestDispatcher("datalist.jsp").forward(request, response);
}

//投票
public void lottery(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	String number = HttpUtil.getString(request, "number", "");
	
	VoteResponse resp = lottery( actCode, number, userId);
	
	String result = resp.getCode() + "|" +  resp.getLeftTimes();
	PrintWriter ou = response.getWriter();
	ou.write(result);
	ou.flush();
} 
%>
<%
String method = request.getParameter("method");
if("vote".equals(method)){
	lottery(request, response);
}
else if("toPage".equals(method)){
	getDataList(request, response);
}
else{
	index(request, response);
}
%>