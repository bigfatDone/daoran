<template>
  <el-form
  :inline="true"
  :model="formInline"
  label-width="70px"
  :label-position="labelPosition"
  class="demo-form-inline"
  size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item
        label="剧种编码">
        <div class="w150">
          <el-input v-model="formInline.sectCode" placeholder="请输入剧种编码" @keyup.enter.native="onSubmit"></el-input>
        </div>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item
        label="剧种名称">
        <div class="w150">
          <el-input v-model="formInline.sectName" placeholder="请输入剧种名称" @keyup.enter.native="onSubmit"></el-input>
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
  },
  mounted () {
  },
  data () {
    return {
      date: [],
    }
  },
  methods: {
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
