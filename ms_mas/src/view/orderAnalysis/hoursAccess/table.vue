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
        min-width="156"
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
        property="sHours"
        min-width="45"
        sortable
        label="小时">
      </el-table-column>
      <el-table-column
        property="iOTotal"
        min-width="86"
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
        property="iAUTotal"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="iANotMonthlyUTotal"
        min-width="89"
        sortable
        label="非包月访问用户">
      </el-table-column>
      <el-table-column
        property="iTRate"
        min-width="82"
        sortable
        label="订购转化率">
        <template slot-scope="scope">
          {{Number(scope.row.iTRate).toFixed(2)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "hoursAccess-table",
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
