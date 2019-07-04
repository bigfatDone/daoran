<template>
  <el-form
  :inline="true"
  :model="formInline"
  label-width="68px"
  :label-position="labelPosition"
  class="demo-form-inline"
  size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item label="标签名称">
        <div class="w150">
          <el-input v-model="formInline.name" placeholder="请输入类型名称" @keyup.enter.native="onSubmit"></el-input>
        </div>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item label="类型名称">
        <div class="w150">
          <el-select v-model="formInline.typeId" placeholder="请选择" @change="onSubmit">
            <el-option v-for="item in tagTypeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-col>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'search',
  props: {
    labelPosition: String,
    formInline: Object,
    tagSelectUrl: String,
  },
  activated () {
    this.getTagName();
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      date: [],
      tagTypeData: [],
    }
  },
  methods: {
    getTagName () {
      let that = this;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.tagSelectUrl,
      //   method:'post',
      //   data: {}
      // }).then(res=>{
      //   res.data.data.forEach(item => {
      //     item.id = Number(item.id);
      //   });
      //   that.tagTypeData = res.data.data;
      //   that.$emit('getTagType', that.tagTypeData);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.tagSelectUrl,
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.id = Number(item.id);
          });
          that.tagTypeData = res.data.data;
          that.tagTypeData.unshift({
            id: '',
            name: '请选择'
          })
          that.$emit('getTagType', that.tagTypeData);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    dateChosed() {
      this.formInline.beginTime = this.date[0];
      this.formInline.endTime = this.date[1];
    },
    onSubmit () {
      this.$emit('vSearch', 'search');
    },
    clear () {
      this.date = [];
      this.$emit('vSearch', 'clear');
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form {
  margin: 20px 0 0 0;
}
.line {
  text-align: center;
}
.el-form-item__content {
  width: 167px;
}
.w150 {
  width: 150px;
}
</style>
