var $ = require("jquery"),
    config = require("config"),
    template = require("artTemplate"),
    layer = require("layer"),
    common = require("../common/common"),
    cookie = require("cookie");
var addOrderModule = {
    layerAddOrder:"",
    itvFile:{},
    init: function(layerAddOrder){
        addOrderModule.layerAddOrder = layerAddOrder;

        addOrderModule.setOptions();
        $("#save").click(function(){
            addOrderModule.validate();
        });

        //批量
        $("#itvs").click(function(){
            addOrderModule.batch("itvs");
        })
        $("#tels").click(function(){
            addOrderModule.batch("tels");
        })

        //单选
        addOrderModule.radios();
    },
    radios:function(){
        $(".radios input[type='radio']").click(function(){
            var thisId = $(this).attr("id");
            if(thisId === "itvRadio"){
                $("#itvGround").removeClass("hidden");
                $("#ipGround").addClass("hidden");
            }else if(thisId === "telRadio"){
                $("#ipGround").removeClass("hidden");
                $("#itvGround").addClass("hidden");
            }
        })
    },
    setOptions:function(){
        var data = {data:config.product};
        var html = template("productData",data);
        $("#product").html(html);
    },
    validate:function(){
        var url = "";
        var itv = $("#itv").val();
        var itvFile = addOrderModule.itvFile;
        // var tel = $("#tel").val();
        var product = $("#product").val();
        var reg = /^3(\d{13}|\d{17})$/;
        if(itvFile.name){
            var file = new FormData(); // html5新增的对象,可以包装字符,二进制信息
            common.hasUserCookie(function(user){
                file.append("custFile",itvFile);
                file.append("userId",user.userId);
                file.append("proCode",product);
                common.uploadfile(config.saveOrders,file,function(){
                    window.location.reload();
                })
            })
        }else{
            if(!reg.test(itv)){
                layer.msg("ITV账号必须输入正确！");
                return false;
            }else if(product === ""){
                layer.msg("必须选择一项订购产品！");
                return false;
            }else{
                var postData = {proCode:product,custKey:itv,source:3};
                addOrderModule.postParame(postData,config.saveOrder);
            }
        }

    },
    postParame:function(postData,url){
        common.ajax("post",url,postData,function(data){
            addOrderModule.reloadForm();
            var orderMain = require("../orderMain");
            orderMain.getParame({cur:0,pageSize:config.pageSize});
        },"addOrder");
    },
    batch:function(text){
        if(text === "itvs"){
            $("#itvFile").click();
            addOrderModule.uploadValidate("#itvFile");
        }else if(text === "tels"){

        }
    },
    uploadValidate:function(obj){
        $(obj).change(function(){
            $(this).removeClass("hidden");
            $("#itv,#itvs").hide();
            var file = this.files[0];
            if(file.name.indexOf("xls") === -1){
                layer.msg("请上传excel文件！");
            }else{
                addOrderModule.itvFile = file;
            }
        })
    },
    reloadForm:function(){
        $("#itv,#itvFile").val("");
        $("#itv,#itvs").show();
        $("#itvFile").addClass("hidden");
    }
};
module.exports = addOrderModule;