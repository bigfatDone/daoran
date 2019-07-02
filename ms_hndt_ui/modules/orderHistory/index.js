var $ = require("jquery"),
    layer = require("layer"),
    template = require("artTemplate"),
    config = require("config"),
    pagination = require("../pagination"),
    common = require("../common"),
    helper = require("helper");
var orderHistoryModule = {
    init: function(){
        //获取数据
        orderHistoryModule.getParame({cur:0,pageSize:10});
        //查询
        $("#search").click(function(){
            orderHistoryModule.search();
        })
        //查询的订购产品数据
        orderHistoryModule.setProOptions();
        //查询的地市数据
        orderHistoryModule.setAreaOptions();
        //查询的订购结果数据
        orderHistoryModule.setCodeOptions();
        //过滤
        helper.areaFilter();
        helper.resultCodesFilter();
        helper.dateFilter();
    },
    setProOptions:function(){
        var data = {data:config.product};
        var html = template("proData",data);
        $("#proCode").html(html);
    },
    setAreaOptions:function(){
        var data = {data:config.area};
        var html = template("areaData",data);
        $("#areaCode").html(html);
    },
    setCodeOptions:function(){
        var data = {data:config.code};
        var html = template("codeData",data);
        $("#retCode").html(html);
    },
    isFirstTime: function(){
        layer.msg("亲爱的用户，请您尽快点击右上角修改原始密码，填写支付信息，便于我们顺利为您结算收益哦~~");
    },
    search:function(){
        var proCode = $("#proCode").val();
        var orderDate = $("#orderDate").val().replace("-","");
        var userId = $("#userId").val();
        var areaCode = $("#areaCode").val();
        var retCode = $("#retCode").val();
        var postData = {cur:0,pageSize:config.pageSize};
        if(proCode){
            postData.proCode = proCode;
        }
        if(orderDate){
            postData.orderDate = orderDate;
        }
        if(userId){
            postData.userId = userId;
        }
        if(areaCode){
            postData.areaCode = areaCode;
        }
        if(retCode){
            postData.retCode = retCode;
        }
        orderHistoryModule.getParame(postData);
    },
    getParame:function(postData){
        common.isAdmin(function(){
            common.ajax("post",config.getHistoryOrder,postData,function(data){
                var html = template("historyData",{dataList:data.pb.dataList});
                $("#historyList").html(html);
                var html = template("totalData",{orderNum:data.pb.totalCount,sucOrdNum:data.sucOrdNum,totalEarning:data.totalEarning});
                $("#totalMain").html(html);
                pagination.pagination(data.pb.cur,data.pb.totalPage,data.pb.totalCount,function(num){
                    postData.cur = num;
                    orderHistoryModule.getParame(postData);
                });
            },"orderHistory");
        })
    }
};
module.exports = orderHistoryModule;