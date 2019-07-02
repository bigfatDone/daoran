<template>
  <div class="searchArea">
    <div
      class="searchContainCover"
      v-show="searchState"
      @click="hideSearch"></div>

    <div
      class="search-index"
      :class="{'show':searchState}">

      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="项目">
          <el-input v-model="searchForm.s_projectName" placeholder="项目"></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="searchForm.s_provinceName" placeholder="区域"></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="searchForm.s_productName" placeholder="产品"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="search-btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search"
              :disabled="loading">搜索</el-button>
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="synchronous">同步项目</el-button>

            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'productOnline-search',
    props:['toSearch'],
    components: {
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      }
    },
    data () {
      return {
        url: {
          //url_search: "/ms_bas/onlineManage/search"
          url_search: "/ms_bas/onlineManage/getTable"
        },
        searchForm: {s_projectName: "", s_provinceName: "", s_productName: ""},
        loading: false,
        synchronousState: false,
        addState: false,
      }
    },
    watch : {
      toSearch(){
        let that = this;
        that.search();
      }
    },
    mounted () {
      let that = this;
      that.search();
    },
    methods: {
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      search () {
        let that = this;
        that.loading = true;
        that.$emit("loading", that.loading);
        that.$store.commit('changeMobileSearchState', false);
        that.$ajax({
          url: that.url.url_search,
          data: that.searchForm,
          method: "post",
          success: function (res) {
            let result = res.data;
            that.loading = false;
            that.$emit("search", result);
            that.$emit("loading", that.loading);
            //if (result.status) {
            //  that.$emit("search", result);
            //  that.loading = false;
            //  that.$emit("loading", that.loading );
            //}
          },
          error: function (err) {
            that.$message.error('产品上线管理页面数据请求失败，请刷新产品上线管理页面');
            that.loading = false;
            that.$emit("loading", that.loading );
          }
        });
      },
      synchronous(){
        let that = this;
        that.$emit("synchronous", that.synchronousState);
        that.synchronousState = !that.synchronousState;
      },
      add(){
        let that = this;
        that.$emit("add", that.addState);
        that.addState = !that.addState;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-btn{
    display: inline-block;
    text-align: right;
    margin: 0;
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
