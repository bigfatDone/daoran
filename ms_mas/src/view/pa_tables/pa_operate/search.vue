<template>
  <div class="pa-pages-search" ref="paOperateSearch">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">
        <v-date
          buttons="['yesterday', 'sevenday', 'nearthirty']"
          dateModel="2"
          default-date="yesterday"
          @getDate="getDate($event)"></v-date>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10">
          <v-select
            default-type="model-2"
            @condition="condition($event)"></v-select>
        </el-col>
        <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="4">
          <label class="search-lable">页面：</label>
          <el-select
            v-model="search_form.pageId"
            placeholder="请选择"
            class="select">
            <el-option
              v-for="(item, index) in pageIdList"
              :key="index"
              :label="item.alias"
              :value="item.pageId">
            </el-option>
          </el-select>
        </el-col>
        <div class="btns">
          <el-button
            @click="search"
            :disabled="loading"
            type="primary"
            icon="el-icon-search">搜索</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  import vSelect from "@/view/component/search/search-select-link"
  export default {
    name: "pa-pages-search",
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          pages: "/ms_bas/pagePartRep/getPageInfoList.do",
          list: "/ms_bas/pagePartRep/getDataByPage.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
          pageId: ""
        },
        search_form_cache: {},
        tableData: [],
        pageIdList: [],
        loading: true,
        defaultSearch: true,

        dateReady: false,
        conditionReady: false,
        pageIdReady: false,
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    mounted () {

    },
    methods: {
      init () {
        let that = this;

        if (that.dateReady !== true || that.conditionReady !== true || that.pageIdReady != true) {
          return;
        } else if (!that.defaultSearch) {
          return;
        }
        that.loading = false;
        that.search();
        that.$nextTick(function () {
          let h = that.$refs.paOperateSearch.clientHeight;
          that.$emit("createHeight", h);
        });
      },
      search () {
        let that = this;
        let count = 0;

        for (let item in that.search_form) {
          if (that.search_form[item] == "") {
            count += 1;
          }
        }

        if (count > 0) {
          that.$message({
            type: "error",
            message: "请完善查询条件"
          });
          return
        }

        that.loading = true;
        that.$emit("loading", that.loading);
        that.$store.commit('changeMobileSearchState', false);
        that.$emit("searchForm", that.search_form_cache);
        that.defaultSearch = false;
        that.$ajax({
          url: that.url.list,
          data: that.search_form,
          method: "post",
          success: function (res) {
            for (let item in that.search_form) {
              that.search_form_cache[item] = that.search_form[item];
            }
            let obj ={};
            if (res.data.status === true) {
              obj = {tableData: res.data.data, search_form: that.search_form_cache,pageIdList:that.pageIdList};
            } else {
              obj = {tableData:[], search_form: that.search_form_cache,pageIdList:that.pageIdList};
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }
            that.$emit("search", obj);
            that.hideSearch();
            that.loading = false;
            that.$emit("loading", that.loading);
          },
          error: function (err) {
            that.$message.error('运营位分析报表页面数据请求失败，请刷新运营位分析报表页面');
            that.loading = false;
            that.$emit("loading", that.loading);
          }
        });
      },
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.sNodeCode;
        that.search_form.sProvinceCode = data.sProvinceCode;
        that.search_form.sProjectCode = data.sProjectCode;
        that.conditionReady = true;
        that.init();
        if (that.search_form.sNodeCode !== "") {
          that.getPageIdList();
        } else {
          that.pageIdList = [];
          that.search_form.pageId = "";
        }
      },
      getDate (data) {
        let that = this;
        that.search_form.startDate = data.dateSart;
        that.search_form.endDate = data.dateEnd;
        that.dateReady = true;
        that.init();
      },
      getPageIdList () {
        let that = this;
        let count = 0;

        for (let item in that.search_form) {
          if (item != "pageId" && that.search_form[item] == "") {
            count += 1;
          }
        }

        if (count > 0) {
          that.pageIdList = [];
          that.search_form.pageId = "";
          return;
        }

        that.$ajax({
          url: that.url.pages,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.pageIdReady = true;
              that.pageIdList = res.data.data;
              that.pageIdList.forEach((item,index)=>{
                if(item.alias === '首页'){
                  that.search_form.pageId = item.pageId
                }
              });
              that.search_form.pageId = res.data.data[0].pageId;
              that.init();
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }
            that.loading = false;
          },
          error: function (err) {
            that.$message.error('运营位分析报表页面数据请求失败，请刷新运营位分析报表页面');
            that.loading = false;
          }
        })
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns{
    display: inline-block;
    margin: .3rem 0;
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  .select{
    margin: .3rem 0;
  }
  .search-lable{
    display: inline-block;
    font-size: .65rem;
    color: #666;
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
