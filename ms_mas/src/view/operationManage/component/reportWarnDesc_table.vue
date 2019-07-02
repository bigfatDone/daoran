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
      :max-height="height"
      style="width: 100%">
      <el-table-column
        prop="reIndicators"
        min-width="100"
        label="维度">
      </el-table-column>
      <el-table-column
        prop="reType"
        min-width="45"
        label="判断">
        <template slot-scope="scope">
          {{scope.row.reType | reTypeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="reValue"
        sortable
        min-width="80"
        label="阈值">
        <template slot-scope="scope">
          {{Number(scope.row.reValue*100).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column
        prop="reDesc"
        min-width="160"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="reId"
        min-width="83"
        label="监测范围">
        <template slot-scope="scope">
          <el-row>
            <el-button type="info" icon="el-icon-setting" @click="toSetting(scope.row)" round>配置</el-button>
          </el-row>
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
    name: 'reportWarnDesc_table',
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
      reTypeFilter(val){
        if (val === 'more'){
          return '大于';
        }else if(val ==='less'){
          return '小于';
        }else{
          return '等于';
        }
      }
    },
    methods: {
      initTable(){
        let that = this;
        //计算适应高度
        that.$ajax({
          url: "/ms_bas/reportWarnDesc/list",
          method: "post",
          data: {},
          success: function (res) {
            that.tableData = res.data;
            that.loading =false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      add(){
        let that = this;
        that.$emit("warnEdit",{type:'add',data:''})
      },
      edit(data){
        let that = this;
        that.$emit("warnEdit",{type:'edit',data:data})
      },
      del(data) {
        let that = this;
        that.$emit("warnDel", {data: data});
      },
      toSetting(data){
        let that = this;
        that.$emit("toSetting", {data: data});
      }
    }
  }
</script>
