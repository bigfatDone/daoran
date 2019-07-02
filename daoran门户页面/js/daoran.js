$(function (){
    getCompany();
    $('.preloader').fadeOut(1000); // set duration in brackets
    //导航栏监听
    $(window).scroll(function() {
        if ($(document).scrollTop() >= 89) {//导航栏监听显示
            $('#nav2').show();
        }else {
            $('#nav2').hide();
        }
    });
    $('.head_icon').hover(function () {//header 小图标
        $(this).find('span').toggle().css('margin-left',-($(this).find('span').width()+10)/2)
    });
    // bannerGET();

    // 设定banner 轮播间隔为 5s
    $('#carousel-news').carousel({
        interval: 3000
    });
    $('#carousel-dao').carousel({
        interval: 3500,
        pause: null
    });

    new WOW().init();
    getDate();
});

//版权自动日期
function getDate() {
    var mydate = new Date();
    var Year = mydate.getFullYear();
    $('#autoDate').html(Year);
}

//公司域名对应
function getCompany() {
    var guangzhou = /(www\.)?(daoran)\.(com)/;//广州道然
    var guangzhou_suffix = /(www\.)?(daoran)\.(cn|tv)/;//广州道然-1
    var guangzhou_suffix2 = /(www\.)?(2natural)\.(com)\.(cn)/;//广州道然-1
    var henan = /(www\.)?(daoran)\.(net)/;//河南道然
    var beijing = /(www\.)?(2natural)\.(cn)/;//北京道然
    var chengdu = /(www\.)?(2natural)\.(net)/;//成都艾克斯德
    var host = window.location.host;
    var company=['广州道然信息科技有限公司','北京道然视讯科技有限公司','成都艾克斯德网络科技有限公司','河南道然视讯网络科技有限公司'];
    var record=['粤ICP备16034275号-1','京ICP备18038935号-1','蜀ICP备14028248号-1','粤ICP备16034275号','豫ICP备18029698号-1'];
    var name=company[0],cord=record[0];
    if (guangzhou.test(host)){
        name=company[0];
        cord=record[3];
    }else if (guangzhou_suffix.test(host) || guangzhou_suffix2.test(host)){
        name=company[0];
        cord=record[0];
    }else if (beijing.test(host)){
        name=company[1];
        cord=record[1];
    }else if (chengdu.test(host)){
        name=company[2];
        cord=record[2];
    }else if (henan.test(host)){
        name=company[3];
        cord=record[4];
    }
    $('#company-name').html(name);
    $('#record').html(cord);
    $(document).attr("title",name);
}



