<template>
  <div class="redResults">
    <div class="backfix"></div>

    <div class="red_successbox" v-if="zFlag==='S'">
      <div class="top_tip">
        <div class="imgbox">
          <img src="../../assets/zyyh/imgs/lottery_bg_title_victory2.png" alt="" />
        </div>

        <div class="grade">{{grade}}</div>

        <p class="tip">未填写将被视为放弃领奖资格。</p>
        <!--<div class="imgbox2">
          <img src="../../assets/zyyh/imgs/lottery_bg_victory.png" alt="" />
        </div>-->
      </div>

      <div class="inputbox">
        <!--<div class="sfzbox">
          <div class="imgbox">
            <img src="../../assets/zyyh/imgs/lottery_bg_input_ID_victory.png" alt="" />
          </div>
          <div class="sfz">
            <input id="insfz" type="text" v-model="sfID" placeholder="输入你的身份证号码" maxlength="18" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" />
          </div>
        </div>-->

        <div class="phonebox">
          <div class="imgbox">
            <img src="../../assets/zyyh/imgs/lottery_bg_input_tel_victory.png" alt="" />
          </div>
          <div class="sfz">
            <input id="phonefz" type="text" v-model="phoneNum" placeholder="输入你的手机号码" maxlength="11" />
          </div>
        </div>
      </div>

      <div class="btnbox_com mt">
        <div class="btn" @click.stop="addContact()">立即提交</div>
      </div>
    </div>


    <div class="red_failingbox" v-if="zFlag==='F'">
      <div class="top_tip">
        <div class="imgbox">
          <img src="../../assets/zyyh/imgs/lottery_bg_title_fail.png" alt="" />
        </div>

        <div class="imgbox3">
          <img src="../../assets/zyyh/imgs/lottery_bg_fail.png" alt="" />
        </div>
      </div>

      <div class="btnbox_com mt2">
        <div class="btn" @click.stop="goUrl('/zyyhIndex')">重新答题</div>
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
        zFlag: 'F',
        grade: '',
        gradeNum: '',
        sfID: '',
        phoneNum: '',
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
      addContact () {
        let t = this;
        // let id = t.sfID;
        let phone = t.phoneNum;
        if (phone === '') {
          t.$parent.alert('提示', '请将信息填写完整！');
          return;
        }
        let regP = /^1\d{10}$/;
        if (!regP.test(phone)) {
          t.$parent.alert('提示', '手机号码不正确！');
          return;
        }
        /*let regSf = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        if (!regSf.test(id)) {
          t.$parent.alert('提示', '身份证号码不正确！');
          return;
        }*/

        let param = {
          userId: window.BL.userId,
          actCode: 'zyyhzx',
          tel: phone
        };

        t.$parent.showLoad = true;
        t.$http.post(window.BL.apiUrl + t.$parent.middleApi + '/act/coin/contacts/add', param).then(({data}) => {
          t.$parent.showLoad = false;
          // t.$parent.log(data);
          if (data.code === 10000000) {
            t.goUrl('/share/' + t.gradeNum);
          } else {
            t.$parent.alert('提示', data.text, () => {
              // t.goUrl('/zyyhIndex');
            });
          }
        })
      }
    },
    mounted() {
      this.zFlag = this.$route.params.flag;
      this.gradeNum = this.$route.params.grade;
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
      this.phoneNum = window.BL.tel;
    },
    created() {
      window.BL.setTitle('抽奖结果');
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
  @import '../../assets/zyyh/redResults.less';
</style>
