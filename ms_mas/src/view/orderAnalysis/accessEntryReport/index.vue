<template>
  <div class="pages">
    <!--<el-radio-group-->
      <!--v-model="checkTableImg"-->
      <!--@change="changeTableImg"-->
      <!--class="checkTableImg"-->
      <!--size="mini">-->
      <!--<el-radio-button label="table">表</el-radio-button>-->
      <!--<el-radio-button label="img">图</el-radio-button>-->
    <!--</el-radio-group>-->

    <v-search
      @search="getResult($event)"
      @searchImg="getResultImg($event)"
      @searchForm="searchForm($event)"
      @loadingImg="loadingReturn($event)"
      @loadingTable="loadingTableReturn($event)"
      @trendState="trendStateResult($event)"
      :province-alone="province"
      :search-type="searchType"></v-search>

    <el-collapse-transition>
      <div class="chart-box" v-show="chartVisble">
        <v-chart
          v-loading="loadingImg"
          @chartTypeChange="chartTypeChange"
          @provinceChange="provinceChange"
          :selectbars="selectbars"
          :img-data="imgData"
          :loading-img="loadingImgDataState"
          :select-page-arr="searchFormData"
          :search-state="searchState"></v-chart>
      </div>
    </el-collapse-transition>
    <!--<div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]" v-show="chartVisble"><i class="el-icon-caret-top" @click="chartHideShow"></i> </div>-->

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
  import vChart from "./chart"
  export default {
    name: "accessEntryReport",
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
        selectbars:[
          {text:'订购发起次数',tooltip:'统计周期内，订购发起（最后一层订购）用户数之和',status:false,code:'iOTotal',chartType:'spline',yPlus:''},
          {text:'订购成功数',tooltip:'统计周期内，订购成功用户数之和',status:true,code:'iOSuccessTotal',chartType:'spline',yPlus:''},
          {text:'访问用户数',tooltip:'统计周期内，访问人数之和',status:false,code:'iAUTotal',chartType:'spline',yPlus:''},
          {text:'非包月访问用户数',tooltip:'统计周期内，不存在包月续包产品订购关系（含统计周期内订购成功）的访问用户数之和',status:false,code:'iANotMonthlyUTotal',chartType:'spline',yPlus:''},
          {text:'订购转化率',tooltip:'订购成功数/访问用户数',status:false,code:'iOTRate',chartType:'spline',yPlus:'%'},
        ],
        searchType:{},
        loadingImg:false,
        loadingImgDataState:false,
        loadingTable:true,
        searchState:true,
        searchFormData:[],
        province:'',

        checkTableImg:'table',
        chartVisble:false,
        tableVisble:false,
        chartShowState:false,
        height:'500',

        trendState:false,
      }
    },
    computed: {

    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.height=document.body.clientHeight - 280;
      }else {
        that.height=document.body.clientHeight - 140;
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
        that.loadingImgDataState= !that.loadingImgDataState;
      },
      chartTypeChange(data){
        let that = this;
        that.searchType = data;
      },
      loadingTableReturn(state){
        let that = this;
        that.loadingTable = state;
      },
      loadingReturn(state){
        let that = this;
        that.loadingImg = state;
      },
      searchForm(data){
        let that = this;
        that.searchFormData = data;
        that.searchState= !that.searchState;
      },
      provinceChange(data){
        let that = this;
        that.province = data;
      },
      changeTableImg(){
        let that = this;
        if (document.body.clientWidth < 800){
          if (that.checkTableImg === 'table'){
            that.chartVisble=false;
            that.tableVisble=true;
          }else {
            that.chartVisble=true;
            that.tableVisble=false;
          }
        }
      },
      trendStateResult(state){
        let that = this;
        if(state === true){
          that.chartVisble=true;
          that.tableVisble=false;
        }else {
          that.chartVisble=false;
          that.tableVisble=true;
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
        let url = "/ms_bas/accessEntryReport/downloadExcel?startDate="+that.searchFormData.startDate +"&endDate="+that.searchFormData.endDate +
          "&sNodeCode="+that.searchFormData.sNodeCode+"&sProvinceCode="+that.searchFormData.sProvinceCode+"&sProjectCode="+that.searchFormData.sProjectCode+"&entryName="+that.searchFormData.entryName;
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
