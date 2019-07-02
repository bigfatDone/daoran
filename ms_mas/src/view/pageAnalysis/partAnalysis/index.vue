<template>
  <div class="pages">
    <a-search @searchResult="searchResult"></a-search>
    <div style="padding: 10px 0;">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table :height="height" :searchData="search_form" :table-data="tableData" :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import aSearch from "./search"
  import vTable from "./table"

  export default {
    name: "partAnalysis",
    components: {
      aSearch,vTable
    },
    data () {
      return{
        search_form:{},
        loading:false,
        tableData:[],
        height:'500',
      }
    },
    computed: {

    },
    created () {
      const that = this;
      if (document.body.clientWidth > 800){
        that.height='500';
      }else {
        that.height=document.body.clientHeight - 170;
      }
    },
    mounted () {
    },
    methods:{
      searchResult(data){
        this.loading = data.loading;
        this.tableData = data.tableData;
        this.search_form = data.search_form;
     console.log(this.search_form);
        /*        this.loading = true;
                const that = this;
                that.search_form = data;
                let parms = {
                  startDate : data.startDate,
                  endDate : data.endDate,
                  json : data.json,
                  type : data.type,
                  product : data.product,
                  pageCode : data.pageValue,
                  zoneCode : data.zoneCode,
                };
                this.$ajax({
                  url: '/ms_bas/page/report/getPartTable',
                  data: parms,
                  method: "post",
                  success: function (res) {
                    if(res.data.status){
                      that.loading = false;
                      that.tableData = res.data.data;
                    }
                  },
                  error: function (err) {
                    that.$message.error('表格请求失败，请刷新页面');
                  }
                });*/
      },
      downloadTable() {
        const that = this;
        let url = "/ms_bas/page/report/toPartExcel?startDate="+that.search_form.startDate +"&endDate="+ that.search_form.endDate
          +"&json="+that.search_form.json + "&type=" + that.search_form.type + "&product=" + that.search_form.product + "&pageCode=" + that.search_form.pageValue + "&zoneCode=" + that.search_form.zoneCode ;
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
