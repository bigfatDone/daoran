 <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:if test="${pb.dataList[0] != null }">
 <li class="item">
     <div class="content_left">
         <div class="number">${pb.dataList[0].number }</div>
         <div class="voteNum">${pb.dataList[0].point }</div>
         <div class="pic"><img width="100%" height="100%" src="${imgUrl }${pb.dataList[0].imageVA }"></div>
         <div class="vote" value="${pb.dataList[0].number }"></div>
     </div>
     <c:if test="${pb.dataList[1] != null }">
     <div class="content_right">
         <div class="number">${pb.dataList[1].number }</div>
         <div class="voteNum">${pb.dataList[1].point }</div>
         <div class="pic"><img width="100%" height="100%" src="${imgUrl }${pb.dataList[1].imageVA }"></div>
         <div class="vote" value="${pb.dataList[1].number }"></div>
     </div>
     </c:if>
 </li>
 </c:if>
 <c:if test="${pb.dataList[2] != null }">
 <li class="item">
     <div class="content_left">
         <div class="number">${pb.dataList[2].number }</div>
         <div class="voteNum">${pb.dataList[2].point }</div>
         <div class="pic"><img width="100%" height="100%" src="${imgUrl }${pb.dataList[2].imageVA }"></div>
         <div class="vote" value="${pb.dataList[2].number }"></div>
     </div>
     <c:if test="${pb.dataList[3] != null }">
	     <div class="content_right">
	         <div class="number">${pb.dataList[3].number }</div>
	         <div class="voteNum">${pb.dataList[3].point }</div>
	         <div class="pic"><img width="100%" height="100%" src="${imgUrl }${pb.dataList[3].imageVA }"></div>
	         <div class="vote" value="${pb.dataList[3].number }"></div>
	     </div>
     </c:if>
 </li>
 </c:if>
 <c:if test="${pb.dataList[4] != null }">
 <li class="item">
     <div class="content_left">
         <div class="number">${pb.dataList[4].number }</div>
         <div class="voteNum">${pb.dataList[4].point }</div>
         <div class="pic"><img width="100%" height="100%" src="${imgUrl }${pb.dataList[4].imageVA }"></div>
         <div class="vote" value="${pb.dataList[4].number }"></div>
     </div>
     <c:if test="${pb.dataList[5] != null }">
	     <div class="content_right">
	         <div class="number">${pb.dataList[5].number }</div>
	         <div class="voteNum">${pb.dataList[5].point }</div>
	         <div class="pic"><img width="100%" height="100%" src="${imgUrl }${pb.dataList[5].imageVA }"></div>
	         <div class="vote" value="${pb.dataList[5].number }"></div>
	     </div>
     </c:if>
 </li>
 </c:if>