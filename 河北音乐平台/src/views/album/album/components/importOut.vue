<template>
  <div style="margin-bottom: 50px">
    <el-form ref="form" label-width="80px">
      <el-form-item label="">
        <el-checkbox :indeterminate="isIndeterminate" v-model="choseAll" @change="handleCheckAllChange">全选</el-checkbox>
      </el-form-item>
      <el-form-item label="基础信息">
        <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in condition_export_base" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="其他信息">
        <el-checkbox-group v-model="select_export" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in condition_export_more" :label="item.key" :key="item.key">{{item.text}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="float: right;margin-bottom: 20px">
      <el-button size="mini" @click="closeDialog">取消</el-button>
      <el-button type="primary" size="mini" @click="importOut">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'importOut',
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
        importOut: '/cms/busi/album/exportAlbumExcel.do',
        importEdit: '/cms/api/video/downloadVideoExcel.do',
      },
      isIndeterminate: false,
      // importOuting: false,
      choseAll: false,
      condition_export_base: [
        {key: 'albumName', text: '专辑名称'},
        {key: 'sectName', text: '流派'},
        {key: 'upperCase', text: '专辑名拼音首字母'},
        {key: 'albumCategory', text: '专辑类型'},
        {key: 'resType', text: '资源类型'},
        {key: 'freeFlag', text: '收费标识'},
        // {key: 'beginTime', text: '开始时间'},
        // {key: 'endTime', text: '结束时间'},
        // {key: 'resolution', text: '分辨率'},
      ],
      condition_export_more: [
        {key: 'image', text: '专辑图片'},
        {key: 'publishTime', text: '发行时间'},
        {key: 'albumDesc', text: '专辑简介'},
        {key: 'resCodes', text: '资源录入'},
      ],
      select_export: [],
      condition_export_all: [
        // 'albumCode',
        'albumName',
        'sectName',
        // 'tagName',
        // 'artistName',
        'upperCase',
        'freeFlag',
        'albumCategory',
        'albumDesc',
        // 'lastTime',
        'resType',
        'image',
        'publishTime',
        'resCodes',
        'beginTime',
        'endTime',
      ],
    }
  },
  methods: {
    handleCheckAllChange (val) {
      console.log(val)
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
    closeDialog () {
      this.select_export = [];
      this.choseAll = false;
      this.$emit('closeOut','')
      // this.dialogImportOut = false;
    },
    importOut () {
      let that = this;
      let obj = {};
      for (let i in this.reqList) {
        if (i != 'pageSize' && i != 'currPage') {
          obj[i] = this.reqList[i]
        }
      }
      // if (this.reqList.albumCategory === '' && this.reqList.albumName === '' && this.reqList.tagTypeId === '' && this.reqList.beginTime === '' && this.reqList.endTime === '') {
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
      let url = '/cms/busi/album/exportAlbumExcel.do?albumCategory=' + this.reqList.albumCategory + '&albumName=' + this.reqList.albumName + '&tagTypeId=' + this.reqList.tagTypeId + '&beginTime=' + this.reqList.beginTime + '&endTime=' + this.reqList.endTime + '&exportField=' + this.select_export.join(",");
      window.open(url)
      that.importOuting = false;
      this.closeDialog();

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
  }
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
