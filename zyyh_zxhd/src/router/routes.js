//加载模板文件
const lose = resolve => require(['../app/lose.vue'], resolve); //404页面
const urlList = resolve => require(['../app/urlList.vue'], resolve); //导航页面
const inputUrl = resolve => require(['../app/zzz/inputUrl.vue'], resolve); //输入地址

const zyyhIndex = resolve => require(['../app/zyyh/index.vue'], resolve); //首页
const rule = resolve => require(['../app/zyyh/rule.vue'], resolve); //规则页
const answerResults = resolve => require(['../app/zyyh/answerResults.vue'], resolve); //答题结果页
const redResults = resolve => require(['../app/zyyh/redResults.vue'], resolve); //抽奖红包结果页
const share = resolve => require(['../app/zyyh/share.vue'], resolve); //分享
const answer = resolve => require(['../app/zyyh/answer.vue'], resolve); //答题页

//路由规则设置
export default [
  { // 答题页
    path: '/answer',
    name: 'answer',
    component: answer
  },
  { // 分享
    path: '/share/:grade',
    name: 'share',
    component: share
  },
  { // 抽奖红包结果页
    path: '/redResults/:flag/:grade',
    name: 'redResults',
    component: redResults
  },
  { // 答题结果页
    path: '/answerResults/:flag/:num',
    name: 'answerResults',
    component: answerResults
  },
  { // 规则页
    path: '/rule',
    name: 'rule',
    component: rule
  },
  { // 首页
    path: '/zyyhIndex',
    name: 'zyyhIndex',
    component: zyyhIndex
  },
  { // 404
    path: '/lose',
    name: 'lose',
    component: lose
  },
  { // 导航页
    path: '/urlList',
    name: 'urlList',
    component: urlList
  },
  { // 输入Url
    path: '/inputUrl',
    name: 'inputUrl',
    component: inputUrl
  },

  {path: '*', component: lose},
  // {path: '*', redirect: '/lose'},

  {path: '/', redirect: '/zyyhIndex'}
];
