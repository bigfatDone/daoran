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
        sortable
        label="首次订购用户(去重)">
        <template slot-scope="scope">
          {{ scope.row.firstVipUser }}
        </template>
      </el-table-column>
      <el-table-column
        property="orderAvgDay"
        min-width="82"
        sortable
        label="从用户激活到发生订购平均天数">
      </el-table-column>
      <el-table-column
        property="orderAvgPlayAmount"
        min-width="82"
        sortable
        label="平均播放次数发生订购">
      </el-table-column>
      <el-table-column
        property="orderAvgPlayDay"
        min-width="105"
        sortable
        label="用户平均点播天转VIP">
      </el-table-column>
      <el-table-column
        property="orderAvgAccessAmount"
        min-width="82"
        sortable
        label="平均访问次数发生订购">
      </el-table-column>
      <el-table-column
        property="orderAvgAccessDay"
        min-width="82"
        sortable
        label="用户平均访问天转VIP">
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
