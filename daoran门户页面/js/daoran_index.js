$(window).load(function(){
    var url = window.location.href;
    var index = url .lastIndexOf("\/");
    url  = url .substring(index + 1, url .length);
    var id = url.substring(url.indexOf('#'));
    $('#nav2 ul li a').each(function () {
        if ($(this).attr('href') == id){
            $('html,body').animate({scrollTop:$(id).offset().top});
        }
    })
});
$(function (){
    $('body').scrollspy({ //bootstrap监听功能激活
        target: '#nav2',
        offset: $(window).height()/2
    });
    $('.product-list li').hover(function () { //产品展示文字
       $(this).find('.block-box').toggle();
    });
});

//刷新验证码
function refresh_captcha(){
    $("#captchaImg").attr("src","http://60.205.220.151:9021/ms_ow/officialweb/captcha.bmp?flag="+Math.random());
    $('#captcha').focus().val('');
}
//清空留言
function empty_msg() {
    $('#msg-title').val('').focus();
    $('#msg-content').val('');
    $('#phone-nub').val('');
    $('#captcha').val('');
}
//保存msg  留言
function save_msg() {
    var title = $('#msg-title').val(),
        content = $('#msg-content').val(),
        phone =$('#phone-nub').val(),
        captcha = $('#captcha').val();

    if(title === ''){  //验证标题是否为空
        $('.contact-tips').show().html('标题不能为空！！').delay(3000).hide(0);
        return $('#msg-title').focus();
    }
    if(content === ''){  //验证内容是否为空
        $('.contact-tips').show().html('内容不能为空！！').delay(3000).hide(0);
        return $('#msg-content').focus();
    }
    if(phone === ''){  //验证手机是否为空
        $('.contact-tips').show().html('内容不能为空！！').delay(3000).hide(0);
        return $('#phone-nub').focus();
    }
    if(phone !== ''){  //验证手机格式是否正确
        if(!(/^1[0-9]{10}$/.test(phone))){
            $('.contact-tips').show().html('手机号码不满11位！！').delay(3000).hide(0);
            return $('#phone-nub').focus();
        }
    }
    if(captcha === ''){  //验证码是否为空
        $('.contact-tips').show().html('验证码不能为空！！').delay(3000).hide(0);
        return $('#captcha').focus();
    }
    $.ajax({
        type:"get",    //请求方式
        async:true,    //是否异步
        url:"http://60.205.220.151:9021/ms_ow/officialweb/submitMessage",
        contentType: "application/jsonp; charset=utf-8",
        dataType:"jsonp",    //跨域json请求一定是jsonp
        jsonp: "callbackparam",    //跨域请求的参数名，默认是callback
        data : {
            sTitle : title,
            sContent : content,
            sPhone : phone,
            captcha : captcha
        },
        success: function(res) {
            if (res.success == true){
                alert("留言提交成功！");
                // window.location.href = "contactUs.html";
            }else {
                $('.contact-tips').addClass('alert alert-warning').html(res.msg).delay(5000).hide(0);
            }
            refresh_captcha();
        }
    });
}