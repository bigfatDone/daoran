<template>
  <div class="pa-pages-search">
    <div
        class="searchContainCover"
        v-show="searchState"
        @click="hideSearch"></div>
    <div
        class="search-index"
        :class="{'show':searchState}">


      <div>
        <v-date
          buttons="['yesterday', 'sevenday', 'nearthirty','nearsixty']"
          dateModel="2"
          default-date="sevenday"
          @getDate="getDate($event)"></v-date>
      </div>

      <div class="other-select search-select-link">
        <!--<v-select-->
          <!--defaultType="1"-->
          <!--@condition="condition($event)"></v-select>-->
        <div class="selection">
          <!--<div></div>-->
          <span class="label">产品:</span>
          <el-select v-model="projectCode" @change="dealPro" placeholder="请选择产品">
            <el-option
              v-for="item in projectData"
              :key="item.code"
              :label="item.text"
              :value="item.code">
            </el-option>
          </el-select>
        </div>
        <!-- 渠道 -->
        <div class="selection">
          <span class="label">渠道:</span>
          <el-select v-model="itemValue" placeholder="请选择渠道">
            <el-option v-for="projectItem in itemList" :key="projectItem.code"  :label="projectItem.text" :value="projectItem.code"></el-option>
          </el-select>
        </div>
        <div class="selection" style="display: inline-block;margin: 8px 14px;width: 232px;" v-show="false">
          <span style="font-size: 14px">渠道-产品-版本:</span>
          <div style="display: inline-block">
            <!--<el-dropdown @visible-change="dropdown" trigger="click">-->
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
                  style="margin-bottom: 12px"
                >
                </el-tree>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="btns">
          <el-button
            @click="search"
            :disabled="loading"
            type="primary"
            icon="el-icon-search">搜索</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//  import vDate from "@/view/component/search/search-date-select"
  import vDate from "@/view/component/common/search-date-select"
  import vSelect from "@/view/component/search/search-select-ott"
  export default {
    name: "orderOTT-search",
    props:['searchType','selectbars'],
    components: {
      vDate,vSelect
    },
    data () {
      return {
        treeData: [],
        url: {
          table: "/ms_bas/ott/order/getTable",
          img:"/ms_bas/ott/order/getImage",
          pie:"/ms_bas/ott/order/getPie",
          ottTree: "/ms_bas/ott/api/tree",
          getottProject: "/ms_bas/ott/api/getProject",
        },
        search_form: {
          startDate:"",
          endDate:"",
          dateType: "",
          version: "",
          product: "",
          itemCode: "",
          json:"",
          // sNodeCode: "",
          // sProjectCode: "",
          // version:""
        },
        loading: false,
        default: true,

        searchTypeState:'spline',

        imgData:[],
        tableData:[],
        projectData:[],
        projectCode: '',
        itemValue: '',
        itemList:[],
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
    },
    watch:{
      searchType(ev){
        if(ev.conditionType === 'pie'){
          this.searchImg();
          this.searchTypeState = 'pie';
        }else if(this.searchTypeState === 'pie'){
          this.searchImg();
          this.searchTypeState = 'spline';
        } else{
          this.toPostImgData();
        };
        // this.getSearchTree();
        // this.dropdown();
      }
    },
    mounted () {
      this.getSearchTree();
      this.dropdown();
    },
    methods: {
      // 获取渠道数据
      getItemData() {
        const that = this;
        that.$ajax({
          url: '/ms_bas/ott/api/getItem',
          data: { product: that.projectValue },
          method: "post",
          success: function (res) {
            if(res.status){
              that.itemList = res.data.data;
              that.itemValue = res.data.data[0].code;
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      dealPro() {
        let arr = [];
        let checkArr = [];
        if( this.projectCode !== '') {
          this.treeData.forEach( i => {
            if ( !!i.children) {
              i.children.forEach( k => {
                if (!! k.children) {
                  k.children.forEach( j=> {
                    arr.push(j.id)
                  })
                }
              })
            }
          })
        }
        arr.forEach(i => {
          if (i.indexOf(this.projectCode) > -1) {
            checkArr.push(i);
          }
        });
        this.search_form.json = checkArr.toString();
        this.$refs.tree.setCheckedKeys(checkArr, false);
        this.itemValue = '';
//        this.search();
      },
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
        this.check();
      },
      moveCheck() {
        this.$refs.tree.setCheckedKeys([], false);
        this.search_form.json = '';
        this.check();
      },
      dropdown() {
        this.moveCheck();
      },
      getSearchTree () {
        let that = this;
        that.$ajax({
          url: that.url.ottTree,
          data: {},
          method: "post",
          success: function (res) {
            if (res.data.status) {
              that.getProject();
              that.treeData = res.data.data;
              // if (!!res.data.data[0].children[0].children[0].id) {
              //   that.search_form.json = res.data.data[0].children[0].children[0].id;
              //   let arr = [];
              //   arr.push(res.data.data[0].children[0].children[0].id);
              //   that.$refs.tree.setCheckedKeys(arr, false);
              // }
              // that.search();
            } else {
              that.treeData = [];
            }
          },
          error: function (err) {
            that.$message.error('订购报表页面数据请求失败，请刷新订购报表页面');
          }
        });
      },
      getProject () {
        let that = this;
        that.$ajax({
          url: that.url.getottProject,
          data: {},
          method: "post",
          success: function (res) {
            if (res.data.status) {
              that.projectData = res.data.data;
              that.projectCode = res.data.data[0].code;
              that.dealPro();
              that.getItemData();
              that.search();
            } else {
              that.projectData = [];
            }
          },
          error: function (err) {
            that.$message.error('订购报表页面数据请求失败，请刷新订购报表页面');
          }
        });
      },
      init () {
        let that = this;
        let count = 0;
        if (that.default === false) {
          return;
        }
        for (let item in that.search_form) {
          if (that.search_form[item] == "" || that.search_form[item] === undefined) {
            count += 1;
          }
        }
        if (count > 0) {
          return;
        } else {
          that.default = false;
          that.search();
        }
      },
      search () {
        let that = this;
//        if (that.search_form.json === '') {
//          that.$message({
//            type: 'warning',
//            message: '请选择:渠道-产品-版本搜索条件'
//          });
//          return;
//        }
        that.search_form.product = that.projectCode;
        that.search_form.itemCode = that.itemValue;
        that.loading = true;
        that.$store.commit('changeMobileSearchState', false);
        that.$emit("searchData", that.search_form);
        that.$emit("loading", true);
        that.searchImg();

        that.$ajax({
          url: that.url.table,
          data: that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            if (result.status === true) {
              that.tableData = result.data;
            } else {
              that.$message({
                type: 'warning',
                message: result.message
              });
              that.tableData = [];
            }
            that.$emit("search", that.tableData);
            that.loading = false;
            that.$emit("loading", that.loading);
          },
          error: function (err) {
            that.$message.error('订购报表页面数据请求失败，请刷新订购报表页面');
            that.loading = false;
            that.$emit("search", []);
            that.$emit("loading", that.loading);
          }
        });
      },
      searchImg(){
        let that = this;
        that.$emit("searchImg", {name:[], xAxis:[], data:[]});
        let url;
        if(that.searchType.conditionType === 'pie'){
          url = that.url.pie;
        }else {
          url =that.url.img;
        }

        that.$ajax({//图形数据
          url: url,
          data:  that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            if (result.status === true) {
              that.imgData = result.data;
            } else {
              that.$message({
                type: 'warning',
                message: result.message
              });
              that.imgData=[];
            }
            that.loading = false;
            that.$emit("loadingImg", false);
            that.toPostImgData();
          },
          error: function (err) {
            that.$message.error('订购报表页面数据请求失败，请刷新订购报表页面');
            that.$emit("searchImg", {name:[], xAxis:[], data:[]});
            that.loading = false;
          }
        })
      },
      toPostImgData(){
        let that = this;
        let imgdata ={};
        if (that.imgData.length > 0 && that.searchType.code !== undefined){
          if (that.searchType.conditionType === 'pie'){
            let name =[];
            let data =[];
            let data2 =[];
            that.imgData.forEach((item,index)=>{
              name.push(item.province);
              data.push(item.orderSuccessNum);
              data2.push(item.orderRate);
            });
            imgdata.name=name;
            imgdata.xAxis=[];
            imgdata.data=data;
            imgdata.data2=data2;
            imgdata.color=["#d87a80","#8d98b3","#97b552","#e5cf0d","#95706d","#dc69aa","#07a2a4","#9a7fd1","#588dd5","#f5994e","#c05050"];
          }else {
            let xAxis =[];
            let data =[];
            let datas =[];
            let name =[];
            that.imgData.forEach((item,index)=>{
              xAxis.push(item.ctime);
              for(let key in item){
                if ( key === that.searchType.code){
                  datas.push(item[key]);
                }
              }
            });
            that.selectbars.forEach((item,index)=>{
              if(item.status){
                name.push(item.text);
              }
            });
            data.push(datas);
            imgdata.name=name;
            imgdata.xAxis=xAxis;
            imgdata.data=data;
          }

        }else {
          return
        }
        that.$emit("searchImg", imgdata);
      },
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.sNodeCode;
        that.search_form.sProjectCode = data.sProjectCode;
        that.search_form.version = data.version;
        that.init();
      },
      getDate(data){
        let that = this;
        that.search_form.startDate = data.dateStart;
        that.search_form.endDate = data.dateEnd;
        this.search_form.dateType = data.dateType;
        console.log('order')
        that.init();
      },
      hideSearch () {
        let that = this;
        that.$store.commit('changeMobileSearchState', false);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btns {
    display: inline-block;
    vertical-align: top;
    /*padding: .3rem 0;*/
  }
  .show{
    display: block !important;
  }
  .search-index {
    padding: .2rem;
  }
  .date-input-group{
    margin: 0;
    padding:0 0 8px 0;
    width: 250px;
    display:block;
  }
  .el-date-editor.el-input{
    width: 70%;
    min-width: 130px;
  }
  .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  .search-select-link{
    display: inline-block;
    vertical-align: middle;
    padding: .3rem 0;
    margin: 8px 0 0 12px;
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
    .btns {
      margin: 1rem 0 0 0;
      display: block;
      text-align: right;
    }
    .search-index {
      position: fixed;
      top: 3rem;
      left: 0;
      right: 0;
      z-index: 6;
      background: #fff;
      padding: 1.2rem;
      display: none;
    }
    .searchContainCover{
      position: fixed;
      z-index: 5;
      background: rgba(0,0,0,0.3);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
