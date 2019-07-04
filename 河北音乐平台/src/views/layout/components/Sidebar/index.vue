<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="route"
      :collapse="isCollapse"
      text-color="#000">
      <!-- <sidebar-item :routes="permission_routers"></sidebar-item> -->
      <template
        v-for="item in permission_routers"
        v-if="test(item)">

        <router-link
          v-if="item.children && item.children.length == 1"
          :to="item.path+'/'+item.children[0].path"
          :key="item.name">
          <el-menu-item
            :index="item.path+'/'+item.children[0].path">
            <svg-icon
              v-if="item.children[0].meta&&item.children[0].meta.icon"
              :icon-class="item.children[0].meta.icon"></svg-icon>
            <span
              v-if="item.children[0].meta&&item.children[0].meta.title"
              slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </router-link>

        <sidebar-item v-else :routes="[item.children]" :itempath="item.path" :meta="item.meta" :name="item.name"></sidebar-item>

      </template>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    route () {
      let path = this.$route.path.replace(/\//, '').split("/")[0];
      return path && path.length > 0 ? '/' + path : this.$route.path;
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  mounted () {
    //console.log(this.permission_routers)
  },
  methods: {
    test(item) {
      if(!item.hidden&&item.children){
//        console.log(item.meta.title);
        if(item.meta.title === '用户管理') {
          if(this.$store.state.RouteState.userInfo === 'all') {
            return true;
          }else {
            return false;
          }
        }else {
          return true;
        }
      }
    }
  }
}
</script>

<style>
  .el-menu {
    background: #f5f5f5;
  }
  .el-menu-item.is-active{
    color: #fff !important;
    background-color: #409EFF !important;
  }
</style>
