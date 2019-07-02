<template>
  <div>
    <router-view></router-view>
    <!-- <h1 @click="alert('aaa')">123123</h1> -->
    <alert v-model="showAlert" :title="alertTitle"  @on-hide="onHide">{{alertMsg}}</alert>
    <toast v-model="showOk">{{okMsg}}</toast>
    <toast v-model="showErr" type="warn">{{errMsg}}</toast>
    <toast v-model="showTip" type="text" width="20em">{{tipMsg}}</toast>
    <confirm v-model="showCon" :title="conTit" @on-confirm="onConfirm">
      <p style="text-align:center; color: #333;">{{conMsg}}</p>
    </confirm>
    <loading v-model="showLoad" text=""></loading>

    <div class="topzzc" v-if="showTip2" @click.stop="hideTip2()"></div>
    <div class="tantipwrap" v-if="showTip2" @click.stop="hideTip2()">
      <div class="imgbox">
        <img src="./assets/zyyh/imgs/questionpage_bg_switch.png" alt="" />
      </div>
      <div class="font">
        <p>{{tipFont1}}</p>
        <p>{{tipFont2}}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import Global from './libs/global'
// import App from './libs/mobileCall'
import {Alert, Toast, Confirm, Loading} from 'vux'
export default {
  data () {
    return {
      isFirst: true,

      alertTitle: '',       // alert 标题
      alertMsg: '',       // alert 提示信息
      showAlert: false,   // alert警告框

      okMsg: '',  // 成功提示信息
      showOk: false,  // 成功提示框

      errMsg: '',  // 错误提示信息
      showErr: false,  // 错误提示框

      tipMsg: '', // 提示文字
      showTip: false, // 提示文字

      conTit: '', // 确定取消文字
      conMsg: '', // 确定内容
      showCon: false,

      showLoad: false,

      isTest: false,  //切换测试环境
      isTest: true, //打包是注销此处
      isPC: false,
      isWeChat: false,
      tipFont1: '今天已经用完3次机会啦',
      tipFont2: '明天再来吧~',
      showTip2: false,

      // wxApi: 'http://weix.pdscmkhd.com',
      wxApi: 'http://wechat.daoran.tv/zyyh_jkapi',
      meWxApi: 'http://wechat.daoran.tv',
      openId: '',

      middleApi: ''
      // middleApi: '/iptv_act'
    }
  },
  components: {
    Alert,
    Toast,
    Confirm,
    Loading
  },
  methods: {
    hideTip2 () {
      this.showTip2 = false;
    },
    log (data) {
      let json = JSON.parse(JSON.stringify(data));
      console.log(json);
    },
    alert (tit, str, cb) {
      this.alertMsg = str || '';
      this.alertTitle = tit || '';
      this.showAlert = true;
      // console.log(this.showAlert)
      if (cb) {
        this.alertObj = cb;
      } else {
        this.alertObj = function () {};
      }
    },
    alertObj () {},
    con (tit, str, cb) {
      this.conTit = tit || '';
      this.conMsg = str || '';
      this.showCon = true;
      if (cb) {
        this.conObj = cb;
      } else {
        this.conObj = function () {};
      }
    },
    conObj () {},
    onConfirm () {
      this.conObj();
    },
    onHide () {
      this.alertObj();
    },
    ok (str) {
      this.okMsg = str;
      this.showOk = true;
    },
    err (str) {
      this.errMsg = str;
      this.showErr = true;
    },
    tip (str) {
      this.tipMsg = str;
      this.showTip = true;
    },
    JSONP (url, data, cb) {
      let t = this;
      let geturl = window.BL.baseUrl + url;
      let param = data;
      let paramToJson = JSON.stringify(param);
      this.$http.jsonp(geturl, {params: {paramJson: paramToJson}}).then(function (res) {
        if (res.data.result === 1) {
          if (cb) {
            cb(res.data);
          }
        } else {
          this.alert('提示', error);
          console.log(res.data);
        }
      });
    },
    wxConfig (tit, des) {
      let t = this;
      let openId = t.openId;
      let wxTitle = '中原银行杯-征信伴我行'; // 分享标题
      let wxTit = '答题抢大礼！中原银行杯征信竞答火热进行中'; // 分享朋友圈、空间描述
      let wxDes = '速来答题赢奖品！'; // 分享描述
      let wxImg = 'http://wechat.daoran.tv/zyyh/images/shareimg.jpg'; // 分享图标
      let wxLink = 'http://wechat.daoran.tv/zyyh/#/zyyhIndex'; // 分享链接
      // t.$http.post(t.wxApi + '/sample.php').then(({data}) => {
      t.$http.post('http://wechat.daoran.tv/API_AOP/act/red/getConfig?url='+encodeURIComponent('http://wechat.daoran.tv/zyyh/')).then(({data}) => {
        // console.log(data);
        if (data.appId === '' || data.appId === undefined || data.appId === null) {
          t.alert('提示', 'appId Error', function () {
            window.location.reload();
          });
          return;
        }
        t.$wechat.config({
          // debug: true,
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] //
        });
        // console.log(t.$wechat.config);

        t.$wechat.ready(() => {
          // 分享到朋友圈
          t.$wechat.onMenuShareTimeline({
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
          t.$wechat.onMenuShareAppMessage({
            title: wxTit,
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

          /*// 分享到QQ
          t.$wechat.onMenuShareQQ({
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
          t.$wechat.onMenuShareQZone({
            title: wxTitle,
            desc: wxDes,
            link: wxLink,
            imgUrl: wxImg,
            success: function() {
            },
            cancel: function() {
            }
          });*/
        });

        t.$wechat.error(function(res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert('weixin 验证失败');
          console.log(res);
          // console.log(123);
        });
      })
    }
  },
  created () {
    // this.wxConfig();
    this.isWeChat = /micromessenger/.test(window.navigator.userAgent.toLowerCase());
    // console.log(this.isWeChat);
    if (this.isTest) {
      this.isWeChat = true;
      this.middleApi = '/iptv_act';
      this.wxApi = '';
      this.meWxApi = '';
    } else {
      // this.wxApi = 'http://weix.pdscmkhd.com';
    }
    let docEl = document.documentElement;
    let resize = function() {
      let docElWidth = docEl.clientWidth;
      docEl.style.fontSize = 100 * (docElWidth / 375) + 'px';
    };
    window.addEventListener('resize', resize);
    resize();
  },
  watch: {
    $route (to, from) {
      // console.log(to)
    }
  }
}
</script>


<style lang="less">
  @import './assets/common/reset.less';
  // @import './assets/common/common.less';
</style>
