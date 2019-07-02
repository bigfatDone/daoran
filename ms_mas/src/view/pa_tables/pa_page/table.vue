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
        property="alias"
        min-width="100"
        label="页面别名">
      </el-table-column>
      <el-table-column
        property="iATotal"
        min-width="82"
        sortable
        label="访问用户量">
      </el-table-column>
      <el-table-column
        property="iAUTotal"
        min-width="82"
        sortable
        label="访问用户数">
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
    props: ["tableData", "searchForm", "sHeight"],
    components: {

    },
    data () {
      return {
        tableHeight: 260,
      }
    },
    computed: {

    },
    created () {
      let that = this;
      let state = false;
      if (document.body.clientWidth<=800){
        state=true;
      }else {
        state=false;
      }
      that.tableHeight = document.body.clientHeight - (state===true ? 150 : 300);
    },
    mounted () {

    },
    methods: {
      viewDetail (obj) {
        let that = this;

        that.$router.push({
          name: "paPageDetail",
          params: {
            startDate: that.searchForm.startDate,
            endDate: that.searchForm.endDate,
            pageId: obj.pageId,
            chosed_node: that.searchForm.sNodeCode,
            chosed_area: that.searchForm.sProvinceCode,
            chosed_project: that.searchForm.sProjectCode,
            pageList: that.tableData
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pa-pages-table{
    margin: 1rem 0 0 0;
  }
</style>
