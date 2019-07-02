<template>
  <div class="rule">
    <div class="bg"></div>

    <div class="rule_bubox">
      <div class="bu_box">
        <div class="ohy">
          <div class="box">
            <div class="title">活动时间</div>
            <div class="content">2018年6月5日-2018年6月14日</div>
          </div>

          <div class="box">
            <div class="title">活动规则</div>
            <div class="content">系统随机从征信题库抽取10道问题（均为选择题），每题有30秒作答时间，超时将会自动判错。<span class="redtip">答对6道及以上即可获得1次抽奖机会。</span>每个微信号每天只限答题3次。</div>
          </div>

          <div class="box">
            <div class="title">奖项设置</div>
            <div class="content">1、一等奖10名，二等奖20名，三等奖50名，优秀奖500名。</div>
            <div class="content">2、中奖者如将中奖信息转发到朋友圈并集满50个赞，可再领取精美礼品一份。</div>
          </div>

          <div class="box">
            <div class="title">领取方式</div>
            <div class="content">1、领取时间：2018年6月10日-2018年6月19日。请及时领取，逾期不候。</div>
            <div class="content">2、领取地点：中原银行建东支行--永续贷中心（万达广场西侧50米）</div>
            <div class="content">3、领取凭证：一二三等奖及优秀奖凭参与答题的手机号领取（现场可打通电话）；转发集赞凭截图领取</div>
          </div>

          <div class="box">
            <div class="bq_tip">*本次活动最终解释权归主办方所有。</div>
          </div>
        </div>
      </div>

      <div class="close" @click.stop="goUrl('/zyyhIndex')">
        <img src="../../assets/zyyh/imgs/rulepage_btn_cancel.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  // import {XButton} from 'vux'

  export default {
    data() {
      return {
        list: [],

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
    },
    mounted() {
    },
    created() {
      window.BL.setTitle('活动规则');
      if (!window.BL.indexIn) {
        // this.goUrl('/zyyhIndex');
      }
    }
  }
</script>
<style lang='less'>
  @import '../../assets/zyyh/rule.less';
</style>
