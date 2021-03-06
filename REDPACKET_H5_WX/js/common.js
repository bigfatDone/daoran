﻿var apiUrl = window.location.origin + '/API_AOP';

var config = {
    payStyle: 'wx',
    actCode: 'redPackage',
    nodeCode: '021200'
}

$(function(){

    // 页面响应式
    toResize();
    $(window).resize(function() {
        toResize();
    });

})

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function toResize() {
    var winW = $(window).width();
    var maxW = 640;
    if(winW > maxW){
        winW = maxW;
    }
    $("html").css({"font-size": winW / 400 * 13 + "px"});
};

function ajaxFun (url,params,successCallback){
    $.ajax({
        type: 'POST',
        url: apiUrl + url,
        data: params,
        timeout: 50000,
        datType: "json",
        contentType: "application/json; charset=UTF-8",
        success:function(data){
            if(data.code === 10000000){
                successCallback(data);
            } else {
                setTimeout(function(){
                    window.location.href = 'error.html';
                },2500);
            }
        },error:function(error){
            setTimeout(function(){
                window.location.href = 'error.html';
            },2500);
        }
    })
}

function forbid(){
    /* begin禁用微信分享功能 */
    function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
    }

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
    /* end禁用微信分享功能 */

    // 对浏览器的UserAgent进行正则匹配，不含有微信独有标识的则为其他浏览器
    var useragent = navigator.userAgent;
    if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
        // 这里警告框会阻塞当前页面继续加载
        // 以下代码是用javascript强行关闭当前页面
        // var opened = window.open('about:blank', '_self');
        /*opened.opener = null;
        opened.close();*/
    }
    else{
        window.alert = function(name){
            var iframe = document.createElement("IFRAME");
            iframe.style.display="none";
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(name);
            iframe.parentNode.removeChild(iframe);
        }
    }

}