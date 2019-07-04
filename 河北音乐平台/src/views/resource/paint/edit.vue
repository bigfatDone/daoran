<template>
  <div class="paint-edit" v-loading="pageload">
    <div style="margin-bottom: 10px;font-weight: bold;">
      <span>手绘本列表&nbsp;&nbsp;>&nbsp;&nbsp;管理</span>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="6" :lg="4" :xl="4">
        <div class="paintImg">
          <img :src="url.img_pre + paintData.paintImage">
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="18" :lg="20" :xl="20">
        <el-col :span="24"><h1>{{paintData.paintName || ''}}</h1></el-col>
        <el-col :spam="24">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <p>资源编码：{{paintData.paintCode || ''}}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <p>时长：{{paintData.allTime}}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <p>更新时间：{{paintData.lastTime}}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <p>CP商：{{paintData.cpId}}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <p>分辨率：{{paintData.resolution || '未知'}}</p>
          </el-col>
          <!--<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">-->
            <!--<p v-if="previewUrl != ''"><a target="_blank" :href="previewUrl" class="preView">预览播放</a></p>-->
            <!--<p v-else><span style="color: #ccc;">预览播放</span></p>-->
          <!--</el-col>-->
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
          <input type="radio" name="eleAttr" v-model="paintData.vip" :value="item.value" /> {{item.name}}
        </label>
      </el-form>
    </el-row>
    <el-row>
      <p class="section-title">基础信息</p>
      <el-form label-position="left" label-width="120px">
        <el-form-item label="资源名称">
          <el-input placeholder="资源名称" v-model="paintData.paintName"></el-input>
        </el-form-item>
        <el-form-item label="资源名称首字母">
          <el-input placeholder="资源名称首字母" v-model="paintData.upperCase"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" placeholder="描述" v-model="paintData.des"></el-input>
        </el-form-item>
        <el-form-item label="图片" v-loading="picLoading">
          <ul class="imgList">
            <li v-for="(item, index) in paintData.images" :class="{'default': item.displayType == 1}" @click="bigPic(item.image)">
              <img :src="url.img_pre + item.image">
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
                action="/cms/api/paint/uploadPaintImg.do"
                list-type="picture-card"
                :auto-upload="true"
                :data = "paintPicData"
                :on-change = "paintUpload"
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
      <el-col :span='24'>
      <p class="section-title">
        艺人信息<el-button type="primary" icon="el-icon-plus" circle size="mini" @click="openArtList" style="position: relative;top: -2px;"></el-button>
      </p>
      <el-table
        :data="paintData.relevanceList"
        border
        max-height="300"
        fit
        style="min-width: 100%"
        empty-text="暂无数据"
        v-loading="artListLoad">
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
                <el-input  placeholder="别名(英文名)" v-model="paintData.foreignName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="制作人">
                <el-input  placeholder="制作人" v-model="paintData.producer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
              <el-form-item label="发行时间">
                <el-date-picker
                  :editable="false"
                  type="datetime"
                  v-model="paintData.publishTime"
                  placeholder="发行时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 202px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="语种">
                <el-input  placeholder="语种" v-model="paintData.language"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="MV导演">
                <el-input  placeholder="MV导演" v-model="paintData.directorMV"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
              <el-form-item label="发行地区">
                <el-input  placeholder="发行地区" v-model="paintData.publishArea"></el-input>
              </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="作词">
                <el-input  placeholder="作词" v-model="paintData.lyricist"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="专辑">
                <el-input  placeholder="专辑" v-model="paintData.albumName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="12">
              <el-form-item label="唱片公司">
                <el-input  placeholder="唱片公司" v-model="paintData.redordCompany"></el-input>
              </el-form-item>
            </el-col>


            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="作曲">
                <el-input  placeholder="作曲" v-model="paintData.composer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-form-item label="编曲">
                <el-input  placeholder="编曲" v-model="paintData.arranger"></el-input>
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
    <el-dialog
      title="提示"
      :visible.sync="dialogSetDefaultImg"
      width="30%"
      center>
      <span>设置为默认图片?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDefault('cancle')">取 消</el-button>
        <el-button type="primary" @click="setDefault('sure')">确 定</el-button>
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
    <!--查看大图-->
    <el-dialog
      title="图画展示"
      :visible.sync="dialogBigPic"
      :show-close="false"
      @close="closeBigPic"
      width="60%"
      center>
      <div style="text-align: center;width: 100%;">
        <img :src="url.img_pre + bigPicSrc" style="width: 80%;">
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'paint-edit',
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      vipData: [{'name': '免费', 'value': 1}, {'name': '收费', 'value': 0}],
      url: {
        img_pre: this.$root.staticData.imgApi,
        // img_pre     : 'http://192.168.1.96:25603/HD/',
        paintDetail : '/cms/api/paint/detPaint.do',
        delArt      : '/cms/api/artist/delRelevanceArtist.do',
        getArtList  : '/cms/api/artist/chooseArtist.do',
        addArtList  : '/cms/api/artist/addRelevanceArtist.do',
        renewArtList: '/cms/api/artist/getRelevanceList.do',
        save        : '/cms/api/paint/updatePaintInfo.do',
        delpic      : '/cms/api/paint/delPaintImage.do',
        renewImgList: '/cms/api/paint/getPaintImageList.do',
        setDefault  : '/cms/api/paint/updateImageDisplay.do',
        getPaintPlayUrl  : '/cms/api/paint/getPaintPlayUrl.do',
      },
      paintPicData: {
        file: '',
        paintCode: ''
      },
      artArea: this.$root.staticData.artArea,
      artType: this.$root.staticData.artType,
      tableData: [],
      dialogArtList: [],
      multipleTable: [],
      paintData: {},
      pageload: true,
      previewUrl: '',
      artListLoad: false,
      centerDialogVisible: false,
      dialogArtListChose: false,
      dialogArtListLoading: true,
      dialogSetDefaultImg: false,
      dialogSetDefaultImgCode: '',
      listLoad: true,
      bigPicSrc: '',
      dialogBigPic: false,
      dialogDelPic: false,
      delPicCode: '',
      picLoading: false,
      dialogArtListReq: {
        artistCode: '',
        artistName: '',
        currPage: 0,
        pageSize: 20
      },
      dropIndex: -1,
      paint_code: '',
      dialogImageUrl: '',
      dialogVisible: false,
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
      if (to.path == '/paint/edit') {
        //this.getDetail();
        if (location.hash.split("=")[1] == sessionStorage.getItem("paintCode")) {
          return
        }else {
          this.getDetail();
        }
      }else {
        return false;
      }
    }
  },
  activated () {
    this.getDetail();
    this.getPaintPlayUrl();
  },
  methods: {
    paintUpload ( file, fileList) {
      this.paintPicData.file = file.name;
      this.paintPicData.paintCode = this.paintData.paintCode;
    },
    handleDialogImportIn(file, fileList){
      this.fileName = file.name;
      this.excelParam.file = file.name;
      this.excelParam.nodeCode = this.req.list.nodeCode;
    },
    bigPic (data) {
      let that = this;
      that.dialogBigPic = true;
      that.bigPicSrc = data;
    },
    closeBigPic () {
      this.bigPicSrc = '';
    },
    setDefault (imageCode) {
      // window.event  ? window.event.cancelBubble = true  : event.stopPropagation();
      let that = this;
      let paintCode = this.paint_code.length > 0 ? this.paint_code : sessionStorage.getItem("paintCode");
      let params = {jsonParam: JSON.stringify({paintCode: paintCode, imageCode: that.dialogSetDefaultImgCode})};

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
      //     headers: {
      //       'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //     },
      //     url: that.url.setDefault,
      //     method:'post',
      //     data: this.Qs.stringify(params)
      //   }).then(res => {
      //     if(res.data.success) {
      //       that.dialogSetDefaultImg = false;
      //       that.$store.commit('_routerAudioChange', 'paint');
      //       that.getDetail();
      //     }else {
      //       that.$message({
      //         message: res.data.msg,
      //         type: 'warning'
      //       })
      //     }
      //     that.dialogDelPic = false;
      //     setTimeout(() => {
      //       that.picLoading = false;
      //     }, 500);
      //   }).catch(err=>{
      //     console.log(err);
      //   })

      that.$ajax({
        url: that.url.setDefault,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if(res.data.success) {
            that.dialogSetDefaultImg = false;
            that.$store.commit('_routerAudioChange', 'paint');
            that.getDetail();
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
    getImgList () {
      let that = this;
      let paintCode = this.paint_code.length > 0 ? this.paint_code : sessionStorage.getItem("paintCode")
      let params = {jsonParam: JSON.stringify({paintCode: paintCode})};

      // this.axios({
      //     headers: {
      //       'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //     },
      //     url: that.url.renewImgList,
      //     method:'post',
      //     data: this.Qs.stringify(params)
      //   }).then(res => {
      //     if(res.data.success) {
      //       that.paintData.images = res.data.data.imageList;
      //     }else {
      //       that.$message({
      //         message: res.data.msg,
      //         type: 'warning'
      //       })
      //     }
      //     that.dialogDelPic = false;
      //     setTimeout(() => {
      //       that.picLoading = false;
      //     }, 500);
      //   }).catch(err=>{
      //     console.log(err);
      //   })

      that.$ajax({
        url: that.url.renewImgList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.paintData.images = res.data.data.imageList;
          } else {
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
      // window.event  ? window.event.cancelBubble = true  : event.stopPropagation();
      let that = this;
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
            if (res.data.success) {
              that.actDone();
            } else {
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
    error (err, file, fileList) {
      let that = this;
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
        paintCode:'',
        paintName:'',
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
        save: '',
      };
      for (let i in save_content) {
        save_content[i] = this.paintData[i];
      }
      let params = {jsonParam: JSON.stringify(save_content)};
      this.$store.commit('_routerAudioChange', 'paint');
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
      obj.resCode = this.paint_code;

      let params = {jsonParam: JSON.stringify(obj)};

      that.$ajax({
        url: that.url.addArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          console.log(res)
          if (res.data.success) {
            that.$message({
              message: res.data.msg,
              type: 'success'
            });
          } else {
            that.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
          that.dialogArtListChose = false;
          that.renewArtList();
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    renewArtList () {
      let that = this;
      let param = {resCode: this.paint_code};
      let params = {jsonParam: JSON.stringify(param)};
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.renewArtList,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   that.paintData.relevanceList = res.data.data;
      //   this.paintData.relevanceList.forEach(item => {
      //     item.areaText = that.dealArea(item.artistArea);
      //     item.typeText = that.dealType(item.artistType);
      //   });
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getArtList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.paintData.relevanceList = res.data.data;
          that.paintData.relevanceList.forEach(item => {
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
      console.log('ttt')
      let that = this;
      let params = {jsonParam: JSON.stringify(this.dialogArtListReq)};

      if (that.dialogArtListLoading || !that.listLoad) {
        that.dialogArtListLoading = false;
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
          console.log(res)
          res.data.data.forEach(item => {
            that.dialogArtList.push(item);
          });
          if (res.data.data.length < 20) {
            that.listLoad = false;
          }
          that.dialogArtListReq.currPage += 1;
          that.dialogArtListLoading = false;
          // that.dialogArtList = res.data.data;
          // that.dialogArtListReq.currPage += 1;
          // that.dialogArtListLoading = false;
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
      this.$store.commit('_routerAudioChange', 'paint');
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
    dropRequest () {
      let that = this;
      let sid = this.paintData.relevanceList[this.dropIndex].sid;
      let param = {sid: sid};
      let params = {jsonParam: JSON.stringify(param)};
      this.$store.commit('_routerAudioChange', 'paint');
      this.artListLoad = true;
      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.delArt,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.paintData.relevanceList.splice(this.dropIndex, 1);
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
          that.paintData.relevanceList.splice(this.dropIndex, 1);
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
        //this.paintData.relevanceList.splice(this.dropIndex, 1);
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
        sessionStorage.setItem("paintCode", code);
        this.paint_code = code;
      }else {
        this.paint_code = sessionStorage.getItem("paintCode");
      }
      let url = this.paint_code;
      let parm = {paintCode: url}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.paintDetail,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   this.paintData = res.data.data;
      //   this.paintData.relevanceList.forEach(item => {
      //     item.areaText = that.dealArea(item.artistArea);
      //     item.typeText = that.dealType(item.artistType);
      //   });
      //   this.pageload = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.paintDetail,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.paintData = res.data.data;
          that.paintData.relevanceList.forEach(item => {
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
    getPaintPlayUrl () {
      let code = location.hash.split("=")[1];
      if (code) {
        sessionStorage.setItem("paintCode", code);
        this.paint_code = code;
      }else {
        this.paint_code = sessionStorage.getItem("paintCode");
      }
      let url = this.paint_code;
      let parm = {paintCode: url}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      // this.axios({
      //   headers: {
      //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url.getPaintPlayUrl,
      //   method:'post',
      //   data: this.Qs.stringify(params)
      // }).then(res => {
      //   console.log(res)
      //   this.previewUrl = res.data.data.url;
      // }).catch(err=>{
      //   console.log(err);
      // })

      that.$ajax({
        url: that.url.getPaintPlayUrl,
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
  .paint-edit {
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
  .paintImg {
    margin: 18px 0 0 0;
    width: 100%;
    height: 100px;
    max-width: 180px;
    overflow: hidden;
  }
  .paintImg img {
    width: 100%;
    height: 100%;
  }
  h1 {
    margin: 12px 0;
    padding: 0;
  }
  .preView {
    color: #20a8d8;
    font-size: 16px;
    text-decoration: none;
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
