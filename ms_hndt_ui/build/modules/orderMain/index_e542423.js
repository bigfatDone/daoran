define("orderMain/index",function(e,t,a){var o=e("components/jquery/jquery"),n=e("components/layer/layer"),r=e("components/artTemplate/artTemplate"),i=e("components/config/config"),c=e("pagination/index"),d=e("common/common"),p=e("addOrder/index"),s=e("components/helper/helper"),u={init:function(){o("#addBtn").click(function(){u.postParame()}),u.getParame({cur:0,pageSize:i.pageSize,retCode:i.code[0].value}),o("#search").click(function(){u.search()}),u.setOptions(),u.setCodeOptions(),s.dateFilter(),s.resultCodesFilter()},setOptions:function(){var e={data:i.product},t=r("proData",e);o("#proCode").html(t)},setCodeOptions:function(){var e={data:i.code},t=r("codeData",e);o("#retCode").html(t)},postParame:function(){o.get("/modules/addOrder/index.html",function(e){var t=n.open({type:1,title:"提交订购",shadeClose:!0,area:["600px","auto"],content:e,button:["ok"],success:function(){p.init(t)}})})},search:function(){var e=o("#custId").val(),t=o("#proCode").val(),a=o("#reqDate").val().replace("-",""),n=o("#retCode").val(),r={cur:0,pageSize:i.pageSize};e&&(r.custId=e),t&&(r.proCode=t),a&&(r.reqDate=a),n&&(r.retCode=n),u.getParame(r)},getParame:function(e){d.ajax("post",i.getOrder,e,function(t){var a=r("orderData",{dataList:t.pb.dataList});o("#orderList").html(a),c.pagination(t.pb.cur,t.pb.totalPage,t.pb.totalCount,function(t){e.cur=t,u.getParame(e)})})}};a.exports=u});