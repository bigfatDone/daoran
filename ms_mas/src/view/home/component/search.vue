<template>
  <div class="searchArea">
    <div
      class="searchContainCover"
      v-show="searchState"
      @click="hideSearch"></div>

    <div
      class="search-index"
      :class="{'show':searchState}">
      <!--<v-search-link-->
      <!--@condition="getSearchCondition($event)">-->
    <!--</v-search-link>-->

      <v-select-home
        @condition="getSearchCondition($event)">
      </v-select-home>
      <div class="search-btn">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
            :disabled="loading">搜索</el-button>
          <!-- <el-button icon="el-icon-refresh">重置条件</el-button> -->
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
//import  vSearchLink from '@/view/component/search/search-select-link';
import  vSelectHome from '@/view/component/search/select_home';
export default {
  name: 'home-search',
  components: {
    vSelectHome
  },
  computed: {
    searchState () {
      return this.$store.getters.getMobileSearchState;
    }
  },
  data () {
    return {
      url: {
        url_search: "/ms_bas/instantOrder/getLineData.do"
      },
      searchForm: {sNodeCode: "", sProvinceCode: "", sProjectCode: ""},
      initData: true,
      loading: false,
    }
  },
  watch : {
    searchForm () {
      let that = this;
      if (that.initData == false) {
        return;
      } else {
        that.initData = false;
        that.search();
      }
    }
  },
  mounted () {
    let that = this;
    that.init();
  },
  methods: {
    init () {
      let that = this;
      let count = 0;
      for (let item in that.searchForm) {
        if (that.searchForm[item] == "") {
          count += 1;
        }
      }
      if (count > 0) {
        return;
      } else {
        that.search();
      }
    },
    hideSearch () {
      let that = this;
      that.$store.commit('changeMobileSearchState', false);
    },
    search () {
      let that = this;
      that.loading = true;
      that.$emit("imgLoading", that.loading );
      that.$store.commit('changeMobileSearchState', false);
      that.$ajax({
        url: that.url.url_search,
        data: that.searchForm,
        method: "post",
        timeout: 1000*300,
        success: function (res) {
          let result = res.data;
          let data = [];
          if (result.status) {
            data=result;
          }else {
            data=[];
          }
          that.$emit("searchResult", data);
          that.loading = false;
          that.$emit("imgLoading", that.loading );
        },
        error: function (err) {
          that.$message.error('首页页面数据请求失败，请刷新首页页面');
          that.loading = false;
          that.$emit("imgLoading", that.loading );
          that.$emit("searchResult", []);
        }
      });
    },
    getSearchCondition (obj) {
      let that = this;
      that.searchForm = obj;
      console.log(that.searchForm)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-btn{
    display: inline-block;
    text-align: right;
    margin: 0.5rem 0;
    vertical-align: middle;
  }
  .show{
    display: block !important;
  }
  @media screen and (max-width: 800px) {
    .search-btn {
      display: block;
    }
    .search-index {
      position: fixed;
      top: 3rem;
      left: 0;
      right: 0;
      z-index: 6;
      background: #fff;
      padding: 1.5rem;
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
