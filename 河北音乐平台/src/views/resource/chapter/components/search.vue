<template>
  <div>
    <div class="w250">
      <span>章节编码:</span><el-input v-model="chapterCode" size="mini" placeholder="请输入章节编码" @keyup.enter.native="changFun"></el-input>
    </div>
    <div class="w250">
      <span>章节标题:</span><el-input v-model="chapterTitle" size="mini" placeholder="请输入章节标题" @keyup.enter.native="changFun"></el-input>
    </div>
    <div class="w250">
      <span>cp商 :</span>
      <el-select size="mini" v-model="cpid" placeholder="请选择" @change="changFun">
        <el-option v-for="item in cpList" :key="item.cpId" :label="item.fullName" :value="item.cpId"></el-option>
      </el-select>
    </div>
    <div class="w250">
      <span>课程类型 :</span>
      <el-select size="mini" v-model="mediaType" placeholder="请选择" @change="changFun">
        <el-option key="" label="请选择" value=""></el-option>
        <el-option key="audio" label="音频" value="audio"></el-option>
        <el-option key="video" label="视频" value="video"></el-option>
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
  name: 'chaptersearch',
  props: ['currentPage'],
  data () {
    return {
      chapterCode:'',
      chapterTitle: '',
      cpid: '',
      mediaType: '',
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      page:1,
      rows:20,
      cpList:[]
    }
  },
  watch:{

  },
  activated(){
      this.onSubmit(null);
  },
  mounted(){
      this.getCP();
  },
  methods: {
    onSubmit(val){
      const that = this;
      if(val === null){
        that.$emit('clear', false);
        that.currentPage.page = 1;
      }
      const parm = {
        chapterCode: that.chapterCode,
        chapterTitle : that.chapterTitle,
        cpid : that.cpid,
        mediaType : that.mediaType,
        page : that.currentPage.page,
        rows : that.currentPage.rows
      };
      const params = {jsonParam: JSON.stringify(parm)};
      that.$ajax({
        url:"/cms/api/chapter/listChapter.do",
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
      this.chapterTitle = '';
      this.cpid = '';
      this.mediaType = '';
      this.chapterCode = '';
      this.$emit('clear', false);
      this.currentPage.page = 1;
      this.onSubmit(null);
    },
    changFun(){
      this.$emit('clear', false);
      this.currentPage.page = 1;
      this.onSubmit(null);
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
  }
  }
</script>

<style scoped>
  .w250{width: 250px;float: left;margin-bottom: 10px;}
  .w250 span{margin-right: 5px;}
  .el-input,.el-select{width: 150px;}
</style>
