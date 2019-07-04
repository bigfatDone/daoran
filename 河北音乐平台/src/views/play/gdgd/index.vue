<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="视频" name="videoTab">
        <v-video :routeHash="routeHash" v-if="videoTabShow"></v-video>
      </el-tab-pane>
      <el-tab-pane label="音频" name="audioTab">
        <v-audio :routeHash="routeHash" v-if="audioTabShow"></v-audio>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import vAudio from './components/audio'
import vVideo from './components/video'

export default {
  name: 'audio-list',
  components: {
    vAudio,vVideo
  },
  data () {
    return {
      videoTabShow: true,
      audioTabShow: false,
      activeName: 'videoTab',
      routeHash: {
        gdgd : true,
        xjgd : true,
        tjlt : true,
        tjgd : true,
        sdgd : true,
        hngd : true,
        jsdx : true,
        OTT  : true,
        gxgd : true,
        hblt : true,
        hbgd : true,
        gzdx : true,
        sxgd : true,
        hbltD : true,
        cxgdS : true,
        cxslD : true,
        hnltS : true,
        scydS : true,
        jxgdS : true,
        ynyd : true,
      },
    }
  },
  methods: {
    handleClick (tab, event) {
      let that = this;
      switch(tab.name) {
        case 'videoTab':
          that.videoTabShow = true;
          that.audioTabShow = false;
          break;
        case 'audioTab':
          that.videoTabShow = false;
          that.audioTabShow = true;
          break;
      }
    },
  }
}
</script>

<style scoped>

</style>
