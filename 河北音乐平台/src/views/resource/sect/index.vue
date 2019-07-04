<template>
  <div class="urlManager-list">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVideo" title="新增" circle></el-button>
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
          label="ID">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.id">{{scope.row.id}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="编码">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.sectCode">{{scope.row.sectCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.sectName">{{scope.row.sectName}}</p>
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
            <el-button icon="el-icon-edit" circle  @click="editVideo(scope.row)" title="编辑" />
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
    <!--删除二次确认-->
    <!--<el-dialog title="数据操作确认页面" :visible.sync="dialogOperate" @close="closeDelTip" width="600px">-->
      <!--<el-table-->
        <!--v-if="dialogOperate"-->
        <!--:data="listChosed"-->
        <!--style="width: 100%"-->
        <!--empty-text="暂无数据"-->
        <!--height="250">-->
        <!--<el-table-column-->
          <!--label="ID">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="urlManagerData-text">-->
              <!--<p class="urlManager-name text-small" :title="scope.row.id">{{scope.row.id}}</p>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="名称">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="urlManagerData-text">-->
              <!--<p class="urlManager-name text-small" :title="scope.row.sectName">{{scope.row.sectName}}</p>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button size="mini" @click="closeDelTip()">取消</el-button>-->
        <!--<el-button type="primary" size="mini" @click="lineOper">确定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

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
            <el-input v-model="dialogForm.sectCode" placeholder="只能为字母，且8个字符以内"></el-input>
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

export default {
  name: 'urlManager-list',
  props: ['routeHash'],
  components: {
    vSearch
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
      url: {
        sectList : "/cms/api/sect/list.do",
        detial : "/cms/api/sect/getById.do",
        save : "/cms/api/sect/save.do",
        del : "/cms/api/sect/del.do",
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
          sectCode    : '',
          sectName    : '',
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
    closeDel () {
      // this.listChosed = [];
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
    sectCodeKeyUp() {
      let s = this.dialogForm.sectCode.replace(/\s+/g,"");
      let reg = /^[a-zA-Z]{1,8}$/g;
      // if (!reg.test(param.sectCode)) {
      //   this.$message({
      //     type: 'warning',
      //     message: "剧种编码只能为字母，且8个字符以内"
      //   });
      // };
    },
    dialogFormSubmit () {
      let that = this;
      let params;
      let param = that.dialogForm;
      param.sectCode = that.dialogForm.sectCode.replace(/\s+/g,"");
      param.sectName = that.dialogForm.sectName.replace(/\s+/g,"");
      let reg = /^[a-zA-Z]{1,8}$/g;
      if (!reg.test(param.sectCode)) {
        this.$message({
          type: 'warning',
          message: "剧种编码只能为字母，且不能超过8个字符。例子：hbbz:河北梆子"
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
              console.log(res)
              if (res.data.success) {
                that.tableLoading = false;
                that.$message({
                  type: 'success',
                  message: res.data.msg
                });
                that.getList();
              } else {
                that.tableLoading = false;
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                });
              }
              that.listChosed = [];
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
    addVideo () {
      for (let i in this.dialogForm) {
        this.dialogForm[i] = '';
      }
      this.dialog.disabledFlag = false;
      this.dialog.title = '新增剧种';
      this.dialog.show  = true;
      this.dialog.type = 'add';
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
        url: that.url.sectList,
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
      that.listChosed = [];
      let selectall = (selection.length == that.tableData.length) ? true : false;
      that.tableData.forEach((item, index) => {
        that.selectRow[item.pid] = true;
        that.listChosed.push(item);
      });
      // if (selectall === false) {
      //   that.ClearSelectItem();
      //   that.listChosed = [];
      // }else {
      //   that.tableData.forEach((item, index) => {
      //     that.selectRow[item.pid] = true;
      //     that.listChosed.push(item);
      //   });
      // }
    },
    selectSingle (val, row) {
      let that = this;
      that.listChosed = [];
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
