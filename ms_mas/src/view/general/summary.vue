<template>
  <div class="gather">
    <v-search
      @tabledata="tabledataget($event)"
      @chartdata="chartdataget($event)"
      :conditionType="conditionType"
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
      <div class="chart-box" v-show="chartVisble">
        <v-chart
          :selectbars="selectbars"
          :img-data="imgData"
          :loading-img="loadingImg"
          v-loading="loadingImg"
          @chartTypeChange="chartTypeChange">
        </v-chart>
      </div>
    </el-collapse-transition>
    <div class="hideCharts" :class="['hideCharts',{'changeHideCharts':chartShowState}]"><i class="el-icon-caret-top" @click="chartHideShow"></i> </div>

    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <el-table
        :data="tableData"
        :height="height"
        v-loading="loading"
        cell-class-name="text-center"
        header-cell-class-name="text-center"
        stripe
        border>
        <el-table-column
          prop="ctime"
          label="统计日期"
          min-width="83"
          sortable>
        </el-table-column>
        <el-table-column
          prop="sNodeName"
          min-width="80"
          label="项目">
        </el-table-column>
        <el-table-column
          prop="sProvinceName"
          min-width="100"
          label="区域">
        </el-table-column>
        <el-table-column
          prop="sProjectName"
          min-width="80"
          label="产品">
        </el-table-column>
        <el-table-column
          prop="iOSuccessTotal"
          label="订购成功数"
          min-width="82"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iOOffTotal"
          label="退订用户数"
          min-width="82"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iOFailTotal"
          label="订购失败数"
          min-width="82"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iAUTotal"
          label="访问用户数"
          min-width="82"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iANotMonthlyUTotal"
          label="非包月访问用户数"
          min-width="117"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iPUTotal"
          label="点播用户数"
          min-width="82"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iPTotal"
          label="点播量"
          min-width="60"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iUTotal"
          label="留存用户数"
          min-width="82"
          :render-header="renderProductId"
          sortable>
        </el-table-column>
        <el-table-column
          prop="iOSuccessRate"
          label="订购成功率"
          min-width="82"
          :render-header="renderProductId"
          sortable>
          <template slot-scope="scope">
            {{Number(scope.row.iOSuccessRate).toFixed(2)}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="iTRate"
          label="转化率"
          min-width="65"
          :render-header="renderProductId"
          sortable>
          <template slot-scope="scope">
            {{Number(scope.row.iTRate).toFixed(2)}}%
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import vChart from '@/view/component/highcharts/chart_index_typeSearch'
  import vSearch from './component/summary-search-index'

  export default {
    name: "summarys",
    components: {
      vSearch,vChart
    },
    data () {
      return {
        chart:[],
        selectSearch:{},
        conditionType:'',
        tableData1: [],
        tableData2: [],
        tableData3: [],
        selectbars:[
          {text:'订购成功数',tooltip:'统计周期内，订购成功用户数之和',status:true,code:'iOSuccessTotal',chartType:'spline',yPlus:''},
          {text:'退订用户数',tooltip:'统计周期内，退订成功用户数之和',status:false,code:'iOOffTotal',chartType:'spline',yPlus:''},
          {text:'订购失败数',tooltip:'统计周期内，订购失败用户数之和',status:false,code:'iOFailTotal',chartType:'spline',yPlus:''},
          {text:'访问用户数',tooltip:'统计周期内，访问人数之和',status:false,code:'iAUTotal',chartType:'spline',yPlus:''},
          {text:'非包月访问用户数',tooltip:'统计周期内，不存在包月续包产品订购关系（含统计周期内订购成功）的访问用户数之和',status:false,code:'iANotMonthlyUTotal',chartType:'spline',yPlus:''},
          {text:'点播用户数',tooltip:'统计周期内，点播用户数之和',status:false,code:'iPUTotal',chartType:'spline',yPlus:''},
          {text:'点播量',tooltip:'统计周期内,点播数量之和(非去重)',status:false,code:'iPTotal',chartType:'spline',yPlus:''},
          {text:'留存用户数',tooltip:'截止至某个时间点，存在包月续包产品订购关系用户数',status:false,code:'iUTotal',chartType:'spline',yPlus:''},
          {text:'订购成功率',tooltip:'统计周期内，订购成功用户数 / （订购成功用户数+订购失败用户数）',status:false,code:'iOSuccessRate',chartType:'spline',yPlus:'%'},
          {text:'转化率',tooltip:'统计周期内，订购成功用户数 / 访问用户数',status:false,code:'iTRate',chartType:'spline',yPlus:'%'},
        ],
        imgData: {
          name:[],
          xAxis:[],
          data:[],
        },
        SearchImageData:[],
        loadingImg:false,

        loading:true,
        checkTableImg:'table',
        chartVisble:true,
        tableVisble:true,
        chartShowState:false,
        height:'500',

        tableHeadTooltips:[
          {text:'订购成功数',tooltip:'统计周期内，订购成功用户数之和',code:'iOSuccessTotal'},
          {text:'退订用户数',tooltip:'统计周期内，退订成功用户数之和',code:'iOOffTotal'},
          {text:'订购失败数',tooltip:'统计周期内，订购失败用户数之和',code:'iOFailTotal'},
          {text:'访问用户数',tooltip:'统计周期内，访问人数之和',code:'iAUTotal'},
          {text:'非包月访问用户数',tooltip:'统计周期内，不存在包月续包产品订购关系（含统计周期内订购成功）的访问用户数之和',code:'iANotMonthlyUTotal'},
          {text:'点播用户数',tooltip:'统计周期内，点播用户数之和',code:'iPUTotal'},
          {text:'点播量',tooltip:'统计周期内,点播数量之和(非去重)',code:'iPTotal'},
          {text:'留存用户数',tooltip:'截止至某个时间点，存在包月续包产品订购关系用户数',code:'iUTotal'},
          {text:'订购成功率',tooltip:'统计周期内，订购成功用户数 / （订购成功用户数+订购失败用户数）',code:'iOSuccessRate'},
          {text:'转化率',tooltip:'统计周期内，订购成功用户数 / 访问用户数',code:'iTRate'},
        ]
      }
    },
    computed : {
      tableData () {
        let that = this;
        let arr = [];
        return  arr.concat(that.tableData1, that.tableData2, that.tableData3);
      },
    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.height='500';
      }else {
        that.height=document.body.clientHeight - 150;
      }
    },
    mounted () {
      this.changeTableImg();
    },
    methods: {
      chartdataget(searchData) {
        let that = this;
        if (searchData.sProvinceCode ===undefined){
          return;
        }
        that.loadingImg = true;
        that.imgData = {
          name:[],
          xAxis:[],
          data:[],
        };
        that.selectSearch =searchData;
        that.$ajax({//请求图形总数据
          url: "/ms_bas/totalDayReport/getImgData.do",
          method: "post",
          data: that.selectSearch,
          success: function (res) {
            if (res.data.status === true) {
              that.SearchImageData= res.data.data;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.SearchImageData=[];
            }
            that.toPostImgData();
          },
          error: function (error) {
            that.$message.error('常规汇总数据请求失败，请刷新页面');
          }
        });

      },
      toPostImgData(){
        let that = this;
        that.loadingImg= false;
        let imgdata ={};
        if (that.SearchImageData.length > 0){
          let name =[];
          let xAxis =[];
          let data =[];
          that.SearchImageData.forEach((item,index)=>{
            let x =[];
            let select=[];
            item.data.forEach((obj,i)=>{
              if (i === 0){
                name.push(obj.sProvinceName);
              }
              x.push(obj.ctime);
              select.push(Number(obj.exteralNum));
            });
            xAxis.push(x);
            data.push(select);
          });
          imgdata.name=name;
          imgdata.xAxis=xAxis[0];
          imgdata.data=data;
        }else {
          imgdata.name=[];
          imgdata.xAxis=[];
          imgdata.data=[];
        }
        that.imgData = imgdata;
      },
      tabledataget(searchData) {
        let that = this;
        that.loading =true;
        const start = new Date(searchData.startDate);
        const end = new Date(searchData.endDate);
        let betweenTime = end.getTime() - start.getTime();
        let betweenDay = betweenTime/24/60/60/1000;
        that.tableData1 = [];
        that.tableData2 = [];
        that.tableData3 = [];

        that.$ajax({//汇总数据
          url: "/ms_bas/totalDayReport/getTbSummaryData.do",
          method: "post",
          data: searchData,
          success: function (response) {
            if (response.data.status === true){
              that.tableData1=response.data.data;
            }else {
              that.tableData1=[];
              that.$message.warning(response.data.message);
            }
            that.loading =false;
          },
          error: function (error) {
            that.$message.error('常规汇总报表页面数据请求失败，请刷新常规汇总报表页面');
            that.tableData1=[];
            that.loading =false;
          }
        });
        if (betweenDay<=6){
          that.getTableSeventInclude(searchData);
        }else {
          const between = new Date(searchData.endDate);
          let betweendate = that.$dateFormat(between.setTime(between.getTime() - 6*24*60*60*1000),"yyyy-MM-dd");
          let data1={
            startDate:betweendate,
            endDate:searchData.endDate,
            sNodeCode:searchData.sNodeCode,
            sProvinceCode:searchData.sProvinceCode,
            sProjectCode:searchData.sProjectCode,
          };
          let data2={
            startDate:searchData.startDate,
            endDate:betweendate,
            sNodeCode:searchData.sNodeCode,
            sProvinceCode:searchData.sProvinceCode,
            sProjectCode:searchData.sProjectCode,
          };
          that.getTableSeventInclude(data1);
          that.getTableSeventUnclude(data2);
        }

      },
      getTableSeventInclude(data){
        let that = this;
        that.$ajax({//每日数据-前七日
          url: "/ms_bas/totalDayReport/getTbDetail.do",
          method: "post",
          data: data,
          success: function (response) {
            if (response.data.status === true){
              that.tableData2=response.data.data;
            }else {
              that.tableData2=[];
              that.$message.warning(response.data.message);
            }
            that.loading =false;
          },
          error: function (error) {
            that.$message.error('常规汇总报表页面数据请求失败，请刷新常规汇总报表页面');
            that.tableData2=[];
            that.loading =false;
          }
        });
      },
      getTableSeventUnclude(data){
        let that = this;
        that.$ajax({//每日数据-剩余时间
          url: "/ms_bas/totalDayReport/getTbDetail.do",
          method: "post",
          data: data,
          success: function (response) {
            if (response.data.status === true){
              that.tableData3=response.data.data;
            }else {
              that.tableData3=[];
              that.$message.warning(response.data.message);
            }
            that.loading =false;
          },
          error: function (error) {
            that.$message.error('常规汇总报表页面数据请求失败，请刷新常规汇总报表页面');
            that.tableData3=[];
            that.loading =false;
          }
        });
      },
      downloadTable(){
        let that = this;
//        let url = "/ms_bas/totalDayReport/toExcel.do?startDate="+that.selectSearch.startDate +"&endDate="+that.selectSearch.endDate
//          +"&sNodeCode="+that.selectSearch.sNodeCode+"&sProvinceCode="+that.selectSearch.sProvinceCode+"&sProjectCode="+that.selectSearch.sProjectCode;
//        window.open(url);
        let myFrame= document.createElement('iframe');
        myFrame.src =  "/ms_bas/totalDayReport/toExcel.do?startDate="+that.selectSearch.startDate +"&endDate="+that.selectSearch.endDate
          +"&sNodeCode="+that.selectSearch.sNodeCode+"&sProvinceCode="+that.selectSearch.sProvinceCode+"&sProjectCode="+that.selectSearch.sProjectCode;
        myFrame.style.display = 'none';
        document.body.appendChild(myFrame);
      },
      chartTypeChange(data){
        let that = this;
        that.conditionType=data.code;
        that.selectSearch.conditionType=data.code;
        that.chartdataget(that.selectSearch);
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
      renderProductId(h, {column,$index}) {
        let that = this;
        return h("el-tooltip", [
          h("span", {
            slot:'content'
          }, that.propertyTooltips(column.property)),
          h("span", {}, column.label),
        ])
      },
      propertyTooltips(val){
        let that = this;
        let result = '';
        that.tableHeadTooltips.forEach((item,index)=>{
          if (item.code === val){
            result = item.tooltip
          }
        });
        return result;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-title{
    margin-bottom: .5rem;
    padding: 0;
    font-size: 16px;
    color: #333437;
  }
  .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .downloadTable{
    padding: 12px 0;
  }
</style>
