<template>
  <div class="pa-pages-table">
    <el-button-group class="downloadTable">
      <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
    </el-button-group>
    <el-table
      ref="pa_page_tables"
      :data="tableData"
      border
      stripe
      :max-height="height"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        property="code"
        min-width="82"
        sortable
        :label="tableVisible.codename">
      </el-table-column>
      <el-table-column
        property="name"
        min-width="82"
        :label="tableVisible.titlename">
      </el-table-column>

      <el-table-column
        :property="tableVisible.name"
        sortable
        min-width="110"
        :label="tableVisible.title">
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage($event)"
        :pager-count=5
        :page-size="100"
        :current-page="searchForm.page"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "top-table",
    props: ["tableData",'loading','height','tableVisible','count','searchForm'],
    components: {

    },
    data () {
      return {
        pageIndex: 1,
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      changePage(val){
        let that = this;
        that.pageIndex = val;
        that.$emit("page", val);
      },
      downloadTable(){
        let that =this;
        let url = "/ms_bas/resPlayReport/toExcel.do?startDate="+ that.searchForm.startDate +"&endDate="+ that.searchForm.endDate +"&sNodeCode="+ that.searchForm.sNodeCode +"&sProjectCode="+ that.searchForm.sProjectCode
          +"&sProvinceCode=" + that.searchForm.sProvinceCode + "&xingshi=" + that.searchForm.xingshi + "&type=" + that.searchForm.type + "&tableType=" +that.searchForm.tableType +"&rows=1000";
        window.open(url);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
  .pagination-box{
    padding: 1rem 0;
    text-align: center;
  }
</style>
