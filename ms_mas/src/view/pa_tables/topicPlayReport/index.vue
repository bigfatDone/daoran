<template>
  <div class="pages">
    <el-button
      type="primary"
      class="backToIndex"
      icon="el-icon-back"
      @click="chartVisibleResult"
      v-show="chartVisible"
      circle></el-button>

    <v-search
      @loading="loadingResult($event)"
      @search="searchResult($event)"
      @searchImg="searchImgResult($event)"
      @searchForm="searchFormResult($event)"
      @chartVisible="chartVisibleResult($event)"
      :chart-visible="chartVisible"
      :search-type="searchType"
      ></v-search>
    <el-button-group class="downloadTable" v-show="tableVisible">
      <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
    </el-button-group>
    <v-table
      @detail="detailResult($event)"
      @summaryImg="summaryImgResult($event)"
      :table-data="tableData"
      v-loading="loading"
      v-show="tableVisible"
      ></v-table>

    <v-chart
      v-show="chartVisible"
      v-loading="loading"
      :selectbars="selectbars"
      :img-data="imgData"
      :img-data-state="imgDataState"
      @chartTypeChange="chartTypeChange"></v-chart>

    <!-- 明细 -->
    <el-dialog
      title="单曲明细"
      custom-class="detaiTable"
      width="80%"
      :visible.sync="dialogTableVisible">
      <v-detail
        v-if="dialogTableVisible"
        :table-data="detailData"
        :title-name="titleName"
        :search_form="detail_search_form"
        v-loading="detailTableLoad"
        ></v-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import vSearch from "./component/search"
  import vTable from "./component/table"
  import vDetail from "./component/table_detail"
  import vChart from '@/view/component/highcharts/chart_index'
  export default {
    name: "topicPlayReport",
    components: {
      vSearch,vTable,vDetail,vChart
    },
    data () {
      return {
        url:{
          detailTable:"/ms_bas/topicPlayReport/getDetail.do",
        },
        tableVisible:true,
        loading:true,
        tableData:[],
        search_form: {},

        //单曲明细
        dialogTableVisible:false,
        detailTableLoad:false,
        detail_search_form: {},
        detailData:[],
        titleName:'',

        //趋势
        chartVisible:false,
        imgDataState:false,
        imgData:{
          name:[],
          xAxis:[],
          data:[]
        },
        selectbars:[ //趋势图指标
          {text:'点击人数',tooltip:'点击人数',status:true,code:'playUserNum',chartType:'spline',yPlus:''},
          {text:'点击次数',tooltip:'点击次数',status:false,code:'playNum',chartType:'spline',yPlus:''},
          {text:'点播人数',tooltip:'点播人数',status:false,code:'validPlayUserNum',chartType:'spline',yPlus:''},
          {text:'点播次数',tooltip:'有效点播次数',status:false,code:'validPlayNum',chartType:'spline',yPlus:''},
          {text:'播放时长(时)',tooltip:'用户播放时长累加（时）',status:false,code:'playTimeTotal',chartType:'spline',yPlus:'时'},
          {text:'人均播放时长(分)',tooltip:'用户总播放时长/播放用户数',status:false,code:'userAvgTime',chartType:'spline',yPlus:'分'},
        ],
        searchType:{},

      }
    },
    computed: {

    },
    watch:{
      chartVisible(ev){
        if(ev === true){
          this.chartTypeInit();
        }
      },
    },
    created () {
    },
    mounted () {
    },
    methods: {
      loadingResult(state){
        let that = this;
        that.loading = state;
      },
      searchResult(data){
        let that = this;
        that.tableData = data;
      },
      searchFormResult(data){
        let that = this;
        that.search_form = data;
      },
      //单曲详情
      detailResult(row){
        let that = this;
        let data = {
          startDate: that.search_form.startDate,
          endDate: that.search_form.endDate,
          code:row.code,
          sNodeCode: that.search_form.sNodeCode,
          sProjectCode: that.search_form.sProjectCode,
          sProvinceCode: that.search_form.sProvinceCode,
        };
        that.detail_search_form =data;
        that.dialogTableVisible = true;
        that.detailTableLoad = true;
        that.titleName = row.alias;
        that.detailData=[];

        that.$ajax({
          url: that.url.detailTable,
          data: data,
          method: "post",
          success: function (res) {
            let result = res.data;
            if(result.status){
              that.detailData = result.data;
            }else {
              that.$message({
                type: 'warning',
                message: '单曲详情'+result.message
              });
            }
            that.detailTableLoad=false;
          },
          error: function (err) {
            that.$message.error('请求单曲详情失败，请刷新页面');
            that.detailTableLoad=false;
          }
        });
      },
      //趋势
      summaryImgResult(row){
        let that = this;
        that.chartVisible = true;
        that.tableVisible = false;
      },
      chartVisibleResult(state){
        let that = this;
        that.chartVisible = !that.chartVisible;
        that.tableVisible = !that.tableVisible;
      },
      searchImgResult(data){
        let that = this;
        that.imgData = data;
        that.imgDataState = !that.imgDataState;
      },
      chartTypeInit(){
        let that = this;
        that.selectbars.forEach((item,index)=>{
          if(item.status){
            that.searchType={
              code:item.code,
              text:item.text,
            }
          }
        });
      },
      chartTypeChange(type){
        let that = this;
        that.selectbars.forEach((item,index)=>{
          if(item.code === type.code){
            that.searchType={
              code:type.code,
              text:item.text,
            }
          }
        });
      },
      downloadTable(){
        let that = this;
        let url = "/ms_bas/topicPlayReport/toExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&sNodeCode="+that.search_form.sNodeCode+"&sProvinceCode="+that.search_form.sProvinceCode+"&sProjectCode="+that.search_form.sProjectCode +"&code="+that.search_form.code.join(",");
        window.open(url);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .backToIndex, .phone-click{
    display: none;
  }
  .downloadTable{
    padding: 12px 0;
  }
  @media screen and (max-width: 800px) {
    .backToIndex{
      display: block;
      position: fixed;
      bottom: .5rem;
      left: .5rem;
      z-index: 999;
    }
  }
</style>
