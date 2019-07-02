<style scoped>
  .search-index { padding: .2rem;  }
  .search-select-link{ display: inline-block; vertical-align: middle; padding: .3rem 0;  }
  .el-select{left: 35px;}
  .selection{  display: inline-block;  position: relative;  width: 180px;  padding: 0 20px 0 35px;margin: 8px 14px;  }
  .label{  display: inline-block;  position: absolute;  left: 0;  top: 0;  line-height: 27px;  color: #666; font-size: .65rem;  }
  .btns {  display: inline-block;  vertical-align: top;  padding: .3rem 0;position: relative;top: -7px;  }
  @media screen and (max-width: 800px) {
    .selection{width: 100%;}
    .search-index {position: fixed;  top: 3rem;  left: 0;  right: 0;  z-index: 6;  background: #fff;  padding: 1.2rem;  display: none;  }
  }
</style>
<template>
  <div class="pa-pages-search">
    <div class="search-index">
      <div>
        <v-date :defaultStartDate="search_form.startDate" :defaultEndDate="search_form.endDate" buttons="['yesterday', 'sevenday', 'nearthirty','nearsixty']" dateModel="2" @getDate="getDate($event)"></v-date>
      </div>
    </div>
    <div class="selection">
      <span class="label">项目类型:</span>
      <el-select v-model="projectItem" placeholder="请选择项目类型" @change="getProductData()">
        <el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="selection">
      <span class="label">产品:</span>
      <el-select v-model="search_form.product" placeholder="请选择产品" @change="getProductTreeData()">
        <el-option v-for="productItem in productList" :key="productItem.code"  :label="productItem.text" :value="productItem.code"></el-option>
      </el-select>
    </div>
    <div class="selection" style="display: inline-block;margin: 8px 14px;width: 232px">
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
            <el-tree :data="treeData" show-checkbox @check="check" node-key="id" ref="treeTwo" :default-checked-keys="search_form.arrData" :props="defaultProps"></el-tree>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="selection">
      <span class="label">页面:</span>
      <el-select v-model="search_form.pageValue" placeholder="请选择页面">
        <el-option v-for="productItem in pageList" :key="productItem.code"  :label="productItem.text" :value="productItem.code"></el-option>
      </el-select>
    </div>
    <div class="selection">
      <div class="btns">
        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  /*this.$route.params.pageCode  从页面分析获取的product*/
  import vDate from '@/view/component/search/search-date-select';
  export default {
    name: "zoneAnalysis-search",
    props:[],
    components: {
      vDate
    },
    data () {
      return {
        options: [{
          value: 1,
          label: 'OTT'
        }, {
          value: 0,
          label: '非OTT'
        }],
        projectItem: 1,
        url: {
          OTT: "/ms_bas/ott/api/getProject",
          NotOTT: "/ms_bas/api/getProject",
          OTTtree:"/ms_bas/ott/api/tree",
          NotOTTtree:"/ms_bas/api/tree",
          pageSelect:"/ms_bas/api/getPage",
        },
        productList:[],
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        search_form: {
          startDate:'',
          endDate:'',
          json:'',
          type:'',
          product:'',
          arrData:[''],
          pageValue:'',
        },
        pageList:[],
        isFirst:true,
      }
    },
    methods: {
      getProductData() {
        const that = this;
        let url = '';
        if(this.projectItem === 1) {
          url = that.url.OTT;
        } else {
          url = that.url.NotOTT;
        }
        that.$ajax({
          url: url,
          data: {},
          method: "post",
          success: function (res) {
            if(res.status){
              that.productList = res.data.data;
              if(!!that.$route.params.searchParam){
                that.search_form.product = that.$route.params.searchParam.product;
              }else {
                that.search_form.product = res.data.data[0].code;
              }
              that.getProductTreeData();
            }
          },
          error: function (err) {
            that.$message.error('区域分析页面数据请求失败，请刷新区域分析页面');
          }
        });
      },
      getProductTreeData() {
        const that = this;
        let url = '';
        this.search_form.type = this.projectItem;

        if(this.projectItem === 1) {
          url = that.url.OTTtree;
        } else {
          url = that.url.NotOTTtree;
        }
        that.$ajax({
          url: url,
          data: {product:that.search_form.product},
          method: "post",
          success: function (res) {
            if(res.status){
              that.treeData = res.data.data;
              if(!!that.$route.params.searchParam){
                if(that.$route.params.searchParam.type === that.search_form.type && that.$route.params.searchParam.product === that.search_form.product){
                  that.search_form.arrData = that.$route.params.searchParam.arrData;
                  that.search_form.json = that.$route.params.searchParam.json;
                } else {
                  that.allCheck();
                }
              } else {
                that.allCheck();
              }
              that.getpageSelect();
            }
          },
          error: function (err) {
            that.$message.error('区域分析页面数据请求失败，请刷新区域分析页面');
          }
        })
      },
      getDate(data) {
        this.search_form.startDate = data.dateSart;
        this.search_form.endDate = data.dateEnd;
      },
      check(data, checked) {
        let arr = [];
        this.$refs.treeTwo.getCheckedNodes(true,false).forEach(i => {
          arr.push(i.id);
        });
        this.search_form.json = arr.toString();
        this.search_form.arrData = arr;
      },
      allCheck() {
        let arr = [];
        this.treeData.forEach( i => {
          i.children.forEach( k => {
            k.children.forEach( j => {
              arr.push(j.id)
            })
          })
        });
        this.$refs.treeTwo.setCheckedKeys(arr, false);
        this.search_form.json = arr.toString();
        this.search_form.arrData = arr;
      },
      moveCheck() {
        this.$refs.treeTwo.setCheckedKeys([], false);
        this.search_form.json = '';
        this.search_form.arrData = [];
      },
      search() {
        let toData = {
          loading:true,
        //  imgData : [],
       //   imgDataHide : false,
          tableData :[],
          search_form:{}
        };
        let toDataImg = {
          loading2:true,
          imgData : [],
          imgDataHide : false,
       //   tableData :[],
          search_form:{}
        };
        this.$emit('searchResult',toData);
        this.$emit('searchResultImg',toDataImg);
        const that = this;
        let parms = {
          startDate : this.search_form.startDate,
          endDate : this.search_form.endDate,
          json : this.search_form.json,
          type : this.search_form.type,
          product : this.search_form.product,
          pageCode : this.search_form.pageValue,
        };
        this.$ajax({
          url: '/ms_bas/page/report/getZoneTable',
          data: parms,
          method: "post",
          success: function (res) {
            if(res.data.status){
              toData.loading = false;
           //   toData.imgData = res.data.data.imageData;
           //   toData.imgDataHide = true;
              toData.tableData = res.data.data.tableData;
              toData.search_form = that.search_form;
              that.$emit('searchResult',toData);
            }
          },
          error: function (err) {
            that.$message.error('区域分析页面数据请求失败，请刷新区域分析页面');
          }
        });
        this.$ajax({
          url: '/ms_bas/page/report/getZoneImg',
          data: parms,
          method: "post",
          success: function (res) {
              console.log(res);
            if(res.status){
              toDataImg.loading2 = false;
              toDataImg.imgData = res.data.data;
              toDataImg.imgDataHide = true;
            //  toData.tableData = res.data.data.tableData;
              toDataImg.search_form = that.search_form;
              that.$emit('searchResultImg',toDataImg);
            }
          },
          error: function (err) {
          //  that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      getpageSelect(){
        const that = this;
        that.$ajax({
          url: this.url.pageSelect+ '?product=' + that.search_form.product,
          data: {},
          method: "get",
          success: function (res) {
            if(res.status){
              that.pageList = res.data.data;
              if(!!that.$route.params.searchParam ){
                if(that.$route.params.searchParam.product === that.search_form.product){
                  that.search_form.pageValue = that.$route.params.searchParam.pageCode;
                } else {
                  if(res.data.data.length <= 0){
                    that.search_form.pageValue = '';
                  } else {
                    that.search_form.pageValue = res.data.data[0].code;
                  }
                }
              } else {
                if(res.data.data.length <= 0){
                  that.search_form.pageValue = '';
                } else {
                  that.search_form.pageValue = res.data.data[0].code;
                }
              }
              if(that.isFirst){
                that.search();
                that.isFirst = false;
              }
            }
          },
          error: function (err) {
           // that.$message.error('表格请求失败，请刷新页面');
          }
        })
      },
      init(){
        if(!!this.$route.params.searchParam){
            console.log(this.$route.params.searchParam)
          this.projectItem = this.$route.params.searchParam.type;
          this.search_form.arrData = this.$route.params.searchParam.arrData;
          this.search_form.json = this.$route.params.searchParam.json;
          this.search_form.startDate = this.$route.params.searchParam.startDate;
          this.search_form.endDate = this.$route.params.searchParam.endDate;
          this.search_form.product = this.$route.params.searchParam.product;
          this.search_form.pageValue = this.$route.params.searchParam.pageCode;
        }
        this.getProductData();
      //  this.getProductTreeData();
     //   this.getpageSelect();
      }
    },
    created(){
      if(!!this.$route.params.searchParam){
        this.search_form.startDate = this.$route.params.searchParam.startDate;
        this.search_form.endDate = this.$route.params.searchParam.endDate;
      }
    },
    mounted () {
      this.init();
    },
    activated(){
      if(!!this.$route.params.searchParam){
        this.isFirst = true;
        this.init();
      }
    }
  }
</script>


