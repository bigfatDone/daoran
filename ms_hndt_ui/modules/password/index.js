var $ = require("jquery"),
    layer = require("layer"),
    cookie = require("cookie"),
    common = require("../common"),
    config = require("config"),
    template = require("artTemplate");
var passwordModule = {
        init: function(){
            $("#save").click(function(){
                passwordModule.validate();
            })
        },
        validate:function(){
            var user = {};
            common.hasUserCookie(function(user){
                user = user;
                var old = $("#oldPwd").val();
                var pwd = $("#pwd").val();
                var pwd2 = $("#pwd2").val();
                if(!old || !pwd || !pwd2){
                    layer.msg("请输入完整！");
                    return false;
                }else if(old !== user.pwd){
                    layer.msg("旧密码输入错误！");
                    return false;
                }else if(pwd !== pwd2){
                    layer.msg("两次输入的新密码必须一致！");
                    return false;
                }else{
                    var postData = {pwd:pwd};
                    return passwordModule.postParame(postData);
                }
            })
        },
        postParame:function(postData){
            common.ajax("post",config.infoUpdate,postData,function(data){
                $.cookie("user",JSON.stringify(data.user),{ path: '/', expires: 10 });
                layer.confirm('密码修改成功！', {
                    btn: ['关闭'] //按钮
                }, function(){
                    window.location.reload();
                });
            });
        }
    }
;
module.exports = passwordModule;