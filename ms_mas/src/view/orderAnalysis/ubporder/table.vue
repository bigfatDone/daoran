<template>
  <div class="pa-pages-table">
    <el-button-group class="tableChange">
      <el-button v-for="item in tableSelect" :key="item.id" :class="{ 'active-button-group': item.status }" @click="changeTableShow(item.id)">{{item.text}}</el-button>
    </el-button-group>
    <el-button-group class="downloadTable">
      <el-button
        type="primary"
        icon="el-icon-download"
        @click="downloadTable()">下载Excel</el-button>
    </el-button-group>
    <el-table
      ref="ubporder_table1"
      v-loading="loading"
      v-show="tableSelect[0].status"
      :data="tableData"
      border
      stripe
      :max-height="tableHeight"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="ctime"
        min-width="83"
        sortable
        label="统计日期">
      </el-table-column>
      <el-table-column
        property="sNodeName"
        min-width="80"
        label="项目">
      </el-table-column>
      <el-table-column
        property="sProvinceName"
        min-width="82"
        label="区域">
      </el-table-column>
      <el-table-column
        property="sEntryType"
        min-width="70"
        sortable
        label="触发方式">
      </el-table-column>
      <el-table-column
        property="sOrderStyle"
        min-width="95"
        label="订购策略">
      </el-table-column>
      <el-table-column
        property="sProjectName"
        min-width="100"
        label="产品">
      </el-table-column>
      <el-table-column
        property="iOUActionTotal"
        :render-header="renderProductId"
        min-width="105"
        sortable
        label="订购触发用户数">
      </el-table-column>
      <el-table-column
        property="iOUFailTotal"
        :render-header="renderProductId"
        min-width="105"
        sortable
        label="订购失败用户数">
      </el-table-column>
      <el-table-column
        property="iOUSuccessTotal"
        :render-header="renderProductId"
        min-width="105"
        sortable
        label="订购成功用户数">
      </el-table-column>
      <el-table-column
        property="iOSuccessRate"
        :render-header="renderProductId"
        min-width="105"
        sortable
        label="订购触发成功率">
        <template slot-scope="scope">
          {{Number(scope.row.iOSuccessRate).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        property="iOActionTotal"
        :render-header="renderProductId"
        min-width="93"
        sortable
        label="订购触发次数">
      </el-table-column>
      <el-table-column
        property="iOOffTotal"
        :render-header="renderProductId"
        min-width="93"
        sortable
        label="订购取消次数">
      </el-table-column>
      <el-table-column
        property="iOBackTotal"
        :render-header="renderProductId"
        min-width="141"
        sortable
        label="返回主页或无操作次数">
      </el-table-column>
      <el-table-column
        property="iOFailTotal"
        :render-header="renderProductId"
        min-width="93"
        sortable
        label="订购失败次数">
      </el-table-column>
      <el-table-column
        property="iOSuccessTotal"
        :render-header="renderProductId"
        min-width="93"
        sortable
        label="订购成功次数">
      </el-table-column>
    </el-table>

    <el-table
      ref="ubporder_table2"
      v-loading="loading"
      v-show="tableSelect[1].status"
      :data="tableErrorData"
      border
      :max-height="tableHeight"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      style="width: 100%">
      <el-table-column
        property="ctime"
        min-width="83"
        sortable
        label="统计日期">
      </el-table-column>
      <el-table-column
        property="sNodeName"
        min-width="80"
        label="项目">
      </el-table-column>
      <el-table-column
        property="sProjectName"
        min-width="100"
        label="产品">
      </el-table-column>
      <el-table-column
        property="sProvinceName"
        min-width="80"
        label="区域">
      </el-table-column>
      <el-table-column
        property="code"
        min-width="80"
        label="错误代码">
      </el-table-column>
      <el-table-column
        property="codeMessage"
        min-width="70"
        sortable
        label="错误描述">
      </el-table-column>
      <el-table-column
        property="iOFailTotal"
        :render-header="renderProductId"
        min-width="93"
        sortable
        label="订购失败次数">
      </el-table-column>
      <el-table-column
        property="iOUFailTotal"
        :render-header="renderProductId"
        min-width="105"
        sortable
        label="订购失败用户数">
      </el-table-column>
      <el-table-column
        property="iOFailRate"
        :render-header="renderProductId"
        min-width="129"
        sortable
        label="订购失败用户数占比">
        <template slot-scope="scope">
          {{Number(scope.row.iOFailRate).toFixed(2)}}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "ubporder-table",
    props: ["tableData","tableErrorData","searchDatas",'loading'],
    components: {

    },
    data () {
      return {
        tableSelect:[
          {id:1,text:'订购行为分析表',status:true},
          {id:2,text:'订购失败分析表',status:false}
        ],
        tableHeadTooltips:[
          {text:'订购触发次数',tooltip:'统计周期内，订购触发（任一订购）次数之和',code:'iOActionTotal'},
          {text:'订购触发用户数',tooltip:'统计周期内，订购触发（任一订购）用户数之和',code:'iOUActionTotal'},
          {text:'订购取消次数',tooltip:'统计周期内，订购取消的次数',code:'iOOffTotal'},
          {text:'返回主页或无操作次数',tooltip:'进入订购页后，返回主页或无操作次数的总数',code:'iOBackTotal'},
          {text:'订购失败次数',tooltip:'统计周期内，订购失败的次数',code:'iOFailTotal'},
          {text:'订购失败用户数',tooltip:'统计周期内，订购失败的用户数之和',code:'iOUFailTotal'},
          {text:'订购成功次数',tooltip:'统计周期内，订购成功的次数',code:'iOSuccessTotal'},
          {text:'订购成功用户数',tooltip:'统计周期内，订购成功的用户数之和',code:'iOUSuccessTotal'},
          {text:'订购触发成功率',tooltip:'订购成功用户数/订购触发次数',code:'iOSuccessRate'},
          {text:'订购失败用户数占比',tooltip:'订购失败用户数/当日失败总用户数',code:'iOFailRate'},
        ],
        tableHeight:'500'
      }
    },
    computed: {
    },
    mounted () {

    },
    created () {
      this.getBodyHeight();
    },
    methods: {
      getBodyHeight () {
        let that = this;
        let state = false;
        if (document.body.clientWidth<=800){
          state=true;
        }else {
          state=false;
        }
        that.tableHeight = document.body.clientHeight - (state===true ? 150 : 260);
      },
      changeTableShow(id){
        let that = this;
        that.tableSelect.forEach((item,index)=>{
          if (item.id ===id){
            item.status = true;
          }else {
            item.status = false;
          }
        });
      },
      downloadTable(){
        let that = this;
        let url ="/ms_bas/ubporder/toExcel.do?date="+that.searchDatas.date +"&endDate="+that.searchDatas.endDate +"&sNodeCode="+that.searchDatas.sNodeCode+"&sProvinceCode="+that.searchDatas.sProvinceCode+"&sProjectCode="+that.searchDatas.sProjectCode+"&trigger="+that.searchDatas.trigger+"&strategy="+that.searchDatas.strategy;
        window.open(url);
      },
      renderProductId(h, {column,$index}) {
        let that = this;
//        console.log(column)
        return h("el-tooltip", [
          h("span", {
            slot:'content'
          }, that.propertyTooltips(column.property)),
          h("span", {}, column.label),
        ])
      },
      propertyTooltips(val){
        let that = this;
        let result = '';
        that.tableHeadTooltips.forEach((item,index)=>{
          if (item.code === val){
            result = item.tooltip
          }
        });
        return result;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pa-pages-table{
    margin: 1rem 0 0 0;
  }
  .downloadTable, .tableChange{
    padding-bottom: 12px;
  }
  .downloadTable{
    margin: 0 0 0 1rem;
  }
</style>
