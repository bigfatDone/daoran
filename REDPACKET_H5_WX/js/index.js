var isClickOpenedNum = 0; //  保存点击【开红包】的次数
$(function(){

    ajaxFun ('/act/red/package/status',JSON.stringify({billNo: GetQueryString('billNo')}),function(data){
        setTimeout(function(){
            $(".loading").hide();
            $(".indexContain").fadeIn();
            if(data.status === 0){
                $("#award").show();
            } else if(data.status === 1){
                $("#hadGot").show();
            }
        },2500);
    });

    toResize();
    $(window).resize(function() {
        toResize();
    });

    $("#openRule").click(function(){
        $(".ruleMain").fadeIn();
    });
    $("#ruleClose").click(function(){
        $(".ruleMain").hide();
    });

    // 开红包
    $("#getAward").click(function(){
        isClickOpenedNum ++;
        if(isClickOpenedNum == 1){
            var params = {
                userId: GetQueryString('userId'),
                openId: GetQueryString('openId'),
                billNo: GetQueryString('billNo'),
                payStyle: config.payStyle,
                actCode: config.actCode,
                nodeCode: config.nodeCode,
                projectCode: 'lxyy'
            }
            ajaxFun('/act/red/package/send',JSON.stringify(params),function(data){
                window.location.href = "money.html?money="+data.money/100+"&openId="+GetQueryString('openId');
            })
        }
    })

    // 禁止分享
    forbid();
})

function toResize() {
    var winW = $(window).width();
    var maxW = 640;
    if(winW > maxW){
        winW = maxW;
    }
    $("html").css({"font-size": winW / 400 * 13 + "px"});
}