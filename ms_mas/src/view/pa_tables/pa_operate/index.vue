<template>
  <div class="pa-pages">
    <v-search
      @search="getResult($event)"
      @searchForm="getSearchForm($event)"
      @loading="loadingResult($event)"
      @createHeight="getSearchHeight($event)"></v-search>

    <el-button-group class="downloadTable">
      <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
    </el-button-group>

    <v-table
      v-loading="loading"
      :table-data="tableData"
      :page-list="pageIdList"
      :search-form="search_form"
      :search-height="searchHeight"></v-table>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  export default {
    name: "paTableOperate",
    components: {
      vSearch, vTable
    },
    data () {
      return {
        tableData: [],
        pageIdList: [],
        search_form: {},
        searchHeight: 300,
        loading:true
      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      getSearchHeight (h) {
        let that = this;
        that.searchHeight = h;
      },
      getResult (data) {
        let that = this;
        that.tableData = data.tableData;
        that.search_form = data.search_form;
        that.pageIdList = data.pageIdList;
      },
      getSearchForm(data){
        let that = this;
        that.search_form = data;
      },
      downloadTable(){
        let that = this;
        let url = "/ms_bas/pagePartRep/exportPartList.do?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate+"&sNodeCode="+that.search_form.sNodeCode
          +"&sProvinceCode="+that.search_form.sProvinceCode+"&sProjectCode="+that.search_form.sProjectCode+"&pageId="+that.search_form.pageId;
        window.open(url);
      },
      loadingResult(state){
        let that = this;
        that.loading=state;
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
