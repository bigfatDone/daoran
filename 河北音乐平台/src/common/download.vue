<template>
  <el-dialog width="500px" :visible.sync="isdown" @close="downClose" :show-close="false" v-loading="importOutings">
    <div class="title" slot="title">
      批量导入
      <el-button @click="chooseForm" size="mini">模板下载</el-button>
    </div>
    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
      <input type="file" id = "fileInputs" name="file" @change="chooseDown($event)" />
    </el-col>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="downClose">取消</el-button>
      <el-button type="primary" size="mini" @click="downSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'download',
    props: ['isdown','downUrl','exportUrl'],
    data () {
      return {
        importOutings: false,
        axios: this.$root.axios,
        downFile:{}
      }
    },
    activated () {
      this.downFile = new FormData();
    },
    methods: {
      downClose () {
        document.getElementById('fileInputs').value = '';
        this.$emit('closeLoad');
        this.downFile.set("file", '');
      },
      chooseForm () {
        window.open(this.downUrl);
      },
      chooseDown(ev) {
        let evAnd = ev.target ? ev.target : ev.srcElement;
        let file = evAnd.files[0];
        this.downFile.set("file", file);
      },
      downSure () {
        let that = this;
        that.axios({
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          url: this.exportUrl,
          method:'post',
          data: that.downFile,
        }).then( res => {
          if(res.data.success) {
            if(document.getElementById('fileInputs').value === '') {
              that.$message({
                type: 'warning',
                message: res.data.msg
              });
            } else {
              that.$message({
                type: 'success',
                message: res.data.msg
              });
              this.$emit('closeLoad');
            }
          }else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            });
          }
          console.log(res)
        }).catch( err => {
          console.log(err);
        })
      },
    }
  }
</script>

<style scoped>

</style>
