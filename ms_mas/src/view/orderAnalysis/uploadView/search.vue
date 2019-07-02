<template>
  <div class="pa-pages-search">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">
      <div class="date-input-group">
        <el-button-group>
          <el-button v-for="(item,index) in select" :key="item.text" @click="dateSet(item.id)" class="date-fast-group" :class="{ active: item.status }">{{item.text}}</el-button>
        </el-button-group>
        <el-date-picker
          v-model="search_form.date"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @input="datechanges($event)">
        </el-date-picker>
      </div>
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
</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  import vSelect from "@/view/component/search/search-select-link"
  export default {
    name: "uploadView-search",
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          list: "/ms_bas/uploadView/queryResult.do",
        },
        select:[
          {id:'lastmonth',text:'上个月',status:false},
        ],
        search_form: {
          date: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
        },
        tableData: [],
        loading: true,
        default: true,
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    mounted () {
      this.dateInit();
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
        that.$store.commit('changeMobileSearchState', false);
        that.$emit("searchData", that.search_form);
        that.$emit("loading", true);
        that.$ajax({
          url: that.url.list,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.tableData = res.data.data;
              that.$emit("search", that.tableData);
            } else {
              that.$emit("search", []);
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }
            that.loading = false;
            that.$emit("loading", false);
          },
          error: function (err) {
            that.$message.error('局方数据汇总页面数据请求失败，请刷新局方数据汇总页面');
            that.$emit("search", []);
            that.loading = false;
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
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      datechanges(date){
        let that = this;
        that.select.forEach((item,index)=>{
          item.status = false;
        });
      },
      dateSet (id){
        let that =this;
        that.select.forEach((item,index)=>{
          if(item.id === id){
            item.status = true;
          }else {
            item.status = false;
          }
        });
        that.lastmonth();
      },
      lastmonth(){
        let that =this;
        const setdate = new Date();
        let years = setdate.getFullYear();
        let month = setdate.getMonth();
        if (month === 0){
          month = 12;
          years=years-1;
        }
        const monthSet = new Date(years,month-1,1);
        that.search_form.date=that.$dateFormat(monthSet.setTime(monthSet.getTime()),"yyyy-MM");
      },
      dateInit(){
        let that =this;
        const setdate = new Date();
        let years = setdate.getFullYear();
        let month = setdate.getMonth();
        if (month === 0){
          month = 12;
          years=years-1;
        }
        const monthSet = new Date(years,month,1);
        that.search_form.date=that.$dateFormat(monthSet.setTime(monthSet.getTime()),"yyyy-MM");
        that.init();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns {
    display: inline-block;
    vertical-align: top;
    padding: .3rem 0;
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  .date-input-group{
    margin: 0;
    padding:0 0 8px 0;
    width: 250px;
    display:block;
  }
  .el-date-editor.el-input{
    width: 70%;
    min-width: 130px;
  }
  .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
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
