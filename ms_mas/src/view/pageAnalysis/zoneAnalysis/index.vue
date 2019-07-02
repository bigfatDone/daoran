<template>
  <div class="pages">
    <v-search @searchResult="searchResult" @searchResultImg="searchResultImg"></v-search>
    <v-chart v-if="imgDataHide" :imgData="imgData" :loading="loading2"></v-chart>
    <div style="padding: 10px 0;">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table :height="height" :searchData="search_form" :table-data="tableData" :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  import vChart from "./chart.vue"
  export default {
    name: "zoneAnalysis",
    components: {
      vSearch,vTable,vChart
    },
    data () {
      return {
        search_form:{},
        tableData:[],
        loading:false,
        loading2:false,
        height:'500',
        imgData:[],
        imgDataHide:false,
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
      searchResult(data){
        this.loading = data.loading;
      //  this.imgData = data.imgData;
      //  this.imgDataHide = data.imgDataHide;
        this.tableData = data.tableData;
        this.search_form = data.search_form;
      },
      searchResultImg(data){
        this.loading2 = data.loading2;
        this.imgData = data.imgData;
        this.imgDataHide = data.imgDataHide;
      },
      downloadTable(){ // 汇总下载
        let that = this;
        let url = "/ms_bas/page/report/toZoneExcel?startDate="+that.search_form.startDate +"&endDate="+ that.search_form.endDate
          +"&json="+that.search_form.json + "&type=" + that.search_form.type + "&product=" + that.search_form.product + "&pageCode=" + that.search_form.pageValue;
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
