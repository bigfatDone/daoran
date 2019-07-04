<template>
  <div>
    <div class="box">
      <vSearch @getData="getData" @clear="clear" ref="profile" :currentPage="currentPage"></vSearch>
    </div>
    <div class="box">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addEditVideo('add','')" title="新增课程">新增课程</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletes()" title="删除课程">删除课程</el-button>
    </div>
    <div class="box">
      <el-table id="tableData" ref="videoTable" :data="tableData" border style="width: 100%" empty-text="暂无数据" @select-all="selectAll" @select="selectSingle" :height="TableHeight" v-loading="tableLoading">
        <el-table-column align="center" type="selection" width="50"></el-table-column>
        <el-table-column label="课程编码" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text" style="text-align: left">
              <p class="urlManager-normal" :title="scope.row.courseCode">{{scope.row.courseCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.courseName">{{scope.row.courseName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程类型" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.mediaType">{{scope.row.mediaType === 'video' ? '视频':'音频'}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格（元）" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.price">{{scope.row.price}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="VIP是否免费" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.vipFree">{{ scope.row.vipFree === 1 ? '是' : '否'}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程简述" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text" style="text-align: left;">
              <p class="urlManager-normal" :title="scope.row.describe">{{scope.row.describe}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="章节数量" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.chapterCount">{{scope.row.chapterCount}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="免费课程" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.free">{{scope.row.free === 1 ? '是' : '否'}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.details">{{scope.row.details}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.lastTime">{{scope.row.lastTime| dateForm}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="addEditVideo('edit',scope.row)" title="修改">修改</el-button>
            <el-button size="mini" @click="labelling(scope.row)" title="贴标签">贴标签</el-button>
            <el-button size="mini" @click="resource(scope.row)" title="资源录入">资源录入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-if="currentPage.paginationShow" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage.page" :page-sizes="[20, 40, 60, 80]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="currentPage.tableDataCount"></el-pagination>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="700px">
      <vAddEdit v-if="dialog.show" :addEditType="addEditType" :addEditData="addEditData" @closeAddEdit="closeAddEdit()"></vAddEdit>
    </el-dialog>
    <el-dialog width="1200px" height="800px" :title="'课程贴标签'" :visible.sync="labels.labelShow">
      <vLabels v-if="labels.labelShow"  :labelData="labels.labelData" @closeLabel="closeLabel"></vLabels>
    </el-dialog>
    <el-dialog width="1400px" :title="'资源录入'" :visible.sync="resources.show">
      <vResource v-if="resources.show"  :resourcesData="resources.resourcesData" @closeResources="closeResources"></vResource>
    </el-dialog>
  </div>
</template>

<script>
  import vSearch from './components/search'
  import vAddEdit from './components/addEdit.vue'
  import vLabels from './components/label.vue'
  import vResource from './components/resource.vue'
export default {
  name: 'course',
  components: {
    vSearch,vAddEdit,vLabels,vResource
  },
  filters: {
    dateForm (dateCamp) {
      let dataDeal = (m) => {
        return m < 10 ? '0' + m : m
      };
      let time = new Date(dateCamp);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return y+'-'+dataDeal(m)+'-'+dataDeal(d)+' '+dataDeal(h)+':'+dataDeal(mm)+':'+dataDeal(s);
    }
  },
  data () {
    return {
      tableData: [],
      TableHeight: 600,
      tableLoading: false,
      vAddEditShow: false,
      addEditType:'',
      addEditData:{},
      dialog: {
        show : false,
        title: '新增课程',
      },
      listChosed: '',
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      currentPage:{
          page:1,
          rows : 20,
          tableDataCount:0,
          paginationShow: true
      },
      labels:{
        labelShow:false,
        labelData:{}
      },
      resources:{
          show:false,
          resourcesData:{}
      }
    }
  },
  methods: {
    addEditVideo(typy,data){
      this.dialog.show = true;
        if (typy === 'add'){
            this.dialog.title = '新增课程';
            this.addEditType = 'add';
            this.addEditData = {}
        } else {
          this.dialog.title = '修改课程';
          this.addEditType = 'edit';
          this.addEditData = data
        }
    },
    deletes(){
      if(this.listChosed !== ''){
        this.$confirm('此操作将永久删除课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /*删除函数*/
          const that = this;
          const parm = {
            courseCodes : that.listChosed,
          };
          const params = {jsonParam: JSON.stringify(parm)};
          that.$ajax({
            url:'/cms/api/course/delCourse.do',
            method: "post",
            data: this.Qs.stringify(params),
            success: function (res) {
              if (res.data.success) {
                that.$message({
                  type: 'success',
                  message: res.data.msg
                });
                that.$refs.profile.onSubmit(null);
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
              }
            },
            error: function (error) {
            }
          });
          /*删除函数*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else {
        this.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        });
      }
    },
    closeAddEdit(){
      this.dialog.show = false;
      this.$refs.profile.onSubmit(null);
    },
    handleSizeChange(val) {
      this.currentPage.rows = val;
      this.$refs.profile.onSubmit(val);
    },
    handleCurrentChange(val) {
      this.currentPage.page = val;
      this.$refs.profile.onSubmit(val);
    },
    getData(data) {
      this.tableLoading = true;
      this.currentPage.tableDataCount = data.obj.total;
        if(data.obj.data.length > 0) {
          this.tableLoading = false;
          this.tableData = data.obj.data;
        } else {
          this.tableLoading = false;
          this.tableData = [];
        }
    },
    selectAll (selection) {
      const that = this;
      that.listChosed = '';
      selection.forEach((item, index) => {
        that.listChosed += item.courseCode + ',';
      });
    },
    selectSingle (val, row) {
      const that = this;
      that.listChosed = '';
      val.forEach((item, index) => {
        that.listChosed += item.courseCode + ',';
      });
    },
    labelling(data){
      this.labels.labelShow = true;
      this.labels.labelData = data;
    },
    closeLabel(){
      this.labels.labelShow = false;
      this.$refs.profile.onSubmit(null);
    },
    closeResources(){
      this.resources.show = false;
      this.$refs.profile.onSubmit(null);
    },
    resource(data){
      this.resources.show = true;
      this.resources.resourcesData = data;
    },
    clear(res){
      this.currentPage.paginationShow = res;
    },

  }
  }
</script>

<style scoped>
  .urlManagerData-text p{  width: 100%;  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;  }
  .box{margin-bottom: 10px;overflow: hidden;}
</style>
