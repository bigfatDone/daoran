<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="../../common/log.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>乐享双节时光</title>
<script type="text/javascript" src="../../js/ygd_bt.js"></script>
</head>
<body style="margin:0; padding:0; width:1280px; height:720px;">
	<div id="main_div" style="position:absolute;left:0px;top:0px;width:1280px; height:720px; background:url(../../images/lxsjsg/bg.jpg) no-repeat;display:block;">
		<div style="position:absolute;left:1190px;top:20px;width:67px;height:67px;"><img id="close"  src="../../images/lxsjsg/close.png"></div>
		<div style="position:absolute;left:1085px;top:86px;width:183px;height:67px;"><img id="introduce"  src="../../images/lxsjsg/introduce.png"></div>
		<div style="position:absolute;left:116px;top:272px;width:304px;height:386px;"><img id="pic0"  src="../../images/lxsjsg/pic0.png" /></div>
		<div style="position:absolute;left:525px;top:272px;width:283px;height:389px;"><img  id="pic1" src="../../images/lxsjsg/pic1.png" /></div>
	</div>
	<div id="introduce_div" style="position:absolute;left:0px;top:0px;width:1280px; height:720px; background:url(../../images/lxsjsg/introduce_bg.jpg) no-repeat;display:none;">
		<div style="position:absolute;left:1190px;top:20px;width:67px;height:67px;"><img id="introduceClose"  src="../../images/lxsjsg/close.png"></div>
	</div>
</body>
<script type="text/javascript">
var buttons = [
{id:'close', action:pageBack, left:'', right:'', up:'', down:'introduce', linkImage:'../../images/lxsjsg/close.png', focusImage:'../../images/lxsjsg/close_on.png'},
{id:'introduce', action:toPage, left:'', right:'', up:'close', down:'pic0', linkImage:'../../images/lxsjsg/introduce.png', focusImage:'../../images/lxsjsg/introduce_on.png'},
{id:'pic0', action:toPage, left:'', right:'pic1', up:'introduce', down:'', linkImage:'../../images/lxsjsg/pic0.png', focusImage:'../../images/lxsjsg/pic0_on.png'},
{id:'pic1', action:toPage, left:'pic0', right:'', up:'introduce', down:'', linkImage:'../../images/lxsjsg/pic1.png', focusImage:'../../images/lxsjsg/pic1_on.png'},
{id:'introduceClose', action:toPage, left:'', right:'', up:'', down:'', linkImage:'../../images/lxsjsg/close.png', focusImage:'../../images/lxsjsg/close_on.png'}
];
function pageBack(){
	//进入乐享音乐
	window.location.href="http://172.16.147.163/epg/welcome.jsp?protal=16";
}
function toPage(){
	if(Epg.Button.current.id=="introduce"){
		H('main_div');
		S('introduce_div');
		Epg.Button.set('introduceClose');
	}else if(Epg.Button.current.id=="pic0"){
		//进入萌宝星空“欢乐捕鱼”活动
		window.location.href="http://172.16.147.163:83/epg_mbxk/login.jsp?protal=9";
	}else if(Epg.Button.current.id=="pic1"){
		//进入乐享音乐“植物大战僵尸”活动
		window.location.href="http://172.16.147.163/epg/welcome.jsp?protal=16";
	}else if(Epg.Button.current.id=="introduceClose"){
		S('main_div');
		H('introduce_div');
		Epg.Button.set('pic0');
	}
}
Epg.eventHandler = function(keyCode){
	if(keyCode == KEY_BACK || keyCode == KEY_EXT){
		if(G('introduce_div').style.display=="block"){
			S('main_div');
			H('introduce_div');
			Epg.Button.set('pic0');
		}else{
			pageBack();
		}
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
Epg.Button.init({defaultButtonId:['pic0'], buttons:buttons, eager:true});
</script>
</html>
