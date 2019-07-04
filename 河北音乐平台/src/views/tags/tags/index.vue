<template>
  <div class="urlManager-list">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      :tagSelectUrl="url.tagSelect"
      @getTagType="getTags($event)"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVideo()" title="新增" circle></el-button>
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
          label="名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.name">{{scope.row.name}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="类型">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.typeName">{{scope.row.typeName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源数量">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.resCount">{{scope.row.resCount}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit-outline" circle  @click="choose(scope.row)" title="去重" />
            <el-button icon="el-icon-view" circle  @click="openArtList(scope.row)" title="查看详情" />
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
    <!--筛选功能-->
    <el-dialog title="资源信息" :visible.sync="dialogChoose" width="60%">
      <mchoose
        v-if="dialogChoose"
        :tagId="chooseId"
        @closeChoose="closeCh($event)"
      >
      </mchoose>
    </el-dialog>

    <!--&lt;!&ndash;删除二次确认&ndash;&gt;-->
    <!--<el-dialog title="数据操作确认页面" :visible.sync="dialogOperate" @close="closeDelTip" width="600px">-->
      <!--<el-table-->
        <!--v-if="dialogOperate"-->
        <!--:data="listChosed"-->
        <!--:close-on-click-modal="false"-->
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
              <!--<p class="urlManager-name text-small" :title="scope.row.name">{{scope.row.name}}</p>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button size="mini" @click="closeDelTip">取消</el-button>-->
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
        size="mini">
        <el-form-item prop='incomePayDes' label="标签名称:">
          <div class="w400">
            <el-input v-model="dialogForm.name"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="类型名称:" >
          <div class="w400">
            <el-select v-model="dialogForm.tagName" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in tagsTypeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item  class="text_right">
          <el-button type="primary" @click="dialogFormSubmit">提交</el-button>
          <el-button @click="dialog.show = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!--查看详情-->
    <el-dialog title="资源信息" :visible.sync="dialogArtListChose" width="70%" id="dialog-wrap">
      <el-table
        v-loading="dialogArtListLoading"
        :data="dialogArtList"
        border
        style="width: 100%"
        height="300"
        empty-text="暂无数据" >
        <el-table-column property="date" label="资源编码" prop="resCode"></el-table-column>
        <el-table-column property="name" label="资源名称" prop="resName"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogArtListChose = false" size="mini">确定</el-button>
        <!--<el-button type="primary" size="mini" @click="addArtList">添加</el-button>-->
      </div>
    </el-dialog>  </div>
</template>

<script>
import vSearch from './components/search'
import mchoose from './components/rmchoose'

export default {
  name: 'urlManager-list',
  props: ['routeHash'],
  components: {
    vSearch,
    mchoose
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
      chooseId: '',
      url: {
        tagList : "/cms/api/tag/list.do",
        tagDetial : "/cms/api/tag/getById.do",
        tagSave : "/cms/api/tag/save.do",
        tagDel : "/cms/api/tag/del.do",
        tagResShow : "/cms/api/tag/resShow.do",
        tagSelect : "/cms/api/tagType/select.do",
      },
      dialog: {
        disabledFlag: false,
        width:'400px',
        show : false,
        title: '新增标签',
        formLabelWidth:'120px',
        type: 'blank'
      },
      sorceDialog: {
        show: false,
      },
      dialogForm:{
        name    : '',
        tagName    : '',
        id    : '',
        // resFileCode: '',
        // resName    : '',
        // nodeCode   : '',
        // playpfCode : '',
        // resState   : '',
        // time       : '',
        // playUrlGQ  : '',
        // playUrl    : '',
        // type: '',
        // oldPlaypfCode: '',
      },
      regName: '',
      req: {
        list: {
          name    : '', //否 string  标签名
          typeId    : '', //否 string  标签类型
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
      dialogArtListChose: false,
      dialogArtListLoading: false,
      select_export: [],
      listload: true,
      TableHeight: 600,
      ids: '',
      tagsTypeData: [],
      dialogArtList: [],
      dialogArtListReq: {
        tagId: '',
      },
    }
  },
  activated () {
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
    closeCh(ev){
      this.dialogChoose = ev;
      this.onSubmit('clear');
    },
    choose (data) {
      let that = this;
      that.dialogChoose = true;
      that.chooseId = data.id;
    },
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
    dialogFormSubmit () {
      let that = this;
      let params;
      let param = {
        name: that.dialogForm.name,
        typeId: that.dialogForm.tagName,
      };
      that.editLoading = true;
      if (this.dialog.type === "edit") {
        param.id = that.dialogForm.id
        if (this.regName === this.dialogForm.name) {
          param.first = false;
        } else {
          param.first = true;
        }
      } else {
        param.first = false;
      }
      params = {jsonParam: JSON.stringify(param)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagSave,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if (res.data.success) {
      //     setTimeout((e) => {
      //       that.$notify({
      //         type: 'success',
      //         message: '修改成功'
      //       });
      //       that.editLoading = false;
      //       that.dialog.show = false;
      //       that.onSubmit('clear');
      //     }, 500);
      //   }else {
      //     that.editLoading = false;
      //     that.$notify({
      //       type: 'warning',
      //       message: res.data.msg
      //     });
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // });

      that.$ajax({
        url: that.url.tagSave,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            let msg = (param.id) ? "修改成功"  : "新增成功"
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: msg
              });
              that.editLoading = false;
              that.dialog.show = false;
              that.onSubmit('clear');
            }, 500);
          }else {
            that.editLoading = false;
            that.$notify({
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
            url: that.url.tagDel,
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
    //     that.listChosed = [];
    //     this.ids = id.id;
    //     that.listChosed.push(id);
    //     this.delFlag = true;
    //     this.$refs.videoTable.clearSelection();
    //   }
    //   if (this.ids === '' && that.listChosed.length <= 0) {
    //     that.$message({
    //       type: 'warning',
    //       message: '您还没选中任何数据'
    //     });
    //   } else if (!that.dialogOperate) {
    //     that.dialogOperate = true;
    //   } else {
    //     let listArr = [];
    //     // if (this.ids === '') {
    //       that.listChosed.forEach(item => {
    //         listArr.push(item.id);
    //       });
    //     // } else {
    //     //   listArr.push(this.ids);
    //     // }
    //     let param = {
    //       ids: listArr.toString()
    //     }
    //     param = {jsonParam: JSON.stringify(param)}
    //     that.tableLoading = true;
    //
    //     that.$ajax({
    //       url: that.url.tagDel,
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
    addVideo () {
      for(let i in this.dialogForm){
        this.dialogForm[i] = '';
      }
      this.newPlaypfCode = '';
      this.dialog.disabledFlag = false;
      this.dialog.title = '新增标签';
      this.dialog.show  = true;
      this.dialog.type = 'add';
    },
    editVideo (row) {
      this.dialog.title = '修改标签';
      this.dialog.disabledFlag = true;
      this.dialog.show  = true;
      this.dialog.type = 'edit';
      this.dialogForm.id = row.id;
      this.dialogForm.name = row.name;
      this.regName = row.name;
      this.dialogForm.tagName = row.typeId;
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

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.ResultDeal(res); // ！处理方法已独立分离
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.tagList,
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
      that.tableData = res.data.data.tagList || [];
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
    getTags(data){
      let that = this;
      this.tagsTypeData = data;
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
    },
    //查看详情
    openArtList(data) {
      this.dialogArtListChose = true;
      let that = this;
      that.dialogArtListReq['tagId'] = data.id;
      // that.dialogArtListReq['resCode'] = data.typeId;
      // that.dialogArtListReq['resName'] = data.typeName;
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};
      // this.$store.commit('_routerAudioChange', 'video');
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagResShow,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   that.dialogArtList = res.data.data.resList;
      //   that.dialogArtListLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.tagResShow,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.dialogArtList = res.data.data.resList;
          that.dialogArtListLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
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
