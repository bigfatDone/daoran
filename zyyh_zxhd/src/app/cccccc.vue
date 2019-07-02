<template>
  <div class="">

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
    methods: {},
    mounted() {

    },
    created() {
      window.BL.setTitle('征信伴我行');
    },
    watch: {
      $route(to, from) {
        // console.log(to)
      }
    }
  }
</script>
<style lang='less'>
  /*@import '../../assets/zyyh/rule.less';*/
</style>
