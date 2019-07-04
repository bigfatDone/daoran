<template>
  <el-form
    :inline="true"
    :model="formInline"
    label-width="80px"
    :label-position="labelPosition"
    class="demo-form-inline"
    size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="艺人编码">
        <el-input v-model="formInline.artistCode" placeholder="请输入艺人编码" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="艺人名称">
        <el-input v-model="formInline.artistName" placeholder="请输入艺人名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="艺人类型">
        <el-select v-model="formInline.artistType" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in artType" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="所属地区">
        <el-select v-model="formInline.artistArea" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in artArea" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="艺人流派">
        <el-select v-model="formInline.sectCode" placeholder="请选择" @change="onSubmit">
          <el-option v-for="(item, index) in sectData" :key="index" :label="item.sectName" :value="item.sectCode"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="是否戏曲">
        <el-select v-model="formInline.chineseOpera" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in chineseOperaData" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="艺人状态">
        <el-select v-model="formInline.iStatus" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in iStatusData" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-form-item label="更新时间">
      <el-col :span="11">
        <el-date-picker
          @change="dateChosed"
          size="mini"
          v-model="date"
          :editable="false"
          :clearable="false"
          :unlink-panels='true'
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
    cpListurl: String,
  },
  activated () {
    this.getCpList();
    this.getAllSect();
  },
  data () {
    return {
      date: [],
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      artArea: this.$root.staticData.artArea,
      artType: this.$root.staticData.artType,
      chineseOperaData: [{type: '', name: '请选择'}, {type: '0', name: '非戏曲'}, {type: '1', name: '戏曲'}],
      iStatusData: [{type: '', name: '请选择'}, {type: 0, name: '下线'}, {type: 1, name: '上线'}],
      cpList: [],
      sectData: [],
      allSectUrl: '/cms/api/artist/getAllSectList.do'
    }
  },
  methods: {
    dateChosed() {
      this.formInline.beginDate = this.date[0];
      this.formInline.endDate = this.date[1];
    },
    onSubmit () {
      this.$emit('vSearch', 'search');
    },
    clear () {
      this.date = [];
      this.$emit('vSearch', 'clear');
    },
    getCpList () {
      let that = this;
      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.cpListurl,
        method:'post',
        data: {}
      }).then(res=>{
        res.data.data.forEach(item => {
          item.cpId = Number(item.cpId);
        });
        that.cpList = res.data.data;
      }).catch(err=>{
        console.log(err);
      })
    },
    getAllSect () {
      let that = this;
      let parm = {};
      let params = {jsonParam: JSON.stringify(parm)};
      that.$ajax({
        url: that.allSectUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.sectData = res.data.data.sectList;
            that.sectData.unshift({
              sectCode: '',
              sectName: '请选择'
            })
          } else {
            that.sectData = []
          }
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
