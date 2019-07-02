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
      :search-type="searchType">
      <div class="btns" slot="comeback">
        <el-button @click="comeback" type="primary" icon="el-icon-arrow-left">返回</el-button>
      </div>
    </v-search>

    <el-collapse-transition>
      <div v-show="chartVisble">
        <v-chart
          v-loading="loadingImg"
          :selectbars="selectbars"
          :img-data="imgData"
          :date-status="dateStatus"
          @chartTypeChange="chartTypeChangeResult($event)"
          :loading-img="imgDataState">
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
  import vChart from './chart'
  export default {
    name: "trendOTT",
    components: {
      vSearch,vTable,vChart
    },
    data () {
      return {
        search_form: [],

        tableData:[],
        sumData:[],
        loading:false,
        height:'500',
        tableVisble:true,

        selectbars:[ //图标切换指标
          {text:'访问用户数',tooltip:'访问用户数',status:true,code:'accessUser',chartType:'spline',type:1,yPlus:'',rate:'',value:'',up:''},
          {text:'新增用户数',tooltip:'新增用户数',status:false,code:'newUser',chartType:'spline',type:2,yPlus:'',rate:'',value:'',up:''},
          {text:'新增会员数',tooltip:'新增会员数',status:false,code:'newMember',chartType:'spline',type:3,yPlus:'',rate:'',value:'',up:''},
          {text:'新增VIP数',tooltip:'新增VIP数',status:false,code:'newVip',chartType:'spline',type:4,yPlus:'',rate:'',value:'',up:''},
          {text:'订购成功数',tooltip:'订购成功数',status:false,code:'orderSuccessNum',chartType:'spline',type:5,yPlus:'',rate:'',value:'',up:''},
          {text:'点播用户数',tooltip:'点播用户数',status:false,code:'playUserNum',chartType:'spline',type:6,yPlus:'',rate:'',value:'',up:''},
          {text:'点播次数',tooltip:'点播次数',status:false,code:'playNum',chartType:'spline',type:7,yPlus:'',rate:'',value:'',up:''},
          {text:'收入流水',tooltip:'收入流水',status:false,code:'priceSale',chartType:'spline',type:8,yPlus:'',rate:'',value:'',up:''},
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

        dateStatus:true,//true 单日,false 时间段
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
        let count = 0;
        for (let item in that.search_form) {
          if (that.search_form[item] == "" || that.search_form[item] === undefined) {
            count += 1;
          }
        }
        if (count > 0) {
          return;
        } else {
          let state = true;
          let dateTime = that.$dateFormat(Date.now(),"yyyy-MM-dd");
          if(that.search_form.startDate === dateTime){
            state = true;
          }else {
            state = false;
          }
          if(state === true){
            that.chartTypeDataInit(that.search_form,function (data) {
                data.forEach((obj,i) => {
                  that.selectbars.forEach((item,index) => {
                    if(item.type === obj.type){
                      item.value = obj.now;
                      item.rate = obj.rate;
                      item.up = obj.up;
                    }
                  });
                });

            });
          }else {
            that.chartTypeDataInit(that.search_form,function (data) {
              that.selectbars.forEach((item,index) => {
                item.value = data[item.code];
              });
            });
          }
        }
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
        that.dateStatus = data.dateStatus;
        // if(that.dateStatus === true){
        //   that.selectbars = that.selectbars;
        // }else {
        //   that.selectbars = that.selectbarsPre2;
        // }
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
      chartTypeChangeResult(data){
        let that =this;
        that.searchType = data;
      },
      chartTypeDataInit(searchData,callback){
        let that = this;
        let ret = {};
        that.$ajax({
          url: "/ms_bas/ott/trendDay/getTableSummary",
          data:  searchData,
          method: "post",
          success: function (res) {
            let result =res.data;
            // accessUser newUser newMember newVip orderSuccessNum playUserNum playNum priceSale
            if (result.status === true) {
              that.sumData = result.data;
              ret = result.data[0];
            } else {
              that.$message({
                type: 'warning',
                message: result.message
              });
            }
            callback(ret);
          },
          error: function (err) {
            that.$message.error('趋势分析(旧)页面数据请求失败，请刷新趋势分析(旧)页面');
          }
        });
      },
      downloadTable(){//汇总下载
        let that = this;
        let url = "/ms_bas/ott/trendDay/toExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&json="+that.search_form.json;
        window.open(encodeURI(url));
      },
      comeback(){
        this.$emit('comeback', false);
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
