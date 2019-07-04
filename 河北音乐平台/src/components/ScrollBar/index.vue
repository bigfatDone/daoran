<template>
  <div class="scroll-container" ref="scrollContainer">
    <div class="scroll-wrapper" ref="scrollWrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const delta = 15
export default {
  name: 'scrollBar',
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/variables.less';
#app .hideSidebar .sidebar-container{
  width: 0px !important;
}
.scroll-container {
  background-color: #f5f5f5;
  .scroll-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: -50px;
    bottom: 60px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
