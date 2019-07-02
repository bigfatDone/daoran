<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns {  display: inline-block;  vertical-align: top;  padding: .3rem 0;  }
  #cover{  position: fixed;  top: 0;  right: 0;  bottom: 0;  left: 0;  background-color: rgba(0,0,0,.3);  display:block;  z-Index:999;  }
  #modal{  position:absolute;  width:96%;  height:100%;  min-height: 1100px;  top:3%;  left:2%;  background-color:#fff;  display:block;  cursor:pointer;  z-Index:9999;  }
  .el-icon-circle-close{position: absolute; right: 15px;top: 15px;}
  .selection{  display: inline-block;  position: relative;  width: 180px;  padding-left: 35px; margin: 8px 0 8px 14px;  }
</style>
<template>
  <div class="pages">
    <v-search @toParent="getSon"></v-search>
    <div class="selection">
      <div class="btns">
        <el-button @click="searchChart" type="primary" icon="el-icon-search">查看图表</el-button>
      </div>
    </div>
    <div class="selection">
      <div class="btns">
        <el-button @click="downloadTable" type="primary" icon="el-icon-download">下载Excel</el-button>
      </div>
    </div>
    <el-table v-loading="loading" ref="pa_page_tables" :data="tableData" border stripe cell-class-name="text-center" header-cell-class-name="text-center" style="width: 100%">
      <el-table-column property="ctime" min-width="100" label="日期"></el-table-column>
      <el-table-column property="pageName" min-width="100" label="页面名称"></el-table-column>
      <el-table-column property="accessNum" min-width="100" label="访问次数"></el-table-column>
      <el-table-column property="accessNumRate" min-width="100" label="访问次数占比">
        <template slot-scope="scope">
          {{Number(scope.row.accessNumRate)}}%
        </template>
      </el-table-column>
      <el-table-column property="accessUser" min-width="100" label="访问用户数"></el-table-column>
      <el-table-column property="accessUserRate" min-width="100" label="访问用户数占比">
        <template slot-scope="scope">
          {{Number(scope.row.accessUserRate)}}%
        </template>
      </el-table-column>
      <el-table-column  min-width="100" label="查看页面点击行为">
        <template slot-scope="scope">
          <el-button @click="searchPage(scope.row.pageCode)" type="primary">点击查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="HideChart">
      <div id="cover"></div>
      <div id="modal">
        <div class="chart-btns">
          <el-button @click="down" icon="el-icon-download">导出图片</el-button>
        </div>
        <div id="Pagechart" style="min-height: 1000px;"></div>
        <el-button @click="closeChart" class="el-icon-circle-close"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import vSearch from "../commonSearch.vue"
  export default {
    name: "pageAnalysis",
    components: {
      vSearch,
    },
    data () {
      return {
        searchParam: {},
        url:{table: '/ms_bas/page/report/getTable'},
        tableData:[],
        chartForm: null,
        HideChart:false,
        loading:false
      }
    },
    methods: {
      getSon(searchParam) {
        this.loading = true;
        const that = this;
        that.searchParam = searchParam;
        this.$ajax({
          url: that.url.table,
          data: searchParam,
          method: "post",
          success: function (res) {
            if(res.status === 200) {
              that.loading = false;
              that.tableData = res.data.data;
              that.chart(res.data.data);
            }
          },
          error: function (err) {
         //   that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      chart(data) {
        let chartY = [];
        let accessNum = [];
        let accessUser = [];
        for (let i = 0; i<data.length; i++) {
          chartY.push(data[i].pageName);
          accessNum.push(data[i].accessNum);
          accessUser.push(data[i].accessUser);
        }
        this.chartForm = this.$Highcharts.chart('Pagechart', {
          chart: {
            type: 'bar',
            marginRight: 130,
            marginBottom: 55
          },
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories: chartY,
            title: {
              text: null
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: '',
              align: 'high'
            },
            labels: {
              overflow: 'justify'
            },
          },
          tooltip: {
            valueSuffix: ' 次'
          },
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true,
                allowOverlap: true // 允许数据标签重叠
              }
            }
          },
          credits: {
            enabled: false,
          },
          exporting: { enabled: false },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            shadow: true,
          },
          series: [{
            name: '访问次数',
            data: accessNum
          }, {
            name: '访问用户数',
            data: accessUser
          }]
        });
      },
      searchChart() {
        this.HideChart = true;
      },
      closeChart() {
        this.HideChart = false;
      },
      downloadTable() {
        const that = this;
        let url = "/ms_bas/page/report/toPageExcel?startDate="+that.searchParam.startDate +"&endDate="+that.searchParam.endDate
          +"&json="+that.searchParam.json+"&type="+that.searchParam.type+"&product="+that.searchParam.product;
        window.open(encodeURI(url));
      },
      searchPage(code) {
        const that = this;
        this.searchParam.pageCode = code;
        this.$router.push({
          name: 'zoneAnalysis',
          params: {
         //   pageCode: code,
            searchParam: that.searchParam
          }
        });
        const obj = {
          active: false,
          name: "zoneAnalysis",
          path: "zoneAnalysis",
          text: "区域分析"
        };
        that.$store.commit('addRecord', obj);
        that.$store.commit('changeActiveMenu', obj);
      },
      down() {
        let that = this;
        that.chartForm.exportChart({
          type: 'image/jpeg',
          filename: 'chart'
        });
      },
    },
  }
</script>


