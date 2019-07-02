<template>
  <div class="pages">
    <v-search @toParent="searchResult"></v-search>
    <el-collapse-transition>
      <div v-show="chartVisble">
        <v-chart :imgData="imgData"></v-chart>
      </div>
    </el-collapse-transition>
    <div :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow()"><i class="el-icon-caret-top"></i></div>
    <div style="padding: 10px 0;">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table :height="height" :searchData="search_form" :tableImg="tableData" :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "../../component/common/search"
  import vTable from "./table"
  import vChart from "./chart.vue"
  export default {
    name: "zoneAnalysis",
    components: {
      vSearch,vTable,vChart
    },
    data () {
      return {
        search_form:{},// 时间产品数据
        tableData:[],// 表格数据
        loading:true,
        height:'500',
        imgData:[],// 图表
        imgDataHide:false,
        count: 0,
        chartVisble:true,
        chartShowState:false,
      }
    },
    computed: {
    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.height='500';
      }else {
        that.height=document.body.clientHeight - 170;
      }
    },
    mounted () {
    },

    methods: {
      //  获取子组件的数据
      searchResult(data){
        let that = this;
        that.search_form = data;
        that.imgDataHide = false;
        that.loading = true;
        that.initTable();
        that.initImg();
      },
       // 获取表单数据
      initTable() {
         let that = this;
        let url = '/ms_bas/ott/user/feedback/getTable';
        that.$ajax({
          url: url,
          data: {
            startDate: this.search_form.startDate,
            endDate: this.search_form.endDate,
            dateType: this.search_form.dateType,
            product: this.search_form.product,
            itemCode: this.search_form.itemCode,
            version: this.search_form.Version,
            },
          method: "post",
          success: function (res) {
            if(res.status){
              that.tableData = res.data.data;
              that.loading = false;
            }
          },
          error: function (err) {
            that.$message.error('用户反馈页面数据请求失败，请刷新用户反馈页面');
          }
        });
      },
      // 获取hidechart数据
      initImg() {
         let that = this;
        let url = '/ms_bas/ott/user/feedback/getImage';
        that.$ajax({
          url: url,
          data: {
            startDate: this.search_form.startDate,
            endDate: this.search_form.endDate,
            dateType: this.search_form.dateType,
            product: this.search_form.product,
            itemCode: this.search_form.itemCode,
            version: this.search_form.Version,
            },
          method: "post",
          success: function (res) {
            if(res.status){
              that.imgData = res.data.data;
              that.imgDataHide = true;
            }
          },
          error: function (err) {
            that.$message.error('用户反馈页面数据请求失败，请刷新用户反馈页面');
          }
        });
      },
      downloadTable(){ // 汇总下载
        let that = this;
        let url = "/ms_bas/ott/user/feedback/toExcel?startDate="+that.search_form.startDate +"&endDate="+ that.search_form.endDate
          +"&dateType="+that.search_form.dateType + "&product=" + that.search_form.product + "&itemCode=" + that.search_form.itemCode + "&version=" + that.search_form.Version;
        window.open(encodeURI(url));
      },
      //  隐藏hightchart小按钮
      chartHideShow() {
        let that = this;
        that.chartVisble= !that.chartVisble;
        that.chartShowState= !that.chartShowState;
        if (that.chartVisble === true){
          that.height='500';
        }else {
          that.height=document.body.clientHeight - 320;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
</style>
