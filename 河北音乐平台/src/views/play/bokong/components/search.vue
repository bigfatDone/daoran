<template>
  <el-form
  :inline="true"
  :model="formInline"
  label-width="70px"
  :label-position="labelPosition"
  class="demo-form-inline"
  size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item label="运营商编码" label-width="85px">
        <el-select v-model="formInline.carrier" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in carrierData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item label="省份">
        <el-select v-model="formInline.proCode" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in proList" :key="item.procode" :label="item.proname" :value="item.procode"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-form-item label="运营平台">
        <el-select v-model="formInline.platform" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in platformData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-form-item label="更新时间">
      <el-col :span="11">
        <el-date-picker
          @change="dateChosed"
          size="mini"
          :editable="false"
          :clearable="false"
          v-model="formInline.date"
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
  activated () {
    this.getProList ();
  },
  data () {
    return {
      cpList: [],
      proList: [],
      getProUrl: "/cms/api/area/getProList.do",
      carrierData: [{id: '1',name: '中国电信'}, {id: '2',name: '中国联通'},{id: '3',name: '广电'},{id: '4',name: '中国移动'}],
      platformData: [{id: '0',name: '通用'}, {id: '1',name: 'Linux'},{id: '2',name: 'Android'}],
    }
  },
  methods: {
    getProList () {
      let that = this;

      that.$ajax({
        url: that.getProUrl,
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.cpId = Number(item.cpId);
          });
          that.proList = res.data.data;
          that.proList.unshift({
            procode: '',
            proname: '请选择'
          })
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    dateChosed() {
      this.formInline.beginTime = this.formInline.date[0];
      this.formInline.endTime = this.formInline.date[1];
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
