<style scoped>
  .search-index { padding: .2rem;  }
  .search-select-link{ display: inline-block; vertical-align: middle; padding: .3rem 0;  }
  .el-select{left: 35px;}
  .selection{  display: inline-block;  position: relative;  width: 180px;  padding: 0 20px 0 35px;margin: 8px 14px;  }
  .label{  display: inline-block;  position: absolute;  left: 0;  top: 0;  line-height: 27px;  color: #666; font-size: .65rem;  }
  .btns {  display: inline-block;  vertical-align: top;  padding: .3rem 0;  }
  @media screen and (max-width: 800px) {
    .selection{width: 100%;}
    .search-index {position: fixed;  top: 3rem;  left: 0;  right: 0;  z-index: 6;  background: #fff;  padding: 1.2rem;  display: none;  }
  }
</style>
<template>
  <div class="pa-pages-search">
    <div class="search-index">
      <div>
        <v-date buttons="['yesterday', 'sevenday', 'nearthirty','nearsixty']" dateModel="2" default-date="sevenday" @getDate="getDate($event)"></v-date>
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
      <el-select v-model="productValue" placeholder="请选择产品" @change="getProductTreeData()">
        <el-option v-for="productItem in productList" :key="productItem.code"  :label="productItem.text" :value="productItem.code"></el-option>
      </el-select>
    </div>
    <div class="selection" style="display: inline-block;margin: 8px 14px;width: 232px">
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
            <el-tree :data="treeData" show-checkbox @check="check" node-key="id" ref="tree" ></el-tree>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="selection">
      <div class="btns">
        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
  </div>

</template>

<script>
  import vDate from "@/view/component/search/search-date-select"
  export default {
    name: "pageAnalysis-search",
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
          NotOTTtree:"/ms_bas/api/tree"
        },
        productValue:'',
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
          arrData:[],
        }
      }
    },
    computed: {
    },
    watch:{
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
              that.productValue = res.data.data[0].code;
              that.getProductTreeData();
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        });
      },
      getProductTreeData() {
        const that = this;
        let url = '';
        this.search_form.type = this.projectItem;
        this.search_form.product = this.productValue;
        if(this.projectItem === 1) {
          url = that.url.OTTtree;
        } else {
          url = that.url.NotOTTtree;
        }
        that.$ajax({
          url: url,
          data: {product:that.productValue},
          method: "post",
          success: function (res) {
            if(res.status){
                that.treeData = res.data.data;
                that.$emit('toParent',that.search_form);
            }
          },
          error: function (err) {
            that.$message.error('表格请求失败，请刷新页面');
          }
        })
      },
      getDate(data) {
        this.search_form.startDate = data.dateSart;
        this.search_form.endDate = data.dateEnd;
      },
      check(data, checked) {
        let arr = [];
        this.$refs.tree.getCheckedNodes(true,false).forEach(i => {
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
        this.$refs.tree.setCheckedKeys(arr, false);
        this.search_form.json = arr.toString();
        this.search_form.arrData = arr;
      },
      moveCheck() {
        this.$refs.tree.setCheckedKeys([], false);
        this.search_form.json = '';
        this.search_form.arrData = [];
      },
      search() {
          this.$emit('toParent',this.search_form);
      }
    },
    created() {
      this.getProductData();
      this.getProductTreeData();
    },
    updated() {
      this.allCheck();
    }
  }
</script>


