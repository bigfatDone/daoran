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
          <!--defaultType="2"-->
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
        <div class="selection" style="display: inline-block;margin: 8px 14px">
          <span style="font-size: 14px">渠道-产品:</span>
          <div style="display: inline-block">
            <!--<el-dropdown @visible-change="dropdown" trigger="click">-->
            <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              渠道-产品<i class="el-icon-arrow-down el-icon--right"></i>
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
        <slot name="comeback"></slot>
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
  import vDate from "@/view/component/search/search-date-ott"
  import vSelect from "@/view/component/search/search-select-ott"
  export default {
    name: "trendOTT-search",
    props:['searchType','selectbars'],
    components: {
      vDate,vSelect
    },
    data () {
      return {
        treeData: [],
        projectData: [],
        projectCode: '',
        url: {
          table: "/ms_bas/ott/trendDay/getTable",
          tableSummary: "/ms_bas/ott/trendDay/getTableSummary",
          img: "/ms_bas/ott/trend/getImage",
          ottTree: "/ms_bas/ott/api/nodeTree",
          getottProject: "/ms_bas/ott/api/getProject",
        },
        search_form: {
          startDate:"",
          endDate:"",
          json: "",
          // sNodeCode: "",
          // sProjectCode: "",
          type: 1,
        },
        loading: false,
        default: true,

        imgData:[],
        tableData1:[],
        tableData2:[],
        sumData:[],

        dateStatus:true,//true 单日,false 时间段
      }
    },
    computed: {
      searchState () {
        return this.$store.getters.getMobileSearchState;
      },
      tableData () {
        let that = this;
        let arr = [];
        return  arr.concat(that.tableData1, that.tableData2);
      },
    },
    watch:{
      'searchType.code': {
        deep: true,
        handler: function (newVal,oldVal){
          if(oldVal!=newVal&&this.haveResh){
            this.toPostImgData();
          }
          this.haveResh = true;
        }
      },
    },
    mounted () {
      this.getSearchTree();
      this.dropdown();
    },
    methods: {
      dealPro() {
        let arr = [];
        let checkArr = [];
        if( this.projectCode !== '') {
          this.treeData.forEach( i => {
            if ( !!i.children) {
              i.children.forEach( k => {
                arr.push(k.id)
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
        this.search();
        // this.searchSum();
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
            // k.children.forEach( j => {
            arr.push(k.id)
            // })
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
              // if (!!res.data.data[0].children[0].id) {
              //   that.search_form.json = res.data.data[0].children[0].id;
              //   let arr = [];
              //   arr.push(res.data.data[0].children[0].id);
              //   that.$refs.tree.setCheckedKeys(arr, false);
              // }
              // that.search();
            } else {
              that.treeData = [];
            }
          },
          error: function (err) {
            that.$message.error('趋势分析(旧)页面数据请求失败，请刷新趋势分析(旧)页面');
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
              // that.search();
            } else {
              that.projectData = [];
            }
          },
          error: function (err) {
            that.$message.error('趋势分析(旧)页面数据请求失败，请刷新趋势分析(旧)页面');
          }
        });
      },
      init () {
        let that = this;
        let count = 0;
        if (that.default === false) {
          return;
        }
        that.$emit("searchImg", {name:[], xAxis:[], data:[],dateStatus:that.dateStatus});
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
        if (that.search_form.json === '') {
          that.$message({
            type: 'warning',
            message: '请选择:渠道-产品搜索条件'
          });
          return;
        }
        that.loading = true;
        that.$emit("searchData", that.search_form);
        that.$emit("loading", that.loading);
        that.$store.commit('changeMobileSearchState', false);
        // that.searchImg();
        that.$ajax({
          url: that.url.tableSummary,
          data: that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            // accessUser newUser newMember newVip orderSuccessNum playUserNum playNum priceSale
            if (result.status) {
              that.tableData1 = result.data;
              // result.data.forEach(i => {
              //   that.tableData.unshift(i)
              // })
            } else {
              that.tableData1 = [];
              that.$message({
                type: 'warning',
                message: result.message
              });
            }
            that.$emit("search", that.tableData);
          },
          error: function (err) {
            that.$message.error('趋势分析(旧)页面数据请求失败，请刷新趋势分析(旧)页面');
          }
        });

        that.$ajax({
          url: that.url.table,
          data: that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            if (result.status === true) {
              that.tableData2 = result.data.datas;
              that.imgData = result.data.imgs;
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

            that.$emit("loadingImg", false);
            that.toPostImgData();
          },
          error: function (err) {
            that.$message.error('趋势分析(旧)页面数据请求失败，请刷新趋势分析(旧)页面');
            that.loading = false;
            that.$emit("search", []);
            that.$emit("loading", that.loading);
          }
        });
      },
      searchImg(){
        let that = this;
        let dateTime = that.$dateFormat(Date.now(),"yyyy-MM-dd");
        if(that.search_form.startDate === dateTime){
          that.dateStatus = true;
        }else {
          that.dateStatus = false;
        }
        //处理搜索条件
        that.selectbars.forEach((item,index) => {
          if(item.status){
            that.search_form.type = item.type;
          }
        });
        that.$emit("searchImg", {name:[], xAxis:[], data:[],dateStatus:that.dateStatus});
        that.$ajax({//图形数据
          url: that.url.img,
          data:  that.search_form,
          method: "post",
          success: function (res) {
            let result =res.data;
            if (result.status === true) {
              that.imgData = result.data;
              that.dateStatus = result.isReal;
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
            that.$message.error('请求图形失败，请刷新页面');
            that.$emit("searchImg", {name:[], xAxis:[], data:[],dateStatus:that.dateStatus});
            that.loading = false;
          }
        })
      },
      toPostImgData(){
        let that = this;
        let imgdata ={};
        if (that.imgData !="[]" && that.searchType.code !== undefined){
          let xAxis =that.imgData.ctime;
          let data =[];
          let name =[];
          for(let i of that.imgData.group){
            name.push(i.name);
            let datas =[];
            i.val.forEach( j => {
              datas.push(j[that.searchType.code]);
            })
            // let datas =[];
            // name.push(key);
            // let newData =that.imgData.table[key];
            // newData.forEach((item,index)=>{
            //   for(let key in item){
            //     if ( key === that.searchType.code){
            //       datas.push(item[key]);
            //     }
            //   }
            // });
            data.push(datas);
          }
          imgdata.name=name;
          imgdata.xAxis=xAxis;
          imgdata.data=data;
        }else {
          return
        }
        that.$emit("searchImg", imgdata);
      },
      condition (data) {
        let that = this;
        that.search_form.sNodeCode = data.sNodeCode;
        that.search_form.sProjectCode = data.sProjectCode;
        that.init();
      },
      getDate(data){
        let that = this;
        that.search_form.startDate = data.dateSart;
        that.search_form.endDate = data.dateEnd;
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
    padding: .3rem 0;
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
