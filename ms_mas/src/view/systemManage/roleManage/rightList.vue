<template>
  <ul>
    <template v-if="rightData.length > 0">
      <li v-for="item in rightData">
        <i 
          class="icon-more el-icon-arrow-down" 
          :class="{'ChildActive' : item.show}"
          v-if="item.children" 
          @click="item.show = !item.show"></i>
        <el-checkbox 
          v-model="item.checked"
          @change="choseChild(item, $event, rightData)"></el-checkbox>
          <label @click="item.show = !item.show" :class="{'item_chosed' : item.checked}">{{item.text}}</label>
        <el-switch
          v-if="!Number(item.attributes.code)"
          size="mini"
          :value="item.attributes.default | Chosed"
          @change="change(item, $event)"
          active-color="#67c23a"
          inactive-color="#eee">
        </el-switch>
        <role-right-list 
          v-if="item.children" 
          v-show="item.show"
          :right-data="item"
          @selectNode="changeParent($event, item)"></role-right-list>
      </li>
    </template>
    <template v-else>
      <li v-for="item in rightData.children">
        <i 
          class="icon-more el-icon-arrow-down" 
          :class="{'ChildActive' : item.show}"
          v-if="item.children" 
          @click="item.show = !item.show"></i>
        <el-checkbox 
          v-model="item.checked"
          @change="choseChild(item, $event, rightData)"></el-checkbox>
          <label @click="item.show = !item.show" :class="{'item_chosed' : item.checked}">{{item.text}}</label>
        <el-switch
          v-if="!Number(item.attributes.code)"
          size="mini"
          :value="item.attributes.default | Chosed"
          @change="change(item, $event)"
          active-color="#67c23a"
          inactive-color="#eee">
        </el-switch>
        <role-right-list 
          v-if="item.children" 
          v-show="item.show"
          :right-data="item"
          @selectNode="changeParent($event, item)"></role-right-list>
      </li>
    </template>
  </ul>
</template>

<script>
  export default {
    name: 'roleRightList',
    props: ["rightData"],
    filters: {
      Chosed (val) {
        return val == 1 ? true : false;
      },
    },
    mounted () {
      this.dataInit(this.rightData);
    },
    methods: {
      changeParent (child, parent) {
        let that = this;
        parent.checked = child.checked;
        this.rightData.checked = child.checked;
      },
      formatData () {
        let that = this;
        if (that.rightData.length > 0) {
          that.rightData.forEach((item, index) => {
            that.$set(item, "visiable", true);
          });
        } else if (that.rightData.children) {
          that.rightData.children.forEach((item, index) => {
            that.$set(item, "visiable", true);
          });
        }
      },
      dataInit (arr) {
        let that = this;
        that.formatData();

        if (arr.length > 0) {
          arr.forEach((item, index) => {
            that.$set(item, "show", true);
          });
        }

        if (arr.children) {
          for (let i=0; i<arr.children.length; i++) {
            let item = arr.children[i];
            if (item.children) {
              that.$set(item, "show", true);
              that.dataInit(item);
            } else if (item.checked) {
              arr.checked = true;
              that.$emit("selectNode", {obj: arr, checked: true});
              break;
            }
          }
        }
      },
      change (obj, select) {
        let that = this;
        obj.attributes.default = select == true ? 1 : 0;
      },
      choseChild (obj, select, parent) {
        let that = this;
        let checked = false;

        if (obj.children) { // 处理当前节点子项目
          obj.children.forEach((item, index) => {
            item.checked = select;
            if (item.children) {
              that.choseChild(item, select);
            }
          });
        }

        if (select) {// 处理当前节点父级
          checked = true;
        } else if(parent && parent.children) {
          for (let i=0; i<parent.children.length; i++) {
            let item = parent.children[i];
            if (item.checked) {
              checked = true;
              break;
            }
          }
        }

        that.$emit("selectNode", {obj: parent, checked: checked});
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul{
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
    line-height: 1.4rem;
    font-size: .7rem;
    color: #000;
    white-space: nowrap;
  }
  li ul {
    margin: .3rem 0 .3rem 1.2rem;
  }

  .icon-more {
    transform:rotate(270deg) !important;
    -ms-transform:rotate(270deg) !important;  
    -moz-transform:rotate(270deg) !important;  
    -webkit-transform:rotate(270deg) !important; 
    -o-transform:rotate(270deg) !important; 
    transition: transform .3s;
  }
  .ChildActive {
    transform:rotate(360deg) !important;
    -ms-transform:rotate(360deg) !important;  
    -moz-transform:rotate(360deg) !important;  
    -webkit-transform:rotate(360deg) !important; 
    -o-transform:rotate(360deg) !important;  
  }
  .item_chosed{
    color: #409eff !important;
  }
</style>
