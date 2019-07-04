<template>
  <div>
    <div class="box">
      <vChapterSearch @getData="getData" @clear="clear"  ref="profile" :currentPage="currentPage"></vChapterSearch>
    </div>
    <div class="box">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addEditVideo('add','')" title="新增章节">新增章节</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletes()" title="删除章节">删除章节</el-button>
    </div>
    <div class="box">
      <el-table id="tableData" ref="videoTable" :data="tableData" border style="width: 100%" empty-text="暂无数据" @select-all="selectAll" @select="selectSingle" :height="TableHeight" v-loading="tableLoading">
        <el-table-column align="center" type="selection" width="50"></el-table-column>
        <el-table-column label="章节编码" align="center" min-width="130px">
          <template slot-scope="scope">
            <div class="paintData">
              <div class="paintData-img">
                <img :src="imgApi + scope.row.image">
              </div>
              <div class="paintData-text">
                <p class="paint-code" :title="scope.row.chapterCode">章节编码：{{scope.row.chapterCode}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="章节标题" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.chapterTitle">{{scope.row.chapterTitle}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="cp商" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.cpName">{{scope.row.cpName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程类型" align="center" width="100px">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.mediaType">{{scope.row.mediaType === 'audio' ? '音频':'视频'}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文稿" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.details">{{scope.row.details}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" align="center">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.lastTimeStr">{{scope.row.lastTimeStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="addEditVideo('edit',scope.row)" title="修改">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination v-if="currentPage.paginationShow" @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page.sync="currentPage.page" :page-sizes="[20, 40, 60, 80]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="currentPage.tableDataCount"></el-pagination>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="700px">
      <vChapterAddEdit v-if="dialog.show" :addEditType="addEditType" :addEditData="addEditData" @closeAddEdit="closeAddEdit()"></vChapterAddEdit>
    </el-dialog>
  </div>
</template>

<script>
  import vChapterSearch from './components/search'
  import vChapterAddEdit from './components/addEdit.vue'

export default {
  name: 'chapter',
  components: {
    vChapterSearch,vChapterAddEdit
  },
  data () {
    return {
      currentPage:{
        page:1,
        rows : 20,
        tableDataCount:0,
        paginationShow:true
      },
      tableLoading:false,
      tableData:[],
      TableHeight: 600,
      imgApi:this.$root.staticData.imgApi,
      dialog: {
        show : false,
        title: '新增章节',
      },
      addEditType:'',
      addEditData:{},
      listChosed:'',
      axios: this.$root.axios,
      Qs: this.$root.Qs,
    }
  },
  activated () {
  },
  methods:{
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
    clear(res){
      this.currentPage.paginationShow = res;
    },
    handleSizeChange(val) {
      this.currentPage.rows = val;
      this.$refs.profile.onSubmit(val);
    },
    handleCurrentChange(val) {
      this.currentPage.page = val;
      this.$refs.profile.onSubmit(val);
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
    addEditVideo(typy,data){
      this.dialog.show = true;
      if (typy === 'add'){
        this.dialog.title = '新增章节';
        this.addEditType = 'add';
        this.addEditData = {}
      } else {
        this.dialog.title = '修改章节';
        this.addEditType = 'edit';
        this.addEditData = data
      }
    },
    closeAddEdit(){
      this.dialog.show = false;
      this.$refs.profile.onSubmit(null);
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
            chapterCodes : that.listChosed,
          };
          const params = {jsonParam: JSON.stringify(parm)};
          that.$ajax({
            url:'/cms/api/chapter/delChapter.do',
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
      } else {
        this.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        })
      }

    },
    selectAll (selection) {
      const that = this;
      that.listChosed = '';
      selection.forEach((item, index) => {
        that.listChosed += item.chapterCode + ',';
      });
    },
    selectSingle (val, row) {
      const that = this;
      that.listChosed = '';
      val.forEach((item, index) => {
        that.listChosed += item.chapterCode + ',';
      });
    },
  }
}
</script>

<style scoped>
  .box{margin-bottom: 10px;overflow: hidden;}
  .paintData-img {  position: relative;  min-width: 99px;  min-height: 66px;  max-width: 99px;  max-height: 66px;  overflow: hidden;  background: #eee;  }
  .paintData-img img {  position: absolute;  left: 0;  top: 0;  bottom: 0;  right: 0;  width: 100%;  height: 100%;  border: none;  }
  .paintData-text {  position: absolute;  right: 0;  top: 0;  bottom: 0;  left: 110px;  height: 70px;  }
  .paintData-text p{  width: 100%;  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;  }
</style>
