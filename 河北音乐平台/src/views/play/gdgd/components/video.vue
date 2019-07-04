<template>
  <div class="urlManager-list">
    <div class="searchWrap"><v-search
      labelPosition="right"
      :formInline="req.list"
      @vSearch="onSubmit($event)"></v-search></div>

    <div class="btnGroup">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVideo" title="新增" circle></el-button>
      <el-button type="primary" icon="el-icon-arrow-up" size="mini" @click="setEffect" title="上线" circle></el-button>
      <el-button type="primary" icon="el-icon-arrow-down" size="mini" @click="setEffectOff" title="下线" circle></el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" title="批量导入" circle  @click="dialogImportIn = true"></el-button>
      <el-button type="primary" icon="el-icon-upload2" size="mini" title="导出表格" circle @click="dialogImportOut = true"></el-button>
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
          width="250"
          label="资源">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name" :title="scope.row.resName">{{scope.row.resName}}</p>
              <p class="urlManager-code" :title="scope.row.resCode">资源编码：{{scope.row.resCode}}</p>
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
          label="高清播放地址">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.playUrlGQ">{{scope.row.playUrlGQ}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="标清播放地址">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.playUrl">{{scope.row.playUrl}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="艺人信息">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="资源状态">
          <template slot-scope="scope">
            <span :class="{'actived' : scope.row.resState == 1}">{{scope.row.resState == 0 ? '下线' : '上线'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="上线生效时间">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.onlineDate">{{scope.row.onlineDate}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.lastTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle  @click="editVideo(scope.row)" title="编辑" />
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
    <!--上下线二次确认-->
    <el-dialog title="数据操作确认页面" :visible.sync="dialogOperate" width="600px">
      <el-table
        v-if="dialogOperate"
        :data="listChosed"
        style="width: 100%"
        empty-text="暂无数据"
        height="250">
        <el-table-column
          label="资源名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.resName">{{scope.row.resName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源编码">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.resName">{{scope.row.resCode}}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogOperate = false">取消</el-button>
        <el-button type="primary" size="mini" @click="lineOper">确定</el-button>
      </div>
    </el-dialog>
    <!--导出-->
    <el-dialog title="导出设置" :visible.sync="dialogImportOut" :show-close="false" v-loading="importOuting" @close="dialogClose">
      <el-form ref="form" label-width="80px">
        <el-form-item label="">
          <el-checkbox :indeterminate="isIndeterminate" v-model="choseAll" @change="handleCheckAllChange">全选</el-checkbox>
        </el-form-item>
        <el-form-item label="基础信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_base" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="播放信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_more" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="艺人信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_artist" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="mini" @click="importOut">确定</el-button>
      </div>
    </el-dialog>
    <!--批量导入-->
    <el-dialog
      width="500px"
      :visible.sync="dialogImportIn"
      @close="ImportInClose"
      :show-close="false"
      v-loading="importOuting">
      <div class="title" slot="title">
        批量导入
        <el-button @click="templateLoad" size="mini">模板下载</el-button>
      </div>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-upload style="width:80px"
          class="upload-excel"
          action="/cms/api/play/importPlayExcel.do"
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
        <el-button size="mini" @click="DownLoadError" v-show="errorDownLoad.length > 0">点击下载错误报告</el-button>
        <el-button size="mini" @click="closeImportIn">取消</el-button>
        <el-button type="primary" size="mini" @click="importIn">确定</el-button>
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
        size="mini">
        <el-form-item prop='incomePayDes' label="资源编码:">
          <div class="w350">
            <el-input :disabled="true" v-model="dialogForm.resCode"></el-input>
          </div>
          <el-button :disabled="dialog.disabledFlag" icon="el-icon-zoom-in" size="mini" @click="showSourceList"></el-button>
        </el-form-item>
        <el-form-item prop='incomePayDes' label="资源名称:">
          <div class="w400">
            <el-input disabled v-model="dialogForm.resName"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop='incomePayDes' label="节点信息:">
          <div class="w400">
            <el-input disabled v-model="fixCodeName"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="播控平台:" >
          <div class="w400">
            <el-select v-model="newPlaypfCode" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in playCodeFlag"
                :key="item.playpeCode"
                :label="item.playpeName"
                :value="item.playpeCode"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="资源状态:" >
          <div class="w400">
            <el-select v-model="dialogForm.resState" placeholder="请选择" style="width: 100%;">
              <el-option label="上线" :value="1"></el-option>
              <el-option label="下线" :value="0"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item prop='incomePayDes' label="上线生效时间:">
          <div class="block">
            <el-date-picker
              v-model="dialogForm.time"
              type="date"
              size= "small"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop='incomePayDes' label="高清播放地址:">
          <div class="w400">
            <el-input v-model="dialogForm.playUrlGQ"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop='income'  label="标清播放地址:">
          <div class="w400">
            <el-input type="income" v-model.number="dialogForm.playUrl"></el-input>
          </div>
        </el-form-item>
        <el-form-item  class="text_right">
          <el-button type="primary" @click="dialogFormSubmit">提交</el-button>
          <el-button @click="dialog.show = false">取消</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        title="资源信息列表"
        width="700px"
        :append-to-body="true"
        :visible.sync="sorceDialog.show">
        <el-form :inline="true" size="mini">
          <el-form-item label="资源编码">
            <el-input v-model="sorceDialog.req.resCode"></el-input>
          </el-form-item>
          <el-form-item label="资源名称">
            <el-input v-model="sorceDialog.req.resName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getSourceList('search')"></el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="getSourceList('clear')"></el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
        <el-table
          id="sourceList"
          v-loading="sourceListLoading"
          :data="tableSource"
          border
          style="width: 100%"
          height="400"
          @selection-change="handleSelectionChange"
          empty-text="暂无数据">
          <el-table-column
            width="50"
            align="center"
            label="选择">
            <template slot-scope="scope">
              <input type="radio" name="sourceId"  :value="scope.row.S_VIDEO_CODE" @click = "saveSelectionChange(scope.row)">
            </template>
          </el-table-column>
          <el-table-column label="资源编码" prop="S_VIDEO_CODE"></el-table-column>
          <el-table-column label="资源名称" prop="S_VIDEO_NAME"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="sorceDialog.req.pageSize"
          :total="tableSourceCount"
          :current-page="sorceDialog.req.currPage + 1"
          @current-change="sourceListpageChange">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addEffect">确定</el-button>
          <el-button @click="sorceDialog.show = false" size="mini">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import vSearch from './vsearch'

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
      selectRow: {},
      unSelectRow: {},
      firstFlag : true,
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      curUrl: '',
      url: {
        urlManagerList : "/cms/api/play/getResList.do",
        addVideoResPlay : "/cms/api/play/addVideoResPlay.do",
        getResPlayInfo : "/cms/api/play/getResPlayInfo.do",
        sourceList: '/cms/api/play/getNewList.do',
        listUpdate: '/cms/api/play/updateResPlayInfo.do',
        importOut: '/cms/api/play/exportAudioPlayExcel.do',
        bokongList: '/cms/api/bokong/chooseList.do',
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
          currPage: 0, // 是  string  当前页码（从1开始）
        }
      },
      dialogForm:{
        resCode    : '',
        resFileCode: '',
        resName    : '',
        nodeCode   : '',
        playpfCode : '',
        resState   : '',
        time       : '',
        playUrlGQ  : '',
        playUrl    : '',
        type: '',
        oldPlaypfCode: '',
      },
      req: {
        list: {
          artistCode : '',
          artistName : '',
          haddress   : '',
          saddress   : '',
          resCode    : '', //否 string  资源编码
          resFileCode: '', //否 string  资源文件编码
          resName    : '', //否 string  资源名
          nodeCode   : '', //是 string  节点编码
          resState   : '', //否 string  资源状态（上下线）
          resType    : 0, //-------是 int 资源类型 0视频 1音频
          hasUrl     : '', //否 int 是否有播放地址 0没有 1有
          beginTime  : '', //否 date  更新时间开始
          endTime    : '', //否 date  更新时间结束
          currPage   : 0,  //是 int 当前页码
          pageSize   : 20, //是 int 页面容量
          date   : [],
        }
      },
      playCodeFlag: [
        {playpeCode: '000', playpeName: '通用播控平台'},
        // {playpeCode: '001', playpeName: '联通河南华为平台'},
        // {playpeCode: '002', playpeName: '联通河南中心平台'},
        // {playpeCode: '003', playpeName: '联通河北华为平台'},
        // {playpeCode: '004', playpeName: '联通河北中心平台'},
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
      controlFlag: false,
      lineStatus: "",
      dialogImportOut: false,
      dialogImportIn: false,
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      listload: true,
      TableHeight: 500,
      condition_export_all: [
        'resName',
        'resCode',
        'playUrlGQ',
        'playUrl',
        'resState',
        'lastTime',
        'artistName',
        'artistCode',
        // 'haddress',
        // 'saddress'
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
      condition_export_artist: [
        {key: 'artistName', text: '艺人名称'},
        {key: 'artistCode', text: '艺人编码'},
      ],
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
    }
  },
  mounted () {
    this.curUrl = this.$router.history.current.path;
    this.getNodeCode();
    this.getBKList();
    this.Resize();
    this.onSubmit('clear');
  },
  watch:{
    $route: function () {
      let route = this.$router.history.current.path;
      route = route.substr(1);
      if (this.routeHash[route]) {
        this.curUrl = this.$router.history.current.path;
        this.getBKList();
        this.getNodeCode();
        this.onSubmit('clear');
      }
    }
  },
  methods: {
    getBKList () {
      let that = this;
      that.playCodeFlag= [{playpeCode: '000', playpeName: '通用播控平台'}],
      that.$ajax({
        url: that.url.bokongList,
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach( i => {
            that.playCodeFlag.push(i)
          });
          // that.cpList.unshift({
          //   cpId: '',
          //   fullName: '请选择'
          // })
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
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
          that.importOuting = false;
          that.configNum += 1;
          that.errorDownLoad = response.data.path;
          that.$message({
            type: 'warning',
            message: response.msg
          });
        } else {
          that.importOuting = false;
          that.$message({
            type: 'success',
            message: response.msg
          });
          that.dialogImportIn = false;
          that.onSubmit('clear');
        }
      } else {
        that.importOuting = false;
        that.configNum += 1;
        that.$message({
          type: 'warning',
          message: response.msg
        });
      }
    },
    handleDialogImportIn (file, fileList) {
      this.isempty = true;
      this.fileName = file.name;
      this.excelParam.file = file.name;
      this.excelParam.nodeCode = this.req.list.nodeCode;
    },
    templateLoad () {
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
      //   console.log(err);
      // })

      that.$ajax({
        url: "/cms/api/play/loadExcel.do",
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
    beforeUpload() {
      this.configNum = 0;
    },
    importIn (){
      let that = this;
      if (that.configNum === 0 && that.isempty) {
        this.$refs.newupload.submit();
        this.importOuting = true;
      } else {
        that.$message({
          message: '请上传正确格式的文件',
          type: 'warning'
        })
      }
    },
    tableDataPageChange (page) {
      this.firstFlag = false;
      this.getList(page - 1);
    },
    sourceListpageChange (page) {
      this.sorceDialog.req.currPage = page - 1;
      this.getSourceList();
    },
    showSourceList () {
      for (let i in this.sorceDialog.req) {
        if (i == 'pageSize') {
          this.sorceDialog.req[i] = 20;
        }else if (i == 'currPage') {
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
        that.sorceDialog.req.currPage = 0;
      }else if (type == 'search') {
        that.sorceDialog.req.currPage = 0;
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
    dialogFormSubmit () {
      let that = this;
      let params;
      let param = {
        resCode: that.dialogForm.resCode,
        nodeCode: this.req.list.nodeCode,
        resType: '0',
        resStatus: that.dialogForm.resState,
        onlineDate: that.dialogForm.time,
        playUrl: that.dialogForm.playUrl,
        playUrlGQ: that.dialogForm.playUrlGQ,
      };
      that.editLoading = true;
      if (this.dialog.type === "add") {
        param.playpfCode = that.newPlaypfCode,
        params = {jsonParam: JSON.stringify(param)};
        this.axios({
          headers: {
            'deviceCode': 'A95ZEF1-47B5-AC90BF3'
          },
          url: that.url.addVideoResPlay,
          method:'post',
          data: this.Qs.stringify(params)
        }).then(res => {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: '新增成功'
              });
              that.editLoading = false;
              that.dialog.show = false;
              that.getList();
            }, 500);
          }else {
            that.editLoading = false;
            that.$notify({
              type: 'warning',
              message: res.data.msg
            });
          }
        }).catch(err=>{
          console.log(err);
        });
      } else if (this.dialog.type === "edit"){
        param.oldPlaypfCode = that.dialogForm.oldPlaypfCode,
        param.newPlaypfCode = that.newPlaypfCode,
        param.resFileCode = that.dialogForm.resFileCode,
        params = {jsonParam: JSON.stringify(param)};
        this.axios({
          headers: {
            'deviceCode': 'A95ZEF1-47B5-AC90BF3'
          },
          url: that.url.listUpdate,
          method:'post',
          data: this.Qs.stringify(params)
        }).then(res => {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: '修改成功'
              });
              that.editLoading = false;
              that.dialog.show = false;
              that.getList();
            }, 500);
          }else {
            that.editLoading = false;
            that.$notify({
              type: 'warning',
              message: res.data.msg
            });
          }
        }).catch(err=>{
          console.log(err);
        });
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
    lineOper(){
      if(this.lineStatus === 'up'){
        this.setEffect();
      } else {
        this.setEffectOff();
      }
      this.dialogOperate = false;
    },
    setEffect () {
      let that = this;
      if (that.listChosed.length <= 0) {
        that.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        });
      } else if (!that.dialogOperate) {
        that.dialogOperate = true;
        that.lineStatus = 'up';
      } else {
        let listArr = [];
        that.listChosed.forEach(item => {
          listArr.push(item.pid);
        });
        let param = {
          resType: '0',
          pidList: listArr.toString()
        }
        param = {jsonParam: JSON.stringify(param)}
        that.tableLoading = true;
        // this.axios({
        //   headers: {
        //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        //   },
        //   url: '/cms/api/play/onlineRes.do',
        //   method: 'post',
        //   data: this.Qs.stringify(param)
        // }).then(res => {
        //   that.tableLoading = false;
        //   that.$message({
        //     type: 'success',
        //     message: res.data.msg
        //   });
        //   that.listChosed = [];
        //   that.ClearSelectItem();
        //   that.getList();
        //   that.dialogOperate = false;
        // }).catch(err => {
        //   console.log(err);
        // })

        that.$ajax({
          url: '/cms/api/play/onlineRes.do',
          method: "post",
          data: this.Qs.stringify(param),
          success: function (res) {
            that.tableLoading = false;
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.listChosed = [];
            that.ClearSelectItem();
            that.getList();
            that.dialogOperate = false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      }
    },
    setEffectOff () {
      let that = this;
      if (that.listChosed.length <= 0) {
        that.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        });
      } else if (!that.dialogOperate) {
        that.dialogOperate = true;
        that.lineStatus = 'down';
      } else {
        let listArr = [];
        that.listChosed.forEach(item => {
          listArr.push(item.pid);
        });
        let param = {
          resType: '0',
          pidList: listArr.toString()
        }
        param = {jsonParam: JSON.stringify(param)}
        that.tableLoading = true;
        // this.axios({
        //   headers: {
        //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        //   },
        //   url: '/cms/api/play/downlineRes.do',
        //   method: 'post',
        //   data: this.Qs.stringify(param)
        // }).then(res => {
        //   that.tableLoading = false;
        //   that.$message({
        //     type: 'success',
        //     message: res.data.msg
        //   });
        //   that.listChosed = [];
        //   //that.selectRow = {};
        //   that.ClearSelectItem();
        //   that.getList();
        //   that.dialogOperate = false;
        // }).catch(err => {
        //   console.log(err);
        // })

        that.$ajax({
          url: '/cms/api/play/downlineRes.do',
          method: "post",
          data: this.Qs.stringify(param),
          success: function (res) {
            that.tableLoading = false;
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.listChosed = [];
            //that.selectRow = {};
            that.ClearSelectItem();
            that.getList();
            that.dialogOperate = false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
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
      let search_height = dom.querySelector('.searchWrap').offsetHeight;
      let static_height = 300;
      let result_height = parseInt(contain_height - search_height - static_height);
      if (result_height >= 300) {
        this.TableHeight = Number(result_height);
      } else {
        this.TableHeight = 400;
      }
    },
    addVideo () {
      for(let i in this.dialogForm){
        this.dialogForm[i] = '';
      }
      this.newPlaypfCode = '';
      this.dialog.disabledFlag = false;
      this.dialog.title = '新增视频播放地址';
      this.dialog.show  = true;
      this.dialog.type = 'add';
    },
    editVideo (row) {
      this.dialog.title = '修改视频播放地址';
      this.dialog.disabledFlag = true;
      this.dialog.show  = true;
      this.dialog.type = 'edit';
      this.dialogForm.resCode = row.resCode;
      this.dialogForm.resName = row.resName;
      this.dialogForm.oldPlaypfCode = row.playpfCode;
      this.newPlaypfCode = row.playpfCode;
      this.dialogForm.resState = row.resState;
      this.dialogForm.playUrlGQ = row.playUrlGQ;
      this.dialogForm.playUrl = row.playUrl;
      this.dialogForm.resFileCode = row.resFileCode;
      this.dialogForm.time = row.onlineDate;
    },
    importOut () {
      let that = this;
      let obj = {};
      let req = {
        artistCode:this.req.list.artistCode,
        artistName:this.req.list.artistName,
        resCode:this.req.list.resCode,
        resName:this.req.list.resName,
        hasUrl:this.req.list.hasUrl,
        resType:this.req.list.resType,
        resState:this.req.list.resState,
        nodeCode:this.req.list.nodeCode,
        haddress:this.req.list.haddress,
        saddress:this.req.list.saddress,
        beginTime:this.req.list.beginTime,
        endTime:this.req.list.endTime,
        exportField: this.select_export.join(",")
      }
      let params = {jsonParam: JSON.stringify(req)};
      if (this.select_export.length === 0) {
        this.$message({
          type: 'warning',
          message: '未选择导出条件！'
        })
        return;
      };
      // let req = {search: obj, exportField: this.select_export.join(",")};
      // let params = {jsonParam: JSON.stringify(req)};
      that.importOuting = true;
      let url = '/cms/api/play/exportAudioPlayExcel.do?resCode=' + req.resCode + '&resName=' + req.resName + '&resState=' + req.resState + '&resType=' + req.resType + '&nodeCode=' + req.nodeCode
        + '&haddress=' + req.haddress + '&saddress=' + req.saddress + '&artistCode=' + req.artistCode + '&artistName=' + req.artistName + '&beginTime=' + req.beginTime + '&endTime=' + req.endTime + '&exportField=' + this.select_export.join(",");
      window.open(url);
      that.importOuting = false;

      // that.$ajax({
      //   url: that.url.importOut,
      //   method: "post",
      //   data: this.Qs.stringify(params),
      //   success: function (res) {
      //     that.importOuting = false;
      //     if (res.data.success) {
      //       window.open(res.data.data.path);
      //     }else {
      //       that.$message({
      //         message: res.data.msg,
      //         type: 'warning'
      //       })
      //     }
      //   },
      //   error: function (error) {
      //     that.$message.error(error);
      //   }
      // });
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
      // let table = document.querySelector(id);
      // let wrap = table.querySelector('.el-table__body-wrapper');
      // if (wrap) {
      //   wrap.scrollTop = 0;
      // }else {
      //   console.error('not found \'el-table__body-wrapper\'');
      // }
    },
    getNodeCode(){
      let parma = this.req.list;
      let that = this;
      this.tableData = [];
      that.ClearSelectItem();
      if (this.curUrl === '/gdgd'){
        parma.nodeCode = '134401';
        this.fixCodeName = '广东广电';
      } else if (this.curUrl === '/xjgd') {
        parma.nodeCode = '041301';
        this.fixCodeName = '河北音乐平台';
      } else if (this.curUrl === '/tjlt') {
        parma.nodeCode = '021200';
        this.fixCodeName = '联通TV中心 ';
      } else if (this.curUrl === '/tjgd') {
        parma.nodeCode = '231201';
        this.fixCodeName = '天津广电';
      } else if (this.curUrl === '/sdgd') {
        parma.nodeCode = '033701';
        this.fixCodeName = '山东广电';
      } else if (this.curUrl === '/hngd') {
        parma.nodeCode = '034301';
        this.fixCodeName = '湖南广电';
      } else if (this.curUrl === '/jsdx') {
        parma.nodeCode = '013200';
        this.fixCodeName = '江苏电信';
      } else if (this.curUrl === '/OTT') {
        parma.nodeCode = '001000';
        this.fixCodeName = 'OTT节点';
      } else if (this.curUrl === '/gxgd') {
        parma.nodeCode = '034501';
        this.fixCodeName = '广西广电';
      } else if (this.curUrl === '/hblt') {
        parma.nodeCode = '021301';
        this.fixCodeName = '河北联通单省节点';
      } else if (this.curUrl === '/hbgd') {
        parma.nodeCode = '034201';
        this.fixCodeName = '湖北广电';
      } else if (this.curUrl === '/gzdx') {
        parma.nodeCode = '015201';
        this.fixCodeName = '贵州电信';
      } else if (this.curUrl === '/sxgd') {
        parma.nodeCode = '031401';
        this.fixCodeName = '山西广电';
      } else if (this.curUrl === '/hbltD') {
        parma.nodeCode = '021302';
        this.fixCodeName = '河北联通直属节点';
      } else if (this.curUrl === '/cxgdS') {
        parma.nodeCode = '036101';
        this.fixCodeName = '陕西广电单省节点';
      } else if (this.curUrl === '/cxslD') {
        parma.nodeCode = '036102';
        this.fixCodeName = '陕西丝路直属节点';
      } else if (this.curUrl === '/hnltS') {
        parma.nodeCode = '024101';
        this.fixCodeName = '河南联通单省节点';
      } else if (this.curUrl === '/scydS') {
        parma.nodeCode = '045101';
        this.fixCodeName = '四川移动单省节点';
      } else if (this.curUrl === '/jxgdS') {
        parma.nodeCode = '033601';
        this.fixCodeName = '江西广电单省节点';
      } else if (this.curUrl === '/ynyd') {
        parma.nodeCode = '045301';
        this.fixCodeName = '云南移动单省节点';
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
      //   url: that.url.urlManagerList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.ResultDeal(res); // ！处理方法已独立分离
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.urlManagerList,
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
      let result = that.SelectCheck(val, row); // 勾选-取消勾选
      if (result) {
        that.selectRow[row.pid] = true;
        that.listChosed.push(row);
      }else {
        delete that.selectRow[row.pid];
        for (let i=0; i<that.listChosed.length; i++) {
          let item = that.listChosed[i];
          if (item.pid == row.pid) {
            that.listChosed.splice(i, 1);
            break;
          }
        }
      }
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
          }
          else if (i == 'nodeCode') {
            that.req.list[i] = that.req.list[i];
          }
          else if(i == 'resType') {
            that.req.list[i] = 0;
          }
          else if(i == 'date') {
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
