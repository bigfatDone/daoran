<template>
  <div class="roleManage">
    <v-table
      :table-data="tableData"
      @delRole="getRoleList($event)"></v-table>
  </div>
</template>

<script>
  import vTable from "./table"
  export default {
    name: 'roleManage',
    components: {
      vTable,
    },
    data () {
      return {
        url: {
          getRoleList: "/ms_bas/role/datagrid?field=id,roleCode,roleName,roleType,createBy,createDate,updateBy,updateDate,",
        },
        tableData: {},
      }
    },
    computed: {

    },
    mounted () {
      this.getRoleList();
    },
    methods: {
      getRoleList () {
        let that = this;
        that.$ajax({
          url: that.url.getRoleList,
          data: {},
          method: "post",
          success: function (res) {
            that.tableData = res.data;
          },
          error: function (err) {
            that.$message.error(err);
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
