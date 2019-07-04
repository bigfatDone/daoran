<template>
  <div class="urlManager-list">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="saveOpen('')" title="新增" circle></el-button>
      <el-button type="warning" icon="el-icon-delete" size="mini" @click="del('')" title="批量删除" circle></el-button>
    </div>
    <el-row>
      <el-table
        id="tableData"
        ref="videoTable"
        :data="tableData"
        border
        style="width: 100%"
        empty-text="暂无数据"
        @select-all="selectAll"
        @select="selectSingle"
        :height="TableHeight"
        v-loading="tableLoading">
        <el-table-column
          align="center"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="运营商">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.carrier">{{scope.row.carrierStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="省份">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.proCode">{{scope.row.proName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="盒子型号">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.stbType">{{scope.row.stbType}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="运营平台">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.platform">{{scope.row.platformStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="指定地区">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.areas">{{scope.row.areasStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="播控平台编码">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.playpeCode">{{scope.row.playpeCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="播控平台名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.playpeName">{{scope.row.playpeName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.lastTime">{{scope.row.lastTime | dateForm}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle  @click="saveOpen(scope.row.id)" title="编辑" />
            <el-button icon="el-icon-delete" type="danger" circle  @click="del(scope.row)" title="删除" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="req.list.pageSize"
        :total="tableDataCount"
        :current-page="req.list.currPage + 1"
        :page-sizes="[20, 100, 300, 500, 1000]"
        @size-change="sizeChange"
        @current-change="tableDataPageChange">
      </el-pagination>
    </el-row>
    <!--弹窗-->
    <!-- 播控新增、修改 -->
    <el-dialog
      :title="saveTitle"
      :visible.sync="dialogSave"
      width="700px">
      <save
        v-if="dialogSave"
        :modalData="modalData"
        @closeSave="closeS($event)"
      >
      </save>
    </el-dialog>
    <!--删除二次确认-->
    <el-dialog title="数据操作确认页面" :visible.sync="dialogOperate" @close="closeDelTip" width="600px">
      <el-table
        v-if="dialogOperate"
        :data="listChosed"
        style="width: 100%"
        empty-text="暂无数据"
        height="250">
        <el-table-column
          label="运营商">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.carrier">{{scope.row.carrierStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="省份">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.proCode">{{scope.row.proName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="运营平台">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.platform">{{scope.row.platformStr}}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDelTip">取消</el-button>
        <el-button type="primary" size="mini" @click="lineOper">确定</el-button>
      </div>
    </el-dialog>

   <!--新增、修改-->
    <el-dialog
      width="586px"
      :title="dialog.title"
      :visible.sync="dialog.show"
      @close="dialogClose">
      <el-form
        v-loading="editLoading"
        ref="dialogForm"
        :model="dialogForm"
        :label-width="dialog.formLabelWidth"
        size="mini"
        style="position:relative"
      >
        <span style="display:inline-block;position: absolute;top: 5px;left: 28px;color:red;">*</span>
        <el-form-item prop='incomePayDes' label="剧种编码:">
          <div class="w400">
            <el-input v-model="dialogForm.sectCode" placeholder="只能为字母，且20个字符以内"></el-input>
          </div>
        </el-form-item>
        <span style="display:inline-block;position: absolute;top: 51px;left: 28px;color:red;">*</span>
        <el-form-item prop='incomePayDes' label="剧种名称:">
          <div class="w400">
            <el-input v-model="dialogForm.sectName" placeholder="20个字符以内"></el-input>
          </div>
        </el-form-item>
        <el-form-item  class="text_right">
          <el-button type="primary" @click="dialogFormSubmit">提交</el-button>
          <el-button @click="dialog.show = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import vSearch from './components/search'
import save from './components/bkSave'

export default {
  name: 'urlManager-list',
  props: ['routeHash'],
  components: {
    vSearch,
    save
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
      dialogSave: false,
      modalData: '',
      saveTitle: '',
      url: {
        bkList : "/cms/api/bokong/list.do",
        detial : "/cms/api/bokong/getById.do",
        save : "/cms/api/bokong/save.do",
        del : "/cms/api/bokong/del.do",
        checkUnique : "/cms/api/sect/checkUnique.do",
      },
      dialog: {
        disabledFlag: false,
        width:'400px',
        show : false,
        title: '新增标签类型',
        formLabelWidth:'120px',
        type: 'blank'
      },
      sorceDialog: {
        show: false,
      },
      dialogForm:{
        id    : '',
        sectCode    : '',
        sectName    : '',
      },
      regName: '',
      req: {
        list: {
          carrier    : '',
          platform    : '',
          proCode    : '',
          lastTimeStart    : '',
          lastTimeEnd    : '',
          date    : [],
          currPage   : 0,  //是 int 当前页码
          pageSize   : 20, //是 int 页面容量
        }
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
      listChosed: [],
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
      dialogOperate: false,
      delFlag: false,
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
      ids: '',
    }
  },
  mounted () {
    this.onSubmit('clear');
    this.Resize();
  },
  // watch:{
  //   $route: function () {
  //     let route = this.$router.history.current.path;
  //     route = route.substr(1);
  //     console.log(this.routeHash)
  //     if (this.routeHash[route]) {
  //       this.curUrl = this.$router.history.current.path;
  //       this.getNodeCode();
  //       this.onSubmit('clear');
  //     }
  //   }
  // },
  methods: {
    closeS (ev) {
      this.dialogSave = false;
      if (ev === 'con') {
        this.onSubmit('clear');
      }
    },
    closeDel () {
      this.listChosed = [];
    },
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    sizeChange (size) {
      this.req.list.pageSize = size;
      this.getList();
    },
    ClearSelectItem () {
      let that = this;
      that.selectRow = {};
    },
    tableDataPageChange (page) {
      this.firstFlag = false;
      this.getList(page - 1);
    },
    sourceListpageChange (page) {
      this.sorceDialog.req.currPage = page - 1;
      this.getSourceList();
    },
    dialogClose () {
      let that = this;
      for (let i in that.dialogForm) {
        that.dialogForm[i] = '';
      }
    },
    dialogFormSubmit () {
      let that = this;
      let params;
      let param = that.dialogForm;
      param.sectCode = that.dialogForm.sectCode.replace(/\s+/g,"");
      param.sectName = that.dialogForm.sectName.replace(/\s+/g,"");
      let reg = /^[a-zA-Z]{1,20}$/g;
      if (!reg.test(param.sectCode)) {
        this.$message({
          type: 'warning',
          message: "剧种编码只能为字母，且20个字符以内"
        });
        return;
      };
      if (param.sectName.length > 20) {
        this.$message({
          type: 'warning',
          message: "剧种名称20个字符以内"
        });
        return;
      };
      that.editLoading = true;
      if (this.dialog.type === "edit") {
        param.id = that.dialogForm.id;
      }
      params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.checkUnique,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.data.valiFlag === 'yes') {
            that.save(params);
          } else {
            that.editLoading = false;
            that.$message({
              type: 'warning',
              message: res.data.data.valiMsg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    save(param) {
      let that = this;
      that.$ajax({
        url: that.url.save,
        method: "post",
        data: this.Qs.stringify(param),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$message({
                type: 'success',
                message: res.data.msg
              });
              that.editLoading = false;
              that.dialog.show = false;
              that.onSubmit('clear');
            }, 500);
          }else {
            that.editLoading = false;
            that.$message({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    lineOper () {
      this.del('');
      this.dialogOperate = false;
    },
    closeDelTip () {
      this.dialogOperate = false;
      if (this.delFlag) {
        this.listChosed = [];
      }
      this.delFlag = false;
    },
    del (id) {
      let that = this;
      let param = {};
      if (id !== '') {
        param.ids = id.id;
        this.$refs.videoTable.clearSelection();
        that.listChosed = [];
      } else {
        let listArr = [];
        that.listChosed.forEach(item => {
          listArr.push(item.id);
        });
        param.ids = listArr.toString();
      }
      if (param.ids ==='') {
        that.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        });
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          param = {jsonParam: JSON.stringify(param)}
          that.tableLoading = true;
          that.$ajax({
            url: that.url.del,
            method: "post",
            data: this.Qs.stringify(param),
            success: function (res) {
              that.tableLoading = false;
              that.$message({
                type: 'success',
                message: res.data.msg
              });
              that.listChosed = [];
              that.getList();
              that.dialogOperate = false;
            },
            error: function (error) {
              that.$message.error(error);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      // let listArr = [];
      // that.listChosed.forEach(item => {
      //   listArr.push(item.id);
      // });
      // let param = {
      //   ids: listArr.toString()
      // }

    },
    // del (id) {
    //   let that = this;
    //   if (!that.dialogOperate && id !== '') {
    //     this.delFlag = true;
    //     that.listChosed = [];
    //     this.ids = id.id;
    //     that.listChosed.push(id);
    //     this.$refs.videoTable.clearSelection();
    //   }
    //   if (this.ids ==='' && that.listChosed.length <= 0) {
    //     that.$message({
    //       type: 'warning',
    //       message: '您还没选中任何数据'
    //     });
    //   } else if (!that.dialogOperate) {
    //     that.dialogOperate = true;
    //   } else {
    //     let listArr = [];
    //     that.listChosed.forEach(item => {
    //       listArr.push(item.id);
    //     });
    //     let param = {
    //       ids: listArr.toString()
    //     }
    //     param = {jsonParam: JSON.stringify(param)}
    //     that.tableLoading = true;
    //     that.$ajax({
    //       url: that.url.del,
    //       method: "post",
    //       data: this.Qs.stringify(param),
    //       success: function (res) {
    //         that.tableLoading = false;
    //         that.$message({
    //           type: 'success',
    //           message: res.data.msg
    //         });
    //         that.listChosed = [];
    //         that.ClearSelectItem();
    //         that.getList();
    //         that.dialogOperate = false;
    //       },
    //       error: function (error) {
    //         that.$message.error(error);
    //       }
    //     });
    //   }
    // },
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
      let static_height = 260;
      let result_height = parseInt(contain_height - search_height - static_height);
      if (result_height >= 300) {
        this.TableHeight = Number(result_height);
      } else {
        this.TableHeight = 600;
      }
    },
    saveOpen (data) {
      if (data === '') {
        this.saveTitle = '新增播控';
      } else {
        this.saveTitle = '修改播控';
      }
      this.modalData = data.toString();
      this.dialogSave = true;
    },
    editVideo (row) {
      this.dialog.title = '修改剧种';
      this.dialog.disabledFlag = true;
      this.dialog.show  = true;
      this.dialog.type = 'edit';
      this.dialogForm.id = row.id;
      this.dialogForm.sectCode = row.sectCode;
      this.dialogForm.sectName = row.sectName;
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
      let s_page = (page >= 0 ? page : this.req.list.currPage);
      this.req.list.currPage = s_page;
      let that = this;
      let parma = that.req.list;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      that.$ajax({
        url: that.url.bkList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.ResultDeal(res); // ！处理方法已独立分离
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    ResultDeal (res) {
      let that = this;
      if (!res.data.success) {
        that.tableData = [];
        return;
      }
      let selected = [];
      that.scrollTop('#tableData');
      that.tableData = res.data.data.sectList || [];
      that.tableDataCount = res.data.data.total;
      that.tableLoading = false;
      setTimeout(() => {
        that.responHeight();
      }, 500);
    },
    selectAll (selection) {
      let that = this;
      let selectall = (selection.length == that.tableData.length) ? true : false;

      if (selectall === false) {
        that.ClearSelectItem();
        that.listChosed = [];
      }else {
        that.tableData.forEach((item, index) => {
          that.selectRow[item.pid] = true;
          that.listChosed.push(item);
        });
      }
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
    selectSingle (val, row) {
      let that = this;
      // if (val.length > 0){
        that.listChosed = [];
      // }
      val.forEach(i => {
        that.listChosed.push(i);
      })
    },
    handleSelectionChange (val) {
      let that = this;
      that.tableChosed = [];
      val.forEach(item => {
        that.tableChosed.push(item.pid);
      });
    },
    onSubmit (state) {
      let that = this;
      let datas = [];
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.req.list.pageSize = 20;
        that.req.list.currPage = 0;
        that.listChosed = [];
        that.ClearSelectItem();
        that.getList();
      }else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i == 'pageSize') {
            that.req.list[i] = 20;
          }else if (i == 'currPage') {
            that.req.list[i] = 0;
          }else if (i == 'date') {
            that.req.list[i] = [];
          }else {
            that.req.list[i] = '';
          }
        }
        that.listChosed = [];
        that.ClearSelectItem();
        that.getList();
      }
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
</style>
