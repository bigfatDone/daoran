<template>
  <div>
    <div style="position: relative;">
      <div id="container" :class="{'hideCharts':!hideCharts}"></div>
      <div class="chart-btns">
        <el-button @click="down" icon="el-icon-download">导出图片</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'chart-wrap',
    components: {
    },
    props: ['imgData'],
    data () {
      return{
        X:[],
        arrTime:[],
        clickNum:[], // 反馈次数
        clickUser:[], // 反馈用户数
        chart:null,
        hideCharts: false,
        stat:[{stat:true},{stat:false},{stat:false}],
        Ytit:'点击量',
        unit:'分'
      }
    },
    watch: {
        imgData(){
          this.init();
          console.log(this.clickNum)
        }
    },
    mounted () {
       this.init();
    },
    methods:{
      choose(){
        const that = this;
            that.X = [
              {
                "name": "反馈次数",
                "data": that.clickNum,
                "_colorIndex": 0,
                "_symbolIndex": 0,
                "type": "spline"
              },
              {
                "name": "反馈用户数",
                "data": that.clickUser,
                "_colorIndex": 1,
                "_symbolIndex": 1,
                "type": "spline"
              }
            ];
            that.stat = [{stat:true},{stat:false},{stat:false}];
            that.Ytit = '数量';
            that.unit = '';
            that.chat();
            that.hideCharts = true;
      },
      chartHideShow(){
        this.hideCharts = !this.hideCharts;
      },
      // 导出hightchart图片
      down() {
        let that = this;
        that.chart.exportChart({
          type: 'image/jpeg',
          filename: 'chart'
        });
      },
      chat(){
        const that = this;
        this.chart = that.$Highcharts.chart('container', {
          chart: {
            type: 'line'
          },
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories: that.arrTime
          },
          yAxis: {
            title: {
              text: that.Ytit
            },
          },
          plotOptions: {
            line: {
              dataLabels: {
                // 开启数据标签
                enabled: true,
              },
              // 关闭鼠标跟踪，对应的提示框、点击事件会失效
              enableMouseTracking: true
            }
          },
          series: that.X,
          credits: {
            enabled: false,
          },
          tooltip:{
            shared: true
//            formatter: function() {return '<div>'+this.series.name + '：'+this.y+ that.unit+'</div>';}
          },
          legend:{
            verticalAlign: 'top',//设置图例垂直方向的对齐方式 可选：bottom top middle
          },
          exporting:{
            enabled:false,  //不显示默认导出图标
            chartOptions: {
              chart: {
                width: 1080
              }
            }
          },
          lang:{
            loading:"加载中",
            noData: '暂无数据'
          },
        });
      },
      init(){
        const that = this;
        that.arrTime = [];
        that.clickNum = [];
        that.clickUser = [];
        this.imgData.forEach(i=>{
          that.arrTime.push(i.ctime);
          that.clickNum.push(i.val);
          that.clickUser.push(i.userNum);
        });
        this.choose();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chart-btns{  display: inline-block;  position: absolute;right: 0;top: 0;  text-align: right;  }
  .hideCharts{display: none;position: relative;}
  .sign{position: absolute;left: 50%;cursor: pointer;}
  .active{  color: #409EFF;  border-color: #c6e2ff;  background-color: #ecf5ff;  }
</style>
