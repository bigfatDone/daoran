<template>
  <div class="layout-wrap">
    <div class="layout-header">
      <v-header @mobileMenu="mobileMenuFlag($event)"></v-header>
    </div>
    <div :class="{'mobileMenu': mobile.show, 'layout-sidebar': true, 'hidden': !sidebarShow}">
      <span
        :class="{'sidebarToggle el-icon-arrow-left': true, 'toggle': !sidebarShow}"
        @click="sidebarShow = !sidebarShow"></span>
      <side-bar @menuChoose="menuChoose($event)"></side-bar>
    </div>
    <div :class="{'layout-crumbs': true, 'full': !sidebarShow}">
      <v-crumbs></v-crumbs>
    </div>
    <div :class="{'layout-contain': true, 'full': !sidebarShow}">
      <div class="layout-contain-mg">
        <keep-alive :include="keepList">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <!--response compenont-->
    <div
      :class="{'mobileMenuCover':true, 'mobileShow':mobile.show}"
      @click="mobile.show = false">
    </div>
  </div>
</template>

<script>
import vHeader from "./component/header"
import sideBar from "./component/sidebar"
import vCrumbs from "./component/crumbs"

export default {
  name: 'layout',
  components: {
    vHeader, sideBar, vCrumbs
  },
  data () {
    return {
      mobile: {
        show: false
      },
      sidebarShow: true
    }
  },
  computed: {
    keepList () {
      //return this.$store.getters.getAllowCatch;
      return this.$store.getters.getkeepList;
    },
  },
  mounted (){
    //console.log(this.keepList);
  },
  methods: {
    mobileMenuFlag (statu) {
      let that = this;
      that.mobile.show = statu;
    },
    menuChoose (obj) {
      let that = this;
      let count = 0;
      that.mobile.show = false;
      that.$store.commit('addRecord', obj);
      that.$store.commit('changeActiveMenu', obj);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*reset element ui*/
   .el-message{
    min-width: 300px !important;
    top: 45% !important;
  }
  .el-menu{
    border-right: none !important;
  }
  .el-menu-item, .el-submenu__title{
    height: 38px !important;
    line-height: 38px !important;
    font-size: 14px !important;
  }
  .el-submenu .el-menu-item{
    height: 34px !important;
    line-height: 34px !important;
    font-size: 14px !important;
  }
  .el-menu-item:hover, .el-submenu__title:hover{
    background: #efefef !important;
  }
  .el-menu-item.is-active{
    color: #409EFF !important;
    /*font-weight: bold;*/
  }
  /*custome style*/
  .layout-wrap{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
  .layout-header, .layout-sidebar, .layout-crumbs, .layout-contain{
    position: absolute;
  }
  .layout-header{
    left: 0;
    top: 0;
    right: 0;
    height: 3rem;
    z-index: 4;

    background: #3385e3;
    background-image: -webkit-gradient(linear,left top,right top,from(#1278f6),to(#00b4aa));
    background-image: -webkit-linear-gradient(left,#1278f6,#00b4aa);
    background-image: -moz-linear-gradient(left,#1278f6,#00b4aa);
    background-image: linear-gradient(to right,#1278f6,#00b4aa);
  }
  .layout-sidebar{
    left: 0;
    top: 3rem;
    bottom: 0;
    width: 8.6rem;
    transition: transform 0.2s;
    z-index: 3;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid #e7e9f0;
    background: #fafafb;
  }
  .hidden{
    left: -10rem;
  }
  .layout-crumbs{
    left: 8.6rem;
    top: 3rem;
    right: 0;
    height: 2rem;
    border-bottom: 1px solid #e7e9f0;
    padding: 0 0 0 1px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow: hidden;
    transition: left .3s;
  }
  .layout-contain{
    left: 8.6rem;
    top: 5.1rem;
    right: 0;
    bottom: 4px;
    overflow: auto;
    padding: 1px 0 0 1px;
    transition: left .3s;
  }
  .full{
    left: 0;
  }
  .layout-contain-mg{
    margin: .5rem;
    overflow: hidden;
  }
  .sidebarToggle{
    position: fixed;
    width: 1rem;
    height: 2rem;
    left: 7.6rem;
    top: 50%;
    margin: -1rem 0 0 0;
    cursor: pointer;
    color: #666;
    z-index: 9;
    font-size: .7rem;
    text-align: center;
    line-height: 2rem !important;
    background: #eee;
    opacity: 0.5;
    border-radius: 5px 0 0 5px;
    transition: .3s;
  }
  .sidebarToggle:hover{
    opacity: 1;
  }
  .toggle{
    left: 0;
    transform: rotate(-180deg);
  }
  .text-center{
    text-align: center !important;
  }
  .active-button-group{
    color: #fff !important;
    background-color: #409eff !important;
    border-color: #409eff !important;
    box-shadow: -1px 0 0 0 #8cc5ff !important;
  }
  .tooltips-auto{
    max-width: 80% !important;
  }
  .dailog-min-max{
    max-width: 500px !important;
    min-width: 300px !important;
  }
  .checkTableImg{
    display: none !important;
  }
  .hideCharts{
    margin: .6rem 0 0 0;
    display: block;
    text-align: center;
    border-top:1px solid #eaeefb;
  }
  .hideCharts i{
    font-size: 1.6rem;
    color: #8c939d;
  }
  .hideCharts:hover{
    cursor: pointer;
  }
  .hideCharts:hover i{
    color: #1d2438;
  }
  .changeHideCharts i{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* Internet Explorer */
    -moz-transform:rotate(180deg); /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg); /* Opera */
    transition:transform .5s;
    -moz-transition:-moz-transform .5s; /* Firefox 4 */
    -webkit-transition:-webkit-transform .5s; /* Safari and Chrome */
    -o-transition:-o-transform .5s; /* Opera */
  }
  .columnTable tr td{
    padding:0;
    margin:0;
  }
  .custom-select{
    padding:0 !important;
  }
  .el-table, .el-table thead {
    color: #000 !important;
  }


  .highcharts-test{
    height: 50px;
  }
  .detaiTable .el-dialog__body{
    padding:  10px 20px 20px 20px;
  }

  /*response*/
  .mobileShow{
    display: block !important;
  }
  .mobileMenu{
    display: block !important;
    z-index: 6;
    transform: translateX(0) !important;
  }
  .mobileMenuCover{
    display: none;
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .mobileMenuCover:after{
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 3rem;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
  }
  @media screen and (max-width: 800px) {
    .layout-contain{
      left: 0;
      top: 3rem;
    }
    .checkTableImg{
      display: block !important;
    }
    .layout-crumbs, .mobileMenuCover, .hideCharts, .opera-pc, .sidebarToggle{
      display: none;
    }
    .layout-sidebar{
      transform: translateX(-10rem);
    }
  }
  @media screen and (min-width: 801px) {
    .mobile-menu, .mobile-menu-btn{
      display: none !important;
    }
  }
</style>
