<template>
  <div class="lose" style="color: #000;">
    <h3 style="fontSize: 0.5rem; text-align: center; margin-top: 1rem;"></h3>
    <p style="fontSize: 0.3rem; text-align: center; margin-top: 0.1rem;">页面去旅行了！</p>
    <p style="fontSize: 0.2rem; text-align: center; margin-top: 0.1rem;">
      <a href="#">页面跳转中···</a>
    </p>
  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  // import {XButton} from 'vux'

  export default {
    data () {
      return {

      }
    },
    components: {
      // XButton
    },
    methods: {

    },
    mounted () {
      let t = this;
      window.setTimeout(() => {
        // t.$router.push({path: '/zyyhIndex'});
        if (window.BL.userInfo) {
          t.$router.replace({path: '/zyyhIndex'+'?userInfo='+window.BL.userInfo});
          // this.$router.replace({ path: url, query: { userInfo: window.BL.userInfo }});
        } else {
          t.$router.replace({path: '/zyyhIndex'});
        }
      }, 3000);
      // if (this.$parent.isTest) {
      //   this.$router.push({path: '/urlList'});
      // } else if (this.$parent.isJJL) {
      //   this.$router.push({path: '/newHome'});
      // }
    },
    created () {

    },
    watch: {
      $route (to, from) {
        // console.log(to)
      }
    }
  }
</script>
<style lang='less'>
  /*@import '../../assets/vote/voteRouter.less';*/
</style>
