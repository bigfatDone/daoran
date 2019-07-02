import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)

const store = {
  state: {
    record: [], //访问历史列表
    keepList: [], //访问历史缓存
    activeMenu: '', //当前选中菜单
    loginState: false, //登录有效状态
    MobileSearchState: false, //移动端搜索框展示状态
    dailySearchDatestatus: false, //项目日报页面日期修改状态
    allowCatch: ["daily"], //手动配置的缓存页面name列表
    dateForDaily: "", //项目日报共享搜索日期
    menuState: false, //菜单状态
    selectArr: [], //选择条件[值]
    selectArrState: false, //选择条件是否有改变
  },
  getters: {
    getRecordAll: state => {
      return state.record;
    },
    getSelectArrState: state => {
      return state.selectArrState;
    },
    getSelectArr: state => {
      return state.selectArr;
    },
    getMenuState: state => {
      return state.menuState;
    },
    getDateForDaily: state => {
      return state.dateForDaily;
    },
    getAllowCatch: state => {
      return state.allowCatch;
    },
    getDailySearchDatestatus: state => {
      return state.dailySearchDatestatus;
    },
    getMobileSearchState: state => {
      return state.MobileSearchState;
    },
    getLoginState: state => {
      return state.loginState;
    },
    getkeepList: state => {
      return state.keepList;
    },
    getRecord: state => (obj) => {
      let result = null;
      if (obj.active) {
        for (let i=0; i<state.record.length; i++) {
          let item = state.record[i];
          if (item.name == obj.name) {
            (i < (state.record.length - 1)) ? result = state.record[i + 1] : result = state.record[i - 1];
          }
        }
        return result;
      }
      else {
        return true;
      }
    },
    getActiveMenu: state => (obj) => {
      let result = null;

      for (let i=0; i<state.record.length; i++) {
        let item = state.record[i];
        if (item.name == obj.name) {
          result = state.record[i];
          break;
        }
      }

      return result;
    }
  },
  mutations: {
    changeSelectArrState (state, val) {
      state.selectArrState = val;
    },
    changeSelectArr (state, val) {
      state.selectArr = val;
    },
    changeMenuState (state, val) {
      state.menuState = val;
    },
    changeAllowCatch (state, val) {
      val == true ? state.allowCatch = ["daily"] : state.allowCatch = [];
    },
    changeDateForDaily (state, val) {
      state.dateForDaily = val;
    },
    changeDailySearchDatestatus (state, val) {
      state.dailySearchDatestatus = val;
    },
    changeMobileSearchState (state, val) {
      state.MobileSearchState = val;
    },
    changeLoginState (state, val) {
      state.loginState = val;
    },
    addRecord (state, val) {
      let pass = true;
      for (let i=0; i<state.record.length; i++) {
        let item = state.record[i];
        if (item.path == val.path) {
          pass = false;
          break;
        }
      }
      if(pass) {
        state.record.push(val);
        state.keepList.push(val.name);
      }
    },
    clearKeepList (state, val) {
      state.keepList = [];
      state.record = [];
    },
    setActiveMenu (state, val) {
      state.activeMenu = val;
    },
    changeActiveMenu (state, obj) {
      state.record.forEach(function(item, index){
        if (item.path == obj.path) {
          item.active = true;
        }else{
          item.active = false;
        }
      });
    },
    delRecord (state, obj) {
      let done = false;

      for (let i=0; i<state.record.length; i++) {
        let item = state.record[i];
        if (item.name == obj.name) {
          state.record.splice(i, 1);
          done = true;
          break;
        }
      }

      for (let i=0; i<state.keepList.length; i++) {
        let item = state.keepList[i];
        if (item == obj.name) {
          state.keepList.splice(i, 1);
          break;
        }
      }
    }
  }
};

export default new Vuex.Store(
    store
);
