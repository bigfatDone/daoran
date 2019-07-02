<style scoped>
  .search-index { padding: .4rem;height: 30px;  }
  .search-select-link{ display: inline-block; vertical-align: middle; padding: .3rem 0;  }
  .el-select{left: 35px;}
  .selection{  display: inline-block;  position: relative;  width: 180px;  padding: 0 20px 0 5px;margin: 8px 20px;  }
  .label{  display: inline-block;  position: absolute;  left: 0;  top: 0;  line-height: 27px;  color: #666; font-size: .65rem;  }
  .btns {  display: inline-block;  vertical-align: top;  padding: .3rem 0; top: -6px; position: relative; }
  @media screen and (max-width: 800px) {
    .selection{width: 100%;}
    .search-index {position: fixed;  top: 3rem;  left: 0;  right: 0;  z-index: 6;  background: #fff;  padding: 1.2rem;  display: none;  }
  }
</style>
<template>
  <div class="pa-pages-search">
    <div class="search-index">
      <div>
        <v-date buttons="['yesterday', 'sevenday', 'nearthirty','nearsixty']" dateModel="2" default-date="sevenday" @getDate="getDate($event)"></v-date>
      </div>
    </div>
    <!-- 产品 -->
    <div class="selection">
      <span class="label">产品:</span>
      <el-select v-model="projectValue" placeholder="请选择产品" @change="changeProduct()">
        <el-option v-for="projectItem in projectList" :key="projectItem.code"  :label="projectItem.text" :value="projectItem.code"></el-option>
      </el-select>
    </div>
    <!-- 渠道 -->
    <div class="selection">
      <span class="label">渠道:</span>
      <el-select v-model="itemValue" placeholder="请选择渠道">
        <el-option v-for="projectItem in itemList" :key="projectItem.code"  :label="projectItem.text" :value="projectItem.code"></el-option>
      </el-select>
    </div>
    <!-- 版本 -->
    <div class="selection" style="display: none;">
      <span class="label">版本:</span>
      <el-select v-model="versionValue" placeholder="请选择版本">
        <el-option v-for="projectItem in versionList" :key="projectItem.code"  :label="projectItem.text" :value="projectItem.code"></el-option>
      </el-select>
    </div>
    <slot name="historyBack"></slot>
    <!-- 搜寻 -->
    <div class="selection">
      <div class="btns">
        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import vDate from "./search-date-select"
  export default {
    name: "common-search",
    props:[],
    components: {
      vDate
    },
    data () {
      return {
        countNum: 0,
        options: [{
          value: 1,
          label: 'OTT'
        }, {
          value: 0,
          label: '非OTT'
        }],
        projectItem: 1,
        url: {
          Project: "/ms_bas/ott/api/getProject",
          Item: "/ms_bas/ott/api/getItem",
          Version:"/ms_bas/ott/api/getVersion"
        },
        projectValue:'',
        projectList:[],
        itemValue:'',
        itemList:[],
        versionValue:'',
        versionList:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        search_form: {
          startDate:'',
          endDate:'',
          product:'',
          dateType:'',
          itemCode:'',
          Version:'',
        }
      }
    },
    computed: {
    },
    watch:{
    },
    methods: {
      // 获取产品数据
      getProjectData() {
        const that = this;
        that.$ajax({
          url: that.url.Project,
          data: {},
          method: "post",
          success: function (res) {
            if(res.status){
              that.projectList = res.data.data;
              that.projectValue = res.data.data[0].code;
              that.getItemData();
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      // 获取渠道数据
      getItemData() {
        const that = this;
        that.$ajax({
          url: that.url.Item,
          data: { product: that.projectValue },
          method: "post",
          success: function (res) {
            if(res.status){
              that.itemList = res.data.data;
              that.itemValue = res.data.data[0].code;
              that.getVersionData();
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      // 获取版本数据
      getVersionData() {
        const that = this;
        that.$ajax({
          url: that.url.Version,
          data: { product: that.projectValue },
          method: "post",
          success: function (res) {
            if(res.status){
              that.versionList = res.data.data;
              that.versionValue = res.data.data[0].code;
              if(that.countNum == 0){
                that.search();
                that.countNum++;
              }
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      // 产品修改
      changeProduct() {
          console.log(111);
        this.getItemData();
      },
      // 当前组件获取子组件传值
      getDate(data) {
        this.search_form.startDate = data.dateStart;
        this.search_form.endDate = data.dateEnd;
        this.search_form.dateType = data.dateType;
      },
      // 向其父级传值
      search() {
        this.search_form.product = this.projectValue;
        this.search_form.itemCode = this.itemValue;
        this.search_form.Version = this.versionValue;
        console.log(this.search_form);
          this.$emit('toParent',this.search_form);
      },
    },
    created() {
      this.getProjectData();
    },
  }
</script>


