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
          :loading-img="imgDataState"
          @chartTypeChange="chartTypeChange">
        </v-chart>
      </div>
    </el-collapse-transition>

    <div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow"><i class="el-icon-caret-top"></i> </div>

    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <!--<el-button-group class="downloadTable">-->
        <!--<el-button type="primary" icon="el-icon-view" @click="detail()">查看详情</el-button>-->
      <!--</el-button-group>-->
      <v-table
        :height="height"
        :table-data="tableData"
        :loading="loading"></v-table>
    </div>

    <!-- 明细 -->
    <el-dialog
      title="渠道分析明细"
      custom-class="detaiTable"
      fullscreen
      :visible.sync="detailVisble">
      <v-detail
        v-if="detailVisble"
        :table-data="detaiTable"
        :search_form="search_form"
        v-loading="loadingDetail"
      ></v-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisble = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  import vChart from './chart'
  import vDetail from "./table_detail"
  export default {
    name: "hourTrendOTT",
    components: {
      vSearch,vTable,vChart,vDetail
    },
    data () {
      return {
        search_form: [],

        tableData:[],
        loading:false,
        height:'500',
        tableVisble:true,

        selectbars:[ //图标切换指标
          {text:'访问用户平均',tooltip:'访问用户平均',status:true,code:'accessUser',chartType:'spline',yPlus:''},
          {text:'点播用户平均',tooltip:'点播用户平均',status:false,code:'playUser',chartType:'spline',yPlus:''},
          {text:'点播次数平均',tooltip:'点播次数平均',status:false,code:'playNum',chartType:'spline',yPlus:''},
          {text:'订购用户平均',tooltip:'订购用户平均',status:false,code:'orderUser',chartType:'spline',yPlus:''},
        ],
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

        detaiTable:[],
        loadingDetail:true,
        detailVisble:false,
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
      chartTypeChange(data){
        let that = this;
        that.searchType = data;
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
      detail(){
        let that = this;
        that.loadingDetail = true;
        that.detailVisble = true;
        that.$ajax({
          url: "/ms_bas/ott/channel/getTableDetail",
          data: that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            if (result.status === true) {
              that.detaiTable = result.data;
            } else {
              that.$message({
                type: 'warning',
                message: result.message
              });
              that.detaiTable = [];
            }
            that.loadingDetail = false;
          },
          error: function (err) {
            that.$message.error('分时段分析页面数据请求失败，请刷新分时段分析页面');
            that.detaiTable = [];
            that.loadingDetail = false;
          }
        });
      },
      downloadTable(){//汇总下载
        let that = this;
        let url = "/ms_bas/ott/hour/toExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&json="+that.search_form.json + "&type=0";
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
