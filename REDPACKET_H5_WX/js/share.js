$(function(){
    $("#money").text(GetQueryString("money"));
    ajaxFun('/act/wx/userinfo/get',JSON.stringify({openId:  GetQueryString("openId")}),function(data){
        $("#wxAvatar").attr('src', data.wxInfo.headerImg);
        $("#wxName").text(data.wxInfo.nickName);
    })
})