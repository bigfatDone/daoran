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
          buttons="['yesterday', 'lastweek', 'lastmonth']"
          dateModel="2"
          default-date="yesterday"
          @getDate="getDate($event)"></v-date>
      </div>
      <div>
        <v-select @condition="condition($event)"></v-select>
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
  import vSelect from "@/view/component/search/select_summaryIndex"
  export default {
    name: "hoursAccess-search",
    props:['searchType'],
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          list: "/ms_bas/hoursAccess/getTableData.do",
          img: "/ms_bas/hoursAccess/getImgData.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
        },
        tableData: [],
        imgData: [],
        loading: false,
        default: true,
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
        that.$emit("searchForm", that.search_form);
        that.$emit("loadingTable", that.loading);
        that.$emit("loadingImg", true);
        that.$store.commit('changeMobileSearchState', false);
        that.$ajax({//表格数据
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
            that.$message.error('分时段数据报表页面数据请求失败，请刷新分时段数据报表页面');
            that.tableData=[];
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          }
        });
        that.$ajax({//图形数据
          url: that.url.img,
          data: that.search_form,
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
              that.$emit("searchImg", {name:[], xAxis:[], data:[]});
            }
            that.toPostImgData();
            that.loading = false;
          },
          error: function (err) {
            that.$message.error('分时段数据报表页面数据请求失败，请刷新分时段数据报表页面');
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
        that.init();
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
          let sProvinceName =[];
          let xAxis =[];
          let data =[];
          that.imgData.forEach((item,index)=>{
            let x =[];
            let select=[];
            item.data.forEach((obj,i)=>{
              if (i === 0){
                sProvinceName.push(obj.sProvinceName);
              }
              x.push(obj.sHours);
              for(let key in obj){
                if ( key === that.searchType.code){
                  select.push(obj[key]);
                }
              }
            });
            xAxis.push(x);
            data.push(select);
          });
          imgdata.name=sProvinceName;
          imgdata.xAxis=xAxis[0];
          imgdata.color=['#4e81bd'];
          imgdata.data=data;
        }else {
          return;
        }
        that.$emit("loadingImg", false);
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
