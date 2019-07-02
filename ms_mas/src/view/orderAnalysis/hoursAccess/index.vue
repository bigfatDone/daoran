<template>
  <div class="pages">
    <el-radio-group
      v-model="checkTableImg"
      @change="changeTableImg"
      class="checkTableImg"
      size="mini">
      <el-radio-button label="table">表</el-radio-button>
      <el-radio-button label="img">图</el-radio-button>
    </el-radio-group>
    <v-search
      @search="getResult($event)"
      @searchImg="getResultImg($event)"
      @loadingTable="loadingTableReturn($event)"
      @loadingImg="loadingImgReturn($event)"
      @searchForm="getSearchForm($event)"
      :search-type="searchType"></v-search>

    <el-collapse-transition>
      <div class="chart-box" v-show="chartVisble">
        <v-chart
          v-loading="loadingImg"
          :selectbars="selectbars"
          :img-data="imgData"
          :img-data-state="imgDataState"
          @chartTypeChange="chartTypeChange">
        </v-chart>
      </div>
    </el-collapse-transition>
    <div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]"><i class="el-icon-caret-top" @click="chartHideShow"></i> </div>

    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table :table-data="tableData" :loading="loadingTable" :height="height"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  import vChart from "@/view/component/highcharts/chart_index"
  export default {
    name: "hoursAccess",
    components: {
      vSearch, vTable,vChart
    },
    data () {
      return {
        tableData: [],
        search_form: [],
        imgData: {
          name:[],
          xAxis:[],
          data:[],
          color:[]
        },
        selectbars:[ //切换按钮
          {text:'订购发起次数',tooltip:'统计周期内，订购发起（最后一层订购）用户数之和',status:false,code:'iOTotal',chartType:'spline',yPlus:''},
          {text:'订购成功数',tooltip:'统计周期内，订购成功用户数之和',status:true,code:'iOSuccessTotal',chartType:'spline',yPlus:''},
          {text:'访问用户数',tooltip:'统计周期内，访问人数之和',status:false,code:'iAUTotal',chartType:'spline',yPlus:''},
          {text:'非包月访问用户数',tooltip:'统计周期内，不存在包月续包产品订购关系（含统计周期内订购成功）的访问用户数之和',status:false,code:'iANotMonthlyUTotal',chartType:'spline',yPlus:''},
          {text:'订购转化率',tooltip:'订购成功数/访问用户数',status:false,code:'iTRate',chartType:'spline',yPlus:'%'},
        ],
        searchType:{},
        imgDataState:false,
        loadingTable:true,
        loadingImg:true,

        checkTableImg:'table',
        chartVisble:true,
        tableVisble:true,
        chartShowState:false,
        height:'500',
      }
    },
    computed: {
    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.height='500';
      }else {
        that.height=document.body.clientHeight - 170;
      }
    },
    mounted () {
      this.changeTableImg()
    },
    methods: {
      getResult (data) {
        let that = this;
        that.tableData = data;
      },
      getResultImg (data) {
        let that = this;
        that.imgData = data;
        that.imgDataState = !that.imgDataState;
      },
      chartTypeChange(data){
        let that = this;
        that.searchType = data;
      },
      loadingTableReturn(state){
        let that = this;
        that.loadingTable = state;
      },
      loadingImgReturn(state){
        let that = this;
        that.loadingImg = state;
      },
      changeTableImg(){
        let that = this;
        if (document.body.clientWidth > 800){
          that.chartVisble=true;
          that.tableVisble=true;
        }else {
          if (that.checkTableImg === 'table'){
            that.chartVisble=false;
            that.tableVisble=true;
          }else {
            that.chartVisble=true;
            that.tableVisble=false;
          }
        }
      },
      chartHideShow(){
        let that = this;
        that.chartVisble= !that.chartVisble;
        that.chartShowState= !that.chartShowState;
        if (that.chartVisble === true){
          that.height='500';
        }else {
          that.height=document.body.clientHeight - 320;
        }
      },
      downloadTable(){
        let that = this;
        let url = '/ms_bas/hoursAccess/downloadExcel?startDate='+that.search_form.startDate +'&endDate='+that.search_form.endDate
          +'&sNodeCode='+that.search_form.sNodeCode+'&sProvinceCode='+that.search_form.sProvinceCode+'&sProjectCode='+that.search_form.sProjectCode;
        window.open(url);
      },
      getSearchForm(data){
        let that = this;
        that.search_form = data;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
</style>
