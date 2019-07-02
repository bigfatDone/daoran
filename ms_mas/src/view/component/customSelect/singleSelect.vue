<template>
  <el-popover
    v-model="visible_select"
    :disabled="disable"
    placement="bottom-start"
    popper-class="custom-select"
    width="173"
    trigger="click">
    <el-collapse-transition>
      <div class="select-wrap">
        <span v-for="item in data" class="select-span" :class="{'select-span-active':item.chosed}" @click="select(item)">{{item.text}}</span>
      </div>
    </el-collapse-transition>
    <div class="select" slot="reference">
      <div class="padding-select" :class="{'select-focus':visible_select,'disabled':disable}">
        <span v-if="selected">{{selected.text}}</span>
        <span class="placeholder" v-else>{{placeholder || "请选择"}}</span>
        <i class="el-icon-arrow-down" :class="{'icon-active':visible_select}"></i>
      </div>
    </div>
  </el-popover>
</template>

<script>
  export default {
    name: 'singleSelect',
    props: ['data','placeholder','disable','init','addVisible'],
    data () {
      return {
        visible_select:false,
        selected: null,
      }
    },
    mounted () {
      this.initChosed();
      this.selected = null;
    },
    watch: {
      addVisible(ev){
        this.selected = null;
      },
      data (ev) {
        this.initChosed();
      },
      init(){
        this.initChosed();
      }
    },
    /*computed: {
      selected () {
        let that = this;
        let result = null;

        for (let i=0; i<that.data.length; i++) {
          let item = that.data[i];
          if (item.chosed) {
            result = item;
            break;
          }
        }
        return result;
      }
    },*/
    methods: {
      initChosed () {
        let that = this;
        let result = null;

        for (let i=0; i<that.data.length; i++) {
          let item = that.data[i];
          if (item.chosed) {
            result = item;
            break;
          }
        }

//        that.selected = result == null ? that.data[0] : result;
        that.selected = result;
      },
      select(item){
        let that =this;
        that.selected = item;
        that.$emit("select", item);
        that.visible_select = false;
      },
    }
  }
</script>
<style scoped>
  .select{
    display: inline-block;
    width: 100%;
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
    right: .5rem;
    top: 50%;
    margin: -.3rem 0 0 0;
    font-size: 14px;
    color: #ccc;
  }
  .custom-select .select-wrap{
    max-width: 12rem;
    max-height: 10rem;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding: 10px 0;
  }
  .select-group{
    padding: 0;
  }
  .select-span{
    display: block;
    padding: 6px 0 6px 15px;
    width: 100%;
  }
  .select-span:hover{
    background: #f5f7fd;
    cursor: pointer;
  }
  .select-span-active{
    color: #409EFF;
    font-weight: 700;
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
  .placeholder{
    color: #bbb !important;
  }
  .disabled{
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    cursor: not-allowed;
  }
  .disabled span{
    color: #c0c4cc;
  }
</style>
