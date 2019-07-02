import Vue from 'vue'

const sidebar = [
  {path: "home", name: "home", text: "首页"},
  {path: "systemManage", name: "systemManage", text: "系统管理",children:[
    {path: "userManage", name: "userManage", text: "用户管理"},
    {path: "menuManage", name: "menuManage", text: "菜单管理"},
    {path: "roleManage", name: "roleManage", text: "角色管理"},
    {path: "orgManage", name: "orgManage", text: "组织机构",children:[
      {path: "userManage", name: "userManage", text: "用户管理"},
      {path: "menuManage", name: "menuManage", text: "菜单管理"},
      {path: "roleManage", name: "roleManage", text: "角色管理"},
      {path: "orgManage", name: "orgManage", text: "组织机构"},
    ]},
  ]},
  {path: "operationManage", name: "operationManage", text: "业务管理",children:[
    {path: "productOnLine", name: "productOnLine", text: "产品上线管理"},
  ]},
  {path: "general", name: "general", text: "概况",children:[
    {path: "summary", name: "summary", text: "常规汇总报表"},
    {path: "daily", name: "daily", text: "项目日报"},
    {path: "marketsReport", name: "marketsReport", text: "营销运营报表"},
  ]},
  {path: "pages", name: "pages", text: "页面分析",children:[
    {path: "pageAnalysis", name: "pageAnalysis", text: "页面分析"},
    {path: "zoneAnalysis", name: "zoneAnalysis", text: "区域分析"},
    {path: "partAnalysis", name: "partAnalysis", text: "运营位分析"},
  ]},
];

const install = function () {
  Vue.prototype.$sidebar = sidebar;
}

export default {
  install
}
