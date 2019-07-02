<template>
  <div>
    <v-search @toParent="searchResult">
      <div class="selection" slot="historyBack" style="width: 60px;">
        <el-button @click="history" type="primary" icon="el-icon-search">查看历史页面</el-button>
      </div>
    </v-search>
    <el-collapse-transition>
      <div v-show="chartVisble">
        <v-chart
          :selectbars="selectbars"
          :chartLoading="chartLoading"
          :imgResultData="imgResultData">
        </v-chart>
      </div>
    </el-collapse-transition>
    <div :class="['hideCharts',{'changeHideCharts':chartShowState}]" @click="chartHideShow()"><i class="el-icon-caret-top"></i></div>
    <div style="padding-top:50px;">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <v-table
        :height="height"
        :tableData="tableData"
        :loading="loading"></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "../../../component/common/OTTsearch";
  import vChart from './chart';
  import vTable from "./table"
  export default {
    name: "NewTrendOTT",
    components: {
      vSearch,vChart,vTable
    },
    data () {
      return {
        height: '500',// 表格默认高度
        loading: true,// 表格加载
        chartLoading: true,//表单加载
        searchData: {},// 搜索字段
        tableData: [],// 表单数据
        imgResultData: [],// 图表数据
        selectbars:[ //图标切换指标
          {text:'访问用户数',tooltip:'访问用户数',status:true,code:'accessUser',chartType:'spline',type:1,yPlus:'',rate:'',value:'',up:''},
          {text:'新增用户数',tooltip:'新增用户数',status:false,code:'newUser',chartType:'spline',type:2,yPlus:'',rate:'',value:'',up:''},
          {text:'新增会员数',tooltip:'新增会员数',status:false,code:'newMember',chartType:'spline',type:3,yPlus:'',rate:'',value:'',up:''},
          {text:'新增VIP数',tooltip:'新增VIP数',status:false,code:'newVip',chartType:'spline',type:4,yPlus:'',rate:'',value:'',up:''},
          {text:'订购成功数',tooltip:'订购成功数',status:false,code:'orderSuccessNum',chartType:'spline',type:5,yPlus:'',rate:'',value:'',up:''},
          {text:'点播用户数',tooltip:'点播用户数',status:false,code:'playUserNum',chartType:'spline',type:6,yPlus:'',rate:'',value:'',up:''},
          {text:'点播次数',tooltip:'点播次数',status:false,code:'playNum',chartType:'spline',type:7,yPlus:'',rate:'',value:'',up:''},
          {text:'收入流水',tooltip:'收入流水',status:false,code:'priceSale',chartType:'spline',type:8,yPlus:'',rate:'',value:'',up:''},
        ],
        chartVisble:true,
        chartShowState:false,
      }
    },
    computed: {

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
    },
    methods:{
      // search组件向父组件传递内容
      searchResult($event){
        let that = this;
        that.searchData.version = $event.Version;
        that.searchData.dateType = $event.dateType;
        that.searchData.endDate = $event.endDate;
        that.searchData.itemCode = $event.itemCode;
        that.searchData.product = $event.product;
        that.searchData.startDate = $event.startDate;
        that.loading = true;
        that.chartLoading = true;
        this.getTable();
        this.getImg();
      },
      history(){
        this.$emit('backHistory',true);
      },
      //  获取表格数据
      getTable() {
        const  that = this;
        that.$ajax({
          url: '/ms_bas/ott/trendTheme/getTable',
          data: that.searchData,
          method: 'post',
          success: function (res) {
            if( res.status) {
              that.tableData = res.data.data;
              that.loading = false;
            }
          },
          error: function (err) {
            that.$message.error('趋势分析(新)页面数据请求失败，请刷新趋势分析(新)页面')
          }
          })
      },
      //  获取图表数据
      getImg() {
        const  that = this;
        that.$ajax({
          url: '/ms_bas/ott/trendTheme/getImage',
          data: that.searchData,
          method: 'post',
          success: function (res) {
            if( res.status) {
                that.imgResultData = res.data.data;
                that.chartLoading = false;
            }
          },
          error: function (err) {
          that.$message.error('趋势分析(新)页面数据请求失败，请刷新趋势分析(新)页面')
        }
          })
      },
      //  汇总下载
      downloadTable(){
        let that = this;
        let url = "/ms_bas/ott/trendTheme/toExcel?startDate="+that.searchData.startDate +"&endDate="+that.searchData.endDate
          +"&product="+that.searchData.product +"&dateType="+that.searchData.dateType +"&version="+that.searchData.version +"&itemCode="+that.searchData.itemCode;
        window.open(encodeURI(url));
      },
      //  隐藏hightchart小按钮
      chartHideShow() {
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

</style>
