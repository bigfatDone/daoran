<template>
  <div>
    <div class="shuttleWrap">
      <div style="position: absolute;position: absolute;top: -42px;left: 123px;font-size: 16px;color: #967d56;">
        <span>{{labelData.courseName+"/"+labelData.courseCode}}</span>
      </div>
      <div style="width: 480px;height:600px;margin-left: 15px">
        <div style="display: inline-block;float: left;position: relative;top: -5px">
          <span>资源已有标签：</span>
        </div>
        <el-row>
          <el-table id="tableData" ref="videoTable" :data="resTagData" border style="width: 100%;height: 546px;overflow: auto;position: relative;" empty-text="暂无数据">
            <el-table-column label="标签分类" width="120">
              <template slot-scope="scope">
                <div class="urlManagerData-text">
                  <p class="urlManager-name" :title="scope.row.name">{{scope.row.name}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标签描述">
              <template slot-scope="scope">
                <div v-for = "(item, index) in scope.row.tagList" :class="{'tAct':item.checkState}" style="float: left" class="secbox">
                  <span  @click="getRes(item,index)">{{item.tagName}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <div style="width: 100px;height:600px;position: relative;">
        <div class="moveWrap">
          <button class="addSelect" @click="addSelect"><i class="fa fa-angle-double-left fa-lg"></i>增加</button>
          <button class="removeSelect" @click="removeSelect()">删除<i class="fa fa-angle-double-right fa-lg"></i></button>
        </div>
      </div>
      <div style="width: 580px;height:600px;">
        <div>
          <div style="height: 163px" class="search">
            <div style="height: 70px">
              <div style="text-align: left;margin-left: 15px;">请选择分类：</div>
              <div style="height: 50px;" class="tagType">
                <div v-for="(item, index) in tagTypeData" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                  <span  @click="getSearch(item,index)">{{item.name}}</span>
                </div>
              </div>
            </div>
            <div style="clear: both"></div>
            <div style="height: 20px;text-align: left">
              <div style="margin: 15px">请输入标签：<input style="height: 26px;" type="text" v-model="shuttleAllReq.searchTagName" @keyup.enter="getSearch(null,'')"></div>
            </div>
          </div>
          <div style="margin-top: 85px;">
            <div style="text-align: left; margin-left: 15px">标签：</div>
            <div style="overflow: auto;height: 350px;position:relative">
              <div v-for="(item,index) in resTagAll" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                <span style=";" @click="getAllTagId(item,index)">{{item.tagName}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div><button class="tagBut" @click="closeWindow">完成</button></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'labels',
  props: ['labelData'],
  mounted () {
    this.init();
  },
  activated(){
    this.init();
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      resTagData: [],
      tagTypeData: [],
      shuttleAllReq: {
        courseCode: this.labelData.courseCode,	//是	String	资源编码
        searchTagName: '',	//否	String	标签名称（查询条件）
        searchTypeId: 0,	//否	String	类型ID（查询条件）
      },
      searchTypeId: 0,
      resTagAll: [],
      resAllIds: [],
      tagFirst: true,
      resIds: []
    }
  },
  methods: {
    init() {
      this.leftFun();
      this.getTagName();
      this.getAllTag();
    },
    leftFun(){
      const that = this;
      const parma = {courseCode: this.labelData.courseCode,};
      const parmas = {jsonParam: JSON.stringify(parma)};
      that.$ajax({
        url: '/cms/api/tag/getCourseTagList.do',
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagData = res.data.data;
          that.resTagData.forEach( i => {
            i.tagList.forEach(j => {
              that.$set(j, "checkState", false);
            })
          });
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getTagName () {
      const that = this;
      that.$ajax({
        url: "/cms/api/tagType/select.do",
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.id = Number(item.id);
          });
          that.tagTypeData = res.data.data;
          that.tagTypeData.unshift({
            id: 0,
            name: "全部"
          });
          that.tagTypeData.forEach(i => {
            that.$set(i, "checkState", false)
          });
          that.tagTypeData[0].checkState = true;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getSearch(data, index){
      const that = this;
      if (data !== null){
        data.checkState = !data.checkState;
        that.tagTypeData.forEach(i => {
          if (that.tagTypeData.indexOf(i) === index ){
            i.checkState = true;
            that.searchTypeId = i.id;
          } else {
            i.checkState = false;
          }
        })
      } else {
        that.tagTypeData.forEach(i => {
          i.checkState = false;
        });
        that.searchTypeId = 0;
        that.tagTypeData[0].checkState = true;
      }
      this.getAllTag();
    },
    getAllTagId(data,index) {
      data.checkState = !data.checkState;
      this.resTagAll.forEach(i => {
        if (i.tagId == data.tagId) {
          if (data.checkState) {
            this.resAllIds.push(data.tagId)
          } else {
            this.resAllIds.splice(this.resAllIds.findIndex(v => v.tagId === data.tagId), 1);
          }
        }
      })
    },
    getAllTag () { // 右边
      const that = this;
      this.shuttleAllReq.courseCode = this.labelData.courseCode;
      this.shuttleAllReq.searchTypeId = this.searchTypeId;
      const parma = that.shuttleAllReq;
      const parmas = {jsonParam: JSON.stringify(parma)};
      that.$ajax({
        url: '/cms/api/tag/getAllTagListForCourse.do',
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagAll = res.data.data;
          that.resTagAll.forEach( i=> {
            that.$set(i, "checkState", false);
          });
          that.tagFirst = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    closeShutt(){},
    addSelect(){
      const that = this;
      let params;
      const param = {
        courseCode: this.labelData.courseCode,
        tagIds: this.resAllIds.toString(),
      };
      params = {jsonParam: JSON.stringify(param)};
      this.$ajax({
        url: '/cms/api/tag/bindForCourse.do',
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: res.data.msg
              });
              that.leftFun();
              that.getAllTag();
              that.clearSelect();
            }, 500);
          } else {
            that.$notify({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    clearSelect(){
      this.resIds=[];
      this.resAllIds=[];
      if (this.tagFirst) {
        this.shuttleAllReq.searchTypeId = 0;
        this.searchTypeId = 0;
      }
      this.resTagData.forEach(i => {
        i.tagList.forEach(j => {
          j.checkState = false;
        })
      });
      this.resTagAll.forEach(i => {
        i.checkState = false;
      });
    },
    removeSelect(){
      const that = this;
      let params;
      const param = {
        courseCode: this.labelData.courseCode,
        tagIds: that.resIds.toString(),
      };
      params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: '/cms/api/tag/unbindForCourse.do',
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: res.data.msg
              });
              that.leftFun();
              that.getAllTag();
              that.clearSelect();
            }, 500);
          }else {
            that.$notify({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getRes(data,index) {
      data.checkState = !data.checkState;
      this.resTagData.forEach(i => {
        i.tagList.forEach(j => {
          if (j.tagId == data.tagId) {
            if (data.checkState) {
              this.resIds.push(data.tagId)
            } else {
              this.resIds.splice(this.resIds.findIndex(v => v.tagId === data.tagId), 1);
            }
          }
        })
      })
    },
    closeWindow(){
      this.$emit('closeLabel');
    }
  }
  }
</script>

<style scoped>
  .shuttleWrap{ position: relative;  display: -webkit-box;  display: -ms-flexbox;  display: flex;  -ms-flex-wrap: wrap;  flex-wrap: wrap;  margin: -22px -15px 18px -15px;  }
  .addSelect{  position: absolute;  top: 230px;  left: 18px;  border-radius: 10px 0 0 10px;  border: none;  width: 60px;  height: 25px;  cursor:pointer;  }
  .removeSelect{  position:absolute;  top:300px;  right: 2px;  border-radius: 0 10px 10px 0;  border: none;  width: 60px;  height: 25px;  cursor:pointer;  }
  .secbox{  display: inline-block;  min-width: 40px;  height: 26px;  margin: 5px 10px;  border: 1px solid darkgray;  border-radius: 5px;  line-height: 12px;  cursor: pointer;  padding: 6px;  }
  .tAct{  background: #409EFF !important;  color: white;  }
  .tagBut{  position: relative;  left: 1086px;  top: 23px;  width: 60px;  height: 25px;  background: #409EFF;  border: none;  color: white;  border-radius: 5%;cursor: pointer;  }
  .nodeCol /deep/ .cell{  box-sizing: border-box;  white-space: nowrap!important;  word-break: break-all;  line-height: 23px;  }
  .shuttleWrap .el-table .cell {  height: 30px !important; }
  .urlManagerData-text p{ height: 26px;  }
  .el-row {  margin-top:0;  }
  .doWrap div {  border: 1px solid gray;  width: 38px;  height: 24px;  margin-right: 2px;  border-radius: 3px;  cursor: pointer;  }
  .urlManagerData-text p[data-v-241df2d3]{height: 38px;line-height: 38px;}
  .urlManager-name, .urlManager-code, .urlManager-time{  padding: 0;  margin: 0;  }
  .urlManager-name{  font-size: 16px;  color: #000;  }
</style>
