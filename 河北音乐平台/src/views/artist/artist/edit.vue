<template>
  <div class="vedio-edit" v-loading="pageload">
    <div style="margin-bottom: 10px;font-weight: bold;">
      <span>艺人列表&nbsp;&nbsp;>&nbsp;&nbsp;管理</span>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="6" :lg="4" :xl="4">
        <div class="vedioImg">
          <img :src="img_pre + artistData.artistImage">
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="18" :lg="20" :xl="20">
        <el-col :span="24"><h1>{{artistData.artistName || ''}}</h1></el-col>
        <el-col :spam="24">
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="6">
            <p>艺人编码：{{artistData.artistCode || ''}}</p>
            <p>更新时间：{{artistData.lastTime}}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <p> 资源数目：音频：<a @click="sendParams( 'audio',artistData.artistCode)"><span style="color: #00abff"> {{artistData.audioCount}}</span></a><br/></p>
            <p style="margin-left: 80px">视频：<a @click="sendParams( 'video',artistData.artistCode)"><span style="color: #00abff"> {{artistData.videoCount}}</span></a></p>
          </el-col>
          </el-col>
          <!--<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">-->
            <!--<p>更新时间：{{artistData.lastTime}}</p>-->
          <!--</el-col>-->
      </el-col>
    </el-row>
    <el-row>
      <p class="section-title">基础信息</p>
      <el-form label-position="left" label-width="120px">
        <el-form-item label="艺人流派">
          <el-select v-model="artistData.sectCode" placeholder="请选择" style="width: 100%;">
            <el-option v-for=" (item, index) in sectData" :key="index" :label="item.sectName" :value="item.sectCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="艺人名称">
          <el-input placeholder="艺人名称" v-model="artistData.artistName" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="艺人名称首字母">
          <el-input placeholder="艺人名称首字母" v-model="artistData.upperCase"></el-input>
        </el-form-item>
        <el-form-item label="艺人类型">
          <el-select v-model="artistData.artistType" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in artType" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="艺人状态">
          <el-select v-model="artistData.iStatus" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in iStatusData" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区">
          <el-select v-model="artistData.artistArea" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in artArea" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" v-loading="picLoading">
          <ul class="imgList">
            <li v-for="(item, index) in artistData.images" :class="{'default': item.displayType == 1}" @click="bigPic(item.image)">
              <img :src="img_pre + item.image">
              <div class="imgTool" v-if="item.displayType != 1">
                <el-tooltip content="设为默认" placement="top">
                  <el-button icon="el-icon-star-on" circle size="mini" @click.stop.prevent="setDefault(item.imgCode)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button icon="el-icon-delete" circle size="mini" type="danger" @click.stop.prevent="delPic(item.imgCode)"></el-button>
                </el-tooltip>
              </div>
              <i class="el-icon-circle-check-outline" v-if="item.displayType == 1"></i>
            </li>
            <li style="padding: 0; border: 0;">
              <el-upload
                action="/cms/api/artist/uploadArtistImg.do"
                list-type="picture-card"
                :auto-upload="true"
                :data = "artistPicData"
                :on-change = "artistUpload"
                :show-file-list="false"
                :on-success="pictureSuccess"
                :on-progress="sedding"
                :on-error="error">
                <i class="el-icon-plus"></i>
              </el-upload>
            </li>
          </ul>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <p class="section-title">其他信息</p>
      <el-form :inline="true" label-position="left" label-width="100px" class="demo-form-inline">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="外文名">
          <el-input  placeholder="外文名" v-model="artistData.foreignName"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="别名">
          <el-input  placeholder="别名" v-model="artistData.alias"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item
            label="出生日期">
            <el-date-picker
              type="datetime"
              :editable="false"
              v-model="artistData.birthday"
              placeholder="出生日期"
              value-format="yyyy-MM-dd"
              style="width: 202px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="民族">
          <el-input  placeholder="民族" v-model="artistData.nation"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="职业">
          <el-input  placeholder="职业" v-model="artistData.occupation"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
          <el-form-item label="国籍">
            <el-input  placeholder="国籍" v-model="artistData.country"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="出生地">
          <el-input  placeholder="出生地" v-model="artistData.birthArea"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="星座">
          <el-input  placeholder="星座" v-model="artistData.starSign"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
        <el-form-item label="生肖">
          <el-input  placeholder="生肖" v-model="artistData.animalSign"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="毕业院校">
          <el-input  placeholder="毕业院校" v-model="artistData.graduateUnvers"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="经纪公司">
          <el-input  placeholder="经纪公司" v-model="artistData.ibec"></el-input>
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
        <el-form-item label="代表作">
          <el-input style="width: 202px" type="textarea" :autosize="{ minRows: 2}" placeholder="代表作" v-model="artistData.representative"></el-input>
          <!--<el-input type="textarea" :autosize="{ minRows: 2}" placeholder="代表作" v-model="artistData.ibec"></el-input>-->
        </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
        <el-form-item label="描述">
          <el-input style="width: 202px" type="textarea" :autosize="{ minRows: 2}" placeholder="描述" v-model="artistData.des"></el-input>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="foot">
      <el-tooltip class="item" effect="dark" content="点击保存" placement="top">
        <el-button type="primary" icon="el-icon-check" circle size="mini" @click="save"></el-button>
      </el-tooltip>
    </div>
    <!--删除提示-->
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

    <el-dialog
      title="提示"
      :visible.sync="dialogSetDefaultImg"
      width="30%"
      center>
      <span>设置为默认图片?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDefault('cancle')">取 消</el-button>
        <el-button type="primary" @click="setDefault('sure', $event)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogDelPic"
      width="30%"
      center>
      <span>该删除操作不可撤销，确认删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delPic('cancle')">取 消</el-button>
        <el-button type="primary" @click="delPic('sure')">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看大图-->
    <el-dialog
      title="图画展示"
      :visible.sync="dialogBigPic"
      :show-close="false"
      @close="closeBigPic"
      width="60%"
      center>
      <div style="text-align: center;width: 100%;">
        <img :src="img_pre + bigPicSrc" style="width: 80%;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import globalData from '@/assets/global/global'

export default {
  name: 'artist-edit',
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url: {
        // img_pre     : 'http://60.205.178.172/HD/',
        // img_pre     : 'http://192.168.1.96:25603/HD/',
        // videoDetail : '/api/video/details.do',
        artistDetail : '/cms/api/artist/detArtist.do',
        save        : '/cms/api/artist/updateArtistInfo.do',
        // getImgList  : '/cms/api/artist/getImageList.do',
        getImgList  : '/cms/api/artist/getListImgById.do',
        setDefault  : '/cms/api/artist/updateImageDisplay.do',
        delpic  : '/cms/api/artist/delArtistImage.do',
        getAllSectList  : '/cms/api/artist/getAllSectList.do',
      },
      artistPicData: {
        file: "",
        artistCode: "",
      },
      img_pre: this.$root.staticData.imgApi,
      artArea: this.$root.staticData.artArea,
      artType: this.$root.staticData.artType,
      iStatusData: [{type: '', name: '请选择'}, {type: 0, name: '下线'}, {type: 1, name: '上线'}],
      tableData: [],
      dialogArtList: [],
      multipleTable: [],
      sectData: [],
      artistData: {},
      pageload: true,
      previewUrl: '',
      artListLoad: false,
      centerDialogVisible: false,
      dialogArtListChose: false,
      dialogArtListLoading: true,
      dialogSetDefaultImg: false,
      dialogSetDefaultImgCode: '',
      bigPicSrc: '',
      dialogBigPic: false,
      dialogDelPic: false,
      picLoading: false,
      dialogArtListReq: {
        artistCode: '',
        artistName: '',
        currPage: 0,
        pageSize: 20
      },
      dropIndex: -1,
      artist_code: '',
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
          const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) && this.scrollTop > sign)

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
      if (to.path == '/artist/edit') {
        this.getDetail();
        this.getSectList();
      } else {
        return false;
      }
    }
  },
  mounted () {
    this.getDetail();
    this.getSectList();
  },
  methods: {
    artistUpload (file, fileList) {
      this.artistPicData.file = file.name;
      this.artistPicData.artistCode = this.artistData.artistCode;
    },
    sendParams (type, id) {
      this.$store.commit('_routerAudioChange', type);
      if (type === 'audio') {
        this.$router.push({ path: '/audio', query: {artistCode: id} });
      } else if (type === 'video') {
        this.$router.push({ path: '/video', query: {artistCode: id} });
      }
    },
    error (err, file, fileList) {
      this.$message({
        message: '上传出错，请稍后重试',
        type: 'warning'
      });
      setTimeout(() => {
        that.picLoading = false;
      }, 500);
    },
    sedding (event, file, fileList) {
      this.picLoading = true;
    },
    pictureSuccess (response, file, fileList) {
      let that = this;
      if(response.success == true) {
        that.getImgList();
        that.$message({
          message: response.msg,
          type: 'success'
        })
      }else {
        that.$message({
          message: response.msg,
          type: 'warning'
        })
      }
      setTimeout(() => {
        that.picLoading = false;
      }, 500);
    },
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
        artistCode:'',
        artistName:'',
        artistType:'',
        iStatus:'',
        artistArea:'',
        foreignName:'',
        publishArea:'',
        alias:'',
        nation:'',
        country:'',
        starSign:'',
        animalSign:'',
        birthArea:'',
        birthday:'',
        occupation:'',
        graduateUnvers: '',
        ibec: '',
        representative: '',
        recordCompany: '',
        des: '',
        upperCase: '',
        sectCode: '',
      };
      for (let i in save_content) {
        save_content[i] = this.artistData[i];
      }
      let params = {jsonParam: JSON.stringify(save_content)};
      this.pageload = true;
      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.save,
        method:'post',
        data: this.Qs.stringify(params)
      }).then(res => {
        if (res.data.success) {
          that.actDone();
          that.getDetail();
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
        setTimeout(() => {
          that.pageload = false;
        }, 500);
      }).catch(err=>{
        console.log(err);
      })
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
      obj.resCode = this.vedio_code;

      let params = {jsonParam: JSON.stringify(obj)};
      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.addArtList,
        method:'post',
        data: this.Qs.stringify(params)
      }).then(res => {
        that.actDone();
        that.dialogArtListChose = false;
        that.renewArtList();
      }).catch(err=>{
        console.log(err);
      })
    },
    renewArtList () {
      let that = this;
      let param = {resCode: this.vedio_code};
      let params = {jsonParam: JSON.stringify(param)};
      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.renewArtList,
        method:'post',
        data: this.Qs.stringify(params)
      }).then(res => {
        that.artistData.artistList = res.data.data;
        this.artistData.artistList.forEach(item => {
          item.areaText = that.dealArea(item.artistArea);
          item.typeText = that.dealType(item.artistType);
        });
      }).catch(err=>{
        console.log(err);
      })
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
      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.getArtList,
        method:'post',
        data: this.Qs.stringify(params)
      }).then(res => {
        this.dialogArtList = res.data.data;
        this.dialogArtListReq.currPage += 1;
        that.dialogArtListLoading = false;
      }).catch(err=>{
        console.log(err);
      })
    },
    searchArt () {
      let that = this;
      that.dialogArtListReq.currPage = 0;
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};

      if(that.dialogArtListLoading) {
        return;
      }
      that.dialogArtListLoading = true;

      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.getArtList,
        method:'post',
        data: this.Qs.stringify(params)
      }).then(res => {
        this.dialogArtList = res.data.data;
        this.dialogArtListReq.currPage += 1;
        that.dialogArtListLoading = false;
      }).catch(err=>{
        console.log(err);
      })
    },
    tableLoadMore () {
      let that = this;
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};

      if (that.dialogArtListLoading) {
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
          this.dialogArtListReq.currPage += 1;
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
      let sid = this.artistData.artistList[this.dropIndex].sid;
      let param = {sid: sid};
      let params = {jsonParam: JSON.stringify(param)};

      this.artListLoad = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.delArt,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.artistData.artistList.splice(this.dropIndex, 1);
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
          that.artistData.artistList.splice(this.dropIndex, 1);
          that.actDone();
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
        //this.vedioData.artistList.splice(this.dropIndex, 1);
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
        sessionStorage.setItem("artistCode", code);
        this.artist_code = code;
      }else {
        this.artist_code = sessionStorage.getItem("artistCode");
      }
      let url = this.artist_code;
      let parm = {artistCode: url}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.artistDetail,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   that.artistData = res.data.data;
      //   // this.artistData.artistList.forEach(item => {
      //   //   item.areaText = that.dealArea(item.artistArea);
      //   //   item.typeText = that.dealType(item.artistType);
      //   // });
      //   that.pageload = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.artistDetail,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.artistData = res.data.data;
          // this.artistData.artistList.forEach(item => {
          //   item.areaText = that.dealArea(item.artistArea);
          //   item.typeText = that.dealType(item.artistType);
          // });
          that.pageload = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getSectList () {
      let that = this;
      let parm = {};
      let params = {jsonParam: JSON.stringify(parm)};
      that.$ajax({
        url: that.url.getAllSectList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.sectData = res.data.data.sectList;
          } else {
            that.sectData = []
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    bigPic (data) {
      let that = this;
      that.dialogBigPic = true;
      that.bigPicSrc = data;
    },
    closeBigPic () {
      this.bigPicSrc = '';
    },
    setDefault (imageCode, event) {
      // window.event  ? window.event.cancelBubble = true  : event.stopPropagation();
      let that = this;
      let artistCode = this.artist_code.length > 0 ? this.artist_code : sessionStorage.getItem("artistCode")
      let params = {jsonParam: JSON.stringify({artistCode: artistCode, imageCode: that.dialogSetDefaultImgCode})};

      if (imageCode == 'sure' ) {
        //that.dialogSetDefaultImg = true;
      }else if(imageCode == 'cancle') {
        that.dialogSetDefaultImgCode = '';
        that.dialogSetDefaultImg = false;
        return;
      }else {
        that.dialogSetDefaultImg = true;
        that.dialogSetDefaultImgCode = imageCode;
        return;
      }
      that.picLoading = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.setDefault,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   if(res.data.success) {
      //     that.dialogSetDefaultImg = false;
      //     that.getDetail();
      //   }else {
      //     that.$message({
      //       message: res.data.msg,
      //       type: 'warning'
      //     })
      //   }
      //   that.$store.commit('_routerAudioChange', 'video');
      //   that.dialogDelPic = false;
      //   setTimeout(() => {
      //     that.picLoading = false;
      //   }, 500);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.setDefault,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if(res.data.success) {
            that.dialogSetDefaultImg = false;
            that.getDetail();
          }else {
            that.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
          that.$store.commit('_routerAudioChange', 'video');
          that.dialogDelPic = false;
          setTimeout(() => {
            that.picLoading = false;
          }, 500);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getImgList () {
      let that = this;
      let artistCode = this.artist_code.length > 0 ? this.artist_code : sessionStorage.getItem("artistCode")
      let params = {jsonParam: JSON.stringify({artistCode: artistCode})};

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getImgList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   console.log(res)
      //   if(res.data.success) {
      //     that.artistData.images = res.data.data.images;
      //   }else {
      //     that.$message({
      //       message: res.data.msg,
      //       type: 'warning'
      //     })
      //   }
      //   that.dialogDelPic = false;
      //   setTimeout(() => {
      //     that.picLoading = false;
      //   }, 500);
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getImgList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if(res.data.success) {
            that.artistData.images = res.data.data.images;
          }else {
            that.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
          that.dialogDelPic = false;
          setTimeout(() => {
            that.picLoading = false;
          }, 500);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    delPic (code) {
      //delPicCode
      let that = this;
      // window.event  ? window.event.cancelBubble = true  : event.stopPropagation();
      if (code == 'sure') {
        let params = {jsonParam: JSON.stringify({imageCode: that.delPicCode})};
        that.picLoading = true;
        // this.axios({
        //   headers: {
        //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        //   },
        //   url: that.url.delpic,
        //   method:'post',
        //   data: this.Qs.stringify(params)
        // }).then(res => {
        //   if(res.data.success) {
        //     that.actDone();
        //   }else {
        //     that.$message({
        //       message: res.data.msg,
        //       type: 'warning'
        //     })
        //   }
        //   that.dialogDelPic = false;
        //   that.getImgList();
        //   setTimeout(() => {
        //     that.picLoading = false;
        //   }, 500);
        // }).catch(err=>{
        //   console.log(err);
        // })

        that.$ajax({
          url: that.url.delpic,
          method: "post",
          data: this.Qs.stringify(params),
          success: function (res) {
            if(res.data.success) {
              that.actDone();
            }else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
            that.dialogDelPic = false;
            that.getImgList();
            setTimeout(() => {
              that.picLoading = false;
            }, 500);
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      }else if (code == 'cancle') {
        that.dialogDelPic = false;
        that.delPicCode = '';
      }else {
        that.dialogDelPic = true;
        that.delPicCode = code;
      }
    },
    handleSelectionChange (val) {
      let that = this;
      that.multipleTable = val;
    },
  }
}
</script>

<style scoped>
  .video-edit {
    margin: 0 20px;
    padding: 0 0 20px 0px;
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
    padding: 40px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-top: 1px solid #eee;
    background: #fff;
  }
  .vedioImg {
    margin: 18px 0 0 0;
    width: 100%;
    height: 100px;
    max-width: 180px;
    overflow: hidden;
  }
  .vedioImg img {
    width: 100%;
    height: 100%;
  }
  h1 {
    margin: 12px 0;
    padding: 0;
  }
  .preView {
    color: #20a8d8;
    font-size: 14px;
    text-decoration: underline;
  }
  .imgList {
    margin: 0;
    padding: 0;
  }
  .imgList li {
    position: relative;
    float: left;
    margin-left: 12px;
    width: 148px;
    height: 148px;
    padding: 8px;
    border: 1px dashed #c0ccda;
    border-radius: 5px;
    overflow: hidden;
  }
  .imgList li:first-child{
    margin: 0;
  }
  .imgList li img {
    width: 100%;
    height: 100%;
  }
  .imgTool {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background: rgba(0,0,0,0.3);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s;
  }
  .imgTool i {
    margin: 0 12px;
    cursor: pointer;
  }
  .imgList li:hover > .imgTool {
    opacity: 1;
    visibility: visible;
  }
  .default{
    border-color: rgb(64, 158, 255) !important;
    box-shadow: 0 0 8px #ccc;
  }
  .default > i {
    position: absolute;
    right: 8px;
    bottom: 8px;
    color: rgb(64, 158, 255) !important;
    font-size: 36px;
  }
</style>
