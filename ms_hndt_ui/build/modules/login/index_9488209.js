define("login/index",function(n,o,e){var i=n("components/jquery/jquery"),t=n("components/layer/layer"),c=n("components/config/config"),r=n("common/common"),s=(n("components/cookie/cookie"),{init:function(){s.enterKey(),i("#loginBtn").click(function(){s.postParame()})},postParame:function(){var n=i("#username").val(),o=i("#password").val(),e={userId:n,pwd:o};n&&o?r.ajax("post",c.login,e,function(n){t.msg("登录成功！"),i.cookie("user",JSON.stringify(n.user)),setTimeout(function(){window.location.href="/index.html"},300)}):t.msg("请正确输入登陆账号和密码！")},enterKey:function(){document.onkeydown=function(n){var o=document.all?window.event:n;13==o.keyCode&&i("#loginBtn").click()}}});e.exports=s});