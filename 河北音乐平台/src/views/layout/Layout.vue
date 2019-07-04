<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="tagContain">
      <navbar></navbar>
    </div>
    <div class="main-container">
      <app-main class="appMain"></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/mixin.less";
  .main-container {
    padding: 60px 0 0 0;
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .appMain{
      padding: 20px;
    }
  }
  .tagContain {
    position: fixed;
    z-index: 3;
    left: 0;
    top: 0;
    right: 0;
    height: 60px;
    background: #4385f5;
  }
</style>
