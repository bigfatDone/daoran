<template>
  <div class="search-select-link">
    <div class="selection" :class="{'disabled' : disabled}">
      <span class="label">项目类型:</span>
      <v-select :data="isOtt" @select="changeItem($event)" class="singleSelect1"></v-select>
    </div>
    <div class="selection" style=" margin-left: 30px" :class="{'disabled' : disabled}">
      <span class="label">产品:</span>
      <v-select :data="projectData" @select="changeProject($event)" class="singleSelect"></v-select>
    </div>

    <div class="selection selectionTree" :class="{'disabled' : disabled}">
      <span style="font-size: 14px">渠道-产品-版本:</span>
      <div style="display: inline-block">
        <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                渠道-产品-版本<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
          <el-dropdown-menu slot="dropdown" style="width:200px;text-align: center">
            <el-button-group style="display: inline-block;margin-top: 10px">
              <el-button @click="allCheck">全选</el-button>
              <el-button @click="moveCheck">全不选</el-button>
            </el-button-group>
            <el-tree
              :data="treeData"
              ref="tree"
              @check="check"
              show-checkbox
              node-key="id"
              style="margin:12px"
            >
            </el-tree>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <template v-if="defaultType === '2' || defaultType === '3'">
      <div class="selection" :class="{'disabled' : disabled}">
        <span class="label">页面:</span>
        <v-select :data="pageData" @select="changePage($event)" class="singleSelect"></v-select>
      </div>
    </template>
    <template v-if="defaultType=== '3'">
      <div class="selection" :class="{'disabled' : disabled}">
        <span class="label">区域:</span>
        <v-select :data="zoneData" @select="changeZone($event)" class="singleSelect"></v-select>
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
      defaultType: {
        type: String,
      },
      paramPage: {
        type: String,
      },
      paramZone: {
        type: String,
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
          type:"",
          product:"",
          json:"",
          pageCode:""
        },

        url:{
          ottProject:'/ms_bas/ott/api/getProject',  // '/ms_bas/api/getProject'
          ottTree:'/ms_bas/ott/api/tree', // 非ott '/ms_bas/api/tree'
          getPageCode:"/ms_bas/api/getPage",
          getZoneCode:"/ms_bas/api/getZone",
        },

        isOtt:[],
        projectData:[],
        treeData:[],
        pageData:[],
        zoneData:[],
        pageFlag: 0,
        zoneFlag: 0,
      }
    },
    mounted () {
      this.search_form.type = '1',
      this.isOtt = [{code: '1', text: 'OTT', chosed: true}, {code: '0', text: '非OTT', chosed: false}],
      this.getProject(this.search_form.type);
    },
    methods: {
      changeItem(data) {
        let that = this;
        that.isOtt.forEach((item,index) => {
          if(item.code === data.code){
            item.chosed = true;
            that.search_form.type = item.code;
          }else {
            item.chosed = false;
          }
        });
        that.getProject();
      },
      getProject (code) {
        let that = this;
        if (code === '1') {
          this.url.ottProject = '/ms_bas/ott/api/getProject';
        } else {
          this.url.ottProject = '/ms_bas/api/getProject';
        }
        that.$ajax({
          url: that.url.ottProject,
          data: {},
          method: "post",
          success: function (res) {
            if (res.data.status) {
              that.projectData = res.data.data;
              that.projectData.forEach( i => {
                that.$set(i, "chosed", false);
              })
              that.projectCode = res.data.data[0].code;
              that.changeProject(that.projectData[0]);
            } else {
              that.projectData = [];
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      changeProject(data){
        let that = this;
        that.projectData.forEach((item,index) => {
          if(item.code === data.code){
            item.chosed = true;
            that.search_form.product = item.code;
            that.projectCode = item.code;
          }else {
            item.chosed = false;
          }
        });
        that.getSearchTree();
        that.getPage();
      },
      getSearchTree () {
        let that = this;
        let code = this.search_form.type;
        if (code === '1') {
          that.url.ottTree = '/ms_bas/ott/api/tree';
        } else {
          that.url.ottTree = '/ms_bas/api/tree';
        }
        that.$ajax({
          url: that.url.ottTree,
          data: {product: this.search_form.product},
          method: "post",
          success: function (res) {
            if (res.data.status) {
              that.treeData = res.data.data;
              that.allCheck();
            } else {
              that.treeData = [];
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      getPage(){
        let that = this;
        this.$ajax({
          url: that.url.getPageCode,
          data: {product: this.search_form.product},
          method: "post",
          success: function (res) {
            let result = res.data;
            if(result.status){
              that.pageData = result.data;
              that.pageData.forEach( i => {
                that.$set(i, "chosed", false);
              });
              if ((that.pageFlag === 0 || that.zoneFlag === 0) && that.paramPage !== '') {
                that.pageData.forEach((item) => {
                  if(item.code === that.paramPage){
                    that.changePage(item);
                  }
                });
                that.pageFlag++;
              } else {
                that.changePage(that.pageData[0])
              }
            }else {
              that.pageData = [];
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
      changePage(data){
        let that = this;
        that.pageData.forEach((item,index) => {
          if(item.code === data.code){
            item.chosed = true;
            that.search_form.pageCode = item.code;
          }else {
            item.chosed = false;
          }
        });
        if (that.defaultType !== '3') {
          that.sendData();
        } else {
          that.getZone();
        }

        // that.getPage();
        // if(that.defaultType !=="2"){
        //   that.tree();
        // }else {
        //   // that.sendData();
        //   that.getSearchTree();
        // }
      },
      getZone(){
        let that = this;
        this.$ajax({
          url: that.url.getZoneCode,
          data: {
            product: this.search_form.product,
            pageCode: this.search_form.pageCode,
          },
          method: "post",
          success: function (res) {
            let result = res.data;
            if(result.status){
              that.zoneData = result.data;
              that.zoneData.forEach( i => {
                that.$set(i, "chosed", false);
              });
              console.log(that.paramZone)
              if (that.zoneFlag === 0 && !!that.paramZone) {
                that.pageData.forEach((item) => {
                  if(item.code === that.paramZone){
                    that.changePage(item);
                  }
                });
                that.zoneFlag++;
              } else {
                that.changeZone(that.zoneData[0])
              }
            }else {
              that.zoneData = [];
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
      changeZone(data){
        let that = this;
        that.zoneData.forEach((item,index) => {
          if(item.code === data.code){
            item.chosed = true;
            that.search_form.zoneCode = item.code;
          }else {
            item.chosed = false;
          }
        });
        that.sendData();
      },

      // 树状图处理
      check(data, checked) {
        let a = [];
        let arr = [];
        a = this.$refs.tree.getCheckedNodes(true,false);
        a.forEach(i => {
          arr.push(i.id)
        });
        this.search_form.json = arr.toString();
      },
      allCheck() {
        let arr = [];
        this.treeData.forEach( i => {
          i.children.forEach( k => {
            k.children.forEach( j => {
              arr.push(j.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(arr, false);
        this.search_form.json = arr.toString();
        // this.check();
      },
      moveCheck() {
        // this.$refs.tree.setCheckedKeys([], false);
        // this.search_form.json = '';
        // this.check();
      },
      dropdown() {
        // this.moveCheck();
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
      sendData(){
        let that = this;
        that.$emit("condition", that.search_form);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .singleSelect1{
    margin-left: 26px;
  }
  .singleSelect{

  }
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
  .selectionTree{
    display: inline-block;
    position: relative;
    top: -10px;
    width: 232px;
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
