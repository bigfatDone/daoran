<template>
  <div class="header-main">
    <div class="logo">
      经营分析系统
    </div>
    <div class="header-menu">
      <!-- <span class="user-msg" v-if="usermsg">{{usermsg.userName}}, {{usermsg.roleName}}</span> -->
      <top-menu></top-menu>
      <span class="user-msg" v-if="usermsg">
        <el-popover
          placement="bottom"
          width="162"
          trigger="click">
          <div class="more-link">
            <p class="head-item" @click="editPassword"><i class="el-icon-edit"></i> 修改密码</p>
          </div>
          <span class="userEdit" slot="reference">{{usermsg.userName}}</span>
        </el-popover>
      </span>
      <span class="mobile-menu-btn el-icon-search search" @click="searchBox"></span>
      <span class="mobile-menu-btn el-icon-more" @click="mobileMenuToggle"></span>
    </div>
    <!--修改密码-->
    <el-dialog
      title="修改密码"
      append-to-body
      :visible.sync="dialog"
      custom-class="dailog-min-max"
      @closed="clearPassword">
      <el-form :model="dialogForm" status-icon :rules="rules" ref="pwsDialog" label-width="100px">
        <el-form-item label="原密码" prop="password_old">
          <span>
            <el-input type="password" v-model="dialogForm.password_old" auto-complete="off"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="输入新密码" prop="password_new_1">
          <span>
            <el-input type="password" v-model="dialogForm.password_new_1" auto-complete="off"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="确认新密码" prop="password_new_2">
          <span>
            <el-input ref="password_sure" type="password" v-model="dialogForm.password_new_2" auto-complete="off"></el-input>
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button @click="changePassword_sure" type="primary" :disabled="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import topMenu from './topMenu'
export default {
  name: 'vHeader',
  components: {
    topMenu
  },
  data () {
    let that = this;
    let validate = {
      password_old (rule, value, callback) {
        if (value.length <= 0) {
          callback(new Error('请输入原密码'));
        } else {
          callback();
        }
      },
      password_new_1 (rule, value, callback) {
        if (value.length <= 5 || value.length > 20) {
          callback(new Error('密码长度需要在6~20个字符之间'));
        } else {
          if (that.dialogForm.password_new_2.length > 0) {
            that.$refs.password_sure.focus();
            setTimeout(function () {
              that.$refs.password_sure.blur();
            }, 0);
          }
          callback();
        }
      },
      password_new_2 (rule, value, callback) {
        if (value.length <= 5 || value.length > 20) {
          callback(new Error('密码长度需要在6~20个字符之间'));
        } if (that.dialogForm.password_new_2 != that.dialogForm.password_new_1) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      }
    };
    return {
      url: {
        getUserMsg: "/ms_bas/UserMassageByUserId",
        editPassword: "/ms_bas/userself/save/newpwd",
      },
      usermsg: null,
      loading: false,
      dialog: false,
      dialogForm: {
        password_old: "",
        password_new_1: "",
        password_new_2: "",
      },
      rules: {
        password_old: [
          { required: true, validator: validate.password_old, trigger: "blur" }
        ],
        password_new_1: [
          { required: true, validator: validate.password_new_1, trigger: "blur" }
        ],
        password_new_2: [
          { required: true, validator: validate.password_new_2, trigger: "blur" }
        ],
      }
    }
  },
  mounted () {
    let that = this;
    that.getUserMsg();
  },
  methods: {
    sendNewPassword () {
      let that = this;
      let param = {
        password: that.dialogForm.password_old,
        newpassword: that.dialogForm.password_new_1,
      };
      that.loading = true;
      that.$ajax({
        url: that.url.editPassword,
        data: param,
        method: "post",
        success: function (res) {
          if (res.data.success) {
            that.$message({
              type: "success",
              message: res.data.msg
            })
            that.dialog = false;
          } else {
            that.$message({
              type: "error",
              message: res.data.msg
            })
          }
          that.loading = false;
        },
        error: function (err) {
          that.$message.error('请求失败搜索条件，请刷新页面');
          that.loading = false;
        }
      })
    },
    changePassword_sure () {
      let that = this;

      that.$refs.pwsDialog.validate((valid) => {
        if (valid) {
          that.sendNewPassword();
        }
      });
    },
    clearPassword () {
      let that = this;
      for (let item in that.dialogForm) {
        that.dialogForm[item] = "";
      }
      that.$refs.pwsDialog.resetFields();
    },
    editPassword () {
      let that = this;
      document.body.click();
      that.dialog = true;
    },
    getUserMsg () {
      let that = this;

      that.$ajax({
        url: that.url.getUserMsg,
        data: {code: "ms_bas"},
        method: "post",
        success: function (res) {
          if (res.data.data) {
            that.usermsg = res.data.data;
          }
        },
        error: function (err) {
          that.$message.error('无法获取用户信息，请稍后刷新页面重试');
        }
      })
    },
    mobileMenuToggle () {
      let that = this;
      that.$emit("mobileMenu", true);
    },
    searchBox() {
      let that = this;
      that.$store.commit('changeMobileSearchState', true);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-main{
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;
  }
  .logo{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: 0 0 0 0.5rem;
    font-size: .9rem;
    line-height: 3rem;
    font-weight: bold;
    background: url(../../../img/logo.svg) no-repeat .5rem center;
    background-size: 1.4rem auto;
    text-indent: 2.3rem;
    letter-spacing: 1px;
  }
  .header-menu{
    position: absolute;
    right: .5rem;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }
  .header-menu span.search{
    margin: 0 1rem 0 1rem;
  }
  .user-msg{
    display: inline-block;
    margin: 0;
    /* max-width: 3rem; */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: .7rem;
    color: #fff;
  }
  .userEdit{
    cursor: pointer;
    opacity: .9;
  }
  .userEdit:hover{
    opacity: 1;
  }
  .head-item{
    padding: .2rem .1rem;
    margin: 0;
    cursor: pointer;
  }
  .head-item:hover {
    color: #409EFF;
  }
</style>
