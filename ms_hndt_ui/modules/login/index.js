var $ = require("jquery"),
    layer = require("layer"),
    config = require("config"),
    common = require("../common"),
    cookie = require("cookie");
var loginModule = {
    init:function(){
        loginModule.enterKey();
        $("#loginBtn").click(function(){
            loginModule.postParame();
        })
    },
    postParame: function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var postData = {userId:username,pwd:password};
        if(username && password){
            common.ajax("post",config.login,postData,function(data){
                layer.msg("登录成功！");
                $.cookie("user",JSON.stringify(data.user));
                setTimeout(function(){
                    window.location.href = "/index.html";
                },300);
            })
        }else{
            layer.msg("请正确输入登陆账号和密码！");
        }
    },
    enterKey:function(){
        document.onkeydown = function(e){
            var ev = document.all ? window.event : e;
            if(ev.keyCode==13) {
                $('#loginBtn').click();
            }
        }
    }
};
module.exports = loginModule;