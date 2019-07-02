<template>
  <div>
    <v-search
      @search="searchResult($event)"
      @loading="loadingResult($event)"
      @synchronous="synchronousResult($event)"
      @add="addResult($event)"
      :to-search="toSearch"></v-search>
    <v-table v-loading="loading" :table-data="tableData"></v-table>

    <el-dialog
      title="同步新上线项目"
      custom-class="dailog-min-max"
      :visible.sync="dialogVisible">
      <el-form :model="select" status-icon ref="select" :rules="rules" label-width="80px">
        <el-form-item label="节点编码" prop="nodeCode">
          <el-input v-model="select.nodeCode"></el-input>
        </el-form-item>
        <el-form-item label="项目编码" prop="projectCode">
          <el-input v-model="select.projectCode"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="synSure">同步项目</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增项目"
      custom-class="dailog-min-max"
      :visible.sync="addVisible">
      <el-form :model="selectData" status-icon ref="selectData" :rules="selectrules" label-width="80px">
        <el-form-item label="项目" prop="sNodeCode">
          <v-select :data="proForm.node" :addVisible="addVisible" @select="nodeChange($event)" :placeholder="'请选择项目'"></v-select>
        </el-form-item>
        <el-form-item label="省份" prop="sProvinceCode">
          <v-select :data="proForm.province" :addVisible="addVisible" @select="provinceChange($event)" :placeholder="'请选择省份'"></v-select>
        </el-form-item>
        <el-form-item label="产品" prop="sProjectCode">
          <v-select :data="proForm.project" :addVisible="addVisible" @select="productChange($event)" :placeholder="'请选择产品'"></v-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="save(selectData.id)">保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import vSearch from './component/productOnLine_search'
  import vTable from './component/productOnLine_table'
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'productOnLine',
    components: {
      vSearch,vTable,vSelect
    },
    data () {
      return {
        loading:true,
        synchronousState:true,
        addState:true,
        tableData:[],

        dialogVisible:false,
        addVisible:false,
        toSearch:false,
        select:{
          nodeCode:'',
          projectCode:'',
        },
        rules:{
          nodeCode:[
            { required: true, message: '请输入节点编码', trigger: 'blur' },
          ],
          projectCode:[
            { required: true, message: '请输入项目编码', trigger: 'blur' },
          ],
        },

        proForm:{
          node:[],
          project:[],
          province:[],
        },
        selectData:{
          id:'',
          sNodeCode:'',
          sNodeName:'',
          sProjectCode:'',
          sProjectName:'',
          sProvinceCode:'',
          sProvinceName:'',
        },
        selectrules:{
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
    watch:{
      synchronousState(ev){
        this.select={
          nodeCode:'',
          projectCode:'',
        };
        this.dialogVisible =true;
        this.$nextTick(function () {
          this.$refs.select.clearValidate();
        });
      },
      addState(ev){
        this.selectData={
          id:'',
          sNodeCode:'',
          sNodeName:'',
          sProjectCode:'',
          sProjectName:'',
          sProvinceCode:'',
          sProvinceName:'',
        };
        this.addVisible =true;
        this.$nextTick(function () {
          this.$refs.selectData.clearValidate();
        });
      }
    },
    mounted () {
      this.initqueryData();
    },
    methods: {
      initqueryData(){
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
      save(id){
        let that = this;
        that.$refs.selectData.validate((valid) => {
          if (valid) {
            let data = {
              node:that.select.sNodeCode,
              province:that.select.sProvinceCode,
              project:that.select.sProjectCode,
            };
            that.$ajax({
              url: "/ms_bas/onlineManage/addData",
              method: "post",
              data: {json:JSON.stringify(data)},
              success: function (res) {
                if (res.data.status === true){
                  that.$message.success(res.data.message);
                  that.toSearch = !that.toSearch;
                }else {
                  that.$message.warning(res.data.message);
                }
                that.addVisible = false;
              },
              error: function (error) {
                that.$message.error(error);
              }
            });


//********            if (id === ''){debugger
//********//              that.$ajax({
//********//                url: "/ms_bas/onlineManage/addData",
//********//                method: "post",
//********//                data: {json:JSON.stringify(data)},
//********//                success: function (res) {
//********//                  if (res.data.status === true){
//********//                    that.$message.success(res.data.message);
//********//                    that.tableState = that.tableState===true?false:true;
//********//                  }else {
//********//                    that.$message.warning(res.data.message);
//********//                  }
//********//                  that.dialogVisible = false;
//********//                },
//********//                error: function (error) {
//********//                  that.$message.error(error);
//********//                }
//********//              });
//********            }else {
//********              that.$ajax({
//********                url: "/ms_bas/onlineManage/update",
//********                method: "post",
//********                data: {id:that.select.id,json:JSON.stringify(data)},
//********                success: function (res) {
//********                  if (res.data.status === true){
//********                    that.$message.success(res.data.message);
//********                    that.toSearch = !that.toSearch;
//********                  }else {
//********                    that.$message.warning(res.data.message);
//********                  }
//********                  that.addVisible = false;
//********                },
//********                error: function (error) {
//********                  that.$message.error(error);
//********                }
//********              });
//********            }
          } else {
            return;
          }
        });
      },
      nodeChange(val){
        let that =this;
        that.select.sNodeCode = val.code;
        that.selectData.sNodeCode = val.code;
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
        that.selectData.sProvinceCode = val.code;
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
        that.selectData.sProjectCode = val.code;
        that.proForm.project.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
      },

      searchResult(data){
        let that = this;
        that.tableData = data.data;
      },
      loadingResult(state){
        let that = this;
        that.loading = state;
      },
      synchronousResult(state){
        let that = this;
        that.synchronousState = state;
      },
      addResult(state){
        let that = this;
        console.log(that.proForm)
        console.log(this.select)
        console.log(this.selectData)
        for( let i in this.select) {
          if (i === 'sProjectCode' || i === 'sProvinceCode' || i === 'sNodeCode' ) {
            this.select[i] = '';
          }
        }
        that.addState = state;
      },
      synSure(){
        let that = this;
        that.$refs.select.validate((valid) => {
          if (valid) {
            that.$ajax({
              url: '/ms_bas/onlineManage/sysNewProduct',
              data: that.select,
              method: "post",
              success: function (res) {
                let result = res.data;
                if (result.status) {
                  that.toSearch = !that.toSearch;
                  that.$message.success(result.message);
                }else {
                  that.$message.warning(result.message);
                }
                that.dialogVisible = false;
              },
              error: function (err) {
                that.$message.error(err.message);
                that.dialogVisible = false;
              }
            });
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
