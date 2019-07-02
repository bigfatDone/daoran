<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableData"
      stripe
      :max-height="height"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      v-loading="loading"
      :cell-style="rowClass"
      style="width: 100%">
      <el-table-column
        property="ctime"
        min-width="100"
        sortable
        label="时间">
      </el-table-column>
      <el-table-column
        property="val"
        min-width="80"
        sortable
        :label="labelStr">
      </el-table-column>
      <el-table-column
        property="day1Rate"
        min-width="82"
        sortable
        class-name="ttime"
        label="1天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day1Rate) === 0" style="color: red">{{Number(scope.row.day1Rate)}}%</p>
          <p v-if="Number(scope.row.day1Rate) <= 20 && Number(scope.row.day1Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day1Rate)}}%</p>
          <p v-if="Number(scope.row.day1Rate) > 20 && Number(scope.row.day1Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day1Rate)}}%</p>
          <p v-if="Number(scope.row.day1Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day1Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="day1Rate"
        min-width="82"
        sortable
        label="2天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day2Rate) === 0" style="color: red">{{Number(scope.row.day2Rate)}}%</p>
          <p v-if="Number(scope.row.day2Rate) <= 20 && Number(scope.row.day2Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day2Rate)}}%</p>
          <p v-if="Number(scope.row.day2Rate) > 20 && Number(scope.row.day2Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day2Rate)}}%</p>
          <p v-if="Number(scope.row.day2Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day2Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="day1Rate"
        min-width="82"
        sortable
        label="3天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day3Rate) === 0" style="color: red">{{Number(scope.row.day3Rate)}}%</p>
          <p v-if="Number(scope.row.day3Rate) <= 20 && Number(scope.row.day3Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day3Rate)}}%</p>
          <p v-if="Number(scope.row.day3Rate) > 20 && Number(scope.row.day3Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day3Rate)}}%</p>
          <p v-if="Number(scope.row.day3Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day3Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="day1Rate"
        min-width="82"
        sortable
        label="4天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day4Rate) === 0" style="color: red">{{Number(scope.row.day4Rate)}}%</p>
          <p v-if="Number(scope.row.day4Rate) <= 20 && Number(scope.row.day4Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day4Rate)}}%</p>
          <p v-if="Number(scope.row.day4Rate) > 20 && Number(scope.row.day3Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day4Rate)}}%</p>
          <p v-if="Number(scope.row.day4Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day4Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="day1Rate"
        min-width="82"
        sortable
        label="5天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day5Rate) === 0" style="color: red">{{Number(scope.row.day5Rate)}}%</p>
          <p v-if="Number(scope.row.day5Rate) <= 20 && Number(scope.row.day5Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day5Rate)}}%</p>
          <p v-if="Number(scope.row.day5Rate) > 20 && Number(scope.row.day5Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day5Rate)}}%</p>
          <p v-if="Number(scope.row.day5Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day5Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="orderRate"
        min-width="82"
        sortable
        label="6天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day6Rate) === 0" style="color: red">{{Number(scope.row.day6Rate)}}%</p>
          <p v-if="Number(scope.row.day6Rate) <= 20 && Number(scope.row.day6Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day6Rate)}}%</p>
          <p v-if="Number(scope.row.day6Rate) > 20 && Number(scope.row.day6Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day6Rate)}}%</p>
          <p v-if="Number(scope.row.day6Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day6Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="repeatRate"
        min-width="82"
        sortable
        label="7天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day7Rate) === 0" style="color: red">{{Number(scope.row.day7Rate)}}%</p>
          <p v-if="Number(scope.row.day7Rate) <= 20 && Number(scope.row.day7Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day7Rate)}}%</p>
          <p v-if="Number(scope.row.day7Rate) > 20 && Number(scope.row.day7Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day7Rate)}}%</p>
          <p v-if="Number(scope.row.day7Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day7Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="repeatRate"
        min-width="82"
        sortable
        label="14天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day14Rate) === 0" style="color: red">{{Number(scope.row.day14Rate)}}%</p>
          <p v-if="Number(scope.row.day14Rate) <= 20 && Number(scope.row.day14Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day14Rate)}}%</p>
          <p v-if="Number(scope.row.day14Rate) > 20 && Number(scope.row.day14Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day14Rate)}}%</p>
          <p v-if="Number(scope.row.day14Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day14Rate)}}%</p>
        </template>
      </el-table-column>
      <el-table-column
        property="repeatRate"
        min-width="82"
        sortable
        label="30天后">
        <template slot-scope="scope">
          <p v-if="Number(scope.row.day30Rate) === 0" style="color: red">{{Number(scope.row.day30Rate)}}%</p>
          <p v-if="Number(scope.row.day30Rate) <= 20 && Number(scope.row.day30Rate) !== 0" style="background: #eaf9ff">{{Number(scope.row.day30Rate)}}%</p>
          <p v-if="Number(scope.row.day30Rate) > 20 && Number(scope.row.day30Rate) <= 40" style="background: #c2ebfd">{{Number(scope.row.day30Rate)}}%</p>
          <p v-if="Number(scope.row.day30Rate) > 40" style="background: #9cd9fc">{{Number(scope.row.day30Rate)}}%</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "orderOTT-table",
    props: ["tableData","loading","height","tableType"],
    components: {

    },
    data () {
      return {
        labelStr: '新增用户',
      }
    },
    computed: {
    },
    watch:{
      tableType(ev){
        if (ev === 'new') {
          this.labelStr = '新增用户';
        } else {
          this.labelStr = '访问用户'
        }
      }
    },
    mounted () {
    },
    methods: {
      rowClass (row, index) {
        // 小于等于20%的用浅蓝色#eaf9ff，20%-40%内的用蓝色#c2ebfd，大于40%的用深蓝色#9cd9fc
        // console.log(row.row)
        // console.log(index)
        // for (let i in row.row) {
        //   if (i !== 'ctime' && i !== 'val') {
        //     if (parseInt(row.row[i]) <= 20 ) {
        //       return { "background": "#eaf9ff" }
        //     };
        //     if (parseInt(row.row[i]) <= 40 ) {
        //       return { "background": "#c2ebfd" }
        //     };
        //     if (parseInt(row.row[i]) > 40 ) {
        //       return { "background": "#9cd9fc" }
        //     };
        //   }
        // }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .time{
    background: #00b4aa;
  }
  .ttime{
    background: #3a8ee6!important;
  }
</style>
