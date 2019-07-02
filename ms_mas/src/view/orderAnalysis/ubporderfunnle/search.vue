<template>
  <div class="pa-pages-search">
      <div class="date-input-group">
        <el-button-group>
          <el-button  @click="yesterday()">日期</el-button>
        </el-button-group>
        <el-date-picker
          v-model="search_form.startDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions0">
        </el-date-picker>
      </div>
    <v-select @condition="condition($event)"></v-select>
    <div class="section">
      <span class="label">指标勾选:</span>
      <el-popover
        placement="bottom-start"
        width="140"
        @show="show"
        @hide="hide"
        trigger="click">
        <div class="city">
          <div class="tool">
            <el-button-group>
              <el-button @click="tableSelectAll(true)">全选</el-button>
              <el-button @click="tableSelectAll(false)">全不选</el-button>
            </el-button-group>
          </div>
          <div class="select-wrap">
            <p v-for="item in tableList">
              <el-checkbox v-model="item.status" @change="table_change($event)">{{item.text}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':visible_select}">
            <span v-for="item in tableList" v-show="item.status">{{item.text}},</span>
            <i class="el-icon-arrow-down" :class="{'icon-active':visible_select}"></i>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="btns">
      <el-button
        @click="search"
        type="primary"
        icon="el-icon-search">搜索</el-button>
    </div>
  </div>
</template>

<script>
  import vSelect from "@/view/component/search/select_summaryFunnle";
  import vTable from "./table";
  export default {
    name: "ubporderfunnle-search",
    components: {
     vSelect
    },
    data() {
      return {
        dayData: [],
        summaryData: [],
        tableData: [],
        count:0,
        visible_select: false,
        tableList:[
          {name:'ctime',status:true,text:'日期'},
          {name:'node',status:true,text:'项目'},
          {name:'province',status:true,text:'省份'},
          {name:'project',status:true,text:'产品名称'},
          {name:'accessnum',status:true,text:'访问用户数'},
          {name:'offaccessnum',status:true,text:'非包月访问用户数'},
          {name:'orderuser',status:true,text:'订购触发用户数'},
          {name:'actgo',status:false,text:'订购触发用户数（活动）'},
          {name:'plistgo',status:false,text:'订购触发用户数（专辑）'},
          {name:'projectgo',status:false,text:'订购触发用户数（产品）'},
          {name:'playgo',status:false,text:'订购触发用户数（播放）'},
          {name:'ordersouuser',status:true,text:'订购成功用户数'},
          {name:'orderoffuser',status:true,text:'订购失败用户数'},
          {name:'numberofcancelledsubscribers',status:true,text:'订购取消用户数'},
          {name:'ordertriggerrate',status:true,text:'订购触发率:%'},
          {name:'actOrdertriggerrate',status:false,text:'订购触发率（活动）:%'},
          {name:'albumOrdertriggerrate',status:false,text:'订购触发率（专辑）:%'},
          {name:'productOrdertriggerrate',status:false,text:'订购触发率（产品）:%'},
          {name:'playOrderingsuccessrate',status:false,text:'订购触发率（播放）:%'},
          {name:'actOrderingsuccessrate',status:false,text:'订购成功率（活动）:%'},
          {name:'albumOrderingsuccessrate',status:false,text:'订购成功率（专辑）:%'},
          {name:'productOrderingsuccessrate',status:false,text:'订购成功率（产品）:%'},
          {name:'playOrderingsuccessrate',status:false,text:'订购成功率（播放）:%'},
          {name:'orderingsuccessrate',status:true,text:'订购成功率:%'},
          {name:'orderingCancellationRate',status:true,text:'订购取消率:%'},
          {name:'orderingfailurerate',status:true,text:'订购失败率:%'},
          {name:'orderConversionRate',status:true,text:'订购转化率:%'},
          {name:'numberofunsubscribedusers',status:true,text:'退订用户数'},
        ],
        search_form: {
          startDate: '',
          sNodeCode: '',
          sProvinceCode: '',
          sProjectCode: '',
        },
        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            if (this.endDate != "") {
              return time.getTime() > Date.now()-3600 * 1000 * 24 || time.getTime() >  new Date(this.endDate);
            } else {
              return time.getTime() > Date.now()-3600 * 1000 * 24;
            }
          },
        },
      }
    },
    mounted() {
      this.yesterday();
    },
    watch: {

    },
    methods: {
      //  全选方法
      tableSelectAll(value) {
          let that = this;
          that.tableList.forEach((item,index)=> {
              item.status = value;
          });
        that.$emit('changeTableList',that.tableList)
      },
      table_change(value) {
        let that = this;
        that.$emit('changeTableList',that.tableList);
      },
      show(){
        let that = this;
        that.visible_select = true;
      },
      hide(){
        let that = this;
        that.visible_select = false;
      },
      // 初始化日期
      yesterday(){
        let that =this;
        const setdate = new Date();
        let yesterday = that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
        that.search_form.startDate = yesterday;
      },
      // 子向父传值
      condition(data) {
        let that = this;
        that.search_form.sNodeCode = data.province;
        that.search_form.sProvinceCode = data.city;
        that.search_form.sProjectCode = data.product;
        if( that.count === 0) {
          that.getTableData();
          that.$emit('changeTableList',that.tableList);
          that.count ++;
        } else {
            return;
        }
      },
      search() {
        let that = this;
        that.$emit('loadingTable',false);
        that.getTableData();
      },
      // 获取表单按天数据
      getTableData() {
        const that = this;
        that.tableData = [];
        that.$ajax({
          url: '/ms_bas/ubporderfunnle/getDataDay',
          data: that.search_form,
          method: "post",
          success: function (res) {
            if(res.status){
              that.dayData=res.data.data;
              that.getSummaryTableData();
            }
          },
          error: function (err) {
            that.$message.error('UBP分析订购漏斗页面数据请求失败，请刷新UBP分析订购漏斗页面');
          }
        });
      },
      // 获取表单汇总数据
      getSummaryTableData() {
        const that = this;
        that.$ajax({
          url: '/ms_bas/ubporderfunnle/getDataSummary',
          data: that.search_form,
          method: "post",
          success: function (res) {
            if(res.status) {
              if (res.data.status) {
                that.summatyData = res.data.data;
                that.tableData = that.summatyData.concat(that.dayData);
                that.$emit('changeTableData', that.tableData);
                that.$emit('searchData', that.search_form);

              } else {
                that.$emit('changeTableData', []);
                that.$emit('searchData', []);
                that.$message.warning('UBP分析订购漏斗页面汇总数据为空');
              }
            }
          },
          error: function (err) {
            that.$message.error('UBP分析订购漏斗页面数据请求失败，请刷新UBP分析订购漏斗页面');
          }
        });
      },
    }
  }
</script>

<style scoped>
  .date-font{
    margin: 0 .2rem 0 .2rem;
    font-size: .5rem;
  }
  .section{
    vertical-align: middle;
    display: inline-block;
    position: relative;
    width: 180px;
    height: 30px;
    padding: 0 0 0 75px;
  }
  .btns {
    display: inline-block;
    position: relative;
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
  /*全选*/
  .label{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    color: #666;
    font-size: .6rem;
  }
  .select{
    display: inline-block;
    width: 80%;
    position: relative;
    font-size: .8rem;
    color: #333;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .padding-select{
    padding: 0 .6rem;
    margin: 0;
    display: block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 28px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
  .city{
    overflow: hidden;
  }
  .tool{
    text-align: center;
  }
  .singleSelect{
    width: 80%;
    display: inline-block;
  }
  .el-icon-arrow-down{
    transition:transform .3s;
    -moz-transition:-moz-transform .3s; /* Firefox 4 */
    -webkit-transition:-webkit-transform .3s; /* Safari and Chrome */
    -o-transition:-o-transform .3s; /* Opera */
  }
  .icon-active{
    transform:rotate(-180deg);
    -ms-transform:rotate(-180deg); /* Internet Explorer */
    -moz-transform:rotate(-180deg); /* Firefox */
    -webkit-transform:rotate(-180deg); /* Safari 和 Chrome */
    -o-transform:rotate(-180deg); /* Opera */
  }
  .select-focus{
    border-color: #409EFF;
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

