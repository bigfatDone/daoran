import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/view/layout'

Vue.use(Router);

export default new Router({
  history: false,
  routes: [
    {
      path: '/',
      name: '',
      component: layout,
      children: [
        // {path: '', redirect: 'login'},
        {path: '', redirect: 'home'},
        //首页
        {path: 'home', name: 'home', component: () => import('@/view/home'), text: "首页"},
        //概况
        {path: 'summarys', name: 'summarys', component: () => import('@/view/general/summary'), text: "常规汇总报表"},
        {path: 'daily', name: 'daily', component: () => import('@/view/general/daily'), text: "项目日报"},
        {path: 'dailyDetail', name: 'dailyDetail', component: () => import('@/view/general/daily-detail'), text: "项目日报详情"},
        {path: 'marketsReport', name: 'marketsReport', component: () => import('@/view/general/marketsReport'), text: "营销运营报表"},
        //系统管理
        {path: 'userManage', name: 'userManage', component: () => import('@/view/systemManage/userManage'), text: "用户管理"},
        {path: 'menuManage', name: 'menuManage', component: () => import('@/view/systemManage/menuManage'), text: "菜单管理"},
        {path: 'roleManage', name: 'roleManage', component: () => import('@/view/systemManage/roleManage/roleManage'), text: "角色管理"},
        {path: 'orgManage', name: 'orgManage', component: () => import('@/view/systemManage/orgManage'), text: "组织机构"},
        //业务管理
        {path: 'productOnLine', name: 'productOnLine', component: () => import('@/view/operationManage/productOnLine'), text: "产品上线管理"},
        {path: 'problemManage', name: 'problemManage', component: () => import('@/view/operationManage/problemManage'), text: "报表问题管理"},
        {path: 'uploadData', name: 'uploadData', component: () => import('@/view/operationManage/uploadData'), text: "局方录入数据"},
        {path: 'reportWarnDesc', name: 'reportWarnDesc', component: () => import('@/view/operationManage/reportWarnDesc'), text: "数据报警"},
        //订购分析
        {path: 'realTimeOrder', name: 'realTimeOrder', component: () => import('@/view/orderAnalysis/realtimeorder'), text: "实时订购数据报表"},
        {path: 'hoursAccess', name: 'hoursAccess', component: () => import('@/view/orderAnalysis/hoursAccess'), text: "分时段数据报表"},
        {path: 'ubporder', name: 'ubporder', component: () => import('@/view/orderAnalysis/ubporder'), text: "UBP订购分析报表"},
        {path: 'accessEntryReport', name: 'accessEntryReport', component: () => import('@/view/orderAnalysis/accessEntryReport'), text: "入口访问数据报表"},
        {path: 'uploadView', name: 'uploadView', component: () => import('@/view/orderAnalysis/uploadView'), text: "局方数据汇总"},
        {path: 'ubporderfunnle', name: 'ubporderfunnle', component: () => import('@/view/orderAnalysis/ubporderfunnle'), text: "UBP分析订购漏斗"},
        //产品分析
        {path: 'paTablePage', name: 'paTablePage', component: () => import('@/view/pa_tables/pa_page'), text: "页面分析报表"},
        {path: 'paPageDetail', name: 'paPageDetail', component: () => import('@/view/pa_tables/pa_page/detail'), text: "页面分析详情"},
        {path: 'paTableOperate', name: 'paTableOperate', component: () => import('@/view/pa_tables/pa_operate'), text: "运营位分析报表"},
        {path: 'paOperateDetail', name: 'paOperateDetail', component: () => import('@/view/pa_tables/pa_operate/detail'), text: "运营位分析详情"},
        {path: 'resourceDemand', name: 'resourceDemand', component: () => import('@/view/pa_tables/resourceDemand'), text: "资源点播分析报表"},
        {path: 'topicPlayReport', name: 'topicPlayReport', component: () => import('@/view/pa_tables/topicPlayReport'), text: "专题分析报表"},
        //用户使用分析
        {path: 'demandRate', name: 'demandRate', component: () => import('@/view/useAnalysis/demandRate'), text: "点播率分析报表"},
        {path: 'activityRateReport', name: 'activityRateReport', component: () => import('@/view/useAnalysis/activityRateReport'), text: "活跃率分析报表"},
        {path: 'orderOffRate', name: 'orderOffRate', component: () => import('@/view/useAnalysis/orderOffRate'), text: "退订率分析报表"},

        //OTT
        {path: 'overviewOTT', name: 'overviewOTT', component: () => import('@/view/OTT/overviewOTT'), text: "项目概况"},
        {path: 'trendRealOTT', name: 'trendRealOTT', component: () => import('@/view/OTT/trendRealOTT'), text: "实时分析"},
        {path: 'trendOTT', name: 'trendOTT', component: () => import('@/view/OTT/trendOTT'), text: "趋势分析"},
        {path: 'hourTrendOTT', name: 'hourTrendOTT', component: () => import('@/view/OTT/hourTrendOTT'), text: "分时段分析"},
        {path: 'orderOTT', name: 'orderOTT', component: () => import('@/view/OTT/orderOTT'), text: "订购报表"},
        {path: 'channelOTT', name: 'channelOTT', component: () => import('@/view/OTT/channelOTT'), text: "渠道统计"},
        {path: 'memberOTT', name: 'memberOTT', component: () => import('@/view/OTT/memberOTT'), text: "用户分析"},
        {path: 'stockUserOTT', name: 'stockUserOTT', component: () => import('@/view/OTT/stockUserOTT'), text: "留存分析"},
        {path: 'feedback', name: 'feedback', component: () => import('@/view/OTT/feedbackOTT'), text: "用户反馈"},
        {path: 'playAnalysis', name: 'playAnalysis', component: () => import('@/view/OTT/playAnalysis'), text: "点播分析报表新"},
        {path: 'ottAccessReport', name: 'ottAccessReport', component: () => import('@/view/OTT/ottAccessReport'), text: "活跃率分析报表"},
        {path: 'ottAccessReportDetail', name: 'ottAccessReportDetail', component: () => import('@/view/OTT/ottAccessReport/table-detail'), text: "活跃率分析报表详情"},
        {path: 'kukaiOTT', name: 'kukaiOTT', component: () => import('@/view/OTT/kukaiOTT'), text: "酷开渠道报表"},
        {path: 'ottBehavior', name: 'ottBehavior', component: () => import('@/view/OTT/ottBehavior'), text: "订购行为轨迹报表"},
        // 联通投诉处理
        {path: 'unicomDate', name: 'unicomDate', component: () => import('@/view/unicom/unicomDate'), text: "联通投诉处理"},
        // 页面分析
        {path: 'pageAnalysis', name: 'pageAnalysis', component: () => import('@/view/pageAnalysis/pageAnalysis'), text: "页面分析"},
        {path: 'zoneAnalysis', name: 'zoneAnalysis', component: () => import('@/view/pageAnalysis/zoneAnalysis'), text: "区域分析"},
        {path: 'partAnalysis', name: 'partAnalysis', component: () => import('@/view/pageAnalysis/partAnalysis'), text: "运营位分析"},

      ]
    },
    {path: '/login', name: 'login', component: () => import('@/view/login/login'), text: "登录页面"},
    //异常页面
    {path: '/404', name: '404', component: () => import('@/view/exception/404'), text: "404页面"},
    {path: '/no_power', name: 'no_power', component: () => import('@/view/exception/no_power'), text: "无权限"},
    {path: '/re_login', name: 're_login', component: () => import('@/view/exception/re_login'), text: "登录失效"},
    {path: '*', redirect: '404'},
  ]
})
