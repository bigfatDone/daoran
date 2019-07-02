<template>
  <div class="answerResults">
    <div class="backfix"></div>

    <div class="success_box" v-if="showSuccess==='S'">
      <div class="top_tip">
        <img src="../../assets/zyyh/imgs/resultpage_bg_title_victory.png" alt="" />
        <span class="num_s">{{sNum}}</span>
      </div>
      <div class="gz">
        <img src="../../assets/zyyh/imgs/resultpage_bg_victory.png" alt="" />
      </div>
      <div class="f_tip">
        <p>征信达人当之无愧！</p>
        <p>快来抽奖吧！</p>
      </div>
      <div class="btnbox_com">
        <div class="btn" @click.stop="getLotteryS()">我要抽奖</div>
      </div>
    </div>


    <div class="failing_box" v-if ="showSuccess==='F'">
      <div class="top_tip">
        <img src="../../assets/zyyh/imgs/resultpage_bg_title_fail.png" alt="" />
        <span class="num_s">{{fNum}}</span>
      </div>
      <div class="gz">
        <img src="../../assets/zyyh/imgs/resultpage_bg_fail.png" alt="" />
      </div>
      <div class="f_tip">
        <p>未满足抽奖资格！</p>
        <p>要加油喔，再接再厉！</p>
      </div>
      <div class="btnbox_com">
        <div class="btn" @click.stop="goUrl('/zyyhIndex')">再答一次</div>
      </div>
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
        showSuccess: 'S',
        sNum: 0,
        fNum: 1
      }
    },
    components: {
      // XButton
    },
    methods: {
      goUrl (url) {
        // this.$router.replace( {path: url} );
        if (url === '/zyyhIndex') {
          if (window.BL.userInfo) {
            this.$router.replace({path: url+'?userInfo='+window.BL.userInfo});
          } else {
            this.$router.replace({path: url});
          }
        } else {
          this.$router.replace({path: url});
        }
      },
      getLotteryS () {
        let t = this;
        let param = {
          project: 'zyyhzx',
          actCode: 'zyyhzx',
          userId: window.BL.userId,
          orderStatus: 1,
          // useTimes: useTimes, // int
          // level: 5, // 不传后台自动匹配
        };
        t.$parent.showLoad = true;
        t.$http.post(window.BL.apiUrl + t.$parent.middleApi + '/act/coin/lottery', param).then(({data}) => {
          // t.$parent.log(data);
          t.$parent.showLoad = false;
          if (data.code === 10000000) {
            if (data.prizeLevel === 0) {
              t.goUrl('/redResults/F/0');
            } else if (data.prizeLevel > 0) {
              t.goUrl('/redResults/S/' + data.prizeLevel);
            }
          } else {
            t.$parent.alert('提示', data.text, () => {
              // t.goUrl('/zyyhIndex');
            });
          }
        })

        // t.goUrl('/redResults/S');
        // t.goUrl('/redResults/F');
      },
      getLotteryF () {
        let t = this;
        let param = {
          project: 'zyyhzx',
          actCode: 'zyyhzx',
          userId: window.BL.userId,
          orderStatus: 1,
          useTimes: 1, // int
          level: 5, // 不传后台自动匹配
        };

        t.$http.post(window.BL.apiUrl + t.$parent.middleApi + '/act/coin/lottery', param).then(({data}) => {
          // t.$parent.log(data);
          if (data.code === 10000000) {
          } else {
            t.$parent.alert('提示', data.text, () => {
              // t.goUrl('/zyyhIndex');
            });
          }
        })
      }
    },
    mounted() {
      this.showSuccess = this.$route.params.flag;
      this.sNum = this.$route.params.num;
      this.fNum = this.$route.params.num;
      if (this.showSuccess === 'F') {
        this.getLotteryF();
      }
    },
    created() {
      window.BL.setTitle('答题结果');
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
  @import '../../assets/zyyh/answerResults.less';
</style>
