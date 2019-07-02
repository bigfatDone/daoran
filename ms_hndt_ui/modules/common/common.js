var $ = require("jquery"),
    config = require("config"),
    cookie = require("cookie"),
    template = require("artTemplate");
var commonModule = {
    pagination:function(pageNo, totalPage, totalSize, callback){
        $("#pagination").paging({
            pageNo:pageNo,
            totalPage: totalPage,
            totalSize: totalSize,
            callback: function(num) {
                callback(num);
            }
        });
    },
    hasUserCookie:function(callback){
        if($.cookie("user") !== "" && $.cookie("user") !== "null" && $.cookie("user") !== null && $.cookie("user") !== undefined){
            return callback(JSON.parse($.cookie("user")));
        }else{
            return layer.confirm('您还未登陆，请先登录后再进行操作！', {
                closeBtn: 0,
                btn: ['前往登陆'] //按钮
            }, function(){
                window.location.href = "/login.html";
            });
        }
    },
    isAdmin:function(callback,text){
        commonModule.hasUserCookie(function(user){
            if(user.type == config.userType[1].value){
                callback();
            }else if(text !== "menu"){
                layer.msg("你暂时没有权限查看订购记录，如有需要，请联系管理员！");
            }
        });
    },
    ajax:function(method,url,postData,callback,text){
        var pathname = window.location.pathname;
        var layerIndex = 0;
        if(pathname.indexOf("login") === -1 && !postData.userId){
            commonModule.hasUserCookie(function(user){
                if(text !== "orderHistory"){
                    postData.userId = user.userId;
                }
                commonModule.ajaxRequest(method,url,postData,callback,text);
            });
        }else{
            commonModule.ajaxRequest(method,url,postData,callback);
        }
    },
    ajaxRequest:function(method,url,postData,callback,text){
        $.ajax({
            type: method,
            url: config.host+url,
            timeout:5000,
            contentType:"application/json;charset=utf-8",
            headers:config.ajaxHeads,
            beforeSend:function(){
                layerIndex = layer.load(1, {
                    shade: [0.6,'#333'] //0.1透明度的白色背景
                })
            },
            data: JSON.stringify(postData),
            success: function(data){
                setTimeout(function(){
                    layer.close(layerIndex);
                },300);
                if(!text || text === "orderHistory"){
                    if(data.code === 10000000){
                        callback(data);
                    }else{
                        layer.msg(data.text);
                    }
                }else if(text === "addOrder"){
                    if(data.code === 10000000){
                        layer.msg(data.text);
                    }else if(data.code === 10000005){
                        layer.msg("订购失败:宽带账号验证失败");
                    }else{
                        layer.msg("订购失败:"+data.text);
                    }
                    callback(data);
                }

            },
            error:function(data){
                layer.msg(data.text);
            }
        });
    },
    uploadfile: function(url,file,callback) {
        var http = new XMLHttpRequest();
        http.onreadystatechange= function(){
            if (http.readyState==4){
                if (http.status==200){
                    var data = http.response;
                    var this_status = JSON.parse(data).code;
                    if(this_status === 10000000){
                        callback();
                    }
                }
            }
        };
        http.open('POST',config.host+url,true);
        http.upload.onprogress = function (ev) {
            var percent = 0;
            // $(bar).parents(".bar_bg").css("display","inline-block");
            if(ev.lengthComputable) {
                // percent = 100 * ev.loaded/ev.total;
                // $(bar).css("width",(percent+'%'));
                // $(uploadstatus).html(parseInt(percent) + "%");
                // if(parseInt(percent) === 100){
                //     $(thisload).children(".bar_bg").children(".upload-status").html("等待上传");
                // }
            }
        };
        http.send(file);
    }
};
module.exports = commonModule;