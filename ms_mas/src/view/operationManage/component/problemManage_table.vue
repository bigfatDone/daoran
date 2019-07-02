<template>
  <div>
    <div style="padding: 0 0 1rem 0;">
      <el-button type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
    </div>
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
        min-width="70"
        label="项目">
      </el-table-column>
      <el-table-column
        prop=""
        min-width="100"
        label="区域">
        <template slot-scope="scope">
          <span v-if="scope.row.sProvinceName === 'all'">
            全部
          </span>
          <span v-else>
            {{scope.row.sProvinceName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        min-width="90"
        label="产品">
        <template slot-scope="scope">
          {{scope.row.sProjectName | allFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        min-width="83"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        min-width="83"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="description"
        min-width="160"
        label="问题描述">
      </el-table-column>
      <el-table-column
        prop="reason"
        min-width="160"
        label="问题原因">
      </el-table-column>
      <el-table-column
        prop="result"
        min-width="160"
        label="处理结果">
      </el-table-column>
      <el-table-column
        prop="refReport"
        min-width="160"
        label="涉及报表">
        <template slot-scope="scope">
          {{scope.row.refReport | tableFilter}}
        </template>
      </el-table-column>
      <el-table-column
        property=""
        label="操作"
        fixed="right"
        min-width="91">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'problemManage_table',
    props:['tableState'],
    components: {
    },
    data () {
      return {
        tableData:[],
        loading:true,
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
      tableState(){
        this.initTable();
      }
    },
    mounted () {
      this.initTable();
    },
    filters:{
      tableFilter(val){
        let that = this;
        let value =[];
        if ( typeof (val) !== 'string'){
          value = val;
        }else {
          value =val.split(',');
        }
        let tableArr=[
          {id:1,name:'营销运营报表'},
          {id:2,name:'常规汇总报表'},
          {id:3,name:'分时段数据'},
          {id:4,name:'入口访问数据'},
          {id:5,name:'活跃率分析'},
          {id:6,name:'退订率分析'},
          {id:7,name:'ubp订购分析'},
          {id:8,name:'页面分析报表'},
          {id:9,name:'运营位分析报表'}];
        let results=[];
        tableArr.forEach((obj,i)=>{
          value.forEach((item,index)=>{
            if(item == obj.id){
              results.push(obj.name);
            }
          });
        });
        return results.join(',');
      },
      allFilter(val){
        let that = this;
        let results='';
        if ( val === 'all'){
          results = '全部';
        }else {
          results = val;
        }
        return results;
      }
    },
    methods: {
      initTable(){
        let that = this;
        that.$ajax({
          url: "/ms_bas/problemManage/getAllProData",
          method: "post",
          data: {},
          success: function (res) {
            that.nodeArr=[];
            that.provinceArr=[];
            that.tableData = res.data;
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
            that.loading =false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
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
      add(){
        let that = this;
        that.$emit("problemEdit",{type:'add',data:''})
      },
      edit(data){
        let that = this;
        that.$emit("problemEdit",{type:'edit',data:data})
      },
      del(data) {
        let that = this;
        that.$emit("problemDel", {data: data});
      }
    }
  }
</script>
