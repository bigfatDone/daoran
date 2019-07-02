<template>
  <div class="pa-pages-table">
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
        property="ctime"
        min-width="83"
        sortable
        label="统计日期">
      </el-table-column>
      <el-table-column
        property="stockCnt"
        min-width="82"
        sortable
        label="存量用户数">
      </el-table-column>
      <el-table-column
        property="iStockATotal"
        min-width="105"
        sortable
        label="存量访问用户数">
      </el-table-column>
      <el-table-column
        property="iStockPTotal"
        min-width="105"
        sortable
        label="存量点播用户数">
      </el-table-column>
      <el-table-column
        property="iStockPTotalTime"
        min-width="117"
        sortable
        label="存量用户点播时长">
        <template slot-scope="scope">
          {{scope.row.iStockPTotalTime}}时
        </template>
      </el-table-column>
      <el-table-column
        property="iStockAAvg"
        min-width="129"
        sortable
        label="存量用户访问活跃率">
        <template slot-scope="scope">
          {{Number(scope.row.iStockAAvg).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="iStockPAvg"
        min-width="129"
        sortable
        label="存量用户点播活跃率">
        <template slot-scope="scope">
          {{Number(scope.row.iStockPAvg).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="iStockPAvgTime"
        min-width="141"
        sortable
        label="存量用户人均点播时长">
        <template slot-scope="scope">
          {{Number(scope.row.iStockPAvgTime).toFixed(2)}}分
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "activityRateReport-table",
    props: ["tableData",'loading','height'],
    components: {

    },
    data () {
      return {

      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
