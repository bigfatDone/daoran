<template>
  <div>
    <div class="btnGroup">
      <el-button type="primary" icon="el-icon-download" size="mini" title="导出表格" circle @click="importOut"></el-button>
    </div>
    <el-row>
      <el-table
        border
        v-loading="tableDataLoading"
        :data="tableData"
        :height="TableHeight"
        style="width: 100%"
        empty-text="暂无数据">
        <el-table-column
          align="center"
          width="250"
          label="节点信息">
          <template slot-scope="scope">
            <p class="td" :title="scope.row.nodeName">{{scope.row.nodeName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="已注入">
          <template slot-scope="scope">
            <p class="td" :title="scope.row.afflux" :class="{'zero' : scope.row.afflux == 0}">{{scope.row.afflux}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="未注入">
          <template slot-scope="scope">
            <p class="td" :title="scope.row.NoAfflux" :class="{'zero' : scope.row.NoAfflux == 0}">{{scope.row.NoAfflux}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'collect-audio',
  components: {
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url: {
        getList : "/cms/api/play/getSummaryInfo.do",
      },
      tableDataLoading: false,
      tableData: [],
      TableHeight: 700,
    }
  },
  activated () {
    this.getList();
    this.Resize();
  },
  methods: {
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    responHeight () {
      let contain_height = document.body.offsetHeight;
      let static_height = 160;
      let result_height = parseInt(contain_height - static_height);
      if(result_height >= 250){
        this.TableHeight = Number(result_height);
      }else {
        this.TableHeight = 400;
      }
    },
    getList () {
      let that = this;
      let parmas = {jsonParam: JSON.stringify({resType: '1'})};
      that.tableDataLoading = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   res.data.data.forEach((item, index) => {
      //     item.NoAfflux = item.NoAfflux || 0;
      //     item.afflux = item.afflux || 0;
      //   });
      //   that.tableData = res.data.data;
      //   // that.responHeight();
      //   that.tableDataLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          res.data.data.forEach((item, index) => {
            item.NoAfflux = item.NoAfflux || 0;
            item.afflux = item.afflux || 0;
          });
          that.tableData = res.data.data;
          // that.responHeight();
          that.tableDataLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    importOut () {
      let that = this;
      let obj = {};

      let req = {
        resType:'1',
      }
      let params = {jsonParam: JSON.stringify(req)};
      let url = '/cms/api/play/exportTotalPlayExcel.do?resType=1';
      window.open(url);
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: "/cms/api/play/exportTotalPlayExcel.do",
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   //console.log(res);
      //   that.importOuting = false;
      //   if (res.data.success) {
      //     window.open(res.data.data.path);
      //   }else {
      //     that.$message({
      //       message: res.data.msg,
      //       type: 'warning'
      //     })
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // })

      // that.$ajax({
      //   url: "/cms/api/play/exportTotalPlayExcel.do",
      //   method: "post",
      //   data: this.Qs.stringify(params),
      //   success: function (res) {
      //     that.importOuting = false;
      //     if (res.data.success) {
      //       window.open(res.data.data.path);
      //     }else {
      //       that.$message({
      //         message: res.data.msg,
      //         type: 'warning'
      //       })
      //     }
      //   },
      //   error: function (error) {
      //     that.$message.error(error);
      //   }
      // });
    },
  }
}
</script>

<style scoped>
  .btnGroup{
    margin-bottom: 10px;
  }
  .zero{
    color: #ddd;
  }
</style>
