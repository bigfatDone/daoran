<template>
  <div>
    <v-search @toParent="searchResult">
    </v-search>
    <el-collapse-transition>
      <div v-show="chartVisble">
        <v-chart
          :selectbars="selectbars"
          :chartLoading="chartLoading"
          :imgResultData="imgResultData"
          :showActive="showActive"
        >
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
          :searchResultData="searchResultData"
          :showActive="showActive"
          :loading="loading"
        ></v-table>
    </div>
  </div>
</template>

<script>
  import vSearch from "./component/search";
  import vChart from './chart';
  import vTable from "./table"
  export default {
    name: "ottAccessReport",
    components: {
      vSearch,vChart,vTable
    },
    data () {
      return {
        height: '500',// 表格默认高度
        loading: true,// 表格加载
        chartLoading: true,//表单加载
        searchData: {},// 搜索字段
        searchResultData: {},// 搜索字段
        tableData: [],// 表单数据
        imgResultData: [],// 图表数据
        selectbars:[ //图标切换指标
          {text:'新增用户活跃率',tooltip:'新增用户活跃率',status:true,code:'newUserRate',chartType:'spline',type:1,yPlus:'%',rate:'',value:'',up:''},
          {text:'周活跃率',tooltip:'周活跃率',status:false,code:'weekRate',chartType:'spline',type:2,yPlus:'%',rate:'',value:'',up:''},
          {text:'访问用户数',tooltip:'访问用户数',status:false,code:'accessUser',chartType:'spline',type:3,yPlus:'',rate:'',value:'',up:''},
        ],
        chartVisble:true,
        chartShowState:false,
        showActive: 1
      }
    },
    computed: {

    },
    watch: {

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
        that.searchResultData.version = $event.Version;
        that.searchResultData.dateType = $event.dateType;
        that.searchResultData.endDate = $event.endDate;
        that.searchResultData.itemCode = $event.itemCode;
        that.searchResultData.product = $event.product;
        that.searchResultData.startDate = $event.startDate;
        that.loading = true;
        that.chartLoading = true;
        switch (that.searchData.dateType) {
          case 'daily':
            that.showActive = 1;
            break;
          case 'week':
            that.showActive = 2;
            that.searchData.dateType = 'daily';
            break;
          case 'month':
            that.showActive = 3;
            that.searchData.dateType = 'week';
            break;
        }
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
          url: '/ms_bas/ott/activityRate/theme/getTable',
          data: that.searchResultData,
          method: 'post',
          success: function (res) {
            if( res.status) {
              that.tableData = res.data.data;
              that.loading = false;
            }
          },
          error: function (err) {
            that.$message.error('活跃率分析报表页面数据请求失败，请刷新活跃率分析报表页面')
          }
          })
      },
      //  获取图表数据
      getImg() {
        const  that = this;
        that.$ajax({
          url: '/ms_bas/ott/activityRate/theme/getImage',
          data: that.searchData,
          method: 'post',
          success: function (res) {
            if( res.status) {
                that.imgResultData = res.data.data;
                that.chartLoading = false;
            }
          },
          error: function (err) {
          that.$message.error('活跃率分析报表页面数据请求失败，请刷新活跃率分析报表页面')
        }
          })
      },
      //  汇总下载
      downloadTable(){
        let that = this;
        let url = "/ms_bas/ott/activityRate/theme/toExcel?startDate="+that.searchResultData.startDate +"&endDate="+that.searchResultData.endDate
          +"&product="+that.searchResultData.product +"&dateType="+that.searchResultData.dateType +"&version="+that.searchResultData.version +"&itemCode="+that.searchResultData.itemCode;
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
