<template>
  <div style="margin-bottom: 50px;position: relative;">
    <div class="title" slot="title" style="position:absolute;top: -66px;left: 88px;">
      <el-button @click="templateLoad" size="mini">模板下载</el-button>
    </div>
    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
      <el-upload style="width:80px"
                 class="upload-excel"
                 action="/cms/busi/album/importAlbumEditExcel.do"
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
  </div>
</template>

<script>
export default {
  name: 'importIn',
  props: {
    modalData: String,
    reqList: Object,
  },
  mounted() {
    // if (this.modalData !== '') {
    //   this.getDetial();
    //   this.reqList.albumCode = this.modalData;
    //   this.disable = true;
    // } else {
    //   this.reqList.albumCategory = '0',
    //   this.reqList.resType = 1,
    //   this.reqList.freeFlag = 0
    // };
    // this.getSectList();
    // this.newFile = new FormData();
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url: {
        importOut: '/busi/album/importAlbumEditExcel.do',
        importEdit: '/cms/api/video/downloadVideoExcel.do',
      },
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
      updateNum: 0,
      excelParam: {
        file: "",
        // type: 2
      },
      fileName: '',
      errorDownLoad: '',
    }
  },
  methods: {
    templateLoad () {
      window.open('/cms/busi/album/downloadAlbumEditExcel.do');
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
    beforeUpload () {
      this.configNum = 0;
    },
    uploadDone (response, file, fileList) {
      let that = this;
      if (response.success) {
        that.$message({
          type: 'success',
          message: response.msg
        });
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
          that.closeImportIn();
          // that.onSubmit('clear');
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
    DownLoadError () {
      window.open(this.errorDownLoad); //测试url前缀
    },
    closeImportIn () {
      this.select_export = [];
      this.choseAll = false;
      // this.dialogImportIn = false;
      this.isempty = false;
      this.$emit('closeImportIn','')
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
  }
}
</script>

<style scoped>
  .dialog-footer {
    position: absolute;
    right: 20px;
    top: 38px;
  }
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
    width: 484px !important;
  }
  .showImg{
    margin-top: 10px;
  }
  .img{
    float: left;
    position: relative;
    margin-right: 15px;
    margin-bottom: 28px;
    padding: 8px;
    padding-bottom: inherit;
    border: 1px dashed #cecece;
  }
  .img img{
    width: 160px;
    height: 100px;
    padding: 0;
  //cursor: pointer;
  }
  .img input{
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
    width: 176px;
    height: 65px;
    padding: 0;
    border: 0;
    cursor: pointer;
    -webkit-opacity: 0;
    -moz-opacity: 0;
    -khtml-opacity: 0;
    opacity: 0;
    filter:alpha(opacity=0);
    -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=10)";
    filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
  }
</style>
