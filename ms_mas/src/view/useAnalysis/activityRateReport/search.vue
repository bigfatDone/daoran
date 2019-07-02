<template>
  <div class="pa-pages-search">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">
      <div>
        <v-date
        buttons="['lastweek', 'lastmonth']"
        dateModel="3"
        @getDate="getDate($event)"></v-date>
      </div>
      <div>
        <v-select
          default-type="model-2"
          @condition="condition($event)"></v-select>
        <div class="btns">
          <el-button
            @click="search"
            :disabled="loading"
            type="primary"
            icon="el-icon-search">搜索</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  import vSelect from "@/view/component/search/search-select-link"
  export default {
    name: "activityRateReport-search",
    props:['searchType'],
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          list: "/ms_bas/activityRateReport/getTableData.do",
          img: "/ms_bas/activityRateReport/getImgData.do",
          listCount: "/ms_bas/activityRateReport/getTableData.do",
          listDetail: "/ms_bas/activityRateReport/getTableDataDetail.do"
        },
        search_form: {
          startDate: "",
          endDate: "",
          preDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
        },
        tableData: [],
        imgData: [],
        loading: false,
        default: true,
        ajaxReturn: false,
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    watch:{
      searchType(){
        this.toPostImgData();
      }
    },
    mounted () {
      //this.search();
    },
    methods: {
      init () {
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
      search () {
        let that = this;
        that.loading = true;
        that.$emit("searchImg", {name:[], xAxis:[], data:[]});
        that.$emit("loadingTable", that.loading);
        that.$emit("loadingImg", true);
        that.$emit("searchForm", that.search_form);
        that.$store.commit('changeMobileSearchState', false);
        that.DomTableData();
        /*that.$ajax({//表格数据
          url: that.url.list,
          data: that.search_form,
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
            that.$emit("loadingTable", that.loading);
          },
          error: function (err) {
            that.$message.error('请求失败搜索条件，请刷新页面');
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          }
        });*/
        that.$ajax({//图形数据
          url: that.url.img,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.imgData=res.data.data;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.imgData=[];
            }
            that.ajaxReturn =true;
            that.toPostImgData();
            that.$emit("loadingImg", false);
          },
          error: function (err) {
            that.$message.error('活跃率分析报表页面数据请求失败，请刷新活跃率分析报表页面');
            that.loading = false;
            that.$emit("loadingImg", false);
          }
        })
      },
      DomTableData () {
        var that = this;
        that.tableData = [];
        that.$ajax({//汇总
          //url: that.url.list,
          url: that.url.listCount,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              let result = res.data.data;
              that.tableData = result.concat(that.tableData);
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.tableData=[];
            }
            that.$emit("search", that.tableData);
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          },
          error: function (err) {
            that.$message.error('活跃率分析报表页面数据请求失败，请刷新活跃率分析报表页面');
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          }
        });

        that.$ajax({//详情
          url: that.url.listDetail,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              let result = res.data.data;
              that.tableData = that.tableData.concat(result);
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.tableData=[];
            }
            that.$emit("search", that.tableData);
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          },
          error: function (err) {
            that.$message.error('活跃率分析报表页面数据请求失败，请刷新活跃率分析报表页面');
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          }
        });
      },
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.sNodeCode;
        that.search_form.sProvinceCode = data.sProvinceCode;
        that.search_form.sProjectCode = data.sProjectCode;
        that.init();
      },
      getDate (data) {
        let that = this;
        that.search_form.startDate = data.start_date_1;
        that.search_form.endDate = data.end_date_1;
        that.search_form.preDate = data.start_date_2;
        that.init();
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      toPostImgData(){
        let that = this;
        if (that.imgData.length === 0 && that.ajaxReturn ===false){
          return;
        }
        that.ajaxReturn =false;
        let imgdata ={};
        if (that.imgData.length > 0){
          let name =['当前','对比'];
          let color =['#4e81bd','#c1504c'];
          let xAxis =[];
          let now =[];
          let before =[];
          that.imgData.forEach((item,index)=>{
            xAxis.push(item.ctime);
            for ( let key in item){
              if (that.searchType.code === key){
                if ('iStockAAvg' === key){
                  now.push(Number(item.iStockAAvg));
                  before.push(Number(item.compareStockA));
                }else if ('iStockPAvg' === key){
                  now.push(Number(item.iStockPAvg));
                  before.push(Number(item.compareStockP));
                }else if ('iStockPAvgTime' === key){
                  now.push(Number(item.iStockPAvgTime));
                  before.push(Number(item.compareStockTime));
                }
              }
            }
          });
          let data=[];
          data.push(now);
          data.push(before);

          imgdata.name=name;
          imgdata.color=color;
          imgdata.xAxis=xAxis;
          imgdata.data=data;
          imgdata.loading=false;
        }else {
          imgdata.name=['当前','对比'];
          imgdata.color=['#4e81bd','#c1504c'];
          imgdata.xAxis=[];
          imgdata.data=[[0],[0]];
          imgdata.loading=false;
        }
        that.$emit("searchImg", imgdata);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns {
    display: inline-block;
    vertical-align: top;
    margin: 5px 0 0 0;
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  @media screen and (max-width: 800px) {
    .btns {
      margin: 1rem 0 0 0;
      display: block;
      text-align: right;
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
  }
</style>
