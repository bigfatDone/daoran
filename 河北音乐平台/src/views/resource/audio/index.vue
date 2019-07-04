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
      <el-button type="primary" icon="el-icon-download" size="mini" title="批量修改" circle  @click="dialogImportIn = true"></el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" title="批量上传" circle  @click="dialogUpdata = true"></el-button>
    </div>
    <!--</el-button-group>-->
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
          width="250"
          label="音频名称">
          <template slot-scope="scope">
            <div class="audioData-text">
              <p class="audio-name">{{scope.row.audioName}}</p>
              <p class="audio-code">资源编码：{{scope.row.audioCode}}</p>
              <p class="audio-time">音频时长：{{scope.row.allTime}}</p>
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
            {{scope.row.audioType | language}}
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
              <el-button icon="el-icon-edit" circle @click="edit(scope.$index, scope.row)"  title="详情"/>
              <el-button icon="el-icon-service" circle @click="play(scope.$index, scope.row.audioCode)"  title="音频播放"/>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--弹窗-->
    <el-dialog
      title="音频播放"
      :show-close="false"
      @close="closeAudio"
      :visible.sync="aDialog"
      width="60%"
      center>
      <div v-if="playSrc!==''" style="position: relative;">
        <iframe width="100%" :height="ifH" :src="playSrc"></iframe>
        <div style="position: absolute;background: #fff;width: 300px;height: 458px;top: 0; right: 0;text-align: center;overflow: auto">
          <p v-if="playLrc !== ''" style="display: inline-block;width: 250px;" v-html="playLrc"></p>
          <p v-else style="display: inline-block;width: 250px;">暂无歌词</p>
        </div>
      </div>
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
                   action="/cms/api/audio/importAudioExcel.do"
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
                   action="/cms/api/audio/importAudioAddExcel.do"
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

export default {
  name: 'audio-list',
  components: {
    vSearch
  },
  filters: {
    language (type) {
      let result = '';
      switch (type) {
        case '20' :
          result = '汉语';
          break;
        case '21' :
          result = '维语';
          break;
      }

      return result;
    },
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
      numF: 1,
      aDialog: false,
      ifH: 500,
      playSrc: '',
      playLrc: '',
      url: {
        audioList : "/cms/api/audio/listAudio.do",
        getCp     : "/cms/api/cp/getListCp.do",
        importOut: '/cms/api/audio/exportAudioExcel.do',
        getAudioPlayUrl: '/cms/api/audio/getAudioPlayUrl.do',
      },
      req: {
        list: {
          pageSize   : 20,
          currPage   : 0,
          artistArea : '',
          artistCode : '',
          artistName : '',
          audioCode  : '',
          audioName  : '',
          audioType  : '',
          beginDate  : '',
          endDate    : '',
          cpId       : '',
          nodeCode   : '',
          date   : [],
        }
      },
      totleCount: '',
      errorDownLoad: '',
      cpList: [],
      tableData: [],
      pageNum: 1,
      hasSelection: true,
      saveTit: '',
      dialogVisible: false,
      tableLoading: true,
      dialogImportOut: false,
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      listload: true,
      dialogUpdata: false,
      TableHeight: 500,
      condition_export_all: [
        'audioName',
        'audioCode',
        'audioType',
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
      ],
      condition_export_base: [
        {key: 'audioName', text: '资源名称'},
        {key: 'audioCode', text: '资源编码'},
        {key: 'audioType', text: '曲目类别'},
        {key: 'lastTime', text: '最近更新时间'},
        {key: 'cpId', text: 'cp商'},
        {key: 'fileSize', text: '大小'},
        {key: 'allTime', text: '时长'},
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
      dialogImportIn: false,
      fileName: '',
      excelParam: {
        file: "",
        // type: 2
      },
      excelUpdata: {
        file: "",
        // type: 2
      },
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
      brower: '',
      fileUpdataName: '',
      errorDownUpdata: '',
    }
  },
  // mounted () {
  //   console.log(1111111)
  //   this.req.list.forEach( i => i = '');
  //   this.getList();
  // },
  activated () {
    this.numF = 1;
    this.setScrollTop();
    this.Resize();
    //this.onSubmit('clear');
    // this.getList();
  },
  directives: {
    tabelLoadmore: {
      // 指令的定义
      bind(el, binding) {
        console.log(el)
        console.log(binding)
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
    UpdataClose () {
      this.$refs.updata.clearFiles();
      this.errorDownLoad = '';
      this.fileUpdataName = '';
    },
    templateUpdata () {
      window.open('/cms/api/audio/downloadAudioAddExcel.do');
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
    beforeUpdata () {
      this.updateNum = 0;
      this.isempty = true;
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
    closeAudio() {
      this.playSrc = ''
    },
    getBrower () {
      let explorer = window.navigator.userAgent ;
      //判断是否为IE浏览器
      if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
      }
      //判断是否为Firefox浏览器
      else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
      }
      //判断是否为Chrome浏览器
      else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
      }
      //判断是否为Opera浏览器
      else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
      }
      //判断是否为Safari浏览器
      else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
      }
    },
    play (index,code) {
      let that = this;
      this.getPlayUrl(code);
      that.aDialog = true;
    },
    getPlayUrl (code) {
      let parm = {audioCode: code}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      that.$ajax({
        url: that.url.getAudioPlayUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if ( !!res.data.data) {
            that.playSrc = res.data.data.url;
            res.data.data.lrcStr === null ? that.playLrc = '' : that.playLrc = res.data.data.lrcStr;
            let reg = /\[\d{2}:\d{2}.\d{2}\]/g;
            let arr = [];
            let lines = [];

            if (that.getBrower() === 'Chrome') {
              that.ifH = 458;
            }
            that.playLrc = that.playLrc.replace(reg,'<br/>');
          } else {
            that.playLrc = '';
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    parseLyric(text) {
      //将文本分隔成一行一行，存入数组
      var lines = text.split('\n'),
        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        //保存最终结果的数组
        result = [];
      //去掉不含时间的行
      while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
      };
      //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
      lines[lines.length - 1].length === 0 && lines.pop();
      lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
        //提取出时间[xx:xx.xx]
        var time = v.match(pattern),
          //提取歌词
          value = v.replace(pattern, '');
        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(function(v1, i1, a1) {
          //去掉时间里的中括号得到xx:xx.xx
          var t = v1.slice(1, -1).split(':');
          //将结果压入最终数组
          result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
      });
      //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
      result.sort(function(a, b) {
        return a[0] - b[0];
      });
      return result;
    },
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    // 批量修改
    templateLoad () {
      window.open('/cms/api/audio/downloadAudioExcel.do');
      // let parmas = {jsonParam: JSON.stringify({'type': 2})};
      // let parmas = {};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: '/cms/api/audio/downloadAudioExcel.do',
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   window.open(res.data.data.path)
      //   that.scrollTop('#sourceList');
      // }).catch(err=>{
      //   console.log(err);
      // })
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
      // this. excelParam.nodeCode = this.req.list.nodeCode;
    },
    closeImportIn () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportIn = false;
      this.isempty = false;
    },

    setScrollTop () {
      let that = this;
      let st1 = sessionStorage.getItem("st1");
      if (typeof st1 !== 'object' && st1 !== 'null') {
        that.$el.querySelector('.el-table__body-wrapper').scrollTop = st1;
        sessionStorage.setItem("st1", null);
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
      let url = '/cms/api/audio/exportAudioExcel.do?artistArea=' + this.req.list.artistArea + '&artistCode=' + this.req.list.artistCode + '&artistName=' + this.req.list.artistName
        + '&audioCode=' + this.req.list.audioCode + '&audioName=' + this.req.list.audioName + '&audioType=' + this.req.list.audioType + '&cpId=' + this.req.list.cpId + '&nodeCode=' + this.req.list.nodeCode + '&beginTime=' + this.req.list.beginDate + '&endTime=' + this.req.list.endDate + '&exportField=' + this.select_export.join(",");
      window.open(url);
      that.importOuting = false;
      // this.closeDialog();

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
      if(that.tableLoading || !that.listload) {
        return;
      }
      that.tableLoading = true;

      that.$ajax({
        url: that.url.audioList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          res.data.data.data.forEach(item => {
            that.tableData.push(item);
          });
          if (res.data.data.data.length < 20) {
            that.listload = false;
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
      let audioCode = row.audioCode;
      let st1 = that.$el.querySelector('.el-table__body-wrapper').scrollTop;
      sessionStorage.setItem("st1", st1);
      this.$router.push({ path: '/audio/edit', query: { audioCode: audioCode }});
    },
    getList () {
      let that = this;
      that.req.list.currPage = 0;
      let code = location.hash.split("=")[1];
      if ( code && that.numF === 1) {
        that.numF += 1;
        that.req.list.artistCode = code;
      }
      // else {
      //   that.req.list.artistCode = '';
      // }
      that.req.list.currPage = 0;
      let parmas = {jsonParam: JSON.stringify(that.req.list)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.audioList,
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
        url: that.url.audioList,
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
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.req.list.pageSize = 20;
        that.req.list.currPage = 0;
        that.getList();
      }else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i == 'pageSize') {
            that.req.list[i] = 20;
          } else if (i == 'currPage') {
            that.req.list[i] = 0;
          } else if (i == 'date') {
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
.audioData-text p{
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
