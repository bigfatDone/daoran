<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="视频" name="videoTab">
        <v-video> </v-video>
      </el-tab-pane>
      <el-tab-pane label="音频" name="audioTab">
        <v-audio></v-audio>
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
      activeName: 'videoTab',
    }
  }
}
</script>

<style scoped>

</style>
