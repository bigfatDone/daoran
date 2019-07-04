<template>
  <div style="margin-bottom: 50px;position: relative;">
    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
      <el-upload
        :multiple="multiple"
        action="/cms/busi/album/uploadAlbumImg.do"
        list-type="picture"
        :auto-upload="false"
        :on-change="fileChange"
        :http-request="uploadFile"
        ref="upload"
      >
        <el-button size="mini" type="primary"><i class="el-icon-plus"></i>图片上传</el-button>
      </el-upload>
      <!--<el-button type="primary" size="mini"  @click="subPicForm">提交上传</el-button>-->
    </el-col>
    <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
      <!--{{fileName}}-->
    <!--</el-col>-->
    <div id="imgRender"></div>
    <div slot="footer" class="dialog-footer" style="position: absolute;top: -66px;">
      <!--<el-button size="mini" @click="DownLoadError" v-show="errorDownLoad.length > 0">点击下载错误报告</el-button>-->
      <!--<el-button size="mini" @click="closeImportImg">取消</el-button>-->
      <el-button type="primary" size="mini" @click="subPicForm">确定保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'importImg',
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
      formDate: "",
      multiple: true,
      imgNames: [],
    }
  },
  methods: {
    fileChange(file, fileList) {
      // let nodes = this.$el.querySelector('.el-upload-list--picture').childNodes;
      let nodes = this.$el.querySelector('.el-upload-list--picture').children;
      this.$el.querySelector('.el-upload-list--picture').style.float = "left";
      this.$el.querySelector('.el-upload-list--picture').style.width = "500px";
      // this.$el.querySelector('.el-upload-list--picture').style.float = "left";
      // console.log(file)
      // console.log(fileList)
    },
    uploadFile(file){
      this.imgNames.push(file.file.name);
      // console.log(file.file.name)
      this.formDate.append('file', file.file);
    },
    rightN() {
      let that = this;
      this.alInfoSearch.listCode = this.listCode;
      this.alInfoSearch.resType = this.resType;
      let parmas = {jsonParam: JSON.stringify(this.alInfoSearch)};
      that.$ajax({
        url: that.url.listresByWhereSide,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.obj.data.length > 0) {
            that.selectData = Array.from(res.obj.data);
          } else {
            that.selectData = [];
          }
          that.defaultData = Array.from(res.obj.data);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    subPicForm(){
      let that = this;
      this.formDate = new FormData()
      this.$refs.upload.submit();
      // this.formDate.append('WS_CODE', "12133");
      // let parmas = {jsonParam: JSON.stringify({imgName: this.imgNames.toString()})};
      if (this.imgNames.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择图片'
        });
        return;
      }
      let parmas = {imgName: this.imgNames.toString()};
      that.$ajax({
        url: '/cms/busi/album/checkAlbumImage.do',
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.imgNames = [];
          if (res.data.success) {
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            that.axios.post("/cms/busi/album/uploadAlbumImg.do", that.formDate,config).then( res => {
              if (res.data.success) {
                that.$message({
                  type: 'success',
                  message: res.data.msg
                })
                that.closeImg();
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
              }
            }).catch( res => {
              console.log(res)
            })
          } else {
            that.$confirm(res.data.msg + ',是否继续?', '提示', {
            // that.$confirm(res.data.msg + ',是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
              that.axios.post("/cms/busi/album/uploadAlbumImg.do", that.formDate,config).then( res => {
                if (res.data.success) {
                  that.$message({
                    type: 'success',
                    message: res.data.msg
                  })
                  that.closeImg();
                } else {
                  that.$message({
                    type: 'warning',
                    message: res.data.msg
                  })
                }
              }).catch( res => {
                console.log(res)
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    closeImg() {
      this.$emit('closeImg', '');
    }
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
