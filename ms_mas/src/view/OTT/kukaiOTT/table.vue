<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableImg"
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
        min-width="80"
        label="累计用户数">
        <template slot-scope="scope">
          {{ scope.row.totalUser == '-1' ? '-' : scope.row.totalUser}}
        </template>
      </el-table-column>
      <el-table-column
        property="newUser"
        min-width="82"
        label="新增用户">
      </el-table-column>
      <el-table-column
        property="accessUser"
        min-width="82"
        sortable
        label="使用用户数">
      </el-table-column>
      <el-table-column
        property="orderAmount"
        min-width="105"
        sortable
        label="订单数">
      </el-table-column>
      <el-table-column
        property="money"
        min-width="82"
        sortable
        label="流水（元）">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "feed-back",
    props: ["loading","tableImg","height","searchData"],
    components: {

    },
    data () {
      return {

      }
    },
    computed: {
      },
    watch: {

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
