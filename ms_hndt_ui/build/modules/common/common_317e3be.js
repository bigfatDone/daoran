define("common/common",function(e,o,n){var t=e("components/jquery/jquery"),a=e("components/config/config"),i=(e("components/cookie/cookie"),e("components/artTemplate/artTemplate"),{pagination:function(e,o,n,a){t("#pagination").paging({pageNo:e,totalPage:o,totalSize:n,callback:function(e){a(e)}})},hasUserCookie:function(e){return""!==t.cookie("user")&&"null"!==t.cookie("user")&&null!==t.cookie("user")&&void 0!==t.cookie("user")?e(JSON.parse(t.cookie("user"))):layer.confirm("您还未登陆，请先登录后再进行操作！",{closeBtn:0,btn:["前往登陆"]},function(){window.location.href="/login.html"})},isAdmin:function(e,o){i.hasUserCookie(function(n){n.type==a.userType[1].value?e():"menu"!==o&&layer.msg("你暂时没有权限查看订购记录，如有需要，请联系管理员！")})},ajax:function(e,o,n,t,a){var r=window.location.pathname;-1!==r.indexOf("login")||n.userId?i.ajaxRequest(e,o,n,t):i.hasUserCookie(function(r){"orderHistory"!==a&&(n.userId=r.userId),i.ajaxRequest(e,o,n,t,a)})},ajaxRequest:function(e,o,n,i,r){t.ajax({type:e,url:a.host+o,timeout:5e3,contentType:"application/json;charset=utf-8",headers:a.ajaxHeads,beforeSend:function(){layerIndex=layer.load(1,{shade:[.6,"#333"]})},data:JSON.stringify(n),success:function(e){setTimeout(function(){layer.close(layerIndex)},300),r&&"orderHistory"!==r?"addOrder"===r&&(layer.msg(1e7===e.code?e.text:10000005===e.code?"订购失败:宽带账号验证失败":"订购失败:"+e.text),i(e)):1e7===e.code?i(e):layer.msg(e.text)},error:function(e){layer.msg(e.text)}})},uploadfile:function(e,o,n){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){var e=t.response,o=JSON.parse(e).code;1e7===o&&n()}},t.open("POST",a.host+e,!0),t.upload.onprogress=function(e){e.lengthComputable},t.send(o)}});n.exports=i});