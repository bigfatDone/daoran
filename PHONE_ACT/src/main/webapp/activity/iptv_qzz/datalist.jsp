<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!-- start of 相框 -->
<c:if test="${pb.dataList[0] != null }">
<div id="" style="position:absolute; left:0px; top:0px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num0" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[0].number}</div>
		<div id="poll0" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[0].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo0" src="${imgUrl}${pb.dataList[0].imageVA}" width="173" height="162" /> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote0" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[1] != null }">
<div id="" style="position:absolute; left:287px; top:0px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num1" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[1].number}</div>
		<div id="poll1" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[1].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo1" src="${imgUrl}${pb.dataList[1].imageVA}" width="173" height="162"/> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote1" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[2] != null }">
<div id="" style="position:absolute; left:574px; top:0px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num2" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[2].number}</div>
		<div id="poll2" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[2].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo2" src="${imgUrl}${pb.dataList[2].imageVA}" width="173" height="162"/> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote2" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[3] != null }">
<div id="" style="position:absolute; left:861px; top:0px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num3" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[3].number}</div>
		<div id="poll3" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[3].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo3" src="${imgUrl}${pb.dataList[3].imageVA}" width="173" height="162"/> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote3" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[4] != null }">
<div id="" style="position:absolute; left:0px; top:259px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num4" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[4].number}</div>
		<div id="poll4" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[4].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo4" src="${imgUrl}${pb.dataList[4].imageVA}" width="173" height="162" /> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote4" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[5] != null }">
<div id="" style="position:absolute; left:287px; top:259px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num5" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[5].number}</div>
		<div id="poll5" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[5].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo5" src="${imgUrl}${pb.dataList[5].imageVA}" width="173" height="162"/> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote5" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[6] != null }">
<div id="" style="position:absolute; left:574px; top:259px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num6" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[6].number}</div>
		<div id="poll6" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[6].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo6" src="${imgUrl}${pb.dataList[6].imageVA}" width="173" height="162"/> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote6" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>
</c:if>

<c:if test="${pb.dataList[7] != null }">
<div id="" style="position:absolute; left:861px; top:259px;">
	<div style="position:absolute; width:207px; height:244px; background-image:url(../../images/iptv_qzz/photobg.png); background-repeat:no-repeat; z-index:50;">
		<div id="num7" style="position:absolute; height:25px; left:47px; top:6px; color:white; font-size:20px;">${pb.dataList[7].number}</div>
		<div id="poll7" style="position:absolute; height:25px; left:137px; top:6px; color:white; font-size:20px;">${pb.dataList[7].point}</div>
		<div style="position:absolute; width:173px; height:162px; left:17px; top:56px; z-index:55;">
			<img id="photo7" src="${imgUrl}${pb.dataList[7].imageVA}" width="173" height="162"/> 
		</div>
		<div style="position:absolute; left:48px; top:200px; z-index:60;">
			<img id="vote7" src="../../images/iptv_qzz/vote.png" width="112" height="42"/>
		</div>
	</div>
</div>	
</c:if><!-- end of 相框 -->

<!-- 页码 -->	
	<div style="position:absolute; width:140px; height:55px; left:355px; top:510px; color:#01487D;">
		<c:if test="${pb.cur <= 1 }">
			<img src="../../images/iptv_qzz/pre_off.png"/>
		</c:if>
		<c:if test="${pb.cur > 1 }">
			<img id="pre" src="../../images/iptv_qzz/pre.png"/>
		</c:if>
	</div>
	<div style="position:absolute; width:80px;height:50px; left:495px; top:518px;text-align:center;">
		<span style="font-weight:bold;font-size:25px;color:#01487D;">${pb.cur }/${pb.totalPage }</span>
	</div>
	<div style="position:absolute; width:140px; height:55px; left:580px; top:510px; ">
		<c:if test="${pb.cur >= pb.totalPage }">
			<img src="../../images/iptv_qzz/next_off.png"/>
		</c:if>
		<c:if test="${pb.cur < pb.totalPage }">
			<img id="next" src="../../images/iptv_qzz/next.png"/>
		</c:if>
	</div>	

<div id="cur_p" style="display:none" title="${pb.cur }"></div>
<div id="total_p" style="display:none" title="${pb.totalPage }"></div>