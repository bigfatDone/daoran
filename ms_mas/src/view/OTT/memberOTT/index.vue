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
      @search="searchResult($event)"
      @searchImg="getResultImg($event)"
      @searchData="searchDataResult($event)"
      @loadingImg="loadingImgReturn($event)"
      @loading="loadingResult($event)"
      :selectbars="selectbars"
      :search-type="searchType"></v-search>

    <el-collapse-transition>
      <div v-show="chartVisble">
        <v-chart
          v-loading="loadingImg"
          :selectbars="selectbars"
          :img-data="imgData"
          :img-data-state="imgDataState">
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
        :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  import vChart from '@/view/component/highcharts/chart_index'
  export default {
    name: "memberOTT",
    components: {
      vSearch,vTable,vChart
    },
    data () {
      return {
        search_form: [],

        tableData:[],
        loading:false,
        height:'500',
        tableVisble:true,

        selectbars:[],
        imgData: {
          name:[],
          xAxis:[],
          data:[],
        },
        chartVisble:true,
        loadingImg:false,
        imgDataState:false,
        chartShowState:false,
        searchType:{},

        checkTableImg:'table',
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
      searchDataResult(data){
        let that = this;
        that.search_form = data;
      },
      searchResult(data){
        let that = this;
        that.tableData = data;
      },
      loadingResult(state){
        let that = this;
        that.loading = state;
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
      loadingImgReturn(state){
        let that = this;
        that.loadingImg = state;
      },
      getResultImg (data) {
        let that = this;
        that.imgData = data;
        that.imgDataState = !that.imgDataState;
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
      downloadTable(){//汇总下载
        let that = this;
        let url = "/ms_bas/memberAnalysis/downloadToExcel.do?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&json="+that.search_form.json;
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
