<template>
  <div id="productOnLine-warp">
    <v-table @productOnLineEdit="edit($event)" @productOnLineDel="delWarp($event)" :table-state="tableState"></v-table>

    <el-dialog
      :title="dialogTitle"
      custom-class="dailog-min-max"
      :visible.sync="dialogVisible">
      <el-form :model="select" status-icon ref="select" :rules="rules" label-width="80px">
        <el-form-item label="项目" prop="sNodeCode">
          <v-select :data="proForm.node" @select="nodeChange($event)" :placeholder="'请选择项目'"></v-select>
        </el-form-item>
        <el-form-item label="省份" prop="sProvinceCode">
          <v-select :data="proForm.province" @select="provinceChange($event)" :placeholder="'请选择省份'"></v-select>
        </el-form-item>
        <el-form-item label="产品" prop="sProjectCode">
          <v-select :data="proForm.project" @select="productChange($event)" :placeholder="'请选择产品'"></v-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save(select.id)">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      custom-class="dailog-min-max"
      title="提示"
      :model="select"
      :visible.sync="deleteVisible">
      <div>确定要删除  <strong>{{select.sNodeName}}  =>  {{select.sProvinceName}}  =>  {{select.sProjectName}} </strong>   吗？</div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取消</el-button>
            <el-button type="danger" @click="del(select.id)">删除</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import vTable from './component/productOnLine_table'
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'productOnLine',
    components: {
      vTable,vSelect
    },
    data () {
      return {
        dialogVisible:false,
        deleteVisible:false,
        tableState:false,
        dialogTitle:'',
        proForm:{
          node:[],
          project:[],
          province:[],
        },
        select:{
          id:'',
          sNodeCode:'',
          sNodeName:'',
          sProjectCode:'',
          sProjectName:'',
          sProvinceCode:'',
          sProvinceName:'',
        },
        rules:{
          sNodeCode:[
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
          sProvinceCode:[
            { required: true, message: '请选择省份', trigger: 'change' }
          ],
          sProjectCode:[
            { required: true, message: '请选择产品', trigger: 'change' }
          ],
        }
      }
    },
    computed : {
    },
    mounted () {
      this.initTabaleHeight();
    },
    methods: {
      initTabaleHeight(){
        let that = this;
        that.$ajax({//获取关联选项
          url: "/ms_bas/onlineManage/queryData",
          method: "post",
          data: {},
          success: function (res) {
            res.data.node.forEach((item,index)=>{
              item.chosed = false;
              item.text = item.sNodeName;
              item.code = item.sNodeCode+','+item.sNodeName;
            });
            res.data.project.forEach((item,index)=>{
              item.chosed = false;
              item.text = item.sProjectName;
              item.code = item.sProjectCode+','+item.sProjectName;
            });
            res.data.province.forEach((item,index)=>{
              item.chosed = false;
              item.text = item.sProvinceName;
              item.code = item.sProvinceCode+','+item.sProvinceName;
            });
            that.proForm = res.data;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      edit(obj){
        let that = this;
        that.proForm.node.forEach((item,index)=>{
          item.chosed = false;
        });
        that.proForm.province.forEach((item,index)=>{
          item.chosed = false;
        });
        that.proForm.project.forEach((item,index)=>{
          item.chosed = false;
        });
        if (obj.type === 'add'){
          that.dialogTitle = '产品录入';
          that.select={
            id:'',
            sNodeCode:'',
            sNodeName:'',
            sProjectCode:'',
            sProjectName:'',
            sProvinceCode:'',
            sProvinceName:'',
          };
        }else {
          that.dialogTitle = '产品编辑';
          let newData ={};
          newData.sNodeCode = obj.data.sNodeCode +','+obj.data.sNodeName;
          newData.sProjectCode = obj.data.sProjectCode +','+obj.data.sProjectName;
          newData.sProvinceCode = obj.data.sProvinceCode +','+obj.data.sProvinceName;
          newData.id = obj.data.id;
          that.select=newData;
          that.proForm.node.forEach((item,index)=>{
            if(item.code === that.select.sNodeCode){
              item.chosed = true;
            }
          });
          that.proForm.province.forEach((item,index)=>{
            if(item.code === that.select.sProvinceCode){
              item.chosed = true;
            }
          });
          that.proForm.project.forEach((item,index)=>{
            if(item.code === that.select.sProjectCode){
              item.chosed = true;
            }
          });
        }
        that.dialogVisible = true;
        that.$nextTick(function () {
          that.$refs.select.clearValidate();
        });
      },
      delWarp(obj){
        let that = this;
        that.deleteVisible = true;
        that.select=obj.data;
      },
      del(id){
        let that = this;
        that.$ajax({
          url: "/ms_bas/onlineManage/deleteData",
          method: "post",
          data: {id:id},
          success: function (res) {
            if (res.data.status === true){
              that.$message.success(res.data.message);
              that.tableState = that.tableState===true?false:true;
            }else {
              that.$message.warning(res.data.message);
            }
            that.deleteVisible = false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      save(id){
        let that = this;
        that.$refs.select.validate((valid) => {
          if (valid) {
            let data = {
              node:that.select.sNodeCode,
              province:that.select.sProvinceCode,
              project:that.select.sProjectCode,
            };
            if (id === ''){
              that.$ajax({
                url: "/ms_bas/onlineManage/addData",
                method: "post",
                data: {json:JSON.stringify(data)},
                success: function (res) {
                  if (res.data.status === true){
                    that.$message.success(res.data.message);
                    that.tableState = that.tableState===true?false:true;
                  }else {
                    that.$message.warning(res.data.message);
                  }
                  that.dialogVisible = false;
                },
                error: function (error) {
                  that.$message.error(error);
                }
              });
            }else {
              that.$ajax({
                url: "/ms_bas/onlineManage/update",
                method: "post",
                data: {id:that.select.id,json:JSON.stringify(data)},
                success: function (res) {
                  if (res.data.status === true){
                    that.$message.success(res.data.message);
                    that.tableState = that.tableState===true?false:true;
                  }else {
                    that.$message.warning(res.data.message);
                  }
                  that.dialogVisible = false;
                },
                error: function (error) {
                  that.$message.error(error);
                }
              });
            }
          } else {
            return;
          }
        });
      },
      nodeChange(val){
        let that =this;
        that.select.sNodeCode = val.code;
        that.proForm.node.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
      },
      provinceChange(val){
        let that =this;
        that.select.sProvinceCode = val.code;
        that.proForm.province.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
      },
      productChange(val){
        let that =this;
        that.select.sProjectCode = val.code;
        that.proForm.project.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
