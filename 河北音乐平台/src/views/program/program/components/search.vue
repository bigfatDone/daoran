<template>
  <el-form
  :inline="true"
  :model="formInline"
  label-width="70px"
  :label-position="labelPosition"
  class="demo-form-inline"
  size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <el-form-item label-width="85px" label="节目单名称">
        <el-input v-model="formInline.listName" placeholder="请输入节目单名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item label="节目单类型" label-width="85px">
        <el-select v-model="formInline.listType" placeholder="请选择" @change="onSubmit">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in listTypeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
      <el-form-item label="标签类型">
        <el-select v-model="formInline.tagTypeId" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in tagsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
    this.getTagName();
  },
  data () {
    return {
      cpList: [],
      proList: [],
      tagsData: [],
      getProUrl: "/cms/api/area/getProList.do",
      tagSelectUrl: "/cms/api/tagType/select.do",
      freeFlagData: [{id: '0',name: '计费'}, {id: '1',name: '免费'}],
      listTypeData: [{id: '1',name: '榜单'}, {id: '2',name: '栏目'},{id: '3',name: '专辑'}],
      resTypeData:  [{id: '1',name: '音频'}, {id: '2',name: '视频'},{id: '3',name: '手绘本'}],
    }
  },
  methods: {
    getTagName () {
      let that = this;
      that.$ajax({
        url: that.tagSelectUrl,
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.id = Number(item.id);
          });
          that.tagsData = res.data.data;
          that.tagsData.unshift({
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
