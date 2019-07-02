<template>
  <div class="pages">
    <v-search
      @search="getResult($event)"
      @updataLoading="toLoading($event)"
      @getTotal="getTotal($event)"
      @resetPage="resetPage($event)"
      @getSelectForm="getSelectForm($event)"
    ref="setCurrent"></v-search>
    <div style="padding: 10px 0;">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table :tableImg="tableData" :loading="loading"></v-table>
    </div>
    <div style="padding: 10px 0;text-align: center;" v-show="!loading">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        @size-change="sizeChange"
        :current-page.sync="currentPage"
        layout="total, sizes, prev, pager, next"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  export default {
    name: 'realTimeOrder',
    components: {
      vSearch, vTable
    },
    data () {
      return {
        tableData: [],
        loading: true,
        totalPage: 100,
        currentPage: 1,
        pageSize: 10,
        selectData:{}
      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
//    当前分页页数改变
      sizeChange(size) {
//        console.log(size)
        this.$refs.setCurrent.setageSize(size);
      },
        // 当前页数改变
      handleCurrentChange(val) {
        this.$refs.setCurrent.setCurrentPage(val);
      },
      // 获取总页数
      getTotal(val) {
          this.totalPage = val;
      },
      // 初始化页数
      resetPage(val) {
          this.currentPage = val;
      },
      getResult (data) {
        let that = this;
        that.tableData = data;
        that.loading = false;
      },
      toLoading(data) {
          this.loading = data;
      },
      // 获取表单数据
      getSelectForm(data) {
          this.selectData = data;
          console.log(this.selectData)
      },
      downloadTable(){ // 汇总下载
        let that = this;
        let url = "/ms_bas/crm/realtimeorder/toExcel?startDate="+that.selectData.startDate +"&endDate="+ that.selectData.endDate
          + "&node="+that.selectData.node + "&product=" + that.selectData.product + "&province=" + that.selectData.province
          + "&productCode=" + that.selectData.productCode+ "&orderResult=" + that.selectData.orderResult+ "&triggerType=" + that.selectData.triggerType
         + "&source=" + that.selectData.source + "&pn=" + that.currentPage;
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
