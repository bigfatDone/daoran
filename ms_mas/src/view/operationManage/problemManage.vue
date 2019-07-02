<template>
  <div id="productOnLine-warp">
    <v-table @problemEdit="edit($event)" @problemDel="delWarp($event)" :table-state="tableState"></v-table>

    <el-dialog
      :title="dialogTitle"
      custom-class="dailog-min-max"
      :visible.sync="dialogVisible">
      <el-form :model="select" status-icon ref="select" :rules="rules" label-width="80px">
        <el-form-item label="项目" prop="sNodeCode">
          <v-select :data="selectArr.node" @select="nodeChange($event)" :placeholder="'请选择项目'"></v-select>
        </el-form-item>
        <el-form-item label="省份" prop="sProvinceCode">
          <v-select :data="selectArr.province" @select="provinceChange($event)" :placeholder="'请选择省份'"></v-select>
        </el-form-item>
        <el-form-item label="产品" prop="sProjectCode">
          <v-select :data="selectArr.project" @select="productChange($event)" :placeholder="'请选择产品'"></v-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            v-model="select.startTime"
            :picker-options="pickerOptionsStart"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            v-model="select.endTime"
            :picker-options="pickerOptionsEnd"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2}"
            placeholder="问题描述"
            v-model="select.description">
          </el-input>
        </el-form-item>
        <el-form-item label="问题原因" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2}"
            placeholder="问题原因"
            v-model="select.reason">
          </el-input>
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2}"
            placeholder="处理结果"
            v-model="select.result">
          </el-input>
        </el-form-item>
        <el-form-item label="影响报表" prop="refReport">
          <el-select v-model="select.refReport" multiple placeholder="请选择影响报表"  style="width: 100%;">
            <el-option
              v-for="item in selectTableArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
  import vTable from './component/problemManage_table'
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'problemManage',
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
        selectTableArr:[
          {id:1,name:'营销运营报表'},
          {id:2,name:'常规汇总报表'},
          {id:3,name:'分时段数据'},
          {id:4,name:'入口访问数据'},
          {id:5,name:'活跃率分析'},
          {id:6,name:'退订率分析'},
          {id:7,name:'ubp订购分析'},
          {id:8,name:'页面分析报表'},
          {id:9,name:'运营位分析报表'}],
        selectArr:{
          node:[],
          province:[],
          project:[],
        },
        select:{
          id:'',
          sNodeCode:'',
          sProjectCode:'',
          sProvinceCode:'',
          startTime:'',
          endTime:'',
          reason:'',
          refReport:[],
          result:'',
          description:'',
        },
        rules:{
          sNodeCode:[
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
          sProjectCode:[
            { required: true, message: '请选择省份', trigger: 'change' }
          ],
          sProvinceCode:[
            { required: true, message: '请选择产品', trigger: 'change' }
          ],
          startTime:[
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          endTime:[
            { required: true, message: '请选择结束时间', trigger: 'blur' }
          ],
          description:[
            { required: false, message: '请输入问题描述', trigger: 'blur' }
          ],
          reason:[
            { required: false, message: '请输入问题原因', trigger: 'blur' }
          ],
          result:[
            { required: false, message: '请输入处理结果', trigger: 'blur' }
          ],
          refReport:[
            { type: 'array',required: true, message: '请选择影响报表', trigger: 'change' }
          ],
        },
        dataOfSelect:[],

        pickerOptionsStart: {//限定开始时间为今天之前
          disabledDate: (time) => {
            if (this.select.endTime != "") {
              return time.getTime() > Date.now() || time.getTime() >  new Date(this.select.endTime);
            } else {
              return time.getTime() > Date.now();
            }

          }
        },
        pickerOptionsEnd: {//限定结束时间不能在开始时间之前
          disabledDate: (time) => {
            return time.getTime() < new Date(this.select.startTime).getTime()-3600 * 1000 * 24;
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
            let province=[
              {text:'全部',code:'all',chosed:true}];
            let project=[
              {text:'全部',code:'all',chosed:true}];
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
            that.$message.error('报表问题管理页面数据请求失败，请刷新报表问题管理页面');
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
        let province=[
          {text:'全部',code:'all',chosed:true}];
        let project=[
          {text:'全部',code:'all',chosed:true}];
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
                chosed:false
              });
              project.push({
                text:item.sProjectName,
                code:item.sProjectCode,
                chosed:false
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
        that.select.sProvinceCode = 'all';
        that.select.sProjectCode = 'all';
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
        let project=[
          {text:'全部',code:'all',chosed:true}];
        let hash_project=[];
        that.dataOfSelect.forEach((item,index)=>{
          if (item.sProvinceCode === val.code){
            if (index===0){
              hash_project['pre'+item.sProjectCode] = true;
              project.push({
                text:item.sProjectName,
                code:item.sProjectCode,
                chosed:true
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
        that.select.sProjectCode = 'all';
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
        if (obj.type === 'add'){
          that.dialogTitle = '问题录入';
          that.select={
            id:'',
            sNodeCode:that.selectArr.node[0].code,
            sProjectCode:'',
            sProvinceCode:'',
            startTime:'',
            endTime:'',
            reason:'',
            refReport:[],
            result:'',
            description:'',
          };
          that.nodeChange(that.selectArr.node[0]);
        }else {
          that.dialogTitle = '问题编辑';
          let newData = {
            id:'',
            sNodeCode:'',
            sProjectCode:'',
            sProvinceCode:'',
            startTime:'',
            endTime:'',
            reason:'',
            refReport:[],
            result:'',
            description:'',
          };
          for (let item in newData) {
            if(item === 'refReport'){
              let arr = obj.data[item].split(',');
              arr.forEach((o, i) => {
                newData[item].push(Number(o));
              });
            }else {
              newData[item] = obj.data[item];
            }
          }
          that.nodeChange({code:newData.sNodeCode});
          that.provinceChange({code:newData.sProvinceCode});
          that.productChange({code:newData.sProjectCode});
          that.select=newData;
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
          url: "/ms_bas/problemManage/deletePro",
          method: "post",
          data: {id:id},
          success: function (res) {
            if (res.data.status === true){
              that.$message.success('删除成功');
              that.tableState = !that.tableState;
            }else {
              that.$message.success('删除失败');
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
            let data={
              node:obj.sNodeCode,
              province:obj.sProvinceCode,
              project:obj.sProjectCode,
              startTime:obj.startTime,
              endTime:obj.endTime,
              description:obj.description,
              reason:obj.reason,
              result:obj.result,
              refReport:obj.refReport,
            };
            if (id === ''){
              that.$ajax({
                url: "/ms_bas/problemManage/insertPro",
                method: "post",
                data: {json:JSON.stringify(data),refReport:obj.refReport.join(',')},
                success: function (res) {
                  that.$message.success(res.data.message);
                  that.dialogVisible = false;
                  that.tableState = !that.tableState;
                },
                error: function (error) {
                  that.$message.error(error);
                }
              });
            }else {
              that.$ajax({
                url: "/ms_bas/problemManage/updatePro",
                method: "post",
                data: {json:JSON.stringify(data),refReport:obj.refReport.join(','),id:obj.id},
                success: function (res) {
                  that.$message.success(res.data.message);
                  that.dialogVisible = false;
                  that.tableState = !that.tableState;
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
