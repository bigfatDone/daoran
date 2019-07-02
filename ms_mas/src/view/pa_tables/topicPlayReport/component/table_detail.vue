<template>
  <div>
    <div>
      <div class="albumName">{{titleName}}</div>
      <el-form label-width="80px" class="search">
        <el-form-item label="搜索：">
          <el-input v-model="search" placeholder="请输入搜索内容"></el-input>
        </el-form-item>
      </el-form>
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
    </div>

    <el-table
      ref="pa_page_tables"
      :data="tables"
      border
      stripe
      :max-height="height"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="code"
        min-width="82"
        label="资源编码">
      </el-table-column>
      <el-table-column
        property="name"
        min-width="82"
        label="单曲名称">
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
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "detail-table",
    props: ["tableData","titleName","search_form"],
    components: {

    },
    data () {
      return {
        height: "",
        search:"",
      }
    },
    computed: {
      // 模糊搜索
      tables () {
        const search = this.search;
        if (search) {
          return this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData;
      }
    },
    mounted () {
    },
    created () {
      let that = this;
      that.height=document.body.clientHeight - 380;
    },
    methods: {
      downloadTable(){
        let that = this;
        let url = "/ms_bas/topicPlayReport/toDetailExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&sNodeCode="+that.search_form.sNodeCode+"&sProvinceCode="+that.search_form.sProvinceCode+"&sProjectCode="+that.search_form.sProjectCode +"&code="+that.search_form.code;
        window.open(url);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 0 12px;
  }
  .pagination-box{
    padding: 1rem 0;
    text-align: center;
  }
  .albumName, .search{
    display: inline-block;
  }
  .albumName{
    font-size: .8rem;
    font-weight: 500;
    color: #3a8ee6;
  }
</style>
