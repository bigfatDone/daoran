<template>
  <!-- <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div> -->
  <el-submenu :index="name" v-if="judge(meta.title)">
    <template v-for="item in routes" v-if="item.path && !item.hidden">
      <router-link :to="item.path" :key="item.name">
        <el-menu-item :index="item.path">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </router-link>
    </template>

    <template v-else>
      <template slot="title">
        <svg-icon v-if="meta&&meta.icon" :icon-class="meta.icon"></svg-icon>
        <span v-if="meta&&meta.title && userInfo == 'admin'" slot="title">{{meta.title}}</span>
      </template>
      <template v-for="item in routes[0]" v-if="judSecond(item)">
        <router-link v-if="!item.hidden && !item.children" :to="itempath + '/' + item.path" :key="item.name">
          <el-menu-item :index="itempath + '/' + item.path">
            <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </router-link>
        <sidebar-item v-if="item.children" :routes="[item.children]" :itempath="item.path" :meta="item.meta" :name="item.name"></sidebar-item>
      </template>
    </template>
  </el-submenu>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  name: 'SidebarItem',
  props: {
    name: {
      type: String
    },
    meta: {
      type: Object
    },
    itempath: {
      type: String
    },
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userInfo: 'admin'
    }
  },
  watch: {
//    routes:function (val) {
//      console.log(val);
//    }
  },
  methods: {
//      二级菜单
    judSecond(item){
      if(item.meta.title === '剧种列表') {
        if(this.$store.state.RouteState.userInfo === 'all') {
          return true;
        }else {
          return false;
        }
      }else {
        return true;
      }
    },
//    一级菜单
    judge(data) {
//        console.log(data);
      if(data === '标签管理') {
          if(this.$store.state.RouteState.userInfo === 'all') {
              return true;
          }else {
            return false;
          }
      }else {
        return true;
      }
    },
    hasOneShowingChildren (children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    generateTitle
  }
}
</script>
