<template>
  <div class="userManage">
    <!--search-->
    <v-search 
      :pagenum="pagenum" 
      :refresh="refresh"
      @searchData="getSearchResult($event)"></v-search>
    <!--table-->
    <v-table 
      :table-data="tableData" 
      @pageChange="pageChange($event)"
      @editUserName="editUserName($event)"
      @stateChange="stateChange($event)"
      @password="password($event)"></v-table>

    <el-dialog
      :title="dialogFormTitle + '用户信息'"
      :visible.sync="dialogVisible"
      width="400px"
      @closed="clearValidate">
      <el-form :model="dialogForm" status-icon :rules="rules2" ref="dialogForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <span class="formItem">
            <el-input type="text" :disabled="dialogFormAddnew" v-model="dialogForm.userName" auto-complete="off"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="密码" prop="passWord" v-if="!dialogFormAddnew">
          <span class="formItem">
            <el-input type="text" v-model="dialogForm.passWord" auto-complete="off"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <span class="formItem">
            <el-input type="text" v-model="dialogForm.realName" auto-complete="off"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="组织机构" v-if="dialogForm.departname != undefined" prop="departname">
          <span class="formItem">
            <el-select 
              v-model="dialogForm.orgId" 
              placeholder="请选择" 
              style="width: 100%;"
              @change="departnameChange($event)">
              <el-option
                v-for="item in departList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </span>
        </el-form-item>
        <el-form-item label="角色" prop="">
          <span class="formItemMini">
            <el-input type="text" v-model="dialogForm.userKey" disabled auto-complete="off"></el-input>
          </span>
          <el-button @click="UserkeyChose">选择</el-button>
        </el-form-item>
        <el-form-item label="手机号">
          <span class="formItem">
            <el-input type="text" v-model="dialogForm.mobilePhone"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="办公电话">
          <span class="formItem">
            <el-input type="text" v-model="dialogForm.officePhone"></el-input>
          </span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span class="formItem">
            <el-input type="text" v-model="dialogForm.email"></el-input>
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择角色"
      append-to-body
      :visible.sync="dialogUserkey"
      width="400px"
      @close="cleanRoleChosed">
      <div>
        <!-- <div class="dialogSearch">
          <span class="formItemMini">
            <el-input type="text" v-model="dialogSearch.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
          </span>
          <el-button type="primary" icon="el-icon-searc" @click="searchDialog">搜索</el-button>
        </div> -->
        <el-table
          class="dialogUserkey"
          :data="gridList"
          border
          ref="gridList"
          height="250px"
          @select="SelectItem"
          style="width: 100%">
          <el-table-column
            type="selection"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            property="roleName"
            label="角色名称">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUserkey = false">取 消</el-button>
        <el-button type="primary" @click="UserkeySure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import vSearch from './component/userManage_search'
  import vTable from './component/userManage_table'

  export default {
    name: 'userManage',
    components: {
      vSearch, vTable
    },
    data () {
      let $vue = this;

      const validate = {
        realName (rule, value, callback) {
          if (value === '') {
            callback(new Error('真实姓名不能为空'));
          } else if(value.length > 10 || value.length < 2) {
            callback(new Error('真实姓名需在2~10个字符之间'));
          } else {
            callback();
          }
        },

        userName (rule, value, callback) {
          if (value === '') {
            callback(new Error('请填写用户名'));
          } else if(value.length > 10 || value.length < 2) {
            callback(new Error('用户名长度为2~10个字符'));
          } else {
            $vue.$ajax({
              url: "/ms_bas/duplicate/check",
              data: {tableName: "t_s_base_user", fieldName: "username", fieldVlaue: value},
              method: "post",
              success: function (res) {
                if (res.data.success) {
                  callback();
                } else {
                  callback(new Error('用户名已存在'));
                }
              },
              error: function (err) {
                $vue.$message.error(err);
                callback(new Error('网络故障, 请稍后重试'));
              }
            });
          }
        },

        passWord (rule, value, callback) {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else if(value.length > 20 || value.length < 6) {
            callback(new Error('密码需要6~20个字符'));
          } else {
            callback();
          }
        },
      }
      return {
        url: {
          departTree: "/ms_bas/user/depart/tree",
          datagrid: "/ms_bas/role/datagrid?field=id,roleCode,roleName,roleType,createBy,createDate,updateBy,updateDate,", //  /ms_bas/user/role/select/datagrid?field=id,roleName
          save: "/ms_bas/user/save",
          state: "/ms_bas/user/lock",
          password: "/ms_bas/user/save/newpwd",
        },

        tableData: {},
        pagenum: 1,
        refresh: false,

        dialogVisible: false,
        dialogUserkey: false,

        dialogSearch: {
          name: "",
        },
        dialogFormAddnew: true,
        dialogFormTitle: "",
        dialogForm: {
          userName: "",
          realName: "",
          departname: "",
          userKey: "",
          orgId: "",
          roleid: "",
          mobilePhone: "",
          roleName: "",
          officePhone: "",
          email: "",
          id: "",
          passWord: "",
        },
        rules2: {
          realName: [
            { validator: validate.realName, trigger: "blur" }
          ],
          userName: [
            { required: true, validator: validate.userName, trigger: "blur" }
          ],
          passWord: [
            { required: true, validator: validate.passWord, trigger: "blur" }
          ],
        },

        departList: [],
        gridList: [],
        gridSelected: [],
      };
    },
    computed : {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    mounted () {
      this.getDepartTreeList();
      this.getDatagridList();
    },
    methods: {
      UserkeyChose () {
        let that = this;
        let roleid = that.dialogForm.roleid.split(",");
        let hash = {};

        roleid.forEach((item, index) => {
          hash["id_" + item] = true;
        });
        
        /*that.gridList.forEach((item, index) => {
          if (hash["id_" + item.id]) {
            console.log(item.id + " | " + item.roleName);
            that.$refs.gridList.toggleRowSelection(item);
          } else {
            console.log("xxxx" + item.id + " | " + item.roleName);
          } 
        });*/
        that.dialogUserkey = true;
      },
      cleanRoleChosed () {
        let that = this;
        that.$refs.gridList.clearSelection();
      },
      password (param) {
        let that = this;

        that.$ajax({
          url: that.url.password,
          data: param,
          method: "post",
          success: function (res) {
            if (res.data.success) {
              that.$message({
                type: "success",
                message: "操作成功"
              });
            } else {
              that.$message({
                type: "warning",
                message: res.data.msg
              });
            }
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      stateChange (data) {
        let that = this;
        let param = {id: data.obj.id, lockvalue: (data.switch == "off" ? 0 : 1)}
        
        that.$ajax({
          url: that.url.state,
          data: param,
          method: "post",
          success: function (res) {
            if (res.data.success) {
              that.$message({
                type: "success",
                message: "操作成功"
              });
              that.refresh = !that.refresh;
            } else {
              that.$message({
                type: "warning",
                message: res.data.msg
              });
            }
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      departnameChange (obj) {
        let that = this;
        that.departList.forEach((item, index) => {
          if (item.id == obj) {
            that.dialogForm.departname = item.name;
          }
        });
      },
      clearValidate () {
        let that = this;
        //dialogForm
        that.$refs["dialogForm"].resetFields();
      },
      save () {
        let that = this;
        let param = {
          id: that.dialogForm.id,
          realName: that.dialogForm.realName,
          departname: that.dialogForm.departname,
          orgId: that.dialogForm.orgId,
          roleid: that.dialogForm.roleid,
          roleName: that.dialogForm.userKey,
          mobilePhone: that.dialogForm.mobilePhone,
          officePhone: that.dialogForm.officePhone,
          email: that.dialogForm.email,
          password: that.dialogForm.passWord,
          userName: that.dialogForm.userName,
        };
        //console.log(param);return;
        that.$ajax({
          url: that.url.save,
          data: param,
          method: "post",
          success: function (res) {
            that.dialogVisible = false;
            if (res.data.success) {
              that.$message({
                type: "success",
                message: "操作成功"
              });
              that.refresh = !that.refresh;
            } else {
              that.$message({
                type: "warning",
                message: res.data.msg
              });
            }
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      UserkeySure () {
        let that = this;
        that.dialogUserkey = false;
        //dialogForm
        that.dialogForm.userKey = "";
        that.dialogForm.roleid = "";
        that.gridSelected.forEach((item, index) => {
          if (index == 0) {
            that.dialogForm.userKey += item.roleName;
            that.dialogForm.roleid += item.id;
          } else {
            that.dialogForm.userKey += "," + item.roleName;
            that.dialogForm.roleid += "," + item.id;
          }
        });
      },
      SelectItem (selection, row) {
        let that = this;
        that.gridSelected = selection;
      },
      searchDialog () {
        let that = this;
        
      },
      pageChange (page) {
        let that = this;

        that.pagenum = page;
      },
      getSearchResult (obj) {
        let that = this;

        that.tableData = {rows: obj.rows, total: obj.total, current: obj.currentPage};
      },
      getDatagridList () {
        let that = this;

        that.$ajax({
          url: that.url.datagrid,
          data: {},
          method: "post",
          success: function (res) {
            res.data.rows.forEach((item, index) => {
              that.gridList.push(item);
            });
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      getDepartTreeList () {
        let that = this;

        that.$ajax({
          url: that.url.departTree,
          data: {orgId: "8a8ab0b246dc81120146dc8180ba0017"},
          method: "post",
          success: function (res) {
            let data = JSON.parse(res.data.msg);
            
            data.forEach((item, index) => {
              that.departList.push(item);
            });
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
      editUserName (obj) {
        let url = "/ms_bas/user/getRole"; // userid=id
        let that = this;
        if (obj != null) {
          for (let item in that.dialogForm) {
            that.dialogForm[item] = obj[item];
          }

          that.dialogForm.orgId = obj["userOrgList.tsDepart.id"].replace(/,/g, "");

          that.dialogFormAddnew = true;
          that.dialogFormTitle = "修改";
        } else {
          for (let item in that.dialogForm) {
            that.dialogForm[item] = "";
          }
          that.dialogFormAddnew = false;
          that.dialogFormTitle = "新增";
        }

        that.$ajax({
          url: url,
          data: {userid: that.dialogForm.id},
          method: "post",
          success: function (res) {
            that.dialogForm.roleid = "";

            res.data.forEach((item, index) => {
              if (that.dialogForm.roleid == "") {
                that.dialogForm.roleid += item.id;
              } else {
                that.dialogForm.roleid += "," + item.id;
              }
            });
          },
          error: function (err) {
            that.$message.error(err);
          }
        });

        that.dialogVisible = true;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  .formItem{
    display: inline-block;
    width: 250px;
  }
  .formItemMini{
    display: inline-block;
    width: 190px;
  }
  .dialogUserkey{
    margin: 1rem 0 0 0;
  }
  @media screen and (max-width: 800px) {
    .search-index {
      position: fixed;
      top: 3rem;
      left: 0;
      right: 0;
      z-index: 6;
      background: #fff;
      padding: 1.2rem;
      display: none;
    }
    .searchContainCover {
      position: fixed;
      z-index: 5;
      background: rgba(0, 0, 0, 0.3);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
