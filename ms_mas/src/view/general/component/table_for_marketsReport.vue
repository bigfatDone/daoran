<template>
  <div class="table_for_marketsReport">
    <el-table
      :data="tableData"
      :max-height="height"
      v-loading="loading"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      stripe
      border>
      <el-table-column
        prop="ctime"
        label="统计时间段"
        min-width="95"
        sortable>
      </el-table-column>
      <el-table-column
        prop="sNodeName"
        min-width="80"
        label="项目">
      </el-table-column>
      <el-table-column
        prop="sProvinceName"
        min-width="100"
        label="区域">
      </el-table-column>
      <el-table-column
        prop="sProjectName"
        min-width="83"
        label="产品">
      </el-table-column>
      <el-table-column
        prop="iAUTotal"
        label="访问用户数"
        min-width="82"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="iANewUTotal"
        label="新访问用户数"
        min-width="93"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="iANotMonthlyUTotal"
        label="非包月访问用户数"
        min-width="117"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="iOSuccessTotal"
        label="订购成功数"
        min-width="82"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="iOOffTotal"
        label="退订用户数"
        min-width="82"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="orderTRate"
        label="订购转化率"
        min-width="82"
        :render-header="renderProductId"
        sortable>
        <template slot-scope="scope">
          {{Number(scope.row.orderTRate).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="iRetainedUTotal"
        label="留存用户数"
        min-width="82"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="iPUTotal"
        label="点播用户数"
        min-width="82"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
      <el-table-column
        prop="iPTotal"
        label="点播量"
        min-width="60"
        :render-header="renderProductId"
        sortable>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'table_for_marketsReport',
    props:['tableData','loading','height'],
    data () {
      return {
        tableHeadTooltips:[
          {text:'访问用户数',tooltip:'统计周期内，访问人数之和',code:'iAUTotal'},
          {text:'新访问用户数',tooltip:'统计周期内，历史首次访问用户数之和',code:'iANewUTotal'},
          {text:'非包月访问用户数',tooltip:'统计周期内，不存在包月续包产品订购关系（含统计周期内订购成功）的访问用户数之和',code:'iANotMonthlyUTotal'},
          {text:'订购成功数',tooltip:'统计周期内，订购成功用户数之和',code:'iOSuccessTotal'},
          {text:'退订用户数',tooltip:'统计周期内，退订成功用户数之和',code:'iOOffTotal'},
          {text:'订购转化率',tooltip:'统计周期内，订购成功数/访问用户数',code:'orderTRate'},
          {text:'留存用户数',tooltip:'截止至某个时间点，存在包月续包产品订购关系用户数',code:'iRetainedUTotal'},
          {text:'点播用户数',tooltip:'统计周期内，点播用户数之和',code:'iPUTotal'},
          {text:'点播量',tooltip:'统计周期内,点播数量之和(非去重)',code:'iPTotal'},
        ],
      }
    },
    mounted () {
    },
    methods: {
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
</style>
