<template>
  <div id="productOnLine-warp">
    <v-table @uploadEdit="edit($event)" @uploadDel="delWarp($event)" :table-state="tableState"></v-table>

    <el-dialog
      :title="dialogTitle"
      custom-class="dailog-min-max"
      :visible.sync="dialogVisible">
      <el-form :model="select" status-icon ref="select" :rules="rules" label-width="120px">

        <el-form-item label="上传时间" prop="uploadTime">
          <el-date-picker
            v-show="datePicker === 'date'"
            v-model="select.uploadTime"
            ref="dateRef"
            :disabled="editState"
            :picker-options="pickerOptions0"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            class="date-class"
            placeholder="上传时间">
          </el-date-picker>
          <el-date-picker
            v-show="datePicker === 'month'"
            v-model="select.uploadTime"
            ref="monthRef"
            :disabled="editState"
            :picker-options="pickerOptions0"
            type="month"
            :editable="false"
            value-format="yyyy-MM-dd"
            class="date-class"
            placeholder="上传时间">
          </el-date-picker>
          <el-button-group>
            <el-button
              type="primary"
              @click="datePickerSelect('month')"
              :disabled="editState">按月</el-button>
            <el-button
              type="primary"
              @click="datePickerSelect('date')"
              :disabled="editState">按日</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item label="项目" prop="sNodeCode">
          <v-select :data="selectArr.node" @select="nodeChange($event)" :placeholder="'请选择项目'" :disable="editState"></v-select>
        </el-form-item>
        <el-form-item label="省份" prop="sProvinceCode">
          <v-select :data="selectArr.province" @select="provinceChange($event)" :placeholder="'请选择省份'" :disable="editState"></v-select>
        </el-form-item>
        <el-form-item label="产品" prop="sProjectCode">
          <v-select :data="selectArr.project" @select="productChange($event)" :placeholder="'请选择产品'" :disable="editState"></v-select>
        </el-form-item>
        <el-form-item label="局方留存" prop="unicomRetainedUsers">
          <el-input type="text" v-model="select.unicomRetainedUsers"></el-input>
        </el-form-item>
        <el-form-item label="局方订购用户数" prop="unicomSuccessOrders">
          <el-input type="text" v-model="select.unicomSuccessOrders"></el-input>
        </el-form-item>
        <el-form-item label="局方退订用户数" prop="unicomOffOrders">
          <el-input type="text" v-model="select.unicomOffOrders"></el-input>
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
      <div>确定要删除  <strong>{{select.sNodeName}}  =>  {{select.sProvinceName | allFilter}}  =>  {{select.sProjectName | allFilter}} </strong>   吗？</div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取消</el-button>
            <el-button type="danger" @click="del(select.id)">删除</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import vTable from './component/uploadData_table'
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'uploadData',
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
        },
        selectArr:{
          node:[],
          province:[],
          project:[],
        },
        select:{
          id:'',
          uploadTime:'',
          sNodeCode:'',
          sProjectCode:'',
          sProvinceCode:'',
          unicomRetainedUsers:'',
          unicomSuccessOrders:'',
          unicomOffOrders:'',
        },
        rules:{
          uploadTime:[
            { required: true, message: '请选择时间', trigger: 'blur' }
          ],
          sNodeCode:[
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
          sProjectCode:[
            { required: true, message: '请选择省份', trigger: 'change' }
          ],
          sProvinceCode:[
            { required: true, message: '请选择产品', trigger: 'change' }
          ],
          unicomRetainedUsers:[
            { required: true, message: '请输入留存数', trigger: 'blur' },
          ],
          unicomSuccessOrders:[
            { required: true, message: '请输入局方订购用户数', trigger: 'blur' },
          ],
          unicomOffOrders:[
            { required: true, message: '请输入局方退订用户数', trigger: 'blur' },
          ],
        },
        dataOfSelect:[],
        datePicker:'date',
        editState:false,

        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
      }
    },
    computed : {
    },
    mounted () {
      this.initTabaleHeight();
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
      initTabaleHeight(){
        let that = this;
        that.$ajax({//获取关联选项
          url: "/ms_bas/problemManage/getAllDimension",
          method: "post",
          data: {},
          success: function (res) {
            let node=[];
            let province=[];
            let project=[];
            let hash_node={};
            let hash_province=[];
            let hash_project=[];
            that.dataOfSelect = res.data.data;
            res.data.data.forEach((item,index)=>{
              if (index===0){
                hash_node['pre'+item.sNodeCode] = true;
                hash_province['pre'+item.sProvinceCode] = true;
                hash_project['pre'+item.sProjectCode] = true;
                node.push({
                  text:item.sNodeName,
                  code:item.sNodeCode,
                  chosed:false
                });
                province.push({
                  text:item.sProvinceName,
                  code:item.sProvinceCode,
                  chosed:false
                });
                project.push({
                  text:item.sProjectName,
                  code:item.sProjectCode,
                  chosed:false
                });
              }else {
                if (!hash_node['pre'+item.sNodeCode]) {
                  hash_node['pre'+item.sNodeCode] = true;
                  node.push({
                    text: item.sNodeName,
                    code: item.sNodeCode,
                    chosed:false
                  });
                }
                if (!hash_province['pre'+item.sProvinceCode]) {
                  hash_province['pre'+item.sProvinceCode] = true;
                  province.push({
                    text: item.sProvinceName,
                    code: item.sProvinceCode,
                    chosed:false
                  });
                }
                if (!hash_project['pre'+item.sProjectCode]) {
                  hash_project['pre'+item.sProjectCode] = true;
                  project.push({
                    text:item.sProjectName,
                    code:item.sProjectCode,
                    chosed:false
                  });
                }
              }
            });
            that.selectArr.node= node;
            that.selectArr.province= province;
            that.selectArr.project= project;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      nodeChange(val){
        let that = this;
        that.select.sNodeCode = val.code;
        that.selectArr.node.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
        let province=[];
        let project=[];
        let hash_province=[];
        let hash_project=[];
        that.dataOfSelect.forEach((item,index)=>{
          if (item.sNodeCode === val.code){
            if (index===0){
              hash_province['pre'+item.sProvinceCode] = true;
              hash_project['pre'+item.sProjectCode] = true;
              province.push({
                text:item.sProvinceName,
                code:item.sProvinceCode,
                chosed:true
              });
              project.push({
                text:item.sProjectName,
                code:item.sProjectCode,
                chosed:true
              });
            }else {
              if (!hash_province['pre'+item.sProvinceCode]) {
                hash_province['pre'+item.sProvinceCode] = true;
                province.push({
                  text: item.sProvinceName,
                  code: item.sProvinceCode,
                  chosed:false
                });
              }
              if (!hash_project['pre'+item.sProjectCode]) {
                hash_project['pre'+item.sProjectCode] = true;
                project.push({
                  text:item.sProjectName,
                  code:item.sProjectCode,
                  chosed:false
                });
              }
            }
          }
        });
        that.selectArr.province= province;
        that.selectArr.project= project;
        that.select.sProvinceCode = province[0].code;
        that.select.sProjectCode = project[0].code;
      },
      provinceChange(val){
        let that = this;
        that.select.sProvinceCode = val.code;
        that.selectArr.province.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
        let project=[];
        let hash_project=[];
        that.dataOfSelect.forEach((item,index)=>{
          if (item.sProvinceCode === val.code){
            if (index===0){
              hash_project['pre'+item.sProjectCode] = true;
              project.push({
                text:item.sProjectName,
                code:item.sProjectCode,
                chosed:false
              });
            }else {
              if (!hash_project['pre'+item.sProjectCode]) {
                hash_project['pre'+item.sProjectCode] = true;
                project.push({
                  text:item.sProjectName,
                  code:item.sProjectCode,
                  chosed:false
                });
              }
            }
          }
        });
        that.selectArr.project= project;
        that.select.sProjectCode = project[0].code;
      },
      productChange(val){
        let that =this;
        that.select.sProjectCode = val.code;
        that.selectArr.project.forEach((item,index)=>{
          item.chosed = false;
          if (item.code === val.code){
            item.chosed = true;
          }
        });
      },
      edit(obj){
        let that = this;
        let newData={
          id:'',
          uploadTime:'',
          sNodeCode:that.selectArr.node[0].code,
          sProjectCode:'',
          sProvinceCode:'',
          unicomRetainedUsers:'',
          unicomSuccessOrders:'',
          unicomOffOrders:'',
        };
        if (obj.type === 'add'){
          that.dialogTitle = '局方数据录入';
          that.select=newData;
          that.nodeChange(that.selectArr.node[0]);
          that.editState = false;
        }else {
          that.dialogTitle = '局方数据编辑';
          for (let item in newData) {
            newData[item] = obj.data[item];
          }
          that.select=newData;
          that.nodeChange({code:obj.data.sNodeCode});
          that.provinceChange({code:obj.data.sProvinceCode});
          that.productChange({code:obj.data.sProjectCode});
          that.editState = true;
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
          url: "/ms_bas/upload_data/deleteById.do",
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
            let obj = that.select;
            let date ='';
            if(that.datePicker === 'date'){
              date = obj.uploadTime;
            }else {
              date = obj.uploadTime.slice(0,obj.uploadTime.length-3);
            }
            if (id === ''){
              let data={
                uploadTime:date,
                sNodeCode:obj.sNodeCode,
                sProvinceCode:obj.sProvinceCode,
                sProjectCode:obj.sProjectCode,
                unicomRetainedUsers:obj.unicomRetainedUsers,
                unicomSuccessOrders:obj.unicomSuccessOrders,
                unicomOffOrders:obj.unicomOffOrders,
              };
              that.$ajax({
                url: "/ms_bas/upload_data/insertdate.do",
                method: "post",
                data: data,
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
              let data={
                id:obj.id,
                uploadTime:date,
                sNodeCode:obj.sNodeCode,
                sProvinceCode:obj.sProvinceCode,
                sProjectCode:obj.sProjectCode,
                unicomRetainedUsers:obj.unicomRetainedUsers,
                unicomSuccessOrders:obj.unicomSuccessOrders,
                unicomOffOrders:obj.unicomOffOrders,
              };
              that.$ajax({
                url: "/ms_bas/upload_data/updateData.do",
                method: "post",
                data: data,
                success: function (res) {
                  if(res.data.status === true){
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
      datePickerSelect(val){
        let that = this;
        that.datePicker = val;
        document.body.click();
        setTimeout(function () {
          if (val ==='date'){
            that.$refs.dateRef.focus();
          }else {
            that.$refs.monthRef.focus();
          }
        },0)

      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .date-class{
    width: 65% !important;
  }
  @media screen and (max-width: 800px) {
    .date-class{
      width: 100% !important;
    }
  }
</style>
