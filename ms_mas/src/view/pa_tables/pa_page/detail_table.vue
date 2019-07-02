<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableSource"
      border
      stripe
      :max-height='height'
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="countTime"
        min-width="83"
        sortable
        label="时间">
      </el-table-column>
      <el-table-column
        property="iATotal"
        min-width="82"
        sortable
        label="访问用户量">
      </el-table-column>
      <el-table-column
        property="iAUTotal"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="playUserNum"
        min-width="82"
        sortable
        label="点播用户数">
      </el-table-column>
      <el-table-column
        property="playTimeSecond"
        min-width="82"
        sortable
        label="点播时长">
        <template slot-scope="scope">
          {{scope.row.playTimeSecond}}（时）
        </template>
      </el-table-column>
      <el-table-column
        property="perPlayTime"
        min-width="95"
        sortable
        label="人均播放时长">
        <template slot-scope="scope">
          {{scope.row.perPlayTime}}（分）
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "pa-pages-table",
    props: ["tableData","height"],
    components: {

    },
    data () {
      return {

      }
    },
    computed: {
      tableSource () {
        return this.tableData;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
