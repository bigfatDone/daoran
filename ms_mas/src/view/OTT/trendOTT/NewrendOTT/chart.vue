<template>
  <div class="chart-wrap">
    <div class="chart-setting">
      <div class="chart-conditionType">
        <el-button-group v-show="!chartLoading">
          <el-tooltip placement="top-start" effect="light" popper-class="tooltips-auto" v-for="(item,index) in selectbars" :key="item.text">
            <div slot="content">{{item.tooltip}}</div>
            <el-button @click="chartChange(item.code,item.chartType)" :class="{ 'active-button-group': item.status }">{{item.text}}</el-button>
          </el-tooltip>
        </el-button-group>
      </div>

      <div class="chart-btns">
        <el-button @click="down" icon="el-icon-download">导出图片</el-button>
      </div>
    </div>

    <div id="chart"></div>
  </div>
</template>

<script>
  export default{
    name: 'NewrendOTT-chart',
    props:['selectbars','imgResultData','chartLoading'],
    data(){
      return {
        charttype: '',
        chartSate: '',
        chartCode: '',
        yPlus: '',
        imgData:{},
        data:[],
        accessUserData: [],
        newUserData: [],
        newMemberData: [],
        newVipData: [],
        orderSuccessNumData: [],
        playUserNumData: [],
        playNumData: [],
        priceSaleData: []
      }
    },
    mounted() {
//      this.initSelectBars();
    },
    watch: {
      imgResultData:function () {
        this.filterData();
        this.initChart();
        this.chartChange();
        console.log(this.imgResultData.length)
      }
    },
    methods: {
        // 初始化
      initSelectBars () {
        let that = this;
        if (that.selectbars.length <= 0) {
          return;
        }
        that.selectbars.forEach((item, index) => {
          if (item.status) {
            that.chartState = item.code;
          }
        });
      },
      // 遍历获取数据
      filterData() {
        let that = this;
        let time = [];
        that.accessUserData = [];
         that.newUserData = [];
         that.newMemberData = [];
         that.newVipData = [];
         that.orderSuccessNumData = [];
         that.playUserNumData = [];
         that.playNumData = [];
         that.priceSaleData = [];
        this.imgData.name = [that.imgResultData[0].project];
        console.log(that.imgResultData);
        that.imgResultData.forEach((item,index) => {
          that.accessUserData.push(item.accessUser);
          that.newUserData.push(item.newUser);
          that.newMemberData.push(item.newMember);
          that.newVipData.push(item.newVip);
          that.orderSuccessNumData.push(item.orderSuccessNum);
          that.playNumData.push(item.playNum);
          that.priceSaleData.push(item.priceSale);
          time.push(item.ctime);
        });
        this.imgData.xAxis = time;
        this.imgData.data = that.accessUserData;
      },
      // 判断选择的tab选项
      chartChange(code,type) {
        let that = this;
        let selectCode = '';
        let selectType = '';
        let y = '';
        that.selectbars.forEach((item,index)=>{
          if (code === undefined){
            if (item.status === true){
              selectCode = item.code;
              selectType = item.chartType;
              y = item.yPlus;
            }
          }else {
            if (item.code === code){
              item.status =true;
              selectCode = item.code;
              selectType = item.chartType;
              y = item.yPlus;
            }else{
              item.status =false;
            }
          }
        });
        that.chartCode=selectCode;
        that.charttype=selectType;
        that.yPlus=y;
        that.changeChartData();
      },
      // 切换tab选项中图表的值
      changeChartData() {
          let that = this;
          switch (that.chartCode) {
            case 'accessUser':
              that.imgData.data = that.accessUserData;
              break;
            case 'newUser':
              that.imgData.data = that.newUserData;
              break;
            case 'newMember':
              that.imgData.data = that.newMemberData;
              break;
            case 'newVip':
              that.imgData.data = that.newVipData;
              break;
            case 'orderSuccessNum':
              that.imgData.data = that.orderSuccessNumData;
              break;
            case 'playUserNum':
              that.imgData.data = that.playNumData;
              break;
            case 'playNum':
              that.imgData.data = that.priceSaleData;
              break;
            case 'priceSale':
              that.imgData.data = that.priceSaleData;
              break;
        }
        this.initChart();
      },
      // 初始化hightchart
      initChart() {
        let that = this;
        that.$Highcharts.setOptions({
          chart: {
            events: {
              beforePrint: function () {
                let height = this.options.exporting.chartOptions.chart.height;
                if (height) {
                  this.oldhasUserSize = this.hasUserSize;
                  this.resetParams = [this.chartWidth, this.chartHeight, false];
                  this.setSize(this.chartWidth, height, false);
                }
              },
              afterPrint: function () {
                if (this.options.exporting.chartOptions.chart.height) {
                  this.setSize.apply(this, this.resetParams);
                  this.hasUserSize = this.oldhasUserSize;
                }
              }
            }
          },
          lang: {
            loading:"加载中",
            noData: '暂无数据'
          }
        });
        let option={
          title: {
            text:null //默认不显示标题
          },
          yAxis: {
            title: {
              text: null  //默认不显示Y轴标题
            },
            labels: {
              formatter:function() {
                return this.value + that.yPlus;
              }
            }
          },
          exporting:{
            enabled:false,  //不显示默认导出图标
            chartOptions: {
              chart: {
                width: 1080
              }
            }
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030'
            }
          },
          loading: {  // 加载中选项配置
            labelStyle: {
              color: '#409eff',
              fontSize: '14px'
            }
          },
          credits:{
            enabled:false // 禁用版权信息
          },
          legend: {   //设置图例显示位置
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            maxHeight:'80',
            navigation: {
              arrowSize: 16,
            }
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          tooltip: {      //设置数据提示框
            backgroundColor: '#fff',
            borderColor: '#ccc',        // 边框颜色
            borderRadius: 10,             // 边框圆角
            borderWidth: 2,               // 边框宽度
            animation: true,              // 是否启用动画效果
            shared: true,
            useHTML: true,
            headerFormat: '<span style="font-size:12px;">{point.key}</span><table class="columnTable">',
            pointFormat: '<tr><td style="color:{series.color}">{series.name}: </td>' +
            '<td><b>{point.y}</b></td></tr>',
            footerFormat: '</table>'
          },
          xAxis: {
            categories:that.imgData.xAxis,
            tickPositioner: function () {
              let positions = [];
              if(this.dataMax !==null && this.dataMax !==0){
                let tick = Math.floor(this.dataMin);
                if(this.dataMax >31){
                  for (tick; tick - 6 <= this.dataMax; tick += 6) {
                    positions.push(tick);
                  }
                }else {
                  for (tick; tick - 1 <= this.dataMax; tick += 1) {
                    positions.push(tick);
                  }
                }
              }
              return positions;
            }
          },
          series: []
        };

//        if (that.imgData.color !==undefined){
//          that.imgData.data.forEach((item,index)=>{
//            option.series.push({
//              name:that.imgData.name[index],
//              data:item,
//              type:that.charttype,
//              color:that.imgData.color[index],
//              tooltip: {
//                valueSuffix:" "+that.yPlus
//              }
//            });
//          });
//        }else {
//          that.imgData.data.forEach((item,index)=>{
//            option.series.push({
//              name:that.imgData.name[index],
//              data:item,
//              type:that.charttype,
//              tooltip: {
//                valueSuffix:" "+that.yPlus
//              }
//            });
//          });
//        }


//        that.imgData.data.forEach((item,index)=>{
          option.series.push({
            name:that.imgData.name[0],
            data:that.imgData.data,
            type: 'spline'
          });
//        });

        that.chart = this.$Highcharts.chart('chart', option);
//        if (that.loadingImg === true){
//          that.chart.showLoading();
//        }else {
//          that.chart.hideLoading();
//        }
      },
      down() {
        let that = this;
        that.chart.exportChart({
          type: 'image/jpeg',
          filename: 'chart'
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chart-setting{
    margin-top: .5rem;
  }
  .chart-conditionType{
    display: inline-block;
    width: 80%;
    float:left;
  }
  .chart-btns{
    display: inline-block;
    float:right;
    text-align: right;
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
