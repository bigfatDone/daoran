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
        property="sNodeName"
        min-width="80"
        label="项目">
      </el-table-column>
      <el-table-column
        property="sProvinceName"
        min-width="100"
        label="区域">
      </el-table-column>
      <el-table-column
        property="sProjectName"
        min-width="82"
        label="产品">
      </el-table-column>
      <el-table-column
        property="sEntryName"
        min-width="120"
        sortable
        label="入口标识">
      </el-table-column>
      <el-table-column
        property="iATotal"
        min-width="70"
        sortable
        label="访问总量">
      </el-table-column>
      <el-table-column
        property="iAUTotal"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="iANotMonthlyUTotal"
        min-width="105"
        sortable
        label="非包月访问用户">
      </el-table-column>
      <el-table-column
        property="iAMonthlyUTotal"
        min-width="105"
        sortable
        label="包月访问用户数">
      </el-table-column>
      <el-table-column
        property="iOTotal"
        min-width="95"
        sortable
        label="订购发起次数">
      </el-table-column>
      <el-table-column
        property="iOSuccessTotal"
        min-width="82"
        sortable
        label="订购成功数">
      </el-table-column>
      <el-table-column
        property="iOTRate"
        min-width="82"
        sortable
        label="订购转化率">
        <template slot-scope="scope">
          {{Number(scope.row.iOTRate).toFixed(2)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "accessEntryReport-table",
    props: ["tableData","loading","height"],
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
