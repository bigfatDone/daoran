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
        property="accessUser"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="playUser"
        min-width="82"
        sortable
        label="点播用户数">
      </el-table-column>
      <el-table-column
        min-width="82"
        sortable
        label="访问点播率">
        <template slot-scope="scope">
          <p>{{Number(scope.row.accessPlayRate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="playAmount"
        min-width="82"
        sortable
        label="点播次数">
      </el-table-column>
      <el-table-column
        property="avgPlayAmount"
        min-width="82"
        sortable
        label="人均点播次数">
      </el-table-column>
      <el-table-column
        property="avgTime"
        min-width="82"
        sortable
        label="人均点播时长（分）">
      </el-table-column>
      <el-table-column
        property="oldUserAvgPlayAmount"
        min-width="82"
        sortable
        label="老用户人均点播次数">
      </el-table-column>
      <el-table-column
        property="oldUserAvgPlayTime"
        min-width="82"
        sortable
        label="老用户人均点播时长（分）">
      </el-table-column>
      <el-table-column
        property="newUserAvgPlayAmount"
        min-width="82"
        sortable
        label="新用户人均点播次数">
      </el-table-column>
      <el-table-column
        property="newUserAvgTime"
        min-width="82"
        sortable
        label="新用户人均点播时长（分）">
      </el-table-column>
      <el-table-column
        property="vipavgPlayAmount"
        min-width="82"
        sortable
        label="vip人均点播次数">
      </el-table-column>
      <el-table-column
        property="vipavgPlayTime"
        min-width="82"
        sortable
        label="vip人均点播时长（分）">
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
