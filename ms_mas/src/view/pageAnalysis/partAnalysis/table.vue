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
        property="zoneName"
        min-width="80"
        label="所属区域">
      </el-table-column>
      <el-table-column
        property="partName"
        min-width="82"
        label="运营位">
      </el-table-column>
      <el-table-column
        property="clickNum"
        min-width="82"
        sortable
        label="点击次数">
      </el-table-column>
      <el-table-column
        property="clickUser"
        min-width="105"
        sortable
        label="点击用户数">
      </el-table-column>
      <el-table-column
        property="playNum"
        min-width="82"
        sortable
        label="点播次数">
      </el-table-column>
      <el-table-column
        property="playUser"
        min-width="82"
        sortable
        label="点播用户数">
      </el-table-column>
      <el-table-column
        property="playTime"
        min-width="82"
        sortable
        label="点播时长(分)">
        <template slot-scope="scope">
          {{Number(scope.row.playTime)}}
        </template>
      </el-table-column>
      <el-table-column
        property="avgPlayTime"
        min-width="82"
        sortable
        label="人均点播时长(分)">
        <template slot-scope="scope">
          {{Number(scope.row.avgPlayTime)}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "distance-table",
    props: ["tableData","loading","height","searchData"],
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
