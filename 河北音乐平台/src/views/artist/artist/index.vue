<template>
  <div class="audio-list" style="position: relative;">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      :cpListurl="url.getCp"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup">
      <!--<el-button type="primary" icon="el-icon-upload" title="导出" size="mini" @click="dialogImportOut = true">导出数据</el-button>-->
      <el-button type="primary" icon="el-icon-upload2" size="mini" title="导出表格" circle @click="dialogImportOut = true"></el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" title="批量修改" circle  @click="dialogImportIn = true" v-if="judge()"></el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" title="批量上传" circle  @click="dialogUpdata = true" v-if="judge()"></el-button>
    </div>
    <div style="position: absolute;right: 26px;top: 114px;">总数：
      <i v-if="totleCount !== ''" style="color: #409EFF;">{{totleCount}}</i>
      <i v-else style="color: #409EFF;">暂无</i>
    </div>
    <el-row>
      <el-table
        v-tabelLoadmore="tableLoadMore"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        empty-text="暂无数据"
        :height="TableHeight"
        v-loading="tableLoading">
        <el-table-column
          label="艺人">
          <template slot-scope="scope">
            <div class="vedioData">
              <div class="vedioData-img">
                <img :src="img_pre + scope.row.image">
              </div>
              <div class="vedioData-text">
                <p class="audio-name">{{scope.row.artistName}}</p>
                <p class="audio-code">艺人编码：{{scope.row.artistCode}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="artistName"
          label="资源数">
          <template slot-scope="scope">
            <div class="">
              <div class="fontCount">
                <p class="">音频：<span  @click="sendParams( 'audio',scope.row.artistCode)">{{scope.row.audioCount}}</span></p>
                <p class="">视频：<span  @click="sendParams( 'video',scope.row.artistCode)">{{scope.row.videoCount}}</span></p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="所属地区">
          <template slot-scope="scope">
            <!-- {{scope.row.videoType}} -->
            {{scope.row.areaText}}
          </template>
        </el-table-column>
        <el-table-column
          label="艺人类型">
          <template slot-scope="scope">
            <!-- {{scope.row.videoType}} -->
            {{scope.row.artistText}}
          </template>
        </el-table-column>
        <el-table-column
          label="艺人流派">
          <template slot-scope="scope">
            <!-- {{scope.row.videoType}} -->
            {{scope.row.sectName}}
          </template>
        </el-table-column>
        <el-table-column
          label="上下线状态">
          <template slot-scope="scope">
            <!-- {{scope.row.videoType}} -->
            {{scope.row.iStatus === 1 ? '上线' : '下线'}}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.lastTime | dateForm}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <!--<el-tooltip content="管理">-->
              <el-button icon="el-icon-edit" circle @click="edit(scope.$index, scope.row)"  title="管理"/>
              <el-button icon="el-icon-delete" type="danger" circle  @click="dropArt('open', scope.row.artistCode)" title="删除" v-if="judge()"/>
            <!--</el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--弹窗-->
    <el-dialog title="导出设置" :visible.sync="dialogImportOut" :show-close="false">
      <el-form ref="form" label-width="80px">
        <el-form-item label="">
          <el-checkbox :indeterminate="isIndeterminate" v-model="choseAll" @change="handleCheckAllChange">全选</el-checkbox>
        </el-form-item>
        <!--<el-form-item label="基础信息">-->
          <!--<el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">-->
            <!--<el-checkbox v-for="item in condition_export_base" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
        <!--</el-form-item>-->

        <el-form-item label="艺人信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_artist" :label="item.type" :key="item.type">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!--<el-form-item label="其他信息">-->
          <!--<el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">-->
            <!--<el-checkbox v-for="item in condition_export_more" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="mini" @click="importOut">确定</el-button>
      </div>
    </el-dialog>

    <!--批量修改-->
    <el-dialog
      width="500px"
      :visible.sync="dialogImportIn"
      @close="ImportInClose"
      :show-close="false"
      v-loading="importOuting">
      <div class="title" slot="title">
        批量修改
        <el-button @click="templateLoad" size="mini">模板下载</el-button>
      </div>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-upload style="width:80px"
                   class="upload-excel"
                   action="/cms/api/artist/importArtistExcel.do"
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

    <!--批量上传-->
    <el-dialog
      width="500px"
      :visible.sync="dialogUpdata"
      @close="UpdataClose"
      :show-close="false"
      v-loading="importOuting">
      <div class="title" slot="title">
        批量上传
        <el-button @click="templateUpdata" size="mini">模板下载</el-button>
      </div>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-upload style="width:80px"
                   class="upload-excel"
                   action="/cms/api/artist/importAddArtistExcel.do"
                   accept="xls"
                   :data="excelUpdata"
                   :show-file-list="false"
                   :on-change="handleDialogUpdata"
                   @click.native="beforeUpdata"
                   :auto-upload="false"
                   :on-success="updataDone"
                   ref="updata">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        {{fileUpdataName}}
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="DownUpdataError" v-show="errorDownUpdata.length > 0">点击下载错误报告</el-button>
        <el-button size="mini" @click="closeUpdata">取消</el-button>
        <el-button type="primary" size="mini" @click="updata">确定</el-button>
      </div>
    </el-dialog>
    <!--艺人删除-->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>该删除操作不可撤销，确认删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dropArt('cancle','')">取 消</el-button>
        <el-button type="primary" @click="dropArt('sure', '')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vSearch from './components/search'

export default {
  name: 'artist-list',
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
  watch : {
    tableData (data) {
      let that = this;
      data.forEach(item => {
        let text = '';
        that.artistArea.forEach(type => {
          if(item.artistArea == type.type){
            item.areaText = type.name;
          }
        });
      });
      data.forEach(item => {
        let text = '';
        that.artistType.forEach(type => {
          if(item.artistType == type.type){
            item.artistText = type.name;
          }
        });
      });
    }
  },
  data () {
    return {
      img_pre: this.$root.staticData.imgApi,
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url: {
        artList : "/cms/api/artist/listArtist.do",
        importOut: '/cms/api/artist/exportArtistExcel.do',
      },
      req: {
        list: {
          pageSize     : 20,
          currPage     : 0,
          artistArea   : '',
          artistCode   : '',
          artistName   : '',
          artistType   : '',
          sectCode     : '',
          chineseOpera : '',
          iStatus      : '',
          beginDate    : '',
          endDate      : '',
        }
      },
      totleCount: '',
      errorDownLoad: '',
      errorDownUpdata: '',
      fileUpdataName: '',
      cpList: [],
      tableData: [],
      pageNum: 1,
      TableHeight: 400,
      hasSelection: true,
      saveTit: '',
      dialogVisible: false,
      tableLoading: true,
      artistType: this.$root.staticData.artType,
      artistArea: this.$root.staticData.artArea,
      dialogImportOut: false,
      isIndeterminate: false,
      choseAll: false,
      select_export: [],
      condition_export_all: [
        'sectCode',
        'artistName',
        'artistCode',
        'artistType',
        'artistArea',
        'lastTime',
        'foreignName',
        'alias',
        'country',
        'nation',
        'starSign',
        'animalSign',
        'birthArea',
        'birthday',
        'occupation',
        'graduateUnvers',
        'ibec',
        'representative',
        'des',
      ],
      condition_export_base: [
        {key: 'videoName', text: '资源名称'},
        {key: 'videoCode', text: '资源编码'},
        {key: 'videoType', text: '曲目类别'},
        {key: 'lastTime', text: '最近更新时间'},
        {key: 'cpId', text: 'cp商'},
        {key: 'fileSize', text: '大小'},
        {key: 'allTime', text: '时长'},
        {key: 'resolution', text: '分辨率'},
      ],
      // condition_export_artist: [
      //   {key: 'artistName', text: '艺人名称'},
      // ],
      condition_export_artist: [
        {type: "sectCode", name: "艺人流派"},
        {type: "artistName", name: "艺人名称"},
        {type: "artistCode", name: "艺人编码"},
        {type: "artistType", name: "艺人类型"},
        {type: "artistArea", name: "所属地区"},
        {type: "lastTime", name: "最近更新时间"},
        {type: "foreignName", name: "外文名"},
        {type: "alias", name: "别名"},
        {type: "country", name: "国籍"},
        {type: "nation", name: "民族"},
        {type: "starSign", name: "星座"},
        {type: "animalSign", name: "生肖"},
        {type: "birthArea", name: "出生地"},
        {type: "birthday", name: "出生日期"},
        {type: "occupation", name: "职业"},
        {type: "graduateUnvers", name: "毕业院校"},
        {type: "ibec", name: "经纪公司"},
        {type: "representative", name: "代表作"},
        {type: "des", name: "描述"}
        ],
      condition_export_more: [
        {key: 'foreignName', text: '别名(外文名)'},
        {key: 'language', text: '语种'},
        {key: 'publishArea', text: '发行地区'},
        {key: 'lyricist', text: '作词'},
        {key: 'composer', text: '作曲'},
        {key: 'arranger', text: '编曲'},
        {key: 'producer', text: '制作人'},
        {key: 'directorMV', text: 'MV导演'},
        {key: 'albumName', text: '专辑'},
        {key: 'publishTime', text: '发行时间'},
        {key: 'redordCompany', text: '唱片公司'},
      ],
      importOuting: false,
      dialogImportIn: false,
      dialogUpdata: false,
      fileName: '',
      excelParam: {
        file: "",
      },
      excelUpdata: {
        file: "",
        // type: 2
      },
      centerDialogVisible: false,
      artStr: '',
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
      updateNum: 0,
    }
  },
  mounted () {
    // this.getList();
  },
  activated () {
    this.setScrollTop();
    this.Resize();
    // if (this.route == 'audio' || this.route == 'vedio') {
    //   this.$store.commit('_routerAudioChange', '');
    // this.onSubmit('clear');
    // }
  },
  computed: {
    route () {
      return this.$store.state.RouteState.routerAudioChange;
    }
  },
  directives: {
    tabelLoadmore: {
      // 指令的定义
      bind(el, binding) {
        let that = this;
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');

        SELECTWRAP_DOM.addEventListener('scroll', function() {
          let sign = 0;
          const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) && this.scrollTop > sign)

          if(CONDITION) {
            binding.value();
          }else {
            return false;
          }
        });
      }
    }
  },
  methods: {
//      用戶权限判断
    judge() {
      if(this.$store.state.RouteState.userInfo === 'all') {
        return true;
      }else {
        return false;
      }
    },
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    setScrollTop () {
      let that = this;
      let st4 = sessionStorage.getItem("st4");
      if (typeof st4 !== 'object' && st4 !== 'null') {
        that.$el.querySelector('.el-table__body-wrapper').scrollTop = st4;
        sessionStorage.setItem("st4", null);
      } else {
        this.onSubmit('clear');
      }
    },
    // 艺人删除
    dropArt (type, id) {
      if(type == 'open') {
        // this.dropIndex = obj.$index;
        this.artStr = id;
        this.centerDialogVisible = true;
      }else if (type == 'sure') {
        //this.videoData.artistList.splice(this.dropIndex, 1);
        this.dropRequest(this.artStr);
        this.centerDialogVisible = false;
      }else {
        this.centerDialogVisible = false;
        // this.dropIndex = -1;
      }
    },
    dropRequest (id) {
      let that = this;
      // let sid = this.videoData.artistList[this.dropIndex].sid;
      let param = {artistCode: id};
      let params = {jsonParam: JSON.stringify(param)};
      this.$store.commit('_routerAudioChange', 'video');
      this.artListLoad = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: '/cms/api/artist/delArtist.do',
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if (res.data.success) {
      //     that.onSubmit('clear');
      //     that.$message({
      //       type: 'success',
      //       message: res.data.msg
      //     });
      //   } else {
      //     that.$message({
      //       type: 'warning',
      //       message: res.data.msg
      //     });
      //   }
      //
      //   // this.videoData.artistList.splice(this.dropIndex, 1);
      //   // that.actDone();
      //   // this.dropIndex = -1;
      //   // this.artListLoad = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: '/cms/api/artist/delArtist.do',
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.onSubmit('clear');
            that.$message({
              type: 'success',
              message: res.data.msg
            });
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            });
          }

          // this.videoData.artistList.splice(this.dropIndex, 1);
          // that.actDone();
          // this.dropIndex = -1;
          // this.artListLoad = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    // 批量修改
    templateLoad () {
      window.open('/cms/api/artist/downloadArtistExcel.do')
    },
    templateUpdata () {
      window.open('/cms/api/artist/downloadAddArtistExcel.do');
    },
    ImportInClose () {
      this.$refs.newupload.clearFiles();
      this.errorDownLoad = '';
      this.fileName = '';
    },
    UpdataClose () {
      this.$refs.updata.clearFiles();
      this.errorDownLoad = '';
      this.fileUpdataName = '';
    },
    DownLoadError () {
      window.open(this.errorDownLoad); //测试url前缀
    },
    DownUpdataError () {
      window.open(this.errorDownUpdata); //测试url前缀
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
    importIn () {
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
    updataDone (response, file, fileList) {
      let that = this;
      // console.log(response)
      // if (response.msg === "SESSION_OUT"){
      //   window.location.href = "http://cms.daoran.tv";
      // }
      console.log(response)
      if (response.success) {
        if (response.data.path.length > 0) {
          that.importOuting = false;
          that.updateNum += 1;
          that.errorDownUpdata = response.data.path;
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
          that.dialogUpdata = false;
          that.onSubmit('clear');
        }
      } else {
        that.importOuting = false;
        that.updateNum += 1;
        that.$message({
          type: 'warning',
          message: response.msg
        });
      }
    },
    closeUpdata () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogUpdata = false;
      this.isempty = false;
    },
    updata (){
      let that = this;
      if (that.updateNum === 0 && that.isempty) {
        this.$refs.updata.submit();
        this.importOuting = true;
      } else {
        that.$message({
          message: '请上传正确格式的文件',
          type: 'warning'
        })
      }
    },
    beforeUpload() {
      this.configNum = 0;
    },
    handleDialogImportIn (file, fileList) {
      this.isempty = true;
      if (fileList.length > 1 ) {
        fileList.splice(0, 1);
      }
      this.fileName = file.name;
      this.excelParam.file = file.name;
    },
    closeImportIn () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportIn = false;
      this.isempty = false;
    },
    sendParams (type, id) {
      this.$store.commit('_routerAudioChange', type);
      if (type === 'audio') {
        this.$router.push({ path: '/audio', query: {artistCode: id} });
      } else if (type === 'video') {
        this.$router.push({ path: '/video', query: {artistCode: id} });
      }
    },
    importOut () {
      let that = this;
      let obj = {};
      for (let i in this.req.list) {
        if (i != 'pageSize' && i != 'currPage') {
          obj[i] = this.req.list[i]
        }
      }
      if (this.select_export.length === 0) {
        this.$message({
          type: 'warning',
          message: '未选择导出条件！'
        })
        return;
      }
      let req = {search: obj, exportField: this.select_export.join(",")};
      let params = {jsonParam: JSON.stringify(req)};
      that.importOuting = true;
      let url = '/cms/api/artist/exportArtistExcel.do?artistArea=' + this.req.list.artistArea + '&artistCode=' + this.req.list.artistCode + '&artistName=' + this.req.list.artistName
        + '&artistType=' + this.req.list.artistType + '&sectCode=' + this.req.list.sectCode + '&chineseOpera=' + this.req.list.chineseOpera + '&iStatus=' + this.req.list.iStatus + '&beginTime=' + this.req.list.beginDate + '&endTime=' + this.req.list.endDate + '&exportField=' + this.select_export.join(",");
      window.open(url);
      that.importOuting = false;

      // that.$ajax({
      //   url: that.url.importOut,
      //   method: "post",
      //   data: this.Qs.stringify(params),
      //   success: function (res) {
      //     if (res.data.success) {
      //       window.open(res.data.data.path);
      //     } else {
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
    handleCheckAllChange (val) {
      this.select_export = val ? this.condition_export_all : [];
    },
    beforeUpdata () {
      this.updateNum = 0;
    },
    handleCheckedCitiesChange (value) {
      let chosed = value.length;
      let all = this.condition_export_all.length;

      if (chosed == all) {
        this.choseAll = true;
      } else {
        this.choseAll = false;
      }
    },
    handleDialogUpdata (file, fileList) {
      this.isempty = true;
      if (fileList.length > 1 ) {
        fileList.splice(0, 1);
      }
      this.fileUpdataName = file.name;
      this.excelUpdata.file = file.name;
      // this. excelParam.nodeCode = this.req.list.nodeCode;
    },
    tableLoadMore () {
      let that = this;
      let parmas = {jsonParam: JSON.stringify(that.req.list)};
      if(that.tableLoading) {
        return;
      }
      that.tableLoading = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.artList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   res.data.data.data.forEach(item => {
      //     that.tableData.push(item);
      //   });
      //   that.req.list.currPage += 1;
      //   that.tableLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.artList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          res.data.data.data.forEach(item => {
            that.tableData.push(item);
          });
          that.req.list.currPage += 1;
          that.tableLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    edit (index, row) {
      let that = this;
      let artistCode = row.artistCode;
      let st4 = that.$el.querySelector('.el-table__body-wrapper').scrollTop;
      sessionStorage.setItem("st4", st4);
      //this.$router.push({ name: 'edit', params: { audioCode: audioCode }});
      this.$router.push({ path: '/artist/edit', query: {artistCode: artistCode} });
    },
    responHeight () {
      let dom = this.$el;
      let contain_height = document.body.offsetHeight;
      let search_height = dom.querySelector('.el-form').offsetHeight;
      let static_height = 148;
      let result_height = parseInt(contain_height - search_height - static_height);
      if(result_height >= 250){
        this.TableHeight = Number(result_height);
      }else {
        this.TableHeight = 400;
      }
    },
    getList () {
      let that = this;
      that.req.list.currPage = 0;
      let parmas = {jsonParam: JSON.stringify(that.req.list)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.artList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   if (!res.data.success) {
      //     that.tableData = [];
      //     return;
      //   }
      //   that.tableData = res.data.data.data;
      //   that.totleCount = res.data.data.total;
      //   that.req.list.currPage += 1;
      //   setTimeout(() => {
      //     that.tableLoading = false;
      //     that.responHeight();
      //   }, 500);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.artList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (!res.data.success) {
            that.tableData = [];
            return;
          }
          that.tableData = res.data.data.data;
          that.totleCount = res.data.data.total;
          that.req.list.currPage += 1;
          setTimeout(() => {
            that.tableLoading = false;
            that.responHeight();
          }, 500);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    onSubmit (state) {
      let that = this;
      let datas = [];
      if (state == 'search') {
        that.req.list.pageSize = 20;
        that.req.list.currPage = 0;
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
        that.totleCount = '';
        that.getList();
      }
    },
    handleSelectionChange () {
      console.log('handleSelectionChange');
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 20px;
  }
  .audio-name,
  .audio-code,
  .audio-time{
    padding: 0;
    margin: 0;
  }
  .audio-name{
    font-size: 16px;
    color: #000;
  }
  .audio-code,
  .audio-time{
    color: #ccc;
  }
  .vedioData {
    position: relative;
    overflow: hidden;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 80px;
  }
  .vedioData-img {
    position: relative;
    min-width: 80px;
    min-height: 80px;
    max-width: 80px;
    max-height: 80px;
    overflow: hidden;
    background: #eee;
  }
  .vedioData-img img {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  .vedioData-text {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 110px;
    height: 70px;
  }
  .vedioData-text p{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fontCount p span{
    color: #409EFF;
    cursor: pointer;
  }
</style>
