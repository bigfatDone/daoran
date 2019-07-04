<template>
  <div>
    <div class="w250">
      <span>课程编码:</span><el-input v-model="courseCode" size="mini" placeholder="请输入课程编码" @keyup.enter.native="changFun"></el-input>
    </div>
    <div class="w250">
      <span>课程名称:</span><el-input v-model="courseName" size="mini" placeholder="请输入课程名称" @keyup.enter.native="changFun"></el-input>
    </div>
    <div class="w250">
      <span>课程类型 :</span>
      <el-select size="mini" v-model="mediaType" placeholder="请选择" @change="changFun">
        <el-option key="" label="请选择" value=""></el-option>
        <el-option key="audio" label="音频" value="audio"></el-option>
        <el-option key="video" label="视频" value="video"></el-option>
      </el-select>
    </div>
    <div class="w250" style="width: 300px;">
      <span>VIP是否免费 :</span>
      <el-select size="mini" v-model="vipFree" placeholder="请选择" @change="changFun">
        <el-option key="" label="请选择" value=""></el-option>
        <el-option key="1" label="是" value="1"></el-option>
        <el-option key="0" label="否" value="0"></el-option>
      </el-select>
    </div>
    <div class="w250" style="width: 120px;">
      <el-button-group>
        <el-button size="mini" type="primary" @click="onSubmit(null)">查询</el-button>
        <el-button size="mini" @click="clear">重置</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: ['currentPage'],
  data () {
    return {
      courseCode: '',
      courseName: '',
      mediaType: '',
      vipFree: '',
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      page:1,
      rows:20
    }
  },
  activated(){
      this.onSubmit(null);
  },
  methods: {
    onSubmit(val){
      const that = this;
      if(val === null){
        that.$emit('clear', false);
        that.currentPage.page = 1;
      }
      const parm = {
        courseCode : that.courseCode,
        courseName : that.courseName,
        mediaType : that.mediaType,
        vipFree : that.vipFree,
        page : that.currentPage.page,
        rows : that.currentPage.rows
      };
      const params = {jsonParam: JSON.stringify(parm)};
      that.$ajax({
        url:"/cms/api/course/listCourse.do",
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if(res.data.success){
            that.$emit('getData', res.data);
            that.$emit('clear', true);
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    clear(){
      this.courseCode = '';
      this.courseName = '';
      this.mediaType = '';
      this.vipFree = '';
      this.$emit('clear', false);
      this.currentPage.page = 1;
      this.onSubmit(null);
    },
    changFun(){
      this.$emit('clear', false);
      this.currentPage.page = 1;
      this.onSubmit(null);
    },
  }
  }
</script>

<style scoped>
  .w250{width: 250px;float: left;margin-bottom: 10px;}
  .w250 span{margin-right: 5px;}
  .el-input,.el-select{width: 150px;}
</style>
