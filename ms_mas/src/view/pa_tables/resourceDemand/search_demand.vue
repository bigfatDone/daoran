<template>
  <div class="pa-pages-search">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">
      <div class="inline-block">
        <div class="date-demension">
          <v-date
          buttons="['yesterday','sevenday', 'nearthirty']"
          dateModel="2"
          default-date="yesterday"
          @getDate="getDate($event)"></v-date>
        </div>
      </div>
      <div class="inline-block">
        <div class="project-demension">
          <v-select
            default-type="model-2"
            @condition="condition($event)"></v-select>
        </div>
      </div>
      <div class="inline-block">
        <div class="source-demension">
          <v-select-source
            @sourceCondition="sourceCondition($event)"></v-select-source>
        </div>
      </div>
      <div class="inline-block">
        <div class="other-demension">
          <div class="selection">
            <span class="label">编码:</span>
            <el-input
              class="input"
              placeholder="请输入编码"
              v-model="search_form.code"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="btns">
          <el-button
            @click="search('reset')"
            :disabled="loading"
            type="primary"
            icon="el-icon-search">搜索</el-button>
          <!--<el-button-->
            <!--@click="refresh"-->
            <!--:disabled="loading"-->
            <!--type="primary"-->
            <!--icon="el-icon-refresh">重置</el-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  import vSelect from "@/view/component/search/search-select-link"
  import vSelectSource from "./component/select_source"
  export default {
    name: "resourceDemand-search",
    props:['pageindex'],
    components: {
      vDate, vSelect,vSelectSource
    },
    data () {
      return {
        url: {
          table: "/ms_bas/resPlayReport/getTableData.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
          type: "",
          xingshi: "",
          tableType:1,
          rows:100,
          page:1,
          code:""
        },
//        refresh_form:{},
//        Initstate:false,
//        Initstate2:false,

        tableData: [],

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
      pageindex(ev){
        this.pageChage(ev);
      }
    },
    mounted () {
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
        if(that.search_form.code === ""){
          count -= 1
        }
        if (count > 0) {
          return;
        } else {
          that.default = false;
//          for (let key in that.search_form){
//            that.refresh_form[key] = that.search_form[key]
//          }
          that.search();
        }
      },
      search (state) {
        let that = this;
        that.loading = true;
        if(state === 'reset'){
          that.search_form.page = 1;
        }
        that.$emit("searchForm", that.search_form);
        that.$emit("loadingTable", that.loading);
        that.$store.commit('changeMobileSearchState', false);
        if(that.search_form.code !==''){
          that.search_form.page = 1;
        }
        that.$ajax({//表格数据
          url: that.url.table,
          data: that.search_form,
          method: "post",
          success: function (res) {
            let count;
            if (res.data.status === true) {
              that.tableData = res.data.data;
              count=res.data.count;
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
              that.tableData=[];
              count=1;
            }
            that.$emit("search", that.tableData);
            that.$emit("count", count);
            that.loading = false;
            that.$emit("loadingTable", that.loading);
          },
          error: function (err) {
            that.$message.error('资源点播分析报表页面数据请求失败，请刷新资源点播分析报表页面');
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
//        that.Initstate = false;
        that.init();
      },
      sourceCondition(data){
        let that = this;
        that.search_form.type = data.sourceType;
        that.search_form.xingshi = data.sourceForm;
//        that.Initstate2 = false;
        that.init();
      },
      getDate (data) {//时间维度
        let that = this;
        that.search_form.startDate = data.dateSart;
        that.search_form.endDate = data.dateEnd;
        that.init();
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      pageChage(val){
        let that = this;
        that.search_form.page = val;
        that.search();
      }
//      refresh(){
//        let that = this;
//        for (let key in that.refresh_form){
//          that.search_form[key] = that.refresh_form[key]
//        }
//        that.Initstate = true;
//        that.Initstate2 = true;
//      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .inline-block{
    display: inline-block;
  }
  .btns {
    display: inline-block;
    vertical-align: middle;
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  .other-demension{
    display: inline-block;
    vertical-align: middle;
  }
  .selection{
    vertical-align: middle;
    display: inline-block;
    position: relative;
    width: 180px;
    height: 30px;
    padding: 0 0 0 50px;
  }
  .label{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    color: #666;
    font-size: .6rem;
  }
  .input{
    width: 80%;
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
