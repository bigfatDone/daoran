<template>
  <div
    v-loading="tableLoading"
    class="checkout">
    正在载入...
  </div>
</template>

<script>
export default {
  name: 'checkout',
  data () {
    return {
      url: "/cms/api/userroler/queryIsSee.do",
      axios: this.$root.axios,
      // powerLevel: 0,
      powerLevel: -1,
      tableLoading: false,
    }
  },
  mounted () {
    let that = this;
    this.getPower();
    /*setTimeout(function () {
      console.log(that.$store.getters.getUserPower);
    }, 3000);*/
  },
  methods: {
    getPower () {
      let that = this;
      that.$router.push({path: "video"});
      // that.$store.commit('EditUserPower', that.powerLevel);
      // that.$router.push({path: "audio"})
//      that.tableLoading = true;
      // that.axios({
      //   headers: {
      //    'deviceCode': 'A95ZEF1-47B5-AC90BF3'
      //   },
      //   url: that.url,
      //   method:'post',
      //   data: {},
      // }).then(res => { // msg的值
      //   that.powerLevel = res.data.msg;
      //   that.$store.commit('EditUserPower', that.powerLevel);
      //   // that.$router.push({path: "audio"})
      //   if (that.powerLevel == 1) {
      //     that.$router.push({path: "video"});
      //   } else if (that.powerLevel == 2) {
      //     that.$router.push({path: "video"});
      //   } else if (that.powerLevel == 3) {
      //     that.$router.push({path: "video"});
      //   }
      //   that.tableLoading = false;
      // }).catch(err=>{
      //   console.log(err);
      // })

//      that.$ajax({
//        url: that.url,
//        method: "post",
//        data: {},
//        success: function (res) { // msg的值
////          console.log(res.data.obj.version)
////          that.powerLevel = res.data.obj.version;
////          that.$store.commit('EditUserPower', that.powerLevel);
////          if (that.powerLevel == 1) {
////            that.$router.push({path: "video"});
////          } else if (that.powerLevel == 2) {
////            that.$router.push({path: "video"});
////          } else if (that.powerLevel == 3) {
////            that.$router.push({path: "video"});
////          }
////          that.tableLoading = false;
//          that.$router.push({path: "video"});
//        },
//        error: function (error) {
//          that.$message.error(error);
//        }
//      });
    }
  }
}
</script>

<style lang="less" scoped>

</style>
