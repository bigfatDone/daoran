$(function (){
    var id = getQueryString('id');
    var type = getQueryString('t');
    newsDetail(type,id);
});

function newsDetail(type,id) {
    $.ajax({
        type:"get",    //请求方式
        async:false,    //是否异步
        url:"http://192.168.1.202:8091/ms_ow/officialweb/articleDetail",
        dataType:"jsonp",    //跨域json请求一定是jsonp
        jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
        data : {type:type,id:id},
        success: function(res) {
            var navigation = res.attributes;
            var data = res.obj;
            $('.news-title h1').html(data.sTitle);
            $('.news-title small').html(timeStamp2String2(data.dtUpdateTime));
            $('.black-p').html(data.sContent);

            //路径导航
            if(data.iType == 1){
                $('.breadcrumb li.active').html('行业资讯');
            }else {
                $('.breadcrumb li.active').html('公司动态');
            }
            //上一条
            if (navigation.forwordId == -1){
                $('.previous').hide();
            }else {
                // $('.previous').attr('href','news-detail.html?id='+ navigation.forwordId +'&t='+data.iType +'');
                $('.previous').attr('href','javascript:newsDerail('+ data.iType +','+navigation.forwordId +')');
            }
            //下一条
            if (navigation.nextId == -1){
                $('.next').hide();
            }else {
                // $('.next').attr('href','news-detail.html?id='+ navigation.nextId +'&t='+data.iType +'');
                $('.next').attr('href','javascript:newsDerail('+ data.iType +','+navigation.nextId +')');
            }
        }
    });
}




