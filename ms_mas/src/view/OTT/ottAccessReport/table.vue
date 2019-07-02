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
        <template slot-scope="scope">
          <p @click="jumpDetail(scope.row.ctime)" :class="{ active: showActive === 2}">{{scope.row.ctime}}</p>
        </template>
      </el-table-column>
      <el-table-column
        property="accessUser"
        min-width="80"
        sortable
        label="访问用户数">
      </el-table-column>
      <el-table-column
        property="newUserRate"
        min-width="82"
        sortable
        label="新增用户活跃率">
        <template slot-scope="scope">
          <p>{{Number(scope.row.newUserRate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="weekRate"
        min-width="82"
        sortable
        label="周活跃率"
        v-if="showActive === 2"
      >
        <template slot-scope="scope">
          <p>{{Number(scope.row.weekRate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="monthRate"
        min-width="82"
        sortable
        label="月活跃率"
        v-if="showActive === 3"
      >
        <template slot-scope="scope">
          <p>{{Number(scope.row.monthRate)}}%</p>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="活跃率分析报表详情"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <table-detail :detailData="detailData" :dialogVisible="dialogVisible"></table-detail>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import tableDetail from './table-detail'
  export default {
    name: "ottAccessReport-table",
    props: ["tableData","loading","height","showActive","searchResultData"],
    components: {
      tableDetail
    },
    data () {
      return {
        dialogVisible: false,
        detailData: []
      }
    },
    computed: {
    },
    watch: {
//      showActive: val => {
//        console.log(val);
//      }
    },
    mounted () {
    },
    methods: {
      jumpDetail(val) {
        let that = this;
        if (this.showActive === 2) {
//          const dateStart = val.slice(0,val.indexOf('至'));
//          console.log(dateStart)
//          const setdate = new Date(dateStart);// 选中开始时间
//          let endDate=that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24 * 6),"yyyy-MM-dd");
//          this.detailData.product = this.searchData.product;
//          this.detailData.itemCode = this.searchData.itemCode;
//          this.detailData.startDate = dateStart;
//          this.detailData.endDate = endDate;
//          this.detailData.dateType = 'daily';
//          this.dialogVisible = true;
          const setdate = new Date(val);// 选中开始时间
          let endDate=that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24 * 6),"yyyy-MM-dd");
          this.detailData.product = this.searchResultData.product;
          this.detailData.itemCode = this.searchResultData.itemCode;
          this.detailData.startDate = val;
          this.detailData.endDate = endDate;
          this.detailData.dateType = 'daily';
          this.dialogVisible = true;
        }
      },
      handleClose() {
        this.dialogVisible = false;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .active {
    color: #409EFF;
    cursor: pointer;
  }
</style>
