<template>
  <div class="pages">
    <v-search @toParent="searchResult"></v-search>
    <!--<el-collapse-transition>-->
      <!--<div v-show="chartVisble">-->
        <!--<v-chart :imgData="imgData"></v-chart>-->
      <!--</div>-->
    <!--</el-collapse-transition>-->
    <!--<div :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow()"><i class="el-icon-caret-top"></i></div>-->
    <div style="padding: 10px 0;">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table :height="height" :searchData="search_form" :tableImg="tableData" :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./component/OTTsearch"
  import vTable from "./table"
  export default {
    name: "ottBehavior",
    components: {
      vSearch,vTable
    },
    data () {
      return {
        search_form:{},// 时间产品数据
        tableData:[],// 表格数据
        loading:true,
        height:'500',
        count: 0,
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
        that.loading = true;
        that.tableData = [];
        that.initTable();
      },
       // 获取表单汇总数据
      initTable() {
         let that = this;
        let url = '/ms_bas/orderActionTrajectory/getTableSummary.do';
        that.$ajax({
          url: url,
          data: {
            startDate: this.search_form.startDate,
            endDate: this.search_form.endDate,
//            dateType: this.search_form.dateType,
            product: this.search_form.product,
            itemCode: this.search_form.itemCode,
//            version: this.search_form.Version,
            },
          method: "post",
          success: function (res) {
            if(res.data.status){
              that.tableData = res.data.data;
              that.getTable();
//              that.loading = false;
            }else {
              that.getTable();
            }
          },
          error: function (err) {
            that.$message.error('订购行为轨迹报表页面数据请求失败，请刷新订购行为轨迹报表页面');
          }
        });
      },
      // 获取表单数据
      getTable() {
        let that = this;
        let url = '/ms_bas/orderActionTrajectory/getTableDatails.do';
        that.$ajax({
          url: url,
          data: {
            startDate: this.search_form.startDate,
            endDate: this.search_form.endDate,
//            dateType: this.search_form.dateType,
            product: this.search_form.product,
            itemCode: this.search_form.itemCode,
//            version: this.search_form.Version,
          },
          method: "post",
          success: function (res) {
            if(res.data.status){
              that.tableData = that.tableData.concat(res.data.data);
              that.loading = false;
            }else {
              that.loading = false;
            }
          },
          error: function (err) {
            that.$message.error('订购行为轨迹报表页面数据请求失败，请刷新订购行为轨迹报表页面');
          }
        });
      },

      downloadTable(){ // 汇总下载
        let that = this;
        let url = "/ms_bas/orderActionTrajectory/toExcel.do?startDate="+that.search_form.startDate +"&endDate="+ that.search_form.endDate
        + "&product=" + that.search_form.product + "&itemCode=" + that.search_form.itemCode;
        window.open(encodeURI(url));
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
</style>
