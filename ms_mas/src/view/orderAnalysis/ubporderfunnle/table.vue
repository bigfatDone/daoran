<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableData"
      border
      stripe
      :max-height="height"
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        v-for="item in tableList"
        :property="item.name"
        min-width="100"
        sortable
        v-if="item.status"
        :key="item.name"
        :label="item.text">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "udporderfunnle",
    props: ["loading","tableData","tableList","height"],
    components: {

    },
    data () {
      return {

      }
    },
    computed: {
    },
    watch: {

    },
    mounted () {

    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
