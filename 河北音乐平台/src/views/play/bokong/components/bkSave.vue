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
        prop="carrier"
        label="运营商:" >
        <div class="w400">
          <el-select v-model="reqList.carrier" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in carrierData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        prop="proCode"
        label="省份:" >
        <div class="w400">
          <el-select v-model="reqList.proCode" placeholder="请选择" style="width: 100%;" @change="getArea">
            <el-option
              v-for="item in proList"
              :key="item.procode"
              :label="item.proname"
              :value="item.procode"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        prop="areas"
        label="区域:" >
        <div class="w400">
          <el-select v-model="reqList.areas" multiple placeholder="请选择" @change="areaChange()" style="width: 100%;">
            <el-option
              v-for="item in AreaList"
              :key="item.citycode"
              :label="item.cityname"
              :value="item.citycode"
              :disabled="item.disabled"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        prop="stbType"
        label="盒子型号:">
        <div class="w400">
          <el-input v-model="reqList.stbType" placeholder="8个字符以内，不能为中文"></el-input>
        </div>
      </el-form-item>

      <el-form-item
        prop="platform"
        label="运营平台:" >
        <div class="w400">
          <el-select v-model="reqList.platform" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in platformData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        prop='playpeCode'
        label="播控平台编码:">
        <div class="w400">
          <el-input v-model="reqList.playpeCode" :disabled="playpeDisab" placeholder="3个字符以内，不能为中文"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        prop='playpeName'
        label="播控平台名称:">
        <div class="w400">
          <el-input type="income" v-model="reqList.playpeName" placeholder="20个字符以内"></el-input>
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
  name: 'bkSave',
  props: {
    modalData: String,
  },
  mounted() {
    if (this.modalData !== '') {
      this.getDetial();
    };
    this.getProList();
  },
  data () {
    return {
      Qs: this.$root.Qs,
      proList: [],
      AreaList: [],
      getProUrl: "/cms/api/area/getProList.do",
      getAreaUrl: "/cms/api/area/getCityList.do",
      detialUrl: "/cms/api/bokong/getById.do",
      saveUrl: "/cms/api/bokong/save.do",
      saveLoading: false,
      playpeDisab: false,
      detialData: [],
      reqList: {
        id: '',
        playpeName: '',
        platform: '',
        proCode: [],
        areas: [],
        carrier: '',
        playpeCode: '',
        stbType: '',
      },
      carrierData: [{id: '1',name: '中国电信'}, {id: '2',name: '中国联通'},{id: '3',name: '广电'},{id: '4',name: '中国移动'}],
      platformData: [{id: '0',name: '通用'}, {id: '1',name: 'Linux'},{id: '2',name: 'Android'}],
      rules: {
        carrier: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        proCode: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        areas: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        stbType: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /[^\u4E00-\u9FA5]+$/, message: '8个字符以内不能为中文', trigger: 'change'},
          { max: 8, message: '8个字符以内不能为中文', trigger: 'change' }
        ],
        platform: [
          { required: true, message: '不能为空', trigger: 'change' }
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
      }
    }
  },
  methods: {
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
      this.reqList.areas = [];
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
          that.AreaList.forEach( i => {
            that.$set(i, 'disabled', false)
          })
          if (that.modalData !== '' && that.reqList.proCode === that.detialData['proCode'] ) {
            that.reqList['areas'] = that.detialData['areas'];
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    areaChange () {
      let that = this;
      if (this.reqList.areas.length > 1 && this.reqList.areas.indexOf('all') > -1) {
        this.reqList.areas = ['all'];
        this.AreaList.forEach( i => {
          if (i.citycode !== 'all') {
            i.disabled = false;
          }
        })
      }
    },
    getDetial () {
      let that = this;
      let param = {id: this.modalData};
      let params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.detialUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            for (let i in res.data.data) {
              that.detialData = res.data.data;
              if (i === 'areas') {
                res.data.data[i] = res.data.data[i].split(',');
                that.reqList[i] = res.data.data[i];
                console.log(that.reqList[i])
              } else {
                that.reqList[i] = res.data.data[i].toString();
              }
            }
            that.playpeDisab = true;
            that.getArea();
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.reqList.areas.length > 1 && this.reqList.areas.indexOf('all') > -1) {
            this.$message({
              type: 'warning',
              message: '"全部"不能和单个区域同时选择'
            });
            return;
          }
          this.reqList.areas = this.reqList.areas.toString();
          let param = Object.assign({}, this.reqList);
          if (this.modalData !== '') {
            param.id = this.modalData;
          };
          let params = {jsonParam: JSON.stringify(param)};
          that.$ajax({
            url: that.saveUrl,
            method: "post",
            data: that.Qs.stringify(params),
            // data: params,
            success: function (res) {
              if (res.data.success) {
                that.$message({
                  type: 'success',
                  message: res.data.msg
                });
                that.close('con');
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                });
              }
            },
            error: function (error) {
              that.$message.error(error);
            }
          });
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

<style>
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
</style>
