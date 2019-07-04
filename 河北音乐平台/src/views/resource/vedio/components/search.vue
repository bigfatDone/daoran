<template>
  <el-form
  :inline="true"
  :model="formInline"
  label-width="80px"
  :label-position="labelPosition"
  class="demo-form-inline"
  size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="资源编码">
        <el-input v-model="formInline.videoCode" placeholder="请输入资源编码" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="资源名称">
        <el-input v-model="formInline.videoName" placeholder="请输入资源名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="艺人编码">
        <el-input v-model="formInline.artistCode" placeholder="请输入艺人编码" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="艺人名称">
        <el-input v-model="formInline.artistName" placeholder="请输入艺人名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="CP商">
        <el-select v-model="formInline.cpId" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in cpList" :key="item.cpId" :label="item.fullName" :value="item.cpId"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="艺人地区">
        <el-select v-model="formInline.artistArea" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in artArea" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="曲目类别">
        <el-select v-model="formInline.videoType" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in artType" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
<!--    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label="上线节点">
        <el-select v-model="formInline.nodeCode" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in ndList" :key="item.nodeCode" :label="item.alias" :value="item.nodeCode"></el-option>
        </el-select>
      </el-form-item>
    </el-col>-->
    <!--<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">-->
    <el-form-item label="更新时间">
      <el-col :span="11">
        <el-date-picker
          @change="dateChosed"
          :editable="false"
          :clearable="false"
          size="mini"
          v-model="formInline.date"
          :unlink-panels='true'
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
    </el-form-item>
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">-->
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-button-group>
    </el-form-item>
    <!--</el-col>-->
  </el-form>
</template>

<script>
export default {
  name: 'search',
  props: {
    labelPosition: String,
    formInline: Object,
    // date: Array,
    cpListurl: String,
  },
  computed: {
    // dateFc () {
    //  return this.data || [];
    // },
    //resAllIdsNoFc (){
    //  return this.resAllIdsNo || [];
    //}
  },
  mounted () {
    this.getCpList();
    this.getNodeList();
  },
  data () {
    return {
      // date: [],
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      artArea: this.$root.staticData.artArea,
      artType: this.$root.staticData.videoSongType,
      cpList: [],
      ndList: [],
    }
  },
  methods: {
    dateChosed() {
      this.formInline.beginDate = this.formInline.date[0];
      this.formInline.endDate = this.formInline.date[1];
    },
    onSubmit () {
      this.$emit('vSearch', 'search');
    },
    clear () {
      this.$emit('vSearch', 'clear');
    },
    getCpList () {
      let that = this;

      that.$ajax({
        url: that.cpListurl,
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
    getNodeList () {
      let that = this;

      that.$ajax({
        url: "/cms/api/node/list.do",
        method: "post",
        data: {},
        success: function (res) {
          // res.data.data.forEach(item => {
          //   item.cpId = Number(item.cpId);
          // });
          that.ndList = res.data.data.nodeList;
          that.ndList.unshift({
            nodeCode: '',
            alias: '请选择'
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.line {
  text-align: center;
}
.el-form-item__content {
  width: 167px;
}
</style>
