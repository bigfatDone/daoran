<template>
  <div>
    sss
    </video>
  </div>
</template>

<script>
export default{
  name:'play',
  props: {
    pcode: String,
    state: Boolean,
  },
  mounted () {
    console.log("视频播放" + this.pcode)
    this.getPlay();
  },
  data () {
    return {
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      getVideoPlayUrl:'/cms/api/video/getVideoPlayUrl.do',
      playSrc:'',
    }
  },
  methods: {
    getPlay () {
      //console.log("aaaa"); return;
      let parm = {videoCode: this.pcode}
      let that = this;
      let params = {jsonParam: JSON.stringify(parm)};

      that.$ajax({
        url: that.getVideoPlayUrl,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          that.playSrc = res.data.data.url;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
  }
}
</script>

<style>

</style>
