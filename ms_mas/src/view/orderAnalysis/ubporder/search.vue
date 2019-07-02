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
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions0"
          @input="datechanges($event)">
        </el-date-picker>
        <span class="date-font">至</span>
        <el-date-picker
          v-model="search_form.endDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions1"
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
  import vSelect from "@/view/component/search/select_summaryType"
  export default {
    name: "ubporder-search",
    components: {
      vDate, vSelect
    },
    data () {
      return {
        changeCount: 0,
        url: {
          list: "/ms_bas/ubporder/actionType.do",
          error: "/ms_bas/ubporder/errorType.do",
        },
        select:[
          {id:'yesterday',text:'昨日',status:true},
        ],
        search_form: {
          date: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
          trigger: "",
          strategy: "",
        },
        tableData: [],
        tableErrorData: [],
        loading: true,
        default: true,
        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            if (this.search_form.endDate != "") {
              return time.getTime() > Date.now()-3600 * 1000 * 24 || time.getTime() >  new Date(this.search_form.endDate);
            } else {
              return time.getTime() > Date.now()-3600 * 1000 * 24;
            }
          },
        },
        pickerOptions1: {//限定结束时间不能在开始时间之前
          disabledDate: (time) => {
            return time.getTime() < new Date(this.search_form.date).getTime()-3600 * 1000 * 24 || time.getTime() > Date.now()-3600 * 1000 * 24;
          },
        },
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    mounted () {
      this.yesterday();
      // this.search();
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
        that.$store.commit('changeMobileSearchState', false);
        that.loading = true;
        that.$emit("searchData", that.search_form);
        that.$emit("loading", that.loading);
        that.$ajax({
          url: that.url.list,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.tableData = res.data.data;
            } else {
              that.tableData = [];
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }
            that.$emit("search", that.tableData);
            that.loading = false;
            that.$emit("loading", that.loading);
          },
          error: function (err) {
            that.$message.error('UBP订购分析报表页面数据请求失败，请刷新UBP订购分析报表页面');
            that.loading = false;
            that.tableData = [];
            that.$emit("search", that.tableData);
            that.$emit("loading", that.loading);
          }
        });
        that.$ajax({
          url: that.url.error,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.tableErrorData = res.data.data;
              that.$emit("searchErrorType", that.tableErrorData);
            } else {
              that.$emit("searchErrorType", []);
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }
            that.loading = false;
            that.$emit("loading", that.loading);
          },
          error: function (err) {
            that.$message.error('UBP订购分析报表页面数据请求失败，请刷新UBP订购分析报表页面');
            that.loading = false;
            that.$emit("loading", that.loading);
          }
        });
      },
      // 子组件向父组件传递数据
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.province;
        that.search_form.sProvinceCode = data.city;
        that.search_form.sProjectCode = data.product;
        that.search_form.trigger = data.trigger;
        that.search_form.strategy = data.strategy;
        console.log(that.search_form);
        if( this.changeCount === 0){
          that.search();
          this.changeCount ++ ;
        } else {
            return;
        }
//        that.init();
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
        that.yesterday();
      },
      yesterday(){
        let that =this;
        const setdate = new Date();
        let yesterday = that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
        that.search_form.date = yesterday;
        that.search_form.endDate = yesterday;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .date-font{
    margin: 0 .2rem 0 .2rem;
    font-size: .5rem;
  }
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
  .date-input-group{
    margin: 0;
    padding:0 0 8px 0;
    width: 500px;
    display:block;
  }
  .el-date-editor.el-input{
    width: 35%;
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
