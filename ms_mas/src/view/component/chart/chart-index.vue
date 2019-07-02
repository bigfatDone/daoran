<template>
  <div class="chart-wrap">
    <div class="chart-btns">
      <el-button id="btn_pc_download" @click="down" icon="el-icon-download">下载</el-button>
      <el-button id="btn_wap_download" @click="down_wap" icon="el-icon-download">下载</el-button>
    </div>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
  export default {
    name: 'chart-wrap',
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      searchData:{
        type:Object,
        default:{}
      },
      chartIMGname:{
        type: String,
        default: '常规汇总报表'
      }
    },
    data () {
      return {
        chart: null,
        chartWidth:{
        },
        pixelRatio:'1',
        saveImgDialog: false,
      }
    },
    mounted () {
//      this.initChart();
    },
    watch:{
      searchData (event) {
        this.initChart();
      }
    },
    beforeDestroy () {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null
    },
    methods: {
      initChart() {
        let that = this;
        if (window.innerWidth > 600) {
          that.chartWidth = '93%';
        } else if (window.innerWidth < 600 && window.innerWidth > 470) {
          that.chartWidth = '85%';
        } else {
          that.chartWidth = 'auto';
        }
        if (window.innerWidth > 900) {
          that.pixelRatio = '1'
        } else {
          that.pixelRatio = '2'
        }
        let option = {
          backgroundColor: '#fff',
          title: {},
          tooltip: {
            trigger: 'axis',
            confine: true,
          },
          toolbox: {
            show: true,
            /*feature: {
              saveAsImage: {
                show: true,
                pixelRatio: 1

              }
            },*/
            left: 20,
          },
          legend: {
            top: 5,
            right: '3%',
            left: 60,
            icon: 'rect',
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 10,
            data: that.searchData.legend,
          },
          showLoading: {
            type: 'default'
          },
          grid: {
            x: 50,
            y: 55,
            width: that.chartWidth
          },
          xAxis: [{
            data: that.searchData.xAxis
          }],
          yAxis: [{}],
          series: []
        };
        that.searchData.seriesdata.forEach((item, index) => {
          option.series.push({
            name: that.searchData.seriesname[index],
            type: that.searchData.chartTypes !== '' ? that.searchData.chartTypes : 'line',
            data: item,
          });
        });
        that.chart = that.$echarts.init(document.getElementById(this.id));
        that.chart.setOption(option);
        that.chart.hideLoading();
        window.addEventListener("resize", () => {
          that.chart.resize();
        });
      },
      down() {
        let that = this;
        let canvas = document.getElementById(that.id).children[0].children[0];
        let src = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = src;
        link.download = "pic.jpg";
        link.click();
      },
      down_wap () {
        let that = this;
        let canvas = document.getElementById(that.id).children[0].children[0];
        let src = canvas.toDataURL("image/png");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chart-btns{
    padding: 1rem 0;
    text-align: right;
  }
  #btn_wap_download{
    display: none;
  }
  @media screen and (max-width: 800px) {
    #btn_wap_download{
      display: inline-block;
    }
    #btn_pc_download{
      display: none;
    }
  }
</style>
