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
        property="project"
        min-width="80"
        label="产品">
      </el-table-column>
      <el-table-column
        property="accessUser"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="newUser"
        min-width="82"
        sortable
        label="新增用户数">
      </el-table-column>
      <el-table-column
        property="newUserRate"
        min-width="105"
        sortable
        label="新增用户活跃率">
        <template slot-scope="scope">
          <p>{{Number(scope.row.newUserRate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="newMember"
        min-width="82"
        sortable
        label="新增会员数">
      </el-table-column>
      <el-table-column
        property="newMemberRate"
        min-width="82"
        sortable
        label="新增会员转化率">
        <template slot-scope="scope">
          <p>{{Number(scope.row.newMemberRate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="newVip"
        min-width="82"
        sortable
        label="新增VIP数">
      </el-table-column>
      <el-table-column
        property="orderSuccessNum"
        min-width="82"
        sortable
        label="订购成功数">
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
        property="priceSale"
        min-width="82"
        sortable
        label="收入流水">
      </el-table-column>
      <el-table-column
        property="playUserNum"
        min-width="82"
        sortable
        label="点播用户数">
      </el-table-column>
      <el-table-column
        property="playNum"
        min-width="82"
        sortable
        label="点播次数">
      </el-table-column>
      <el-table-column
        property="playTime"
        min-width="88"
        sortable
        label="点播时长(分)">
        <template slot-scope="scope">
          {{Number(scope.row.playTime)}}&nbsp;
        </template>
      </el-table-column>
      <el-table-column
        property="userPlayNum"
        min-width="82"
        sortable
        label="人均点播次数">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "trendOTT-table",
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
