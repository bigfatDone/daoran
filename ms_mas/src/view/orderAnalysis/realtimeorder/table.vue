<template>
  <div class="pa-pages-table">
    <el-table
      ref="pa_page_tables"
      :data="tableImg"
      border
      stripe
      cell-class-name="text-center"
      header-cell-class-name="text-center"
      v-loading="loading"
      height="570px"
      style="width: 100%">
      <el-table-column
        property="node"
        min-width="100"
        sortable
        label="项目">
      </el-table-column>
      <el-table-column
        property="product"
        min-width="100"
        sortable
        label="产品">
      </el-table-column>
      <el-table-column
        property="productCode"
        min-width="80"
        label="计费编码">
      </el-table-column>
      <el-table-column
        property="province"
        min-width="82"
        label="省份">
      </el-table-column>
      <el-table-column
        property="city"
        min-width="82"
        sortable
        label="地市">
      </el-table-column>
      <el-table-column
        property="user"
        min-width="105"
        sortable
        label="用户卡号">
      </el-table-column>
      <el-table-column
        property="sourceTypeStr"
        min-width="82"
        sortable
        label="操作来源">
      </el-table-column>
      <el-table-column
        property="accessName"
        min-width="82"
        sortable
        label="访问入口">
      </el-table-column>
      <el-table-column
        property="sourceStr"
        min-width="82"
        sortable
        label="订购入口">
      </el-table-column>
      <el-table-column
        property="triggerTypeStr"
        min-width="82"
        sortable
        label="订购方式">
      </el-table-column>
      <el-table-column
        property="ctime"
        min-width="82"
        sortable
        label="操作时间">
      </el-table-column>
      <el-table-column
        property="orderResultStr"
        min-width="82"
        sortable
        label="操作结果">
      </el-table-column>
      <el-table-column
        property="orderDesc"
        min-width="82"
        sortable
        label="失败原因">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "realtimeorder",
    props: ["loading","tableImg"],
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
