$(function () {
    getCompany();
    $('.preloader').fadeOut(1000); // set duration in brackets
    new WOW().init();  //初始化wow.js
    bannerGET();  //获取banner

    //图片预加载
    $("img.lazy").lazyload({
        effect : "fadeIn",
        placeholder : "images/transparent.gif",
        event : "sporty",
        threshold : 200
    });

    var timeout = setTimeout(function() {$("img.lazy").show().trigger("sporty")}, 3000);
});

//获取banner信息
function bannerGET() {
    $.ajax({
        type:"get",    //请求方式
        async:true,    //是否异步
        data:{type:2},
        url:"http://60.205.220.151:9021/ms_ow/officialweb/getBanner",
        dataType:"jsonp",    //跨域json请求一定是jsonp
        jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
        success: function(data) {
            var img = '';
            for (var key in data.obj){
                img +='<div class="swiper-slide">' +
                    '       <img data-src="http://60.205.178.172:80'+data.obj[key].sPath +'" name="'+ data.obj[key].sName +'"  class="swiper-lazy">' +
                    '  <div class="swiper-lazy-preloader"></div></div>';
            }
            $('#banner .swiper-wrapper').html(img);
            //banner 设置
            var mySwiper = new Swiper('#banner', {
                pagination: {
                    el: '.swiper-pagination'  //指定分页
                },
                lazy: {
                    loadPrevNext: true
                },
                loop : true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                }//自动轮播间隔
                // autoplay: true
            });
        }
    });
}

//滚动加载更多
function more() {
    var range = 100;             //距下边界长度/单位px
    var num = 1;
    var totalheight = 0;
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight) {
            ajax_industry(num*10);
            num++;
        }
    });
}


//ajax 行业资讯
function ajax_industry(num) {
    $.ajax({
        type: "get",    //请求方式
        async: true,    //是否异步
        url: "http://60.205.220.151:9021/ms_ow/officialweb/getInfos",
        dataType: "jsonp",    //跨域json请求一定是jsonp
        jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
        data: {start: num},
        beforeSend: function(XMLHttpRequest){
            $('.news-tips').html('加载中……');
        },
        success: function (res) {
            if (res.success == true){
                var Infos = res.obj;
                var html ='';
                for (var key in Infos) {  //行业资讯
                    html += '<li class="wow fadeInRight">' +
                        '<a href="news-detail.html?id=' + Infos[key].iId + '&t=' + Infos[key].iType + '">' +
                        '<h2> ' + Infos[key].sTitle + '</h2>' +
                        '<h5 class="font-grey">' + timeStamp2String(Infos[key].dtUpdateTime) + '</h5>' +
                        '</a>' +
                        '</li>';
                }
                $('#industry-news').append(html);
                $('.news-tips').html('上拉加载更多');
            }else {
                $('.news-tips').html('已经没有更多数据了');
                return false;
            }
        }
    });
}

//获取公司动态
function company_news() {
    $.ajax({
        type: "get",    //请求方式
        async: true,    //是否异步
        url: "http://60.205.220.151:9021/ms_ow/officialweb/getNews",
        dataType: "jsonp",    //跨域json请求一定是jsonp
        jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
        data: {start: num},
        success: function (res) {
            if (res.success == true){
                var Infos = res.obj;
                var html ='';
                for (var key in Infos) {  //行业资讯
                    html += '<li class="wow fadeInRight">' +
                        '<a href="news-detail.html?id=' + Infos[key].iId + '&t=' + Infos[key].iType + '">' +
                        '<h5> ' + Infos[key].sTitle + '</h5>' +
                        '<h6><small>' + timeStamp2String(Infos[key].dtUpdateTime) + '</small></h6>' +
                        '<p class="ellipsis">' + Infos[key].sContent + '</p>' +
                        '</a>' +
                        '</li>';
                }
                $('#company-news ul').append(html);
            }
        }
    });
}

//新闻详情页面
function newsDetail(type,id) {
    $.ajax({
        type:"get",    //请求方式
        async:false,    //是否异步
        url:"http://60.205.220.151:9021/ms_ow/officialweb/articleDetail",
        dataType:"jsonp",    //跨域json请求一定是jsonp
        jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
        data : {type:type,id:id},
        success: function(res) {
            var navigation = res.attributes;
            var data = res.obj;
            $('.news-title h1').html(data.sTitle);
            $('.news-title h5').html(timeStamp2String2(data.dtUpdateTime));
            $('.black-p').html(data.sContent);

            //上一条
            if (navigation.forwordId == -1){
                $('.previous').hide();
            }else {
                $('.previous').show().attr('href','javascript:newsDetail('+ data.iType +','+navigation.forwordId +')');
            }
            //下一条
            if (navigation.nextId == -1){
                $('.next').hide();
            }else {
                $('.next').show().attr('href','javascript:newsDetail('+ data.iType +','+navigation.nextId +')');
            }
        }
    });
}

//获取url信息
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//时间戳转换 yyyy-mm-dd
function timeStamp2String(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0"
        + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate()
        : datetime.getDate();
    return year + "-" + month + "-" + date ;
}

//时间戳转换  yyyy-mm-dd h:m:s
function timeStamp2String2(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0"
        + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate()
        : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours()
        : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes()
        : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds()
        : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute
        + ":" + second;
}

//公司域名对应
function getCompany() {
    var guangzhou_suffix = /(m\.)?(daoran)\.(cn|tv)/;//广州道然-1
    var guangzhou_suffix2 = /(m\.)?(2natural)\.(com)\.(cn)/;//广州道然-1
    var beijing = /(m\.)?(2natural)\.(cn)/;//北京道然
    var chengdu = /(m\.)?(2natural)\.(net)/;//成都艾克斯德
    var henan = /(m\.)?(daoran)\.(net)/;//河南道然
    var host = window.location.host;
    var company=['广州道然信息科技有限公司','北京道然视讯科技有限公司','成都艾克斯德网络科技有限公司','河南道然视讯网络科技有限公司'];
    var record=['粤ICP备16034275号-1','京ICP备18038935号-1','蜀ICP备14028248号-1','粤ICP备16034275号','豫ICP备18029698号-1'];
    var name=company[0],cord=record[0];
    if (guangzhou_suffix.test(host) || guangzhou_suffix2.test(host)){
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