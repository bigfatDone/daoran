<template>
  <div class="pa-pages-search">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">
      <v-date
        buttons="['yesterday', 'lastweek', 'lastmonth']"
        dateModel="2"
        @getDate="getDate($event)"></v-date>
      <div>
        <v-select @condition="condition($event)"></v-select>
        <div class="btns">
          <el-button
            @click="search"
            :disabled="loading"
            type="primary"
            icon="el-icon-search">搜索</el-button>
          <el-button
            @click="trend"
            :disabled="loading"
            type="primary"
            icon="el-icon-picture">查看趋势图</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  import vSelect from "@/view/component/search/select_summaryInput"
  export default {
    name: "accessEntryReport-search",
    props:['searchType','provinceAlone'],
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          summaryList: "/ms_bas/accessEntryReport/getTbSummaryData.do",
          detailList: "/ms_bas/accessEntryReport/getTbDetailData.do",
          img: "/ms_bas/accessEntryReport/getImgData.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
          entryName: "",
        },
        tableData1: [],
        tableData2: [],
        imgData: [],
        loading: true,
        default: true,
        ajaxReturn: false,
        chart:null,
        provinceOne:'',
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
      tableData () {
        let that = this;
        let arr = [];
        return  arr.concat(that.tableData1, that.tableData2);
      },
    },
    watch:{
      searchType(even){
        this.toPostImgData();
      },
      provinceAlone(event){
        this.provinceOne = event;
        this.searchImg();
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
        that.$emit("trendState", false);
        that.provinceOne = '';
        that.$emit("loadingTable", true);
        that.$emit("searchForm", that.search_form);
        that.$store.commit('changeMobileSearchState', false);
        that.tableData1 = [];
        that.tableData2 = [];
        let form_data = {
          startDate: that.search_form.startDate,
          endDate: that.search_form.endDate,
          sNodeCode: that.search_form.sNodeCode,
          sProvinceCode: that.search_form.sProvinceCode,
          sProjectCode: that.search_form.sProjectCode,
          entryName: that.search_form.entryName,
          reportId:4
        };
        that.$ajax({//汇总数据
          url: that.url.summaryList,
          data: form_data,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.tableData1 = res.data.data;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.tableData1 = [];
            }
            that.$emit("search", that.tableData);
            that.$emit("loadingTable", false);
            that.loading = false;
          },
          error: function (err) {
            that.$message.error('入口访问数据报表页面数据请求失败，请刷新入口访问数据报表页面');
            that.tableData1 = [];
            that.loading = false;
          }
        });
        that.$ajax({//每日数据
          url: that.url.detailList,
          data: form_data,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.tableData2 = res.data.data;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.tableData2 = [];
            }
            that.$emit("loadingTable", false);
            that.$emit("search", that.tableData);
            that.loading = false;
          },
          error: function (err) {
            that.$message.error('入口访问数据报表页面数据请求失败，请刷新入口访问数据报表页面');
            that.tableData2 = [];
            that.loading = false;
          }
        });
//        that.searchImg();
      },
      searchImg(){
        let that =this;
        that.loading = true;
        that.$emit("searchImg", {name:[], xAxis:[], data:[]});
        that.$emit("loadingImg", true);
        let img_data={};
        if (that.provinceOne === ''){
          img_data = {
            startDate: that.search_form.startDate,
            endDate: that.search_form.endDate,
            sNodeCode: that.search_form.sNodeCode,
            sProvinceCode: that.search_form.sProvinceCode,
            sProjectCode: that.search_form.sProjectCode,
            entryName: that.search_form.entryName,
            type:1,
          };
        }else {
          img_data = {
            startDate: that.search_form.startDate,
            endDate: that.search_form.endDate,
            sNodeCode: that.search_form.sNodeCode,
            sProvinceCode: that.provinceOne,
            sProjectCode: that.search_form.sProjectCode,
            entryName: that.search_form.entryName,
            type:1,
          };
        }
        that.imgData=[];
        if (img_data.sNodeCode === '' || img_data.sProvinceCode === '' || img_data.sProjectCode === ''){
          return;
        }
        that.$store.commit('changeMobileSearchState', false);
        that.$ajax({//图形数据
          url: that.url.img,
          data: img_data,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.imgData= res.data.data;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.imgData=[];
            }
            that.loading = false;
            that.$emit("loadingImg", false);
            that.toPostImgData();
          },
          error: function (err) {
            that.$message.error('入口访问数据报表页面数据请求失败，请刷新入口访问数据报表页面');
            that.$emit("searchImg", {name:[], xAxis:[], data:[]});
            that.loading = false;
          }
        })
      },
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.province;
        that.search_form.sProvinceCode = data.city;
        that.search_form.sProjectCode = data.product;
        that.search_form.entryName = data.entryName;
        console.log(that.search_form)
        that.init();
        that.search();
      },
      getDate (data) {
        let that = this;
        that.search_form.startDate = data.dateSart;
        that.search_form.endDate = data.dateEnd;
        that.init();
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      toPostImgData(){
        let that = this;
        let imgdata ={};
        if (that.imgData.length > 0){
          let name =[];
          let xAxis =[];
          let data =[];
          that.imgData.forEach((item,index)=>{
            let x =[];
            let select=[];
            name.push(item.entry);
            item.data.forEach((obj,i)=>{
              x.push(obj.ctime);
              for(let key in obj){
                if ( key === that.searchType.code){
                  select.push(obj[key]);
                }
              }
            });
            xAxis.push(x);
            data.push(select);
          });
          imgdata.name=name;
          imgdata.xAxis=xAxis[0];
          imgdata.data=data;
        }else {
          return
        }
        that.$emit("searchImg", imgdata);
      },
      trend(){//查看趋势图
        let that = this;
        that.$emit("trendState", true);
        that.searchImg();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns {
    display: inline-block;
    vertical-align: top;
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
