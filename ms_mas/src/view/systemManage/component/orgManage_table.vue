<template>
  <div class="menuManage_table">
    <div style="padding: 0 0 1rem 0;">
      <el-button type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
    </div>
    <el-table
      ref="menuTable"
      :data="tableData"
      v-loading="loading"
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
        label="组织机构名称">
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
        property="src"
        label="组织机构描述">
      </el-table-column>
      <el-table-column
        property="orgCode"
        label="机构编码">
      </el-table-column>
      <el-table-column
        property="orgType"
        label="机构类型">
      </el-table-column>
      <el-table-column
        property="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        property="fax"
        label="传真">
      </el-table-column>
      <el-table-column
        property="address"
        label="地址">
      </el-table-column>
      <el-table-column
        property=""
        label="操作"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" title="编辑" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)" title="删除" circle></el-button>
            <el-button icon="el-icon-tickets" @click="view(scope.row)" title="查看成员" circle></el-button>
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
        that.$ajax({//获取组织机构列表
          url: "/ms_bas/depart/departgrid?field:id,departname,description,orgCode,orgType,mobile,fax,address",
          method: "post",
          data: {},
          success: function (res) {
            that.loading = false;
            res.data.forEach((item, index) => {
              if (item.state === 'open'){
                that.$set(item, "selectState", '');
                that.$set(item, "marginLeft", 'menuLeft');
              }else {
                that.$set(item, "selectState", 'el-icon-arrow-right');
                that.$set(item, "marginLeft", 'menuLeft');
              }
              let obj ={};
              for (let i in item){
                if(i==='fieldMap.address'){
                  obj.address = item[i];
                }else if(i==='fieldMap.fax'){
                  obj.fax = item[i];
                }else if(i==='fieldMap.mobile'){
                  obj.mobile = item[i];
                }else if(i==='fieldMap.orgCode'){
                  obj.orgCode = item[i];
                }else if(i==='fieldMap.orgType'){
                  obj.orgType = item[i];
                }else {
                  obj[i] = item[i];
                }
              }
              that.tableData.push(obj);
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
              that.$ajax({//获取子列表
                url: "/ms_bas/depart/departgrid?field:id,departname,description,orgCode,orgType,mobile,fax,address",
                method: "post",
                data: {id:id},
                success: function (response) {
                  let data = [];
                  response.data.forEach((item, i) => {
                    let obj ={};
                    that.$set(item, "selectState", 'el-icon-tickets');
                    that.$set(item, "marginLeft", 'childrenLeft');
                    for (let i in item){
                      if(i==='fieldMap.address'){
                        obj.address = item[i];
                      }else if(i==='fieldMap.fax'){
                        obj.fax = item[i];
                      }else if(i==='fieldMap.mobile'){
                        obj.mobile = item[i];
                      }else if(i==='fieldMap.orgCode'){
                        obj.orgCode = item[i];
                      }else if(i==='fieldMap.orgType'){
                        obj.orgType = item[i];
                      }else {
                        obj[i] = item[i];
                      }
                    }
                    data.push(obj);
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
      add(){//新增
        let that = this;
        that.$emit("edit",{type:'add',data:''})
      },
      edit(data){//编辑
        let that = this;
        that.$emit("edit",{type:'edit',data:data})
      },
      del(data){//删除
        let that = this;
        that.$emit("del",{data:data})
      },
      view(data){//查看成员
        let that = this;
        that.$emit("view",{data:data})
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
