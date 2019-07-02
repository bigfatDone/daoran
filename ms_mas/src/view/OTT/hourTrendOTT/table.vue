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
        min-width="100"
        sortable
        label="统计日期">
      </el-table-column>
      <el-table-column
        property="item"
        min-width="80"
        sortable
        label="渠道">
      </el-table-column>
      <el-table-column
        property="product"
        min-width="82"
        sortable
        label="产品">
      </el-table-column>
      <el-table-column
        property="hour"
        min-width="82"
        sortable
        label="时段">
      </el-table-column>
      <el-table-column
        property="accessUser"
        min-width="105"
        sortable
        label="访问用户平均">
        <!--<template slot-scope="scope">-->
          <!--{{Number(scope.row.newUserRate)}}%-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        property="playUser"
        min-width="82"
        sortable
        label="点播用户平均">
      </el-table-column>
      <el-table-column
        property="playNum"
        min-width="82"
        sortable
        label="点播次数平均">
      </el-table-column>
      <el-table-column
        property="playTime"
        min-width="82"
        sortable
        label="点播时长平均(秒)">
        <!--<template slot-scope="scope">-->
          <!--{{Number(scope.row.orderRate)}}%-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        property="orderUser"
        min-width="82"
        sortable
        label="订购用户平均">
        <!--<template slot-scope="scope">-->
          <!--{{Number(scope.row.startNum)}}-->
        <!--</template>-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "channelOTT-table",
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
      console.log(this.tableData)
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
