<template>
  <div class="pa-pages">
    <v-search
      @search="getResult($event)"
      @loading="loadingResult($event)"
      @createHeight="getSearchHeight($event)"></v-search>

    <el-button-group class="downloadTable">
      <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
    </el-button-group>

    <v-table
      v-loading="loading"
      :table-data="tableData"
      :search-form="search_form"
      :s-height="search_height"></v-table>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  export default {
    name: "paTablePage",
    components: {
      vSearch, vTable
    },
    data () {
      return {
        tableData: [],
        search_form: {},
        search_height: 0,

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

        that.search_height = h;
      },
      getResult (data) {
        let that = this;
        that.tableData = data.tableData;
        that.search_form = data.search_form;
      },
      downloadTable(){
        let that = this;
        let url = "/ms_bas/pageInfoRep/exportPageAccess.do?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&sNodeCode="+that.search_form.sNodeCode+"&sProvinceCode="+that.search_form.sProvinceCode+"&sProjectCode="+that.search_form.sProjectCode;
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

</style>
