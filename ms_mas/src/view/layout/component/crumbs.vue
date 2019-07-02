<template>
  <div class="crumbs-main">
    <span
      v-for="(item, index) in crumbsData"
      :class="{'crumbs-item':true, 'active': item.active}"
      @click="choseMenu(item)">
      {{item.text}}
      <i
        class="el-icon-close"
        v-if="index != 0"
        @click.stop="del(item)">
      </i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'crumbs',
  computed: {
    crumbsData () {
      return this.$store.getters.getRecordAll;
    }
  },
  data () {
    return {

    }
  },
  mounted() {
    //console.log(this.crumbsData);
  },
  methods: {
    choseMenu (item) {
      let that = this;
      that.$router.push({ path: item.path, query: {}});/*id: 'default'*/
      that.$store.commit('changeActiveMenu', item);
    },
    del (item) {
      let that = this;
      let result = that.$store.getters.getRecord(item);
      that.$store.commit('delRecord', item);
      if (result !== true) {
        that.choseMenu(result);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .crumbs-main{
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .crumbs-item{
    display: inline-block;
    position: relative;
    padding: 0 20px;
    height: 2rem;
    line-height: 2rem;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    background: #fefefe;
    color: #777;
    cursor: pointer;
    border-right: 1px solid #eee;
  }
  .crumbs-item .el-icon-close{
    position: absolute;
    right: 3px;
    top: 3px;
    opacity: 0;
    cursor: pointer;
  }
  .crumbs-item:hover{
    background: #409eff;
    color: #fff;
  }
  .crumbs-item:hover > .el-icon-close{
    opacity: 1;
  }
  .active{
    color: #fff ;
    background: #409eff;
  }
</style>
