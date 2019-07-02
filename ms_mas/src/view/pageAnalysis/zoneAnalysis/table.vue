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
        property="ctime"
        min-width="100"
        sortable
        label="日期">
      </el-table-column>
      <el-table-column
        property="blockName"
        min-width="80"
        label="所属块">
      </el-table-column>
      <el-table-column
        property="zoneName"
        min-width="82"
        label="所属区域">
      </el-table-column>
      <el-table-column
        property="clickNum"
        min-width="82"
        sortable
        label="点击次数">
      </el-table-column>
      <el-table-column
        property="clickUser"
        min-width="105"
        sortable
        label="点击用户数">
        <!--<template slot-scope="scope">-->
          <!--{{Number(scope.row.clickUser)}}%-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        property="playNum"
        min-width="82"
        sortable
        label="点播次数">
      </el-table-column>
      <el-table-column
        property="playUser"
        min-width="82"
        sortable
        label="点播用户数">
        <!--<template slot-scope="scope">-->
          <!--{{Number(scope.row.playUser)}}%-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        property="playTime"
        min-width="82"
        sortable
        label="点播时长(分)">
        <template slot-scope="scope">
          {{Number(scope.row.playTime)}}
        </template>
      </el-table-column>
      <el-table-column
        property="avgPlayTime"
        min-width="82"
        sortable
        label="人均点播时长(分)">
        <template slot-scope="scope">
          {{Number(scope.row.avgPlayTime)}}
        </template>
      </el-table-column>
      <el-table-column property="startNum" min-width="82" sortable label="查看运营位分析">
        <template slot-scope="scope" v-if="scope.row.detail">
          <el-button @click="look(scope.row.zoneCode)" type="primary">点击查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "zone-table",
    props: ["tableData","loading","height","searchData"],
    components: {

    },
    data () {
      return {

      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      look(code) {
     //   console.log(this.searchData)
    //    console.log(code)
        let that = this;
        this.searchData.zoneCode = code;
        this.$router.push({
          name: 'partAnalysis',
          params: {
            searchParam: that.searchData,
         //   zoneCode: code
          }
        });
        const obj = {
          active: true,
          name: "partAnalysis",
          path: "partAnalysis",
          text: "运营位分析",
        };
        that.$store.commit('addRecord', obj);
        that.$store.commit('changeActiveMenu', obj);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
