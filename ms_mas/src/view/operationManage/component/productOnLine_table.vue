<template>
  <div>
    <el-table
      :data="tableData"
      v-loading="loading"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      border
      stripe
      :span-method="tableSpanMethod"
      :max-height="height"
      style="width: 100%">
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
        min-width="100"
        label="产品">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'productOnLine_table',
    props:['tableData','loading'],
    components: {
    },
    data () {
      return {
        nodeArr:[],
        provinceArr:[],
      }
    },
    computed : {
      height () {
        if (document.body.clientWidth > 800){
          return document.body.clientHeight - 180;
        }else {
          return document.body.clientHeight - 140;
        }
      }
    },
    watch:{
      tableData (ev) {
        this.DealTableData();
      }
    },
    mounted () {

    },
    methods: {
      DealTableData () {
        let that = this;
        that.nodeArr = [];
        that.provinceArr = [];
        for (let i = 0; i < that.tableData.length; i++) {
          if (i === 0) {
            that.nodeArr.push(1);
            that.provinceArr.push(1);
            that.pos = 0;
            that.pos2 = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            if (that.tableData[i].sNodeName === that.tableData[i - 1].sNodeName) {
              that.nodeArr[that.pos] += 1;
              that.nodeArr.push(0);
            } else {
              that.nodeArr.push(1);
              that.pos = i;
            }
            if (that.tableData[i].sProvinceName === that.tableData[i - 1].sProvinceName) {
              that.provinceArr[that.pos2] += 1;
              that.provinceArr.push(0);
            } else {
              that.provinceArr.push(1);
              that.pos2 = i;
            }
          }
        }
      },
      tableSpanMethod({ row, column, rowIndex, columnIndex }) {
        let that =this;
        if (columnIndex === 0) {//合并第一列
          const _row = that.nodeArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }else if (columnIndex === 1){//合并第二列
          const _row = that.provinceArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
    }
  }
</script>
