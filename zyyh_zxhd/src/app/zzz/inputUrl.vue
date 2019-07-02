<template>
  <div class="inputUrl">
    <div class="inputbox">
      <input type="text" name="" v-model="intxt">
    </div>
    <div class="btn">
      <p @click="go()">确定</p>
    </div>
    <div class="btn">
      <p @click="go('list')">goList</p>
    </div>
    <div class="btn">
      <p @click="go('bd')">百度</p>
    </div>
  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  // import {XButton} from 'vux'

  export default {
    data () {
      return {
        list: [],
        intxt: ''

      }
    },
    components: {
      // XButton
    },
    methods: {
      go (type) {
        let t = this;
        if (type === 'list') {
          // this.$router.push({path: '/urlList'})
          window.location.href = 'http://192.168.1.150:9999/#/urlList';
        } else if (type === 'bd') {
          // this.$router.push({path: '/urlList'})
          window.location.href = 'https://www.baidu.com';
        } else {
          window.location.href = t.intxt;
        }
        // if (!this.$parent.isTest && t.intxt !== '') {
        //   window.AppCall.homeAppJunp(function () {}, {junpUrl: t.intxt});
        // } else {
        //   this.$router.push({path: '/urlList'})
        // }
      }
    },
    mounted () {

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
  .inputbox{
    width: 100%;
    margin: 0.2rem 0;
    input{
      display: block;
      width: 90%;
      margin: 0 auto;
    }
  }
  .btn{
    width: 100%;
    margin-bottom: 0.2rem;
    p{
      width: 0.5rem;
      height: 0.3rem;
      line-height: 0.3rem;
      margin: 0 auto;
      background: #8AF8F9;
      font-size: 0.18rem;
      text-align: center;
      border-radius: 5px;
    }
  }
</style>
