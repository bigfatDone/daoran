<template>
  <div class="audio-list" style="position: relative;">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      :cpListurl="url.getCp"
      @vSearch="onSubmit($event)"></v-search>
    <!--<el-button-group>-->
      <!--<el-button type="primary" icon="el-icon-upload" title="导出" size="mini" @click="dialogImportOut = true">导出数据</el-button>-->
    <!--</el-button-group>-->
    <div class="btnGroup">
      <!--<el-button type="primary" icon="el-icon-upload" title="导出" size="mini" @click="dialogImportOut = true">导出数据</el-button>-->
      <el-button type="primary" icon="el-icon-upload2" size="mini" title="导出表格" circle @click="dialogImportOut = true"></el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" title="批量修改" circle  @click="dialogImportIn = true"></el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" title="批量上传" circle  @click="dialogUpdata = true"></el-button>
    </div>
    <div style="position: absolute;right: 26px;top: 160px;">总数：
      <!--<i style="color: #409EFF;">{{totleCount}}</i>-->
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
          width="300px"
          label="视频名称">
          <template slot-scope="scope">
            <div class="videoData">
              <div class="videoData-img">
                <img :src="img_pre + scope.row.image">
              </div>
              <div class="videoData-text">
                <p class="audio-name">{{scope.row.videoName}}</p>
                <p class="audio-code">资源编码：{{scope.row.videoCode}}</p>
                <p class="audio-time">音频时长：{{scope.row.allTime}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="艺人">
          <template slot-scope="scope">
            <p class="td" :title="scope.row.artistName">{{scope.row.artistName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="CP商">
          <template slot-scope="scope">
            <p class="td" :title="scope.row.cpId">{{scope.row.cpId}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="曲目类别">
          <template slot-scope="scope">
            <!-- {{scope.row.videoType}} -->
            {{scope.row.videoText}}
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
            <el-button icon="el-icon-edit" circle @click="edit(scope.$index, scope.row)" title="详情" />
            <el-button icon="el-icon-view" circle @click="play(scope.$index, scope.row.videoCode)" title="视频播放" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--弹窗-->
    <!--<el-dialog-->
      <!--title="视频播放"-->
      <!--:show-close="false"-->
      <!--:visible.sync="vDialog"-->
      <!--width="30%">-->
      <!--<v-play-->
        <!--v-if="vDialog"-->
        <!--:pcode="playCode">-->
      <!--</v-play>-->
      <!--&lt;!&ndash;<span slot="footer" class="dialog-footer">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button @click="vDialog = false">取 消</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button type="primary" @click="vDialog = false">确 定</el-button>&ndash;&gt;-->
      <!--&lt;!&ndash;</span>&ndash;&gt;-->
    <!--</el-dialog>-->
    <el-dialog
      title="视频播放"
      :show-close="false"
      :visible.sync="vDialog"
      @close="playSrc= ''"
      width="60%"
      center>
      <iframe v-if="playSrc !== ''" width="100%" height="500px" :src="playSrc"></iframe>
      <div v-else style="text-align: center"><span>暂无播放资源</span></div>
      <!--<video autoplay controls name="media">-->
        <!--<source :src="playSrc" type="video/mp4">-->
      <!--</video>-->
    </el-dialog>
    <!--导出-->
    <el-dialog title="导出设置" :visible.sync="dialogImportOut" :show-close="false" v-loading="importOuting">
      <el-form ref="form" label-width="80px">
        <el-form-item label="">
          <el-checkbox :indeterminate="isIndeterminate" v-model="choseAll" @change="handleCheckAllChange">全选</el-checkbox>
        </el-form-item>
        <el-form-item label="基础信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_base" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="艺人信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_artist" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="其他信息">
          <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in condition_export_more" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
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
                   action="/cms/api/video/importVideoExcel.do"
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
                   action="/cms/api/video/importResAddExcel.do"
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
  </div>
</template>

<script>
import vSearch from './components/search'
import vPlay from './components/play'

export default {
  name: 'audio-list',
  components: {
    vSearch,
    vPlay
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
        that.videoType.forEach(type => {
          if(item.videoType == type.type){
            item.videoText = type.name;
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
      vDialog: false,
      date: [],
      playCode: '',
      playSrc: '',
      numF: 1, // 点击重置时,清除通过艺人管理路由跳转传来的艺人编码
      url: {
        videoList : "/cms/api/video/ListVideo.do",
        getCp     : "/cms/api/cp/getListCp.do",
        importOut: '/cms/api/video/exportVideoExcel.do',
        importEdit: '/cms/api/video/downloadVideoExcel.do',
        getVideoPlayUrl:'/cms/api/video/getVideoPlayUrl.do',
      },
      req: {
        list: {
          pageSize   : 20,
          currPage   : 0,
          artistArea : '',
          artistCode : '',
          artistName : '',
          videoCode  : '',
          videoName  : '',
          videoType  : '',
          beginDate  : '',
          endDate    : '',
          cpId       : '',
          nodeCode       : '',
          date       : [],
        }
      },
      totleCount: '',
      errorDownLoad: '',
      errorDownUpdata: '',
      dialogImportIn: false,
      dialogUpdata: false,
      fileName: '',
      fileUpdataName: '',
      excelParam: {
        file: "",
        // type: 2
      },
      excelUpdata: {
        file: "",
        // type: 2
      },
      cpList: [],
      tableData: [],
      listLoad: true,
      pageNum: 1,
      hasSelection: true,
      saveTit: '',
      dialogVisible: false,
      tableLoading: true,
      videoType: this.$root.staticData.videoSongType,
      dialogImportOut: false,
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      TableHeight: 500,
      condition_export_all: [
        'videoName',
        'videoCode',
        'videoType',
        'lastTime',
        'cpId',
        'fileSize',
        'allTime',
        'artistName',
        'artistCode',
        'foreignName',
        'language',
        'publishArea',
        'lyricist',
        'composer',
        'arranger',
        'producer',
        'directorMV',
        'albumName',
        'publishTime',
        'redordCompany',
        // 'resolution',
      ],
      condition_export_base: [
        {key: 'videoName', text: '资源名称'},
        {key: 'videoCode', text: '资源编码'},
        {key: 'videoType', text: '曲目类别'},
        {key: 'lastTime', text: '最近更新时间'},
        {key: 'cpId', text: 'cp商'},
        {key: 'fileSize', text: '大小'},
        {key: 'allTime', text: '时长'},
        // {key: 'resolution', text: '分辨率'},
      ],
      condition_export_artist: [
        {key: 'artistName', text: '艺人名称'},
        {key: 'artistCode', text: '艺人编码'},
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
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
      updateNum: 0,
    }
  },
  mounted () {
    //this.getList();
  },
  activated () {
    this.numF = 1;
    this.setScrollTop();
    this.Resize();
    // this.onSubmit('clear');
  },
  directives: {
    tabelLoadmore: {
      // 指令的定义
      bind(el, binding) {
        let that = this;
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          let sign = 0;
          const CONDITION = ((this.scrollHeight - this.scrollTop - 10 <= this.clientHeight) && this.scrollTop > sign)

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
    DownUpdataError () {
      window.open(this.errorDownUpdata); //测试url前缀
    },
    play (index,code) {
      let that = this;
      this.playCode = code;
      this.getPlayUrl(code);
      that.vDialog = true;
    },
    getPlayUrl (code) {
      let parm = {videoCode: code}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      that.$ajax({
        url: that.url.getVideoPlayUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.playSrc = res.data.data.url;
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
    setScrollTop () {
      let that = this;
      let st3 = sessionStorage.getItem("st3");
      if (typeof st3 !== 'object' && st3 !== 'null') {
        that.$el.querySelector('.el-table__body-wrapper').scrollTop = st3;
        sessionStorage.setItem("st3", null);
      } else {
        this.onSubmit('clear');
      }
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
      let url = '/cms/api/video/exportVideoExcel.do?artistArea=' + this.req.list.artistArea + '&artistCode=' + this.req.list.artistCode + '&artistName=' + this.req.list.artistName
        + '&videoCode=' + this.req.list.videoCode + '&videoName=' + this.req.list.videoName + '&videoType=' + this.req.list.videoType + '&cpId=' + this.req.list.cpId + '&nodeCode=' + this.req.list.nodeCode + '&beginTime=' + this.req.list.beginDate + '&endTime=' + this.req.list.endDate + '&exportField=' + this.select_export.join(",");
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
    templateLoad () {
      window.open('/cms/api/video/downloadVideoExcel.do');
    },
    templateUpdata () {
      window.open('/cms/api/video/downloadAddVideoExcel.do');
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
    updataDone (response, file, fileList) {
      let that = this;
      // console.log(response)
      // if (response.msg === "SESSION_OUT"){
      //   window.location.href = "http://cms.daoran.tv";
      // }
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
    beforeUpload () {
      this.configNum = 0;
    },
    beforeUpdata () {
      this.updateNum = 0;
      this.isempty = true;
    },
    handleDialogImportIn (file, fileList) {
      this.isempty = true;
      if (fileList.length > 1 ) {
        fileList.splice(0, 1);
      }
      this.fileName = file.name;
      this.excelParam.file = file.name;
      // this. excelParam.nodeCode = this.req.list.nodeCode;
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
    closeImportIn () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportIn = false;
      this.isempty = false;
    },
    closeUpdata () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogUpdata = false;
      this.isempty = false;
    },
    closeDialog () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportOut = false;
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
    tableLoadMore () {
      let that = this;
      let parmas = {jsonParam: JSON.stringify(that.req.list)};
      if(that.tableLoading || !that.listLoad) {
        return;
      }
      that.tableLoading = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.videoList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   res.data.data.data.forEach(item => {
      //     that.tableData.push(item);
      //   });
      //   if (res.data.data.data.length < 20) {
      //     that.listLoad = false;
      //   }
      //   that.req.list.currPage += 1;
      //   that.tableLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })
      that.$ajax({
        url: that.url.videoList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          res.data.data.data.forEach(item => {
            that.tableData.push(item);
          });
          if (res.data.data.data.length < 20) {
            that.listLoad = false;
          }
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
      let videoCode = row.videoCode;
      let st3 = that.$el.querySelector('.el-table__body-wrapper').scrollTop;
      sessionStorage.setItem("st3", st3);
      //this.$router.push({ name: 'edit', params: { audioCode: audioCode }});
      this.$router.push({ path: '/video/edit', query: {videoCode: videoCode} });
    },
    getList () {
      let that = this;
      let code = location.hash.split("=")[1];
      if (code && that.numF === 1) {
        that.numF += 1;
        that.req.list.artistCode = code;
      }
      // else {
      //   that.req.list.artistCode = that.req.list.artistCode;
      // }
      that.req.list.currPage = 0;
      let parmas = {jsonParam: JSON.stringify(that.req.list)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.videoList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
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
        url: that.url.videoList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
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
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.req.list.pageSize = 20;
        that.req.list.currPage = 0;
        that.getList();
      } else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i == 'pageSize') {
            that.req.list[i] = 20;
          } else if (i == 'currPage') {
            that.req.list[i] = 0;
          }else if (i == 'date') {
            that.req.list[i] = [];
          } else {
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
.videoData {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 70px;
}
.videoData-img {
  position: relative;
  min-width: 99px;
  min-height: 66px;
  max-width: 99px;
  max-height: 66px;
  overflow: hidden;
  background: #eee;
}
.videoData-img img {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.videoData-text {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 110px;
  height: 70px;
}
.videoData-text p{
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
</style>
