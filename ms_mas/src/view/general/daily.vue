<template>
  <div class="gather">
    <div>
      <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
      <div
        class="search-index"
        :class="{'show':searchState}">
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
        <div class="selection">
          <span class="label">项目:</span>
          <el-popover
            placement="bottom-start"
            width="170"
            trigger="click">
            <div class="city">
              <div class="tool">
                <el-button-group>
                  <el-button @click="AreaChange(true)">全选</el-button>
                  <el-button @click="AreaChange(false)">全不选</el-button>
                </el-button-group>
              </div>
              <div class="select-wrap">
                <p
                  v-for="(item, index) in node"
                  v-show="item.visiable">
                  <el-checkbox
                    v-model="item.chosed"
                    @change="nodeChange(item, $event)">{{item.text}}</el-checkbox>
                </p>
              </div>
            </div>
            <div class="select" slot="reference">
              <div class="padding-select">
                <span v-for="item in node" v-show="item.chosed">{{item.text}},</span>
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
          </el-popover>
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
      <el-table
        :data="tableData"
        v-loading="loading"
        cell-class-name="text-center"
        header-cell-class-name="text-center"
        stripe
        border>
        <el-table-column
          prop=""
          label="项目名称"
          min-width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row.sNodeCode)">{{ scope.row.sNodeName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="accessUsersTotal"
          min-width="83"
          sortable
          label="访问用户数">
        </el-table-column>
        <el-table-column
          prop="successUsersTotal"
          min-width="105"
          sortable
          label="订购成功用户数">
        </el-table-column>
        <el-table-column
          prop="conversionRate"
          min-width="80"
          sortable
          label="转化率">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'daily',
    components: {
    },
    data () {
      return {
        select:[
          {id:'yesterday',text:'昨日',status:true},
        ],
        node:[],
        node_code:'',

        Areastatus:false,
        loading:true,
        tableData:[],
        selectData:[],
        query:[],
        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            return time.getTime() > Date.now()-3600 * 1000 * 24;
          }
        },

        historySearch:{
          date: "",
          node: "",
          typeCode: "",
        }
      }
    },
    mounted () {
      this.query=this.$route.query;
      this.yesterday();
      this.Getselectdata();
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
      searchDatestatus () {
        return this.$store.getters.getDailySearchDatestatus;
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
        if (that.selectArr.length ===0 || that.selectArrState === true){
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
              that.$message.error('项目日报页面数据请求失败，请刷新项目日报页面');
            }
          })
        }else {
          that.selectData =that.selectArr;
          that.initDefault();
        }
      },
      initDefault(){
        let that = this;
        that.selectData.forEach((item, index) => {
          that.$set(item, "chosed", true);
          that.$set(item, "visiable", true);
          that.node.push(item);
        });
        that.node.forEach((item, index) => {
          if (item.chosed) {
            that.node_code += (that.node.length > 0 ? "," + item.attributes.code : item.attributes.code);
          }
        });
        that.Areastatus=true;
        if (that.searchDatestatus === true){//判断详情页是否有改变了日期：true改变、false不变
          that.$store.commit('changeDateForDaily', that.query.date);
          that.select.forEach((item,index)=>{
            item.status = false;
          })
        }
        that.search();
      },
      nodeChange(o, selected){//选择项目
        let that = this;
        that.node_code='';
        that.node.forEach((item, index) => { /*更新节点选择*/
          if (item.attributes.code == o.attributes.code) {
            item.chosed = selected;
          }
          if (item.chosed) {
            that.node_code += (that.node.length > 0 ? "," + item.attributes.code : item.attributes.code);
          }
        });
        if (selected === false){
          that.Areastatus = false;
        }else {
          let count = 0;
          that.node.forEach((item, index) => {
            if (item.chosed === true){
              count +=1;
            }
          });
          if (count === that.node.length){
            that.Areastatus = true;
          }else {
            that.Areastatus = false;
          }
        }
      },
      AreaChange(val){//全选
        let that = this;
        that.node_code='';
        that.node.forEach((item, index) => {
          if(item.visiable) {
            item.chosed = val;
          }
          if (item.chosed) {
            that.node_code += (that.node.length > 0 ? "," + item.attributes.code : item.attributes.code);
          }
        });
      },
      search(){//搜索
        let that = this;
        let tv_center = "";
        let tv_center_dmcb = "";
        let tv_center_uni = "";

        if (that.changeDate==='' || that.changeDate===null){
          that.$message.error('请选择查询时间');
          return;
        }
        if (that.node_code===''){
          that.$message.error('请选择项目');
          return;
        }

        /*tv中心-tv中心-多米城堡特殊处理 start*/
        if (that.node_code.indexOf("021200,021301") >= 0) {
          tv_center = "1";
          that.node_code = that.node_code.replace(/021200,021301/, "tv_center");
        }

        if (that.node_code.indexOf("021200") >= 0) {
          tv_center_dmcb = "2";
        }

        tv_center_uni = tv_center == 1 ? tv_center + "," + tv_center_dmcb : tv_center_dmcb;
        that.node_code = that.node_code.replace(/tv_center/, "021200,021301");
        /*tv中心-tv中心-多米城堡特殊处理 end*/

        that.historySearch={
          date:that.changeDate,
          node:that.node_code,
          typeCode: tv_center_uni,
        };

        that.$store.commit('changeMobileSearchState', false);
        that.loading =true;
        that.$ajax({
          url: "/ms_bas/dailyReport/getNodeDataTable",
          data: {data:that.changeDate,sNodeCode: that.node_code, typeCode: tv_center_uni},
          method: "post",
          success: function (response) {
            that.tableData = [];
            if (response.data.status === true){
              that.tableData = response.data.data;
              /*if (that.node_code===',021200'){
                that.tableData.push(response.data.data[1]);
              }else if (that.node_code===',021200,021301'){
                that.tableData.push(response.data.data[0]);
              }else {
                that.tableData = response.data.data;
              }*/
            }else {
              that.$message.warning(response.data.message);
            }
            that.loading =false;
          },
          error: function (err) {
            that.$message.error('项目日报页面数据请求失败，请刷新项目日报页面');
          }
        })
      },
      datechanges(date){
        let that = this;
        that.select.forEach((item,index)=>{
          item.status = false;
        });
        that.$store.commit('changeDateForDaily', date);
      },
      detail(nodeCode){
        let that = this;
        this.$router.push({ path: '/dailyDetail',query: {nodeCode: nodeCode,date:that.historySearch.date} });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .date-input-group{
    margin: 0;
    width: 220px;
    display: inline-block;
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
    width: 180px;
    height: 30px;
    padding: 0 0 0 50px;
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
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding-right: .5rem;
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
  }
  .table-box{
    margin-top: 10px;
  }
  .tool{
    text-align: center;
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
  }
</style>
