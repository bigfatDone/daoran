<template>
  <div class="pages">
    <v-search
      @search="getResult($event)"
      @loading="loadingReturn($event)"
      @searchData="searchData($event)"></v-search>

    <el-button-group class="downloadTable">
      <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
    </el-button-group>

    <v-table :table-data="tableData" :search-datas="searchDatas" :loading="loading"></v-table>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  export default {
    name: "uploadView",
    components: {
      vSearch, vTable
    },
    data () {
      return {
        tableData: [],
        searchDatas: [],
        loading: true,
      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      getResult (data) {
        let that = this;
        that.tableData = data;
      },
      searchData (data) {
        let that = this;
        that.searchDatas = data;
      },
      downloadTable(){
        let that = this;
        let url = "/ms_bas/uploadView/downloadExcel?date="+that.searchDatas.date +"&sNodeCode="+that.searchDatas.sNodeCode+"&sProvinceCode="+that.searchDatas.sProvinceCode+"&sProjectCode="+that.searchDatas.sProjectCode;
        window.open(url);
      },
      loadingReturn(data){
        let that = this;
        that.loading = data;
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
