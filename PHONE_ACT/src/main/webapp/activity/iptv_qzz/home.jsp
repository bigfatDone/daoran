<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="../../common/log.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>最美亲子照</title>
<script type="text/javascript" src="../../js/ygd_bt.js"></script>
<script type="text/javascript">
var leftTimes = ${leftTimes};
var voteId = 'vote0';
var cur_p = parseInt('${pb.cur}');
var total_p = parseInt('${pb.totalPage}');

function pageBack(){ //返回
	window.history.go(-1); //返回大转盘，但不能刷新票数（如果第一、二名被投票）
}

var buttons = [
	{id:'back', action:pageBack, left:'', right:'', up:'', down:'', linkImage:'../../images/iptv_qzz/back.png', focusImage:'../../images/iptv_qzz/back_focus.png', focusHandler:myFocus},
	{id:'vote0', action:toVote, left:'', right:'vote1', up:'back', down:['vote4','pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'0'},
	{id:'vote1', action:toVote, left:'vote0', right:'vote2', up:'back', down:['vote5','pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'1'},
	{id:'vote2', action:toVote, left:'vote1', right:'vote3', up:'back', down:['vote6','pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'2'},
	{id:'vote3', action:toVote, left:'vote2', right:'', up:'back', down:['vote7','pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'3'},
	{id:'vote4', action:toVote, left:'', right:'vote5', up:'vote0', down:['pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'4'},
	{id:'vote5', action:toVote, left:'vote4', right:'vote6', up:'vote1', down:['pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'5'},
	{id:'vote6', action:toVote, left:'vote5', right:'vote7', up:'vote2', down:['pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'6'},
	{id:'vote7', action:toVote, left:'vote6', right:'', up:'vote3', down:['pre','next'], linkImage:'../../images/iptv_qzz/vote.png', focusImage:'../../images/iptv_qzz/vote_focus.png', num:'7'},
	{id:'back1', action:noTime, left:'confirm', right:'confirm', up:'confirm', down:'confirm', linkImage:'../../images/iptv_qzz/back.png', focusImage:'../../images/iptv_qzz/back_focus.png'},
	{id:'confirm', action:noTime, left:'back1', right:'back1', up:'back1', down:'back1', linkImage:'../../images/iptv_qzz/confirm.png', focusImage:'../../images/iptv_qzz/confirm_focus.png'},
	{id:'pre', action:pre, left:'', right:'next', up:'', down:'', linkImage:'../../images/iptv_qzz/pre.png', focusImage:'../../images/iptv_qzz/pre_focus.png', focusHandler:myFocus0},
	{id:'next', action:next, left:'pre', right:'', up:'', down:'', linkImage:'../../images/iptv_qzz/next.png', focusImage:'../../images/iptv_qzz/next_focus.png', focusHandler:myFocus0}
	];

function toVote(){//投票
	var num = Epg.Button.current.num;
	var number = G('num' + num).innerHTML;
	var poll = G('poll' + num).innerHTML;
	var leftTime = G('leftTimes').innerHTML;
	if(leftTime > 0){
		lottery(number,function(rsp){
			var datas = rsp.split("|");
			var voteCode = datas[0];
			leftTimes = datas[1];
			if(voteCode == '10000000'){
				G('leftTimes').innerHTML = leftTimes;
				G('poll' + num).innerHTML = 1 + parseInt(poll);
			}
		});
	}else{
		voteId = Epg.Button.current.id;
		noTime();
	}
}

function pre(){
	cur_p = parseInt(G("cur_p").getAttribute("title"));
	toPage(cur_p - 1, 'pre');
}

function next(){
	cur_p = parseInt(G("cur_p").getAttribute("title"));
	toPage(cur_p + 1, 'next');
}

function toPage(cur,to){
	Epg.ajax({
		url: 'index.jsp',
		data: {
			"method":'toPage',
			"cur": cur
		},
		type: 'post',
		dataType: 'html',
		success:function(xhr, rsp){
			G("datalist").innerHTML = rsp;
			cur_p = parseInt(G("cur_p").getAttribute("title"));
		 	total_p = parseInt(G("total_p").getAttribute("title"));	
		 	if( (to == 'next' && cur_p < total_p) || (to == 'pre' && cur_p <= 1) ){
				Epg.Button.init({defaultButtonId:['next'], buttons:buttons, eager:true});
			}else { 
				Epg.Button.init({defaultButtonId:['pre'], buttons:buttons, eager:true});
			}
		},
		error:function(xhr, rsp){}
	});	
}

function lottery(number,callback){
	if(number){
		Epg.ajax({
			url: 'index.jsp',
			data: {
				"method":'vote',
				"number": number
			},
			type: 'post',
			dataType: 'html',
			success:function(xhr, rsp){
				callback && callback(rsp);
			},
			error:function(xhr, rsp){}
		});
	}
}

var preId = 'vote0';
function myFocus(){//back向下聚焦调整
	var pId = Epg.Button.previous.id;
	if(pId != 'back'){
		preId = pId;
	}
	Epg.Button.get('back').down = preId;
}

var preid = 'vote0';
function myFocus0(){//pre、next翻页向上聚焦调整
	var upId = ['vote7','vote6','vote5','vote4','vote3','vote2','vote1','vote0'];
	var cid = Epg.Button.current.id;
	var pId = upId;
	if(Epg.Button.previous){
		pId = Epg.Button.previous.id;
	}
	if(pId != cid && pId != 'pre' && pId != 'next'){
		preid = pId;
	}
	if(G(preid) || cur_p != total_p){
		Epg.Button.get(cid).up = preid;
	}else{
		Epg.Button.get(cid).up = upId;
	}
}

function noTime(){//机会用完弹窗
	if(G('noTimesdiv').style.display == 'block'){
		H('layerdiv');
		H('noTimesdiv');
		Epg.Button.set(voteId);
	}else{
		S('layerdiv');
		S('noTimesdiv');
		Epg.Button.set('confirm');
	}
}
</script>
</head>
<body style="margin:0; padding:0; background:transparent; width:1280px; height:720px; background-image:url(../../images/iptv_qzz/bg.jpg); background-repeat: no-repeat;">
<div style="position:absolute; left:1190px; top:40px; width:53px; height:53px">
    <img id="back" src="../../images/iptv_qzz/back.png"/>
</div>

<div id="datalist" style="position:absolute; left:106px; top:115px;">
	<%@ include file="datalist.jsp"%>
</div>

<!-- 弹窗 -->
<div id="layerdiv" style="position:absolute; display:none; width:1280px; height:720px; background-image:url(../../images/iptv_qzz/layer_bg.png); background-repeat:no-repeat; z-index:150;">
	<!-- 机会已用完 -->
	<div id="noTimesdiv" style="position:absolute; display:none; left:238px; top:181px; width:805px; height:307px; background-image:url(../../images/iptv_qzz/notimes.jpg); background-repeat:no-repeat; z-index:250;">
		<div style="position:absolute; left:718px; top:35px; width:53px; height:53px; z-index:260;">
			<img id="back1" src="../../images/iptv_qzz/back.png"/>
		</div>
		<div style="position:absolute; left:320px; top:185px; width:171px; height:63px; z-index:260;">
    		<img id="confirm" src="../../images/iptv_qzz/confirm.png"/>
		</div>
	</div>
</div>

<div style="position:absolute; left:550px; top:675px; font-size:25px; color:#01487D;">
	剩余投票次数：<span id="leftTimes" style="position:relative; top:1px;">${leftTimes}</span>
</div>
</body>
<script type="text/javascript">
Epg.eventHandler = function(keyCode){
	if(keyCode == KEY_BACK || keyCode == KEY_EXT){
 		pageBack();
 		return false;
	}else if(keyCode == KEY_RIGHT){
		Epg.Button.move('right');
	}else if(keyCode == KEY_LEFT){
		Epg.Button.move('left');
	}else if(keyCode == KEY_UP){
		Epg.Button.move('up');
	}else if(keyCode == KEY_DOWN){
		Epg.Button.move('down');
	}else if(keyCode == KEY_ENTER){
		Epg.Button.click();
	}
};

Epg.Button.init({defaultButtonId:['vote0','back'], buttons:buttons, eager:true});
</script>
</html>