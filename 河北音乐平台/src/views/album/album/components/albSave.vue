<template>
  <div>
    <el-form
      v-loading="saveLoading"
      ref="reqList"
      label-width="128px"
      :model="reqList"
      :rules="rules"
      size="small">
      <el-form-item
        prop="albumName"
        label="专辑名称:">
        <div class="w400">
          <el-input v-model="reqList.albumName" placeholder="32个字符以内"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        prop="sect"
        label="流派:" >
        <div class="w400">
          <el-select v-model="reqList.sect" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in sectData"
              :key="item.sectCode"
              :label="item.sectName"
              :value="item.sectCode"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        prop="upperCase"
        label="专辑拼音首字母:">
        <div class="w400">
          <el-input v-model="reqList.upperCase" placeholder="32个字符以内"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        prop="publishTime"
        label="发行日期:">
        <div class="w400">
          <el-date-picker
            v-model="reqList.publishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item
        prop="albumCategory"
        label="专辑类型:">
        <div class="w400">
          <el-radio-group v-model="reqList.albumCategory">
            <el-radio  style="margin-top:20px" v-for="item in albumType" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item
        prop="resType"
        label="资源类型:">
        <div class="w400">
          <el-radio-group v-model="reqList.resType">
            <el-radio v-for="item in albumResType" :disabled="disable" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item
        prop="freeFlag"
        label="计费标识:">
        <div class="w400">
          <el-radio-group v-model="reqList.freeFlag">
            <el-radio v-for="item in freeFlagData" :key="item.type" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>


      <el-form-item
        label="专辑图片:">
        <div class="w400 showImg">
            <div class="img">
              <img class="imgHD" :src="imgSrcA ? imgSrcA :'static/imggq.jpg' "/>
              <input type="file" name="files" @change="upload($event, 'A')" />
              <p style="position:absolute;position: absolute;bottom: -61px;left: 75px;">
                <span>高清</span><br>
              </p>
            </div>
            <div class="img">
              <img class="imgSD" :src="imgSrcB ? imgSrcB :'static/imgbq.jpg'"/>
              <input type="file" name="files" @change="upload($event, 'B')" />
              <p style="position:absolute;position: absolute;bottom: -61px;left: 75px;">
                <span>标清</span><br>
              </p>
            </div>
        </div>
      </el-form-item>
      <el-form-item
        prop="albumDesc"
        label="专辑描述:">
        <div class="w400">
          <el-input v-model="reqList.albumDesc" type="textarea" placeholder="描述"></el-input>
        </div>
      </el-form-item>
      <el-form-item  class="text_right">
        <el-button type="primary" @click="ok('reqList')">提交</el-button>
        <el-button @click="close('can')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'albSave',
  props: {
    modalData: String,
  },
  mounted() {
    if (this.modalData !== '') {
      this.getDetial();
      this.reqList.albumCode = this.modalData;
      this.disable = true;
    } else {
      this.reqList.albumCategory = '0',
      this.reqList.resType = 1,
      this.reqList.freeFlag = 0
    };
    this.getSectList();
    this.newFile = new FormData();
  },
  data () {
    return {
      disable: false,
      imgApi: this.$root.staticData.imgApi,
      imgApiSD: this.$root.staticData.imgApiSD,
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      proList: [],
      AreaList: [],
      sectData: [],
      getProUrl: "/cms/api/area/getProList.do",
      getAreaUrl: "/cms/api/area/getCityList.do",
      detialUrl: "/cms/busi/album/getById.do",
      saveUrl: "/cms/busi/album/save.do",
      getAllSectList: '/cms/api/artist/getAllSectList.do',
      saveLoading: false,
      playpeDisab: false,
      reqList: {
        image:'',
        albumCode: '',
        albumName: '',
        sect: '',
        upperCase: '',
        publishTime: '',
        albumDesc: '',
        albumCategory: '',
        resType: '',
        freeFlag: '',
      },
      // albumType: [{type: 1, name: "音乐MV"}, {type: 2, name: "儿童歌曲"}, {type: 3, name: "儿童教育"}, {type: 4, name: "戏曲"}, {type: 5, name: "手绘本"}],
      albumType: [{type: '0',name: '其他'},{type: '1',name: '音乐MV'}, {type: '2',name: '儿童歌曲'},{type: '3',name: '儿童教育'},{type: '4',name: '戏曲'},{type: '5',name: '手绘本'}],
      albumResType: [{type: 1, name: "视频"}, {type: 2, name: "音频"}, {type: 3, name: "手绘本"}],
      freeFlagData: [{type: 0, name: "收费"}, {type: 1, name: "免费"}],
      rules: {
        albumCode: [
          { required: true, message: '不能为空', trigger: 'change' },
          { max: 32, message: '32个字符以内', trigger: 'change' }
        ],
        albumName: [
          { required: true, message: '不能为空', trigger: 'change' },
          { max: 32, message: '32个字符以内', trigger: 'change' }
        ],
        sect: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        upperCase: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 32, message: '32个字符以内', trigger: 'change' }
        ],
        publishTime: [
          // { required: true, message: '不能为空', trigger: 'change' },
        ],
        albumDesc: [
          // { required: true, message: '不能为空', trigger: 'blur' },
          // { pattern: /[^\u4E00-\u9FA5]+$/, message: '3个字符以内不能为中文', trigger: 'change'},
          // { max: 3, message: '3个字符以内不能为中文', trigger: 'change'},
        ],
        albumCategory: [{ required: true, message: '不能为空', trigger: 'blur' }],
        resType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        freeFlag: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      newFile: {},
      imgSrcA: '',
      imgSrcB: '',
    }
  },
  methods: {
    getSectList () {
      let that = this;
      let parm = {};
      let params = {jsonParam: JSON.stringify(parm)};
      that.$ajax({
        url: that.getAllSectList,
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
    upload(ev, index) {
      let evAnd = ev.target ? ev.target : ev.srcElement;
      let file = evAnd.files[0];
      this.newFile.set("file" + index, file);
      let that = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        switch (index) {
          case 'A':
            that.imgSrcA = this.result;
            break;
          case 'B':
            that.imgSrcB = this.result;
            break;
        }
      };
    },
    getProList () {
      let that = this;

      that.$ajax({
        url: that.getProUrl,
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.cpId = Number(item.cpId);
          });
          that.proList = res.data.data;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getArea() {
      let that = this;
      let param = {proCode: this.reqList.proCode};
      let params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.getAreaUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.AreaList = res.data.data;
          } else {
            that.AreaList = [];
          }
          that.AreaList.unshift({
            citycode: 'all',
            cityname: '全部'
          });
          that.AreaList.push({
            citycode: 'else',
            cityname: '其他'
          });
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getDetial () {
      let that = this;
      let param = {albumCode: this.modalData};
      let params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.detialUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            res.data.obj.image === null ? that.imgSrcA = '' : that.imgSrcA = that.imgApi + res.data.obj.image;
            res.data.obj.image === null ? that.imgSrcB = '' : that.imgSrcB = that.imgApiSD + res.data.obj.image;
            res.data.obj.image === null ? that.reqList.image = '' : that.reqList.img = res.data.obj.image;
            that.reqList.albumCode = res.data.obj.albumCode;
            that.reqList.albumName = res.data.obj.albumName;
            that.reqList.sect = res.data.obj.sect;
            that.reqList.upperCase = res.data.obj.upperCase;
            that.reqList.publishTime = res.data.obj.publishTimeStr;
            that.reqList.albumDesc = res.data.obj.albumDesc;
            that.reqList.albumCategory = res.data.obj.albumCategory.toString();
            that.reqList.resType = res.data.obj.resType;
            that.reqList.freeFlag = res.data.obj.freeFlag;
            // let date = new Date(res.data.obj.publishTime);
            // let Y,M,D,time;
            // Y = date.getFullYear() + '-';
            // M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            // D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            // time = Y + M + D;
            // console.log(time)
            // that.reqList.publishTime = time;
            // albumCategory: 1
            // albumCategoryStr: "音乐MV"
            // albumCode: "00YLf2nFHO711164"
            // albumDesc: ""
            // albumName: "yy"
            // artistName: null
            // freeFlag: 0
            // image: null
            // lastTime: 1546943277000
            // lastTimeStr: "2019-01-08 18:27:57"
            // publishTime: 1547568000000
            // publishTimeStr: "2019-01-16"
            // resType: 1
            // resTypeStr: "视频"
            // sect: "wuju"
            // sectName: null
            // upperCase: "yy"
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    close (type) {
      this.$emit('closeSave', type)
    },
    ok (formName) {
      let that = this;
      this.newFile.set('albumCode', this.reqList.albumCode);
      this.newFile.set('albumName', this.reqList.albumName);
      this.newFile.set('sect', this.reqList.sect);
      this.newFile.set('upperCase', this.reqList.upperCase);
      this.newFile.set('publishTime', this.reqList.publishTime === null ? '' : this.reqList.publishTime);
      this.newFile.set('albumDesc', this.reqList.albumDesc);
      this.newFile.set('albumCategory', this.reqList.albumCategory);
      this.newFile.set('resType', this.reqList.resType);
      this.newFile.set('freeFlag', this.reqList.freeFlag);
      let param = Object.assign({}, this.reqList);
      let params = {jsonParam: JSON.stringify(this.newFile)};
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let configs = {
          //   headers: {'Content-Type': 'multipart/form-data'}
          // };
          // that.axios.post(that.saveUrl, that.newFile, configs).then( res => {
          //   console.log(res)
          // });
          that.axios({
            headers: {
              // 'deviceCode': 'A95ZEF1-47B5-AC90BF3',
              'Content-Type': 'multipart/form-data'
            },
            url: that.saveUrl,
            method:'post',
            // data: this.newFile,
            data: this.newFile,
          }).then( res => {
            // if (res.data.success) {
            //   that.close('con')
            // }
            if (res.data.success) {
              that.$message({
                type: 'success',
                message: res.data.msg
              })
              that.close('con')
            } else {
              that.$message({
                type: 'warning',
                message: res.data.msg
              })
            }
          }).catch( err => {
            console.log(err);
          })
          // that.$ajax({
          //   url: that.saveUrl,
          //   method: "post",
          //   data: that.Qs.stringify(this.newFile),
          //   // data: params,
          //   success: function (res) {
          //     if (res.data.success) {
          //       that.$message({
          //         type: 'success',
          //         message: res.data.msg
          //       });
          //       that.close('con');
          //     } else {
          //       that.$message({
          //         type: 'warning',
          //         message: res.data.msg
          //       });
          //     }
          //   },
          //   error: function (error) {
          //     that.$message.error(error);
          //   }
          // });
        } else {
          that.$message({
            type: 'warning',
            message: '请按正确格式填写完整'
          });
          return false;
        }
      })
    },

    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
  }
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
    width: 484px !important;
  }
  .showImg{
    margin-top: 10px;
  }
  .img{
    float: left;
    position: relative;
    margin-right: 15px;
    margin-bottom: 28px;
    padding: 8px;
    padding-bottom: inherit;
    border: 1px dashed #cecece;
  }
  .img img{
    width: 160px;
    height: 100px;
    padding: 0;
  //cursor: pointer;
  }
  .img input{
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
    width: 176px;
    height: 65px;
    padding: 0;
    border: 0;
    cursor: pointer;
    -webkit-opacity: 0;
    -moz-opacity: 0;
    -khtml-opacity: 0;
    opacity: 0;
    filter:alpha(opacity=0);
    -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=10)";
    filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
  }
</style>
