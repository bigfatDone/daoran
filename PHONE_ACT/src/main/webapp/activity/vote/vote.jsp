<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="../../common/log.jsp"%>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <meta name="format-detection" content="telephone=no, email=no"/>
    <link rel="stylesheet" href="../../css/vote.css"/>
    <title>投票页</title>
</head>
<body>
<div class="big2">
    <div class="topWrap">
        <div class="top_logo"></div>
    </div>
    <div class="back1"></div>
    <div id="wrapper" class="contentBox">
        <!-- <div id="scroller"> -->
            <ul id="votelist" class="contentWrap">
				 
				 
            </ul>
        <!-- </div> -->
    </div>
</div>
<!--抽奖次数用完弹窗-->
<div class="over_pack" style="display: none;">
    <div class="over_img"><img src="../../images/vote/voteOver.jpg"></div>
    <div class="sure"></div>
</div>
<!--确认投票弹窗-->
<div class="sure_pack" style="display: none;">
    <div class="over_img"><img src="../../images/vote/sureVote.jpg"></div>
    <div class="sureNum"></div>
    <div class="sureBtn"></div>
    <div class="cancleBtn"></div>
</div>
<div class="imgzoom_pack" style="display: none;">
    <div class="imgzoom_x">X</div>
    <div class="imgzoom_img"><img class="pp" src=""></div>
</div>
<script src="../../js/zepto.js"></script>
<script src="../../js/scale.js"></script>
<script src="../../js/epg.js"></script>
<script>
var timer;
var cur_p = parseInt('${pb.cur}');
var total_p = parseInt('${pb.totalPage}');
var pageObj={
		numObj:null,
        voteContentData:[],
        init:function(){
            this.isShow=false;
            pageObj.getVoteContentData(1,function(){
            	pageObj.bindEvent();
            });
            $("#votelist").on('swipeup', function () {
            	var d=G('votelist');
           		 if(cur_p<total_p){
           			 cur_p=cur_p+1;
           			 pageObj.getVoteContentData(cur_p,function(p){
           				 pageObj.bindPageEvent(p);
           			 });
           		 }
            });  
            $(".sure").on("touchend",function(e){
            	setTimeout(function(){
            		$(".over_pack").hide();
            	},300);
            	
            });
            $('.back1').on('touchend',function(){
            	window.location.href=proUrl + '/activity/xydzp/index.jsp';
            })
            pageObj.sureVote();
        },
        getVoteContentData: function (page,callback) {
        	var self=this;
        	Epg.ajax({
        		url: proUrl + '/activity/vote/index.jsp',
        		data: {
        			"method":'toPage',
        			"cur": page
        		},
        		type: 'post',
        		dataType: 'html',
        		success:function(xhr, rsp){
        			 $("#votelist").append(rsp);
        		 	callback && callback(page);
        		},
        		error:function(xhr, rsp){}
        	});	
        	
        },
        sureVote:function(){
        	$('.sure_pack .sureBtn').on('touchend',function(){
        		var n=$('.sure_pack .sureNum').html();
	        	Epg.ajax({
	             		url: proUrl + '/activity/vote/index.jsp',
	             		data: {
	             			"method":'vote',
	             			"number":n
	             		},
	             		type: 'post',
	             		dataType: 'html',
	             		success:function(xhr, rsp){
	             		 	var datas=eval('('+rsp+')');
	             		 	if(parseInt(datas.status)==0){
	             		 		if(pageObj.numObj){
	             		 			var n=parseInt(pageObj.numObj.html());
	             		 			pageObj.numObj.html(n+1);
	             		 			$('.sure_pack').hide();
	             		 		}
	             		 	}else{
	             		 		$('.sure_pack').hide();
	             		 		$(".over_pack").show();
	             		 	}
	             		},
	             		error:function(xhr, rsp){}
	         	});	
        	});
        	$('.sure_pack .cancleBtn').on('touchend',function(){
        		setTimeout(function(){
        			$('.sure_pack').hide();
        		},300);
        	});
        },
        getLeftTimes:function(callback){
        	Epg.ajax({
         		url: proUrl + '/activity/vote/index.jsp',
         		data: {
         			"method":'getlefttimes'
         		},
         		type: 'post',
         		dataType: 'text',
         		success:function(xhr, rsp){
         		 	callback && callback(rsp);
         		},
         		error:function(xhr, rsp){}
     	});	
        },
        bindPageEvent:function(page){
        	 var voteDoms=$("#votelist  .vote");
             for (var i = (page-1)*6; i < voteDoms.length; i++) {
                 (function (x) {
                	   voteDoms.eq(x).on('touchend', function () {//投票事件
	                		 var num=voteDoms.eq(x).attr('value');
                	   		 pageObj.numObj=$("#votelist  .voteNum").eq(x);
                	   		pageObj.getLeftTimes(function(data){
                	   			if(parseInt(data)!=0){
                	   				$('.sure_pack').show();
        	                     	$('.sure_pack .sureNum').html(num);
                	   			}else{
                	   				$(".over_pack").show();
                	   			}
                	   		});
	                     });
                 })(i);
             }
             $(".pic img").on("click", function () {
                 $(".imgzoom_img>img").attr("src", $(this).attr("src"));
                 $(".imgzoom_img>img").css("marginTop", "-" + ($(this).height() / 2) + "px");
                 $(".imgzoom_pack").show();

             });
             $(".imgzoom_x").on("click", function () {
                 $(".imgzoom_pack").hide();
                 $(".imgzoom_img>img").attr("src", "");
             });

             window.ImagesZoom.init({
                 "elem": ".pic"
             });
        },
        bindEvent:function(){
        	 var self=this;
        	 
             document.addEventListener("backbutton", function(e){
                 if( $(".imgzoom_pack").css("display")=="block"){
                     e.preventDefault();
                     $(".imgzoom_pack").hide();
                     $(".imgzoom_img>img").attr("src", "");
                     return false;
                 }
             }, false);
            self.bindPageEvent(1);
        }
}

pageObj.init();
</script>
</body>
</html>