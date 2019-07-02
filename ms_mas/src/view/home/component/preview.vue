<template>
  <el-row :gutter="10" class="home-preview" v-if="previewData.count">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="preview-summary">当日订购概况 (截止至{{previewData.recent}} )</div>
    </el-col>
    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <div class="preview-item ordered">
        <p class="preview-type">已订购</p>
        <p class="preview-num">{{previewData.count.iOSuccessTotal}}</p>
      </div>
    </el-col>
    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <div class="preview-item fail">
        <p class="preview-type">订购失败</p>
        <p class="preview-num">{{previewData.count.iOFailTotal}}</p>
      </div>
    </el-col>
    <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <div class="preview-item qiut">
        <p class="preview-type">退订用户</p>
        <p class="preview-num">{{previewData.count.iOOffTotal}}</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'home-preview',
  props: ["preview"],
  data () {
    return {

    }
  },
  computed: {
    previewData () {
      return this.preview;
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home-preview{
    margin: 1rem 0;
    padding: 0.5rem;
    border: 1px solid #e7e9f0;
    border-radius: 5px;
  }
  .preview-item{
    padding: 0.5rem 0;
    text-align: center;
    border-right: 1px solid #eee;
  }
  .preview-item p {
    margin: 0;
    padding: 0;
  }
  .preview-type{
    color: #aaa;
    font-size: .7rem;
  }
  .preview-num{
    color: #333;
    font-size: 1.4rem;
  }
  .qiut{
    border-right: none;
  }
  .preview-summary{
    padding: 0 0 0.5rem 0;
    font-size: .75rem;
    color: #666;
    font-weight: bold;
  }
</style>
