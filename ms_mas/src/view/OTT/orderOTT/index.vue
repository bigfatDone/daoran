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
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-view" @click="detail()">查看详情</el-button>
      </el-button-group>
      <v-table
        :height="height"
        :table-data="tableData"
        :loading="loading"></v-table>
    </div>

    <!-- 明细 -->
    <el-dialog
      title="订购分析明细"
      custom-class="detaiTable"
      width="70%"
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
  import vChart from "./chart"
  import vDetail from "./table_detail"
  export default {
    name: "orderOTT",
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
          {text:'订购成功数',tooltip:'会员成功下单并支付成功的视为成功订购，计一次。',status:true,code:'orderSuccessNum',chartType:'spline',yPlus:''},
          {text:'订购失败数',tooltip:'会员成功下单但未支付的或支付中断的，视为订购失败用户',status:false,code:'orderFailNum',chartType:'spline',yPlus:''},
          {text:'订购发起数',tooltip:'成功下单产生订单号的视为订购发起。（含支付和未支付订单）',status:false,code:'orderNum',chartType:'spline',yPlus:''},
          {text:'订购成功地域分析',tooltip:'订购成功地域分析(省份汇总)',status:false,code:'orderRate',chartType:'pie',yPlus:''},
          {text:'流水趋势',tooltip:'流水趋势',status:false,code:'priceSale',chartType:'spline',yPlus:''},
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
          url: "/ms_bas/ott/order/getDetail.do",
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
            that.$message.error('订购报表页面数据请求失败，请刷新订购报表页面');
            that.detaiTable = [];
            that.loadingDetail = false;
          }
        });
      },
      downloadTable(){//汇总下载
        let that = this;
        let url = "/ms_bas/ott/order/toExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          + "&dateType="+that.search_form.dateType + "&version="+that.search_form.version
          + "&product="+that.search_form.product + "&itemCode="+that.search_form.itemCode
          + "&detail=false";
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
