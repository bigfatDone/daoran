// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import Axios from 'axios';
import Qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './lang' // Internationalization
import staticData from '@/assets/global/global'
import 'font-awesome/css/font-awesome.css';
import power from '@/utils/permission';
import plugin from '@/js/Plugin';
import $ from 'jquery'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(power);
Vue.use(plugin);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  data: {
    staticData: staticData,
    axios: Axios,
    Qs: Qs
  },
  components: { App },
  template: '<App/>'
})
