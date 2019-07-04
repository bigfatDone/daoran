import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const RouteState = {
  state: {
    routerAudioChange: 'default',
    userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
  },
  mutations: {
    _routerAudioChange (state, route) {
      // 变更状态
      state.routerAudioChange = route;
    },
    userInfoChange (state, data) {
      state.userInfo = data;
      sessionStorage.setItem('userInfo', JSON.stringify(data))
    }
  }
}

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    RouteState
  },
  getters
})

export default store
