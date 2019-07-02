import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { MessageBox } from 'element-ui';

const GetLoginState = function (to, from, next) {
  let that = Vue;
  let _target = to.name;
  let cathe = false;

  if (to.name == "login") {
    store.commit('clearKeepList', true);
    next();
  } else if (store.getters.getLoginState == true || to.name == "re_login") {
    next();
  } else {
    axios.post("/ms_bas/getSessionStatus", qs.stringify({}))
    .then(function (response) {
      if (response.data.exists) {
        store.commit('changeLoginState', true);
        next();
      }else {
        // next({path: "/re_login"})
        MessageBox.alert('session过期，刷新页面吧！', '提示', {
          confirmButtonText: '刷新',
          callback: action => {
            router.go(0)
          }
        });
      };
    })
    .catch(function (error) {
      // next({path: "/re_login"});
      MessageBox.alert('session过期，刷新页面吧！', '提示', {
        confirmButtonText: '刷新',
        callback: action => {
          router.go(0)
        }
      });
    });
  }
}

const install = function () {
  /*检测用户是否有效登录*/
  router.beforeEach((to, from, next) => {
    GetLoginState(to, from, next);
  });
}

export default {
	install
}
