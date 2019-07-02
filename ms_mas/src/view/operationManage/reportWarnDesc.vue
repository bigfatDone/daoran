<template>
  <div id="productOnLine-warp">
    <v-table @warnEdit="edit($event)" @warnDel="delWarp($event)" @toSetting="toSetting($event)" :table-state="tableState"></v-table>

    <el-dialog
      :title="dialogTitle"
      custom-class="dailog-min-max"
      :visible.sync="dialogVisible">
      <el-form :model="select" status-icon ref="select" :rules="rules" label-width="60px">
        <el-form-item label="维度" prop="reIndicators">
          <el-input type="text" v-model="select.reIndicators"></el-input>
        </el-form-item>
        <el-form-item label="sql" prop="reSql">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入sql"
            v-model="select.reSql">
          </el-input>
        </el-form-item>
        <el-form-item label="判断" prop="reType">
          <v-select :data="selectArr" @select="selectType($event)"></v-select>
        </el-form-item>
        <el-form-item label="阈值" prop="reValue">
          <el-input type="text" v-model="select.reValue"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="reDesc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2}"
            placeholder="请输入描述"
            v-model="select.reDesc">
          </el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save(select.reId)">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择产品"
      custom-class="dailog-min-max"
      :visible.sync="dialogVisibleConfig">
      <el-table
        :data="configDataAll"
        :height="tableHeight"
        ref="cofigTable"
        border
        @select="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          fixed
          type="selection"
          width="35">
        </el-table-column>
        <el-table-column
          prop="node"
          label="项目">
        </el-table-column>
        <el-table-column
          prop="province"
          label="区域">
        </el-table-column>
        <el-table-column
          prop="project"
          label="产品">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleConfig = false">取消</el-button>
        <el-button type="primary" @click="configSave()">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      custom-class="dailog-min-max"
      title="提示"
      :model="select"
      :visible.sync="deleteVisible">
      <div>确定要删除  <strong>{{select.reIndicators}} </strong>   吗？</div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取消</el-button>
            <el-button type="danger" @click="del(select.reId)">删除</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import vTable from './component/reportWarnDesc_table'
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'reportWarnDesc',
    components: {
      vTable,vSelect
    },
    data () {
      return {
        dialogVisible:false,
        dialogVisibleConfig:false,
        deleteVisible:false,
        tableState:false,
        dialogTitle:'',
        select:{
          reId:'',
          reIndicators:'',
          reSql:'',
          reType:'',
          reValue:'',
          reDesc:'',
        },
        selectArr:[
          {code:'more',text:'大于',chosed:false},
          {code:'equals',text:'等于',chosed:false},
          {code:'less',text:'小于',chosed:false},
        ],
        rules:{
          reIndicators:[
            { required: true, message: '请输入维度', trigger: 'blur' },
          ],
          reSql:[
            { required: false, message: '请输入sql', trigger: 'blur' },
          ],
          reType:[
            { required: true, message: '请选择判断', trigger: 'change' },
          ],
          reValue:[
            { required: true, message: '请输入阈值', trigger: 'blur' },
          ],
          reDesc:[
            { required: false, message: '请输入描述', trigger: 'blur' },
          ],
        },
        configDataAll:[],
        configDataSelect:[],
        tableHeight:'250',
        configId:'',
      }
    },
    computed : {
    },
    mounted () {
      this.configDataGet();
    },
    filters:{
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
      edit(obj){
        let that = this;
        that.selectArr.forEach((item,index) => {
          item.chosed = false;
        });
        let newData={
          reId:'',
          reIndicators:'',
          reSql:'',
          reType:'',
          reValue:'',
          reDesc:'',
        };
        if (obj.type === 'add'){
          that.dialogTitle = '添加数据报警';
          that.select=newData;
        }else {
          that.dialogTitle = '编辑数据报警';
          for (let item in newData) {
            newData[item] = obj.data[item];
          }
          that.select=newData;
          that.selectType({code:newData.reType});
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
          url: "/ms_bas/reportWarnDesc/deleteById.do",
          method: "post",
          data: {id:id},
          success: function (res) {
            if (res.data.status === true){
              that.$message.success('删除成功');
              that.tableState = that.tableState===true?false:true;
            }else {
              that.$message.warning('删除失败，请重新尝试');
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
            if (id === ''){
              that.$ajax({
                url: "/ms_bas/reportWarnDesc/save",
                method: "post",
                data: that.select,
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
                url: "/ms_bas/reportWarnDesc/edit",
                method: "post",
                data: that.select,
                success: function (res) {
                  if(res.data.status === true){
                    that.$message.success('修改成功');
                    that.tableState = that.tableState===true?false:true;
                  }else {
                    that.$message.warning('修改失败，请重新尝试');
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
      toSetting(obj){
        let that = this;
        that.dialogVisibleConfig = true;
        if (that.$refs.cofigTable !== undefined){
          that.$refs.cofigTable.clearSelection();
        }
        that.$ajax({
          url: "/ms_bas/reportWarnDesc/check",
          method: "post",
          data: {id:obj.data.reId},
          success: function (res) {
            let select = [];
            that.configId = obj.data.reId;
            res.data.forEach((item,index)=>{
              that.configDataAll.forEach((o,i)=>{
                if (o.id ===item){
                  select.push(o);
                  that.$refs.cofigTable.toggleRowSelection(o,true);
                }
              });
            });
            that.configDataSelect = select;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      configDataGet(){
        let that = this;
        if (document.body.clientWidth>=800){
          that.tableHeight = '450'
        }else {
          that.tableHeight = '250'
        }
        that.$ajax({
          url: "/ms_bas/reportWarnDesc/allProduct?order=asc",
          method: "post",
          data: {},
          success: function (res) {
            that.configDataAll = res.data;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      handleSelectionChange(selection, row){
        let that = this;
        that.configDataSelect = selection;
      },
      configSave(){
        let that = this;
        that.$ajax({
          url: "/ms_bas/reportWarnDesc/choose",
          method: "post",
          data: {id:that.configId,json:JSON.stringify(that.configDataSelect)},
          success: function (res) {
            if (res.data.status === true){
              that.$message.success(res.data.message);
            }else {
              that.$message.warning(res.data.message);
            }
            that.dialogVisibleConfig = false;
          },
          error: function (error) {
            that.$message.error(error);
            that.dialogVisibleConfig = false;
          }
        });
      },
      selectType(val){
        let that = this;
        that.select.reType = val.code;
        that.selectArr.forEach((item,index) => {
          item.chosed = false;
          if(item.code === val.code){
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
