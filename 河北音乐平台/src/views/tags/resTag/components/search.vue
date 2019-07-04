<template>
  <div>
    <el-form
    :inline="true"
    :model="formInline"
    label-width="100px"
    label-position="right"
    class="demo-form-inline"
    size="mini">
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label="资源编码"
        label-width="68px"
      >
        <el-input v-model="formInline.videoCode" placeholder="请输入资源编码" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label="资源名称"
        label-width="68px"
      >
        <el-input v-model="formInline.videoName" placeholder="请输入资源名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label="艺人名称"
        label-width="68px"
      >
        <el-input v-model="formInline.artistName" placeholder="请输入艺人名称" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label="是否已贴标签"
        label-width="97px"
      >
        <el-select v-model="formInline.haveTag" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in haveTagData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label="曲目类别"
        label-width="68px"
      >
        <el-select v-model="formInline.videoType" placeholder="请选择" @change="onSubmit">
          <el-option v-for="item in videoSongType" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label-width="150px"
        label="标签筛选条件:包含"
        style="position:relative;"
      >
        <el-input v-model="formInline.containsTag" @click.native="searchDialog" placeholder="请输入标签" style="z-index: 999;filter:Alpha(opacity=0);rgba(255,255,255,0);opacity:0;"></el-input>
        <div class="inBox">
          <div v-for="(item, index) in resAllIdsFc" style="float: left;" class="_secbox">
            <span>{{item.tagName}}</span>
          </div>
        </div>
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
      <el-form-item
        label="不包含"
        label-width="56px"
      >
        <el-input id="test" v-model="formInline.notContainsTag" @click.native="searchDialogNo" placeholder="请输入标签" style="z-index: 999;filter:Alpha(opacity=0);rgba(255,255,255,0);opacity:0;"></el-input>
        <div class="inBox">
          <div v-for="(item, index) in resAllIdsNoFc" style="float: left;" class="_secbox">
            <span>{{item.tagName}}</span>
          </div>
        </div>
      </el-form-item>
    </el-col>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
    <!-- 搜索弹窗-->
    <el-dialog
      width="800px"
      height="400px"
      :title="dialog.title"
      :visible.sync="dialog.show"
      :show-close="false"
      @open="dialogShuttleOpen"
    >
      <div class="shuttleWrap">
        <!--<div style="width: 580px;height:600px;border: 1px solid gray;">-->
        <div>
          <!--<button class="clearBut" @click="dialogShuttleClose">清空全部</button>-->
          <el-button icon="el-icon-delete" type="warning" plain size="mini" @click="dialogShuttleClose" title="删除全部" style="position: absolute;left: 132px;top: 70px;height: 27px;" />
          <div style="margin: -12px 0 5px 16px;">已选择标签：</div>
          <div style="width: 732px;min-height: 40px;max-height: 70px; overflow: auto" class="tagType">
            <div v-if="dialog.type === 'yes'">
              <div v-if="resAllIdsFc.length=== 0" class="noContent">暂无数据</div>
              <div v-else v-for="(item, index) in resAllIdsFc" style="float: left;" class="secbox tAct">
                <span  @click="doAlready(item,index)">{{item.tagName}}</span>
              </div>
            </div>
            <div v-if="dialog.type === 'no'">
              <div v-if="resAllIdsNoFc.length=== 0" class="noContent">暂无数据</div>
              <div v-else v-for="(item, index) in resAllIdsNoFc" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                <span  @click="doAlready(item,index)">{{item.tagName}}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 580px;height:520px;">
          <div>
            <div style="height: 163px; width: 700px;" class="search">
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
                <div style="margin: 15px">请输入标签：<input style="height: 26px;" type="text" v-model="dialogAllReq.searchTagName" @keyup.enter="getSearch([],'')"></div>
              </div>

            </div>

            <div style="">
              <div style="text-align: left; margin-left: 15px">标签：</div>
              <div style="overflow: auto;width: 732px;height: 310px;position:relative">
                <div v-for="(item, index) in resTagAll" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                  <span style=";" @click="getAllTagId(item,index)">{{item.tagName}}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="Btns">
          <button class="botBut" @click="dialogSubmit">保存</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'search',
  props: ['formInline', 'resAllIds', 'resAllIdsNo'],
    // {
  //   formInline: Object,
  //   resAllIds: Array,
  //   resAllIdsNo: Array,
  // },
  computed: {
    //resAllIdsFc () {
    //  return this.resAllIds || [];
    //},
    //resAllIdsNoFc (){
    //  return this.resAllIdsNo || [];
    //}
  },
  activated () {
    this.alreadyTag = [];
    this.tagTypeData = [];
    this.resTagAll = [];
    this.resAllIdsFc = [];
    this.resAllIdsNoFc = [];
    this.formInline.containsTag = '';
    this.formInline.notContainsTag = '';
    this.getTagName();
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      date: [],
      alreadyTag: [],
      tagTypeData: [],
      resTagAll: [],
      resAllIdsFc: this.resAllIds,
      resAllIdsNoFc: this.resAllIdsNo,
      // formInline: this.formInline,
      videoSongType: this.$root.staticData.videoSongType,
      haveTagData: [{id:'', name: '请选择'},{id: 1, name: '是'}, {id: 0, name: '否'}],
      dialog: {
        title:' ',
        show: false,
        type:'',
      },
      dialogAllReq: {
        resCode: '',	//是	String	资源编码
        searchTagName: '',	//否	String	标签名称（查询条件）
        searchTypeId: '',	//否	String	类型ID（查询条件）
      },
      searchTypeId: 0,
    }
  },
  watch: {
    resAllIds (ev) {
      let that = this;
      that.resAllIdsFc = ev;
    },
    resAllIdsNo (ev) {
      let that = this;
      that.resAllIdsNoFc = ev;
    }
  },
  methods: {
    doAlready (data,index) {
      if (this.dialog.type === 'yes') {
        this.resAllIdsFc.splice(index,1);
        this.resTagAll.forEach(i => {
          if (i.tagId === data.tagId) {
            i.checkState = false;
          }
        })
      } else {
        this.resAllIdsNoFc.splice(index,1);
        this.resTagAll.forEach(i => {
          if (i.tagId === data.tagId) {
            i.checkState = false;
          }
        })
      }

      // this.resTagAll.splice(this.resTagAll.findIndex(i => i.tagId === data.tagId),1);
    },
    dialogShuttleOpen () {

    },
    dialogShuttleClose () {
      if (this.dialog.type === 'yes') {
        this.resAllIdsFc = []
      } else {
        this.resAllIdsNoFc = []
      };
      this.resTagAll.forEach(i => {
        i.checkState = false;
      })
      this.searchTypeId = 0;
      this.dialogAllReq.searchTagName = '';
      // this.dialog.show = false;
    },
    searchDialog() {
      this.dialog.show = true;
      this.dialog.type = 'yes';
      this.dialog.title = '标签筛选条件:包含';
      this.getTagName();
      this.getAllTag();
    },
    searchDialogNo () {
      this.dialog.show = true;
      this.dialog.type = 'no';
      this.dialog.title = '标签筛选条件:不包含';
      this.getTagName();
      this.getAllTag();
    },
    getTagName () { // 获取标签筛选条件
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
    getAllTag () { // 获取全部标签
      let that = this;
      for(let i in this.dialogAllReq){
        if (i == 'resCode') {
          this.dialogAllReq[i] = '';
        } else if ( i == 'searchTypeId') {
          this.dialogAllReq[i] = this.searchTypeId;
        }
      }
      let parma = that.dialogAllReq;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   // url: that.url.allTagList,
      //   url:'/cms/api/tag/allTagList.do',
      //   method:'post',
      //   data: this.Qs.stringify(parmas)
      // }).then(res=>{
      //   that.resTagAll = res.data.data;
      //   that.resTagAll.forEach( i=> {
      //     that.$set(i, "checkState", false);
      //   });
      //   if (that.dialog.type === 'yes'){
      //     res.data.data.forEach( i => {
      //       for (let n of that.resAllIdsFc) {
      //         if (i.tagId === n.tagId) {
      //           i.checkState = true;
      //         }
      //       }
      //     })
      //   } else {
      //     res.data.data.forEach( i => {
      //       for (let n of that.resAllIdsNoFc) {
      //         if (i.tagId === n.tagId) {
      //           i.checkState = true;
      //         }
      //       }
      //     })
      //   }
      //
      //   that.tableLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: "/cms/api/tag/allTagList.do",
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagAll = res.data.data;
          that.resTagAll.forEach( i=> {
            that.$set(i, "checkState", false);
          });
          if (that.dialog.type === 'yes'){
            res.data.data.forEach( i => {
              for (let n of that.resAllIdsFc) {
                if (i.tagId === n.tagId) {
                  i.checkState = true;
                }
              }
            })
          } else {
            res.data.data.forEach( i => {
              for (let n of that.resAllIdsNoFc) {
                if (i.tagId === n.tagId) {
                  i.checkState = true;
                }
              }
            })
          }

          that.tableLoading = false;
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
    getAllTagId(data,index) {
      data.checkState = !data.checkState;
      if(this.dialog.type === 'yes') {
        this.resTagAll.forEach(i => {
          if (i.tagId == data.tagId) {
            if (data.checkState) {
              this.resAllIdsFc.push(i)
            } else {
              this.resAllIdsFc.splice(this.resAllIdsFc.findIndex(v => v.tagId === data.tagId), 1);
            }
          }
        })
      } else {
        this.resTagAll.forEach(i => {
          if (i.tagId == data.tagId) {
            if (data.checkState) {
              this.resAllIdsNoFc.push(i)
            } else {
              this.resAllIdsNoFc.splice(this.resAllIdsNoFc.findIndex(v => v.tagId === data.tagId), 1);
            }
          }
        })
      }

    },
    dialogSubmit() {
      let tagArr = [];
      if (this.dialog.type === 'yes') {
        this.resAllIdsFc.forEach( i => {
          tagArr.push(i.tagId);
        })
        this.formInline.containsTag = tagArr.toString();
      } else {
        this.resAllIdsNoFc.forEach( i => {
          tagArr.push(i.tagId);
        })
        this.formInline.notContainsTag = tagArr.toString();
      }
      this.searchTypeId = 0;
      this.dialog.show = false;
    },

    dateChosed() {
      this.formInline.beginTime = this.date[0];
      this.formInline.endTime = this.date[1];
    },
    onSubmit () {
      this.$emit('vSearch', 'search');
    },
    clear () {
      this.date = [];
      this.$emit('vSearch', 'clear');
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form {
  margin: 20px 0 0 0;
}
.line {
  text-align: center;
}
.el-form-item__content {
  width: 167px;
}
.w150 {
  width: 150px;
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
._secbox{
  display: inline-block;
  min-width: 40px;
  height: 20px;
  margin: 5px 2px;
  border: 1px solid darkgray;
  border-radius: 5px;
  line-height: 8px;
  cursor: pointer;
  font-size: 13px;
  padding: 6px;
  /*color: #dcdfe6;*/
  color: darkgray;
}
.tAct{
  background: #409EFF !important;
  color: white;
}
.Btns{
  float: right;
  position: relative;
  top: -12px;
  left: -18px;
}
.botBut{
  width: 60px;
  height: 28px;
  border: none;
  border-radius: 5%;
  background: #409EFF;
  color: white;
  margin-left: 12px;
}
.clearBut {
  width: 68px;
  height: 25px;
  border: none;
  border-radius: 5%;
  background: #f56c6c;
  color: white;
  margin-left: 12px;
}
.noContent {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: center;

  display: -moz-box;
  -moz-box-orient: horizontal;
  -moz-box-pack: center;
  -moz-box-align: center;

  display: -o-box;
  -o-box-orient: horizontal;
  -o-box-pack: center;
  -o-box-align: center;

  display: -ms-box;
  -ms-box-orient: horizontal;
  -ms-box-pack: center;
  -ms-box-align: center;

  display: box;
  box-orient: horizontal;
  box-pack: center;
  box-align: center;
}
.inBox {
  width: 189px;
  height: 28px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 10%;
  position: absolute;
  top: 0px;
  border-radius: 4px 4px
}
</style>
