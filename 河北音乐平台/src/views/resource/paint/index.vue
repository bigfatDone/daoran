<template>
  <div class="paint-list" style="position: relative;">
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
    </div>
    <div style="position: absolute;right: 26px;top: 160px;">总数：
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
          label="视频名称"
          width="300">
          <template slot-scope="scope">
            <div class="paintData">
              <div class="paintData-img">
                <img :src="img_pre + scope.row.paintImage">
              </div>
              <div class="paintData-text">
                <p class="paint-name">{{scope.row.paintName}}</p>
                <p class="paint-code">资源编码：{{scope.row.paintCode}}</p>
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
            <!-- {{scope.row.paintType}} -->
            {{scope.row.paintText}}
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
            <el-button icon="el-icon-edit" circle @click="edit(scope.$index, scope.row)" title="管理" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--弹窗-->
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
                   action="/cms/api/paint/importPaintExcel.do"
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
  </div>
</template>

<script>
import vSearch from './components/search'

export default {
  name: 'paint-list',
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
        that.paintSongType.forEach(type => {
          if(item.type == type.type){
            item.paintText = type.name;
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
        paintList : "/cms/api/paint/getListPaint.do",
        getCp     : "/cms/api/cp/getListCp.do",
        importOut: '/cms/api/paint/exportPaintExcel.do',
      },
      req: {
        list: {
          pageSize   : 20,
          currPage   : 0,
          artistArea : '',
          artistCode : '',
          artistName : '',
          paintCode  : '',
          paintName  : '',
          type       : '',
          beginDate  : '',
          endDate    : '',
          cpId       : '',
          date       : [],
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
      paintSongType: this.$root.staticData.paintSongType,
      importOuting: false,
      dialogImportOut: false,
      isIndeterminate: false,
      choseAll: false,
      select_export: [],
      listLoad: true,
      TableHeight: 500,
      condition_export_all: [
        'paintName',
        'paintCode',
        'paintType',
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
        {key: 'paintName', text: '资源名称'},
        {key: 'paintCode', text: '资源编码'},
        {key: 'paintType', text: '曲目类别'},
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
      dialogImportIn: false,
      fileName: '',
      excelParam: {
        file: "",
        // type: 2
      },
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
    }
  },
  // activated () {
  //   this.onSubmit('clear');
  // },
  computed: {
    route () {
      return this.$store.state.RouteState.routerAudioChange;
    }
  },
  activated () {
    this.setScrollTop();
    this.Resize();
    // if (this.route == 'paint') {
    //   this.$store.commit('_routerAudioChange', '');
    // this.onSubmit('clear');
    // }
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
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    setScrollTop () {
      let that = this;
      let st2 = sessionStorage.getItem("st2");
      if (typeof st2 !== 'object' && st2 !== 'null') {
        that.$el.querySelector('.el-table__body-wrapper').scrollTop = st2;
        sessionStorage.setItem("st2", null);
      } else {
        this.onSubmit('clear');
      }
    },
    // 批量修改
    templateLoad () {
      window.open('/cms/api/paint/downloadPaintExcel.do');
      // let parmas = {jsonParam: JSON.stringify({'type': 2})};
      // let parmas = {};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: '/cms/api/paint/downloadPaintExcel.do',
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
          that.configNum += 1;
          that.errorDownLoad = response.data.path;
          that.importOuting = false;
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
        that.dialogImportIn = false;
        that.configNum += 1;
        that.$message({
          type: 'warning',
          message: response.msg
        });
      }
    },
    beforeUpload() {
      this.configNum = 0;
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
      let url = '/cms/api/paint/exportPaintExcel.do?artistArea=' + this.req.list.artistArea + '&artistCode=' + this.req.list.artistCode + '&paintName=' + this.req.list.paintName
        + '&paintCode=' + this.req.list.paintCode + '&type=' + this.req.list.type + '&cpId=' + this.req.list.cpId + '&nodeCode=' + this.req.list.nodeCode + '&beginTime=' + this.req.list.beginDate + '&endTime=' + this.req.list.endDate + '&exportField=' + this.select_export.join(",");
      window.open(url);
      that.importOuting = false;

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
      //   url: that.url.paintList,
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
        url: that.url.paintList,
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
      let paintCode = row.paintCode;
      let st2 = that.$el.querySelector('.el-table__body-wrapper').scrollTop;
      sessionStorage.setItem("st2", st2);
      //this.$router.push({ name: 'edit', params: { paintCode: paintCode }});
      this.$router.push({ path: '/paint/edit', query: {paintCode: paintCode} });
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
      //   url: that.url.paintList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then( res => {
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
        url: that.url.paintList,
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
          }else if (i == 'currPage') {
            that.req.list[i] = 0;
          }else if (i == 'date') {
            that.req.list[i] = [];
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
.paint-name,
.paint-code,
.paint-time{
  padding: 0;
  margin: 0;
}
.paint-name{
  margin-top: 12px;
  font-size: 16px;
  color: #000;
}
.paint-code,
.paint-time{
  color: #ccc;
}
.paintData {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 70px;
}
.paintData-img {
  position: relative;
  min-width: 99px;
  min-height: 66px;
  max-width: 99px;
  max-height: 66px;
  overflow: hidden;
  background: #eee;
}
.paintData-img img {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.paintData-text {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 110px;
  height: 70px;
}
.paintData-text p{
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
