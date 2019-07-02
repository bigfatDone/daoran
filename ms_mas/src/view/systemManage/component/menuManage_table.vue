<template>
  <div class="menuManage_table">
    <div style="padding: 0 0 1rem 0;">
      <el-button type="primary" icon="el-icon-plus" @click="addMenu()">新增</el-button>
    </div>
    <el-table
      ref="menuTable"
      :data="tableData"
      v-loading="loading"
      :max-height="height"
      highlight-current-row
      border
      stripe
      width="100%">
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        property=""
        min-width="180"
        label="菜单名称">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 'open'">
            <span :class="scope.row.marginLeft"><i :class="scope.row.selectState"></i></span>{{scope.row.text}}
          </span>
          <span v-else>
            <span :class="scope.row.marginLeft" @click="childrenMenu(scope.row.id)"><i :class="scope.row.selectState"></i> </span>{{scope.row.text}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        property="functionType"
        label="菜单类型"
        min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.functionType === '0'">
            菜单类型
          </span>
          <span v-else-if="scope.row.functionType === '3'">
            访问类型
          </span>
        </template>
      </el-table-column>
      <el-table-column
        property="src"
        min-width="120"
        label="菜单地址">
      </el-table-column>
      <el-table-column
        property="order"
        label="菜单顺序"
        min-width="69">
      </el-table-column>
      <el-table-column
        property=""
        label="操作"
        fixed="right"
        min-width="95">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="editMenu(scope.row)" title="编辑" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)" title="删除" circle></el-button>
            <!--<el-button type="info" icon="el-icon-setting" @click="pageAccess(scope.row.id)" title="页面控件权限" circle></el-button>-->
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'menuManage_table',
    props:['refresh'],
    components: {
    },
    data () {
      return {
        loading:true,
        activeIndex:[],

        tableData:[],
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
      refresh(){
        this.initMenu();
      }
    },
    mounted () {
      this.initMenu()
    },
    methods: {
      initMenu(){
        let that = this;
        that.tableData=[];
        that.loading = true;
        that.$ajax({//获取菜单列表
          url: "/ms_bas/function/functiongrid?field=id,functionName,TSIcon_iconPath,functionType,functionUrl,functionOrder",
          method: "post",
          data: {},
          success: function (response) {
            that.loading = false;
            response.data.forEach((item, index) => {
              if (item.state === 'open'){
                that.$set(item, "selectState", '');
                that.$set(item, "marginLeft", 'menuLeft');
              }else {
                that.$set(item, "selectState", 'el-icon-arrow-right');
                that.$set(item, "marginLeft", 'menuLeft');
              }
              that.tableData.push(item);
            });
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      childrenMenu(id){
        let that = this;
        that.tableData.forEach((item,index)=>{
          if (item.id === id){
            let state = item.selectState=='el-icon-arrow-right'?'el-icon-arrow-down':'el-icon-arrow-right';
            item.selectState = state;
            if (!item.children){
              that.$ajax({//获取子菜单列表
                url: "/ms_bas/function/functiongrid?field=id,functionName,TSIcon_iconPath,functionType,functionUrl,functionOrder",
                method: "post",
                data: {id:id},
                success: function (response) {
                  let data = [];
                  response.data.forEach((item, i) => {
                    that.$set(item, "selectState", 'el-icon-tickets');
                    that.$set(item, "marginLeft", 'childrenLeft');
                    data.push(item);
                  });
                  that.$set(item, "children", data);
                  for (let i=data.length-1;i>=0;i--){
                    that.tableData.splice(index+1, 0, data[i]);
                  }
                },
                error: function (error) {
                  that.$message.error(error);
                }
              });
            }else {
              if (item.selectState !=='el-icon-arrow-down'){
                for (let i=item.children.length-1;i>=0;i--){
                  that.tableData.splice(index+i+1, 1);
                }
              }else {
                for (let i=item.children.length-1;i>=0;i--){
                  that.tableData.splice(index+1, 0,item.children[i]);
                }
              }
            }
          }
        });
      },
      addMenu(){//新增菜单
        let that = this;
        that.$emit("menuEdit",{type:'add',data:''})
      },
      editMenu(id){//编辑
        let that = this;
        that.$emit("menuEdit",{type:'edit',data:id})
      },
      del(data){//删除
        let that = this;
        that.$emit("del",{data:data})
      },
      pageAccess(id){//页面权限控件
        let that = this;
        that.$emit("pageAccess",{id:id})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .menuLeft{
    width: 1rem;
    display: inline-block;
  }
  .menuLeft i{
    cursor: pointer;
    color: #303133;
  }
  .childrenLeft{
    width: 2rem;
    display: inline-block;
  }
  .childrenLeft i{
    margin: 0 0 0 1rem;
    color: #409EFF;
  }
  @media screen and (max-width: 800px) {
  }
</style>
