<template>
  <div class="search-select-link">
    <template v-if="defaultType==1 || defaultType==2">
      <div class="selection" :class="{'disabled' : disabled}">
        <span class="label">渠道:</span>
        <v-select :data="sNodeCodeArr" @select="changeNode($event)" class="singleSelect"></v-select>
      </div>
    </template>
    <div class="selection" :class="{'disabled' : disabled}">
      <span class="label">产品:</span>
      <v-select :data="sProjectCodeArr" @select="changeProject($event)" class="singleSelect"></v-select>
    </div>
    <template v-if="defaultType==1 || defaultType==3">
      <div class="selection" :class="{'disabled' : disabled}">
        <span class="label">版本:</span>
        <v-select :data="versionArr" @select="changeVersion($event)" class="singleSelect"></v-select>
      </div>
    </template>
  </div>
</template>

<script>
import vSelect from "@/view/component/customSelect/singleSelect"
export default {
  name: 'search-select-ott',
  props: {
    data: Object,
    defaultChosed: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    defaultType: { //1:全部条件，2仅前两个，3仅后两个  默认：1
      type: String,
      default:"1"
    }
  },
  components: {
    vSelect
  },
  computed: {
  },
  data () {
    return {
      search_form:{
        sNodeCode:"",
        sProjectCode:"",
        version:""
      },

      url:{
        node:"/ms_bas/ott/api/getNode",
        project:"/ms_bas/ott/api/getProject",
        version:"/ms_bas/ott/api/getVersion",
      },

      sNodeCodeArr:[],
      sProjectCodeArr:[],
      versionArr:[],
    }
  },
  mounted () {
    if(this.defaultType !== "3"){
      this.getNode();
    }else {
      this.getProject();
    }
  },
  methods: {
    getNode(){
      let that = this;
      this.$ajax({
        url: that.url.node,
        data: {},
        method: "post",
        success: function (res) {
          let result = res.data;
          if(result.status){
            that.sNodeCodeArr = result.data;
              that.changeNode(that.sNodeCodeArr[0])
          }else {
            that.sNodeCodeArr = [];
            that.$message({
              type: 'warning',
              message: result.message
            });
          }
        },
        error: function (err) {
          that.$message.error('请求渠道条件失败，请刷新页面');
        }
      });
    },
    getProject(){
      let that = this;
      this.$ajax({
        url: that.url.project,
        data: {sNodeCode:that.search_form.sNodeCode},
        method: "post",
        success: function (res) {
          let result = res.data;
          if(result.status){
            that.sProjectCodeArr = result.data;
              that.changeProject(that.sProjectCodeArr[0]);
          }else {
            that.sProjectCodeArr = [];
            that.$message({
              type: 'warning',
              message: result.message
            });
          }
        },
        error: function (err) {
          that.$message.error('请求产品条件失败，请刷新页面');
        }
      });
    },
    getVersion(){
      let that = this;
      this.$ajax({
        url: that.url.version,
        data: {sProjectCode:that.search_form.sProjectCode,sNodeCode:that.search_form.sNodeCode},
        method: "post",
        success: function (res) {
          let result = res.data;
          if(result.status){
            that.versionArr = result.data;
          that.changeVersion(that.versionArr[0]);
          }else {
            that.versionArr = [];
            that.$message({
              type: 'warning',
              message: result.message
            });
          }
        },
        error: function (err) {
          that.$message.error('请求版本条件失败，请刷新页面');
        }
      });
    },
    changeNode(data){
      let that = this;
      that.sNodeCodeArr.forEach((item,index) => {
        if(item.code === data.code){
          item.chosed = true;
          that.search_form.sNodeCode = item.code;
        }else {
          item.chosed = false;
        }
      });
      that.getProject();
    },
    changeProject(data){
      let that = this;
      that.sProjectCodeArr.forEach((item,index) => {
        if(item.code === data.code){
          item.chosed = true;
          that.search_form.sProjectCode = item.code;
        }else {
          item.chosed = false;
        }
      });
      if(that.defaultType !=="2"){
        that.getVersion();
      }else {
        that.sendData();
      }
    },
    changeVersion(data){
      let that = this;
      that.versionArr.forEach((item,index) => {
        if(item.code === data.code){
          item.chosed = true;
          that.search_form.version = item.code;
        }else {
          item.chosed = false;
        }
      });
      that.sendData();
    },
    sendData(){
      let that = this;
      that.$emit("condition", that.search_form);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-select-link{
    display: inline-block;
    vertical-align: middle;
    padding: .3rem 0;
  }
  .selection{
    display: inline-block;
    position: relative;
    width: 180px;
    padding: 0 20px 0 35px;
  }
  .label{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 27px;
    color: #666;
    font-size: .65rem;
  }
  @media screen and (max-width: 800px) {
    .search-select-link{
      width: 100%;
    }
    .selection{
      width: 100%;
    }
  }
</style>
