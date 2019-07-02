<template>
  <div class="userManage_table">
    <div style="padding: 1rem 0;">
      <el-button @click="editUserName(null)" type="primary" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table-box">
      <el-table
        ref="singleTable"
        :data="table_data.rows"
        :max-height="tableHeight"
        border
        stripe
        cell-class-name="text-center"
        header-cell-class-name="text-center"
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          :index="indexMethod"
          label="序号"
          width="45">
        </el-table-column>
        <el-table-column
          fixed
          label="用户名"
          min-width="120">
          <template slot-scope="scope">
            <span class="username" @click="editUserName(scope.row)">{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="realName"
          label="真实姓名"
          min-width="100">
        </el-table-column>
        <el-table-column
          property="userKey"
          min-width="100"
          label="角色">
        </el-table-column>
        <el-table-column
          property="createDate"
          label="创建时间"
          min-width="145">
        </el-table-column>
        <!--   这部分权限控制移交SSO后，不需要显示和功能操作
        <el-table-column
          min-width="80"
          label="状态">
          <template slot-scope="scope">
            {{scope.row.status == 1 ? "激活" : "未激活"}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-if="scope.row.status == 0" @click="changeState('on', scope.row)">激活</el-button>
              <el-button v-else @click="changeState('off', scope.row)">锁定</el-button>
              <el-button @click="changePassword(scope.row)">重置密码</el-button>
            </el-button-group>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="tableData.current"
        @current-change="changePage($event)"
        :pager-count=5
        :page-size="20"
        :total="table_data.total">
      </el-pagination>
    </div>

    <el-dialog
      title="确认操作"
      :visible.sync="dialog_stateChange"
      width="400px">
      <div v-if="dialog_stateChange">
        确认<span class="dialog_del_name">{{state.switch == "off" ? "锁定" : "激活"}}</span>用户<span class="dialog_del_name">{{state.obj.realName}}</span>吗?
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_stateChange = false">取 消</el-button>
        <el-button @click="dialog_stateChange_sure" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!--   SSO统一登录后，重置密码功能停用
    <el-dialog
      title="修改密码"
      :visible.sync="dialog_password_panel"
      width="400px"
      @close="clearPassword">
      <el-form :model="dialogForm" status-icon :rules="rules" ref="pwsDialog" label-width="100px">
        <el-form-item label="输入新密码" prop="password">
          <span>
            <el-input type="password" v-model="dialogForm.password" auto-complete="off"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="确认新密码" prop="password2">
          <span>
            <el-input ref="password_sure" type="password" v-model="dialogForm.password2" auto-complete="off"></el-input>
          </span>
        </el-form-item>
      </el-form>-->
      <!-- <div class="psw-item">
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入新密码">
        </el-input>
      </div>
      <div class="psw-item">
        <el-input
          v-model="password2"
          type="password"
          placeholder="确认新密码">
        </el-input>
      </div> -->
    <!--
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_password_panel = false">取 消</el-button>
        <el-button @click="changePassword_sure" type="primary">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
  export default {
    name: 'userManage_table',
    props: ["tableData", "passWordChange"],
    data () {
      let that = this;
      let validate = {
        password (rule, value, callback) {
          if (value.length <= 5 || value.length > 20) {
            callback(new Error('密码长度需要在6~20个字符之间'));
          } else {
            if (that.dialogForm.password2.length > 0) {
              that.$refs.password_sure.focus();
              setTimeout(function () {
                that.$refs.password_sure.blur();
              }, 0);
            }
            callback();
          }
        },
        password2 (rule, value, callback) {
          if (value.length <= 5 || value.length > 20) {
            callback(new Error('密码长度需要在6~20个字符之间'));
          } if (that.dialogForm.password2 != that.dialogForm.password) {
            callback(new Error('两次密码不一致'));
          } else {
            callback();
          }
        }
      };

      return {
        pageIndex: 1,
        dialog_stateChange: false,
        state: {
          switch: "",
          obj: {},
        },

        dialog_password_panel: false,
        dialog_password_obj: {},
        password: "",
        password2: "",
        tableHeight: 0,

        dialogForm: {
          password: "",
          password2: "",
        },
        rules: {
          password: [
            { required: true, validator: validate.password, trigger: "blur" }
          ],
          password2: [
            { required: true, validator: validate.password2, trigger: "blur" }
          ],
        }
      };
    },
    computed: {
      table_data () {
        return this.tableData;
      },
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    watch: {
      passWordChange (event) {
        this.dialog_password_panel = false;
      },
    },
    created () {
      this.getBodyHeight();
    },
    mounted () {

    },
    methods: {
      getBodyHeight () {
        let that = this;
        let state = false;
        if (document.body.clientWidth<=800){
          state=true;
        }else {
          state=false;
        }
        that.tableHeight = document.body.clientHeight - (state===true ? 240 : 320);
      },
      clearPassword () {
        let that = this;
        that.password = "";
        that.$refs.pwsDialog.resetFields();
      },
//      changePassword_sure () {
//        let that = this;
//        let param = {id: that.dialog_password_obj.id, password: that.dialogForm.password};
//
//        that.$refs.pwsDialog.validate((valid) => {
//          if (valid) {
//            that.$emit("password", param);
//          }
//        });
//      },
//      changePassword (obj) {
//        let that = this;
//
//        that.dialog_password_panel = true;
//        that.dialog_password_obj = obj;
//      },
      dialog_stateChange_sure () {
        let that = this;

        that.$emit("stateChange", that.state);
        that.dialog_stateChange = false;
      },
//      changeState (state, obj) {
//        let that = this;
//
//        that.state.switch = state;
//        that.state.obj = obj;
//        that.dialog_stateChange = true;
//      },
      changePage(val){
        let that = this;
        that.pageIndex = val;
        that.$emit("pageChange", val);
      },
      indexMethod(index){
        let that = this;
        return index + 1 + (that.pageIndex - 1) * 20;
      },
      editUserName (data) {
        let that = this;
        let obj = {};

        if (data == null) {
          that.$emit("editUserName", null);
        } else {
          for (let item in data) {
            if (item == "userOrgList.tsDepart.departname") {
              obj.departname = data[item];
            } else {
              obj[item] = data[item];
            }
          }

          that.$emit("editUserName", obj);
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pagination-box{
    padding: 1rem 0;
    text-align: center;
  }
  .username {
    color: #24b6ff;
    cursor: pointer;
  }
  .username:hover {
    color: #e6a23c;
    text-decoration: underline;
  }
  .dialog_del_name{
    display: inline-block;
    font-weight: bold;
    padding: 0 .3rem;
    color: #000;
  }
  .psw-item{
    margin: .5rem 0 0 0;
  }
  .psw-item:first-child{
    margin-top: 0;
  }
</style>
