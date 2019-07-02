<template>
  <div class="roleManage-table">
    <el-button-group class="roleManage-table-btn">
      <el-button type="primary" icon="el-icon-plus" @click="roleAdd(false)">新增角色</el-button>
    </el-button-group>
    <el-table
      ref="roleManageTable"
      :data="tableData.rows"
      border
      stripe
      :max-height='height'
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%;">
      <el-table-column
        fixed
        type="index"
        label="序号"
        min-width="45">
      </el-table-column>
      <el-table-column
        fixed
        property="roleCode"
        min-width="100"
        label="角色编码">
      </el-table-column>
      <el-table-column
        property="roleName"
        label="角色名称"
        min-width="100">
      </el-table-column>
      <el-table-column
        label="角色类型"
        min-width="90">
        <template slot-scope="scope">
          {{dialog_userMsg_roleType[scope.row.roleType].roleName}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="195">
        <template slot-scope="scope">
          <el-button-group>
            <el-button @click="delUser(scope.row)" icon="el-icon-delete" title="删除"></el-button>
            <el-button @click="getUserList(scope.row)" icon="el-icon-tickets" title="用户列表"></el-button>
            <el-button @click="roleAdd(scope.row)" icon="el-icon-edit" title="编辑"></el-button>
            <el-button @click="getPowerList(scope.row)" icon="el-icon-setting" title="用户权限设置"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--新增/修改 用户-->
    <el-dialog
      :title="dialog_userMsg_text + '角色信息'"
      append-to-body
      :visible.sync="dialog_userMsg_panel"
      :before-close="dialog_userMsg_false"
      custom-class="dailog-min-max">
      <el-form :model="dialog_userMsg_data" status-icon ref="dialogForm" :rules="rules"  label-width="80px">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="dialog_userMsg_data.roleCode" type="text" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dialog_userMsg_data.roleName" type="text" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleType">
          <el-select v-model="dialog_userMsg_data.roleType" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dialog_userMsg_roleType"
              :key="item.value"
              :label="item.roleName"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_userMsg_false">取 消</el-button>
        <el-button @click="dialog_userMsg_save" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!--确认删除-->
    <el-dialog
      title="确认删除?"
      append-to-body
      :visible.sync="dialog_del_panel"
      custom-class="dailog-min-max">
      <div>
        确认删除<span class="dialog_del_name" v-if="dialog_del_obj.roleName">{{dialog_del_obj.roleName}}</span>吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_del_panel = false">取 消</el-button>
        <el-button @click="delUser_sure" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!--用户列表-->
    <el-dialog
      title="用户列表"
      append-to-body
      :visible.sync="dialog_user_panel"
      custom-class="dailog-min-max">
      <el-button-group class="roleManage-table-btn">
        <el-button @click="addUserList" type="primary" icon="el-icon-plus">新增</el-button>
      </el-button-group>
      <el-table
        v-loading="userEffectList"
        ref="userList"
        :data="dialog_user_list"
        border
        cell-class-name="text-center"
        header-cell-class-name="text-center"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          min-width="50">
        </el-table-column>
        <el-table-column
          property="userName"
          label="用户名"
          min-width="80">
        </el-table-column>
        <el-table-column
          property="realName"
          label="真实姓名"
          min-width="100">
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="100">
          <template slot-scope="scope">
            {{scope.row.status == 1 ? "激活" : "未激活"}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button @click="dialog_user_list_del(scope.row)" icon="el-icon-delete" title="删除"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--用户列表确认删除-->
    <el-dialog
      title="确认删除?"
      append-to-body
      :visible.sync="dialog_user_del_panel"
      custom-class="dailog-min-max">
      <div>
        确认删除<span class="dialog_del_name" v-if="dialog_user_del_obj.realName">{{dialog_user_del_obj.realName}}</span>的关联吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_user_del_panel = false">取 消</el-button>
        <el-button @click="dialog_user_del_sure" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!--待选用户列表-->
    <el-dialog
      title="添加已有客户"
      append-to-body
      :visible.sync="dialog_user_waiting_panel"
      custom-class="dailog-min-max">
      <el-row :gutter="10" class="search_user_waiting">
        <el-col :span="6">
          <el-input v-model="dialog_user_waiting_form.userName" type="text" placeholder="用户名" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="dialog_user_waiting_form.realName" type="text" placeholder="真实姓名" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="12">
          <el-button @click="dialog_user_waiting_search('search')" type="primary">搜索</el-button>
          <el-button @click="dialog_user_waiting_search('reset')">重置</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="userListLoading"
        ref="userList"
        :data="dialog_user_waiting_data"
        border
        height='300'
        cell-class-name="text-center"
        header-cell-class-name="text-center"
        style="width: 100%"
        @select="user_waiting_select($event)">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          property="userName"
          label="用户名">
        </el-table-column>
        <el-table-column
          property="realName"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            {{scope.row.status == 1 ? "激活" : "未激活"}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :pager-count="5"
          :total="dialog_user_waiting_count"
          :current-page="dialog_user_waiting_form.page"
          @current-change="pageChange($event)">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_user_waiting_panel = false">取 消</el-button>
        <el-button @click="dialog_user_waiting_sure" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!--权限设置-->
    <el-dialog
      title="权限设置"
      append-to-body
      custom-class="dailog-min-max"
      :visible.sync="dialog_power_panel"
      @close="dialog_power_panel_close">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="powerList" v-loading="dialog_power_loading">
            <left-list v-if="dialog_power_list.length > 0" :left-data="dialog_power_list"></left-list>
          </div>
          <div class="powerBtn">
            <el-button @click="saveLeftList" :disabled="dialog_power_loading" type="primary">保存</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="powerList" v-loading="dialog_power_loading_r">
            <right-list v-if="dialog_power_list_r.length > 0" :right-data="dialog_power_list_r"></right-list>
          </div>
          <div class="powerBtn">
            <el-button @click="saveRightList" type="primary">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import leftList from './leftList'
  import rightList from './rightList'
  export default {
    name: 'roleManage-table',
    props: ["tableData"],
    components: {
      leftList, rightList
    },
    data () {
      return {
        editMod:'1',
        url: {
          del_url: "/ms_bas/role/del",
          userList: "/ms_bas/role/userDatagrid?field=id,userName,realName,status,",
          getAddUserList: "/ms_bas/role/getUserToRoleList?field=id,userName,realName,status,",
          addUserList: "/ms_bas/role/addUserToRole",
          delUserRel: "/ms_bas/role/user/del",
          save: "/ms_bas/role/save",
          getAuthority: "/ms_bas/role/setAuthority",
          updateAuthority: "/ms_bas/role/updateAuthority",
          queryComboTree: "/ms_bas/role/queryComboTree",
          addAuth: "/ms_bas/role/addAuth",
        },

        rules:{
          roleCode:[
            { required: true, message: '请输入角色编码', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleType:[
            { required: true, message: '请选择角色类型', trigger: 'change' }
          ],
        },

        dialog_del_panel: false,
        dialog_del_obj: {},

        dialog_user_panel: false,
        userEffectList: true,
        dialog_user_del_panel: false,
        dialog_user_del_obj: {},
        dialog_user_list: [],
        dialog_user_obj: {},

        dialog_userMsg_panel: false,
        dialog_userMsg_text: "",
        dialog_userMsg_data: {
          id: "",
          roleCode: "",
          roleName: "",
          roleType: "",
        },
        dialog_userMsg_roleType: [ //暂时找不到角色类型列表接口，先写死了
          {value: "0", roleName: "管理员"},
          {value: "1", roleName: "项目经理"},
          {value: "2", roleName: "大区经理"},
          {value: "3", roleName: "运营人员"},
        ],

        dialog_user_waiting_panel: false,
        userListLoading: true,
        dialog_user_waiting_data: [],
        dialog_user_waiting_count: 0,
        dialog_user_waiting_selected: [],
        dialog_user_waiting_form: {
          roleId: "",
          page: 1,
          rows: 10,
          userName: "",
          realName: "",
        },

        dialog_power_panel: false,
        dialog_power_loading: false,
        dialog_power_obj: {},
        dialog_power_list: [],
        dialog_power_loading_r: false,
        dialog_power_list_r: [],
        dialog_power_list_chosed: "",
        dialog_power_list_chosed_r: "",
      }
    },
    computed: {
      height () {
        return document.body.clientHeight - 190;
      }
    },
    mounted () {

    },
    methods: {
      dialog_power_panel_close () {
        let that  = this;
        that.dialog_power_list = [];
        that.dialog_power_list_r = [];
        that.dialog_power_list = [];
      },
      saveRightList () {
        let that = this;
        let result = that.dealRightList(that.dialog_power_list_r);
        let param = {roleId: that.dialog_power_obj.id, nppid: JSON.stringify(result)};
        that.$ajax({
          url: that.url.addAuth,
          data: param,
          method: "post",
          success: function (res) {
            if (res.data.success) {
              that.$message({
                type: 'success',
                message: '操作成功'
              });
              that.$store.commit('changeSelectArrState', true);
            } else {
              that.$message({
                type: 'success',
                message: res.data.msg
              });
            }
            that.dialog_power_loading_r = false;
          },
          error: function (err) {
            that.$message.error(err);
            that.dialog_power_loading_r = false;
          }
        });
      },
      dealRightList (arr) {
        let that = this;
        let result = [];
        let deal = function (data) {
          data.forEach((item, index) => {
            if (item.children && item.children.length > 0) {
              deal(item.children);
            } else {
              if (item.checked) {
                result = result.concat({nppid: item.id, default: item.attributes.default == true ? 1 : 0});
              }
            }
          });
        };

        deal(arr);

        return result;
      },
      saveLeftList () {
        let that = this;
        let result = that.dealLeftList(that.dialog_power_list);
        let hash = {};
        let pre = "id_";
        that.dialog_power_list_chosed = "";

        result.forEach((item, index) => {
          if (!hash[pre + item.id]) {
            hash[pre + item.id] = true;
            if (that.dialog_power_list_chosed.length <= 0) {
              that.dialog_power_list_chosed += item.id;
            } else {
              that.dialog_power_list_chosed += "," + item.id;
            }
          }
        });

        //console.log(that.dialog_power_list_chosed); return;

        that.dialog_power_loading = true;
        that.$ajax({
          url: that.url.updateAuthority,
          data: {roleId: that.dialog_power_obj.id, rolefunctions: that.dialog_power_list_chosed},
          method: "post",
          success: function (res) {
            if (res.data.success) {
              that.$message({
                type: 'success',
                message: '操作成功'
              });
            } else {
              that.$message({
                type: 'success',
                message: res.data.msg
              });
            }
            that.$store.commit("changeMenuState", true);
            that.dialog_power_loading = false;
          },
          error: function (err) {
            that.$message.error(err);
            that.dialog_power_loading = false;
          }
        });
      },
      dealLeftList (arr) {
        let that = this;
        let result = [];
        let hash = {};
        let pre = "id_";

        arr.forEach((item, index) => {
          if (item.children) {
            let data = that.dealLeftList(item.children);
            result = result.concat(data);
          }
          if (item.checked) {
            result = result.concat(result, {id: item.id, text: item.text});
          }
        });
        return result;
      },
      getPowerList (obj) {
        let that = this;

        that.dialog_power_panel = true;
        that.dialog_power_obj = obj;
        that.dialog_power_loading = true;
        that.dialog_power_loading_r = true;
        that.$ajax({
          url: that.url.getAuthority,
          data: {roleId: that.dialog_power_obj.id},
          method: "post",
          success: function (res) {
            that.dialog_power_loading = false;
            that.dialog_power_list = res.data;
          },
          error: function (err) {
            that.$message.error(err);
          }
        });

        that.$ajax({
          url: that.url.queryComboTree,
          data: {roleId: that.dialog_power_obj.id},
          method: "post",
          success: function (res) {
            that.dialog_power_loading_r = false;
            that.dialog_power_list_r = res.data;
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      dialog_user_del_sure () {
        let that = this;
        that.$ajax({
          url: that.url.delUserRel + "?userId=" + that.dialog_user_del_obj.id,
          data: {roleId: that.dialog_user_obj.id},
          method: "post",
          success: function (res) {
            if (res.data.success) {
              that.$message({
                type: 'success',
                message: '操作成功'
              });
              that.dialog_user_del_panel = false;
              that.getUserList(that.dialog_user_obj);
            } else {
              that.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      dialog_user_list_del (obj) {
        let that = this;
        that.dialog_user_del_obj = obj;
        //console.log(obj);
        that.dialog_user_del_panel = true;
      },
      dialog_user_waiting_sure () {
        let that = this;
        let param = {userIds: "",};
        that.dialog_user_waiting_selected.forEach((item, index) => {
          if (index == 0) {
            param.userIds += item.id;
          } else {
            param.userIds += "," + item.id;
          }
        });

        that.$ajax({
          url: that.url.addUserList + "?roleId=" + that.dialog_user_obj.id,
          data: param,
          method: "post",
          success: function (res) {
            if (res.data.success) {
              that.$message({
                type: 'success',
                message: '操作成功'
              });
              that.dialog_user_waiting_panel = false;
              that.getUserList(that.dialog_user_obj);
            } else {
              that.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      user_waiting_select (selection) {
        let that = this;
        that.dialog_user_waiting_selected = selection;
      },
      dialog_user_waiting_search (type) {
        let that = this;
        if (type == "reset") {
          that.dialog_user_waiting_form.userName = "";
          that.dialog_user_waiting_form.realName = "";
        }
        that.dialog_user_waiting_form.page = 1;
        that.dialog_user_waiting_form.roleId = that.dialog_user_obj.id;
        that.userListLoading = true;
        that.$ajax({
          url: that.url.getAddUserList,
          data: that.dialog_user_waiting_form,
          method: "post",
          success: function (res) {
            that.dialog_user_waiting_panel = true;
            that.userListLoading = false;
            that.dialog_user_waiting_data = res.data.rows;
            that.dialog_user_waiting_count = res.data.total;
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      pageChange (page) {
        let that = this;
        that.dialog_user_waiting_form.page = page;
        that.dialog_user_waiting_form.roleId = that.dialog_user_obj.id;
        that.userListLoading = true;
        that.$ajax({
          url: that.url.getAddUserList,
          data: that.dialog_user_waiting_form,
          method: "post",
          success: function (res) {
            that.userListLoading = false;
            that.dialog_user_waiting_panel = true;
            that.dialog_user_waiting_data = res.data.rows;
            that.dialog_user_waiting_count = res.data.total;
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      addUserList () {
        let that = this;
        that.dialog_user_waiting_form.roleId = that.dialog_user_obj.id;
        that.dialog_user_waiting_panel = true;
        that.userListLoading = true;
        that.$ajax({
          url: that.url.getAddUserList,
          data: that.dialog_user_waiting_form,
          method: "post",
          success: function (res) {
            that.userListLoading = false;
            that.dialog_user_waiting_data = res.data.rows;
            that.dialog_user_waiting_count = res.data.total;
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      dialog_userMsg_false(){
        let that =this;
        that.dialog_userMsg_panel = false;
        for (let item in that.dialog_userMsg_data) {
          that.dialog_userMsg_data[item] = "";
        }
      },
      dialog_userMsg_save () {
        let that = this;
        that.$refs.dialogForm.validate((valid) => {
          if (valid) {
            that.$ajax({
              url: that.url.save,
              data: that.dialog_userMsg_data,
              method: "post",
              success: function (res) {
                if (res.data.success) {
                  that.dialog_userMsg_panel = false;
                  that.$message({
                    type: 'success',
                    message: '操作成功'
                  });
                  that.$emit("delRole", true);
                } else {
                  that.$message({
                    type: 'waring',
                    message: res.data.msg
                  });
                }
              },
              error: function (err) {
                that.$message.error(err);
              }
            });
          } else {
            return;
          }
        });

      },
      roleAdd (obj) {
        let that = this;
        if (obj == false) {
          that.dialog_userMsg_text = "新增";
          for (let item in that.dialog_userMsg_data) {
            that.dialog_userMsg_data[item] = "";
          }
        } else {
          that.dialog_userMsg_text = "修改";
          for (let item in that.dialog_userMsg_data) {
            that.dialog_userMsg_data[item] = obj[item];
          }
        }
        if (that.$refs['dialogForm'] !== undefined){
          that.$refs['dialogForm'].clearValidate();
        }
        that.dialog_userMsg_panel = true;
      },
      getUserList (obj) {
        let that = this;
        that.dialog_user_obj = obj;
        that.dialog_user_panel = true;
        that.userEffectList = true;
        that.$ajax({
          url: that.url.userList,
          data: {roleId: obj.id},
          method: "post",
          success: function (res) {
            that.userEffectList = false;
            that.dialog_user_list = res.data.rows;
          },
          error: function (err) {
            that.userEffectList = false;
            that.$message.error(err);
          }
        });
      },
      delUser (obj) {
        let that = this;
        that.dialog_del_panel = true;
        that.dialog_del_obj = obj;
      },
      delUser_sure () {
        let that = this;
        let param = {};
        param.id = that.dialog_del_obj.id;
        that.$ajax({
          url: that.url.del_url,
          data: param,
          method: "post",
          success: function (res) {//success
            if (res.data.success) {
              that.$message({
                type: 'success',
                message: res.data.msg
              });
              that.dialog_del_panel = false;
              that.$emit("delRole", true);
            }else {
              that.$message({
                type: 'warning',
                message: res.data.msg
              });
            }
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .roleManage-table-btn{
    padding: 0 0 0.5rem 0;
  }
  .roleManage-table{
    margin: .5rem 0;
  }
  .dialog_del_name{
    display: inline-block;
    font-weight: bold;
    padding: 0 .3rem;
    color: #000;
  }
  .search_user_waiting{
    padding: 0 0 1rem 0;
  }
  .pagination{
    text-align: center;
    padding: .5rem 0;
  }
  .powerList{
    height: 20rem;
    overflow: auto;
  }
  .powerBtn{
    padding: .5rem 0 0 0;
  }
</style>
