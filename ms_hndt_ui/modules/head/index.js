var $ = require("jquery"),
    layer = require("layer"),
    config = require("config"),
    template = require("artTemplate"),
    common = require("../common");
var headModule = {
    init:function(){
        headModule.getName();

        headModule.isShowInfo();

        //退出
        $("#logout").click(function(){
            headModule.logout();
        })
    },
    isFirstTime: function(){
        layer.msg("亲爱的用户，请您尽快点击右上角修改原始密码，填写支付信息，便于我们顺利为您结算收益哦~~");
    },
    getName:function(){
        if($.cookie("user") != null && $.cookie("user") != "null" && $.cookie("user")){
            var user = JSON.parse($.cookie("user"));
            var userName = user.userId;
            $("#headUserName").html(template("userData","工号"+userName+",欢迎您!"));
            if(user.pwd === user.userId){
                //判断新用户有无修改密码
                headModule.isFirstTime();
            }
        }
    },
    isShowInfo:function(){
        var local = window.location.href;
        if(local.indexOf("login") === -1){
            $(".info").show();
        }
    },
    logout:function(){
        layer.confirm('确定退出登录吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            $.cookie("user",null,{ path: '/'});
            window.location.href = "/login.html";
        }, function(index){
            layer.close(index);
        });
    }

};
module.exports = headModule;