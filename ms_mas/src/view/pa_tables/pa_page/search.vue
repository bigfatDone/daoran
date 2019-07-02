<template>
  <div class="pa-pages-search" ref="paPagesSearch">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">
      <div>
        <v-date
          buttons="['yesterday', 'sevenday', 'nearthirty']"
          dateModel="2"
          default-date="yesterday"
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
    name: "pa-pages-search",
    components: {
      vDate, vSelect
    },
    data () {
      return {
        url: {
          list: "/ms_bas/pageInfoRep/getPageAccessList.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
        },
        search_form_cache: {},
        tableData: [],
        loading: true,
        defaultSearch: true,
        dateReady: false,
        conditionReady: false,
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

        if (that.dateReady !== true || that.conditionReady !== true) {
          return;
        } else if (!that.defaultSearch) {
          return;
        }
        that.loading = false;
        that.search();
        that.$nextTick(function () {
          let h = that.$refs.paPagesSearch.clientHeight;
          that.$emit("createHeight", h);
        });
      },
      search () {
        let that = this;
        let count = 0;
        that.loading = true;
        that.defaultSearch = false;

        for (let item in that.search_form) {
          if (that.search_form[item] == "") {
            count += 1;
          }
        }

        if (count > 0) {
          that.$message({
            type: "warning",
            message: "请先完善搜索条件"
          });
          that.loading = false;
          return;
        }

        that.$emit("loading", that.loading);
        that.$ajax({
          url: that.url.list,
          data: that.search_form,
          method: "post",
          success: function (res) {
            for (let item in that.search_form) {
              that.search_form_cache[item] = that.search_form[item];
            }
            let obj = {};
            if (res.data.status === true) {
              obj = {tableData: res.data.data, search_form: that.search_form_cache};
            } else {
              obj = {tableData:[], search_form: that.search_form_cache};
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
            that.$message.error('页面分析报表页面数据请求失败，请刷新页面分析报表页面');
            that.loading = false;
            that.$emit("loading", that.loading);
          }
        })
      },
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.sNodeCode;
        that.search_form.sProvinceCode = data.sProvinceCode;
        that.search_form.sProjectCode = data.sProjectCode;
        that.conditionReady = true;
        that.init();
      },
      getDate (data) {
        let that = this;
        that.search_form.startDate = data.dateSart;
        that.search_form.endDate = data.dateEnd;
        that.dateReady = true;
        that.init();
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
  .btns {
    display: inline-block;
    vertical-align: top;
    margin: .3rem 0;
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
