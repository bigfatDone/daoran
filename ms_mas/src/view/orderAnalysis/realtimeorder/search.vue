<template>
  <div class="search">
    <v-search @condition="condition($event)"  ref="initData">
      <div class="selection filter" slot="billing">
        <span class="label">计费编码:</span>
        <el-input v-model="billing" placeholder="支持模糊查询"></el-input>
      </div>
        <div class="selection filter" slot="entry">
          <span class="label">订购入口:</span>
          <el-select v-model="source_code" placeholder="请选择操作结果">
            <el-option v-for="item in source"   :label="item.text" :value="item.code" :key="item.id"></el-option>
          </el-select>
        </div>
    </v-search>
    <div class="height"></div>
    <div class="selection filter">
      <span class="label">操作结果:</span>
      <el-select v-model="orderResult_code" placeholder="请选择搜索结果">
        <el-option v-for="item in orderResult"   :label="item.text" :value="item.code" :key="item.code"></el-option>
      </el-select>
    </div>
    <div class="selection filter">
      <span class="label">订购方式:</span>
      <el-select v-model="trigger_code" placeholder="请选择订购方式">
        <el-option v-for="item in trigger"   :label="item.text" :value="item.code" :key="item.id"></el-option>
      </el-select>
    </div>
    <div class="selection date-filter">
      <span class="label">日期:</span>
      <el-date-picker
        v-model="startDate"
        type="date"
        :clearable="false"
        range-separator="至"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="起始日期"
        :picker-options="pickerOptions0">
      </el-date-picker>
      <span class="date-font">至</span>
      <el-date-picker
        v-model="endDate"
        type="date"
        :clearable="false"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="结束日期"
        :picker-options="pickerOptions1">
      </el-date-picker>
    </div>
    <div class="selection btns">
      <el-button
        @click="search"
        type="primary"
        icon="el-icon-search">查询</el-button>
      <el-button
        @click="reset"
        type="primary"
        icon="el-icon-refresh"
        style="display: none;"
        >重置</el-button>
    </div>
  </div>
</template>

<script>
import vSearch from "@/view/component/search/select_summary"
export default {
  name: 'realtimeorder-search',
  components: {
    vSearch
  },
  props: {
    data: Object
  },
  data () {
    return {
      changeCount: 0,
      billing: "",
      orderResult: [
       {
          code: '-1',
          text: '请选择'
        }, {
          code: '1',
          text: '成功'
        }, {
          code: '0',
          text: '失败'
        }
      ],
      startDate: '',
      endDate: '',
      source: [],
      trigger: [],
      orderResult_code: '-1',
      source_code: '',
      trigger_code: '',
      tableData:[],
      select_data:{
        startDate: '',
        endDate: '',
        node: '',
        province: '',
        product: '',
        productCode: '',
        orderResult: '',
        triggerType: '',
        source: '',
        pn: '1',
        pageSize: '10'
      },
      pickerOptions0: {//限定开始时间为今天之前
        disabledDate: (time) => {
          if (this.endDate != "") {
            return time.getTime() > Date.now() || time.getTime() >  new Date(this.endDate);
          } else {
            return time.getTime() > Date.now();
          }
        },
      },
      pickerOptions1: {//限定结束时间不能在开始时间之前
        disabledDate: (time) => {
//          return time.getTime() < new Date(this.startDate).getTime()|| time.getTime() > Date.now()-3600 * 1000 * 24;
          return time.getTime() <=new Date(this.startDate).getTime()-3600 * 1000 * 24||time.getTime() > Date.now();
        },
      },
    }
  },
  mounted () {
  },
  computed: {

  },
  watch: {
    billing() {
      this.select_data.pn = 1;
    },
    source_code() {
      this.select_data.pn = 1;
    },
    orderResult_code() {
      this.select_data.pn = 1;
    },
    trigger_code() {
      this.select_data.pn = 1;
    },
    startDate() {
      this.select_data.pn = 1;
    },
    endDate() {
      this.select_data.pn = 1;
    }
  },
  methods: {
    // 搜索
      search() {
        this.$emit("resetPage",this.select_data.pn);
        const that = this;
        that.select_data.startDate = that.startDate;
        that.select_data.endDate = that.endDate;
        that.select_data.productCode = that.billing;
        that.select_data.source = that.source_code;
        that.select_data.orderResult = that.orderResult_code;
        that.select_data.triggerType = that.trigger_code;
        this.getTableData();
      },
    // 获取订购入口
    getEntryData() {
      const that = this;
      that.$ajax({
        url: '/ms_bas/crm/realtimeorder/getOrderSource',
        data: {},
        method: "post",
        success: function (res) {
          if(res.status){
            that.source = res.data.data;
            that.source_code = res.data.data[0].code;
            that.getTriggerData();
          }
        },
        error: function (err) {
          that.$message.error('实时订购数据报表页面数据请求失败，请刷新实时订购数据报表页面');
        }
      });
    },
    // 获取订购方式
    getTriggerData() {
      const that = this;
      that.$ajax({
        url: '/ms_bas/crm/realtimeorder/getOrderTriggerType',
        data: {},
        method: "post",
        success: function (res) {
          if(res.status){
            that.trigger = res.data.data;
            that.trigger_code = res.data.data[0].code;
            that.yesterday();
          }
        },
        error: function (err) {
          that.$message.error('实时订购数据报表页面数据请求失败，请刷新实时订购数据报表页面');
        }
      });
    },
    // 获取表单数据
    getTableData() {
      const that = this;
      this.$emit("updataLoading", 'true');
      that.$ajax({
        url: '/ms_bas/crm/realtimeorder/getTable',
        data: that.select_data,
        method: "post",
        success: function (res) {
          if(res.status){
            that.tableData = res.data.rows;
//            that.projectValue = res.data.data[0].code;
            that.$emit("search", that.tableData);
            that.$emit("getTotal", res.data.total);
            that.$emit("getSelectForm", that.select_data);
          }
        },
        error: function (err) {
          that.$message.error('实时订购数据报表页面数据请求失败，请刷新实时订购数据报表页面');
        }
      });
    },
    // 获取select的子数据
    condition(data) {
      this.select_data.node = data.province;
      this.select_data.province = data.city;
      this.select_data.product = data.product;
      this.select_data.pn = 1;
      if( this.changeCount === 0){
        this.getEntryData();
        this.changeCount ++ ;
      } else {
        return;
      }
    },
    yesterday(){
      let that =this;
      const setdate = new Date();
      let yesterday=that.$dateFormat(setdate.setTime(setdate.getTime()),"yyyy-MM-dd");
      that.startDate = yesterday;
      that.endDate = yesterday;
      this.search();
    },
    reset() {
      this.billing = "";
      this.$refs.initData.resetSelect();
      this.getEntryData();
      this.select_data.pn = 1;
      this.$emit("resetPage", 1);
    },
    // 获取当前页数
    setCurrentPage(page) {
      this.select_data.pn = page;
      this.search();
    },
    // 获取当前分页数
    setageSize(size) {
      this.select_data.pageSize = size;
      this.search();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search{
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
  .filter {
    width: 200px!important;
    padding: 0 0 0 70px!important;
  }
  .date-filter {
    width: 345px;
    padding: 0 0 0 50px;
  }
  .btns {
    width: 270px;
    vertical-align: top;
    padding: 0;
  }
  .date-filter .el-date-editor.el-input {
    width: 140px;
  }
  .filter .el-input {
    width: 80%!important;
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
  .select span{
    display: inline-block;
    vertical-align: middle;
    height: 1.5rem;
    line-height: 28px;
    font-size: .6rem;
    color: #606266;
  }
  .select i {
    position: absolute;
    right: .4rem;
    top: 50%;
    margin: -.4rem 0 0 0;
    font-size: 14px;
    color: #ccc;
  }
  .select-wrap{
    max-height: 10rem;
    overflow: auto;
    width: 100%;
    padding-right: 0.6rem;
  }
  .selection>.el-select{
    width: 80%;
  }
  .page-search {
    margin: 20px 0;
  }
  .height {
    height: 20px;
    width: 100%;
  }
  .date-font{
    margin: 0 .2rem 0 .2rem;
    font-size: .5rem;
  }
  @media screen and (max-width: 800px) {
    .search-select-link{
      width: 100%;
    }
    .selection{
      width: 100%;
      margin-top: 8px;
    }
    .select{
      width: 80%;
    }
  }
</style>
