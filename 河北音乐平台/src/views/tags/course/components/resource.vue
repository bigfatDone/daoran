<template>
  <div>
      <div class="infoWrap">
        <div style="width: 600px;height:600px;margin-left: 45px">
          <el-form :inline="true" label-width="70px" height="76px" labelPosition="right" class="demo-form-inline searchWrap" size="mini">
            <el-form-item label-width="75px" label="章节编码">
              <el-input v-model="infoSearch.chapterCode" placeholder="章节编码" style="width:112px" @keyup.enter.native="leftChangFun()"></el-input>
            </el-form-item>
            <el-form-item label-width="75px" label="cp商">
              <el-select v-model="infoSearch.cpid" placeholder="请选择" @change="leftChangFun">
                <el-option v-for="item in cpList" :key="item.cpId" :label="item.fullName" :value="item.cpId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
            <el-form-item label="章节类型:" label-width="75px">
              <el-select v-model="infoSearch.mediaType" placeholder="请选择" @change="leftChangFun">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
              <el-button-group>
                <el-button type="primary" @click="leftSearch(null)">查询</el-button>
                <el-button @click="leftClear">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
          <el-row>
            <el-table id="tableData" ref="videoTable" :data="dataList" border :row-style="{height:'0px'}" style="width: 100%" empty-text="暂无数据" @select-all="selectAllL" @select="selectSingleL" height="500" v-loading="tableLoading">
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" label="章节编码">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.chapterCode">{{scope.row.chapterCode}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="章节标题">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.chapterTitle">{{scope.row.chapterTitle}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="章节类型">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.mediaType">{{scope.row.mediaType === 'audio' ? '音频':'视频'}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="cp商">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.cpid">{{scope.row.cpid}}</p>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-if="infoSearch.paginationShow" background layout="total, prev, pager, next, jumper" :page-size="infoSearch.rows" :total="infoDataCount" :pager-count="5" :current-page.sync="infoSearch.page" @current-change="leftPageChange"></el-pagination>
          </el-row>
        </div>
        <div style="width: 100px;height:600px;position: relative;">
          <div class="moveWrap">
            <button class="addInfo" :disabled="btnFlag" @click="addInfo()">右移<i class="fa fa-angle-double-right fa-lg"></i></button>
            <button class="removeInfo" :disabled="btnFlag" @click="removeInfo()"><i class="fa fa-angle-double-left fa-lg"></i>左移</button>
          </div>
        </div>
        <div style="width: 600px;height:600px;">
          <el-form :inline="true" label-width="70px" labelPosition="right" class="demo-form-inline" size="mini">
            <el-form-item label-width="82px" label="章节编码">
              <el-input v-model="alInfoSearch.chapterCode" style="width:100px" placeholder="章节编码"></el-input>
            </el-form-item>
            <el-form-item label-width="82px" label="cp商">
              <el-select v-model="alInfoSearch.cpid" placeholder="请选择" @change="rightSearch">
                <el-option v-for="item in cpList" :key="item.cpId" :label="item.fullName" :value="item.cpId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="章节类型:" label-width="75px">
              <el-select v-model="alInfoSearch.mediaType" placeholder="请选择" @change="rightSearch">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="rightSearch()">查询</el-button>
                <el-button @click="rightClear">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
          <el-row>
            <el-table id="tableData2" ref="videoTable" :data="selectData" border size = "small" style="width: 100%" empty-text="暂无数据" height="550px" @select-all="selectAllR" @select="selectSingleR" :row-style="rowStyle" v-loading="tableLoading2">
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" prop="resCode" label="资源编码">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.chapterCode">{{scope.row.chapterCode}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="resCode" label="章节标题">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.chapterTitle">{{scope.row.chapterTitle}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="resCode" label="章节类型">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.mediaType">{{scope.row.mediaType === 'audio' ? '音频':'视频'}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="resCode" label="cp商">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.cpid">{{scope.row.cpid}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-if="selectData.length !== 1" align="center" min-width="120px" label="操作">
                <template slot-scope="scope">
                  <div class="doWrap">
                    <div v-if="scope.$index !== 0"  @click="toTop(scope.$index)" >置顶</div>
                    <div v-if="scope.$index !== 0" @click="moveUp(scope.$index)" >上移</div>
                    <div v-if="scope.$index !== (selectData.length - 1)" @click="moveDown(scope.$index)" >下移</div>
                    <div v-if="scope.$index !== (selectData.length - 1)" @click="toBottom(scope.$index)" >置底</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div class="infoBtn">
          <button class="botBut" @click="ok">完成</button>
        </div>
      </div>

  </div>
</template>

<script>
export default {
  name: 'resource',
  props: ['resourcesData'],
  mounted () {
    this.rightSearch();
    this.leftSearch(null);
    this.getCP();
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      infoSearch:{
        chapterCode:'',
        cpid:'',
        mediaType:'',
        page: 1,
        rows: 20,
        paginationShow: true
      },
      options: [{
        value: '',
        label: '请选择'
      }, {
        value: 'audio',
        label: '音频'
      }, {
        value: 'video',
        label: '视频'
      }],
      dataList:[],
      tableLoading:false,
      infoDataCount:0,
      btnFlag:false,
      alInfoSearch:{
        chapterCode:'',
        mediaType:'',
        cpid:'',
      },
      tableLoading2:false,
      selectData:[],
      chapterCodes:'',
      defaultData:[],
      cpList:[],
      flag:1,
      isFirst:true
    }
  },
  methods: {
    leftSearch(val){
      const that = this;
      if(val === null){
        that.infoSearch.paginationShow = false;
        that.infoSearch.page = 1;
      }
      const parm = {
        courseCode : that.resourcesData.courseCode,
        chapterCode : that.infoSearch.chapterCode,
        cpid : that.infoSearch.cpid,
        mediaType : that.infoSearch.mediaType,
        page : that.infoSearch.page,
        rows : that.infoSearch.rows,
        selectedChapterCodes: that.chapterCodes,
        flag:this.flag
      };
      const params = {jsonParam: JSON.stringify(parm)};
      this.tableLoading = true;
      that.$ajax({
        url:"/cms/api/chapter/getChapTerListNotInCourse.do",
        method: "post",
        data: that.Qs.stringify(params),
        success: function (res) {
          if(res.data.success){
            that.btnFlag = false;
            that.tableLoading = false;
            that.dataList = res.data.obj.data;
            that.infoDataCount = res.data.obj.total;
            that.infoSearch.paginationShow = true;
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    leftClear(){
      this.infoSearch = {
        chapterCode:'',
        cpid:'',
        mediaType:'',
        page: 1,
        rows: 20,
        paginationShow:false
      };
      this.leftSearch(null);
    },
    leftChangFun(){
      this.infoSearch.paginationShow = false;
      this.infoSearch.page = 1;
      this.leftSearch(null);
    },
    selectAllL (selection) {
      let that = this;
      if (selection.length > 0) {
        selection.forEach( k => {
          that.dataList.forEach( i => {
            if (k.chapterCode === i.chapterCode) {
              i.checkState = true;
            }
          });
        });
      } else {
        that.dataList.forEach( i => {
          i.checkState = false;
        });
      }
    },
    selectSingleL (val, row) {
      let that = this;
      that.dataList.forEach( i => i.checkState = false);
      val.forEach( k => {
        that.dataList.forEach( i => {
          if (k.chapterCode === i.chapterCode) {
            i.checkState = true;
          }
        });
      });
    },
    leftPageChange(page){
        this.infoSearch.page = page;
        this.leftSearch(page);
    },
    addInfo(){
      const that = this;
      this.btnFlag = true;
      this.chapterCodes = '';
      that.defaultData = [];
      this.dataList.forEach((i) => {
        if (i.checkState) {
          that.chapterCodes += i.chapterCode + ',';
          that.defaultData.unshift(i);
        }
      });
      let selectDataChapterCodes = '';
      this.selectData.forEach((i) => {
        selectDataChapterCodes += i.chapterCode + ','
      });
      that.chapterCodes = that.chapterCodes + selectDataChapterCodes;
      that.selectData =  that.defaultData.concat(that.selectData);
      this.leftSearch(null);
    },
    removeInfo(){
      this.flag = 2;
      const that = this;
      this.btnFlag = true;
      this.chapterCodes = '';
      let newSelectData = [];
      this.selectData.forEach((i,index) => {
        if (!i.checkState) {
          that.chapterCodes += i.chapterCode + ',';
          newSelectData.push(i);
        }
      });
      this.selectData = newSelectData;
      this.leftSearch(null);
    },
    rightClear(){
      this.alInfoSearch ={
        chapterCode:'',
        mediaType:'',
        cpid:'',
      };
      this.rightSearch();
    },
    rowStyle({ row, rowIndex}) {
      return 'height:10px'
    },
    selectAllR (selection) {
      const that = this;
      if (selection.length > 0) {
        selection.forEach( k => {
          that.selectData.forEach( i => {
            if (k.chapterCode === i.chapterCode) {
              i.checkState = true;
            }
          });
        });
      } else {
        that.selectData.forEach( i => {
          i.checkState = false;
        });
      }
    },
    selectSingleR (val, row) {
      let that = this;
      that.selectData.forEach( i => i.checkState = false);
      val.forEach( k => {
        that.selectData.forEach( i => {
          if (k.chapterCode === i.chapterCode) {
            i.checkState = true;
          }
        });
      });
    },
    rightSearch(){
      const that = this;
      const parm = {
        courseCode : that.resourcesData.courseCode,
        chapterCode : that.alInfoSearch.chapterCode,
        cpid : that.alInfoSearch.cpid,
        mediaType : that.alInfoSearch.mediaType,
        selectedChapterCodes: that.chapterCodes
      };
      const params = {jsonParam: JSON.stringify(parm)};
      this.tableLoading2 = true;
      that.$ajax({
        url:"/cms/api/chapter/getChapTerListInCourse.do",
        method: "post",
        data: that.Qs.stringify(params),
        success: function (res) {
          if(res.data.success){
            that.tableLoading2 = false;
            that.selectData = res.data.obj.data;
            if(that.isFirst){
                that.isFirst = false;
                that.selectData.forEach(item => {
                  that.chapterCodes += item.chapterCode + ',';
                });
            }
          } else {
            that.$message.error(res.data.msg);
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    ok(){
       /* 修改*/
      this.flag = 2;
      const that = this;
      that.chapterCodes = '';
      that.isFirst = false;
      that.selectData.forEach(item => {
        that.chapterCodes += item.chapterCode + ',';
      });
      const param = {courseCode: this.resourcesData.courseCode, chapterCodes: that.chapterCodes};
      const parmas = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: '/cms/api/course/saveCourseChapter.do',
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.data.success) {
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.$emit('closeResources');
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getCP(){
      const that = this;
      that.$ajax({
        url: '/cms/api/cp/getListCp.do',
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.cpId = Number(item.cpId);
          });
          that.cpList = res.data.data;
          that.cpList.unshift({
            cpId: '',
            fullName: '请选择'
          })
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    toTop(index) {
      this.changePosition(this.selectData, index, 0);
    },
    toBottom(index) {
      this.changePosition(this.selectData, index, this.selectData.length - 1);
    },
    moveUp(index) {
      this.changePosition(this.selectData, index, index - 1);
    },
    moveDown(index) {
      this.changePosition(this.selectData, index, index + 1);
    },
    changePosition(arr, index, tindex) {
      if (index > tindex) {
        arr.splice(tindex, 0, arr[index]);
        arr.splice(index + 1, 1);
      } else {
        arr.splice(tindex + 1, 0, arr[index]);
        arr.splice(index, 1);
      }
    },

  }
}
</script>

<style scoped>
  .infoWrap{  position: relative;  display: -webkit-box;  display: -ms-flexbox;  display: flex;  -ms-flex-wrap: wrap;  flex-wrap: wrap;  margin: -22px -15px 58px -15px;  }
  .removeInfo{  position: absolute;  top: 300px;  left: 6px;  border-radius: 10px 0 0 10px;  border: none;  width: 60px;  height: 25px;  cursor:pointer;  }
  .addInfo{  position:absolute;  top: 230px;  right: 6px;  border-radius: 0 10px 10px 0;  border: none;  width: 60px;  height: 25px;  cursor:pointer;  }
  .moveWrap{  display: -webkit-box;  display: -ms-flexbox;  display: flex;  -webkit-box-orient: vertical;  -webkit-box-direction: normal;  -ms-flex-direction: column;  flex-direction: column;  pointer-events: auto;  background-clip: padding-box;  border: 1px solid #f8f8f8;  outline: 0;  position:relative;  }
  .searchWrap {  height: 96px;  }
  .infoBtn{  position: absolute;  bottom: -58px;  left: 135px;  }
  .botBut{  position: relative;  left: 1150px;  top: 20px;  width: 60px;  height: 25px;  background: #409EFF;  border: none;  color: white;  border-radius: 5%;cursor: pointer; }
  .el-table--mini, .el-table--small, .el-table__expand-icon{font-size: 13px;}
  .doWrap {  display: flex;  }
  .doWrap div {  border: 1px solid gray;  width: 38px;  height: 24px;  margin-right: 2px;  border-radius: 3px;  cursor: pointer;  }
</style>
