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
            <p v-for="item in province">
              <el-checkbox v-model="item.chosed" @change="province_change($event)">{{item.text}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':visible_select}">
          <span v-for="item in province" v-show="item.chosed">{{item.text}},</span>
          <i class="el-icon-arrow-down" :class="{'icon-active':visible_select}"></i>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="selection">
      <span class="label">产品:</span>
      <v-select :data="product" @select="changeProduct($event)" class="singleSelect"></v-select>
    </div>
    <div class="selection identify">
      <span class="label">入口标识:</span>
      <el-input v-model="entryName" placeholder="请输入入口标识" @change="changeData()"></el-input>
    </div>
  </div>
</template>

<script>
import vSelect from "@/view/component/customSelect/singleSelect"
export default {
  name: 'search-summaryInput',
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
      entryName: "",

      node_code: "",
      province_code: "",
      product_code: "",

      visible_select:false
    }
  },
  mounted () {
    this.Getselectdata();
  },
  computed: {
    selectArr () {
      return this.$store.getters.getSelectArr;
    },
    selectArrState () {
      return this.$store.getters.getSelectArrState;
    },
  },
  methods: {
     changeData(){
      this.sendData();
    },
    ProvinceSelectAll (state) {
      let that = this;
      that.province.forEach((item, index) => {
        item.chosed = state;
      });
      that.province_change();
    },
    province_change (select) {
      let that = this;
      let product = [];
      let hash = {};
      let result = [];

      that.province.forEach((item, index) => {
        if (item.chosed) {
          product = product.concat(item.children);
        }
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

      that.product = result;
      result.length > 0 ? that.product_code = result[0].attributes.code : that.product_code = "";
      that.sendData();
    },
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

      that.product = result;
      that.product_code = result[0].attributes.code;
      that.sendData();
    },
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

      that.province_code = prov.join(',');
      that.province_dom();
    },
    touchDom () {
      document.body.click();
    },
    productChange(selection){
      let that = this;
      that.product_code = selection;
      that.sendData();
    },
    Getselectdata (){
      let that = this;
      if (that.selectArr.length ===0 || that.selectArrState === true){
        that.$ajax({
          url: "/ms_bas/ReportAuth/getReportAuth.do",
          data: {},
          method: "post",
          success: function (response) {
            that.$store.commit('changeSelectArr', response.data.data);
            that.$store.commit('changeSelectArrState', false);
            that.selectData = that.selectData.concat(response.data.data);
            that.initDefault();
          },
          error: function (err) {
            that.$message.error('请求失败搜索条件，请刷新页面');
          }
        })
      }else {
        that.selectData = that.selectData.concat(that.selectArr);
        that.initDefault();
      }
    },
    sendData () {
      let that = this;
      let data = {province: that.node_code, city: "", product: that.product_code,entryName:that.entryName};
      let sProvinceCode =[];
      that.province.forEach((item, index) => {
        if (item.chosed) {
          sProvinceCode.push(item.attributes.code);
        }
      });
      data.city=sProvinceCode.join(',');
      that.$emit("condition", data);
    },
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

      that.province.forEach((item, index) => {
        product = product.concat(item.children);
      });

      product.forEach((item, index) => {
        let _key = item.attributes.code;
        if (!hash[_key]) {
          if (item.attributes.code === defaultProduct[0]){
            that.$set(item, "chosed", true);
          }else {
            that.$set(item, "chosed", false);
          }
          result.push(item);
          hash[_key] = true;
        }
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
    changeProduct(item){
      let that =this;
      that.product_code = item.attributes.code;
      that.product.forEach((item,index)=>{
        item.chosed = false;
      });
      item.chosed = true;
      that.productChange(that.product_code);
    },
    show(){
      let that = this;
      that.visible_select = true;
    },
    hide(){
      let that = this;
      that.visible_select = false;
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
  .identify {
    width: 200px;
    padding: 0 0 0 70px;
  }
  .el-input--mini .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-input {
    width: 70%;
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
