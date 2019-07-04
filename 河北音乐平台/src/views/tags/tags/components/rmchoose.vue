<template>
  <div class="urlManager-list" style="position: relative;padding-bottom: 45px;: ">
    <el-form
      :inline="true"
      label-width="68px"
      class="demo-form-inline"
      size="mini">
        <el-form-item label="资源编码">
          <div class="w150">
            <el-input v-model="req.list.resCode" placeholder="请输入资源编码" @keyup.enter.native="onSubmit('search')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="资源名称">
          <div class="w150">
            <el-input v-model="req.list.resName" placeholder="请输入资源名称" @keyup.enter.native="onSubmit('search')"></el-input>
          </div>
        </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" @click="onSubmit('search')">查询</el-button>
          <el-button @click="onSubmit('clear')">重置</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        id="tableData"
        ref="videoTable"
        :data="tableData"
        border
        style="width: 100%"
        empty-text="暂无数据"
        :height="500"
        v-loading="tableLoading">
        <el-table-column
          label="资源编码">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.resCode">{{scope.row.resCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.resName">{{scope.row.resName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="艺人名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="danger" circle  @click="del(scope.row)" title="删除" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div slot="footer" class="dialog-footer" style="position: absolute;bottom:0px;right: 0px;">
      <!--<el-button size="mini" @click="dialogChoose = false">取消</el-button>-->
      <el-button type="primary" size="mini" @click="ok">确定</el-button>
    </div>
    <!--<el-form-item  class="text_right">-->
      <!--&lt;!&ndash;<el-button type="primary" @click="dialogFormSubmit">提交</el-button>&ndash;&gt;-->
      <!--<el-button @click="ok">确定</el-button>-->
    <!--</el-form-item>-->
  </div>
</template>

<script>
export default {
  name: 'rmchoose',
  props: {
    tagId: Number,
  },
  filters: {
    dateForm (dateCamp) {
      let dataDeal = (m) => {
        return m < 10 ? '0' + m : m
      };

      let time = new Date(dateCamp);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return y+'-'+dataDeal(m)+'-'+dataDeal(d)+' '+dataDeal(h)+':'+dataDeal(mm)+':'+dataDeal(s);
    }
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      dialogChoose: false,
      url: {
        getList : "/cms/api/tag/repeatResShow.do",
        del : "/cms/api/tag/unbind.do",
      },
      sorceDialog: {
        show: false,
      },
      regName: '',
      req: {
        list: {
          tagId : this.tagId.toString(),
          resCode    : '',
          resName    : '',
        }
      },
      tableLoading: false,
      tableData: [],
    }
  },
  mounted () {
    this.onSubmit('clear');
  },
  methods: {
    dialogClose () {
      let that = this;
      for (let i in that.dialogForm) {
        that.dialogForm[i] = '';
      }
    },
    ok () {
      this.$emit('closeChoose', false);
    },
    del (data) {
      let that = this;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          tagIds: data.tagId,
          resCode: data.resCode
        }
        param = {jsonParam: JSON.stringify(param)}
        that.delData(param);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    delData (data) {
      let that = this;
      that.tableLoading = true;
      that.$ajax({
        url: that.url.del,
        method: "post",
        data: this.Qs.stringify(data),
        success: function (res) {
          that.tableLoading = false;
          that.$message({
            type: 'success',
            message: res.data.msg
          });
          that.listChosed = [];
          that.onSubmit('clear');
          that.dialogOperate = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getList () {
      let that = this;
      let parma = that.req.list;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;
      that.$ajax({
        url: that.url.getList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.data.data) {
            that.tableData = res.data.data.resList;
          } else {
            that.tableData = [];
          }
          that.tableLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    onSubmit (state) {
      console.log("222222")
      let that = this;
      let datas = [];
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.getList();
      }else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i !== 'tagId') {
            that.req.list[i] = '';
          }
        }
        that.getList();
      }
    },
  },
}
</script>

<style scoped>
  .el-row {
    margin-top: 20px;
  }
  .urlManager-name,
  .urlManager-code,
  .urlManager-time{
    padding: 0;
    margin: 0;
  }
  .urlManager-name{
    font-size: 16px;
    color: #000;
  }
  .text-small{
    font-size: 14px;
    color: #333;
    padding: 5px 0;
  }
  .urlManager-code,
  .urlManager-time{
    color: #ccc;
  }
  .urlManager-normal{
    color: #333;
  }
  .urlManagerData-text p{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .td {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .actived {
    color: #ff9900;
  }
  .text_right {
    text-align: right;
    padding-right: 26px;
  }
  .w400 {
    display: inline-block;
    width: 400px;
  }
  .w350 {
    display: inline-block;
    width: 350px;
  }
</style>
