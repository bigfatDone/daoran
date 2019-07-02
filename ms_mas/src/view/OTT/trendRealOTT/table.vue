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
        label="时间">
      </el-table-column>
      <!--<el-table-column-->
        <!--property="accessUser"-->
        <!--min-width="80"-->
        <!--sortable-->
        <!--label="访问用户数">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--property="startNum"-->
        <!--min-width="82"-->
        <!--sortable-->
        <!--label="启动次数">-->
      <!--</el-table-column>-->
      <el-table-column
        property="playNum"
        min-width="82"
        sortable
        label="点播次数">
      </el-table-column>
      <el-table-column
        property="playUserNum"
        min-width="105"
        sortable
        label="点播用户数">
      </el-table-column>
      <!--<el-table-column-->
        <!--property="newMember"-->
        <!--min-width="82"-->
        <!--sortable-->
        <!--label="新增会员数">-->
      <!--</el-table-column>-->
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
      <!--<el-table-column-->
        <!--property="orderRate"-->
        <!--min-width="82"-->
        <!--sortable-->
        <!--label="订购转化率">-->
        <!--<template slot-scope="scope">-->
          <!--{{Number(scope.row.orderRate)}}%-->
        <!--</template>-->
      <!--</el-table-column>-->
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
