<template>
  <div class="urlList">
    <h3 class="title">导航页</h3>
    <ul class="list">
      <li v-for="(el, index) in list" @click="goUrl(el.url, index)">{{index+1}}.{{el.name}}</li>
    </ul>
    <!-- <h1>书看的鬼斧神工的根深蒂固</h1>
    <h2>书看的鬼斧神工的根深蒂固</h2>
    <h3>书看的鬼斧神工的根深蒂固</h3>
    <h4>书看的鬼斧神工的根深蒂固</h4>
    <h5>书看的鬼斧神工的根深蒂固</h5>
    <h6>书看的鬼斧神工的根深蒂固</h6> -->
    <!-- <div><font size="1" color="#00f">快速的挂号费</font></div> -->
  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  // import {XButton} from 'vux'

  export default {
    data () {
      return {
        list: [
          {name: '中原银行首页', url: '/zyyhIndex'},
          {name: '输入url', url: '/inputUrl'},
        ],

      }
    },
    components: {
      // XButton
    },
    methods: {
      goUrl (url, i) {
        this.$router.push({path: url});
        // console.log(i)
        // console.log(url)
      }
    },
    mounted () {
    },
    created () {
      window.BL.setTitle('导航');
    },
    watch: {
      $route (to, from) {
        // console.log(to)
      }
    }
  }
</script>
<style lang='less'>
  .urlList{
    .title{
      text-align: center;
      font-size: 0.18rem;
      line-height: 0.4rem;
    }
    .list{
      width: 100%;
      border-top: 1px solid #ddd;
      /*border-bottom: 1px solid #ddd;*/
      li{
        width: 100%;
        /*background: red;*/
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
        padding: 0.06rem 4%;
        font-size: 0.16rem;
        color: #000;
        line-height: 0.3rem;
      }
    }
  }
</style>
