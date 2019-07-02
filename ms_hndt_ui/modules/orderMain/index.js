var $ = require("jquery"),
    layer = require("layer"),
    template = require("artTemplate"),
    config = require("config"),
    pagination = require("../pagination"),
    common = require("../common"),
    addOrder = require("../addOrder"),
    helper = require("helper");
var orderMainModule = {
    init: function(){
        //新增
        $("#addBtn").click(function(){
            orderMainModule.postParame();
        });
        //获取数据
        orderMainModule.getParame({cur:0,pageSize:config.pageSize,retCode:config.code[0].value});
        //查询
        $("#search").click(function(){
            orderMainModule.search();
        })
        //查询的select数据
        orderMainModule.setOptions();
        orderMainModule.setCodeOptions();
        //过滤
        helper.dateFilter();
        helper.resultCodesFilter();
    },
    setOptions:function(){
        var data = {data:config.product};
        var html = template("proData",data);
        $("#proCode").html(html);
    },
    setCodeOptions:function(){
        var data = {data:config.code};
        var html = template("codeData",data);
        $("#retCode").html(html);
    },
    postParame:function(){
        $.get('/modules/addOrder/index.html',function(html){
            var layerAddOrder = layer.open({
                type: 1,
                title: '提交订购',
                shadeClose: true, //点击遮罩关闭层
                area: ['600px', 'auto'],
                content: html, //注意，如果str是object，那么需要字符拼接。
                button:["ok"],
                success: function() {
                    addOrder.init(layerAddOrder);
                }
            })
        })
    },
    search:function(){
        // var custTel = $("#custTel").val();
        var custId = $("#custId").val();
        var proCode = $("#proCode").val();
        var reqDate = $("#reqDate").val().replace("-","");
        var retCode = $("#retCode").val();
        var postData = {cur:0,pageSize:config.pageSize};
        // if(custTel){
        //     postData.postData = postData;
        // }else
        if(custId){
            postData.custId = custId;
        }
        if(proCode){
            postData.proCode = proCode;
        }
        if(reqDate){
            postData.reqDate = reqDate;
        }
        if(retCode){
            postData.retCode = retCode;
        }
        orderMainModule.getParame(postData);
    },
    getParame:function(postData){
        common.ajax("post",config.getOrder,postData,function(data){
            var html = template("orderData",{dataList:data.pb.dataList});
            $("#orderList").html(html);
            pagination.pagination(data.pb.cur,data.pb.totalPage,data.pb.totalCount,function(num){
                postData.cur = num;
                orderMainModule.getParame(postData);
            });
        });
    }
};
module.exports = orderMainModule;