<template>
  <div class="search-select-link">
    <div class="selection" :class="{'disabled' : disabled}">
      <span class="label">项目:</span>
      <el-popover
        placement="bottom-start"
        :disabled="disabled"
        @show="show(0)"
        @hide="hide(0)"
        width="180"
        trigger="click">
        <div class="province">
          <div class="tool">
            <el-button-group v-if="!disabled">
              <el-button @click="ProvinceChange(null, true)">全选</el-button>
              <el-button @click="ProvinceChange(null, false)">全不选</el-button>
            </el-button-group>
          </div>
          <div class="select-wrap">
            <p v-for="(item, index) in province">
              <el-checkbox
                :disabled="disabled"
                v-model="item.chosed"
                @change="ProvinceChange(item, $event)">{{item.text}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':visible.visible_select1}">
            <span v-for="item in province" v-show="item.chosed">{{item.text}},</span>
            <i class="el-icon-arrow-down" :class="{'icon-active':visible.visible_select1}"></i>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="selection" :class="{'disabled' : disabled}">
      <span class="label">区域:</span>
      <el-popover
        placement="bottom-start"
        :disabled="disabled"
        @show="show(1)"
        @hide="hide(1)"
        width="120"
        trigger="click">
        <div class="city">
          <div class="tool">
            <el-button-group v-if="!disabled">
              <el-button @click="CityChange(null, true)">全选</el-button>
              <el-button @click="CityChange(null, false)">全不选</el-button>
            </el-button-group>
          </div>
          <div class="select-wrap">
            <p
              v-for="(item, index) in city">
              <el-checkbox
                :disabled="disabled"
                v-model="item.chosed"
                @change="CityChange(item, $event)">{{item.text}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':visible.visible_select2}">
            <span v-for="item in city" v-show="item.chosed">{{item.text}},</span>
            <i class="el-icon-arrow-down" :class="{'icon-active':visible.visible_select2}"></i>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="selection" :class="{'disabled' : disabled}">
      <span class="label">产品:</span>
      <el-popover
        placement="bottom-start"
        :disabled="disabled"
        @show="show(2)"
        @hide="hide(2)"
        width="120"
        trigger="click">
        <div class="city">
          <div class="tool">
            <el-button-group v-if="!disabled">
              <el-button @click="ProductChange(null, true)">全选</el-button>
              <el-button @click="ProductChange(null, false)">全不选</el-button>
            </el-button-group>
          </div>
          <p
            v-for="(item, index) in product">
            <el-checkbox
              :disabled="disabled"
              v-model="item.chosed"
              @change="ProductChange(item, $event)">{{item.text}}</el-checkbox>
          </p>
        </div>
        <div class="select" slot="reference">
          <div class="padding-select" :class="{'select-focus':visible.visible_select3}">
            <span v-for="item in product" v-show="item.chosed">{{item.text}},</span>
            <i class="el-icon-arrow-down" :class="{'icon-active':visible.visible_select3}"></i>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search-select-link',
  props: {
    data: Object,
    defaultChosed: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    defaultType: { // model-1: 默认全选 | model-2： 产品默认单选乐享音乐
      type: String,
      default: "model-1"
    }
  },
  computed: {
    defaultNode () {
      let that = this;
      let result = {};
      let pre = "node_";

      if (that.defaultChosed) {
        that.defaultChosed.chosedNode = that.defaultChosed.chosedNode.replace(/021200,021301/g, "021200_021301");
        that.defaultChosed.chosedNode.split(",").forEach((item, index) => {
          result[pre + item] = true;
        });
      }

      return result;
    },
    defaultArea () {
      let that = this;
      let result = {};
      let pre = "area_";

      if (that.defaultChosed) {
        that.defaultChosed.chosedArea.split(",").forEach((item, index) => {
          result[pre + item] = true;
        });
      }

      return result;
    },
    defaultProject () {
      let that = this;
      let result = {};
      let pre = "project_";

      if (that.defaultChosed) {
        that.defaultChosed.chosedProject.split(",").forEach((item, index) => {
          result[pre + item] = true;
        });
      }

      return result;
    },
    storeSelectArr () {
      return this.$store.getters.getSelectArr;
    },
    storeSelectArrState () {
      return this.$store.getters.getSelectArrState;
    }
  },
  data () {
    return {
      //component data
      selectData:[],
      province: [],
      city: [],
      product: [],

      //export data
      province_code: "",
      city_code: "",
      product_code: "",

      visible: {
        visible_select1: false,
        visible_select2: false,
        visible_select3: false
      },
    }
  },
  mounted () {
    this.Getselectdata();
  },
  methods: {
    ProductChange (item, select) {
      let that = this;

      if (item == null) {
        that.product.forEach((obj, index) => {
          obj.chosed = select;
        });
      }

      that.sendData();
    },
    CityChange (item, select) {
      let that = this;
      if (item == null) {
        that.city.forEach((obj, index) => {
          obj.chosed = select;
        });
      }
      that.ProductChosedRenew();
      that.sendData();
    },
    ProvinceChange (item, select) {
      let that = this;
      if (item == null) {
        that.province.forEach((obj, index) => {
          obj.chosed = select;
        });
      }
      that.CityChosedRenew();
      that.sendData();
    },
    ProductChosedRenew () {
      let that = this;
      let hash_product = {};
      let arr_product = [];

      that.city.forEach((item, index) => {
        if (item.chosed) {
          item.children.forEach((obj, i) => {
            if (!hash_product[obj.attributes.code]) {
              hash_product[obj.attributes.code] = true;
              that.$set(obj, "chosed", true);
              arr_product.push(obj);
            }
          });
        }
      });

      that.product = arr_product;
    },
    CityChosedRenew () {
      let that = this;
      let hash_city = {};
      let hash_product = {};
      let arr_city = [];
      let arr_product = [];
      that.province.forEach((item, index) => {
        if (item.chosed) {
          item.children.forEach((obj, i) => {
            if (!hash_city[obj.attributes.code]) {
              hash_city[obj.attributes.code] = true;
              that.$set(obj, "chosed", true);
              arr_city.push(obj);
            }else {
              arr_city.forEach((pro, key) => {
                if(obj.attributes.code === pro.attributes.code)
                  obj.children.forEach((child,j) => {
                    pro.children.push(child);
                  })
              })
            }
            /*if (item.attributes.code == "021200") {
              if (hash_city[obj.attributes.code]) {
                arr_city.forEach((o, k) => {
                  if (o.attributes.code == obj.attributes.code) {
                    o.children = obj.children.concat(o.children);
                  }
                });
              } else {
                hash_city[obj.attributes.code] = true;
                that.$set(obj, "chosed", true);
                arr_city.push(obj);
              }
            } else if (!hash_product[obj.attributes.code]) {
              hash_city[obj.attributes.code] = true;
              that.$set(obj, "chosed", true);
              arr_city.push(obj);
            }*/
          });
        }
      });

      arr_city.forEach((item, index) => {
        if (item.chosed) {
          item.children.forEach((obj, i) => {
            if (!hash_product[obj.attributes.code]) {
              hash_product[obj.attributes.code] = true;
              that.$set(obj, "chosed", true);
              arr_product.push(obj);
            }
          });
        }
      });
      that.city = arr_city;
      that.product = arr_product;
    },
    InitProduct () {
      let that = this;
      let hash_product = {};
      let arr_product = [];
      let pre = "project_";

      that.city.forEach((item, index) => {
        if (item.chosed) {
          item.children.forEach((obj, i) => {
            if (!hash_product[obj.attributes.code]) {
              hash_product[obj.attributes.code] = true;
              that.$set(obj, "chosed", true);
              arr_product.push(obj);
            }
          });
        }
      });

      if (that.defaultChosed) {
        arr_product.forEach((item, index) => {
          if (that.defaultProject[pre + item.attributes.code]) {
            item.chosed = true;
          } else {
            item.chosed = false;
          }
        });
      } else if (that.defaultType == "model-2") {
        let has_lxyy = false;
        arr_product.forEach((item, index) => {
          if (item.attributes.code == "lxyy") {
            item.chosed = true;
            has_lxyy = true;
          } else {
            item.chosed = false;
          }
        });

        if (!has_lxyy) {
          arr_product[0].chosed = true;
        }
      }

      that.product = arr_product;
      that.sendData();
    },
    InitCity () {
      let that = this;
      let hash_city = {};
      let arr_city = [];
      let pre = "area_";
      that.province.forEach((item, index) => {
        if (item.chosed) {
          item.children.forEach((obj, i) => {
            if (!hash_city[obj.attributes.code]) {
              hash_city[obj.attributes.code] = true;
              that.$set(obj, "chosed", true);
              arr_city.push(obj);
            }
          });
        }
      });
      if (that.defaultChosed) {
        arr_city.forEach((item, index) => {
          if (that.defaultArea[pre + item.attributes.code]) {
            item.chosed = true;
          } else {
            item.chosed = false;
          }
        });
      }


      that.city = arr_city;
      that.InitProduct();
    },
    InitProvince () {
      let that = this;
      let pre = "node_";
      that.selectData.forEach((item, index) => {
        if (item.attributes.code == "021200,021301") {
          item.attributes.resCode = "021200_021301";
        }
        that.$set(item, "chosed", true);
        that.province.push(item);
      });

      if (that.defaultChosed) {
        that.province.forEach((item, index) => {
          if (that.defaultNode[pre + item.attributes.resCode] || that.defaultNode[pre + item.attributes.code]) {
            item.chosed = true;
          } else {
            item.chosed = false;
          }
        });
      }

      that.InitCity();
    },
    sendData () {
      let data = {sNodeCode: "", sProvinceCode: "", sProjectCode: ""};
      let that = this;

      that.province.forEach((item, index) => {
        if (item.chosed) {
          data.sNodeCode += (data.sNodeCode.length > 0 ? "," + item.attributes.code : item.attributes.code);
        }
      });

      that.city.forEach((item, index) => {
        if (item.chosed) {
          data.sProvinceCode += (data.sProvinceCode.length > 0 ? "," + item.attributes.code : item.attributes.code);
        }
      });

      that.product.forEach((item, index) => {
        if (item.chosed) {
          data.sProjectCode += (data.sProjectCode.length > 0 ? "," + item.attributes.code : item.attributes.code);
        }
      });

      data.sNodeCode = data.sNodeCode.replace(/_/g, ",");
      that.$emit("condition", data);
    },
    Getselectdata (){
      let that = this;
      if (that.storeSelectArrState === false && that.storeSelectArr.length > 0) {
        //that.selectData = that.storeSelectArr;
        that.selectData = JSON.parse(JSON.stringify(that.storeSelectArr));
        that.InitProvince();
        return;
      }
      this.$ajax({
        url: "/ms_bas/ReportAuth/getReportAuth.do",
        data: {},
        method: "post",
        success: function (response) {
          that.selectData = response.data.data;
          that.InitProvince();
          that.$store.commit("changeSelectArr", that.selectData);
          that.$store.commit("changeSelectArrState", false);
        },
        error: function (err) {
          that.$message.error('请求失败搜索条件，请刷新页面');
          that.InitProvince();
        }
      });
    },
    show(val){
      let that = this;
      if (val ===0){
        that.visible.visible_select1 = true;
      }else if(val === 1) {
        that.visible.visible_select2 = true;
      }else if(val === 2) {
        that.visible.visible_select3 = true;
      }

    },
    hide(val){
      let that = this;
      if (val ===0){
        that.visible.visible_select1 = false;
      }else if(val === 1) {
        that.visible.visible_select2 = false;
      }else if(val === 2) {
        that.visible.visible_select3 = false;
      }
    }
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
    padding: 0 0 0 50px;
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
  .city{
    overflow: hidden;
  }
  .select-wrap{
    width: 100%;
    padding: 0 .6rem 0 0;
  }
  /*.select{*/
    /*display: inline-block;*/
    /*width: 80%;*/
    /*position: relative;*/
    /*font-size: .8rem;*/
    /*color: #333;*/
    /*border: 1px solid #ddd;*/
    /*border-radius: 5px;*/
    /*padding: 0 .3rem;*/
    /*overflow: hidden;*/
    /*cursor: pointer;*/
    /*height: 26px;*/
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
  /*}*/
  /*.select > span{*/
    /*height: 26px;*/
    /*line-height: 26px;*/
    /*font-size: .6rem;*/
    /*color: #999;*/
  /*}*/
  /*.select i {*/
    /*position: absolute;*/
    /*right: .3rem;*/
    /*top: 50%;*/
    /*margin: -.3rem 0 0 0;*/
    /*font-size: 12px;*/
    /*color: #ccc;*/
  /*}*/
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
    max-height: 20rem;
    overflow: auto;
  }
  .tool{
    text-align: center;
  }
  .disabled .select {
    color: #c0c4cc;
    background: #f5f7fa;
    border-color: #e4e7ed;
    cursor: no-drop;
  }
  .disabled .select span {
    color: #c0c4cc;
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
    }
    .select{
      width: 80%;
    }
  }
</style>
