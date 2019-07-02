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
      style="width: 100%">
      <el-table-column
        property="name"
        min-width="82"
        label="专题名称">
      </el-table-column>
      <el-table-column
        property="alias"
        min-width="120"
        label="专辑/节目单名称">
      </el-table-column>
      <el-table-column
        property="playUserNum"
        sortable
        min-width="82"
        label="点击人数">
      </el-table-column>
        <el-table-column
          property="playNum"
          sortable
          min-width="82"
          label="点击次数">
      </el-table-column>
      <el-table-column
        property="validPlayUserNum"
        sortable
        min-width="82"
        label="点播人数">
      </el-table-column>
      <el-table-column
        property="validPlayNum"
        sortable
        min-width="82"
        label="点播次数">
      </el-table-column>
      <el-table-column
        property="playTimeTotal"
        sortable
        min-width="82"
        label="点播时长（时）">
        <template slot-scope="scope">
          {{scope.row.playTimeTotal}}时
        </template>
      </el-table-column>
      <el-table-column
        property="userAvgTime"
        sortable
        min-width="82"
        label="人均点播时长（分）">
        <template slot-scope="scope">
          {{scope.row.userAvgTime}}分
        </template>
      </el-table-column>
      <el-table-column
        property=""
        min-width="82"
        label="详情查看">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="summaryImg(scope.row)"
            v-if="scope.row.summary">查看趋势</el-button>
          <el-button
            type="text"
            @click="detail(scope.row)"
            v-if="scope.row.detail">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "top-table",
    props: ["tableData"],
    components: {

    },
    data () {
      return {
        height: "",
      }
    },
    computed: {
    },
    mounted () {
      const that = this;
      window.onresize = () => {
        return (() => {
          if (document.body.clientWidth > 800){
            that.height=document.body.clientHeight - 220;
          }else {
            that.height=document.body.clientHeight - 80;
          }
        })()
      }
    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.height=document.body.clientHeight - 220;
      }else {
        that.height=document.body.clientHeight - 80;
      }
    },
    methods: {
      detail(row){
        let that = this;
        that.$emit("detail", row);
      },
      summaryImg(row){
        let that = this;
        that.$emit("summaryImg", row);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pagination-box{
    padding: 1rem 0;
    text-align: center;
  }
</style>
