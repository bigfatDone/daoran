<template>
  <div class="pages">
    <el-radio-group
      v-model="tableChecked"
      @change="changeTableChecked"
      size="mini">
      <el-radio-button label="top">top数据</el-radio-button>
      <el-radio-button label="demand">播放数据</el-radio-button>
    </el-radio-group>
    <el-collapse-transition>
      <div v-show="topVisible">
        <v-search-top
          :pageindex="topPageindex"
          @search="searchTopResult($event)"
          @searchForm="searchTopFormResult($event)"
          @loadingTable="loadingTopResult($event)"
          @count="topTablecountResult($event)"
          @tableType="changeTableType($event)"></v-search-top>
        <v-table-top
          :table-data="topTableData"
          :table-visible="tableVisible"
          :loading="loadingTop"
          :height="tableHeight"
          :count="topTablecount"
          :search-form="searchTopForm"
          @page="topPageChange($event)"></v-table-top>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="demandVisible">
        <v-search-demand
          :pageindex="demandPageindex"
          @search="searchDemandResult($event)"
          @searchForm="searchDemandFormResult($event)"
          @loadingTable="loadingDemandResult($event)"
          @count="demandTablecountResult($event)"></v-search-demand>
        <v-table-demand
          :table-data="demandTableData"
          :table-visible="demandtableVisible"
          :loading="loadingDemand"
          :height="tableHeight"
          :count="demandTablecount"
          :search-form="searchDemandForm"
          @page="demandPageChange($event)"></v-table-demand>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
  import vSearchTop from "./search_top"
  import vSearchDemand from "./search_demand"
  import vTableTop from "./table_top"
  import vTableDemand from "./table_demand"
  export default {
    name: "resourceDemand",
    components: {
      vSearchTop,vSearchDemand,vTableTop,vTableDemand
    },
    data () {
      return {
        tableChecked:'top',
        topVisible:false,
        demandVisible:false,
        tableHeight:'500',

        tableVisible:{
          title:'播放次数（VV）',
          name:'playNum',
          codename:'资源编码',
          titlename:'资源名称',
        },
        demandtableVisible:{
          codename:'资源编码',
          titlename:'资源名称',
        },
        tableName:[
          {name:'playNum',title:'播放次数（VV）',id:1},
          {name:'playUserNum',title:'播放人数（UV）',id:2},
          {name:'playTimeTotal',title:'播放时长（PT）(时)',id:3},
          {name:'userAvgTime',title:'人均播放时长(分)',id:4},
          {name:'playAvgTime',title:'次均播放时长(分)',id:5},
        ],
        titleName:[
          {codename:'资源编码',titlename:'资源名称',id:2},
          {codename:'节目单编码',titlename:'节目单名称',id:1}
        ],


        topTableData:[],
        searchTopForm:{},
        loadingTop:false,
        topPageindex:1,
        topTablecount:100,

        demandTableData:[],
        searchDemandForm:{},
        loadingDemand:false,
        demandPageindex:1,
        demandTablecount:100,
      }
    },
    computed: {

    },
    created () {
      let that = this;
      if (document.body.clientWidth > 800){
        that.tableHeight='500';
      }else {
        that.tableHeight=document.body.clientHeight - 220;
      }
    },
    mounted () {
      this.changeTableChecked(this.tableChecked);
      const that = this;
      window.onresize = () => {
        return (() => {
          if (document.body.clientWidth > 800){
            that.tableHeight='500';
          }else {
            that.tableHeight=document.body.clientHeight - 220;
          }
        })()
      }
    },
    methods: {
      changeTableChecked(val){
        let that = this;
        if(val === 'top'){
          that.topVisible = true;
          that.demandVisible = false;
        }else {
          that.topVisible = false;
          that.demandVisible = true;
        }
      },
      changeTableType(val){
        let that = this;
        that.tableName.forEach((item,index)=>{
          if(item.id === val){
            that.tableVisible.title=item.title;
            that.tableVisible.name=item.name;
          }
        });
      },
      topPageChange(val){
        let that = this;
        that.topPageindex = val;
      },
      topTablecountResult(data){
        let that = this;
        if (data === undefined){
          data =1;
        }
        that.topTablecount = data;
      },
      searchTopResult(data){
        let that = this;
        that.topTableData = data;
      },
      searchTopFormResult(data){
        let that = this;
        that.searchTopForm = data;
        that.titleName.forEach((item,index)=>{
          if(data.xingshi === item.id){
            that.tableVisible.codename=item.codename;
            that.tableVisible.titlename=item.titlename;
          }
        });
      },
      loadingTopResult(state){
        let that = this;
        that.loadingTop = state;
      },

      //demand
      searchDemandResult(data){
        let that = this;
        that.demandTableData = data;
      },
      searchDemandFormResult(data){
        let that = this;
        that.searchDemandForm = data;
        that.titleName.forEach((item,index)=>{
          if(data.xingshi === item.id){
            that.demandtableVisible.codename=item.codename;
            that.demandtableVisible.titlename=item.titlename;
          }
        });
      },
      loadingDemandResult(state){
        let that = this;
        that.loadingDemand = state;
      },
      demandTablecountResult(data){
        let that = this;
        that.demandTablecount = data;
      },
      demandPageChange(val){
        let that = this;
        that.demandPageindex = val;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
