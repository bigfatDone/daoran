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
        label="日期">
      </el-table-column>
      <el-table-column
        property="productCode"
        min-width="80"
        sortable
        label="订购月份">
      </el-table-column>
      <el-table-column
        property="accessNum"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="orderNum"
        min-width="82"
        sortable
        label="订购发起数">
      </el-table-column>
      <el-table-column
        property="orderSuccessNum"
        min-width="82"
        sortable
        label="订购成功数">
      </el-table-column>
      <el-table-column
        property="orderFailNum"
        min-width="82"
        sortable
        label="订购失败数">
      </el-table-column>
      <el-table-column
        property="orderSuccessRate"
        min-width="82"
        sortable
        label="成功订购率">
        <template slot-scope="scope">
          {{Number(scope.row.orderSuccessRate)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="orderRate"
        min-width="82"
        sortable
        label="订购转化率">
        <template slot-scope="scope">
          {{Number(scope.row.orderRate)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="userNum"
        min-width="82"
        sortable
        label="复购用户数">
      </el-table-column>
      <el-table-column
        property="repeatRate"
        min-width="82"
        sortable
        label="复购率">
        <template slot-scope="scope">
          {{Number(scope.row.repeatRate)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="priceSale"
        min-width="82"
        sortable
        label="收入流水">
      </el-table-column>
      <el-table-column
        property="arppu"
        min-width="82"
        sortable
        label="ARPPU值">
      </el-table-column>
      <el-table-column
        min-width="82"
        sortable
        label="占比">
        <template slot-scope="scope">
          {{Number(scope.row.rate)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "orderOTT-table",
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
