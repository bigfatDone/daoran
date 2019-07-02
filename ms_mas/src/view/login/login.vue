<template>
  <div class="login-box">
    <el-form :inline="false" :model="formData" class="demo-form-inline">
      <el-form-item label="账号">
        <el-input ref="account" v-model="formData.userName" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input 
          type="password" 
          v-model="formData.password" 
          placeholder="密码"
          @keyup.enter.native="login"></el-input>
      </el-form-item>
      <!--<el-form-item label="验证码">-->
        <!--<el-input v-model="formData.captcha" placeholder="验证码"></el-input>-->
        <!--<span><img id="captcha" @click="refresh" src="http://192.168.1.162:9003/ms_bas/captcha.bmp"></span>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'gather',
    components: {
    },
    data () {
      return {
        formData:{
          _csrfToken:'',
          userName:'',
          password:'',
          captcha:'',
          orgId:''
        }
      }
    },
    mounted () {
      this.loginInit();
      this.$refs.account.focus();
    },
    methods: {
      login () {
        let that = this;
        this.$ajax({
          lable: "login",
          url: "/ms_bas/checkuser",
          data: that.formData,
          method: "post",
          success: function (response) {
            if (response.data.success === true){
              that.$store.commit('changeLoginState', true);
              that.$router.push({path:'home'});
            }else {
              that.$message.warning(response.data.msg);
            }
            //that.refresh();
          },
          error: function (err) {
            console.log("------error-----");
            console.log(err);
          }
        });
      },
      refresh(){
        document.getElementById('captcha').src = "http://192.168.1.162:9003/ms_bas/captcha.bmp?flag=" + Math.random();
      },
      loginInit(){
        let that = this;
        
        that.$ajax({
          lable: "login",
          url: "/ms_bas/getToken",
          data: {},
          method: "post",
          success: function (response) {
            that.formData._csrfToken=response.data._csrfToken;
          },
          error: function (err) {
            console.log(err);
            that.$message.error('页面获取有问题，请刷新页面');
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-box{
    width: 300px;
    margin: 10px auto;
  }
  #captcha{
    cursor: pointer;
    margin-top: 5px;
  }
</style>
