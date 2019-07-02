<template>
  <div class="pa-page-detail">
    <el-radio-group
      v-model="checkTableImg"
      @change="changeTableImg"
      class="checkTableImg"
      size="mini">
      <el-radio-button label="table">表</el-radio-button>
      <el-radio-button label="img">图</el-radio-button>
    </el-radio-group>

    <v-search
      :start-date="startDate"
      :end-date="endDate"
      :chosed-node="chosedNode"
      :chosed-area="chosedArea"
      :chosed-project="chosedProject"
      :page-id="pageId"
      :page-list="pageList"
      @loading="loadingResult($event)"
      @searchForm="getSearchForm($event)"
      @result="result($event)">
    </v-search>
    <el-collapse-transition>
      <div v-show="chartVisble">
       <v-chart
         v-if="tableData != undefined"
         v-loading="loading"
         :selectbars="selectbars"
         :img-data="imgData"
         :img-data-state="imgDataState"
         @chartTypeChange="chartTypeChange"></v-chart>
      </div>
    </el-collapse-transition>

    <div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow"><i class="el-icon-caret-top"></i> </div>
    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table
        :height="height"
        v-loading="loading"
        :table-data="tableData"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from './detail_search'
  import vTable from './detail_table'
//  import vChart from "@/view/component/highcharts/chart_index"
  import vChart from './detail_chart'
  export default {
    name: "pa-page-detail",
    props: [],
    components: {
      vSearch, vTable, vChart
    },
    data () {
      return {
        startDate: this.$route.params.startDate,
        endDate: this.$route.params.endDate,
        chosedNode: this.$route.params.chosed_node,
        chosedArea: this.$route.params.chosed_area,
        chosedProject: this.$route.params.chosed_project,
        pageId: this.$route.params.pageId,
        pageList: this.$route.params.pageList,
        //datas
        tableData: undefined,

        selectbars:[ //切换按钮
          {text:'访问用户量',tooltip:'',status:true,code:'iATotal',chartType:'spline',yPlus:''},
          {text:'访问用户数',tooltip:'',status:false,code:'iAUTotal',chartType:'spline',yPlus:''},
          {text:'点播用户数',tooltip:'',status:false,code:'playUserNum',chartType:'spline',yPlus:''},
          {text:'点播时长',tooltip:'',status:false,code:'playTimeSecond',chartType:'spline',yPlus:'时'},
          {text:'人均播放时长',tooltip:'',status:false,code:'perPlayTime',chartType:'spline',yPlus:'分'},
        ],
        imgData:{
          name:[],
          xAxis:[],
          data:[],
        },
        imgDataState:false,
        loading:false,

        checkTableImg:'table',
        search_form:[],
        chartVisble:true,
        tableVisble:true,
        chartShowState:false,
        height:'500',
      }
    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.height='500';
      }else {
        that.height=document.body.clientHeight - 170;
      }
    },
    computed: {

    },
    mounted () {
      this.init();
    },
    methods: {
      result (data) {
        let that = this;
        that.tableData = data;

        let code = '';
        let imgData = [];
        let xAxis = [];
        let name = [];
        that.selectbars.forEach((obj,i)=>{
          if (obj.status === true){
            code = obj.code
          }
        });
        that.tableData.forEach((item,index)=>{
          xAxis.push(item.countTime);
          name.push(item.alias);
          for (let key in  item){
            if (key === code){
              imgData.push(Number(item[key]));
            }
          }
        });
        that.imgData = {
          name:name,
          xAxis:xAxis,
          data:[imgData],
        };
        that.imgDataState = !that.imgDataState;
      },
      init () {
        let that = this;
        that.changeTableImg();
        if (that.chosedNode == undefined) {
          that.$router.replace({
            name: "paTablePage",
            params: {}
          });
        }
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
        let url = "/ms_bas/pageInfoRep/exportHistoryTrend.do?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate+"&preDate="+that.search_form.preDate
          +"&sNodeCode="+that.search_form.sNodeCode+"&sProvinceCode="+that.search_form.sProvinceCode+"&sProjectCode="+that.search_form.sProjectCode+"&pageId="+that.search_form.pageId;
        window.open(url);
      },
      getSearchForm(data){
        let that = this;
        that.search_form =data;
      },
      chartTypeChange(val){
        let that = this;
        if(that.tableData === undefined){
          return;
        }
        that.selectbars.forEach((obj,i)=>{
          if (obj.code === val.code){
            obj.status =true;
          }else {
            obj.status =false;
          }
        });
        that.result(that.tableData);
      },
      loadingResult(state){
        let that = this;
        that.loading = state;
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
