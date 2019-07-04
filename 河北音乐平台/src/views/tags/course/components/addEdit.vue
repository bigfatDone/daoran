<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="right" label-width="110px"  class="demo-ruleForm">
      <el-form-item label="课程编码:" prop="courseCode">
        <div class="w400">
          <el-input  v-model="ruleForm.courseCode" placeholder="请输入课程编码" :disabled="hideCode"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="课程名称:" prop="courseName">
        <div class="w400">
          <el-input v-model="ruleForm.courseName" placeholder="请输入课程名称"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="课程类型:" prop="mediaType" style="height: 30px;">
        <el-radio v-model="ruleForm.mediaType" label="audio">音频</el-radio>
        <el-radio v-model="ruleForm.mediaType" label="video">视频</el-radio>
      </el-form-item>
      <el-form-item label="VIP是否免费:" prop="vipFree" style="height: 30px;">
        <el-radio v-model="ruleForm.vipFree" label="1">是</el-radio>
        <el-radio v-model="ruleForm.vipFree" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="免费课程:" prop="free" style="height: 30px;">
        <el-radio v-model="ruleForm.free" label="1">是</el-radio>
        <el-radio v-model="ruleForm.free" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="价格:" prop="price" style="height: 40px;">
        <div class="w400" style="width: 120px;">
          <el-input v-model="ruleForm.price" placeholder="请输入价格"></el-input><span style="position: relative;top: -40px;left: 130px;">元</span>
        </div>
      </el-form-item>
      <el-form-item label="课程描述:" prop="describe">
        <div class="w400 showImg">
          <el-input type="textarea" placeholder="课程描述" v-model="ruleForm.describe"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="图片:">
        <div class="w400 showImg">
          <div class="img">
            <img class="imgSD" :src="imgSrcA ? imgSrcA :'static/imggq.jpg'" onerror="this.src='static/imggq.jpg'" />
            <input type="file" name="files" @change="upload($event, 'A')" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="详情:">
        <div class="img">
          <img class="imgSD" :src="imgSrcB ? imgSrcB :'static/imggq.jpg'" onerror="this.src='static/imggq.jpg'" />
          <input type="file" name="files" @change="upload($event, 'B')" />
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
  import Ueditor from '../../../../components/ueditor/ueditor.vue'
export default {
  name: 'addEdit',
  props:['addEditType','addEditData'],
  components: {Ueditor},
  data() {
    return {
      imgSrcA:'',
      imgSrcB:'',
      ruleForm: {
        courseCode:'',
        courseName:'',
        mediaType:'audio',
        vipFree:'1',
        price:'',
        details:'',
        describe:'',
        free:'1'
      },
      rules: {
        courseCode: [
          {required: true, message: '请输入课程编码', trigger: 'change'},
        ],
        courseName: [
          {required: true, message: '请输入课程名称', trigger: 'change'},
        ],
        price: [
          {required: true, message: '请输入价格', trigger: 'change'},
        ],
        describe: [
          {required: true, message: '请输入课程描述', trigger: 'change'},
        ],
        mediaType: [
          {required: true, message: '请选择', trigger: 'blur'},
        ],
        vipFree: [
          {required: true, message: '请选择', trigger: 'blur'},
        ],
        free: [
          {required: true, message: '请选择', trigger: 'blur'},
        ],
      },
      newFile: {},
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url:{
          addEdit:'/cms/api/course/editCourse.do'
      },
      imgApi : this.$root.staticData.imgApi,
      hideCode : false
    }
  },
  mounted () {
     if(this.addEditType === 'edit'){
       this.hideCode = true;
       const that = this;
       this.imgSrcA= this.imgApi + this.addEditData.image;
       this.imgSrcB= this.imgApi + this.addEditData.details;
       this.ruleForm = {
         courseCode: that.addEditData.courseCode,
         courseName: that.addEditData.courseName,
         mediaType: that.addEditData.mediaType,
         vipFree: that.addEditData.vipFree.toString(),
         price: that.addEditData.price,
         describe: that.addEditData.courseCode,
      //   details: that.addEditData.details,
         free: that.addEditData.free.toString(),
       };
     }
    this.newFile = new FormData();
  },
  methods: {
    upload(ev, index) {
      const evAnd = ev.target ? ev.target : ev.srcElement;
      const file = evAnd.files[0];
      this.newFile.set("file" + index, file);
    //  this.newFile.set("fileA", file);
      const that = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        switch (index) {
          case 'A':
            that.imgSrcA = this.result;
            break;
          case 'B':
            that.imgSrcB = this.result;
            break;
        }
      //  that.imgSrcA = this.result;
      };
    },
    submitForm(formName) {
      const that = this;
      if (!/^0\.\d+$|^[1-9]+(\.\d+)?$/.test(this.ruleForm.price)) {
        that.$message({
          type: 'warning',
          message: '请输入有效价格'
        });
      }
      this.newFile.set('courseCode', this.ruleForm.courseCode);
      this.newFile.set('courseName', this.ruleForm.courseName);
      this.newFile.set('describe', this.ruleForm.describe);
      this.newFile.set('mediaType', this.ruleForm.mediaType);
      this.newFile.set('price', this.ruleForm.price);
      this.newFile.set('vipFree', this.ruleForm.vipFree);
      this.newFile.set('free', this.ruleForm.free);
    //  this.newFile.set('details', this.ruleForm.details); // 富文本
      this.$refs[formName].validate((valid) => {
        if (valid) {
           if(that.addEditType === 'add'){
             that.newFile.set('flag', 'add');
             that.newFile.set('image', '');
             that.newFile.set('details', '');
           } else {
             that.newFile.set('flag', 'update');
             that.newFile.set('image', this.addEditData.image);
             that.newFile.set('details', this.addEditData.details);
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
