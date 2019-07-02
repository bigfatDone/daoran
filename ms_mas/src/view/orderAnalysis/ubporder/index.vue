<template>
  <div class="pages">
    <v-search
      @search="getResult($event)"
      @loading="getLoading($event)"
      @searchErrorType="getErrorResult($event)"
      @searchData="searchData($event)"></v-search>
    <v-table :table-data="tableData" :table-error-data="tableErrorData" :search-datas="searchDatas" :loading="loading"></v-table>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  export default {
    name: "ubporder",
    components: {
      vSearch, vTable
    },
    data () {
      return {
        tableData: [],
        tableErrorData: [],
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
      getErrorResult (data) {
        let that = this;
        that.tableErrorData = data;
      },
      searchData (data) {
        let that = this;
        that.searchDatas = data;
      },
      getLoading (data) {
        let that = this;
        that.loading = data;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
