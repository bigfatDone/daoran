<template>
  <div class="home-chart">
    <div class="chart-btns">
      <el-radio-group
        v-model="type"
        class="typeChange"
        @change="domChart">
        <el-radio-button label="订购成功数"></el-radio-button>
        <el-radio-button label="订购失败数"></el-radio-button>
        <el-radio-button label="退订用户数"></el-radio-button>
      </el-radio-group>
      <el-button-group
        class="downLoad">
        <el-button icon="el-icon-download" @click="downLoad">导出图片</el-button>
      </el-button-group>
    </div>
    <div id="chart" style="width: 100%"></div>
  </div>
</template>

<script>
export default {
  name: 'home-chart',
  props: ["chartData", "yesterday"],
  data () {
    return {
      chart: null,
      type: "订购成功数",
    }
  },
  mounted () {

  },
  watch: {
    chartData (event) {
      let that = this;
      that.domChart();
    }
  },
  methods: {
    downLoad() {
      let that = this;
      that.chart.exportChart({
        type: 'image/jpeg',
        filename: 'chart'
      });
    },
    domChart () {
      let that = this;
      let xAxis = [];
      let series = [];
      let series2 = [];
      let pre = "iOSuccessTotal";
      switch (that.type) {
        case "订购成功数": pre = "iOSuccessTotal"; break;
        case "订购失败数": pre = "iOFailTotal"; break;
        case "退订用户数": pre = "iOOffTotal"; break;
      }

      that.yesterday.forEach((item, index) => {
        series2.push(item[pre]);
      });

      that.chartData.list.forEach((item, index) => {
        xAxis.push(item.sHours);
        series.push(item[pre]);
        //series2.push();
      });
      that.chart = that.$Highcharts.chart('chart', {
        chart: {
          type: 'spline'
        },
        title: {
          text: null
        },
        yAxis: {
          title: {
            text: null  //默认不显示Y轴标题
          },
        },
        exporting:{
          enabled:false  //不显示默认导出图标
        },
        credits:{
          enabled:false // 禁用版权信息
        },
        legend: {   //设置图例显示位置
          backgroundColor: '#FFFFFF',
          align: 'center',
          verticalAlign: 'top'
        },
        colors:['#4e81bd','#c1504c'],
        tooltip: {      //设置数据提示框
          backgroundColor: '#fff',
          borderColor: '#ccc',        // 边框颜色
          borderRadius: 10,             // 边框圆角
          borderWidth: 2,               // 边框宽度
          animation: true,              // 是否启用动画效果
          shared: true,
          formatter : function (){
            let bet = this.points[0].y-this.points[1].y;
            if(bet>=0){
              bet = '+'+bet;
            }
            let s = '<b>'+this.x+'</b>';
            this.points.forEach((item,index)=>{
              s += '<br /><span style="color:'+item.series.color+';text-align:right">' + item.series.name + ':' + item.y+'</span>';
            });
            s += '<br /><span style="color:#f60">对比:</span>' + bet+'';
            return s;
          },
        },
        xAxis: {
          categories: xAxis,
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
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          },
          line: {
            dataLabels: {
              // 开启数据标签
              enabled: true
            },
            // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            enableMouseTracking: true
          }
        },
        series: [
          {name: "今日", data: series},
          {name: "昨日", data: series2}
        ]
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chart-btns{
    padding: 1rem 0 .5rem 0;
    width: 100%;
    clear: both;
  }
  .typeChange{
    display: inline-block;
    width: 80%;
    float: left;
  }
  .downLoad{
    display: inline-block;
    float: right;
  }
</style>
