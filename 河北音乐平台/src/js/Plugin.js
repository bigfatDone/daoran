import Vue from 'vue'
import router from '@/router'
// import echarts from 'echarts'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import dateFormat from '@/js-plugin/dateFormat'
import ajax from '@/js-plugin/ajax'
// import Highcharts from 'highcharts/highstock'
// import routeWatcher from './routeWatcher'
// import Exporting from 'highcharts/modules/exporting'

// Vue.use(routeWatcher)
// Exporting(Highcharts)

const install = function () {
	// Vue.prototype.$echarts = echarts;
  Vue.prototype.$axios = axios;
  Vue.prototype.$dateFormat = dateFormat.dateFormat;
  Vue.prototype.$qs = qs;
  Vue.prototype.$ajax = ajax.init;
  // Vue.prototype.$Highcharts = Highcharts;
}

export default {
	install
}
