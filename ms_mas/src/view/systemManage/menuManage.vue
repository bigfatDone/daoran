<template>
  <div class="gather">
    <v-table @menuEdit="menuEdit($event)" @del="delMenu($event)" @pageAccess="pageAccess($event)" :refresh="newMenuStatr"></v-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      custom-class="dailog-min-max">
      <el-form :model="menuForm" status-icon ref="menuForm" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="functionName">
            <el-input type="text" v-model="menuForm.functionName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="functionType">
          <el-select v-model="menuForm.functionType" placeholder="请选择菜单类型" style="width: 100%;">
            <el-option label="菜单类型" value="0"></el-option>
            <el-option label="访问类型" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单等级" prop="functionLevel">
          <el-select v-model="menuForm.functionLevel" placeholder="请选择菜单等级" style="width: 100%;" @change="menuLevelChange()">
            <el-option label="一级菜单" value="0"></el-option>
            <el-option label="下级菜单" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单" prop="TSFunction" v-show="parentState">
          <el-select v-model="menuForm.TSFunction" placeholder="请选择父菜单" style="width: 100%;">
            <el-option v-for="item in parentMenu"
                       :key="item.id"
                       :label="item.text"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" prop="functionUrl">
          <el-input type="text" v-model="menuForm.functionUrl"></el-input>
        </el-form-item>
        <el-form-item label="菜单顺序" prop="functionOrder">
          <el-input type="text" v-model="menuForm.functionOrder"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenu()">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      custom-class="dailog-min-max"
      title="提示"
      :model="menuForm"
      :visible.sync="deleteVisible">
      <div>确定要删除菜单  <strong>{{menuForm.functionName}}</strong>   吗？</div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取消</el-button>
            <el-button type="danger" @click="deleteMenu(menuForm.id)">删除</el-button>
          </span>
    </el-dialog>

  </div>
</template>

<script>
  import VTable from './component/menuManage_table'
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
        parentState:false,
        parentMenu:{},
        newMenuStatr:false,
        menuForm:{
          id:'',
          functionName:'',
          functionType:'0',
          functionLevel:'0',
          functionUrl:'',
          functionOrder:'',
          TSFunction:'',
        },
        rules:{
          functionName:[
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          functionType:[
            { required: true, message: '请选择菜单类型', trigger: 'change' }
          ],
          functionLevel:[
            { required: true, message: '请选择菜单等级', trigger: 'change' }
          ],
          functionUrl:[
            { validator: checkURL, trigger: 'blur'},
          ],
          functionOrder:[
            { required: true, message: '请输入菜单顺序', trigger: 'blur' },
            { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
          ],
          TSFunction:[
            { required: true, message: '请选择父菜单', trigger: 'change' }
          ],
        }
      }
    },
    computed : {
    },
    watch:{
      newMenuStatr(){
        this.parentMenuGet();
      }
    },
    mounted () {
      this.parentMenuGet();
    },
    methods: {
      menuEdit(obj){
        let that =this;
        that.dialogVisible=true;
        if (that.$refs['menuForm'] !== undefined){
          that.$refs['menuForm'].clearValidate();
        }
        if (obj.type === 'add'){
          that.dialogTitle = '新增菜单';
          that.manageType = false;
          that.parentState = false;
          that.menuForm={
            id:'',
            functionName:'',
            functionType:'0',
            functionLevel:'0',
            functionUrl:'',
            functionOrder:'',
            TSFunction:'',
          };
        }else {
          that.dialogTitle = '编辑菜单';
          that.manageType = true;
          if(obj.data.functionLevel === '1'){
            that.parentState = true;
          }else {
            that.parentState = false;
          }
          that.menuForm={
            id:obj.data.id,
            functionName:obj.data.text,
            functionType:obj.data.functionType,
            functionLevel:obj.data.functionLevel,
            functionUrl:obj.data.src,
            functionOrder:obj.data.order,
            TSFunction:obj.data.parentId,
          };
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
      parentMenuGet(){
        let that = this;
        that.$ajax({//获取菜单列表
          url: "/ms_bas/function/functiongrid?field=id,functionName,TSIcon_iconPath,functionType,functionUrl,functionOrder",
          method: "post",
          data: {},
          success: function (res) {
            that.parentMenu = res.data;
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
              that.$store.commit('changeMenuState',true);
              that.$message.success(res.data.msg);
            }else {
              that.$message.warning(res.data.msg);
            }
            that.newMenuStatr =!that.newMenuStatr;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
        that.dialogVisible = false;
      },
      delMenu(obj){//呼出删除页面
        let that = this;
        that.menuForm.id = obj.data.id;
        that.menuForm.functionName = obj.data.text;
        that.deleteVisible = true;
      },
      deleteMenu(id){//删除
        let that = this;
        that.$ajax({
          url: "/ms_bas/function/del",
          method: "post",
          data: {id:id},
          success: function (res) {
            if (res.data.success === true){
              that.$store.commit('changeMenuState',true);
              that.$message.success(res.data.msg);
            }else {
              that.$message.warning(res.data.msg);
            }
            that.newMenuStatr =!that.newMenuStatr;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
        that.deleteVisible=false;
      },
      pageAccess(id){
        console.log('权限控件');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media screen and (max-width: 800px) {
  }
</style>
