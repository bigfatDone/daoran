<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="right" label-width="110px"  class="demo-ruleForm">
      <el-form-item label="章节标题:" prop="chapterTitle">
        <div class="w400">
          <el-input  v-model="ruleForm.chapterTitle" placeholder="请输入章节标题" :disabled="hideCode"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="播放时长:" prop="playTime">
        <div class="w400">
          <el-input  v-model="ruleForm.playTime" placeholder="请输入播放时长"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="播放地址:" prop="playUrlJson">
        <div class="w400">
          <el-input  v-model="ruleForm.playUrlJson" placeholder="请输入播放地址"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="课程类型:" prop="mediaType" style="height: 30px;">
        <el-radio v-model="ruleForm.mediaType" label="audio">音频</el-radio>
        <el-radio v-model="ruleForm.mediaType" label="video">视频</el-radio>
      </el-form-item>
      <el-form-item label="cp商:" prop="cpid" style="height: 30px;">
        <el-select size="mini" v-model="ruleForm.cpid" placeholder="请选择" @change="selectchange">
          <el-option v-for="item in cpList" :key="item.cpId" :label="item.fullName" :value="item.cpId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="章节简述:">
        <div class="w400 showImg">
          <el-input type="textarea" placeholder="课程描述" v-model="ruleForm.describe"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="文稿:">
        <div class="w400 showImg">
          <el-input type="textarea" placeholder="请编写文稿" v-model="ruleForm.details"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="图片:">
        <div class="w400 showImg">
          <div class="img">
            <img class="imgSD" :src="imgSrcA ? imgSrcA :'static/imggq.jpg'" onerror="this.src='static/imggq.jpg'" />
            <input type="file" name="files" @change="upload($event)" />
          </div>
        </div>
      </el-form-item>
      <el-form-item align="center" style="margin-left: -110px">
        <el-button-group>
          <el-button size="mini" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'chapteraddEdit',
  props:['addEditType','addEditData'],
  components: {},
  data() {
    return {
      imgSrcA:'',
      ruleForm: {
        chapterTitle:'',
        courseName:'',
        mediaType:'audio',
        describe:'',
        cpid:'',
        playTime:'',
        playUrlJson:'',
        details:''
      },
      rules: {
        chapterTitle: [
          {required: true, message: '请输入章节标题', trigger: 'change'},
        ],
        mediaType: [
          {required: true, message: '请选择', trigger: 'blur'},
        ],
        cpid: [
          {required: true, message: '请选择', trigger: 'blur'},
        ],
        playTime: [
          {required: true, message: '请输入播放时长', trigger: 'blur'},
        ],
        playUrlJson: [
          {required: true, message: '请输入播放地址', trigger: 'blur'},
        ],
      },
      newFile: {},
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url:{
          addEdit:'/cms/api/chapter/editChapter.do'
      },
      imgApi : this.$root.staticData.imgApi,
      hideCode : false,
      cpList:[],
      isCpIdChange:true
    }
  },
  mounted () {
     if(this.addEditType === 'edit'){
       this.hideCode = true;
       const that = this;
       this.imgSrcA= this.imgApi + this.addEditData.image;
       this.ruleForm = {
         chapterTitle: that.addEditData.chapterTitle,
         describe: that.addEditData.describe,
         mediaType: that.addEditData.mediaType,
         cpid: that.addEditData.cpName,
         playTime: that.addEditData.playTime,
         playUrlJson: that.addEditData.playUrlJson,
         details: that.addEditData.details,
       };
     }
    this.newFile = new FormData();
    this.getCP();
  },
  methods: {
    upload(ev) {
      const evAnd = ev.target ? ev.target : ev.srcElement;
      const file = evAnd.files[0];
      this.newFile.set("fileA", file);
      const that = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        that.imgSrcA = this.result;
      };
    },
    submitForm(formName) {
      const that = this;
      if (!/^[1-9]\d*$/.test(this.ruleForm.playTime)) {
        that.$message({
          type: 'warning',
          message: '请输入有效播放时长，必须为正整数'
        });
      }
      this.newFile.set('chapterTitle', this.ruleForm.chapterTitle);
      this.newFile.set('describe', this.ruleForm.describe);
      this.newFile.set('mediaType', this.ruleForm.mediaType);
      this.newFile.set('playTime', this.ruleForm.playTime);
      this.newFile.set('playUrlJson', this.ruleForm.playUrlJson);
      this.newFile.set('cpid', this.ruleForm.cpid);
      this.newFile.set('details', this.ruleForm.details); // 富文本
      if(this.isCpIdChange){
        this.newFile.set('cpid', this.addEditData.cpid);
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
           if(that.addEditType === 'add'){
             that.newFile.set('chapterCode', '');
             that.newFile.set('image', '');
           } else {
             that.newFile.set('chapterCode', this.addEditData.chapterCode);
             that.newFile.set('image', this.addEditData.image);
           }
          that.axios({
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            url: that.url.addEdit,
            method:'post',
            data: that.newFile,
          }).then( res => {
              if (res.data.success) {
                that.$message({
                  type: 'success',
                  message: res.data.msg
                });
                that.$emit('closeAddEdit');
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
              }
          }).catch( err => {
            console.log(err);
          })
        } else {
          that.$message({
            type: 'warning',
            message: '请按正确格式填写完整'
          });
          return false;
        }
      })
    },
    getCP(){
      const that = this;
      that.$ajax({
        url: '/cms/api/cp/getListCp.do',
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.cpId = Number(item.cpId);
          });
          that.cpList = res.data.data;
          that.cpList.unshift({
            cpId: '',
            fullName: '请选择'
          })
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    selectchange(){
      this.isCpIdChange = false
    }
  }
}
</script>

<style scoped>
  .w400 {  display: inline-block;  width: 500px;}
  .showImg{  margin-top: 10px;  }
  .img{  float: left;  position: relative;  margin-right: 15px;  padding: 8px;  padding-bottom: inherit;  border: 1px dashed #cecece;  }
  .img img{  width: 160px;  height: 100px;  padding: 0;  cursor: pointer;  }
  .img input{  position: absolute;  left: 0;  bottom: 0;  z-index: 99;  width: 176px;  height: 120px;  padding: 0;  border: 0;  cursor: pointer;  -webkit-opacity: 0;  -moz-opacity: 0;  -khtml-opacity: 0;  opacity: 0;  filter:alpha(opacity=0);  -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=10)";  filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);  }
</style>
