<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableData"
      border
      stripe
      :max-height="tableHeight"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="partName"
        min-width="100"
        label="分区别名">
      </el-table-column>
      <el-table-column
        property="cliNum"
        min-width="70"
        sortable
        label="点击量">
      </el-table-column>
      <el-table-column
        property="cliUserNum"
        min-width="70"
        sortable
        label="点击人数">
      </el-table-column>
      <el-table-column
        property="playUserNum"
        min-width="82"
        sortable
        label="点播用户数">
      </el-table-column>
      <el-table-column
        property="playTimeSecond"
        min-width="82"
        sortable
        label="点播时长">
        <template slot-scope="scope">
          {{scope.row.playTimeSecond}}（时）
        </template>
      </el-table-column>
      <el-table-column
        property="perPlayTime"
        min-width="95"
        sortable
        label="人均播放时长">
        <template slot-scope="scope">
          {{scope.row.perPlayTime}}（分）
        </template>
      </el-table-column>
      <el-table-column
        min-width="80"
        label="历史趋势">
        <template slot-scope="scope">
          <el-button @click="viewDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "pa-pages-table",
    props: ["tableData", "searchForm", "searchHeight","pageList"],
    components: {

    },
    data () {
      return {
        tableHeight: 300,
      }
    },
    computed: {

    },
    created  () {
      let that = this;
      let state = false;
      if (document.body.clientWidth<=800){
        state=true;
      }else {
        state=false;
      }
      that.tableHeight = document.body.clientHeight - (state===true ? 150 : 330);
    },
    mounted () {
    },
    methods: {
      viewDetail (obj) {
        let that = this;

        that.$router.push({
          name: "paOperateDetail",
          params: {
            startDate: that.searchForm.startDate,
            endDate: that.searchForm.endDate,
            pageId: that.searchForm.pageId,
            chosed_node: that.searchForm.sNodeCode,
            chosed_area: that.searchForm.sProvinceCode,
            chosed_project: that.searchForm.sProjectCode,
            pageList: that.tableData,
            pageIdList: that.pageList,
            partId: obj.partId,
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
