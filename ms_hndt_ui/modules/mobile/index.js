var $ = require("jquery"),
    layer = require("layer"),
    config = require("config");
var mobileModule = {
    init:function(){
        $("#submit").click(function(){
            mobileModule.validate();
        });

        mobileModule.close();
    },
    validate:function(){
        var localUrl = window.location.search;
        var areaCode = "";
        if(localUrl.indexOf("areaCode=") != -1){
            areaCode = localUrl.split("areaCode=")[1];
        }else{
            layer.msg("请从正确的网址进入！");
        };
        var custKey  = $("#itv").val();
        var userId = $("#userId").val();
        var proCode = $("#proCode").val();
        var reg = /^3(\d{13}|\d{17})$/;
        if(!reg.test(custKey)){
            layer.msg("请输入正确的itv账号！");
        }else{
            var postData = {userId:userId,source:5,proCode:proCode,custKey:custKey,areaCode:areaCode};
            mobileModule.postParame(postData);
        }
    },
    close:function(){
        $("#dialog #close").click(function(){
            $("#dialog").fadeOut();
            $("#itv,#userId").val("");
        })
    },
    layerIndex:0,
    postParame:function(postData){
        $.ajax({
            type: "post",
            url: config.host+config.saveOrder,
            timeout:5000,
            contentType:"application/json;charset=utf-8",
            headers:config.ajaxHeads,
            beforeSend:function(){
                mobileModule.layerIndex = layer.load(1, {
                    shade: [0.6,'#333'] //0.1透明度的白色背景
                })
            },
            data: JSON.stringify(postData),
            success: function(data){
                mobileModule.postCallback();
            },
            error:function(data){
                mobileModule.postCallback();
            }
        });
    },
    postCallback:function(){
        setTimeout(function(){
            layer.close(mobileModule.layerIndex);
            $("#dialog").show();
        },300);
    }
};
module.exports = mobileModule;