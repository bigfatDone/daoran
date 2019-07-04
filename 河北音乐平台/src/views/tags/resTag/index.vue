<template>
  <div class="urlManager-list">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      :resAllIdsNo="resAllSIdsNo"
      :resAllIds="resAllSIds"
      :tagSelectUrl="url.tagSelect"
      @getTagType="getTags($event)"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup">
      <el-button type="primary" icon="el-icon-upload2" size="mini" title="导出全部" circle  @click="downExcel"></el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" title="批量导入" circle  @click="dialogImportIn = true"></el-button>
    </div>
    <el-row>
      <el-table
        id="tableData"
        ref="videoTable"
        :data="tableData"
        border
        style="width: 100%"
        empty-text="暂无数据"
        :height="TableHeight"
        v-loading="tableLoading">
        <el-table-column
          label="资源编码">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.videoCode">{{scope.row.videoCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.videoName">{{scope.row.videoName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="艺人">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="曲目类别">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.videoText">{{scope.row.videoText}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.lastTime">{{scope.row.lastTime}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle  @click="editVideo(scope.row)" title="编辑" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="req.list.pageSize"
        :total="tableDataCount"
        :current-page="req.list.currPage + 1"
        :page-sizes="[20, 100, 300, 500, 1000]"
        @size-change="sizeChange"
        @current-change="tableDataPageChange">
      </el-pagination>
    </el-row>
    <!--弹窗-->
    <!--删除二次确认-->
    <el-dialog title="数据操作确认页面" :visible.sync="dialogOperate" width="600px">
      <el-table
        v-if="dialogOperate"
        :data="listChosed"
        style="width: 100%"
        empty-text="暂无数据"
        height="250">
        <el-table-column
          label="ID">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.id">{{scope.row.id}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-name text-small" :title="scope.row.name">{{scope.row.name}}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogOperate = false,listChosed=[]">取消</el-button>
        <el-button type="primary" size="mini" @click="lineOper">确定</el-button>
      </div>
    </el-dialog>

   <!--新增、修改-->
    <!--<el-dialog-->
      <!--width="586px"-->
      <!--:title="dialog.title"-->
      <!--:visible.sync="dialog.show"-->
      <!--@close="dialogClose">-->
      <!--<el-form-->
        <!--v-loading="editLoading"-->
        <!--ref="dialogForm"-->
        <!--:model="dialogForm"-->
        <!--:label-width="dialog.formLabelWidth"-->
        <!--size="mini">-->
        <!--<el-form-item prop='incomePayDes' label="标签名称:">-->
          <!--<div class="w400">-->
            <!--<el-input v-model="dialogForm.name"></el-input>-->
          <!--</div>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="播控平台:" >-->
          <!--<div class="w400">-->
            <!--<el-select v-model="dialogForm.tagName" placeholder="请选择" style="width: 100%;">-->
              <!--<el-option-->
                <!--v-for="item in tagsTypeData"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id"></el-option>-->
            <!--</el-select>-->
          <!--</div>-->
        <!--</el-form-item>-->
        <!--<el-form-item  class="text_right">-->
          <!--<el-button type="primary" @click="dialogFormSubmit">提交</el-button>-->
          <!--<el-button @click="dialog.show = false">取消</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

    <!--</el-dialog>-->
    <!--批量导入-->
    <el-dialog
      width="500px"
      :visible.sync="dialogImportIn"
      @close="ImportInClose"
      :show-close="false"
      v-loading="importOuting">
      <div class="title" slot="title">
        批量导入
        <el-button @click="templateLoad" size="mini">模板下载</el-button>
      </div>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-upload style="width:80px"
                   class="upload-excel"
                   action="/cms/api/tag/importResTagExcel.do"
                   accept="xls"
                   :data="excelParam"
                   :show-file-list="false"
                   :on-change="handleDialogImportIn"
                   @click.native="beforeUpload"
                   :auto-upload="false"
                   :on-success="uploadDone"
                   ref="newupload">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        {{fileName}}
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="DownLoadError" v-show="errorDownLoad.length > 0">点击下载错误报告</el-button>
        <el-button size="mini" @click="closeImportIn">取消</el-button>
        <el-button type="primary" size="mini" @click="importIn">确定</el-button>
      </div>
    </el-dialog>

    <!--穿梭框-->
    <el-dialog
      width="1200px"
      height="800px"
      :title="dialog.title"
      :visible.sync="dialog.show"
      @close="dialogShuttleClose">
      <div class="shuttleWrap">
        <div style="position: absolute;position: absolute;top: -65px;left: 123px;font-size: 16px;color: #967d56;">
          <span>{{this.shuttleData.videoName+"/"+this.shuttleData.videoCode+"/"+this.shuttleData.artistName}}</span>
        </div>
        <div style="width: 480px;height:600px;margin-left: 15px">
          <div style="display: inline-block;float: left;position: relative;top: -5px">
            <span>资源已有标签：</span>
          </div>
          <el-row>
            <el-table
              id="tableData"
              ref="videoTable"
              :data="resTagData"
              border
              style="width: 100%;height: 546px;overflow: auto;position: relative;"
              empty-text="暂无数据">
              <el-table-column
                label="标签分类"
                width="120">
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
        <!--<div style="width: 580px;height:600px;border: 1px solid gray;">-->
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
                <div style="margin: 15px">请输入标签：<input style="height: 26px;" type="text" v-model="shuttleAllReq.searchTagName" @keyup.enter="getSearch([],'')"></div>
              </div>

            </div>

            <div style="margin-top: 85px;">
              <div style="text-align: left; margin-left: 15px">标签：</div>
              <div style="overflow: auto;height: 350px;position:relative">
                <div v-for="(item, index) in resTagAll" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                  <span style=";" @click="getAllTagId(item,index)">{{item.tagName}}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div><button class="botBut" @click="closeShutt">完成</button></div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import vSearch from './components/search'

export default {
  name: 'urlManager-list',
  props: ['routeHash'],
  components: {
    vSearch
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
  watch : {
    tableData (data) {
      let that = this;
      data.forEach(item => {
        let text = '';
        that.videoType.forEach(type => {
          if(item.videoType == type.type){
            item.videoText = type.name;
          }
        });
      });
    }
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url: {
        tagResList : "/cms/api/tag/resList.do", // 获取资源视频列表
        resTag : "/cms/api/tag/resTag.do", // 获取资源已录入标签
        allTagList : "/cms/api/tag/allTagList.do", // 获取全部标签列表
        tagBind : "/cms/api/tag/bind.do", // 标签增加
        tagUnbind : "/cms/api/tag/unbind.do", // 标签解绑
        downloadResTagExcel : "/cms/api/tag/downloadResTagExcel.do", // 下载
        importResTagExcel : "/cms/api/tag/importResTagExcel.do", // 导入
        tagSelect : "/cms/api/tagType/select.do",
      },
      dialog: {
        disabledFlag: false,
        width:'400px',
        show : false,
        title: '新增标签类型',
        formLabelWidth:'120px',
        type: 'blank'
      },
      shuttleData: [],
      sorceDialog: {
        show: false,
      },
      dialogForm:{
        name    : '',
        tagName    : '',
        id    : '',
        // resFileCode: '',
        // resName    : '',
        // nodeCode   : '',
        // playpfCode : '',
        // resState   : '',
        // time       : '',
        // playUrlGQ  : '',
        // playUrl    : '',
        // type: '',
        // oldPlaypfCode: '',
      },
      shuttleForm: {
        name    : '',
        tagName    : '',
        id    : '',
        // resFileCode: '',
        // resName    : '',
        // nodeCode   : '',
        // playpfCode : '',
        // resState   : '',
        // time       : '',
        // playUrlGQ  : '',
        // playUrl    : '',
        // type: '',
        // oldPlaypfCode: '',
      },
      resAllSIdsNo: [],
      resAllSIds: [],
      req: {
        list: {
          videoCode    : '', //
          videoName    : '', //
          videoType    : '', //
          artistName    : '', //
          haveTag    : '', //
          containsTag    : '', //
          notContainsTag    : '', //
          currPage   : 0,  //是 int 当前页码
          pageSize   : 20, //是 int 页面容量
        }
      },
      videoType: this.$root.staticData.videoSongType,
      selectHash: {},
      errorDownLoad: '',
      fileName: '',
      fixCodeName: '',
      importantInData: [],
      fileUrl: '',
      newPlaypfCode: '',
      radio: '',
      tableSource: [],
      listChosed: [],
      tableChosed: [],
      cpList: [],
      tableData: [],
      resTagData: [],
      resIds: [],
      resAllIds: [],
      resTagAll: [],
      tagTypeData: [],
      searchTypeId: 0,
      tableSourceCount: 0,
      tableDataCount: 0,
      pageNum: 1,
      hasSelection: true,
      saveTit: '',
      sourceListLoading: false,
      dialogVisible: false,
      tableLoading: false,
      editLoading: false,
      dialogOperate: false,
      controlFlag: false,
      lineStatus: "",
      dialogImportOut: false,
      dialogImportIn: false,
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      listload: true,
      TableHeight: 600,
      ids: '',
      tagsTypeData: [],
      excelParam: {
        file: "",
      },
      shuttleAllReq: {
        resCode: '',	//是	String	资源编码
        searchTagName: '',	//否	String	标签名称（查询条件）
        searchTypeId: 0,	//否	String	类型ID（查询条件）
      },
      configNum: 0,
      isempty: false, // 判断--进入后直接点击确认，提示报错
      tagFirst: true,
    }
  },
  activated () {-
    this.onSubmit('clear');
    this.Resize();
  },
  // watch:{
  //   $route: function () {
  //     let route = this.$router.history.current.path;
  //     route = route.substr(1);
  //     console.log(this.routeHash)
  //     if (this.routeHash[route]) {
  //       this.curUrl = this.$router.history.current.path;
  //       this.getNodeCode();
  //       this.onSubmit('clear');
  //     }
  //   }
  // },
  methods: {
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
  // 穿梭
    editVideo (row) {
      this.dialog.title = '资源贴标签';
      this.dialog.disabledFlag = true;
      this.dialog.show  = true;
      this.dialog.type = 'edit';
      this.shuttleData = row;
      this.getResTag();
      this.getAllTag();
      this.getTagName();
    },
    getResTag () { // 左边
      this.firstFlag = false;
      let that = this;
      let parma = {resCode: this.shuttleData.videoCode,};
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.resTag,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.resTagData = res.data.data;
      //   that.resTagData.forEach( i => {
      //     i.tagList.forEach(j => {
      //       //j.checkState = false;
      //       that.$set(j, "checkState", false);
      //     })
      //   })
      //   that.tableLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.resTag,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagData = res.data.data;
          that.resTagData.forEach( i => {
            i.tagList.forEach(j => {
              //j.checkState = false;
              that.$set(j, "checkState", false);
            })
          })
          that.tableLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getAllTag () { // 右边
      let that = this;
      for (let i in this.shuttleAllReq) {
        if (i == 'resCode') {
          this.shuttleAllReq[i] = this.shuttleData.videoCode;
        } else if ( i == 'searchTypeId') {
          this.shuttleAllReq[i] = this.searchTypeId;
        }
      }
      let parma = that.shuttleAllReq;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.allTagList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.resTagAll = res.data.data;
      //   that.resTagAll.forEach( i=> {
      //     that.$set(i, "checkState", false);
      //   })
      //   that.tableLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.allTagList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagAll = res.data.data;
          that.resTagAll.forEach( i=> {
            that.$set(i, "checkState", false);
          })
          that.tableLoading = false;
          that.tagFirst = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getTagName () {
      let that = this;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: "/cms/api/tagType/select.do",
      //   method:'post',
      //   data: {}
      // }).then(res=>{
      //   res.data.data.forEach(item => {
      //     item.id = Number(item.id);
      //   });
      //   that.tagTypeData = res.data.data;
      //   that.tagTypeData.unshift({
      //     id: 0,
      //     name: "全部"
      //   });
      //   that.tagTypeData.forEach(i => {
      //     that.$set(i, "checkState", false)
      //   })
      //   that.tagTypeData[0].checkState = true;
      // }).catch(err=>{
      //   console.log(err);
      // })

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
          })
          that.tagTypeData[0].checkState = true;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getSearch(data, index){
      let that = this;
      if (data !== []){
        data.checkState = !data.checkState;
        that.tagTypeData.forEach(i => {
          if (that.tagTypeData.indexOf(i) === index ){
            i.checkState = true;
            that.searchTypeId = i.id;
          } else {
            i.checkState = false;
          }
        })
      }
      this.getAllTag();
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
    removeSelect(){
      let that = this;
      let params;
      let param = {
        resCode: this.shuttleData.videoCode,
        tagIds: that.resIds.toString(),
      };
      that.editLoading = true;
      params = {jsonParam: JSON.stringify(param)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagUnbind,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if (res.data.success) {
      //     setTimeout((e) => {
      //       that.$notify({
      //         type: 'success',
      //         message: res.data.msg
      //       });
      //       // that.editLoading = false;
      //       // that.dialog.show = false;
      //       that.getResTag();
      //       that.getAllTag();
      //       that.clearSelect();
      //     }, 500);
      //   }else {
      //     // that.editLoading = false;
      //     that.$notify({
      //       type: 'warning',
      //       message: res.data.msg
      //     });
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // });

      that.$ajax({
        url: that.url.tagUnbind,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: res.data.msg
              });
              // that.editLoading = false;
              // that.dialog.show = false;
              that.getResTag();
              that.getAllTag();
              that.clearSelect();
            }, 500);
          }else {
            // that.editLoading = false;
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
    addSelect(){
      let that = this;
      let params;
      let param = {
        resCode: this.shuttleData.videoCode,
        tagIds: that.resAllIds.toString(),
      };
      that.editLoading = true;
      params = {jsonParam: JSON.stringify(param)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagBind,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if (res.data.success) {
      //     setTimeout((e) => {
      //       that.$notify({
      //         type: 'success',
      //         message: res.data.msg
      //       });
      //       // that.editLoading = false;
      //       // that.dialog.show = false;
      //       that.getResTag();
      //       that.getAllTag();
      //       that.clearSelect();
      //     }, 500);
      //   }else {
      //     // that.editLoading = false;
      //     that.$notify({
      //       type: 'warning',
      //       message: res.data.msg
      //     });
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // });

      that.$ajax({
        url: that.url.tagBind,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: res.data.msg
              });
              // that.editLoading = false;
              // that.dialog.show = false;
              that.getResTag();
              that.getAllTag();
              that.clearSelect();
            }, 500);
          }else {
            // that.editLoading = false;
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
      // for (let i in that.dialogForm) {
      //   that.dialogForm[i] = '';
      // }
      this.resTagData.forEach(i => {
        i.tagList.forEach(j => {
          j.checkState = false;
        })
      });
      this.resTagAll.forEach(i => {
        i.checkState = false;
      });
    },
    dialogShuttleClose () {
      let that = this;
      this.clearSelect();
      that.tagFirst = true;
    },
    closeShutt () {
      let that = this;
      this.clearSelect();
      this.dialog.show = false;
      that.tagFirst = true;
    },
    // 批量导入
    templateLoad(){
      window.open("/cms/api/tag/downloadResTagExcel.do");
    },
    downExcel(){ // 下载资源Excel
      let that = this;
      let parma = that.req.list;
      let url = '/cms/api/tag/downloadAllResExcel.do?videoCode=' + parma.videoCode + '&videoName=' + parma.videoName + '&videoType=' + parma.videoType
        + '&artistName=' + parma.artistName + '&haveTag=' + parma.haveTag + '&containsTag=' + parma.containsTag + '&notContainsTag=' + parma.notContainsTag;
      window.open(url);
      // let parmas = {jsonParam: JSON.stringify(parma)};
      //   {jsonParam: JSON.stringify({
      //   videoCode: this.req.list.videoCode,
      //   videoName: this.req.list.videoName,
      //   artistName: this.req.list.artistName
      // })};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: '/cms/api/tag/downloadAllResExcel.do',
      //   method:'post',
      //   data: this.$root.Qs.stringify(parmas)
      // }).then(res=>{
      //   window.open(res.data.data.path)
      //   // that.scrollTop('#sourceList');
      // }).catch(err=>{
      //   console.log(err);
      // })

      // that.$ajax({
      //   url: '/cms/api/tag/downloadAllResExcel.do',
      //   method: "post",
      //   data: this.Qs.stringify(parmas),
      //   success: function (res) {
      //     window.open(res.data.data.path)
      //   },
      //   error: function (error) {
      //     that.$message.error(error);
      //   }
      // });
    },
    ImportInClose () {
      this.$refs.newupload.clearFiles();
      this.errorDownLoad = '';
      this.fileName = '';
    },
    handleDialogImportIn(file, fileList){
      this.isempty = true;
      this.fileName = file.name;
      // this.excelParam.file = file.name;
      // this.excelParam.nodeCode = this.req.list.nodeCode;
    },
    uploadDone (response, file, fileList) {
      let that = this;
      if (response.success === false) {
        that.importOuting = false;
        that.configNum += 1;
      // if (response.success) {
        // if (response.data.path.length > 0) {
        //   that.errorDownLoad = response.data.path;
        //   that.$message({
        //     type: 'warning',
        //     message: response.msg
        //   });
        // }else {
        // }
        that.$message({
          type: 'warning',
          message: response.msg
        });
      } else {
        that.importOuting = false;
        that.configNum += 1;
        that.$message({
          type: 'success',
          message: response.msg
        });
        that.dialogImportIn = false;
        that.onSubmit('clear');
      }
    },
    DownLoadError () {
      window.open(this.errorDownLoad);
    },
    closeImportIn () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogImportIn = false;
    },
    beforeUpload() {
      this.configNum = 0;
    },
    importIn (){
      let that = this;
      if (that.configNum === 0 && that.isempty) {
        this.$refs.newupload.submit();
        this.importOuting = true;
      } else {
        that.$message({
          message: '请上传正确格式的文件',
          type: 'warning'
        })
      }
    },

    sizeChange (size) {
      this.req.list.pageSize = size;
      this.getList();
    },
    ClearSelectItem () {
      let that = this;
      that.selectRow = {};
    },
    tableDataPageChange (page) {
      this.firstFlag = false;
      this.getList(page - 1);
    },
    sourceListpageChange (page) {
      this.sorceDialog.req.currPage = page - 1;
      this.getSourceList();
    },
    dialogClose () {
      let that = this;
      for (let i in that.dialogForm) {
        that.dialogForm[i] = '';
      }
    },
    dialogFormSubmit () {
      let that = this;
      let params;
      let param = {
        name: that.dialogForm.name,
        typeId: that.dialogForm.tagName,
      };
      that.editLoading = true;
      if (this.dialog.type === "edit") {
        param.id = that.dialogForm.id
      }
      params = {jsonParam: JSON.stringify(param)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagSave,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if (res.data.success) {
      //     setTimeout((e) => {
      //       that.$notify({
      //         type: 'success',
      //         message: '修改成功'
      //       });
      //       that.editLoading = false;
      //       that.dialog.show = false;
      //       that.onSubmit('clear');
      //     }, 500);
      //   }else {
      //     that.editLoading = false;
      //     that.$notify({
      //       type: 'warning',
      //       message: res.data.msg
      //     });
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // });

      that.$ajax({
        url: that.url.tagSave,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: '修改成功'
              });
              that.editLoading = false;
              that.dialog.show = false;
              that.onSubmit('clear');
            }, 500);
          }else {
            that.editLoading = false;
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
    lineOper () {
      this.setEffect('');
      this.dialogOperate = false;
    },
    setEffect (id) {
      let that = this;
      if (!that.dialogOperate && id !== '') {
        this.ids = id.id;
        that.listChosed.push(id);
      }
      if (this.ids === '' && that.listChosed.length <= 0) {
        that.$message({
          type: 'warning',
          message: '您还没选中任何数据'
        });
      } else if (!that.dialogOperate) {
        that.dialogOperate = true;
      } else {
        let listArr = [];
        if (this.ids === '') {
          that.listChosed.forEach(item => {
            listArr.push(item.id);
          });
        } else {
          listArr.push(this.ids);
        }
        let param = {
          ids: listArr.toString()
        }
        param = {jsonParam: JSON.stringify(param)}
        that.tableLoading = true;
        // this.axios({
        //   headers: {
        //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        //   },
        //   url: that.url.tagDel,
        //   method: 'post',
        //   data: this.Qs.stringify(param)
        // }).then(res => {
        //   that.tableLoading = false;
        //   that.$message({
        //     type: 'success',
        //     message: res.data.msg
        //   });
        //   that.listChosed = [];
        //   that.ClearSelectItem();
        //   that.getList();
        //   that.dialogOperate = false;
        // }).catch(err => {
        //   console.log(err);
        // })

        that.$ajax({
          url: that.url.tagDel,
          method: "post",
          data: this.Qs.stringify(param),
          success: function (res) {
            that.tableLoading = false;
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.listChosed = [];
            that.ClearSelectItem();
            that.getList();
            that.dialogOperate = false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    responHeight () {
      let dom = this.$el;
      let contain_height = document.body.offsetHeight;
      let search_height = dom.querySelector('.el-form').offsetHeight;
      let static_height = 260;
      let result_height = parseInt(contain_height - search_height - static_height);
      if (result_height >= 300) {
        this.TableHeight = Number(result_height);
      } else {
        this.TableHeight = 600;
      }
    },
    addVideo () {
      for(let i in this.dialogForm){
        this.dialogForm[i] = '';
      }
      this.newPlaypfCode = '';
      this.dialog.disabledFlag = false;
      this.dialog.title = '新增标签类型';
      this.dialog.show  = true;
      this.dialog.type = 'add';
    },
    scrollTop (id) {
      let table = document.querySelector(id);
      let wrap = table.querySelector('.el-table__body-wrapper');
      if (wrap) {
        wrap.scrollTop = 0;
      }else {
        console.error('not found \'el-table__body-wrapper\'');
      }
    },
    getList (page) {
      this.firstFlag = false;
      let s_page = (page >= 0 ? page : this.req.list.currPage);
      this.req.list.currPage = s_page;
      let that = this;
      let parma = that.req.list;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.tagResList,
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.ResultDeal(res); // ！处理方法已独立分离
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.tagResList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.ResultDeal(res); // ！处理方法已独立分离
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    ResultDeal (res) {
      let that = this;
      if (!res.data.success) {
        that.tableData = [];
        return;
      }
      let selected = [];
      that.scrollTop('#tableData');
      that.tableData = res.data.data.resList || [];
      that.tableDataCount = res.data.data.total;
      that.tableLoading = false;
      setTimeout(() => {
        that.responHeight();
      }, 500);
    },
    selectAll (selection) {
      let that = this;
      let selectall = (selection.length == that.tableData.length) ? true : false;

      if (selectall === false) {
        that.ClearSelectItem();
        that.listChosed = [];
      }else {
        that.tableData.forEach((item, index) => {
          that.selectRow[item.pid] = true;
          that.listChosed.push(item);
        });
      }
    },
    SelectCheck (val, row) {
      let result = false;
      val.forEach((item, index) => {
        if (item.pid == row.pid) {
          result = true;
        }
      });

      return result;
    },
    selectSingle (val, row) {
      let that = this;
      let result = that.SelectCheck(val, row); // 勾选-取消勾选
      if (result) {
        that.selectRow[row.pid] = true;
        that.listChosed.push(row);
      } else {
        delete that.selectRow[row.pid];
        for (let i=0; i<that.listChosed.length; i++) {
          let item = that.listChosed[i];
          if (item.pid == row.pid) {
            that.listChosed.splice(i, 1);
            break;
          }
        }
      }
    },
    handleSelectionChange (val) {
      let that = this;
      that.tableChosed = [];
      val.forEach(item => {
        that.tableChosed.push(item.pid);
      });
    },
    getTags(data){
      let that = this;
      this.tagsTypeData = data;
    },
    onSubmit (state) {
      let that = this;
      let datas = [];
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.req.list.pageSize = 20;
        that.req.list.currPage = 0;
        that.listChosed = [];
        that.ClearSelectItem();
        that.getList();
      }else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i == 'pageSize') {
            that.req.list[i] = 20;
          }else if (i == 'currPage') {
            that.req.list[i] = 0;
          }else {
            that.req.list[i] = '';
            that.req.list[i] = '';
          }
        }
        that.resAllSIds = [];
        that.resAllSIdsNo = [];
        that.listChosed = [];
        that.ClearSelectItem();
        that.getList();
      }
    },
  },
}
</script>

<style scoped>
  .el-row {
    margin-top: 20px;
  }
  .urlManager-name,
  .urlManager-code,
  .urlManager-time{
    padding: 0;
    margin: 0;
  }
  .urlManager-name{
    font-size: 16px;
    color: #000;
  }
  .text-small{
    font-size: 14px;
    color: #333;
    padding: 5px 0;
  }
  .urlManager-code,
  .urlManager-time{
    color: #ccc;
  }
  .urlManager-normal{
    color: #333;
  }
  .urlManagerData-text p{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .td {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .actived {
    color: #ff9900;
  }
  .text_right {
    text-align: right;
    padding-right: 26px;
  }
  .w400 {
    display: inline-block;
    width: 400px;
  }
  .w350 {
    display: inline-block;
    width: 350px;
  }
  .tAct{
    background: #409EFF !important;
    color: white;
  }
  .tagType{
    div:first-child(1){
               margin-left:20px;
             }
  }
  .secbox{
    display: inline-block;
    min-width: 40px;
    height: 26px;
    margin: 5px 10px;
    border: 1px solid darkgray;
    border-radius: 5px;
    line-height: 12px;
    cursor: pointer;
    padding: 6px;
  }
  .shuttleWrap{
    position: relative;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
  }
  .moveWrap{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    pointer-events: auto;
    background-clip: padding-box;
    border: 1px solid #f8f8f8;
    outline: 0;
    position:relative;
  }
  .addSelect{
    position: absolute;
    top: 230px;
    left: 18px;
    border-radius: 10px 0 0 10px;
    border: none;
    width: 60px;
    height: 25px;
    cursor:pointer;
  }
  .removeSelect{
    position:absolute;
    top:300px;
    right: 2px;
    border-radius: 0 10px 10px 0;
    border: none;
    width: 60px;
    height: 25px;
    cursor:pointer;
  }
  .botBut{
    position: relative;
    left: 1086px;
    top: 5px;
    width: 60px;
    height: 25px;
    background: #409EFF;
    border: none;
    color: white;
    border-radius: 5%;

  }
  .botBut:hover{
    cursor:pointer;
  }
</style>
