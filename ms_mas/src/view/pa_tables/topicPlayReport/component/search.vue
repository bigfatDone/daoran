<template>
  <div class="search-select-link">
    <div
      class="searchContainCover"
      v-show="searchState"
      @click="hideSearch"></div>
    <div
      class="search-index"
      :class="{'show':searchState}">
      <el-button type="primary" class="backToIndex-PC" v-show="chartVisible" icon="el-icon-back" @click="backToIndex()" circle></el-button>
      <div class="search-date">
        <v-date
          buttons="['yesterday','sevenday', 'nearthirty']"
          dateModel="2"
          default-date="yesterday"
          @getDate="getDate($event)"></v-date>
      </div>
      <div class="search-others">
        <v-select
          v-if="refresh"
          @condition="condition($event)"></v-select>
        <div class="selection">
          <span class="label">专题:</span>
          <el-cascader
            placeholder="可输入搜索条件"
            size="mini"
            :options="subject"
            v-model="search_form.code"
            filterable
            :show-all-levels="false"
            change-on-select
            ></el-cascader>
        </div>
        <div class="btns">
          <el-button @click="search()" :disabled="loading" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button @click="synch()" :disabled="loading" type="primary" icon="el-icon-refresh">同步</el-button>
          <!--<el-button-->
            <!--@click="resetSearch()"-->
            <!--:disabled="loading"-->
            <!--type="primary"-->
            <!--icon="el-icon-refresh">-->
            <!--重置-->
          <!--</el-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vDate from "@/view/component/search/search-date-select"
import vSelect from "./link-select-topicPlayReport"
export default {
  name: 'search-topicPlayReport',
  props: ["chartVisible","searchType"],
  components: {
    vDate,vSelect
  },
  data () {
    return {
      url:{
        table:'/ms_bas/topicPlayReport/getTableData.do',
        img:'/ms_bas/topicPlayReport/getImage.do',
        topicTree:'/ms_bas/topicPlayReport/getTopicTree.do',
        synchronizationInfo:'/ms_bas/topicPlayReport/synchronizationInfo',
      },
      search_form: {
        startDate: "",
        endDate: "",
        sNodeCode: "",
        sProvinceCode: "",
        sProjectCode: "",
        code:[],
      },
      searchForm:{},

      loading:true,
      subject:[],
      imgData:[],

      search_form_old:{},
      searchChange:false,
      refresh: true,
    }
  },
  mounted () {
    this.topicTree();
  },
  watch:{
    chartVisible(ev){
      if(ev){
        this.search();
      }else if(this.searchChange){
        this.search();
        this.searchChange = false;
      }
    },
    searchType(ev){
      this.toPostImgData();
    }
  },
  computed: {
    searchState () {
      return this.$store.getters.getMobileSearchState;
    },
  },
  methods: {
    synch () {
      let that = this;
      that.loading = true;
      that.$emit("loading", that.loading);
      that.$ajax({
        url: that.url.synchronizationInfo,
        data: [],
        method: "post",
        success: function (res) {
          that.loading = false;
          that.$emit("loading", that.loading);
          if (res.data.status) {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.search();
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        },
        error: function (err) {
          that.$message.error('专题分析报表页面数据请求失败，请刷新专题分析报表页面');
        }
      });
    },
    hideSearch () {
      let that = this;
      that.$store.commit('changeMobileSearchState', false);
    },
    condition (data) {//节点项目
      let that = this;
      that.search_form.sNodeCode = data.sNodeCode;
      that.search_form.sProvinceCode = data.sProvinceCode;
      that.search_form.sProjectCode = data.sProjectCode;
      that.init();
    },
    getDate (data) {//时间
      let that = this;
      that.search_form.startDate = data.dateSart;
      that.search_form.endDate = data.dateEnd;
      that.init();
    },
    topicTree(){//专题列表
      let that = this;
      that.$ajax({
        url: that.url.topicTree,
        data: [],
        method: "post",
        success: function (res) {
          let result = res.data;
          if(result.status){
            that.subject = result.data;
            that.search_form.code.push(result.data[0].value);
          }else {
            that.$message({
              type: 'warning',
              message: '专题条件'+result.message
            });
          }
          that.init();
        },
        error: function (err) {
          that.$message.error('专题分析报表页面数据请求失败，请刷新专题分析报表页面');
        }
      });
    },
    init () {//初始化验证
      let that = this;

      let count = 0;
      if (that.default === false) {
        return;
      }
      for (let item in that.search_form) {
        if (that.search_form[item] == "" || that.search_form[item] === undefined) {
          count += 1;
        }
      }

      if (count > 0) {
        return;
      } else {
        that.default = false;
        that.search();
      }
    },
//    resetSearch () { // 重置搜索条件
//      let that = this;
//      that.refresh = false;
//      setTimeout(() => {
//        that.refresh = true;
//      }, 0);
//      setTimeout(() => { // 换个线程执行搜索
//        that.search();
//      }, 200);
//    },
    search () {
      let that = this;
      that.loading = true;
      that.$emit("searchForm", that.search_form);
      that.$emit("loading", that.loading);
      that.$store.commit('changeMobileSearchState', false);

      for (let key in that.search_form) {
        if (key === 'code') {//将数组转为实际搜索用的字符串
          let data = that.search_form[key];
          that.searchForm[key] = data[data.length-1];
        } else {
          that.searchForm[key] = that.search_form[key];
        }
      }

      if(that.chartVisible){
        that.searchImg();
        if(JSON.stringify(that.search_form_old) ==='{}'){
          for (let key in that.search_form) {
            that.search_form_old[key] =that.search_form[key];
          }
        }else {
          let count=0;
          for (let key in that.search_form) {
            if(that.search_form_old[key] !==that.search_form[key]){
              count +=1;
            }
            that.search_form_old[key] =that.search_form[key];
          }
          if(count>0){
            that.searchChange = true;
          }else {
            that.searchChange = false;
          }
        }
      }else {
        that.searchTable();
      }
    },
    searchTable(){//首页表格
      let that = this;
      that.$ajax({//表格数据
        url: that.url.table,
        data: that.searchForm,
        method: "post",
        success: function (res) {
          if (res.data.status === true) {
            that.tableData = res.data.data;
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            });
            that.tableData=[];
          }
          that.$emit("search", that.tableData);
          that.loading = false;
          that.$emit("loading", that.loading);
        },
        error: function (err) {
          that.$message.error('请求专题表格出错，请刷新页面');
          that.loading = false;
          that.$emit("loading", that.loading);
        }
      });
    },
    //趋势图
    searchImg(){
      let that = this;
      that.loading = true;
      that.$emit("searchImg", {name:[], xAxis:[], data:[]});
      that.$ajax({
        url: that.url.img,
        data: that.searchForm,
        method: "post",
        success: function (res) {
          let result = res.data;
          if (result.status) {
            that.imgData = result.data;
          } else {
            that.$message({
              type: 'warning',
              message: "趋势图数据"+result.message
            });
            that.imgData=[];
          }
          that.toPostImgData();
          that.loading = false;
          that.$emit("loading", that.loading);
        },
        error: function (err) {
          that.$message.error('专题分析报表页面数据请求失败，请刷新专题分析报表页面');
          that.loading = false;
          that.$emit("loading", that.loading);
          that.$emit("searchImg", {name:[], xAxis:[], data:[]});
        }
      });
    },
    toPostImgData(){
      let that = this;
      let imgdata ={};
      if (that.imgData !=='[]'){
        let name =[];
        let xAxis =[];
        let data =[];
        let datas =[];
        that.imgData.forEach((item,index)=>{
          xAxis.push(item.ctime);
          for ( let key in item){
            if (that.searchType.code === key){
              data.push(Number(item[key]));
            }
          }
        });
        name.push(that.searchType.text);
        datas.push(data);
        imgdata.name=name;
        imgdata.xAxis=xAxis;
        imgdata.data=datas;
      }else {
        imgdata.name=[];
        imgdata.xAxis=[];
        imgdata.data=[0];
      }
      that.$emit("searchImg", imgdata);
    },
    backToIndex(){
      let that = this;
      that.$emit("chartVisible", false);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  .selection{
    vertical-align: middle;
    display: inline-block;
    position: relative;
    width: 180px;
    height: 37px;
    padding: 0 0 0 50px;
  }
  .label{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 27px;
    color: #666;
    font-size: .65rem;
  }
  .el-cascader{
    width: 80%;
  }
  .btns {
    height: 37px;
    margin: 0;
    display: inline-block;
    vertical-align: middle;
  }
  .backToIndex-PC, .search-date{
    display: inline-block;
  }
  @media screen and (max-width: 800px) {
    .selection{
      width: 100%;
    }
    .search-index {
      position: fixed;
      top: 3rem;
      left: 0;
      right: 0;
      z-index: 6;
      background: #fff;
      padding: 1.2rem;
      display: none;
    }
    .searchContainCover{
      position: fixed;
      z-index: 5;
      background: rgba(0,0,0,0.3);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .search-date{
      display: block;
    }
    .backToIndex-PC{
      display: none;
    }
  }
</style>
