<template>
  <div class="search-select-link">
    <div class="selection">
      <span class="label">项目:</span>
      <v-select :data="selectData" @select="changeNode($event)" class="singleSelect"></v-select>
    </div>
    <div class="selection">
      <span class="label">区域:</span>
      <el-popover
        placement="bottom-start"
        width="140"
        @show="show"
        @hide="hide"
        trigger="click">
        <div class="city">
          <div class="tool">
            <el-button-group>
              <el-button @click="ProvinceSelectAll(true)">全选</el-button>
              <el-button @click="ProvinceSelectAll(false)">全不选</el-button>
            </el-button-group>
          </div>
          <div class="select-wrap">
            <p v-for="item in province" :key="item.id">
              <el-checkbox v-model="item.chosed" @change="province_change($event)">{{item.text}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':visible_select}">
          <span v-for="item in province" v-show="item.chosed" :key="item.id">{{item.text}},</span>
          <i class="el-icon-arrow-down" :class="{'icon-active':visible_select}"></i>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="selection">
      <span class="label">产品:</span>
      <el-popover
        placement="bottom-start"
        width="140"
        @show="activeShow"
        @hide="activeHide"
        trigger="click">
        <div class="city">
          <div class="tool">
            <el-button-group>
              <el-button @click="tableSelectAll(true)">全选</el-button>
              <el-button @click="tableSelectAll(false)">全不选</el-button>
            </el-button-group>
          </div>
          <div class="select-wrap">
            <p v-for="item in sprojectData" :key="item.id">
              <el-checkbox v-model="item.status" @change="table_change(item)">{{item.sProjectName}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':sactive_select}">
            <span v-for="item in sprojectData" v-show="item.status" :key="item.id">{{item.sProjectName}},</span>
            <i class="el-icon-arrow-down" :class="{'icon-active':sactive_select}"></i>
          </div>
        </div>
      </el-popover>
    </div>
    <slot name="billing"></slot>
    <slot name="entry"></slot>
  </div>
</template>
<script>
  import vSelect from "@/view/component/customSelect/singleSelect"
  export default {
    name: 'search-home',
    components: {
      vSelect
    },
    props: {
      data: Object
    },
    data () {
      return {
        selectData:[],
        province: [],
        product: [],
        nodeProvince: {},
        sprojectData:[],

        node_code: "",
        province_code: "",
        product_code: "",
        sprojectData_code:"",

        visible_select:false,
        active_select:false,
        sactive_select:false
      }
    },
    mounted () {
      this.Getselectdata();
    },
    computed: {
//      selectArr () {
//        return this.$store.getters.getSelectArr;
//      },
//      selectArrState () {
//        return this.$store.getters.getSelectArrState;
//      },
    },
    methods: {

      // 修改chosed属性
      ProvinceSelectAll (state) {
        let that = this;
        that.province.forEach((item, index) => {
          item.chosed = state;
        });
        that.province_change();
      },
      // 修改chosed属性
//      ProductSelectAll (state) {
//        let that = this;
//        that.product.forEach((item, index) => {
//          item.chosed = state;
//        });
//        that.Product_change();
//      },
      // province复选框数据改变
      province_change (select) {
        let that = this;
        let product = [];
        let result = [];
        // 将选中的对象通过数组连接起来
//        that.province.forEach((item, index) => {
//          if (item.chosed) {
//            product = product.concat(item.children);
//          }
//        });
        // 应该是对数据属性筛选
//        product.forEach((item, index) => {
//          let _key = item.attributes.code;
//          item.chosed = true;
//          result.push(item);
//        });
        // 获取到的产品数据
//        that.product = result;
//        result.length > 0 ? that.product_code = result[0].attributes.code : that.product_code = "";
        that.sendData();
      },
      // Product复选框数据改变
//      Product_change (select) {
//        let that = this;
//        let product = [];
//        let hash = {};
//        let result = [];
//        result.length > 0 ? that.product_code = result[0].attributes.code : that.product_code = "";
//        that.sendData();
//      },
      // 项目改变以触发区域的联动
      province_dom () {
        let that = this;
        let product = [];
        let hash = {};
        let result = [];

        that.province.forEach((item, index) => {
          product = product.concat(item.children);
        });
        product.forEach((item, index) => {
          let _key = item.attributes.code;
          if (!hash[_key]) {
            if (index === 0){
              item.chosed = true;
            }else {
              item.chosed = false;
            }
            result.push(item);
            hash[_key] = true;
          }
        });
        // 获取区域的数据
//        that.product = result;
//        that.product_code = result[0].attributes.code;
        that.sendData();
      },
      // 区域数据修改
      nodeChange (selection) {
        let that = this;
        let prov = [];
        that.selectData.forEach((item, index) => {
          if (item.attributes.code == selection) {
            item.children.forEach((obj, i) => {
              that.$set(obj, "chosed", true);
            });
            that.province = item.children;
          }
        });
        that.province.forEach((item, index) => {
          prov.push(item.attributes.code);
        });
        // 默认给区域全选
        that.province_code = prov.join(',');
        that.province_dom();
      },
      touchDom () {
        document.body.click();
      },
      // 产品修改
      productChange(selection){
        let that = this;
        that.product_code = selection;
        that.sendData();
      },
      // 获取初始化的数据
      Getselectdata (){
        let that = this;
//        if (that.selectArr.length ===0 || that.selectArrState === true){
          that.$ajax({
            url: "/ms_bas/ReportAuth/homeTree",
            data: {},
            method: "post",
            success: function (response) {
//              that.$store.commit('changeSelectArr', response.data.data);
//              that.$store.commit('changeSelectArrState', false);
              that.selectData = that.selectData.concat(response.data.data);
//              console.log(that.selectData);
//              that.selectData = that.selectData.slice(0,20);
//              console.log(that.selectData);
              that.initDefault();
            },
            error: function (err) {
              that.$message.error('请求失败搜索条件，请刷新页面');
            }
          })
//        }else {
//          that.selectData = that.selectData.concat(that.selectArr);
//          that.initDefault();
//        }
      },
      // 发送数据，遍历已被选中的城市
      sendData () {
        let that = this;
        let data = {province: that.node_code, city: ""};
        let sProvinceCode =[];
        let sProductCode =[];
        that.province.forEach((item, index) => {
          if (item.chosed) {
            sProvinceCode.push(item.attributes.code);
          }
        });
        data.city=sProvinceCode.join(',');
        data.product=sProductCode.join(',');
//      that.$emit("condition", data);
        that.nodeProvince = {node:that.node_code,province:data.city};
        that.Getproduct();
      },
      // 获取产品bug数据
      Getproduct (){
        let that = this;
        that.sprojectData = [];
        that.$ajax({
          url: "/ms_bas/ReportAuth/getProduct",
          data: that.nodeProvince,
          method: "post",
          success: function (response) {
            that.sprojectData = response.data.data;
            that.initProduct();
          },
          error: function (err) {
            that.$message.error('请求失败搜索条件，请刷新页面');
          }
        })
      },
      // 为获取到的数据添加status属性
      initProduct() {
        let that = this;
        that.sprojectData.forEach((item,index) => {
          item.status = true;
        });
        that.updateParent();
      },
      // 向父级提供数据提供
      updateParent() {
        let that = this;
        that.nodeProvince.product = '';
        let sProductCode = [];
        that.sprojectData.forEach((item, index) => {
          if (item.status) {
            sProductCode.push(item.sProjectCode);
          }
        });
        that.nodeProvince.product = sProductCode.join(',');
        let data = {sNodeCode: that.nodeProvince.node, sProvinceCode: that.nodeProvince.province, sProjectCode: that.nodeProvince.product};
        that.$emit("condition", data);
      },
      sProduct_change(item) {
        let that = this;
        this.$set(item,'status',true);
      },
      //  全选方法
      tableSelectAll(value) {
        let that = this;
        this.$forceUpdate();
        that.sprojectData.forEach((item,index)=> {
          item.status = value;
        });
        this.updateParent();
      },
      table_change(value) {
        this.$forceUpdate();
        this.updateParent();
      },
      // 初始化默认数据
      initDefault(){
        let that = this;
        let defaultSelectData =[];
        let defaultSelect =[];
        that.selectData.forEach((item,index)=>{
          that.$set(item, "chosed", false);
          if (item.attributes.default>0){
            that.$set(item, "chosed", true);
            defaultSelect.push(item);
          }
        });
        if (defaultSelect.length>0){
          defaultSelectData=defaultSelect;
        }else {
          defaultSelectData= that.selectData[0];
        }
        let defaultProduct = [];
        defaultSelectData.forEach((item,index)=>{
          if (index ===0){
            that.node_code = item.attributes.code;
            item.children.forEach((data,k)=>{
              that.$set(data, "chosed", true);
              that.province.push(data);
              if (data.attributes.default>0){
                data.children.forEach((obj,i)=> {
                  if (obj.attributes.default > 0) {
                    defaultProduct.push(obj.attributes.code);
                  }
                });
              }
            });
          }
        });
        let product = [];
        let hash = {};
        let result = [];
        // 产品获取所有的数据
        that.province.forEach((item, index) => {
          product = product.concat(item.children);
        });
        // 设置产品的选中项
        product.forEach((item, index) => {
          let _key = item.attributes.code;
          that.$set(item, "chosed", true);
          result.push(item);
          hash[_key] = true;
        });
        that.product = result;
        that.product_code = defaultProduct[0];
        that.sendData();
      },
      changeNode(item){
        let that =this;
        that.node_code = item.attributes.code;
        that.selectData.forEach((obj,index)=>{
          if (item.text == obj.text) {
            obj.chosed = true;
          } else {
            obj.chosed = false;
          }
        });
        that.nodeChange(that.node_code);
      },
//      changeProduct(item){
//        let that =this;
//        that.product_code = item.attributes.code;
//        that.product.forEach((item,index)=>{
//          item.chosed = false;
//        });
//        item.chosed = true;
//        that.productChange(that.product_code);
//      },
      show(){
        let that = this;
        that.visible_select = true;
      },
      hide(){
        let that = this;
        that.visible_select = false;
      },
      activeShow(){
        let that = this;
        that.sactive_select = true;
      },
      activeHide(){
        let that = this;
        that.sactive_select = false;
      },
      resetSelect() {
        this.selectData=[];
        this.province=[];
        this.product=[];

        this.node_code="";
        this.province_code="";
        this.product_code="";

        this.visible_select=false;
        this.active_select=false;
        this.selectData = this.selectData.concat(this.selectArr);
        this.initDefault();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-select-link{
    display: inline-block;
    vertical-align: middle;
  }
  .selection{
    vertical-align: middle;
    display: inline-block;
    position: relative;
    width: 180px;
    height: 30px;
    padding: 0 0 0 50px;
  }
  .label{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    color: #666;
    font-size: .6rem;
  }
  .select{
    display: inline-block;
    width: 80%;
    position: relative;
    font-size: .8rem;
    color: #333;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .padding-select{
    padding: 0 .6rem;
    margin: 0;
    display: block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 28px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .select span{
    display: inline-block;
    vertical-align: middle;
    height: 1.5rem;
    line-height: 28px;
    font-size: .6rem;
    color: #606266;
  }
  .select i {
    position: absolute;
    right: .4rem;
    top: 50%;
    margin: -.4rem 0 0 0;
    font-size: 14px;
    color: #ccc;
  }
  .select-wrap{
    max-height: 10rem;
    overflow: auto;
    width: 100%;
    padding-right: 0.6rem;
  }
  .selection>.el-select{
    width: 80%;
  }
  .city{
    overflow: hidden;
  }
  .tool{
    text-align: center;
  }
  .singleSelect{
    width: 80%;
    display: inline-block;
  }
  .el-icon-arrow-down{
    transition:transform .3s;
    -moz-transition:-moz-transform .3s; /* Firefox 4 */
    -webkit-transition:-webkit-transform .3s; /* Safari and Chrome */
    -o-transition:-o-transform .3s; /* Opera */
  }
  .icon-active{
    transform:rotate(-180deg);
    -ms-transform:rotate(-180deg); /* Internet Explorer */
    -moz-transform:rotate(-180deg); /* Firefox */
    -webkit-transform:rotate(-180deg); /* Safari 和 Chrome */
    -o-transform:rotate(-180deg); /* Opera */
  }
  .select-focus{
    border-color: #409EFF;
  }
  @media screen and (max-width: 800px) {
    .search-select-link{
      width: 100%;
    }
    .selection{
      width: 100%;
      margin-top: 8px;
    }
    .select{
      width: 80%;
    }
  }
</style>
