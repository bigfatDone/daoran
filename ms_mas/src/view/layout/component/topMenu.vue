<template>
  <div>
    <ul class="opera-pc">
      <li>
        <el-popover
          placement="bottom"
          width="162"
          trigger="click">
          <div class="more-link">
            <a href="http://oms.daoran.tv/" target="_blank">
              <img src="@/img/ssoIMG/yunying.png">
              <span>运营管理</span>
            </a>
            <a href="http://cms.daoran.tv" target="_blank">
              <img src="@/img/ssoIMG/neirong.png">
              <span>内容管理</span>
            </a>
            <a href="http://crm.daoran.tv" target="_blank">
              <img src="@/img/ssoIMG/kehu.png">
              <span>客户关系</span>
            </a>
            <a href="http://tag.daoran.tv" target="_blank">
              <img src="@/img/ssoIMG/biaoqian.png">
              <span>标签系统</span>
            </a>
            <a href="http://bls.daoran.tv" target="_blank">
              <img src="@/img/ssoIMG/jiesuan.png">
              <span>结算系统</span>
            </a>
            <a href="http://bi.daoran.tv" target="_blank">
              <img src="@/img/ssoIMG/jingfen.png">
              <span>经分系统</span>
            </a>
          </div>
          <i class="el-icon-menu menu-icon-class" slot="reference"></i>
        </el-popover>
      </li>
      <li>
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
          <el-badge :is-dot="dotState" class="item"  slot="reference">
            <i class="el-icon-bell"></i>
          </el-badge>
        </el-popover>
      </li>
    </ul>

    <!-- 消息推送  -->
    <el-dialog
      append-to-body
      fullscreen
      title="消息"
      :visible.sync="dialogTableVisible">
      <el-row>
        <el-table
          :data="dataListAll"
          border
          style="width: 100%;"
          empty-text="暂无数据">
          <el-table-column
            label="全部消息">
            <template slot-scope="scope">
              <p class="m_title">{{scope.row.title}}</p>
              <p v-html="scope.row.content"></p>
              <p>{{scope.row.createDate}}</p>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'top-menu',
  data () {
    return {
      dialogTableVisible:false,
      dotState:false,
      dataList:[],
      dataListAll:[],
      msgCount:'0',
    }
  },
  mounted() {
    this.messageCount();
    this.newMessageGet();
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
    //消息推送
    messageCount(){
      let that =this;
      that.$ajax({
        url: '/ms_bas/system/unreadMessageNum',
        data: {moduleName:'bas'},
        method: "post",
        success: function (res) {
          if (res.data.success === true){
            if (res.data.data.count>0){
              that.dotState = true;
            }else {
              that.dotState = false;
            }
          }
        },
        error: function (err) {
          that.$message.error('请求失败搜索条件，请刷新页面');
        }
      });
    },
    newMessageGet(){
      let that =this;
      that.$ajax({
        url: '/ms_bas/system/mineMessage',
        data: {moduleName:'bas'},
        method: "post",
        success: function (res) {
          if (res.data.success === true) {
            that.dataList = JSON.parse(res.data.data);
          }
        },
        error: function (err) {
          that.$message.error('请求失败搜索条件，请刷新页面');
        }
      });
    },
    msgUp(){
      let that =this;
      that.$ajax({
        url: '/ms_bas/system/updateMessage',
        data: {moduleName:'bas'},
        method: "post",
        success: function (res) {
          if (res.data.success === true){
            that.dotState = false;
          }
        },
        error: function (err) {
          that.$message.error('请求失败搜索条件，请刷新页面');
        }
      });
    },
    sendParams(){
      let that = this;
      that.messageAll();
      that.dialogTableVisible = true;
    },
    messageAll(){
      let that =this;
      that.$ajax({
        url: '/ms_bas/system/mineMessageAll',
        data: {moduleName:'bas'},
        method: "post",
        success: function (res) {
          if (res.data.success === true) {
            res.data.data.forEach( i => {
              let arr = i.content.replace(/\n/g, "<br/>");
              i.content = arr;
              that.dataListAll.push(i);
            })
          }
        },
        error: function (err) {
          that.$message.error('请求失败搜索条件，请刷新页面');
        }
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul{
    margin: 0;
    padding: 0;
  }
  .opera-pc{
    margin: 0 .8rem 0 0;
    vertical-align: middle;
  }
  .opera-pc li{
    display: inline-block;
    margin: 0 0 0 .8rem;
    opacity: 0.9;
    position: relative;
    overflow: visible;
    transition: opacity .1s;
    font-size: .85rem;
  }
  .opera-pc li i{
    cursor: pointer;
    font-size: 1.1rem;
    vertical-align: middle;
  }
  .opera-pc li:hover{
    opacity: 1;
  }
  .opera-pc span.amdim{
    width:35px;
    height: 35px;
    font-size: 1.6rem;
    color: #fff;
    border-radius: 50%;
  }
  .more-link{
    width: 162px;
    overflow: hidden;
  }
  .more-link > a{
    display: block;
    float: left;
    width: 78px;
    height: 100px;
    text-decoration: none;
    color: #000;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    border: 1px solid #fff;
    border-radius: 5px;
  }
  .more-link > a:hover{
    border-color: #ccc;
  }
  .menu-icon-class{
    padding: 1px 0;
  }
</style>
