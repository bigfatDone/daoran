<template>
  <div class="pa-pages-table">
    <el-table
      ref="ubporder_table1"
      :data="tableData"
      border
      stripe
      :max-height="tableHeight"
      v-loading="loading"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="uploadTime"
        min-width="83"
        sortable
        label="统计日期">
      </el-table-column>
      <el-table-column
        property="sNodeName"
        min-width="80"
        label="项目">
      </el-table-column>
      <el-table-column
        property="sProvinceName"
        min-width="100"
        label="区域">
      </el-table-column>
      <el-table-column
        property="sProjectName"
        min-width="82"
        label="产品">
      </el-table-column>
      <el-table-column
        property="unicomRetainedUsers"
        min-width="113"
        sortable
        label="留存用户数(局方)">
      </el-table-column>
      <el-table-column
        property="retainUsers"
        min-width="113"
        sortable
        label="留存用户数(内部)">
      </el-table-column>
      <el-table-column
        property="retaindiffer"
        min-width="105"
        sortable
        label="留存用户数误差">
        <template slot-scope="scope">
          {{Number(scope.row.retaindiffer).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="unicomSuccessOrders"
        min-width="113"
        sortable
        label="订购成功数(局方)">
      </el-table-column>
      <el-table-column
        property="successOrders"
        min-width="113"
        sortable
        label="订购成功数(内部)">
      </el-table-column>
      <el-table-column
        property="successdiffer"
        min-width="105"
        sortable
        label="订购成功数误差">
        <template slot-scope="scope">
          {{Number(scope.row.successdiffer).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="unicomOffOrders"
        min-width="113"
        sortable
        label="退订用户数(局方)">
      </el-table-column>
      <el-table-column
        property="offOrders"
        min-width="113"
        sortable
        label="退订用户数(内部)">
      </el-table-column>
      <el-table-column
        property="offdiffer"
        min-width="105"
        sortable
        label="退订用户数误差">
        <template slot-scope="scope">
          {{Number(scope.row.offdiffer).toFixed(2)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "uploadView-table",
    props: ["tableData","searchDatas","loading"],
    components: {

    },
    data () {
      return {
        tableHeight:'500'
      }
    },
    computed: {
    },
    mounted () {

    },
    created () {
      this.getBodyHeight();
    },
    methods: {
      getBodyHeight () {
        let that = this;
        let state = false;
        if (document.body.clientWidth<=800){
          state=true;
        }else {
          state=false;
        }
        that.tableHeight = document.body.clientHeight - (state===true ? 150 : 300);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding-bottom: 12px;
  }
</style>
