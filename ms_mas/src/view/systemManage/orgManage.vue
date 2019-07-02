<template>
  <div class="gather">
    <v-table @edit="edit($event)" @del="del($event)" @view="view($event)" :refresh="newMenuStatr"></v-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      custom-class="menu-warp">
      <el-form :model="orgForm" status-icon ref="orgForm" :rules="rules" label-width="120px">
        <el-form-item label="组织机构名称" prop="text">
            <el-input type="text" v-model="orgForm.text"></el-input>
        </el-form-item>
        <el-form-item label="组织机构描述" prop="src">
          <el-input type="textarea"
                    v-model="orgForm.src"
                    :autosize="{ minRows: 1, maxRows: 1}"></el-input>
        </el-form-item>
        <el-form-item label="上级组织机构" prop="parentId">
          <el-select v-model="orgForm.parentId" placeholder="请选择上级组织机构" style="width: 100%;">
            <el-option v-for="item in parentOrg"
                       :key="item.id"
                       :label="item.text"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类型" prop="orgType">
          <el-select v-model="orgForm.orgType" placeholder="请选择机构类型" style="width: 100%;">
            <el-option v-for="item in parentOrg"
                       :key="item.id"
                       :label="item.text"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input type="text" v-model="orgForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input type="text" v-model="orgForm.fax"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="text" v-model="orgForm.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenu()">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="30%"
      title="提示"
      :model="orgForm"
      :visible.sync="deleteVisible">
      <div>确定要删除菜单  <strong>{{orgForm.text}}</strong>   吗？</div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取消</el-button>
            <el-button type="danger" @click="deleteDo(orgForm.id)">删除</el-button>
          </span>
    </el-dialog>

  </div>
</template>

<script>
  import VTable from './component/orgManage_table'
  export default {
    name: 'menuManage',
    components: {
      VTable,
    },
    data () {
      let checkURL = (rule, value, callback) => {
        if (this.menuForm.functionLevel === '1') {
          if (value===''){
            return callback(new Error('请输入地址'));
          }
        }
      };
      return {
        loading:true,
        dialogVisible:false,
        deleteVisible:false,
        dialogTitle:'新增菜单',
        manageType: false,
        parentOrg:{},
        newMenuStatr:false,
        orgForm:{
          id:'',
          text:'',
          src:'',
          parentId:'',
          orgType:'',
          mobile:'',
          fax:'',
          address:'',
        },
        rules:{
          text:[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          src:[
            { required: false, message: '请填写描述', trigger: 'blur' }
          ],
          parentId:[
            { required: false, message: '请填写描述', trigger: 'change' }
          ],
          orgType:[
            { required: false, message: '请填写描述', trigger: 'change' }
          ],
          mobile:[
            { required: false, message: '请输入电话', trigger: 'blur' },
          ],
          address:[
            { required: false, message: '请输入传真', trigger: 'blur' },
          ],
          fax:[
            { required: false, message: '请输入传真', trigger: 'blur' },
          ],
        }
      }
    },
    computed : {
    },
    watch:{
      newMenuStatr(){
        this.parentOrgGet();
      }
    },
    mounted () {
      this.parentOrgGet();
    },
    methods: {
      edit(obj){
        let that =this;
        that.dialogVisible=true;
        if (that.$refs['orgForm'] !== undefined){
          that.$refs['orgForm'].clearValidate();
        }
        if (obj.type === 'add'){
          that.dialogTitle = '新增组织机构';
          that.manageType = false;
          that.parentState = false;
          that.orgForm={
            id:'',
            text:'',
            src:'',
            parentId:'',
            orgType:'',
            mobile:'',
            fax:'',
            address:'',
          };
        }else {
          that.dialogTitle = '编辑组织机构';
          that.manageType = true;
          that.orgForm=obj.data;
        }
      },
      menuLevelChange(){
        let that = this;
        if(that.menuForm.functionLevel === '1'){
          that.parentState = true;
        }else {
          that.parentState = false;
        }
      },
      parentOrgGet(id){
        let that = this;
        that.$ajax({//获取菜单列表
          url: "/ms_bas/depart/setPFunction",
          method: "post",
          data: {selfId:id},
          success: function (res) {
            console.log(res)
            that.parentOrg = res.data;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      },
      saveMenu(){//保存
        let that = this;
        if (that.menuForm.functionName === ''){
          return that.$message.error('请输入名称');
        }
        if (that.menuForm.functionLevel === '1' && that.menuForm.TSFunction === ''){
          return that.$message.error('请选择父菜单');
        }
        if (that.menuForm.functionOrder === ''){
          return that.$message.error('请输入顺序');
        }
        let data= {
          id: that.menuForm.id,
          functionName: that.menuForm.functionName,
          functionType: that.menuForm.functionType,
          functionLevel: that.menuForm.functionLevel,
          functionUrl: that.menuForm.functionUrl,
          functionOrder: that.menuForm.functionOrder,
          'TSFunction.id': that.menuForm.TSFunction,
          'tsIcon.id': '8a8ab0b246dc81120146dc8180460000',
        };
        that.$ajax({
          url: "/ms_bas/function/save",
          method: "post",
          data: data,
          success: function (res) {
            if (res.data.success === true){
              that.$message.success(res.data.msg);
            }else {
              that.$message.warning(res.data.msg);
            }
            that.newMenuStatr =that.newMenuStatr===true?false:true;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
        that.dialogVisible = false;
      },
      del(obj){//呼出删除页面
        let that = this;
        that.orgForm.id = obj.data.id;
        that.orgForm.text = obj.data.text;
        that.deleteVisible = true;
      },
      deleteDo(id){//删除
        let that = this;
        that.$ajax({
          url: "/ms_bas/function/del",
          method: "post",
          data: {id:id},
          success: function (res) {
            if (res.data.success === true){
              that.$message.success(res.data.msg);
            }else {
              that.$message.warning(res.data.msg);
            }
            that.newMenuStatr =that.newMenuStatr===true?false:true;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
        that.deleteVisible=false;
      },
      view(data){
        console.log(data);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .menu-warp{
    max-width: 500px !important;
  }
  @media screen and (max-width: 800px) {
  }
</style>
<style>
  .menu-warp{
    max-width: 500px !important;
  }
</style>
