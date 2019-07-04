<template>
  <div class="audio-edit" v-loading="pageload">
    <div style="margin-bottom: 10px;font-weight: bold;">
      <span>音频列表&nbsp;&nbsp;>&nbsp;&nbsp;管理</span>
    </div>
    <el-row>
      <el-col :span="24">
        <h1>{{audioData.audioName || ''}}</h1>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
        <p>资源编码：{{audioData.audioCode || ''}}</p>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
        <p>时长：{{audioData.allTime}}</p>
      </el-col>
    <!--</el-row>-->
    <!--<el-row :gutter="20">-->
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
        <p>CP商：{{audioData.cpId}}</p>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
        <p>更新时间：{{audioData.lastTime}}</p>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <p v-if="previewUrl != ''"><a target="_blank" :href="previewUrl" class="preView">预览播放</a></p>
        <p v-else><span style="color: #ccc;">预览播放</span></p>
      </el-col>
      </el-col>
    </el-row>
    <el-row>
      <p class="section-title">收费设置</p>
      <el-form label-position="left" label-width="120px">
        <!--<el-form-item label="资源名称">-->
        <!--<el-input placeholder="资源名称" v-model="videoData.videoName"></el-input>-->
        <!--</el-form-item>-->
        <label class="radio-inline" v-for="item in vipData" >
          <input type="radio" name="eleAttr" v-model="audioData.vip" :value="item.value" /> {{item.name}}
        </label>
      </el-form>
    </el-row>
    <el-row>
      <p class="section-title">基础信息</p>
      <el-form label-position="left" label-width="120px">
        <el-form-item label="资源名称">
          <el-input placeholder="资源名称" v-model="audioData.audioName"></el-input>
        </el-form-item>
        <el-form-item label="资源名称首字母">
          <el-input placeholder="资源名称首字母" v-model="audioData.upperCase"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" placeholder="描述" v-model="audioData.des"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span='24'>
      <p class="section-title">
        艺人信息<el-button type="primary" icon="el-icon-plus" circle size="mini" @click="openArtList" style="position: relative;top: -2px;"></el-button>
      </p>
      <el-table
        :data="audioData.artistList"
        border
        max-height="300"
        fit
        style="min-width: 100%"
        empty-text="暂无数据" >
        <el-table-column
          label="艺人编号">
          <template slot-scope="scope">
            {{scope.row.artistCode || ''}}
          </template>
        </el-table-column>
        <el-table-column
          label="艺人名称">
          <template slot-scope="scope">
            {{scope.row.artistName || ''}}
          </template>
        </el-table-column>
        <el-table-column
          label="艺人类型">
          <template slot-scope="scope">
            {{scope.row.typeText || ''}}
          </template>
        </el-table-column>
        <el-table-column
          label="所属地区">
          <template slot-scope="scope">
            {{scope.row.areaText || ''}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" circle size="mini" type="danger" @click="dropArt(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-col>
    </el-row>
    <el-row>
        <p class="section-title">其他信息</p>
        <el-form :inline="true" label-position="left" label-width="100px" class="demo-form-inline">

            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="别名(英文名)">
                <el-input  placeholder="别名(英文名)" v-model="audioData.foreignName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="制作人">
                <el-input  placeholder="制作人" v-model="audioData.producer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
              <el-form-item label="发行时间">
                <el-date-picker
                  type="datetime"
                  :editable="false"
                  v-model="audioData.publishTime"
                  placeholder="发行时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 202px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="语种">
                <el-input  placeholder="语种" v-model="audioData.language"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="MV导演">
                <el-input  placeholder="MV导演" v-model="audioData.directorMV"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
              <el-form-item label="发行地区">
                <el-input  placeholder="发行地区" v-model="audioData.publishArea"></el-input>
              </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="作词">
                <el-input  placeholder="作词" v-model="audioData.lyricist"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="专辑">
                <el-input  placeholder="专辑" v-model="audioData.albumName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
              <el-form-item label="唱片公司">
                <el-input  placeholder="唱片公司" v-model="audioData.redordCompany"></el-input>
              </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="作曲">
                <el-input  placeholder="作曲" v-model="audioData.composer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="编曲">
                <el-input  placeholder="编曲" v-model="audioData.arranger"></el-input>
              </el-form-item>
            </el-col>

        </el-form>
    </el-row>
    <div class="foot">
      <el-tooltip class="item" effect="dark" content="点击保存" placement="top">
        <el-button type="primary" icon="el-icon-check" circle size="mini" @click="save"></el-button>
      </el-tooltip>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>该删除操作不可撤销，确认删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dropArt('cancle')">取 消</el-button>
        <el-button type="primary" @click="dropArt('sure')">确 定</el-button>
      </span>
    </el-dialog>
    <!--艺人弹窗-->
    <el-dialog title="新增艺人信息" :visible.sync="dialogArtListChose" width="70%" id="dialog-wrap">
      <el-form :inline="true" size="mini">
        <el-form-item label="艺人编码">
          <el-input placeholder="艺人编码" v-model="dialogArtListReq.artistCode"></el-input>
        </el-form-item>
        <el-form-item label="艺人名称">
          <el-input placeholder="艺人名称" v-model="dialogArtListReq.artistName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchArt"></el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reSearch"></el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dialogArtListLoading"
        v-tabelLoadmore="tableLoadMore"
        :data="dialogArtList"
        border
        style="width: 100%"
        height="300"
        @selection-change="handleSelectionChange"
        empty-text="暂无数据" >
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="date" label="艺人编码" prop="artistCode"></el-table-column>
        <el-table-column property="name" label="艺人名称" prop="artistName"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogArtListChose = false" size="mini">取消</el-button>
        <el-button type="primary" size="mini" @click="addArtList">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'audio-edit',
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      vipData: [{'name': '免费', 'value': 1}, {'name': '收费', 'value': 0}],
      url: {
        audioDetail : '/cms/api/audio/details.do',
        delArt      : '/cms/api/artist/delRelevanceArtist.do',
        getArtList  : '/cms/api/artist/chooseArtist.do',
        addArtList  : '/cms/api/artist/addRelevanceArtist.do',
        renewArtList: '/cms/api/artist/getRelevanceList.do',
        save        : '/cms/api/audio/updateAudioInfo.do',
        getAudioPlayUrl : '/cms/api/audio/getAudioPlayUrl.do',
      },
      artArea: this.$root.staticData.artArea,
      artType: this.$root.staticData.artType,
      tableData: [],
      dialogArtList: [],
      multipleTable: [],
      audioData: {},
      pageload: true,
      artListLoad: false,
      centerDialogVisible: false,
      dialogArtListChose: false,
      dialogArtListLoading: true,
      listLoad: true,
      dialogArtListReq: {
        artistCode: '',
        artistName: '',
        currPage: 0,
        pageSize: 20
      },
      dropIndex: -1,
      audio_code: '',
      previewUrl: '',
    }
  },
  directives: {
    tabelLoadmore: {
      // 指令的定义
      bind(el, binding) {
        let that = this;
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');

        SELECTWRAP_DOM.addEventListener('scroll', function() {
          let sign = 0;
          const CONDITION = ((this.scrollHeight - this.scrollTop - 10 <= this.clientHeight) && this.scrollTop > sign)

          if(CONDITION) {
            binding.value();
          }else {
            return false;
          }
        });
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path == '/audio/edit') {
        if (location.hash.split("=")[1] == sessionStorage.getItem("code")) {
          return
        }else {
          this.getDetail();
        }
        //this.getDetail();
      }else {
        return false;
      }
    }
  },
  activated () {
    this.getDetail();
    this.getAudioPlayUrl();
  },
  methods: {
    dealArea (areaCode) {
      let that = this;
      let result = 'can not found';
      that.artArea.forEach(area => {
        if(areaCode == area.type) {
          result = area.name;
        }
      });
      return result;
    },
    dealType (artistType) {
      let that = this;
      let result = 'can not found';
      that.artType.forEach(type => {
        if(artistType == type.type) {
          result = type.name;
        }
      });
      return result;
    },
    save () {
      let that = this;
      let save_content = {
        audioCode:'',
        audioName:'',
        foreignName:'',
        language:'',
        publishArea:'',
        lyricist:'',
        composer:'',
        producer:'',
        directorMV:'',
        albumName:'',
        publishTime:'',
        redordCompany:'',
        arranger: '',
        des: '',
        upperCase: '',
        vip: '',
      };
      for (let i in save_content) {
        save_content[i] = this.audioData[i];
      }
      let params = {jsonParam: JSON.stringify(save_content)};
      this.$store.commit('_routerAudioChange', 'audio');
      this.pageload = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.save,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if(res.data.success) {
      //     that.actDone();
      //     that.getDetail();
      //   }else {
      //     that.$message({
      //       message: res.data.msg,
      //       type: 'warning'
      //     })
      //   }
      //   setTimeout(() => {
      //     that.pageload = false;
      //   }, 500);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.save,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if(res.data.success) {
            that.actDone();
            that.getDetail();
          }else {
            that.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
          setTimeout(() => {
            that.pageload = false;
          }, 500);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    addArtList () {
      if (this.multipleTable.length <= 0) {
        this.$message({
          message: '没有选中任何选项',
          type: 'warning'
        })
        return;
      }
      let that = this;
      let obj = {
        artistCode: '',
        resCode: ''
      };
      that.multipleTable.forEach((item, index) => {
        if(index == 0) {
          obj.artistCode += item.artistCode;
        }else {
          obj.artistCode += ',' + String(item.artistCode);
        }
      });
      obj.resCode = this.audio_code;

      let params = {jsonParam: JSON.stringify(obj)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.addArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   that.actDone();
      //   that.dialogArtListChose = false;
      //   that.renewArtList();
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.addArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.renewArtList();
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            });
          }
          that.dialogArtListChose = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    renewArtList () {
      let that = this;
      let param = {resCode: this.audio_code};
      let params = {jsonParam: JSON.stringify(param)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.renewArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   that.audioData.artistList = res.data.data;
      //   this.audioData.artistList.forEach(item => {
      //     item.areaText = that.dealArea(item.artistArea);
      //     item.typeText = that.dealType(item.artistType);
      //   });
      //   console.log(res.data);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.renewArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.audioData.artistList = res.data.data;
          that.audioData.artistList.forEach(item => {
            item.areaText = that.dealArea(item.artistArea);
            item.typeText = that.dealType(item.artistType);
          });
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    reSearch () {
      let that = this;
      for (let i in that.dialogArtListReq) {
        if (i == 'currPage') {
          that.dialogArtListReq[i] = 0;
        }else if (i == 'pageSize') {

        }else {
          that.dialogArtListReq[i] = '';
        }
      }
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};
      that.dialogArtListLoading = true;
      that.$el.querySelector('#dialog-wrap .el-table__body-wrapper').scrollTop = 0;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   that.dialogArtList = res.data.data;
      //   that.dialogArtListReq.currPage += 1;
      //   that.dialogArtListLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.dialogArtList = res.data.data;
          that.dialogArtListReq.currPage += 1;
          that.dialogArtListLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    searchArt () {
      let that = this;
      that.dialogArtListReq.currPage = 0;
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};

      if(that.dialogArtListLoading) {
        return;
      }
      that.dialogArtListLoading = true;
      that.$el.querySelector('#dialog-wrap .el-table__body-wrapper').scrollTop = 0;

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.dialogArtList = res.data.data;
      //   this.dialogArtListReq.currPage += 1;
      //   that.dialogArtListLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.dialogArtList = res.data.data;
          that.dialogArtListReq.currPage += 1;
          that.dialogArtListLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    tableLoadMore () {
      let that = this;
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};

      if (that.dialogArtListLoading || !that.listLoad) {
        return;
      }
      that.dialogArtListLoading = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   res.data.data.forEach(item => {
      //     this.dialogArtList.push(item);
      //   });
      //   if(res.data.data.length < 20) {
      //     that.listLoad = false;
      //   }
      //   this.dialogArtListReq.currPage += 1;
      //   that.dialogArtListLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          res.data.data.forEach(item => {
            that.dialogArtList.push(item);
          });
          if(res.data.data.length < 20) {
            that.listLoad = false;
          }
          that.dialogArtListReq.currPage += 1;
          that.dialogArtListLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    openArtList() {
      this.dialogArtListChose = true;
      let that = this;
      for (let i in that.dialogArtListReq) {
        if (i == 'currPage') {
          that.dialogArtListReq[i] = 0;
        }else if (i == 'pageSize') {

        }else {
          that.dialogArtListReq[i] = '';
        }
      }
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};
      this.$store.commit('_routerAudioChange', 'audio');
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.dialogArtList = res.data.data;
      //   this.dialogArtListReq.currPage += 1;
      //   that.dialogArtListLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.dialogArtList = res.data.data;
          that.dialogArtListReq.currPage += 1;
          that.dialogArtListLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    actDone() {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
    },
    dropRequest () {
      let that = this;
      let sid = this.audioData.artistList[this.dropIndex].sid;
      let param = {sid: sid};
      let params = {jsonParam: JSON.stringify(param)};
      this.$store.commit('_routerAudioChange', 'audio');
      this.artListLoad = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.delArt,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.audioData.artistList.splice(this.dropIndex, 1);
      //   that.actDone();
      //   this.dropIndex = -1;
      //   this.artListLoad = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.delArt,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          // that.audioData.artistList.splice(this.dropIndex, 1);
          // that.actDone();
          that.renewArtList();
          that.$message({
            message: res.data.msg,
            type: res.data.success === 'true' ? 'success' : 'warning'
          });
          that.dropIndex = -1;
          that.artListLoad = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    dropArt (obj) {
      if(typeof(obj) == 'object') {
        this.dropIndex = obj.$index;
        this.centerDialogVisible = true;
      }else if (obj == 'sure') {
        //this.audioData.artistList.splice(this.dropIndex, 1);
        this.dropRequest();
        this.centerDialogVisible = false;
      }else {
        this.centerDialogVisible = false;
        this.dropIndex = -1;
      }
    },
    getDetail () {
      let code = location.hash.split("=")[1];
      if (code) {
        sessionStorage.setItem("code", code);
        this.audio_code = code;
      }else {
        this.audio_code = sessionStorage.getItem("code");
      }
      let url = this.audio_code;
      let parm = {audioCode: url}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.audioDetail,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.audioData = res.data.data;
      //   this.audioData.artistList.forEach(item => {
      //     item.areaText = that.dealArea(item.artistArea);
      //     item.typeText = that.dealType(item.artistType);
      //   });
      //   this.pageload = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.audioDetail,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.audioData = res.data.data;
          that.audioData.artistList.forEach(item => {
            item.areaText = that.dealArea(item.artistArea);
            item.typeText = that.dealType(item.artistType);
          });
          that.pageload = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getAudioPlayUrl () {
      let code = location.hash.split("=")[1];
      if (code) {
        sessionStorage.setItem("code", code);
        this.audio_code = code;
      } else {
        this.audio_code = sessionStorage.getItem("code");
      }
      let url = this.audio_code;
      let parm = {audioCode: url}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getAudioPlayUrl,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   console.log(res)
      //   this.previewUrl = res.data.data.url;
      //   console.log(this.previewUrl)
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getAudioPlayUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.previewUrl = res.data.data.url;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    handleSelectionChange (val) {
      let that = this;
      that.multipleTable = val;
    },
  }
}
</script>

<style scoped>
  .audio-edit {
    margin: 0 20px;
    padding: 0 0 70px 0px;
  }
  .section-title {
    font-size: 18px;
    color: #000;
    background: #f7f7f7;
    height: 48px;
    line-height: 48px;
    text-indent: 18px;
  }
  .el-button {
    margin-left: 12px;
  }
  .foot {
    padding: 20px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-top: 1px solid #eee;
    background: #fff;
  }
  .preView {
    color: #20a8d8;
    font-size: 16px;
    text-decoration: none;
  }
</style>
