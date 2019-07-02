<template>
  <div class="sidebarItem">
    <el-submenu :index="sidebarData.name">
      <template slot="title">
        <!-- <i class="el-icon-location"></i> -->
        <span>{{sidebarData.text}}</span>
      </template>
      <template v-for="item in sidebarData.children">
        <el-menu-item
          v-if="!item.children"
          :index="item.name"
          :route="item.path"
          @click="choseMenu(item)">{{item.text}}</el-menu-item>
        <sidebar-item
          v-else
          :sidebarData="item"
          @choseMenu="choseMenu($event)"></sidebar-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: 'sidebarItem',
  props: ["sidebarData"],
  computed: {

  },
  data () {
    return {

    }
  },
  mounted() {
    //console.log(this.sidebarData);
  },
  methods: {
    choseMenu (obj) {
      let that = this;
      that.$emit("choseMenu", obj);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
