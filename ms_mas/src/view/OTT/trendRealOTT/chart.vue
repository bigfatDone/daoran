<template>
  <div class="chart-wrap">
    <div class="chart-setting">
      <div class="chart-conditionType">
        <ul class="table-list">
          <li
            v-for="(item,index) in selectbars"
            :class="{'select':item.status}"
            @click="chartChange(item.code,item.chartType)"
            :key="item.text">
            <div class="data-title">{{item.text}}</div>
            <div class="data-value">{{item.value}}{{item.yPlus}}</div>
            <!--<div-->
              <!--class="data-contrast"-->
              <!--v-if="dateStatus">对比昨日-->
              <!--<span-->
                <!--class="down"-->
                <!--:class="{'up':item.up}">{{item.rate}}% <i class="el-icon-upload2" v-if="item.up"></i><i class="el-icon-download" v-else></i> </span></div>-->
          </li>
        </ul>
      </div>
      <!--wap btns begin-->
      <div class="wap-btns">
        <el-select
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
      <div class="chart-btns">
        <el-button @click="down" icon="el-icon-download">导出图片</el-button>
      </div>
    </div>
    <div style="clear: both;"></div>
    <div id="chart"></div>
  </div>
</template>

<script>
  export default {
    name: 'trendOTT-chart',
    props: ['selectbars','imgData','loadingImg','dateStatus'],
    data () {
      return {
        chart: null,
        charttype:'',
        yPlus:'',
        chartState: "",
      }
    },
    mounted () {
      this.initSelectBars();
      this.chartChange();
    },
    watch:{
      loadingImg(event){
        this.initChart();
      }
    },
    beforeDestroy () {
      if (!this.chart) {
        return
      }
      this.chart = null
    },
    methods: {
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
      wapChartChange () {
        let that = this;
        that.chartChange(that.chartState, "");
      },
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

        if (that.imgData.color !==undefined){
          that.imgData.data.forEach((item,index)=>{
            option.series.push({
              name:that.imgData.name[index],
              data:item,
              type:that.charttype,
              color:that.imgData.color[index],
              tooltip: {
                valueSuffix:" "+that.yPlus
              }
            });
          });
        }else {
          that.imgData.data.forEach((item,index)=>{
            option.series.push({
              name:that.imgData.name[index],
              data:item,
              type:that.charttype,
              tooltip: {
                valueSuffix:" "+that.yPlus
              }
            });
          });
        }

        that.chart = this.$Highcharts.chart('chart', option);
//        if (that.loadingImg === true){
//          that.chart.showLoading();
//        }else {
//          that.chart.hideLoading();
//        }
      },
      chartChange(code,type){
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
        that.charttype=selectType;
        that.yPlus=y;
        that.$emit("chartTypeChange", {code:selectCode,conditionType:selectType});
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
  .chart-wrap{
    clear: both;
  }
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

  .table-list{
    margin:0;
    padding: 0;
    display: block;
    font-size: .8rem;
  }
  .table-list li{
    height: 3.5rem;
    width: 6.5rem;
    margin: 0;
    padding: .3rem;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: .5rem;
    vertical-align: top;
    cursor: pointer;
  }
  .table-list li.select{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff
  }
  .data-title{
    font-size: .6rem;
  }
  .data-value{
    margin: .1rem auto;
    text-align: center;
    display: block;
    font-size: 1rem;
    font-weight: bold;
  }
  .data-contrast{
    font-size: .7rem;
    color: #8c939d;
  }
  .data-contrast>.down{
    color: #67C23A;
  }
  .data-contrast>.up{
    color: #f60;
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
