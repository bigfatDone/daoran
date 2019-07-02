<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableData"
      height="500"
      border
      stripe
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
          <p>{{scope.row.ctime}}</p>
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
      <!--<el-table-column-->
        <!--property="weekRate"-->
        <!--min-width="82"-->
        <!--sortable-->
        <!--label="周活跃率"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<p>{{Number(scope.row.weekRate)}}%</p>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--property="monthRate"-->
        <!--min-width="82"-->
        <!--sortable-->
        <!--label="月活跃率"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<p>{{Number(scope.row.monthRate)}}%</p>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "ottAccessReport-tableDetail",
    props: ["detailData","dialogVisible"],
    components: {
    },
    data () {
      return {
        searchData: {},
        tableData: [],
        loading: false
      }
    },
    computed: {
    },
    watch: {
      'dialogVisible': function (newVal) {
        if(newVal) {
          this.getTable();
        }
      }
    },
    mounted () {
      this.getTable()
    },
    methods: {
      //  获取表格数据
      getTable() {
        const  that = this;
        that.loading = true;
        that.$ajax({
          url: '/ms_bas/ott/activityRate/theme/getTable',
          data: that.detailData,
          method: 'post',
          success: function (res) {
            if( res.status) {
              that.tableData = res.data.data;
              that.loading = false;
            }else {
              that.$message.warning(res.data.msg)
            }
          },
          error: function (err) {
            that.$message.error('活跃率分析报表页面数据请求失败，请刷新活跃率分析报表页面')
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
