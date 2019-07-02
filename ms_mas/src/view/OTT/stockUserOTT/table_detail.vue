<template>
  <div class="pa-pages-table">
    <el-button-group class="downloadTable">
      <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
    </el-button-group>
    <el-table
      ref="pa_page_tables"
      :data="tableData"
      border
      stripe
      :max-height="height"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="ctime"
        min-width="100"
        sortable
        label="日期">
      </el-table-column>
      <el-table-column
        property="productCode"
        min-width="80"
        sortable
        label="订购月份">
      </el-table-column>
      <el-table-column
        property="accessNum"
        min-width="82"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="orderNum"
        min-width="82"
        sortable
        label="订购发起数">
      </el-table-column>
      <el-table-column
        property="orderSuccessNum"
        min-width="82"
        sortable
        label="订购成功数">
      </el-table-column>
      <el-table-column
        property="orderFailNum"
        min-width="82"
        sortable
        label="订购失败数">
      </el-table-column>
      <el-table-column
        property="orderSuccessRate"
        min-width="82"
        sortable
        label="成功订购率">
        <template slot-scope="scope">
          {{Number(scope.row.orderSuccessRate)}}%
        </template>
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
        property="repeatRate"
        min-width="82"
        sortable
        label="复购率">
        <template slot-scope="scope">
          {{Number(scope.row.repeatRate)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "orderOTT-table-detail",
    props: ["tableData","search_form"],
    components: {

    },
    data () {
      return {
        height:""
      }
    },
    created () {
      let that = this;
      that.height=document.body.clientHeight - 170;
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      downloadTable(){//详情下载
        let that = this;
        let url = "/ms_bas/ott/order/toExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&json="+that.search_form.json+"&detail=true";
        window.open(encodeURI(url));
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
</style>
