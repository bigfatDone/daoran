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
        min-width="95"
        sortable
        label="统计日期">
      </el-table-column>
      <el-table-column
        property="offUserTotal"
        min-width="82"
        sortable
        label="退订用户数">
      </el-table-column>
      <el-table-column
        property="retainedCnt"
        sortable
        min-width="82"
        label="留存用户数">
      </el-table-column>
      <el-table-column
        min-width="70"
        property="offRate"
        sortable
        label="退订率">
        <template slot-scope="scope">
          {{Number(scope.row.offRate).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="onlineTime"
        min-width="129"
        sortable
        label="连续在网时长（天）">
      </el-table-column>
      <el-table-column
        property="onTimeAvg"
        min-width="153"
        sortable
        label="用户平均在网时长（天）">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "orderOffRate-table",
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
