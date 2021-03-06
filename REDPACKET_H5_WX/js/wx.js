var money = GetQueryString("money");
var openId = GetQueryString("openId");
var wxTitle = '我在乐享音乐TV听歌领了'+money+'元'; // 分享标题
var wxDes = '听歌领红包，连续领30天，每天都能领'; // 分享描述
var wxTit = '我在乐享音乐TV听歌领了'+money+'元,连续30天,每天都能领'; // 分享朋友圈、空间描述
var wxImg = 'http://wechat.daoran.tv/wechat/images/share_logo.jpg'; // 分享图标
var wxLink = 'http://wechat.daoran.tv/wechat/share.html?money='+money+'&openId='+openId; // 分享链接

ajaxFun('/act/red/getConfig?url='+encodeURIComponent(window.location.href),'',function(data){
    wx.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
})

wx.ready(function() {
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    // alert('weixin 验证成功');

    // 分享到朋友圈
    wx.onMenuShareTimeline({
        title: wxTit,
        desc: wxDes,
        link: wxLink,
        imgUrl: wxImg,
        success: function() {
        },
        cancel: function() {
        }
    });

    // 分享给朋友
    wx.onMenuShareAppMessage({
        title: wxTitle,
        desc: wxDes,
        link: wxLink,
        imgUrl: wxImg,
        type: '',
        dataUrl: '',
        success: function() {
        },
        cancel: function() {
        }
    });

    // 分享到QQ
    wx.onMenuShareQQ({
        title: wxTitle,
        desc: wxDes,
        link: wxLink,
        imgUrl: wxImg,
        success: function() {
        },
        cancel: function() {
        }
    });

    // 分享到QQ空间
    wx.onMenuShareQZone({
        title: wxTitle,
        desc: wxDes,
        link: wxLink,
        imgUrl: wxImg,
        success: function() {
        },
        cancel: function() {
        }
    });
});

wx.error(function(res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    // alert('weixin 验证失败');
    // console.log(res);
});