<template>
  <div class="shareCom">
    <div class="back_share"></div>

    <div class="share_top">
      <div class="imgbox">
        <img src="../../assets/zyyh/imgs/awards_bg_title.png" alt="" />
      </div>
      <p class="tip">2018年6月10日-2018年6月19日，凭手机号到中原银行建东支行--永续贷中心（万达广场西侧50米）领取奖品哟</p>

      <div class="imgbox2">
        <img src="../../assets/zyyh/imgs/awards_bg_gift.png" alt="" />
      </div>

      <div class="imgbox3">
        <img src="../../assets/zyyh/imgs/awards_bg_tip.png" alt="" />
      </div>

      <div class="btnbox_com mt">
        <div class="btn" @click.stop="showFx=true">告诉朋友</div>
      </div>
    </div>

    <div class="tanfx_zzz" v-show="showFx" @click.stop="showFx=false"></div>
    <div class="tanfx" v-show="showFx" @click.stop="showFx=false">
      <img src="../../assets/zyyh/imgs/sharepage_bg_sharetip.png" alt="" />
    </div>

    <div class="banner_common">
      <img src="../../assets/zyyh/imgs/common_bg_Banner.jpg" alt="" />
    </div>
  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  // import {XButton} from 'vux'

  export default {
    data() {
      return {
        showFx: false,
        grade: '',
      }
    },
    components: {
      // XButton
    },
    methods: {
      goUrl (url) {
        if (url === '/zyyhIndex') {
          if (window.BL.userInfo) {
            this.$router.replace({path: url+'?userInfo='+window.BL.userInfo});
            // this.$router.replace({ path: url, query: { userInfo: window.BL.userInfo }});
          } else {
            this.$router.replace({path: url});
          }
        } else {
          this.$router.replace({path: url});
        }
      },
      wxConfigShare () {
        let t = this;
        let openId = t.openId;
        let wxTitle = '中原银行杯-征信伴我行'; // 分享标题
        let wxTit = '我参加中原银行杯征信竞答抽中' + t.grade; // 分享朋友圈、空间描述
        let wxDes = '征信伴我行，中原银行杯百姓征信知识有奖竞答，精美奖品等你拿！'; // 分享描述
        let wxImg = 'http://wechat.daoran.tv/zyyh/images/shareimg.jpg'; // 分享图标
        let wxLink = 'http://wechat.daoran.tv/zyyh/#/zyyhIndex'; // 分享链接
        // t.$http.post(t.$parent.wxApi + '/jkapi/sample.php').then(({data}) => {
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
          });

          t.$wechat.error(function(res) {
            console.log(res);
          });
        })
      }
    },
    mounted() {
      let g = this.$route.params.grade;
      if (g === '1') {
        this.grade = '一等奖';
      } else if (g === '2') {
        this.grade = '二等奖';
      } else if (g === '3') {
        this.grade = '三等奖';
      } else if (g === '4') {
        this.grade = '优秀奖';
      }
      this.wxConfigShare();
    },
    created() {
      window.BL.setTitle('恭喜');
      if (!window.BL.indexIn) {
        this.goUrl('/zyyhIndex');
      }
      if (!this.$parent.isWeChat) {
        this.$parent.alert('提示', '请在微信端打开应用', () => {
          this.goUrl('/zyyhIndex');
        })
      }
    }
  }
</script>
<style lang='less'>
  @import '../../assets/zyyh/share.less';
</style>
