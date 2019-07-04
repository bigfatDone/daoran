<template>
  <el-form
  :inline="true"
  :model="formInline"
  label-width="100px"
  :label-position="labelPosition"
  class="demo-form-inline"
  size="mini">
     <!--<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">-->
      <el-form-item label="资源编码">
        <div class="w150">
          <el-input v-model="formInline.resCode" placeholder="请输入资源编码" @keyup.enter.native="onSubmit"></el-input>
        </div>
      </el-form-item>
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">-->
      <el-form-item label="资源名">
        <div class="w150">
          <el-input v-model="formInline.resName" placeholder="请输入资源名" @keyup.enter.native="onSubmit"></el-input>
        </div>
      </el-form-item>
    <!--</el-col>-->

    <!--<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">-->
      <el-form-item label="资源状态">
        <div class="w150">
          <el-select v-model="formInline.resState" placeholder="请选择" @change="onSubmit">
            <el-option v-for="item in sourceStatus" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </el-form-item>
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">-->
      <!--<el-form-item label="高清地址">-->
        <!--<div class="w150">-->
          <!--<el-select v-model="formInline.haddress" placeholder="请选择">-->
            <!--<el-option v-for="item in haddressData" :key="item.label" :label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</div>-->
      <!--</el-form-item>-->
    <!--</el-col>-->

    <!--<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">-->
      <!--<el-form-item label="标清地址">-->
        <!--<div class="w150">-->
          <!--<el-select v-model="formInline.saddress" placeholder="请选择">-->
            <!--<el-option v-for="item in saddressData" :key="item.label" :label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</div>-->
      <!--</el-form-item>-->
    <!--</el-col>-->

    <!--<el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">-->
    <el-form-item label="艺人编码">
      <div class="w150">
        <el-input v-model="formInline.artistCode" placeholder="请输入艺人编码" @keyup.enter.native="onSubmit"></el-input>
      </div>
    </el-form-item>
    <!--</el-col>-->

    <!--<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">-->
    <el-form-item label="艺人名称">
      <div class="w150">
        <el-input v-model="formInline.artistName" placeholder="请输入艺人名称" @keyup.enter.native="onSubmit"></el-input>
      </div>
    </el-form-item>
    <!--</el-col>-->


    <el-form-item label="更新时间">
      <el-col :span="11">
        <el-date-picker
          @change="dateChosed"
          size="mini"
          v-model="formInline.date"
          :editable="false"
          :clearable="false"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
    </el-form-item>

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
      sourceStatus: [
        {label: '请选择', value: ''},
        {label: '上线', value: '1'},
        {label: '下线', value: '0'},
      ],
      haddressData: [
        {label: '为空', value: '0'},
        {label: '不为空', value: '1'},
      ],
      saddressData: [
        {label: '为空', value: '0'},
        {label: '不为空', value: '1'},
      ],
      sourceType: [
        {label: '视频', value: 0},
        {label: '音频', value: 1},
      ],
      sourceAddr: [
        {label: '有播放地址', value: 0},
        {label: '无播放地址', value: 1},
      ]
    }
  },
  methods: {
    dateChosed() {
      this.formInline.beginTime = this.formInline.date[0];
      this.formInline.endTime = this.formInline.date[1];
    },
    onSubmit () {
      this.$emit('vSearch', 'search');
    },
    clear () {
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
