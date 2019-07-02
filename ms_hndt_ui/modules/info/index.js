var $ = require("jquery"),
    config = require("config"),
    cookie = require("cookie"),
    common = require("../common");
var infoModule = {
    init: function(){
        infoModule.getInfo();

        //银行卡保存
        $("#accountSave").click(function(){
            infoModule.validate("account");
        })
        //支付宝保存
        $("#alipaySave").click(function(){
            infoModule.validate("alipay");
        })

        //点击修改
        infoModule.modify();
    },
    getInfo:function(){
        common.hasUserCookie(function(user){
            if(user.alipay != "" && user.alipay != null && user.alipay != undefined){
                $("#alipayModify").removeClass("hidden");
                $("#alipay").val(user.alipay);
            }else{
                $("#alipay").removeAttr("disabled");
                $("#alipaySave").removeClass("hidden");
            }
            if(user.account != "" && user.account != null && user.account != undefined){
                $("#accountModify").removeClass("hidden");
                $("#userName").val(user.userName);
                $("#account").val(user.account);
                $("#openBank").val(user.openBank);
            }else{
                $("#userName,#account,#openBank").removeAttr("disabled");
                $("#accountSave").removeClass("hidden");
            }
        })
    },
    modify:function(){
        $("#accountModify").click(function(){
            $("#accountForm").find("input").removeAttr("disabled");
            $("#accountForm #accountModify").hide();
            $("#accountForm #accountSave").show().removeClass("hidden");
        });
        $("#alipayForm").click(function(){
            $("#alipayForm").find("input").removeAttr("disabled");
            $("#alipayForm #alipayModify").hide();
            $("#alipayForm #alipaySave").show().removeClass("hidden");
        });
    },
    validate:function(text){
        var postData = {};
        if(text === "account"){
            var userName = $("#userName").val();
            var account = $("#account").val();
            var openBank = $("#openBank").val();
            if(!userName || !account || !openBank){
                layer.msg("请将信息填写完整！");
                return false;
            }else{
                postData = {userName:userName,account:account,openBank:openBank};
            }
        }else if(text === "alipay"){
            var alipay = $("#alipay").val();
            if(!alipay){
                layer.msg("请将信息填写完整！");
                return false;
            }else{
                postData = {alipay:alipay};
            }
        }
        infoModule.postParame(postData,text);
    },
    postParame:function(postData,text){
        common.ajax("post",config.infoUpdate,postData,function(data){
            $.cookie("user",JSON.stringify(data.user),{ path: '/', expires: 10 });
            infoModule.requestCallback(text);
        });
    },
    requestCallback:function(text){
        if(text === "account"){
            $("#userName,#account,#openBank").attr("disabled","disabled");
            $("#accountModify").show();
            $("#accountSave").hide();
        }else if(text === "alipay"){
            $("#alipay").attr("disabled","disabled");
            $("#alipayModify").show();
            $("#alipaySave").hide();
        }
    }
};
module.exports = infoModule;