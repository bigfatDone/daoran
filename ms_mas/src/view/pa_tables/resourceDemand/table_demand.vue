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
        property="playNum"
        sortable
        min-width="82"
        label="播放次数">
      </el-table-column>
      <el-table-column
        property="playUserNum"
        sortable
        min-width="82"
        label="播放人数">
      </el-table-column>
      <el-table-column
        property="playTimeTotal"
        sortable
        min-width="95"
        label="播放时长(时)">
      </el-table-column>
      <el-table-column
        property="userAvgTime"
        sortable
        min-width="110"
        label="人均播放时长(分)">
      </el-table-column>
      <el-table-column
        property="playAvgTime"
        sortable
        min-width="110"
        label="次均播放时长(分)">
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
    name: "demand-table",
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
          +"&sProvinceCode=" + that.searchForm.sProvinceCode + "&xingshi=" + that.searchForm.xingshi + "&type=" + that.searchForm.type + "&rows=1000&tab=play";
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
