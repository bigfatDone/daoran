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
        property="date"
        min-width="100"
        sortable
        label="日期">
      </el-table-column>
      <el-table-column
        property="memberNum"
        min-width="80"
        sortable
        label="会员总数">
      </el-table-column>
      <el-table-column
        property="vipNum"
        min-width="82"
        sortable
        label="VIP总数">
      </el-table-column>
      <el-table-column
        property="newAddMemberNum"
        min-width="82"
        sortable
        label="新增会员数">
      </el-table-column>
      <el-table-column
        property="newAddVipNum"
        min-width="105"
        sortable
        label="新增VIP数">
      </el-table-column>
      <el-table-column
        property="activeUser"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="newMemberProportion"
        min-width="82"
        sortable
        label="新增会员活跃占比">
        <template slot-scope="scope">
          {{Number(scope.row.newMemberProportion)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="newVipProportion"
        min-width="82"
        sortable
        label="新增VIP活跃占比">
        <template slot-scope="scope">
          {{Number(scope.row.newVipProportion)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "memberOTT-table",
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
