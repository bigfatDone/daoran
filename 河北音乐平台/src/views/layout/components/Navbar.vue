<template>
  <div>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <!-- <breadcrumb class="breadcrumb-container"></breadcrumb> -->

    <div class="right-menu">
      <!--<div class=""><a href="/manual/index.html" target="_blank"><i class="fa fa-book"></i></a></div>-->
      <div class="book"><a href="/cms/manual/index.html" target="_blank"><i class="fa fa-book"></i></a></div>
<!--      <el-popover
        placement="bottom"
        width="230"
        trigger="click">
        <div class="links">
          &lt;!&ndash;<a href="http://192.168.1.96:9061/jit_pms" target="_blank">&ndash;&gt;
          <a href="http://oms.daoran.tv" target="_blank">
            <img src="@/assets/imgs/yy.png">
            <span>运营管理</span>
          </a>
          &lt;!&ndash;<a href="http://192.168.1.96:9081/cms" target="_blank">&ndash;&gt;
          <a href="http://cms.daoran.tv" target="_blank">
            <img src="@/assets/imgs/nr.png">
            <span>内容管理</span>
          </a>
          &lt;!&ndash;<a href="#" target="_blank">&ndash;&gt;
          <a href="http://crm.daoran.tv" target="_blank">
            <img src="@/assets/imgs/yh.png">
            <span>客户关系</span>
          </a>
          &lt;!&ndash;<a href="#" target="_blank">&ndash;&gt;
          <a href="http://tag.daoran.tv" target="_blank">
            <img src="@/assets/imgs/bq.png">
            <span>标签系统</span>
          </a>
          &lt;!&ndash;<a href="http://192.168.1.96:9051/ms_bls" target="_blank">&ndash;&gt;
          <a href="http://bls.daoran.tv" target="_blank">
            <img src="@/assets/imgs/js.png">
            <span>结算系统</span>
          </a>
          &lt;!&ndash;<a href="http://192.168.1.96:9031/ms_bas" target="_blank">&ndash;&gt;
          <a href="http://bi.daoran.tv" target="_blank">
            <img src="@/assets/imgs/jf.png">
            <span>经分系统</span>
          </a>
        </div>
        &lt;!&ndash;<span class="fa fa-th toolBtn" slot="reference"></span>&ndash;&gt;
        <div class="squareBtn" slot="reference"></div>
        &lt;!&ndash; <el-button slot="reference" circle size="mini" icon="fa fa-th"></el-button> &ndash;&gt;
      </el-popover>-->
      <!--<div class="toolBtn" slot="reference">-->
        <!--<span>1111</span>-->
      <!--</div>-->
      <el-popover
        placement="bottom"
        width="400"
        @show="msgUp"
        trigger="click">
        <div class="msgSend">
          <div style="left: 300px;position: relative; color: #20b5f3;margin-bottom: 10px;cursor: pointer" @click="sendParams()">查看全部</div>
          <el-row>
          <el-table
            :data="dataList"
            border
            class="msgConent"
            empty-text="暂无数据">
            <el-table-column
              label="消息列表">
              <template slot-scope="scope">
                <p class="m_title">{{scope.row.title}}</p>
                <p v-html="scope.row.content"></p>
                <p>{{scope.row.createDate}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        </div>
        <!--<span class="fa fa-th toolBtn" slot="reference"></span>-->
        <div class="toolBtn" slot="reference"><span  v-if="msgCount !== '0'" class="msgCount">{{msgCount}}</span></div>
        <!-- <el-button slot="reference" circle size="mini" icon="fa fa-th"></el-button> -->
      </el-popover>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar" v-if="avatar!==''">
          <!-- <el-button circle size="mini">
            <i class="fa fa-user"></i>
          </el-button> -->
          <!--<span class="fa fa-user toolBtn"></span>-->
          <span class="userBtn"></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div  @click="savePassword">
              <i class="fa fa-key"></i> 修改密码
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
    <!--弹窗，修改密码-->
    <el-dialog
      width="586px"
      :append-to-body="true"
      :title="dialog.title"
      :visible.sync="dialog.show"
      @close="dialogClose">
      <el-form
        status-icon
        ref="dialogForm"
        :rules="passwordRules"
        :model="dialogForm"
        :label-width="dialog.formLabelWidth"
        size="mini">
        <el-form-item prop='oldPassword' label="当前密码:">
          <div class="w400">
            <el-input  v-model="dialogForm.oldPassword" placeholder="输入旧密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop='newPassword' label="新密码:">
          <div class="w400">
            <el-input  type="password" v-model="dialogForm.newPassword" placeholder="输入新密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop='newPasswordToo' label="再次输入:">
          <div class="w400">
            <el-input  type="password" v-model="dialogForm.newPasswordToo" placeholder="再次输入新密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item  class="config_right rightBtn" style="position: relative;right: -274px;bottom:-14px;">
          <el-button type="primary" size="mini" @click="dialogFormSubmit('dialogForm')">提交</el-button>
          <el-button size="mini" @click="dialog.show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  data (){
    var validateOde = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'));
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.dialogForm.newPasswordToo !== '') {
          this.$refs.dialogForm.validateField('newPasswordToo');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.dialogForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      dialog: {
        width:'400px',
        show : false,
        title: '修改密码',
        formLabelWidth:'120px'
      },
      dialogForm:{
        oldPassword    : '',
        newPassword    : '',
        newPasswordToo : '',
      },
      editLoading: false,
      passwordRules: {
        oldPassword: [
          { validator: validateOde, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPasswordToo: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
      url: {
        getUserName : "/cms/api/getUserName.do",
        unreadMessageNum : "/cms/api/system/unreadMessageNum.do",
        mineMessage : "/cms/api/system/mineMessage.do",
        updateMessage : "/cms/api/system/updateMessage.do",
      },
      userName: '',
      msgCount: '0',
      dataList: [],
    }
  },
  components: {
    // Breadcrumb,
    Hamburger,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  mounted () {
     this.getUserName();
  },
  watch:{
    $route: function () {
      let route = this.$router.history.current.path;
      route = route.substr(1);

    }
  },
  methods: {
    // 消息推送
    msgUp () {
      this.updateMessage(this.userName);
    },
    getUserName () {
      let that = this;
      let parmas = {};

      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.getUserName,
        method:'post',
        data: ''
      }).then(res=>{
        that.userName = res.data.data.userName;
        that.unreadMessageNum(that.userName);
        that.mineMessage(that.userName);
      }).catch(err=>{
        console.log(err);
      })
    },
    unreadMessageNum (id) {
      let that = this;
      // let parmas = {jsonParam: JSON.stringify({userName: id, moduleName: 'cms'})};
      let parmas = {userName: id, moduleName: 'cms'};

      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.unreadMessageNum,
        method:'post',
        data: this.Qs.stringify(parmas)
      }).then(res=>{
        if ( parseInt(res.data.obj.count) > 99 ){
          that.msgCount = "99+";
        } else {
          that.msgCount = res.data.obj.count.toString();
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    mineMessage (id) {
      let that = this;
      let parmas = {userName: id, moduleName: 'cms'};

      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.mineMessage,
        method:'post',
        data: this.Qs.stringify(parmas)
      }).then(res=>{
        res.data.obj.forEach( i => {
          let arr = i.content.replace(/\n/g, "<br/>");
          i.content = arr;
          that.dataList.push(i);
        })
      }).catch(err=>{
        console.log(err);
      })
    },
    updateMessage (id) {
      let that = this;
      let parmas = {userName: id, moduleName: 'cms'};

      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.updateMessage,
        method:'post',
        data: this.Qs.stringify(parmas)
      }).then(res=>{
        that.msgCount = '0';
      }).catch(err=>{
        console.log(err);
      })
    },
    sendParams () {
      document.body.click();
      this.$router.push({ path: '/message'});
    },
    //其他
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    savePassword () {
      this.dialog.title = '修改密码';
      this.dialog.show  = true;
    },
    dialogClose () {
      let that = this;
      for (let i in that.dialogForm) {
        that.dialogForm[i] = '';
      }
    },
    dialogFormSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let params;
          let param = {
            oldPassword: that.dialogForm.oldPassword,
            newPassword: that.dialogForm.newPassword,
            newPasswordToo: that.dialogForm.newPasswordToo,
          };
          that.editLoading = true;
          params = {jsonParam: JSON.stringify(param)};
          this.axios({
            headers: {
              'deviceCode': 'A95ZEF1-47B5-AC90BF3'
            },
            url: '/cms/api/updatePassword.do',
            method:'post',
            data: this.Qs.stringify( params ),
          }).then(res => {
            if (res.data.success) {
              setTimeout((e) => {
                that.$notify({
                  type: 'success',
                  message: '修改成功'
                });
                that.editLoading = false;
                that.dialog.show = false;
              }, 500);
            }else {
              that.editLoading = false;
              that.$notify({
                type: 'warning',
                message: res.data.msg
              });
            }
          }).catch(err=>{
            console.log(err);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style>
.navbar {
  color: #fff !important;
  background: none !important;
  border: none !important;
}
</style>
<style lang="less" scoped>
.links {
  text-align: center;
}
.links > a{
  display: inline-block;
  margin: 12px 12px;
  width: 75px;
  overflow: hidden;
  position: relative;
  border-radius: 5px;
  border: 1px solid #fff;
}
.links > a img {
  max-width: 100%;
  max-height: 100%;
}
.links > a:hover {
  border-color: #ccc;
}
.squareBtn{
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  color: #fff;
  background-image: url('../../../assets/imgs/bg.png');
  background-position: 52px 2031px;
  margin: 14px;
  padding: 0 2px;
  margin-right: 10px;
}
.book{
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  color: #ffffff;
  margin: 14px;
  padding: 0 2px;
  margin-right: 10px;
  line-height: 20px;
}
.toolBtn{
  width: 20px;
  height: 20px;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  color: #fff;
  background-color: #fff;
  background-image: url('../../../assets/imgs/bg.png');
  background-position: 92px 237px;
  margin: 15px;
  padding: 0 2px;
  .msgCount {
    display: inline-block;
    width: 17px;
    height: 14px;
    background: red;
    position: relative;
    top: -32px;
    left: 13px;
    border-radius: 20%;
    line-height: 15px;
    font-size: 13px;
    text-align: center;
  }
}
.userBtn{
  width: 28px;
  height: 28px;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  color: #fff;
  background-color: #fff;
  background-image: url('../../../assets/imgs/bg.png');
  background-position: 52px 288px;
  margin: 5px;
  padding: 0 2px;
}
.navbar {
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  color: #fff !important;
  .hamburger-container {
    line-height: 60px;
    height: 60px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    margin: 0 10px 0 0;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      .circle{
        display: inline-block;
        border:1px solid #e6e6e6;
        .svgIcon{
          vertical-align: inherit;
        }
      }
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        text-align: center;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 28px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .rightBtn {
    position: absolute;
    right:10px;
    bottom:5px;
  }
}
  .msgSend {
    .msgConent{
      width: 400px;
      max-height: 490px;
      overflow: auto;
      font-size: 12px;
    }
    p:nth-child(1) {
      font-weight: bold;
    }
  }
</style>
