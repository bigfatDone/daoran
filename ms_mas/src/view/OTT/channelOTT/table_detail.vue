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
        property="node"
        min-width="80"
        sortable
        label="渠道来源">
      </el-table-column>
      <el-table-column
        property="activeUser"
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
          {{Number(scope.row.newUserRate)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="newMember"
        min-width="82"
        sortable
        label="新增会员数">
      </el-table-column>
      <el-table-column
        property="newMenberRate"
        min-width="82"
        sortable
        label="新增会员转化率">
        <template slot-scope="scope">
          {{Number(scope.row.newMenberRate)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="newVip"
        min-width="82"
        sortable
        label="新增VIP数">
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
        property="startNum"
        min-width="82"
        sortable
        label="人均启动次数">
        <template slot-scope="scope">
          {{Number(scope.row.startNum)}}
        </template>
      </el-table-column>
      <el-table-column
        property="useTime"
        min-width="95"
        sortable
        label="单次使用时间">
        <template slot-scope="scope">
          {{Number(scope.row.useTime)}}分
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "channelOTT-table-detail",
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
        let url = "/ms_bas/ott/channel/downloadExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&json="+that.search_form.json+"&type=1";
        window.open(url);
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
