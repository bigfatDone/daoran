<template>
  <ul>
    <!-- <li v-for="item in leftData">
      <i class="el-icon-plus" v-if="item.children"></i>
      <el-checkbox 
        v-model="item.checked" 
        @change="selectChange(item, $event)">{{item.text}}</el-checkbox>
      <role-left-list 
        v-if="item.children" 
        :left-data="item.children" 
        @choseAll="choseAll(item, $event)"></role-left-list>
    </li> -->
    <template v-if="leftData.length > 0">
      <li v-for="item in leftData">
        <i 
          class="icon-more el-icon-arrow-down" 
          :class="{'ChildActive' : item.children.show}"
          v-if="item.children" 
          @click="item.children.show = !item.children.show"></i>
        <el-checkbox 
          v-model="item.checked" 
          @change="selectChange(item, $event)">
        </el-checkbox>
        <label @click="item.children.show = !item.children.show" class="checkboxLable" :class="{'item_chosed' : item.checked}">{{item.text}}</label>
        <role-left-list 
          v-if="item.children" 
          v-show="item.children.show"
          :left-data="item" 
          @choseAll="choseAll(item, $event)"></role-left-list>
      </li>
    </template>
    <template v-else>
      <li v-for="item in leftData.children">
        <i 
          class="icon-more el-icon-arrow-down" 
          :class="{'ChildActive' : item.children.show}"
          v-if="item.children" 
          @click="item.children.show = !item.children.show"></i>
        <el-checkbox 
          v-model="item.checked" 
          @change="selectChange(item, $event)">
          {{item.text}}
        </el-checkbox>
        <role-left-list 
          v-if="item.children"
          v-show="item.children.show" 
          :left-data="item" 
          @choseAll="choseAll(item, $event)"></role-left-list>
      </li>
    </template>
  </ul>
</template>

<script>
  export default {
    name: "roleLeftList",
    props: ["leftData"],
    components: {
      
    },
    data () {
      return {
        chosed_count: 0,
        select_len: 0,
      }
    },
    computed: {
      listData () {
        return this.leftData;
      },
    },
    mounted () {
      this.init();
    },
    activated () {

    },
    methods: {
      choseAll (obj, state) {
        let that = this;

        obj.checked = state;
      },
      init () { //初始化-暂停
        let that = this;
        let parent = that.leftData;
        let child = parent.children;
        if (child) {
          let count = 0;
          //child.show = true;
          that.$set(child, "show", true);
          child.forEach((item, index) => {
            if (item.checked) {
              count += 1;
            }
          });

          if (count > 0) {
            //console.log(parent.text + "-----选中上级");
            parent.checked = true;
          } else {
            //console.log(parent.text + "-----取消上级选中");
            parent.checked = false;
          }
        }
      },
      modification (arr, select) {
        let that = this;
        arr.forEach((item, index) => {
          item.checked = select;
          if (item.children) {
            that.modification(item.children);
          }
        });
      },
      selectChange (obj, select) {
        let that = this;
        let parent = that.leftData;
        let item = obj;
        that.chosed_count = 0;
        if (obj.children) {
          that.modification(obj.children, select);
        }
        if (parent.children) {
          let count = 0;
          parent.children.forEach((item, index) => {
            if (item.checked) {
              count += 1;
            }
          });

          if (count > 0) {
            parent.checked = true;
          } else if (count == 0) {
            parent.checked = false;
          }
        }
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
    line-height: 1.2rem;
    font-size: .7rem;
    color: #000;
  }
  li ul {
    margin: .3rem 0 .3rem 1.2rem;
  }
  .checkboxLable{
    display: inline-block;
    font-size: .7rem;
    color: #666;
    margin: 0 0 0 .3rem;
    cursor: pointer;
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
