<template>
  <div class="zyyhIndex">
    <div class="zzbox" v-show="showBar">
      <div class="gz">
        <img src="../../assets/zyyh/imgs/default_loading_gif.png" alt="" />
      </div>
      <div class="loadingbox">
        <div class="bar" :style="{width: barWidth+'%'}"></div>
      </div>
    </div>

    <div class="main2"></div>
    <div class="main">
      <div class="xmbox">
        <img src="../../assets/zyyh/imgs/home_icon_gift_gif.png" alt="" />
      </div>
      <div class="xmbox_guang">
        <img src="../../assets/zyyh/imgs/home_icon_lighteffect.png" alt="" />
      </div>
      <div class="btnbox clb">
        <div class="btn btn1" @click.stop="goAnswer()">我要答题</div>
        <div class="btn btn2" @click.stop="goUrl('/rule')">活动规则</div>
      </div>
      <div class="host">
        <p>中国人民银行平顶山市中心支行</p>
        <p>中原银行平顶山分行</p>
        <p>联合举办</p>
        <!--<p>联合举办</p>-->
        <!--<p>联合举办</p>-->
        <!--<p>联合举办</p>-->
        <div class="banner_common ban">
          <img src="../../assets/zyyh/imgs/common_bg_Banner.jpg" alt="" />
        </div>
      </div>
    </div>

    <!--<div class="topzzc"></div>
    <div class="tantipwrap">
      <div class="imgbox">
        <img src="../../assets/zyyh/imgs/questionpage_bg_switch.png" alt="" />
      </div>
      <div class="font">
        <p>{{tipFont1}}</p>
        <p>{{tipFont2}}</p>
      </div>
    </div>-->

  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  // import {XButton} from 'vux'

  export default {
    data() {
      return {
        list: [],
        barWidth: 10,
        showBar: true,
        dLeftTimes: 0,
        dateOut: '' // noStart, end
      }
    },
    components: {
      // XButton
    },
    methods: {
      goUrl (url) {
        this.$router.push({path: url});
      },
      goAnswer () {
        let t = this;
        // t.dLeftTimes = 0;
        // t.dateOut = 'end';
        if (window.BL.userId === '') {
          t.$parent.con('活动需要您授权才能正常参与哦', '是否授权？', () => {
            window.location.href = 'http://weix.pdscmkhd.com/jkapi/sample1.php';
          });
          return;
        }
        if (t.dateOut === 'noStart') {
          t.$parent.tipFont1 = '活动尚未开始';
          t.$parent.tipFont2 = '敬请期待哟~';
          t.$parent.showTip2 = true;
        } else if (t.dateOut === 'end') {
          t.$parent.tipFont1 = '活动已经结束';
          t.$parent.tipFont2 = '谢谢参与哟~';
          t.$parent.showTip2 = true;
        } else if (t.dLeftTimes < 1) {
          t.$parent.tipFont1 = '今天已经用完3次机会啦';
          t.$parent.tipFont2 = '明天再来吧~';
          t.$parent.showTip2 = true;
        } else if (!t.$parent.isWeChat) {
          this.$parent.alert('提示', '请在微信端答题', () => {

          })
        } else {
          t.goUrl('/answer');
        }
      },
      initInfo () {
        let t = this;
        t.$parent.isFirst = false;
        let param = {
          actCode: 'zyyhzx',
          userId: window.BL.userId,
          orderNum: 1
        };

        t.$http.post(window.BL.apiUrl + t.$parent.middleApi + '/act/coin/userActInfo/get', param).then(({data}) => {
          // t.$parent.log(data);
          let timer = window.setInterval(() => {
            t.barWidth += 10;
            if (t.barWidth >= 100) {
              window.clearInterval(timer);
              t.showBar = false;
            }
          }, 50);
          if (data.code === 10000000) {
            t.dLeftTimes = data.userAct.leftTimes;
            window.BL.leftTimes = data.userAct.leftTimes;
            if (data.userAct.tel) {
              window.BL.tel = data.userAct.tel;
            } else {
              window.BL.tel = '';
            }
            window.BL.indexIn = true;
          } else if (data.code === 100112) {
            t.dateOut = 'noStart';
          } else if (data.code === 100113) {
            t.dateOut = 'end';
          } else {
            t.$parent.alert('提示', data.text, () => {
              // t.goUrl('/zyyhIndex');
            });
          }
        })
      }
    },
    mounted() {
      let t = this;
      let userInfo = this.$route.query.userInfo;
      // userInfo = '{"openid": "123"}';
      // console.log(userInfo)
      if (userInfo) {
        window.BL.userInfo = userInfo;
        let userInfo2 = JSON.parse(userInfo);
        if (userInfo2.openid) {
          let openId = userInfo2.openid;
          t.$parent.openId = openId;
          window.BL.userId = openId;
          t.initInfo();
        } else {
          t.$parent.alert('提示', '无ID');
        }
      } else {
        if (t.$parent.isTest) {
          window.BL.apiUrl = '';
          window.BL.userId = 'zyyhTest1';
          t.initInfo();
        } else {
          // window.BL.userId = 'zyyhTest1';
          // t.initInfo();

          window.location.href = 'http://weix.pdscmkhd.com/jkapi/sample1.php';
        }
      }
      if (t.$parent.isFirst) {
      } else {
        t.showBar = false;
      }
    },
    created() {
      window.BL.setTitle('征信伴我行');
      this.$parent.wxConfig();
    },
    watch: {
      $route(to, from) {
        // console.log(to)
      }
    }
  }
</script>
<style lang='less'>
  @import '../../assets/zyyh/index.less';
</style>
