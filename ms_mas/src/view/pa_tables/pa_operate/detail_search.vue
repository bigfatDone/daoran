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
        <el-button type="primary" class="backToIndex-PC" icon="el-icon-back" @click="backToIndex()" circle></el-button>
        <v-date
          :default-start-date="startDate"
          :default-end-date="endDate"
          buttons="['yesterday', 'sevenday', 'nearthirty']"
          dateModel="2"
          @getDate="getDate($event)">
        </v-date>
      </div>
      <div>
        <v-select
          :default-chosed="selectDefault"
          :disabled="true"
          @condition="condition($event)">
        </v-select>
      </div>
      <div>
        <span class="label">页面:</span>
        <el-select
          disabled
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
        <span class="label">分区:</span>
        <el-select
          v-model="search_form.eleId"
          placeholder="请选择"
          class="select">
          <el-option
            v-for="(item, index) in pageList"
            :key="index"
            :label="item.partName"
            :value="item.partId">
          </el-option>
        </el-select>
        <div class="btns">
          <el-button
            @click="search"
            :disabled="loading"
            type="primary"
            icon="el-icon-search">
            搜索
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  import vSelect from "@/view/component/search/search-select-link"
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    name: "pa-pages-search",
    props: ["startDate", "endDate", "chosedNode", "chosedArea", "chosedProject", "pageId", "pageList","pageIdList", "partId"],
    components: {
      ElRow,
      vDate, vSelect
    },
    data () {
      return {
        url: {
          list: "/ms_bas/pagePartRep/getDataByElement.do",
        },
        search_form: {
          startDate: "",
          endDate: "",
          sNodeCode: "",
          sProvinceCode: "",
          sProjectCode: "",
          pageId: this.pageId,
          eleId: this.partId
        },
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
      selectDefault () {
        return {
          chosedNode: this.chosedNode,
          chosedArea: this.chosedArea,
          chosedProject: this.chosedProject,
          tableData: []
        }
      }
    },
    mounted () {
    },
    methods: {
      backToIndex(){//返回项目日报
        let that = this;
        this.$router.push({path: '/paTableOperate', query: {}});
      },
      init () {
        let that = this;

        if (that.dateReady !== true || that.conditionReady !== true) {
          return;
        } else if (!that.defaultSearch) {
          return;
        }
        that.defaultSearch = false;
        that.loading = false;
        that.search();
      },
      search () {
        let that = this;
        that.loading = true;
        that.$emit("result", [{
          alias: "首页",
          cliNum: 0,
          cliUserNum: 0,
          countTime: 0,
          partName: 0,
          perPlayTime:0,
          playTimeSecond: 0,
          playUserNum: 0,
          seq: 0
        }]);

        that.$emit("loading",that.loading);
        that.$emit("searchForm", that.search_form);
        that.$ajax({
          url: that.url.list,
          data: that.search_form,
          method: "post",
          success: function (res) {
            if (res.data.status === true) {
              that.tableData = res.data.data;
              that.$emit("result", that.tableData);
              that.hideSearch();
            } else {
              that.$emit("result", []);
              that.$message({
                type: 'warning',
                message: res.data.message
              });
            }
            that.loading = false;
            that.$emit("loading",that.loading);
          },
          error: function (err) {
            that.$message.error('运营位分析详情页面数据请求失败，请刷新运营位分析详情页面');
            that.loading = false;
            that.$emit("result", []);
            that.$emit("loading",that.loading);
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
  .btns{
    display: inline-block;
    margin: .3rem 0;
  }
  .selection{
    vertical-align: middle;
    display: inline-block;
    height: 30px;
  }
  .selection>.el-select{
    width: 70%;
  }
  .label{
    padding: 0 15px 0 0;
    display: inline-block;
    line-height: 30px;
    color: #666;
    font-size: .6rem;
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
  @media screen and (max-width: 800px) {
    .select {
      width: 100%;
    }
    .btns {
      float: left;
      width: 100%;
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
