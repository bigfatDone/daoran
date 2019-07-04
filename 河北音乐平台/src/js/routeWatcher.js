import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'

const GetLoginState = function (to, from, next) {
  let that = Vue;
  let _target = to.name;
  let cathe = false;
  //_target == "dailyDetail" || _target == "daily" ? cathe = true : cathe = false;
  //store.commit('changeAllowCatch', cathe);

  if (store.getters.getLoginState == true || to.name == "login") {
    // console.log(to);
    next();
  } else {
    axios.post("/ms_bas/getSessionStatus", qs.stringify({}))
    .then(function (response) {
      if (response.data.exists) {
        store.commit('changeLoginState', true);
        next();
      }else {
        next({path: "/login"})
      };
    })
    .catch(function (error) {
      next({path: "/login"});
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
