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
    name: "orderOffRate-search",
    props:['searchType'],
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          list: "/ms_bas/orderOffRate/getTableData.do",
          listCount: "/ms_bas/orderOffRate/getTbSummaryData.do",
          listDetail: "/ms_bas/orderOffRate/getTableData.do",
          spline: "/ms_bas/orderOffRate/getOrderOffLines.do",
          column: "/ms_bas/orderOffRate/getOrderOffImg.do",
          column2: "/ms_bas/orderOffRate/getOnlineTimeImg.do",
          pie: "/ms_bas/orderOffRate/getOnlineTimeCircle.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          preDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
        },
        preEndDate: "",
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
        that.$emit("searchForm", that.search_form);
        that.$emit("searchImg", {name:[], xAxis:[], data:[]});
        that.$emit("loadingTable", that.loading);
        that.$store.commit('changeMobileSearchState', false);
        that.toPostImgData();
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
            that.$message.error('退订率分析报表页面数据请求失败，请刷新退订率分析报表页面');
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
            that.$message.error('退订率分析报表页面数据请求失败，请刷新退订率分析报表页面');
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
        that.preEndDate = data.end_date_2;
        that.init();
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      toPostImgData(){
        let that = this;
        let count = 0;
        for (let item in that.search_form) {
          if (that.search_form[item] == "" || that.search_form[item] === undefined) {
            count += 1;
          }
        }
        if (count > 0) {
          return;
        }
        that.$emit("loadingImg", true);
        let url='';
        let search_data={};
        if(that.searchType.code ==="pie"){
          url = that.url.pie;
          search_data = {
            startDate: that.search_form.startDate,
            endDate: that.search_form.endDate,
            sNodeCode: that.search_form.sNodeCode,
            sProvinceCode: that.search_form.sProvinceCode,
            sProjectCode: that.search_form.sProjectCode,
            reportId:6
          }
        }else {
          search_data = {
            startDate: that.search_form.startDate,
            endDate: that.search_form.endDate,
            sNodeCode: that.search_form.sNodeCode,
            sProvinceCode: that.search_form.sProvinceCode,
            sProjectCode: that.search_form.sProjectCode,
            compStartDate:that.search_form.preDate,
            compEndDate:that.preEndDate,
          };
          if (that.searchType.code ==="offRate"){
            url = that.url.spline;
          }else if(that.searchType.code ==="offRate_column") {
            url = that.url.column;
          }else if(that.searchType.code ==="onTimeAvg"){
            url = that.url.column2;
          }
        }
        if (url ===''){
          return;
        }
        that.$ajax({//图形数据
          url: url,
          data: search_data,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.imgData=res.data;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.imgData= [];
            }
            let imgdata ={};
            let name =['当前','对比'];
            let color =['#4e81bd','#c1504c'];
            let xAxis =[];
            let now = [];
            let before = [];
            let data=[];
            if (that.searchType.code === 'offRate'){
              if (that.imgData.nowData.length >0 && that.imgData.compareData.length >0) {
                that.imgData.nowData.forEach((item, index) => {
                  xAxis.push(item.ctime);
                  now.push(Number(item.offRate));
                });
                that.imgData.compareData.forEach((item, index) => {
                  before.push(Number(item.offRate));
                });
              }else if (that.imgData.nowData.length >0 && that.imgData.compareData.length ===0) {
                that.imgData.nowData.forEach((item, index) => {
                  xAxis.push(item.ctime);
                  now.push(Number(item.offRate));
                  before.push(0);
                });
              }else if(that.imgData.compareData.length >0 && that.imgData.nowData.length ===0) {
                that.imgData.compareData.forEach((item, index) => {
                  before.push(Number(item.offRate));
                  now.push(0);
                });
              }else {
                now=[0];
                before=[0];
              }
              data.push(now);
              data.push(before);
            }else if (that.searchType.code === 'offRate_column'){
              xAxis.push(that.imgData.nowData[0].ctime);
              now.push(that.imgData.nowData[0].offRate);
              before.push(that.imgData.compareData[0].offRate);
              data.push(now);
              data.push(before);
            }else if(that.searchType.code === 'onTimeAvg'){
              xAxis.push(that.imgData.nowData[0].ctime);
              now.push(that.imgData.nowData[0].onTimeAvg);
              before.push(that.imgData.compareData[0].onTimeAvg);
              data.push(now);
              data.push(before);
            }else if (that.searchType.code === 'pie'){
              name=['1个月以内','1-3个月','3-6个月','6-12个月','12个月以上'];
              color =['#4572a7','#aa4643','#89a54e','#71588f','#4198af'];
              data=[
                that.imgData.data[0].timeAvgOne,
                that.imgData.data[0].timeAvgTwo,
                that.imgData.data[0].timeAvgThree,
                that.imgData.data[0].timeAvgFour,
                that.imgData.data[0].timeAvgFive
              ];
            }
            imgdata.name=name;
            imgdata.color=color;
            imgdata.xAxis=xAxis;
            imgdata.data=data;
            imgdata.loading=false;
            that.$emit("searchImg", imgdata);
            that.$emit("loadingImg", false);
          },
          error: function (err) {
            that.$message.error('退订率分析报表页面数据请求失败，请刷新退订率分析报表页面');
            that.loading = false;
            that.$emit("loadingImg", false);
          }
        })
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
