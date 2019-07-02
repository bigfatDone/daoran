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
        property="stockUser"
        min-width="82"
        sortable
        label="存量用户数">
      </el-table-column>
      <el-table-column
        property="accessedUser"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="demandUser"
        min-width="82"
        sortable
        label="点播用户数">
      </el-table-column>
      <el-table-column
        property="userTimeOnDemand"
        min-width="95"
        sortable
        label="用户点播时长">
      </el-table-column>
      <el-table-column
        property="userOnDemandRate"
        min-width="82"
        sortable
        label="用户点播率">
      </el-table-column>
      <el-table-column
        property="userOnDemandTime"
        min-width="105"
        sortable
        label="用户人均点播时长">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "demandRate-table",
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
