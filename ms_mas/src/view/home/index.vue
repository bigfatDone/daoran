<template>
  <div class="wrap">
    <v-search @searchResult="getSearchResult($event)" @imgLoading="getImgLoading($event)"></v-search>
    <v-preview :preview="preview"></v-preview>
    <v-chart :chart-data="chartData" :yesterday="yesterday" v-loading="loading"></v-chart>
  </div>
</template>

<script>
import vSearch from './component/search'
import vChart from './component/chart'
import vPreview from './component/preview'

export default {
  name: 'home',
  components: {
    vSearch,
    vPreview,
    vChart
  },
  data () {
    return {
      preview: {},
      chartData: {},
      yesterday: {},

      loading:true,
    }
  },
  mounted () {

  },
  methods: {
    getSearchResult (obj) {
      let that = this;
      that.preview = {count: obj.data[0], recent: obj.recent};
      that.chartData = obj;
      that.yesterday = obj.yesterdayLists;
    },
    getImgLoading (obj) {
      let that = this;
      that.loading = obj;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrap{
    margin: .5rem 1rem;
  }
</style>
