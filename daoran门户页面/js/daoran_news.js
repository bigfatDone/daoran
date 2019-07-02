$(window).load(function(){
    var url = window.location.href;
    var index = url .lastIndexOf("\/");
    url  = url .substring(index + 1, url .length);
    var id = url.substring(10);
    if (id=='company-list'){
        $('.news-nav a').eq(1).click();
    }else {
        $('.news-nav a').eq(0).click();
    }
});
$(function () {
    $('.news-nav a').on('click',function () {//切换行业资讯、公司动态
        $(this).addClass('active').siblings('a').removeClass('active');
        if ($(this).index() == 0){
            //行业资讯
            $('#industry-list, #industry-pagination').show();
            $('#company-list, #company-pagination').hide();
        }else{
            // 公司动态
            $('#industry-list, #industry-pagination').hide();
            $('#company-list, #company-pagination').show();
        }
    });
    $('.list-pagination li').on('click',function () {//分页
        $(this).addClass('cur').siblings('li').removeClass('cur');
    });
    $('.pagination-next').on('click',function () {//下一页
        var index;
        $('.list-pagination li').each(function () {
            if ($(this).hasClass('cur')){
                index =$(this).index();
            }
        });
        $('.list-pagination li').eq(index+1).addClass('cur').siblings('li').removeClass('cur');
    });
    $('.pagination-last').on('click',function () {//末页
        var index;
        $('.list-pagination li').each(function () {
            index =$('.list-pagination li').length;
        });
        $('.list-pagination li').eq(index-1).addClass('cur').siblings('li').removeClass('cur');
    });
});


