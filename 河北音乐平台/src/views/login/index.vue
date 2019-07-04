<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="username">
        <i class="userName"></i>
        <span class="svg-container svg-container_login user"></span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入您的账号" />
      </el-form-item>

      <el-form-item prop="password">
        <i class="password"></i>
        <span class="svg-container"></span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入您的密码" />
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;"  @click.native.prevent="handleLogin">提交</el-button>

    </el-form>


  </div>
</template>

<script>

export default {
  name: 'login',
  data () {

    return {
      loginForm: {
        username: '',
        password: ''
      },
      passwordType: 'password',
      axios: this.$root.axios,
      Qs: this.$root.Qs,
    }
  },
  methods: {

    handleLogin () {
      const that = this;
      const user = {
        account:that.loginForm.username,
        password: that.loginForm.password
      };
      that.$store.commit('userInfoChange','')
      this.$ajax({
        url: '/cms/api/checkuser.do',
        method: "post",
        data:  this.Qs.stringify(user),
        success: function (res) {
          if(res.data.success){
            that.$message.success(res.data.msg);
            that.$router.push({path: "video"});
            that.$store.commit('userInfoChange',res.data.data.cpId)
          }else {
            that.$message.warning(res.data.msg);
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    }
  }
}
</script>

<style lang="less">
@bg: #2d3a4b;
@light_gray: #eee;
.borderRadio(@value: 10px) {
  -webkit-border-radius: @value;
  -moz-border-radius: @value;
  -ms-border-radius: @value;
  -o-border-radius: @value;
  border-radius: @value;
}
.userName{background: url("../../assets/imgs/usename.png") no-repeat 10px 8px; width: 50px;height: 50px;display: inline-block;position: absolute;left: 0;top: 0};
.password{background: url("../../assets/imgs/pass.png") no-repeat 10px 8px; width: 50px;height: 50px;display: inline-block;position: absolute;left: 0;top: 0};
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      &:-webkit-autofill{
        -webkit-box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: @bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px;
    margin: 120px auto;
    background-color: #3d5e8a;
    .borderRadio(8px);
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 9px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      color: #fff;
      text-indent: 20px;
      letter-spacing: 10px;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
