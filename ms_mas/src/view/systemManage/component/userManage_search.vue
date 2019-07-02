<template>
  <div>
    <div
      class="searchContainCover"
      v-show="searchState"
      @click="hideSearch"></div>
    <div
      class="search-index"
      :class="{'show':searchState}">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input
            v-model="userName"
            placeholder="请输入用户名"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input
            placeholder="请输入真实姓名"
            v-model="realName"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="search" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'userManage_search',
    props: ["pagenum", "refresh"],
    data () {
      return {
        url: {
          search: "/ms_bas/user/datagrid?field=id,userName,userOrgList.tsDepart.departname,realName,userKey,createBy,createDate,updateBy,updateDate,status,mobilePhone,email,officePhone,userOrgList.tsDepart.id",
        },
        userName: "",
        realName: "",
        searchEdit: false,
      };
    },
    computed : {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
      pageIndex () {
        return this.pagenum;
      },
    },
    watch: {
      pageIndex (event) {
        this.search();
      },
      userName (event) {
        this.searchEdit = true;
      },
      realName (event) {
        this.searchEdit = true;
      },
      refresh (event) {
        this.search();
      },
    },
    mounted () {
      this.search();
    },
    methods: {
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      search(){//搜索
        let that = this;
        let form = {
          page: that.searchEdit ? 0 : that.pageIndex,
          rows: 20,
          sort: 'id',
          order: 'desc',
          userName: that.userName,
          realName: that.realName
        };

        that.$store.commit('changeMobileSearchState', false);
        that.$emit("searching", true);
        that.$ajax({
          url: that.url.search,
          data: form,
          method: "post",
          success: function (res) {
            let data = res.data;
            let current = that.searchEdit ? 0 : that.pageIndex;
            that.searchEdit ? that.searchEdit = false : that.searchEdit = that.searchEdit;
            data.current = current;
            that.$emit("searchData", data);
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .show{
    display: block !important;
  }
  @media screen and (max-width: 800px) {
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
    .searchContainCover {
      position: fixed;
      z-index: 5;
      background: rgba(0, 0, 0, 0.3);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
