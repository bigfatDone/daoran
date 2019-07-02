<template>
  <div class="gather">
    <v-search
      @tabledata="tabledataget($event)"
      @chartdata="chartdataget($event)"
      :loading="loading">
    </v-search>
    <el-radio-group
      v-model="checkTableImg"
      @change="changeTableImg"
      class="checkTableImg"
      size="mini">
      <el-radio-button label="table">表</el-radio-button>
      <el-radio-button label="img">图</el-radio-button>
    </el-radio-group>
    <el-collapse-transition>
      <div v-show="chartVisble" class="chart-setting" v-loading="loadingImg">
        <el-button-group class="chart-conditionType" v-if="initIOSstate">
          <el-tooltip placement="top-start" effect="light" popper-class="tooltips-auto" v-for="(item,index) in selectbars" :key="item.text">
            <div slot="content">{{item.tooltip}}</div>
          <el-button @click="chartChange(item.code)" :class="{ 'active-button-group': item.status }">{{item.text}}</el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group class="chart-conditionType" v-for="(item,index) in selectbars" :key="item.text" v-else>
            <el-button @click="chartChange(item.code)" :class="{ 'active-button-group': item.status }">{{item.text}}</el-button>
        </el-button-group>
        <!--wap btns begin-->
        <div class="wap-btns">
          <el-select
            multiple
            collapse-tags
            v-model="chartState"
            placeholder="请选择"
            @change="wapChartChange">
            <el-option
              v-for="(item,index) in selectbars"
              :key="item.code"
              :label="item.text"
              :value="item.code">
            </el-option>
          </el-select>
        </div>
        <!--wap btns end-->
        <div class="chart-box">
          <v-chart
            :selectbars="selectbars"
            :img-data="imgData"
            :img-data-state="imgDataState"
            :loading-img="loadingImg">
          </v-chart>
        </div>
      </div>
    </el-collapse-transition>
    <div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow"><i class="el-icon-caret-top"></i> </div>
    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable('excel')">下载Excel</el-button>
        <el-button type="primary" icon="el-icon-download" @click="downloadTable('detial')">下载综合指标详情</el-button>
        <el-button type="primary" icon="el-icon-download" @click="downloadTable('all')">下载综合指标汇总</el-button>
      </el-button-group>
      <v-table
        :height="height"
        :table-data="tableData"
        :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from './component/marketsReport-search-index'
  import vChart from './component/chart_marketsReport'
  import vTable from './component/table_for_marketsReport'

  export default {
    name: 'marketsReport',
    components: {
      vSearch, vChart, vTable
    },
    data () {
      return {
        tableData:[],
        imgData: {
          name:[],
          xAxis:[],
          data:[],
        },
        chartType:'',
        chartResponse:[],
        loading:true,
        loadingImg:false,
        imgDataState:true,
        selectbars:[
          {text:'访问用户数',tooltip:'统计周期内，访问人数之和',status:true,code:'iAUTotal',chartType:'column',yPlus:''},
          {text:'新访问用户数',tooltip:'统计周期内，历史首次访问用户数之和',status:false,code:'iANewUTotal',chartType:'column',yPlus:''},
          {text:'非包月访问用户数',tooltip:'统计周期内，不存在包月续包产品订购关系（含统计周期内订购成功）的访问用户数之和',status:true,code:'iANotMonthlyUTotal',chartType:'column',yPlus:''},
          {text:'订购成功数',tooltip:'统计周期内，订购成功用户数之和',status:true,code:'iOSuccessTotal',chartType:'column',yPlus:''},
          {text:'退订用户数',tooltip:'统计周期内，退订成功用户数之和',status:true,code:'iOOffTotal',chartType:'column',yPlus:''},
          {text:'留存用户数',tooltip:'截止至某个时间点，存在包月续包产品订购关系用户数',status:false,code:'iRetainedUTotal',chartType:'column',yPlus:''},
          {text:'点播用户数',tooltip:'统计周期内，点播用户数之和',status:false,code:'iPUTotal',chartType:'column',yPlus:''},
          {text:'点播量',tooltip:'统计周期内,点播数量之和(非去重)',status:false,code:'iPTotal',chartType:'column',yPlus:''},
        ],
        selectSearch:{},
        initIOSstate:true,//针对IOS隐藏tooltips
        checkTableImg:'table',
        chartVisble:true,
        tableVisble:true,
        chartShowState:false,
        height:'500',
        chartState: [],
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
    mounted () {
      this.initSelectBars();
      this.initIOS();
    },
    methods: {
      initSelectBars () {
        let that = this;
        if (that.selectbars.length <= 0) {
          return;
        }
        that.selectbars.forEach((item, index) => {
          if (item.status == true) {
            that.chartState.push(item.code);
          }
        });
      },
      wapChartChange () {
        let that = this;
        that.selectbars.forEach((item, index) => {
          item.status = false;
          that.chartState.forEach((obj,k)=> {
            if (item.code === obj) {
              item.status = true;
            }
          });
        });
        that.chartViewForSelect();
      },
      initIOS(){
        let that = this;
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          that.initIOSstate = true;
        }
        if (isIOS) {
          that.initIOSstate = false;
        }
        this.changeTableImg();
      },
      tabledataget(data){
        let that = this;
        that.loading =true;
        that.$ajax({//表格数据
          url: "/ms_bas/marketsReport/getReportTableData",
          method: "post",
          data: data,
          success: function (response) {
            if (response.data.status === true){
              that.tableData=response.data.data;
            }else {
              that.tableData=[];
              that.$message.warning(response.data.message);
            }
            that.loading =false;
          },
          error: function (error) {
            that.$message.error('营销运营报表页面数据请求失败，请刷新营销运营报表页面');
            that.tableData=[];
            that.loading =false;
          }
        });
      },
      chartdataget(data){
        let that = this;

        that.imgData={
          name:[],
          xAxis:[],
          data:[],
          color:[],
          chartTypes:[],
        };
        that.loadingImg = true;
        that.selectSearch =data;
        that.$ajax({//请求图形总数据
          url: "/ms_bas/marketsReport/getReportImgData",
          method: "post",
          data: data,
          success: function (response) {
            if (response.data.status === true){
              that.chartResponse = response.data.data;
            }else {
              that.imgData={
                name:['当前','对比'],
                xAxis:[],
                data:[],
                color:['#4e81bd','#c1504c'],
                chartTypes:'spiline',
              };
              that.loadingImg = false;
              that.imgDataState = !that.imgDataState;
              that.$message.warning(response.data.message);
            }
            that.chartViewForSelect();
          },
          error: function (error) {
            that.$message.error('营销运营报表页面数据请求失败，请刷新营销运营报表页面');
            that.imgData={
              name:['当前','对比'],
              xAxis:[],
              data:[],
              color:['#4e81bd','#c1504c'],
              chartTypes:'spiline',
            };
            that.loadingImg = false;
            that.imgDataState = !that.imgDataState;
          }
        });
      },
      chartChange(code){//根据不同维度赋值图形数据
        let that = this;
        that.selectbars.forEach((item,index)=>{
          if(item.code === code) {
            if (item.status === true) {
              item.status = false;
            } else {
              item.status = true;
            }
          }
        });
        that.chartViewForSelect();
      },
      chartViewForSelect(){
        let that = this;
        let dataSelects = [];
        let xAxis=[];
        let chartTypes=[];
        let data=[];
        that.selectbars.forEach((item,index)=>{
          if(item.status === true){
            xAxis.push(item.text);
            chartTypes.push(item.chartType);
            dataSelects.push(item);
          }
        });
        that.chartResponse.forEach((obj,i) =>{
          let datas=[];
          dataSelects.forEach((item,index)=> {
            for (let key in obj) {
              if (key === item.code) {
                datas.push(obj[key]);
              }
            }
          });
          data.push(datas);
        });
        that.imgData={
          name:['当前','对比'],
          xAxis:xAxis,
          data:data,
          color:['#4e81bd','#c1504c'],
          chartTypes:chartTypes,
        };
        that.loadingImg = false;
        that.imgDataState = !that.imgDataState;
      },
      downloadTable(type){
        let that = this;
        let url;
        if ( type === 'excel') {
          url = "/ms_bas/marketsReport/getReportExcel?startDate="+that.selectSearch.startDate +"&endDate="+that.selectSearch.endDate+"&preDate="+that.selectSearch.preDate
            +"&sNodeCode="+that.selectSearch.sNodeCode+"&sProvinceCode="+that.selectSearch.sProvinceCode+"&sProjectCode="+that.selectSearch.sProjectCode;
        } else if ( type === 'all') {
          url = "/ms_bas/summary/report/toExcel?startDate="+that.selectSearch.startDate +"&endDate="+that.selectSearch.endDate+"&preDate="+that.selectSearch.preDate
            +"&sNodeCode="+that.selectSearch.sNodeCode+"&sProvinceCode="+that.selectSearch.sProvinceCode+"&sProjectCode="+that.selectSearch.sProjectCode;
        } else {
          url = "/ms_bas/summary/report/toExcel?startDate="+that.selectSearch.startDate +"&endDate="+that.selectSearch.endDate+"&preDate="+that.selectSearch.preDate
            +"&sNodeCode="+that.selectSearch.sNodeCode+"&sProvinceCode="+that.selectSearch.sProvinceCode+"&sProjectCode="+that.selectSearch.sProjectCode+"&detail=true";
        }

        window.open(url);
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
  .chart-setting{
    padding-top: .5rem;
  }
  @media screen and (max-width: 800px) {
    .chart-conditionType{
      display: none;
    }
    .wap-btns{
      display: block;
    }
  }
  @media screen and (min-width: 800px) {
    .wap-btns{
      display: none;
    }
  }
</style>
