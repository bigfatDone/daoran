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
        prop="listName"
        label="节目单名称:">
        <div class="w400">
          <el-input v-model="reqList.listName" placeholder="32个字符以内"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        prop="listType"
        label="节目单类型:">
        <div class="w400">
          <el-radio-group v-model="reqList.listType">
            <el-radio v-for="item in listTypeData" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item
        prop="freeFlag"
        label="计费标识:">
        <div class="w400">
          <el-radio-group v-model="reqList.freeFlag">
            <el-radio v-for="item in freeFlagData" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item
        prop="resType"
        label="资源类型:">
        <div class="w400">
          <el-radio-group v-model="reqList.resType">
            <el-radio v-for="item in resTypeData" :disabled="disable" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item
        prop="listDes"
        label="描述:">
        <div class="w400">
          <el-input v-model="reqList.listDes" type="textarea" placeholder="描述"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="图片:">
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
      <el-form-item  class="text_right">
        <el-button type="primary" @click="ok('reqList')">提交</el-button>
        <el-button @click="close('can')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'proSave',
  props: {
    modalData: String,
  },
  mounted() {
    if (this.modalData !== '') {
      this.getDetial();
      this.reqList.listCode = this.modalData;
      this.disable = true;
    } else {
      this.reqList.listType = '1',
      this.reqList.freeFlag = '0',
      this.reqList.resType = '1'
    };
    // this.getProList ();
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
      getProUrl: "/cms/api/area/getProList.do",
      getAreaUrl: "/cms/api/area/getCityList.do",
      detialUrl: "/cms/busi/list/listdetail.do",
      saveUrl: "/cms/busi/list/save.do",
      saveLoading: false,
      playpeDisab: false,
      reqList: {
        image: '',
        listCode: '',
        listName: '',
        listType: '',
        freeFlag: '',
        listDes: '',
        resType: '',
        selectNodes: '',
      },
      freeFlagData: [{id: '0',name: '计费'}, {id: '1',name: '免费'}],
      listTypeData: [{id: '1',name: '榜单'}, {id: '2',name: '栏目'},{id: '3',name: '专辑'}],
      resTypeData:  [{id: '1',name: '视频'}, {id: '2',name: '音频'},{id: '3',name: '手绘本'}],
      rules: {
        listName: [
          { required: true, message: '不能为空', trigger: 'change' },
          { max: 32, message: '32个字符以内', trigger: 'change' }
        ],
        listType: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        freeFlag: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        resType: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /[^\u4E00-\u9FA5]+$/, message: '8个字符以内不能为中文', trigger: 'change'},
          { max: 8, message: '8个字符以内不能为中文', trigger: 'change' }
        ],
        listDes: [
          { max: 32, message: '32个字符以内', trigger: 'change' }
        ],
        playpeCode: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /[^\u4E00-\u9FA5]+$/, message: '3个字符以内不能为中文', trigger: 'change'},
          { max: 3, message: '3个字符以内不能为中文', trigger: 'change'},
        ],
        playpeName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 20, message: '20个字符以内', trigger: 'change' }
        ]
      },
      newFile: {},
      imgSrcA: '',
      imgSrcB: '',
    }
  },
  methods: {
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
      let param = {listCode: this.modalData};
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
            that.reqList.listCode = res.data.obj.listCode;
            that.reqList.listName = res.data.obj.listName;
            that.reqList.listType = res.data.obj.listType.toString();
            that.reqList.freeFlag = res.data.obj.freeFlag.toString();
            that.reqList.listDes = res.data.obj.listDes;
            that.reqList.resType = res.data.obj.resType.toString();
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
      this.newFile.set('listCode', this.reqList.listCode);
      this.newFile.set('listName', this.reqList.listName);
      this.newFile.set('listType', this.reqList.listType);
      this.newFile.set('freeFlag', this.reqList.freeFlag);
      this.newFile.set('listDes', this.reqList.listDes);
      this.newFile.set('resType', this.reqList.resType);
      let param = Object.assign({}, this.reqList);
      // let params = {jsonParam: JSON.stringify(this.newFile)};
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
            data: that.newFile,
          }).then( res => {
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
    width: 400px;
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
