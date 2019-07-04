import Vue from 'vue'
import Router from 'vue-router'
//import axios from 'axios'
import Layout from '@/views/layout/Layout'

//Vue.prototype.$http = axios
Vue.use(Router)

export const constantRouterMap = [
  { path: '', component: resolve => require(['@/views/login'], resolve), hidden: true },
  { path: '/login', component: resolve => require(['@/views/login'], resolve), name: 'login', hidden: true },
  { path: '/checkout', name: "checkout", component: resolve => require(['@/views/checkout'], resolve), hidden: true },
  { path: '/user', component: Layout, redirect: '/checkout', name: 'user',
    meta: {title: '用户管理', icon: ''},
    children: [
      {path: 'user', component: resolve => require(['@/views/user/user'], resolve), name: 'userlist', meta: { title: '用户管理', noCache: true },}
    ]
  },
  { path: '', component: Layout, redirect: '/checkout', name: 'audio',
    meta: {title: '资源管理', icon: ''},
    children: [
      {path: 'video', component: resolve => require(['@/views/resource/vedio'], resolve), name: 'vedio', meta: { title: '视频列表', noCache: true }},
      {path: 'video/edit', component: resolve => require(['@/views/resource/vedio/edit'], resolve), name: 'v-edit', meta: { title: '视频详情', noCache: true }, hidden: true},
      {path: 'audio', component: resolve => require(['@/views/resource/audio'], resolve), name: 'audiolist', meta: { title: '音频列表', noCache: true }},
      {path: 'audio/edit', component: resolve => require(['@/views/resource/audio/edit'], resolve), name: 'edit', meta: { title: '音频详情', noCache: true }, hidden: true},
      // {path: 'paint', component: resolve => require(['@/views/resource/paint'], resolve), name: 'paint', meta: { title: '手绘本', noCache: true }},
      // {path: 'chapter', component: resolve => require(['@/views/resource/chapter'], resolve), name: 'chapter', meta: { title: '章节列表', noCache: true }, hidden: false},
      {path: 'paint/edit', component: resolve => require(['@/views/resource/paint/edit'], resolve), name: 'p-edit', meta: { title: '手绘本详情', noCache: true }, hidden: true},
      {path: 'sect', component: resolve => require(['@/views/resource/sect'], resolve), name: 'sect', meta: { title: '剧种列表', noCache: true }},
    ]
  },
  { path: '', component: Layout, redirect: '', name: 'artist',
    meta: {title: '艺人管理', icon: ''},
    children: [
      {path: 'artist', component: resolve => require(['@/views/artist/artist'], resolve), name: 'artistlist', meta: { title: '艺人管理', noCache: true }},
      {path: 'artist/edit', component: resolve => require(['@/views/artist/artist/edit'], resolve), name: 'a-edit', meta: { title: '艺人详情', noCache: true }, hidden: true},
      {path: 'message', component: resolve => require(['@/views/message/message'], resolve), name: 'messagelist', meta: { title: '消息列表', noCache: true }, hidden: true},
      {path: 'noPower', component: resolve => require(['@/views/errorPage/401'], resolve), name: 'noPowerlist', meta: { title: '暂无权限', noCache: true }, hidden: true}
    ]
  },
  { path: '', component: Layout, redirect: '', name: 'gdgd',
    meta: {title: '播放地址', icon: ''},
    children: [
/*      {path: 'bokong', component: resolve => require(['@/views/play/bokong'], resolve), name: 'bokong', meta: { title: '播控平台CDN信息', noCache: true }},
      {path: 'collect', component: resolve => require(['@/views/play/collect'], resolve), name: 'collect', meta: { title: '节点信息汇总', noCache: true }},*/
      {path: 'xjgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'xjgd', meta: { title: '新疆广电', noCache: true }},
/*      {path: 'gdgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'gdgd', meta: { title: '广东广电', noCache: true }},
      {path: 'tjlt', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'tjlt', meta: { title: '联通TV中心', noCache: true }},
      {path: 'tjgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'tjgd', meta: { title: '天津广电', noCache: true }},
      {path: 'sdgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'sdgd', meta: { title: '山东广电', noCache: true }},
      {path: 'hngd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'hngd', meta: { title: '湖南广电', noCache: true }},
      {path: 'jsdx', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'jsdx', meta: { title: '江苏电信', noCache: true }},
      {path: 'OTT', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'OTT', meta: { title: 'OTT节点', noCache: true }},
      {path: 'gxgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'gxgd', meta: { title: '广西广电', noCache: true }},
      {path: 'hbgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'hbgd', meta: { title: '湖北广电', noCache: true }},
      {path: 'gzdx', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'gzdx', meta: { title: '贵州电信', noCache: true }},
      {path: 'sxgd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'sxgd', meta: { title: '山西广电', noCache: true }},
      {path: 'hblt', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'hblt', meta: { title: '河北联通单省节点', noCache: true }},
      {path: 'hbltD', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'hbltD', meta: { title: '河北联通直属节点', noCache: true }},
      {path: 'cxgdS', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'cxgdS', meta: { title: '陕西广电单省节点', noCache: true }},
      {path: 'cxslD', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'cxslD', meta: { title: '陕西丝路直属节点', noCache: true }},
      {path: 'hnltS', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'hnltS', meta: { title: '河南联通单省节点', noCache: true }},
      {path: 'scydS', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'scydS', meta: { title: '四川移动单省节点', noCache: true }},
      {path: 'jxgdS', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'jxgdS', meta: { title: '江西广电单省节点', noCache: true }},
      {path: 'ynyd', component: resolve => require(['@/views/play/gdgd'], resolve), name: 'ynyd', meta: { title: '云南移动单省节点', noCache: true }},*/
    ]
  },
 { path: '', component: Layout, redirect: '/checkout', name: 'tags',
    meta: {title: '标签管理', icon: ''},
    children: [
      {path: 'tagType', component: resolve => require(['@/views/tags/tagType'], resolve), name: 'tagType', meta: { title: '标签类型管理', noCache: true }},
      {path: 'tags', component: resolve => require(['@/views/tags/tags'], resolve), name: 'tags', meta: { title: '标签管理', noCache: true }},
      {path: 'resTag', component: resolve => require(['@/views/tags/resTag'], resolve), name: 'resTag', meta: { title: '资源贴标签', noCache: true }},
      {path: 'program', component: resolve => require(['@/views/program/program'], resolve), name: 'program', meta: { title: '节目单贴标签', noCache: true }},
      // {path: 'album', component: resolve => require(['@/views/album/album'], resolve), name: 'album', meta: { title: '专辑贴标签', noCache: true }},
      // {path: 'course', component: resolve => require(['@/views/tags/course'], resolve), name: 'course', meta: { title: '课程贴标签', noCache: true }, hidden: false},
    ]
  },
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
]
