<template>
  <div class="pages">
    <el-radio-group
      v-model="checkTableImg"
      @change="changeTableImg"
      class="checkTableImg"
      size="mini">
      <el-radio-button label="table">表</el-radio-button>
      <el-radio-button label="img">图</el-radio-button>
    </el-radio-group>

    <v-search
      @search="searchResult($event)"
      @searchImg="getResultImg($event)"
      @searchData="searchDataResult($event)"
      @loadingImg="loadingImgReturn($event)"
      @loading="loadingResult($event)"
      :selectbars="selectbars"
      :tableType="tableType"
      :search-type="searchType"></v-search>

    <div v-show="tableVisble">
      <el-button-group class="downloadTable">
        <el-button type="primary" icon="el-icon-download" @click="downloadTable()">下载Excel</el-button>
      </el-button-group>
      <!--<el-button-group class="downloadTable">-->
        <!--<el-button type="primary" icon="el-icon-view" @click="detail()">查看详情</el-button>-->
      <!--</el-button-group>-->
      <div>
        <el-button-group>
          <el-button
            v-for="(item,index) in selectbars"
            :key="item.text"
            @click="getTable(item.id)"
            class="date-fast-group"
            :class="{ active: item.status }">{{item.text}}</el-button>
        </el-button-group>
      </div>
      <v-table
        :height="height"
        :table-data="tableData"
        :tableType="tableType"
        :loading="loading"></v-table>
    </div>

    <!-- 明细 -->
    <el-dialog
      title="订购分析明细"
      custom-class="detaiTable"
      fullscreen
      :visible.sync="detailVisble">
      <v-detail
        v-if="detailVisble"
        :table-data="detaiTable"
        :search_form="search_form"
        v-loading="loadingDetail"
      ></v-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisble = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import vSearch from "./search"
  import vTable from "./table"
  import vDetail from "./table_detail"
  export default {
    name: "stockUserOTT",
    components: {
      vSearch,vTable,vDetail
    },
    data () {
      return {
        tableType:'',
        search_form: [],

        tableData:[],
        loading:false,
        height:'500',
        tableVisble:true,

        selectbars:[
          {id: 'new', text:' 新用户留存' ,status: true, },
          {id: 'access', text: '活跃用户留存', status: false, },
        ],
        imgData: {
          name:[],
          xAxis:[],
          data:[],
        },
        chartVisble:true,
        loadingImg:false,
        imgDataState:false,
        chartShowState:false,
        searchType:{},

        checkTableImg:'table',

        detaiTable:[],
        loadingDetail:true,
        detailVisble:false,
      }
    },
    computed: {

    },
    created () {
      let that = this;
      console.log(document.body.clientWidth )
      if (document.body.clientWidth > 800){
        that.height=document.body.clientHeight - 260;
      }
    },
    mounted () {
      this.changeTableImg();
    },
    methods: {
      getTable (id) {
        let that = this;
        that.selectbars.forEach((item, index) => {
          if (item.id === id) {
            item.status = true;
            this.tableType = id;
          } else {
            item.status = false;
          }
        });
      },
      searchDataResult(data){
        let that = this;
        that.search_form = data;
      },
      searchResult(data){
        let that = this;
        that.tableData = data;
      },
      loadingResult(state){
        let that = this;
        that.loading = state;
      },
      changeTableImg(){
        let that = this;
        if (document.body.clientWidth > 800){
          that.chartVisble=true;
          that.tableVisble=true;
        }else {
          if (that.checkTableImg === 'table'){
            that.chartVisble=false;
            that.tableVisble=true;
          }else {
            that.chartVisble=true;
            that.tableVisble=false;
          }
        }
      },
      loadingImgReturn(state){
        let that = this;
        that.loadingImg = state;
      },
      getResultImg (data) {
        let that = this;
        that.imgData = data;
        that.imgDataState = !that.imgDataState;
      },
      chartTypeChange(data){
        let that = this;
        that.searchType = data;
      },
      chartHideShow(){
        let that = this;
        that.chartVisble= !that.chartVisble;
        that.chartShowState= !that.chartShowState;
        // if (that.chartVisble === true){
        //   that.height='500';
        // }else {
          that.height=document.body.clientHeight - 320;
        // }
      },
      detail(){
        let that = this;
        that.loadingDetail = true;
        that.detailVisble = true;
        that.$ajax({
          url: "/ms_bas/ott/order/getDetail.do",
          data: that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            if (result.status === true) {
              that.detaiTable = result.data;
            } else {
              that.$message({
                type: 'warning',
                message: result.message
              });
              that.detaiTable = [];
            }
            that.loadingDetail = false;
          },
          error: function (err) {
            that.$message.error('留存分析页面数据请求失败，请刷新留存分析页面');
            that.detaiTable = [];
            that.loadingDetail = false;
          }
        });
      },
      downloadTable(){//汇总下载
        let that = this;
        let type = '';
        this.tableType === 'access' ?  type = '2' : type = '1';
        let url = "/ms_bas/ott/user/stock/toExcel?startDate="+that.search_form.startDate +"&endDate="+that.search_form.endDate
          +"&json="+that.search_form.json +"&type=" + type;
        window.open(encodeURI(url));
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .downloadTable{
    padding: 12px 0;
  }
  .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
</style>
