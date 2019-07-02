<template>
  <div>
    <div class="el-button-group">
      <el-button @click="choose('1')" :class="{ active: stat[0].stat }">点击次数</el-button>
      <el-button @click="choose('2')" :class="{ active: stat[1].stat  }">点播次数</el-button>
      <el-button @click="choose('3')" :class="{ active: stat[2].stat  }">点播时长</el-button>
    </div>
    <div style="position: relative;">
      <div id="container" :class="{'hideCharts':!hideCharts}" v-loading="loading2"></div>
      <div class="chart-btns">
        <el-button @click="down" icon="el-icon-download">导出图片</el-button>
      </div>
      <div :class="{'hideCharts':hideCharts}"  @click="chartHideShow"><i class="sign el-icon-caret-bottom"></i></div>
      <div :class="{'hideCharts':!hideCharts}"  @click="chartHideShow"><i class="sign el-icon-caret-top"></i></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'chart-wrap',
    components: {
    },
    props: ['imgData','loading2'],
    data () {
      return{
        X:[],
        arrTime:[],
        playNum:[], // 点播次数
        playUser:[], // 点播用户数
        clickNum:[], // 点击次数
        clickUser:[], // 点击用户数
        playTime:[], // 点播时长
        avgPlayTime:[], // 人均点播时长
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
        }
    },
    mounted () {
       this.init();
    },
    methods:{
      choose(type){
        const that = this;
        switch(type){
          case '1':
            that.X = [
              {
                "name": "点击次数",
                "data": that.clickNum,
                "_colorIndex": 0,
                "_symbolIndex": 0
              },
              {
                "name": "点击用户数",
                "data": that.clickUser,
                "_colorIndex": 1,
                "_symbolIndex": 1
              }
            ];
            that.stat = [{stat:true},{stat:false},{stat:false}];
            that.Ytit = '点击量';
            that.unit = '';
            that.chat();
            that.hideCharts = true;
            break;
          case '2':
            this.X = [
              {
                "name": "点播次数",
                "data": that.playNum
              },
              {
                "name": "点播用户数",
                "data": that.playUser
              }
            ];
            that.stat = [{stat:false},{stat:true},{stat:false}];
            that.Ytit = '点播量';
            that.unit = '';
            that.chat();
            that.hideCharts = true;
            break;
          case '3':
            this.X = [
              {
                "name": "点播时长",
                "data": that.playTime
              },
              {
                "name": "人均点播时长",
                "data": that.avgPlayTime
              }
            ];
            that.stat = [{stat:false},{stat:false},{stat:true}];
            that.Ytit = '点播量';
            that.unit = '分';
            that.chat();
            that.hideCharts = true;
            break;
        }
      },
      chartHideShow(){
        this.hideCharts = !this.hideCharts;
      },
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
            formatter: function() {return '<div>'+this.series.name + '：'+this.y+ that.unit+'</div>';}
          },
          legend:{
            verticalAlign: 'top',//设置图例垂直方向的对齐方式 可选：bottom top middle
          },exporting: { enabled: false },
          lang:{
            loading:"加载中",
            noData: '暂无数据'
          },
        });
      },
      init(){
        const that = this;
        that.arrTime = [];
        that.playNum = [];
        that.playUser = [];
        that.clickNum = [];
        that.clickUser = [];
        that.playTime = [];
        that.avgPlayTime = [];
        this.imgData.forEach(i=>{
          that.arrTime.push(i.ctime);
          that.playNum.push(i.playNum);
          that.playUser.push(i.playUser);
          that.clickNum.push(i.clickNum);
          that.clickUser.push(i.clickUser);
          that.playTime.push(i.playTime);
          that.avgPlayTime.push(i.avgPlayTime);
        });
        this.choose('1');
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
