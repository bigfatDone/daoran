<template>
  <div class="exception_page">
    <h1><i class="el-icon-circle-close"></i> </h1>
    <h3>嗨呀！页面好像不存在…</h3>
    <p><el-button type="text" class="font-index" @click="goIndex">返回首页</el-button><span class="time">{{time}}</span></p>
  </div>
</template>

<script>
  export default {
    name: 'exception_404',
    components: {
    },
    data () {
      return {
        time:'5'
      }
    },
    computed: {
      loaclPath () {
        return '/home';
//        return this.$sidebar;
      },
    },
    mounted () {
      this.timeOut();
    },
    methods: {
      goIndex(){
        this.$router.push({ path: this.loaclPath,query: {} });
      },
      timeOut(){
        let that = this;
        let time =5;
        let timeOut = setInterval(function () {
          if(time!==0){
            time--;
          }else {
            window.clearInterval(timeOut);
            that.goIndex();
          }
          that.time = time;
        }, 1000);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .exception_page{
    text-align: center;
    margin-top: 25%;
  }
  .exception_page h1{
    color: #F56C6C;
  }
  .time{
    margin-left: 1rem;
  }
  .font-index{
    font-size: 1rem;
  }
</style>
