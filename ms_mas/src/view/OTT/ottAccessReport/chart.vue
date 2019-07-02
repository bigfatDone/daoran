<template>
  <div class="chart-wrap">
    <div class="chart-setting">
      <div class="chart-conditionType">
        <el-button-group v-show="!chartLoading">
          <el-tooltip placement="top-start" effect="light" popper-class="tooltips-auto"
            v-for="(item,index) in selectbars"
            :key="item.text"
            v-if="item.type === 3 || (showActive === 1 && item.type === 1) || (showActive === 2 && item.type === 1) || (showActive === 3 && item.type === 2)"
          >
            <!--v-if="item.type === 1 || showActive === item.type"-->
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
    name: 'ottAccessReport-chart',
    props:['selectbars','imgResultData','chartLoading','showActive'],
    data(){
      return {
        charttype: '',
        chartSate: '',
        chartCode: '',
        yPlus: '',
        imgData:{},
        data:[],
        newUserRateData: [],
        accessUserData: [],
        weekRateData: [],
      }
    },
    mounted() {
//      this.initSelectBars();
    },
    watch: {
      imgResultData:function (val) {
        this.filterData();
        this.initChart();
        if(this.showActive === 3) {
          this.chartChange('weekRate','spline');
        }else {
          this.chartChange('newUserRate','spline');
        }
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
        that.newUserRateData = [];
         that.accessUserData = [];
         that.weekRateData = [];
//        this.imgData.name = [that.imgResultData[0].project];
        that.imgResultData.forEach((item,index) => {
          that.newUserRateData.push(item.newUserRate);
          that.accessUserData.push(item.accessUser);
          that.weekRateData.push(item.weekRate);
          time.push(item.ctime);
        });
        this.imgData.xAxis = time;
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
          that.imgData.data = [];
          switch (that.chartCode) {
            case 'newUserRate':
              that.imgData.data = that.newUserRateData;
              that.imgData.name = '新增用户活跃率';
              break;
            case 'accessUser':
              that.imgData.data = that.accessUserData;
              that.imgData.name = '访问用户数';
              break;
            case 'weekRate':
              that.imgData.data = that.weekRateData;
              that.imgData.name = '周活跃率';
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
            valueSuffix:" "+that.yPlus,
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
            name:that.imgData.name,
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
