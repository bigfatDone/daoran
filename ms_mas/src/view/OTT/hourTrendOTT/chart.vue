<template>
  <div class="chart-wrap">
    <div class="chart-setting">
      <div class="chart-conditionType">
        <el-button-group v-if="initIOSstate">
          <el-tooltip placement="top-start" effect="light" popper-class="tooltips-auto" v-for="(item,index) in selectbars" :key="item.text">
            <div slot="content">{{item.tooltip}}</div>
            <el-button @click="chartChange(item.code,item.chartType)" :class="{ 'active-button-group': item.status }">{{item.text}}</el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group v-for="(item,index) in selectbars" :key="item.text" v-else="initIOSstate">
          <el-button @click="chartChange(item.code,item.chartType)" :class="{ 'active-button-group': item.status }">{{item.text}}</el-button>
        </el-button-group>
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

    <div id="chart"></div>
  </div>
</template>

<script>
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'chart-wrap',
    components: {
      vSelect
    },
    props: ['selectbars','imgData','loadingImg'],
    data () {
      return {
        chart: null,
        initIOSstate:true,//针对IOS隐藏tooltips
        charttype:'',
        yPlus:'',
        chartState: "",

        chartSelect: true,
      }
    },
    computed: {
      selectArr () {
        return this.$store.getters.getSelectArr;
      },
    },
    mounted () {
      this.initSelectBars();
      this.chartChange();
    },
    watch:{
      loadingImg(event){
        this.initChart();
      },
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
        //是否显示tooltips
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          that.initIOSstate = true;
        }
        if (isIOS) {
          that.initIOSstate = false;
        }
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
            },
            series: {
              cursor: 'pointer',
              events: {
                click: function(e) {
                  that.clickSeries(e);
                }
              }
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
        that.chart = this.$Highcharts.chart('chart', option);

        if (that.imgData.loading === true){
          that.chart.showLoading();
        }else {
          that.chart.hideLoading();
        }
      },
      clickSeries(e){
        let that = this;
        let all=that.chart.series;
        let serie = e.point.series;
        all.forEach((item,index)=>{
          if (that.chartSelect === true) {
            item.hide();
          } else {
            item.show();
          }
        });
        serie.show();
        that.chartSelect = !that.chartSelect;
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
