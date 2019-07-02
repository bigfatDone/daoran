<template>
  <div>
    <div class="btnGroup">
      <el-button type="primary" style="cursor: pointer;" @click="dialogImportIn = true" size="mini" title="">报表上传</el-button>
      <el-button type="primary" style="cursor: pointer;" :disabled="disFlag"   @click="getList" size="mini" title="">报表分析</el-button>
      <el-button type="primary" style="cursor: pointer;" size="mini" title="" @click="downloadToExcel">报表下载</el-button>
    </div>
    <el-row>
      <el-table
        id="tableData"
        :data="tableData"
        border
        style="width: 100%"
        empty-text="暂无数据"
        :height="TableHeight"
        v-loading="tableLoading">
        <el-table-column
          align="center"
          label="宽带账号">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.bandwidthID">{{scope.row.bandwidthID}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="产品名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.projectName">{{scope.row.projectName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="访问时间">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.accressTime">{{scope.row.accressTime}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="CP">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.cp">{{scope.row.cp}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="访问次数">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.count">{{scope.row.count}}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-pagination-->
        <!--background-->
        <!--layout="total, prev, pager, next, jumper"-->
        <!--:page-size="params.pageSize"-->
        <!--:total="tableDataCount"-->
        <!--:current-page="params.currPage"-->
        <!--@size-change="sizeChange"-->
        <!--@current-change="tableDataPageChange">-->
      <!--</el-pagination>-->
    </el-row>
    <!--文件上传-->
    <el-dialog
      width="500px"
      :visible.sync="dialogImportIn"
      @close="ImportInClose"
      title="导入报表"
      :show-close="false">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-upload style="width:80px"
                   class="upload-excel"
                   action="/ms_bas/unicomDate/uploadExcel"
                   accept="xls"
                   :data="excelParam"
                   :show-file-list="false"
                   :on-change="handleDialogImportIn"
                   @click.native="beforeUpload"
                   :auto-upload="false"
                   :on-success="uploadDone"
                   ref="newupload">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        {{fileName}}
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="ImportInClose">取消</el-button>
        <el-button type="primary" size="mini" @click="importIn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'unicomList',
  data () {
    return {
      excelMonth: '',
      excelFileType: '',
      disFlag: true,
      tableLoading: false,
      dialogImportIn: false,
      url: {
        list: '/ms_bas/unicomDate/getUnciomDataUserList'
      },
      params: {
        pageIndex: 1,
        pageSize: 12,
        filter: {
          date: "",
          reportName: ""
        }
      },
      tableData: [],
      tableDataCount: 0,
      date: '',
      Sdate: '',
      SreportName: '',
      fileName: '',
      excelParam: {
      },
      configNum: 0,
      TableHeight: 700,
    }
  },
  activated () {
    // this.onSubmit('clear');
    // this.Resize();
  },
  methods: {
    downloadToExcel () {
      let url = '/ms_bas/unicomDate/downloadToExcel';
      window.open(url)
    },
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    // 导入报表
    ImportInClose () {
      this.fileName = '';
      this.$refs.newupload.clearFiles();
      this.dialogImportIn = false;
    },
    handleDialogImportIn (file, fileList) {
      this.fileName = file.name;
      // this.excelParam.reportName = file.name;
    },
    beforeUpload() {
      this.configNum = 0;
    },
    closeImportIn () {
      this.excelParam.fileType = '';
      this.excelParam.month = '';
      this.dialogImportIn = false;
    },
    importIn (){
      let that = this;
      if (this.fileName === '') {
        that.$message({
          message: '请上传正确格式的文件',
          type: 'warning'
        })
        return;
      };
      // if (that.configNum === 0 && that.isempty) {
        this.$refs.newupload.submit();
        // this.importOuting = true;
      // } else {
      //   that.$message({
      //     message: '请上传正确格式的文件',
      //     type: 'warning'
      //   })
      // }
    },
    uploadDone (response, file, fileList) {
      let that = this;
      if (response.status) {
        // if (response.data.path.length > 0) {
        //   // that.importOuting = false;
        //   that.configNum += 1;
        //   // that.errorDownLoad = response.data.path;
        //   that.$message({
        //     type: 'warning',
        //     message: response.msg
        //   });
        // } else {
          // that.importOuting = false;
          that.$message({
            type: 'success',
            message: response.message
          });
          that.dialogImportIn = false;
          that.disFlag = false;
          // that.onSubmit('clear');
        // }
      } else {
        // that.importOuting = false;
        that.configNum += 1;
        that.$message({
          type: 'warning',
          message: response.message
        });
      }
    },
    dateChosed() {
    },
    onSubmit (state) {
      let that = this;
      let datas = [];
      // that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state === 'search') {
        that.params.pageSize = 12;
        that.params.pageIndex = 1;
        that.getList();
      } else if (state === 'clear') {
        for (let i in that.params) {
          if (i === 'pageSize') {
            that.params[i] = 12;
          } else if (i === 'currPage') {
            that.params[i] = 1;
          } else if (i === 'filter') {
            that.Sdate = '';
            that.SreportName = '';
          }
        }
        that.totleCount = '';
        that.getList();
      }
    },
    getList () {
      let that = this;
      that.tableLoading = true;
      let param = {};
      that.$ajax({
        url: that.url.list,
        method: "post",
        data: {},
        success: function (res) {
          if (!res.data.status) {
            that.tableData = [];
            that.tableLoading = false;
            that.$message({
              type: 'warning',
              message: res.data.message
            });
            return;
          }
          let selected = [];
          // that.scrollTop('#tableData');
          that.tableData = res.data.data || [];
          that.tableDataCount = res.data.total;
          that.tableLoading = false;
          setTimeout(() => {
            that.responHeight();
          }, 800);
        },
        error: function (error) {
          that.$message.error('联通投诉处理页面数据请求失败，请刷新联通投诉处理页面');
        }
      });
    },
    responHeight () {
      let dom = this.$el;
      let contain_height = document.body.offsetHeight;
      // let search_height = dom.querySelector('.searchWrap').offsetHeight;
      let static_height = 200;
      let result_height = parseInt(contain_height  - static_height);
      if (result_height >= 300) {
        this.TableHeight = Number(result_height);
      } else {
        this.TableHeight = 500;
      }
    },
    sizeChange (size) {
      this.params.pageSize = size;
      this.getList();
    },
    tableDataPageChange (page) {
      this.firstFlag = false;
      this.getList(page);
    },
  }
}
</script>

<style>
.w400 {
  width:200px;
}
.text_right {
  text-align: right;
  padding-right: 26px;
}
.btnGroup{
  margin: 5px 0 7px;
  }
.btnGroup a {
  text-decoration: none;
  color: #fff;
}
</style>
