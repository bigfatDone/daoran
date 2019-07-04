<template>
  <div class="urlManager-list">
    <template>
      <el-form :inline="true" labelPosition="right" class="demo-form-inline" size="mini">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
          <el-form-item label="用户账户">
            <el-input v-model="req.list.account" placeholder="请输入用户账户" @keyup.enter.native="onSubmit('search')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
          <el-form-item label="账户权限">
            <el-select v-model="req.list.isSee" placeholder="" @change="onSubmit('search')">
              <el-option v-for="item in userType" :key="item.type" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="onSubmit('search')">查询</el-button>
            <el-button @click="clear()">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-row>
      <el-table id="tableData" ref="videoTable" :data="tableData" border style="width: 100%" empty-text="暂无数据" :height="TableHeight" v-loading="tableLoading">
        <el-table-column width="250" label="用户账号">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name" :title="scope.row.account">{{scope.row.account}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.name">{{scope.row.name}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.isSee">{{scope.row.isSee | jurisdiction}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateForm}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle @click="edit(scope.row)" title="修改权限" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-size="req.list.pageSize" :total="tableDataCount" :current-page="req.list.pageNumber + 1" :page-sizes="[20, 100, 300, 500, 1000]" @size-change="sizeChange" @current-change="tableDataPageChange"></el-pagination>
    </el-row>
    <!--弹窗-->
    <el-dialog :title="editPop.title" :visible.sync="editPop.isShow" width="600px">
      <div class="isShowPop">
        <el-row>
          <el-col>
            <p><span>用户名:</span>{{editPop.name}}</p>
          </el-col>
          <el-col>
            <p><span>权限:</span>
              <el-radio v-model="editPop.satat" label="1">管理员</el-radio>
              <el-radio v-model="editPop.satat" label="2">道然</el-radio>
              <el-radio v-model="editPop.satat" label="3">悦道</el-radio>
              <el-radio v-model="editPop.satat" label="0">禁用</el-radio>
            </p>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer" style="text-align: center;margin-top: 15px;">
          <el-button size="mini" @click="editPop.isShow = false">取消</el-button>
          <el-button type="primary" size="mini" @click="editPopOk">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'user-list',
  components: {
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
    },
    jurisdiction (type) {
      let result = '';
      switch (type) {
        case 0 :
          result = '禁用';
          break;
        case 1 :
          result = '管理员';
          break;
        case 2 :
          result = '道然';
          break;
        case 3 :
          result = '悦道';
          break;
      }
      return result;
    },
  },
  data () {
    return {
      selectRow: {},
      unSelectRow: {},
      firstFlag : true,
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      curUrl: '',
      url: {
        queryIsSee : "/cms/api/userroler/queryIsSee.do",
        // getUserList : "/cms/api/getUserList",
        getUserList : "/cms/api/userroler/getUserListPage.do",
        updateSeeStatus : "/cms/api/userroler/updateSeeStatus.do",
      },
      dialog: {
        disabledFlag: false,
        width:'400px',
        show : false,
        title: '新增视频播放地址',
        formLabelWidth:'120px',
        type: 'blank'
      },
      sorceDialog: {
        show: false,
        req: {
          resCode: '', // 否 string  资源编码
          resName: '', // 否 string  资源名称
          resType: '0', // 是 string  资源类型 0视频 1音频
          pageSize: 20, // 是 string  页面容量
          pageNumber: 0, // 是  string  当前页码（从1开始）
        }
      },
      dialogForm:{
        resCode    : '',
        resFileCode: '',
        resName    : '',
        nodeCode   : '',
        playpfCode : '',
        resState   : '',
        playUrlGQ  : '',
        playUrl    : '',
        type: '',
        oldPlaypfCode: '',
      },
      req: {
        list: {
          account  : '', //账号
          isSee     : '', //是否有看权限  0  禁用  1 启用
          pageNumber : 0,  //是 int 当前页码
          pageSize   : 20, //是 int 页面容量
        }
      },
      userType: [
        {type: '', name: '查看全部'},
        {type: '0', name: '禁用'},
        {type: '1', name: '管理员'},
        {type: '2', name: '道然'},
        {type: '3', name: '悦道'},
      ],
      excelParam: {
        file: "",
        nodeCode: "",
        resType: "0"
      },
      selectHash: {},
      errorDownLoad: '',
      fileName: '',
      fixCodeName: '',
      importantInData: [],
      fileUrl: '',
      newPlaypfCode: '',
      radio: '',
      tableSource: [],
      tableChosed: [],
      cpList: [],
      tableData: [],
      tableSourceCount: 0,
      tableDataCount: 0,
      pageNum: 1,
      hasSelection: true,
      saveTit: '',
      sourceListLoading: false,
      dialogVisible: false,
      tableLoading: false,
      editLoading: false,
      controlFlag: false,
      lineStatus: "",
      dialogImportOut: false,
      dialogImportIn: false,
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      listload: true,
      TableHeight: 600,
      condition_export_all: [
        'resName',
        'resCode',
        'playUrlGQ',
        'playUrl',
        'resState',
        'lastTime',
      ],
      condition_export_base: [
        {key: 'resName', text: '资源名称'},
        {key: 'resCode', text: '资源编码'},
      ],
      condition_export_more: [
        {key: 'playUrlGQ', text: '高清播放地址'},
        {key: 'playUrl', text: '标清播放地址'},
        {key: 'resState', text: '资源状态'},
        {key: 'lastTime', text: '更新时间'},
      ],
      editPop:{
          isShow:false,
          title:'修改权限',
          name:'',
          satat:'',
          id:''
      }
    }
  },
  activated () {
    this.curUrl = this.$router.history.current.path;
    this.getList();
  },
  watch:{
//    $route: function () {
//      let route = this.$router.history.current.path;
//      route = route.substr(1);
//      if (this.routeHash[route]) {
//        this.curUrl = this.$router.history.current.path;
//        this.getNodeCode();
//        this.onSubmit('clear');
//      }
//    }
  },
  methods: {
    sizeChange (size) {
      this.req.list.pageSize = size;
      this.getList();
    },
    ClearSelectItem () {
      let that = this;
      that.selectRow = {};
    },
    ImportInClose () {
      this.$refs.newupload.clearFiles();
      this.errorDownLoad = '';
      this.fileName = '';
    },
    DownLoadError () {
      window.open(this.errorDownLoad); //测试url前缀
    },
    uploadDone (response, file, fileList) {
      let that = this;
      if (response.success) {
        if (response.data.path.length > 0) {
          that.errorDownLoad = response.data.path;
          that.$message({
            type: 'warning',
            message: response.msg
          });
        } else {
          that.$message({
            type: 'success',
            message: response.msg
          });
          that.dialogImportIn = false;
          that.onSubmit('clear');
        }
      } else {
        that.$message({
          type: 'warning',
          message: response.msg
        });
      }
    },
    handleDialogImportIn(file, fileList){
      this.fileName = file.name;
      this.excelParam.file = file.name;
      this.excelParam.nodeCode = this.req.list.nodeCode;
    },
    templateLoad (){
      let that = this;
      let parmas = {jsonParam: JSON.stringify({'resType': '0'})};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: '/cms/api/play/loadExcel.do',
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   window.open(res.data.data.path)
      //   that.scrollTop('#sourceList');
      // }).catch(err=>{
      // })

      that.$ajax({
        url: '/cms/api/play/loadExcel.do',
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          window.open(res.data.data.path)
          that.scrollTop('#sourceList');
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    importIn (){
      this.$refs.newupload.submit();
    },
    tableDataPageChange (page) {
      this.firstFlag = false;
      this.getList(page - 1);
    },
    sourceListpageChange (page) {
      this.sorceDialog.req.pageNumber = page - 1;
      this.getSourceList();
    },
    showSourceList () {
      for (let i in this.sorceDialog.req) {
        if (i == 'pageSize') {
          this.sorceDialog.req[i] = 20;
        }else if (i == 'pageNumber') {
          this.sorceDialog.req[i] = 0;
        }
        // else if (i == 'nodeCode') {
        //   this.sorceDialog.req[i] = that.req.list[i];
        // }
        else if(i == 'resType') {
          this.sorceDialog.req[i] = 0;
        }else {
          this.sorceDialog.req[i] = '';
        }
      }
      this.tableSource = [];
      let that = this;
      that.sorceDialog.show = true;
      that.getSourceList();
    },
    getSourceList (type) {
      let that = this;
      if (type == 'clear') {
        that.sorceDialog.req.resCode = '';
        that.sorceDialog.req.resName = '';
        that.sorceDialog.req.pageNumber = 0;
      }else if (type == 'search') {
        that.sorceDialog.req.pageNumber = 0;
      }
      let parmas = {jsonParam: JSON.stringify(that.sorceDialog.req)};
      that.sourceListLoading = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.sourceList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.tableSource = res.data.data.resList || [];
      //   that.tableSourceCount = res.data.data.count || 0;
      //   that.sourceListLoading = false;
      //   that.scrollTop('#sourceList');
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.sourceList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.tableSource = res.data.data.resList || [];
          that.tableSourceCount = res.data.data.count || 0;
          that.sourceListLoading = false;
          that.scrollTop('#sourceList');
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    dialogClose () {
      let that = this;
      for (let i in that.dialogForm) {
        that.dialogForm[i] = '';
      }
    },
    saveSelectionChange (val) {
      let that = this;
      that.tableChosed = [];
      that.tableChosed.push(val);
    },
    addEffect () {
      let that = this;
      if (that.tableChosed.length <= 0) {
        that.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        });
      } else {
        that.dialogForm.resCode = that.tableChosed[0].S_VIDEO_CODE;
        that.dialogForm.resName = that.tableChosed[0].S_VIDEO_NAME;
        that.sorceDialog.show = false;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    responHeight () {
      let dom = this.$el;
      let contain_height = document.body.offsetHeight;
      let search_height = dom.querySelector('.el-form').offsetHeight;
      let static_height = 200;
      let result_height = parseInt(contain_height - search_height - static_height);
      if (result_height >= 300) {
        this.TableHeight = Number(result_height);
      } else {
        this.TableHeight = 400;
      }
    },
    closeDialog () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportOut = false;
    },
    closeImportIn () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportIn = false;
    },
    handleCheckAllChange (val) {
      this.select_export = val ? this.condition_export_all : [];
    },
    handleCheckedCitiesChange(value) {
      let chosed = value.length;
      let all = this.condition_export_all.length;

      if (chosed == all) {
        this.choseAll = true;
      }else {
        this.choseAll = false;
      }
    },
    scrollTop (id) {
      let table = document.querySelector(id);
      let wrap = table.querySelector('.el-table__body-wrapper');
      if (wrap) {
        wrap.scrollTop = 0;
      }else {
        console.error('not found \'el-table__body-wrapper\'');
      }
    },
    getList (page) {
      this.firstFlag = false;
      let s_page = (page >= 0 ? page : this.req.list.pageNumber);
      this.req.list.pageNumber = s_page;
      let that = this;
      let parma = that.req.list;
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getUserList,
      //   method:'post',
      //   data: this.Qs.stringify(parma)
      // }).then(res=>{
      //   console.log(res)
      //   if (res.data.obj.data.length > 0 ) {
      //     that.tableData = res.data.obj.data;
      //     that.tableDataCount = res.data.obj.recordsTotal;
      //   } else {
      //     that.tableData = [];
      //     that.tableDataCount = res.data.obj.recordsTotal;
      //   }
      //   that.tableLoading = false;
      //   // that.ResultDeal(res); // ！处理方法已独立分离
      //   setTimeout(() => {
      //     that.responHeight();
      //   }, 800);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getUserList,
        method: "post",
        data: this.Qs.stringify(parma),
        success: function (res) {
          if (res.data.obj.data.length > 0 ) {
            that.tableData = res.data.obj.data;
            that.tableDataCount = res.data.obj.recordsTotal;
          } else {
            that.tableData = [];
            that.tableDataCount = res.data.obj.recordsTotal;
          }
          that.tableLoading = false;
          // that.ResultDeal(res); // ！处理方法已独立分离
          setTimeout(() => {
            that.responHeight();
          }, 800);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    ResultDeal (res) {
      let that = this;
      let selected = [];
      that.scrollTop('#tableData');
      that.tableData = res.data.data.resList || [];
      that.tableData.forEach( (item, index) => {
        if(that.selectRow[item.pid]){
          selected.push(item);
        }
      });
      if (selected.length > 0) {
        that.$nextTick(function(){
          selected.forEach(item => {
            that.$refs.videoTable.toggleRowSelection(item, true);
          });
        })
      }
      that.tableDataCount = res.data.data.count;
      that.tableLoading = false;
      setTimeout(() => {
        that.responHeight();
      }, 1500);
    },
    selectAll (selection) {
    },
    SelectCheck (val, row) {
      let result = false;
      val.forEach((item, index) => {
        if (item.pid == row.pid) {
          result = true;
        }
      });

      return result;
    },
    selectSingle (val) {
    },
    handleSelectionChange (val) {
      let that = this;
      that.tableChosed = [];
      val.forEach(item => {
        that.tableChosed.push(item.pid);
      });
    },
    clear (){
      this.onSubmit('clear')
    },
    onSubmit (state) {
      let that = this;
      let datas = [];
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.req.list.pageSize = 20;
        that.req.list.pageNumber = 0;
        that.ClearSelectItem();
        that.getList();
      }else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i == 'pageSize') {
            that.req.list[i] = 20;
          }else if (i == 'pageNumber') {
            that.req.list[i] = 0;
          }
          else if (i == 'isSee') {
            that.req.list[i] = '';
          }else {
            that.req.list[i] = '';
          }
        }
        that.ClearSelectItem();
        that.getList();
      }
    },
    edit(data){
        this.editPop.isShow = true;
        this.editPop.name = data.name;
        this.editPop.satat = data.isSee.toString();
        this.editPop.id = data.id
    },
    editPopOk(id){
        const that = this;
        this.$confirm('您是否确定修改该用户权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /*删除函数*/
          const that = this;
          const param = {
            isSee: that.editPop.satat,
            ids: that.editPop.id
          };
          that.$ajax({
            url:that.url.updateSeeStatus,
            method: "post",
            data: this.Qs.stringify(param),
            success: function (res) {
              if (res.data.success) {
                that.$message({
                  type: 'success',
                  message: res.data.msg
                });
                that.editPop.isShow = false;
                 that.onSubmit('search');
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
              }
            },
            error: function (error) {
            }
          });
          /*删除函数*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改权限'
          });
        });
    }
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
  .isShowPop span{display: inline-block;width: 66px;text-align: right;margin-right: 15px;}
</style>
