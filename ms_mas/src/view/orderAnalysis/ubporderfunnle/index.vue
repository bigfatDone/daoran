<template>
  <div class="pages">
    <v-search @changeTableList="changeTableList($event)" @changeTableData="changeTableData($event)" @searchData="searchData($event)" @loadingTable="loadingTable($event)"></v-search>
    <div style="padding:10px 0">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
     <v-table :tableData="tableData" :tableList="tableList" :loading="loading" :height="height"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./search";
  import vTable from "./table"
  export default {
    name: 'ubporderfunnle',
    components: {
          vSearch,vTable
    },
      data() {
          return {
            tableData: [],
            tableList: [],
            selectData: [],
            loading: true,
            height: 600
          }
      },
    mounted() {
    },
    watch: {

    },
    methods: {
      changeTableList(data) {
        let that = this;
        that.tableList = data;
      },
      changeTableData(data) {
          let that = this;
          that.tableData = data;
          that.loading = false;
      },
      searchData(data) {
        let that = this;
        this.selectData = data;
      },
      loadingTable(data) {
        let that = this;
        that.loading = true;
      },
      downloadTable(){ // 汇总下载
        let that = this;
        let url = "/ms_bas/ubporderfunnle/downloadExcel?startDate="+that.selectData.startDate +"&sNodeCode="+ that.selectData.sNodeCode
          + "&sProvinceCode="+that.selectData.sProvinceCode + "&sProjectCode=" + that.selectData.sProjectCode;
        window.open(encodeURI(url));
      }
    }
  }
</script>

<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
</style>
