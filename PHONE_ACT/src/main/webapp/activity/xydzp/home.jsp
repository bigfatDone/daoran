<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="../../common/log.jsp"%>
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no,minimal-ui" />
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="format-detection" content="telephone=no, email=no"/>
    <link rel="stylesheet" href="../../css/style.css"/>
	<title>萌宝暑期乐</title>
	<script type="text/javascript" src="../../js/jquery-1.8.2.min.js"></script>
	<script type="text/javascript" src="../../js/epg.js"></script>
</head>

<body>
<div class="big">
	<div class="qrcode"><img width="100" height="100" src="../../images/xydzp/empty.png"></div>
    <div class="btnBox">
        <div class="btn1"><a href="./rule.html" target="_self"></a></div><!--活动规则-->
    </div>
    <div class="btnBox1">
        <div class="btn1"><a href="javascript:S('mywin_div');"></a></div><!--我的奖品-->
    </div>
    <!--转盘-->
    <div class="pan"><img width="100%" height="100%" src="../../images/xydzp/turntable.gif"></div>
    <!--指针-->
    <div class="pointer"><img id="zhizhen-0" style="display:block;" width="100%" height="100%" src="../../images/xydzp/zz001.png"></div>
    <div class="pointer"><img id="zhizhen-1" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz002.png"></div>
    <div class="pointer"><img id="zhizhen-2" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz003.png"></div>
    <div class="pointer"><img id="zhizhen-3" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz004.png"></div>
    <div class="pointer"><img id="zhizhen-4" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz005.png"></div>
    <div class="pointer"><img id="zhizhen-5" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz006.png"></div>
    <div class="pointer"><img id="zhizhen-6" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz007.png"></div>
    <div class="pointer"><img id="zhizhen-7" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz008.png"></div>
    <div class="pointer"><img id="zhizhen-8" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz009.png"></div>
    <div class="pointer"><img id="zhizhen-9" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz010.png"></div>
    <div class="pointer"><img id="zhizhen-10" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz011.png"></div>
    <div class="pointer"><img id="zhizhen-11" style="display:none;" width="100%" height="100%" src="../../images/xydzp/zz012.png"></div>
    <!--开始抽奖-->
    <div class="lotto_btn"><a href="javascript:toLottery();"></a></div>
    <!--剩余抽奖次数-->
    <div class="lotto_num" id="leftTimes">0</div>
    <!--投票入口-->
    <div class="vote_btn"><a href="javascript:toVote();" target="_self"></a></div>
</div>
<!--抽奖次数用完弹窗-->
<div class="imgzoom_pack" style="display: none;" id="noTimesdiv">
    <div class="imgzoom_img"><img src="../../images/xydzp/over.jpg"></div>
    <div class="sure"><a href="javascript:H('noTimesdiv');"></a></div>
</div>
<!--活动结束弹窗-->
<div class="imgzoom_pack" style="display:none ;" id="actover">
    <div class="imgzoom_img"><img src="../../images/xydzp/actOver.jpg"></div>
    <div class="sure"><a href="javascript:H('actover');"></a></div>
</div>
<!--中奖弹窗-->
 <div id="win_div" class="imgzoom_pack" style="display:none;">
    <div class="imgzoom_img"><img src="../../images/xydzp/in_phone.jpg"></div>
    <div class="wrize"><b>恭喜您获得：</b><b id="prizeName"></b></div>
    <div class="phone"><input id="phoneNum" type="text" /></div>
    <div class=addr><input id="addr" type="text" /></div>
    <div class="submit"><a href="javascript:addContact();"></a></div>
    <div class="errtip" id="errtip" style="display: none;">请输入正确的手机号码</div>
</div> 
<!-- <div id="win_div" class="imgzoom_pack" style="display:none;">
    <div class="imgzoom_img"><img src="../../images/xydzp/in_phone.jpg"></div>
    <div class="wrize"><b>恭喜您获得：</b><b id="prizeName"></b></div>
    <div class="phone"><input id="phoneNum" type="text" /></div>
    <div class="del"><a href="javascript:toDel();"></a></div>
    <div class="submit"><a href="javascript:addContact();"></a></div>
    <div class="errtip" id="errtip" style="display: none;">请输入正确的手机号码</div>
</div> -->

<!--我的奖品-->
<div id="mywin_div" class="imgzoom_pack" style="display:none;">
    <div class="imgzoom_img"><img src="../../images/xydzp/mywize.jpg"></div>
    <div class="btn_back"><a href="javascript:H('mywin_div');"></a></div>
    <div class="wrize1" id="awardName">${ownRecord.prizeName }</div>
    <div class="phone1" id="phone1Num">${phoneNum}</div>
    <div class="update"><a href="javascript:editContact();"></a></div>
    <div class="errtip" id="errtip1" style="display: none;">您还未中奖，不能修改手机号哦！</div>
</div>

<!--手机号弹窗-->
<div id="phone_div" class="imgzoom_pack" style="display:none;">
    <div class="imgzoom_img"><img src="../../images/xydzp/ed_phone.jpg"></div>
    <div class="phone2"><input id="phone2Num" type="text" /></div>
    <!-- <div class=addr><input id="addr" type="text" /></div> -->
    <div class="submit"><a href="javascript:addContact();"></a></div>
    <div class="errtip" id="errtip2" style="display: none;">请输入正确的手机号码</div>
</div>

<script>
		var leftTimes = '${leftTimes}';
		var prizeLevel = "0";
		var phoneNum = '${phoneNum}';
		var rotateType = 1;
		var getPrizeStatus = true;//必须等待转盘转动结束才能再次点击
		var clickstatus = 0;//点击状态，避免重复提交
		//转盘
		var lottery = {
				locationCount:12,//总共有多少个位置
				awardCount:6,	 //总共有多少个中奖位置
				timer:0,		 //setTimeout的ID，用clearTimeout清除
				beginSpeed:-50,	 //初始转动速度
				stopSpeed:300,   //停止转动速度
				nowSpeed:0,  	 //当前速度
				totalDegrees:0,	 //总度数
				nowDegrees:0,	 //当前位置度数
				unitDegrees:0,   //位置间隔度数
				totalUnit:0,	 //总步数
				cycle:4,		 //转动基本次数
				init:function(rotateType){
					this.totalDegrees = this.cycle*360 + rotateType*60;
					this.unitDegrees = parseInt(360/lottery.locationCount);
					this.nowSpeed = this.beginSpeed;
					this.totalUnit = parseInt(this.totalDegrees/this.unitDegrees);
				},
				reset:function(){
					this.nowSpeed = 0;
					this.totalDegrees = 0;
					this.nowDegrees = 0;
					this.totalUnit = 0;
				}
			};

		function roll(){
			var lastLookDegrees = parseInt(lottery.nowDegrees%360);
			var lastIndex = parseInt(lastLookDegrees/lottery.unitDegrees)
			lottery.nowDegrees = lottery.nowDegrees+lottery.unitDegrees;
			var lookDegrees = parseInt(lottery.nowDegrees%360);
			var index = parseInt(lookDegrees/lottery.unitDegrees)
			if(lottery.nowDegrees <= lottery.totalDegrees){
				H("zhizhen-"+lastIndex);
				S("zhizhen-"+index)
				var addSpeed = lottery.stopSpeed-lottery.beginSpeed;
				var unitSpeed = parseInt(addSpeed/lottery.totalUnit);
				lottery.nowSpeed = lottery.nowSpeed+unitSpeed;
				lottery.timer = setTimeout(roll,lottery.nowSpeed);
			}
			else{
				doLottery();
			}	
		}

		function doLottery(){//抽奖结果(转盘转动结束后)
			getPrizeStatus = true;
			if(rotateType == 0 || rotateType == 2 || rotateType == 4 || rotateType == 5){
				S('win_div');
			}
		}
		function toVote(){
			if(isExpire("2017/8/24")){
				window.location.href=proUrl+"/activity/winner/home.html";
			}else{
				window.location.href=proUrl+"/activity/vote/index.jsp";
			}
		}
		function isExpire(dateStr){
			var expireTime=dateStr;
			var d1 = new Date(Date.parse(expireTime));
			var d2=new Date();
			if(d2>d1){
				return true;
			}else{
				return false;
			}
		}
		function toLottery(){
			if(isExpire("2017/8/16")){
				S('actover');
			}else{
				toStart();
			}
		}
		function toStart(){//开始转盘	
			if(getPrizeStatus){
				if(parseInt(leftTimes) > 0){
					getPrizeStatus = false;
					getPrize(function(rsp){
						 var resultData = trimStr(rsp);
						 if(resultData != null && resultData != ''){
							 var resultDatas = resultData.split("|");
							 var lotteryCode = resultDatas[0];
							 var status = resultDatas[1];
							 leftTimes = resultDatas[3];
							 prizeLevel = resultDatas[4];
							 var prizeName = resultDatas[5];
							 G('leftTimes').innerHTML = leftTimes;
							 if(status == 1 && lotteryCode == 10000000){//中奖
								G('prizeName').innerHTML = prizeName;
								G('awardName').innerHTML = prizeName;
								if(prizeLevel == 1){
									rotateType = 2;
								}else if(prizeLevel == 2){
									rotateType = 5;
								}else if(prizeLevel == 3){
									rotateType = 4;
								}else{
									rotateType = 0;
								}
								winning();
							 }else{//未中
								 losing();
							 }
						 }else{
							 losing();
						 }
					});
				 }else{
					 noTime();
				 }
			 }
		}

		function winning(){
			lottery.reset();
			lottery.init(rotateType);
			roll();
		}

		function losing(){//不中奖
			var losingCodeArray = [1,3];
			var losingCode = losingCodeArray[Math.floor(Math.random() * losingCodeArray.length)];
			rotateType = losingCode;
			lottery.reset();
			lottery.init(rotateType);
			roll();
		}
		
		function getPrize(callback){//抽奖
 			 Epg.ajax({
				url: proUrl + '/activity/xydzp/index.jsp',
				data: {
					'method': 'getprize',
				},
				type: 'post',
				dataType: 'html',
				success:function(xhr, rsp){
					callback && callback(rsp);
				},
				error:function(xhr, rsp){}
			});  
		}
		
		function noTime(){//机会用完弹窗
			S('noTimesdiv');
		}
		
		//添加或修改联系方式
		function addContact(){
			var contact = G('phone2Num').value;
			var addr='';
			if(G('win_div').style.display != 'none'){
				contact = G('phoneNum').value;
				addr= G('addr').value;
			}
			if( !(/^1(3|4|5|7|8)\d{9}$/.test(contact))){
				S('errtip');
				S('errtip2');
				return;
			}
		 	if(clickstatus == 0 && contact.length > 0){
		 		clickstatus = 1;
		 		Epg.ajax({
		 			url: proUrl + '/activity/xydzp/index.jsp',
					data: {
						'method': 'addcontact',
						'contact':contact,
						'addr':addr
					},
					type: 'post',
					dataType: 'html',
					success:function(xhr, rsp){
						clickstatus = 0;
						if(trimStr(rsp) == "success"){
								H('win_div');
								H('mywin_div');
								H('phone_div');
								H('errtip');
								H('errtip1');
								H('errtip2');
								G('phone1Num').innerHTML = contact;
						}
					},
					error:function(xhr, rsp){
						H('errtip');
						H('errtip1');
						H('errtip2');
						H('phone_div');
					}
				})	;
		 	}
		 }
		
		function editContact(){
			if(prizeLevel == "0" && '${hasWin}' == '0'){
				S('errtip1');
				setTimeout(function(){
					H('errtip1');
				}, 3000);
			}else{
				S('phone_div');
			}
		}
		
		function toDel(){//中奖回删
			if(trimStr(G("phoneNum").value).length > 0){
				G("phoneNum").value = trimStr(G("phoneNum").value).substring(0,trimStr(G("phoneNum").value).length-1);
			}
			G('phoneNum').focus();
		}
</script>
</body>
</html>
