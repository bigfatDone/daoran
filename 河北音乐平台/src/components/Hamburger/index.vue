<template>
  <div class="hamburger-container">
    <!--<span class="fa fa-dedent fa-fw hamburger-btn" @click="toggleClick" title="收起/展开导航侧栏"></span>-->
    <span class="hamburger-btn" @click="toggleClick" title="收起/展开导航侧栏"></span>
    <span class="logo">CMS-河北移动</span>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>
<style>

</style>
<style lang="less" scoped>
.hamburger-container {
  display: flex;
  height: 60px;
  align-items: center;
  font-size: 1.2rem;
}
.logo {
  margin-left: 12px;
}
.hamburger-btn {
  display: inline-block;
  width: 30px;
  height: 20px;
  background-image: url('../../assets/imgs/dh.png');
  background-repeat: no-repeat;
  background-position: 10px -1px;
  /*background-color: white;*/
  cursor: pointer;
}
/* .hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  transform: rotate(90deg);
  transition: .38s;
  transform-origin: 50% 50%;
}

.hamburger.is-active {
  transform: rotate(0deg);
} */
</style>
