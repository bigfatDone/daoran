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
        property="project"
        min-width="80"
        label="产品">
      </el-table-column>
      <el-table-column
        property="val"
        min-width="82"
        label="反馈次数">
      </el-table-column>
      <el-table-column
        property="userNum"
        min-width="82"
        sortable
        label="反馈用户数">
      </el-table-column>
      <el-table-column
        property="text"
        min-width="105"
        sortable
        label="问题">
      </el-table-column>
      <el-table-column
        property="userTypeStr"
        min-width="82"
        sortable
        label="用户类型">
      </el-table-column>
      <el-table-column
        property="avgVal"
        min-width="82"
        sortable
        label="人均反馈次数">
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
