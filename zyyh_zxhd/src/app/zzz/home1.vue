<template>
  <div class="home1">
    home1
  </div>
</template>

<script>
  // import Openapp from './openApp'

  import {Swiper, SwiperItem} from 'vux'

  export default {
    data () {
      return {
        list: [],
        imgUrl: window.BL.baseImgUrl,
        index: 0
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {

    },
    mounted () {

    },
    created () {
      window.BL.setTitle('首页');
      // this.$parent.showOpenApp2 = false;
    },
    watch: {
      $route (to, from) {
        // console.log(to);
        // console.log(from);
      }
    }
  }
</script>
<style lang='less'>
  /*@import '../../assets/zzz/home1.less';*/
</style>
