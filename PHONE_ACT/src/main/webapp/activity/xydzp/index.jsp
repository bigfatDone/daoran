<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../common/act_config.jsp"%>

<%!

private String actCode = "xydzp";
private String project = "mbxk";

public void index(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	if(userId == null || userId.length() <= 0){
		response.sendRedirect("saoma.html");
		return;
	}
	//获取活动信息
	UserActInfoGetResponse userActInfo = getUserActInfo(userId, actCode, 0);
	//request.setAttribute("leftTimes", userActInfo.getUserAct().getLeftTimes());
	//request.setAttribute("phoneNum", userActInfo.getUserAct().getTel());
	//自己的中奖信息
 	WinInfoGetResponse ownRecordRes = getWinInfos(userId, actCode, 1);
	List<WinInfo> ownWin = ownRecordRes.getWinInfos();
	if(ownWin != null && ownWin.size() > 0){
		request.setAttribute("ownRecord", ownWin.get(0));
		request.setAttribute("hasWin", "1");
	}else{
		request.setAttribute("ownRecord", new WinInfo());
		request.setAttribute("hasWin", "0");
	}
	request.getRequestDispatcher("home.jsp").forward(request, response);
	
}

public void getPrize(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	
	LotteryResponse lotteryResponse = lottery(userId, actCode);
	
	String result = lotteryResponse.getCode()+"|"+ lotteryResponse.getStatus()+"|"+lotteryResponse.getRecId()+"|"+lotteryResponse.getLeftTimes() 
			+ "|" + lotteryResponse.getPrizeLevel() + "|" + lotteryResponse.getPrizeName();
	PrintWriter out = response.getWriter();
	out.write(result);
	out.flush();
	
}

public void doContact(HttpServletRequest request, HttpServletResponse response) throws Exception{
	UserStore userStore = new UserStore(request, response);
	String userId = userStore.getUserId();
	String contact = HttpUtil.getString(request, "contact", "");
	String addr = HttpUtil.getString(request, "addr", "");
	if(addr != null && addr.length() > 0){
		try{
			addr = new String(addr.getBytes("ISO-8859-1"), "UTF-8");
		}catch(Exception e){
		}
	}
	ContactsAddResponse res = addContacts(userId, actCode, contact, addr);
	PrintWriter out = response.getWriter();
	if(res.getCode() == 10000000){
		out.write("success");
		out.flush();
	}else{
		out.write("error");
		out.flush();
	}		
} 

%>
<%
String method = request.getParameter("method");
if("addcontact".equals(method)){
	doContact(request, response);
}else if("getprize".equals(method)){
	getPrize(request, response);
}else{
	index(request, response);
}
%>