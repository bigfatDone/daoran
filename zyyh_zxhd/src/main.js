import Vue from 'vue';
import VueRouter from 'vue-router';
// import VueResource from 'vue-resource';
import App from './App';
import routes from './router/routes';

import { WechatPlugin, AjaxPlugin } from 'vux';
Vue.use(WechatPlugin);
Vue.use(AjaxPlugin);
// console.log(Vue.wechat);
// import axios from 'axios';

// Vue.prototype.$ajax = axios;

// 注入过滤器
import filters from './filters/index';
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const FastClick = require('fastclick');
FastClick.attach(document.body);
// Vue.config.silent = true;
Vue.use(VueRouter);
// Vue.use(VueResource);
// Vue.config.devtools = true
// Vue.http.options.emulateJSON = true

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  base: __dirname,
  routes: routes
});

const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app');

// console.log(Global)
let BL = {
  // userId: 'zyyhTest1',
  userId: '',
  token: '',
  userName: '',
  apiUrl: 'http://wechat.daoran.tv/API_AOP',
  // apiUrl: '',
  // apiUrl: 'http://101.200.46.8/API_AOP',
  imgUrl: '',
  leftTimes: '0',
  tel: '',
  QQ: '',
  indexIn: false,
  // userInfo: {openid: ''},

  setTitle: function (str) {
    document.title = str;
    // setTimeout(function () {
    //   // 利用iframe的onload事件刷新页面
    //   var iframe321 = document.createElement('iframe');
    //   iframe321.style.visibility = 'hidden';
    //   iframe321.style.width = '1px';
    //   iframe321.style.height = '1px';
    //   iframe321.src = 'http://202.99.114.28:25603/mall_act/images/px1/uc/201804brick_uc/btn_back.png?t=' + Math.random();
    //   iframe321.onload = function () {
    //     setTimeout(function () {
    //       document.body.removeChild(iframe321);
    //     }, 0);
    //   };
    //   document.body.appendChild(iframe321);
    // }, 0);
  }
};
// 将数据写入全局
window.BL = BL;

// 增加ajax请求预处理选项
// Vue.http.interceptors.push((request, next) => {
//   //console.log(this)//此处this为请求所在页面的Vue实例
//   // console.log(request)
//   // modify request
//   // request.method = 'POST';//在请求之前可以进行一些预处理和配置
//   router.app.$children[0].showLoad = true;
//   // console.log(router)
//   // router.app.$children[0].err('123')
//   // console.log(router.app.$children[0].showLoad)
//   next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
//     // console.log(response)
//     router.app.$children[0].showLoad = false;
//     if (response.ok) {
//       if (window.parseInt(response.body.result) !== 1 && response.body.error) {
//         // window.alert(response.body.error);
//         router.app.$children[0].alert('提示', response.body.error);
//         // console.log(router);
//         response.ok = false;
//       } else {
//         if (response.status === 0) {
//           router.app.$children[0].err('网络不给力！');
//           console.log(response);
//           return;
//           // window.alert('状态码：' + response.status);
//         }
//       }
//     } else if (response.body===null) {
//       router.app.$children[0].err('网络错误！');
//       console.log(response);
//       return;
//     }
//     return response;
//   });
// });
