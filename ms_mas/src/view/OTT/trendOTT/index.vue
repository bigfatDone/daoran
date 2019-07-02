<template>
  <div>
    <keep-alive>
      <v-old-trend v-if="tab" @comeback="comeback"></v-old-trend>
    </keep-alive>
    <keep-alive>
      <v-new-trend v-if="!tab" @backHistory="backHistory"></v-new-trend>
    </keep-alive>
  </div>
</template>

<script>
  import vOldTrend from "./OldtrendOTT/index.vue"
  import vNewTrend from "./NewrendOTT/index.vue"
  export default {
    name: "trendOTT",
    components: {vOldTrend,vNewTrend},
    data () {
      return {
        tab: false
      }
    },
    computed: {

    },
    created () {

    },
    mounted () {
    },
    methods:{
      backHistory(bol){
          this.tab = bol;
      },
      comeback(bol){
        this.tab = bol;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
