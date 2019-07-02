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
      @searchForm="getSearchForm($event)"
      @loadingTable="loadingTableReturn($event)"
      @loadingImg="loadingImgReturn($event)"
      :search-type="searchType"></v-search>

    <el-collapse-transition>
      <div v-show="chartVisble">
        <v-chart
          v-loading="loadingImg"
          :selectbars="selectbars"
          :img-data="imgData"
          :img-data-state="imgDataState"
          @chartTypeChange="chartTypeChange">
        </v-chart>
      </div>
    </el-collapse-transition>

    <div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow"><i class="el-icon-caret-top"></i> </div>
    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table
        :height="height"
        :table-data="tableData"
        :loading="loadingTable"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  import vChart from "@/view/component/highcharts/chart_index"
  export default {
    name: "orderOffRate",
    components: {
      vSearch, vTable,vChart
    },
    data () {
      return {
        tableData: [],
        imgData: {
          name:[],
          xAxis:[],
          data:[],
        },
        selectbars:[ //切换按钮
          {text:'退订率时间走势图',tooltip:'存量访问用户数/存量用户数',status:true,code:'offRate',chartType:'spline',yPlus:'%'},
          {text:'退订率柱状对比图',tooltip:'存量点播用户数/存量用户数',status:false,code:'offRate_column',chartType:'column',yPlus:'%'},
          {text:'用户平均在网时长柱状图',tooltip:'存量用户点播时长/存量点播用户数',status:false,code:'onTimeAvg',chartType:'column',yPlus:'天'},
          {text:'用户在网时长饼状分布图',tooltip:'存量用户点播时长/存量点播用户数',status:false,code:'pie',chartType:'pie',yPlus:'%'},
        ],
        searchType:{},
        imgDataState:false,
        loadingImg:false,
        loadingTable:true,

        search_form: [],
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
      this.changeTableImg();
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
      getSearchForm(data){
        let that = this;
        that.search_form = data;
      },
      downloadTable(){
        let that = this;
        let url = "/ms_bas/orderOffRate/toExcel.do?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&sNodeCode="+that.search_form.sNodeCode+"&sProvinceCode="+that.search_form.sProvinceCode+"&sProjectCode="+that.search_form.sProjectCode;
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
