<template>
  <div>
    <div
      class="searchContainCover"
      v-show="searchState"
      @click="hideSearch"></div>
    <div
      class="search-index"
      :class="{'show':searchState}">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="date-box">
            <v-dateselect
              buttons="lastweek,lastmonth"
              dateModel="3"
              @getDate="getDate($event)">
            </v-dateselect>
          </div>
        </el-col>
      </el-row>
      <v-select @condition="getNode($event)"></v-select>
      <div class="search-btns">
        <el-button class="search" type="primary" icon="el-icon-search" @click="search()" :disabled="loading">搜索</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import vSelect from '@/view/component/search/search-select-link'
  import vDateselect from '@/view/component/search/search-date-select'
  export default {
    name: 'search-index',
    props:['conditionType','loading'],
    components: {
      vSelect, vDateselect
    },
    data () {
      return {
        date:null,
        sNodeCode:'',
        sProvinceCode:'',
        sProjectCode:'',
        initData: true,
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      }
    },
    mounted () {
    },
    methods:{
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      getNode(data) {
        let that = this;
        that.sNodeCode = data.sNodeCode;
        that.sProvinceCode = data.sProvinceCode;
        that.sProjectCode = data.sProjectCode;
        if (that.initData === true) {
          that.initData = false;
          this.search();
        }
      },
      getDate (date) {
        let that = this;
        that.date = date;
      },
      search(){
        let that =this;
        if (that.date===null){
          that.$message.error('请选择查询时间');
          return;
        }else if (that.date.start_date_1 === '') {
          that.$message.error('请选择起始时间');
          return;
        }else if (that.date.end_date_1 === '') {
          that.$message.error('请选择结束时间');
          return;
        }
        if (that.date.start_date_2 ===''){
          that.$message.error('请选择对比时间');
          return;
        }
        if (that.sNodeCode===''){
          that.$message.error('请选择节点');
          return;
        }
        if (that.sProvinceCode===''){
          that.$message.error('请选择区域');
          return;
        }
        if (that.sProjectCode===''){
          that.$message.error('请选择产品');
          return;
        }
        that.$store.commit('changeMobileSearchState', false);
        let searchdata = {
          startDate:that.date.start_date_1,
          endDate:that.date.end_date_1,
          preDate:that.date.start_date_2,
          sNodeCode:that.sNodeCode,
          sProvinceCode:that.sProvinceCode,
          sProjectCode:that.sProjectCode,
        };
        that.$emit("chartdata", searchdata);
        that.$emit("tabledata", searchdata);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-select-link{
    margin-bottom: 5px;
  }
  .search-btns{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 5px;
  }
  .date-box{
    margin-bottom: 8px;
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
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
