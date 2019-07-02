<template>
  <div class="re_login">
    <h1><i class="el-icon-circle-close"></i> </h1>
    <h3>登录已失效，请重新登录</h3>
    <p>{{seconds}}秒后自动刷新</p>
    <p><el-button @click="refres">马上刷新</el-button></p>
    <!-- <p><el-button @click="login">马上重新登录</el-button></p> -->
  </div>
</template>

<script>
  export default {
    name: 're_login',
    data () {
      return {
        seconds: 5,
      }
    },
    mounted () {
      this.autoPath();
    },
    methods: {
      refres () {
        history.go(-1);
      },
      autoPath () {
        let that = this;
        let o = null;
        
        o = setInterval( () => {
          if (that.seconds > 0) {
            that.seconds = that.seconds - 1;
          } else {
            clearInterval(o);
            history.go(-1);
          }
        }, 1000);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .re_login{
    text-align: center;
    margin-top: 25%;
  }
  .re_login h1{
    color: #F56C6C;
  }
  .time{
    margin-left: 1rem;
  }
  .font-index{
    font-size: 1rem;
  }
</style>
