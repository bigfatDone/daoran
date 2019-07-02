<template>
  <div class="gather">
    <div>
      <el-button type="primary" class="backToIndex" icon="el-icon-back" @click="backToIndex()" circle></el-button>
      <div class="phone-click">
        统计时间：{{changeDate}}
        <el-row>
          <el-button type="info" icon="el-icon-arrow-left" @click="clickChangeDate('before')" circle></el-button>
          <el-button type="info" icon="el-icon-arrow-right" @click="clickChangeDate('after')" circle></el-button>
        </el-row>
      </div>

      <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
      <div
        class="search-index"
        :class="{'show':searchState}">
        <el-button type="primary" class="backToIndex-PC" icon="el-icon-back" @click="backToIndex()" circle></el-button>
        <div class="date-input-group">
          <el-button-group>
            <el-button v-for="(item,index) in select" :key="item.text" @click="dateSet(item.id)" class="date-fast-group" :class="{ active: item.status }">{{item.text}}</el-button>
          </el-button-group>
          <el-date-picker
            :value="changeDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @focus="focus"
            @input="datechanges($event)">
          </el-date-picker>
        </div>
        <div class="search-select-link">
        <div class="selection">
          <span class="label">项目:</span>
          <el-select v-model="node_code" disabled>
            <el-option
              v-for="item in node"
              :key="item.attributes.code"
              :label="item.text"
              :value="item.attributes.code">
            </el-option>
          </el-select>
        </div>
        <div class="selection">
          <span class="label">区域:</span>
          <v-select :data="province" @select="provinceChange($event)"></v-select>
        </div>
        <div class="selection">
          <span class="label">产品:</span>
          <v-select :data="product" @select="productChange($event)"></v-select>
        </div>
        </div>
        <div class="search-btns">
          <el-button
            class="search"
            type="primary"
            :disabled="loading"
            icon="el-icon-search"
            @click="search()">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <table class="table"
             v-loading="loading">
        <tr><td>项目</td><td>{{tableData.sNodeName}}</td></tr>
        <tr><td>区域</td><td>{{tableData.provinceName}}</td></tr>
        <tr><td>产品</td><td>{{tableData.productName}}</td></tr>
        <tr><td>当月累计新增用户数</td><td>{{tableData.newUser}}</td></tr>
        <tr><td>订购成功数</td><td>{{tableData.successTotal}}</td></tr>
        <tr><td>退订用户数</td><td>{{tableData.offTotal}}</td></tr>
        <tr><td>订购失败数</td><td>{{tableData.failTotal}}</td></tr>
        <tr><td>访问用户数</td><td>{{tableData.iATotal}}</td></tr>
        <tr><td>非包月用户访问数</td><td>{{tableData.noContiuneAUser}}</td></tr>
        <tr><td>点播用户数</td><td>{{tableData.iPTotatl}}</td></tr>
        <tr><td>存留用户数</td><td>{{tableData.preserveUser}}</td></tr>
        <tr><td>订购成功率</td><td>{{tableData.orderSuccessRate}}</td></tr>
        <tr><td>转化率</td><td>{{tableData.conversionRate}}</td></tr>
      </table>
    </div>
  </div>
</template>

<script>
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'dailyDetail',
    components: {
      vSelect
    },
    data () {
      return {
        selectData:[],
        query:'',
        select:[
          {id:'yesterday',text:'昨日',status:false},
        ],
        loading:true,
        tableData:{},

        node:[],
        province:[],
        product:[],

        node_code:'',
        province_code:'',
        product_code:'',

        searchNodeName:'',
        searchProvinceName:'',
        searchProDuctName:'',
        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            return time.getTime() > Date.now()-3600 * 1000 * 24;
          }
        },
      }
    },
    mounted () {
      this.query=this.$route.query;
      this.Getselectdata();
      this.search();
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
      changeDate () {
        return this.$store.getters.getDateForDaily;
      },
      selectArr () {
        return this.$store.getters.getSelectArr;
      },
      selectArrState () {
        return this.$store.getters.getSelectArrState;
      },
    },
    methods: {
      focus (obj) {
        obj.blur();
      },
      datechanges (date) {
        let that = this;
        that.$store.commit('changeDateForDaily', date);
        that.$store.commit('changeDailySearchDatestatus', true);
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
      dateSet (id){
        let that =this;
        that.select.forEach((item,index)=>{
          if(item.id === id){
            item.status = true;
          }else {
            item.status = false;
          }
        });
        that.yesterday();
      },
      yesterday(){
        let that =this;
        const setdate = new Date();
        let date = that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
        that.$store.commit('changeDateForDaily', date);
      },
      Getselectdata (){ /*ajax charts*/
        let that = this;
        that.$store.commit('changeDateForDaily', that.query.date);
        that.$ajax({
          url: "/ms_bas/ReportAuth/getReportAuth.do",
          data: {},
          method: "post",
          success: function (response) {
            that.selectData = response.data.data;
            that.initDefault();
          },
          error: function (err) {
            that.$message.error('项目日报页面数据请求失败，请刷新项目日报页面');
          }
        })
        /*if (that.selectArr.length ===0 || that.selectArrState === true){
          that.$ajax({
            url: "/ms_bas/ReportAuth/getReportAuth.do",
            data: {},
            method: "post",
            success: function (response) {
              that.$store.commit('changeSelectArr', response.data.data);
              that.$store.commit('changeSelectArrState', false);
              that.selectData = response.data.data;
              that.initDefault();
            },
            error: function (err) {
              that.$message.error('请求失败搜索条件，请刷新页面');
            }
          })
        }else {
          that.selectData =that.selectArr;
          that.initDefault();
        }*/
      },
      initDefault(){
        let that = this;
        let allselect = {text:'全部',chosed:true,attributes:{code:''}};
        that.selectData.forEach((item, index) => {
          if (item.attributes.code == that.query.nodeCode) {
            that.node.push(item);
            item.children.forEach((obj,i)=>{
              that.$set(obj, "chosed", false);
            });
            that.province = item.children;
            that.searchNodeName = item.text;
            that.node_code = that.query.nodeCode;
          }
        });
        that.province.unshift(allselect);
        that.searchProvinceName = '全部';
        let hash = {};
        let pre = "product_";
        that.province.forEach((item, index) => {
          if (item.attributes.code !=='') {
            item.children.forEach((obj, i) => {
              if (!hash[pre + obj.attributes.code]) {
                hash[pre + obj.attributes.code] = true;
                that.product.push(obj);
              }
            });
          }
        });
        that.product.unshift(allselect);
        that.searchProductName = '全部';
      },
      search(){
        let that = this;
        this.$router.replace({ path: '/dailyDetail',query: {nodeCode: that.query.nodeCode,date:that.changeDate} });
        if (that.changeDate==='' || that.changeDate===null){
          that.$message.error('请选择查询时间');
          return;
        }
        that.loading =true;
        that.$store.commit('changeMobileSearchState', false);
        that.$ajax({
          url: "/ms_bas/dailyReport/getDetailedTable",
          data: {data:that.changeDate,sNodeCode:that.query.nodeCode,sProvinceCode:that.province_code,sProjectCode:that.product_code},
          method: "post",
          success: function (response) {
            that.loading =false;
            if (response.data.status === true){
              that.tableData=response.data.data;
            }else {
              that.$message.warning(response.data.message);
              that.tableData={
                sNodeName:that.searchNodeName,
                provinceName:that.searchProvinceName,
                productName:that.searchProductName,
              };
              that.$store.commit('changeDailySearchDatestatus', false);
            }
          },
          error: function (err) {
            that.$message.error('项目日报页面数据请求失败，请刷新项目日报页面');
          }
        })
      },
      provinceChange(val){
        let that = this;
        that.province_code = val.attributes.code;
        that.product_code = '';
        that.product= [];
        let allselect = {text:'全部',chosed:true,attributes:{code:''}};
        if (val.attributes.code == ''){
          let hash = {};
          let pre = "product_";
          that.province.forEach((item, index) => {
            item.chosed=false;
            if (item.attributes.code !=='') {
              item.children.forEach((obj, i) => {
                if (!hash[pre + obj.attributes.code]) {
                  hash[pre + obj.attributes.code] = true;
                  that.product.push(obj);
                }
              });
            }else {
              item.chosed=true;
            }
          });
          that.product.unshift(allselect);
          that.searchProvinceName = '全部';
          that.searchProductName = '全部';
        }else {
          that.product = [];
          that.province.forEach((item,index)=>{
            item.chosed=false;
            if (item.attributes.code == val.attributes.code){
              item.chosed=true;
              item.children.forEach((obj, i) => {
                  that.product.push(obj);
                  that.searchProvinceName = item.text;
              });
            }
          });
          that.product.unshift(allselect);
          that.searchProductName = '全部';
        }
      },
      productChange(val) {
        let that = this;
        that.product_code = val.attributes.code ;
        that.product.forEach((item,index)=>{
          item.chosed=false;
          if (item.attributes.code == val.attributes.code ){
            item.chosed=true;
              that.searchProductName = item.text;
          }
        });
      },
      backToIndex(){//返回项目日报
        let that = this;
        if (that.query.date !== that.changeDate){
          that.$store.commit('changeDailySearchDatestatus', true);
        }
        this.$router.push({ path: '/daily',query: {date:that.changeDate} });
      },
      clickChangeDate(state){
        let that = this;
        let date = that.changeDate;
        if (state === 'before'){
          const setdate = new Date(date);
//          that.changeDate = that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
          let Newdate = that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
          that.$store.commit('changeDateForDaily', Newdate);
        }else {
          const setdate = new Date(date);
//          that.changeDate = that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24),"yyyy-MM-dd");
          let Newdate = that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24),"yyyy-MM-dd");
          that.$store.commit('changeDateForDaily', Newdate);
        }
        that.search();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .table{
    width: 100%;
    text-align: center;
    border: 1px solid #ebeef5;
    border-top: none;
    font-size: .6rem;
    color: #606266;
    border-spacing: 0;
  }
  .table>tr>td{
    padding: 10px 0;
    border-left: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
  }
  .table>tr>td:nth-child(1){
    border-left:none;
  }
  .date-input-group{
    margin-bottom: .3rem;
    width: 220px;
    display: inline-block;
  }
  .search-select-link{
    display: inline-block;
    vertical-align: middle;
  }
  .el-date-editor.el-input{
    width: 70%;
    min-width: 130px;
  }
  .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .selection{
    width: 140px;
    height: 30px;
    padding: 0 0 0 40px;
    vertical-align: middle;
    display: inline-block;
    position: relative;
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
  .select{
    display: inline-block;
    width: 80%;
    position: relative;
    font-size: .8rem;
    color: #333;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .padding-select{
    padding: 0 .6rem;
    margin: 2px 0 0 0;
    display: block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 26px;
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
    right: .5rem;
    top: 50%;
    margin: -.3rem 0 0 0;
    font-size: .7rem;
    color: #ccc;
  }
  .select-wrap{
    max-height: 10rem;
    overflow: auto;
    width: 100%;
    padding-right: 1rem;
  }
  .selection>.el-select{
    width: 80%;
  }
  .city{
    overflow: hidden;
  }
  .search-btns{
    display: inline-block;
    vertical-align: middle;
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
    display: inline-block;
  }
  .table-box{
    margin-top: 10px;
  }
  .backToIndex-PC{
    display: inline-block;
  }
  .backToIndex, .phone-click{
    display: none;
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
    .search-btns{
      display: block;
      margin-top: 8px;
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
    .phone-click{
      display: block;
      font-size: .7rem;
    }
    .phone-click>div{
      display: inline-block;
      padding-left: .5rem;
    }
    .backToIndex{
      display: block;
      position: fixed;
      bottom: .5rem;
      left: .5rem;
    }
    .backToIndex-PC{
      display: none;
    }
  }
</style>
