$(function(){
    //分享
    $("#share").click(function(){
        $("#shareZoom").fadeIn();
    })
    $(".mask").click(function(){
        $("#shareZoom").hide();
    })

    $("#smoney, #bmoney").text(GetQueryString("money"));
})