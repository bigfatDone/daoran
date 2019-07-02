<template>
  <div class="sidebar-wrap">
    <el-menu
      class="el-menu-vertical-demo"
      text-color="#808492"
      background-color="#fafafb"
      active-text-color="#396fff"
      :default-active="activeMenu"
      :router="true">
      <template v-for="(item, index) in sidebarData">
        <el-menu-item
          v-if="!item.children"
          :index="item.name"
          :route="item.path"
          @click="choseMenu(item)">
          <span slot="title" class="li-span">{{item.text}}</span>
        </el-menu-item>

        <sidebar-item
          v-else-if="item.children"
          :sidebarData="item"
          @choseMenu="choseMenu($event)"></sidebar-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import sidebarItem from './sidebarItem'
export default {
  name: 'sidebar',
  components: {
    sidebarItem
  },
  computed: {
//    sidebarData () {
//      return this.$sidebar;
//    },
    menuState(){
      return this.$store.getters.getMenuState;
    },
    activeMenu () {
      return this.$route.name;
    }
  },
  watch:{
    menuState(val){
      let that = this;
      if (val === true){
        that.initMenu();
        that.$store.commit('changeMenuState',false);
      }
    },
  },
  data () {
    return {
      sidebarData:[],
      loaded: false,
    }
  },
  mounted () {
    let that = this;
    //that.CheckPath();
    that.initMenu();
  },
  methods: {
    formatSidebar (obj) {
      let that = this;
      let result = [];
      obj.forEach((item, index) => {
        if (!item.children) {
          result = result.concat(item);
        } else {
          result = result.concat(that.formatSidebar(item.children));
        }
      });

      return result;
    },
    FindSidebar (arr) {
      let that = this;
      let o = {};
      let sidebar = that.formatSidebar(arr);
      o.active = false;

      for (let i=0; i<sidebar.length; i++) {
        let item = sidebar[i];
        if (item.name == that.activeMenu){
          o.path = item.path;
          o.text = item.text;
          o.name = item.name;
          o.active = true;
        }
      }

      return o;
    },
    CheckPath () {
      let that = this;
      let text = '';
      let o = {};
      let obj = {path: 'home', name: 'home', text: '首页', active: false};

      if(that.activeMenu == 'home'){
        obj.active = true;
        text = 'home';
        that.$emit("menuChoose", obj);
      }else{
        o = that.FindSidebar(that.sidebarData);
        text = o.name;
        //that.$emit("menuChoose", obj);
        that.$emit("menuChoose", o);
      }

      that.$store.commit('setActiveMenu', text);
    },
    choseMenu (obj) {
      let that = this;
      let o = {path: obj.path, active: false, text: obj.text, name: obj.name};
      that.sidebarData.forEach(function (item, index) {
        if (item.name == obj.name) {
          o.text = item.text;
        }
      });
      that.$emit("menuChoose", o);
    },
    getDefaultRoute (route) {
      let that = this;
      let obj = null;

      if (route && route.children && route.children.length > 0) {
        that.getDefaultRoute(route.children);
      } else {
        if (route.length > 0) {
          obj = route[0];
        } else {
          obj = route;
        }
      }

      if (obj !== null) {
        that.$router.replace({name: obj.path, params: {}});
      }
    },
    checkRoute (pass, route) {
      let that = this;
      if (that.loaded) {
        return;
      }
      that.loaded = true;

      that.$store.commit('clearKeepList', true);
      if (!pass) {
        if (route) {
          that.getDefaultRoute(route);
          //that.$router.push({name: route.functionUrl, params: {}});
        } else {
          that.$router.push({name: "no_power", params: {}});
        }
      }
    },
    initMenu(){
      let that = this;
      that.$ajax({//获取菜单列表
        url: "/ms_bas/main/getMenuMap",
        method: "post",
        data: {},
        success: function (res) {
          let level1 = [];
          let level2 = [];
          let sideMenu = [];
          let route = that.$route.name;
          let pass = false;

          res.data.forEach((item,index)=>{
            if (item.functionUrl == route) {
              pass = true;
            }
            if(item.functionLevel===0){
              level1.push(item);
            }else if(item.functionLevel===1){
              level2.push(item);
            }
          });

///TEST ////
          let hash_level1 = {};
          level1.forEach((item,index)=>{
            let order = item.functionOrder;
            if (!hash_level1[order]) {
              hash_level1[order] = true;
            }else {
              hash_level1[Number(order)+1] = true;
              item.functionOrder = Number(order)+1;
            }
          });

          level1.forEach((item,index)=>{
            let childrens = [];
            level2.forEach((obj,i)=>{
              if (obj.parentfunctionid === item.id){
                childrens.push(obj);
              }
            });
            let children = [];
            let hash_level2 = {};
            childrens.forEach((data,k)=>{
              let order = data.functionOrder;
              if (!hash_level2[order]) {
                hash_level2[order] = true;
              }else {
                hash_level2[Number(order)+1] = true;
                data.functionOrder = Number(order)+1;
              }
            });
            for (let key = 0; key<childrens.length;key++){
              let ind = childrens[key].functionOrder-1;
              children[ind] ={
                  path:childrens[key].functionUrl,
                  name:childrens[key].functionUrl,
                  id:childrens[key].id,
                  text:childrens[key].functionName,
                }
            }
            if (children.length>0){
              for (let i=0;i< children.length;i++){
                if(children[i] === "" || typeof(children[i]) === "undefined" || typeof(children[i]) === undefined){
                  children.splice(i,1);
                  i--;
                }
              }
              item.children=children;
            }

            let order = item.functionOrder;
            sideMenu[order] ={
              path: item.functionUrl,
              name: item.functionUrl,
              text: item.functionName,
              id: item.id,
              children: item.children ? item.children : null,
              visible: true,
            };
          });
          for (let i=0;i< sideMenu.length;i++){
            if(sideMenu[i] === "" || typeof(sideMenu[i]) === "undefined" || typeof(sideMenu[i]) === undefined){
              sideMenu.splice(i,1);
              i--;
            }
          }

          that.checkRoute(pass, sideMenu[0]);
          that.sidebarData = sideMenu;
          that.CheckPath();
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
