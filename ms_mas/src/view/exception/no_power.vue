<template>
  <div class="no_power">
    <h1><i class="el-icon-circle-close"></i> </h1>
    <h3>抱歉，你无权限访问本系统</h3>
  </div>
</template>

<script>
  export default {
    name: 'no_power'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no_power{
    text-align: center;
    margin-top: 25%;
  }
  .no_power h1{
    color: #F56C6C;
  }
  .time{
    margin-left: 1rem;
  }
  .font-index{
    font-size: 1rem;
  }
</style>
