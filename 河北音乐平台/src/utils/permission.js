import Vue from 'vue'
import router from '@/router'
import Axios from 'axios';
import store from '@/store/index';
import { MessageBox } from 'element-ui';

const GetLoginState = function (to, from, next) {
  const that = this;
  // Axios({
  //   headers: {
  //     'deviceCode': 'A95ZEF1-47B5-AC90BF3'
  //   },
  //   url: "/cms/api/login.do",
  //   method:'post',
  //   data: {},
  // }).then(res => {
  //   console.log(res)
  //   // console.log(111)
  //   //获取权限等级，然后根据权限限制判断，判断后记得执行next();
  // //  store.commit('EditUserPower', res.data.obj.version);
  //   next();
  // }).catch(err=>{
  //   //请求失败，视情况处理，记得调用next();
  //   console.log(err);
  //   next();
  // });
  if(to.name == "login") {
    next();
  }else {
    Axios({
      headers: {
        'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      },
      url: "/cms/api/login.do",
      method:'post',
      data: {},
    }).then(res => {
      if (!res.data.success) {
        next();
      }else {
        // next({path: "/login"})
        // MessageBox.alert('session过期，刷新页面吧！', '提示', {
        //   confirmButtonText: '刷新',
        //   callback: action => {
        //     // router.go(0)
        //     // next({path: "/login"})
        //     router.push({name:'login'})
        //   }
        // });
        router.push({name:'login'})
      };
    }).catch(err=>{
      router.push({name:'login'})
      // console.log(err);
      // MessageBox.alert('session过期，刷新页面吧！', '提示', {
      //   confirmButtonText: '刷新',
      //   callback: action => {
      //     router.push({name:'login'})
      //   }
      // });
    });
  }
}

const install = function () {
  /*检测用户是否有效登录*/
  router.beforeEach((to, from, next) => {
/*    let powerLevel = store.getters.getUserPower;
    if (to.name === "checkout" || powerLevel === 1 || to.name === "noPowerlist" ) {
      next();
    }
    else if (powerLevel === 2) {
      if (to.name === "userlist" || to.name === "chapter" || to.name === "course") {
        next({path: 'noPower'});
      } else {
        next();
      }
    } else if (powerLevel === 3) {
      if (to.name === "chapter" || to.name === "course" || to.name === "tagType" || to.name === "tags") {
        next();
      } else {
        next({path: 'noPower'});
      }
    } else if (powerLevel === 0) {
        next({path: 'noPower'});
    }else {
      GetLoginState(to, from, next);
    }*/
    GetLoginState(to, from, next);
  });
}

export default {
	install
}
