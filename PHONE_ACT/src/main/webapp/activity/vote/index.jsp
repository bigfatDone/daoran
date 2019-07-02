<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../common/act_config.jsp"%>
<%!
private String actCode = "qzz";

public void index(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	if(userId == null || userId.length() <= 0){
		response.sendRedirect(EPG_URL+"/xydzp/saoma.html");
		return;
	}
	UserActInfoGetResponse actInfo = getUserActInfo( actCode, 0, userId);
	VoteInfoGetResponse resp = getUserActInfo(actCode, 0, 6);
	request.setAttribute("leftTimes", actInfo.getUserAct().getLeftTimes());
	request.setAttribute("imgUrl", IMG_URL);
	request.setAttribute("pb", resp.getPb());
	System.out.println(JsonUtil.toString(resp));
	request.getRequestDispatcher("vote.jsp").forward(request, response);
}
public void getLeftTimes(HttpServletRequest request, HttpServletResponse response)throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	UserActInfoGetResponse actInfo = getUserActInfo( actCode, 0, userId);
	//System.out.println(userId+"==="+actInfo.getUserAct().getLeftTimes());
	PrintWriter out = response.getWriter();
	out.write(""+actInfo.getUserAct().getLeftTimes());
	out.flush();
}

//翻页
public void getDataList(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();		
	int cur = HttpUtil.getInt(request, "cur", 1);
	VoteInfoGetResponse resp = getUserActInfo(actCode, cur,6);
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
	//System.out.println(JsonUtil.toString(resp));
	PrintWriter ou = response.getWriter();
	ou.write(JsonUtil.toString(resp));
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
else if("getlefttimes".equals(method)){
	getLeftTimes(request, response);
}
else{
	index(request, response);
}
%>