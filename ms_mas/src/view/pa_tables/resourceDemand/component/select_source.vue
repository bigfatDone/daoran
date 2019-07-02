<template>
  <div class="search-select-link">
    <div class="selection">
      <span class="label">资源类型:</span>
      <v-select
        :data="sourceType"
        :init="initState"
        @select="changeSourceType($event)"
        class="singleSelect"></v-select>
    </div>
    <div class="selection">
      <span class="label">资源形式:</span>
      <v-select
        :data="sourceForm"
        :init="initState"
        @select="changeSourceForm($event)"
        class="singleSelect"></v-select>
    </div>
  </div>
</template>

<script>
import vSelect from "@/view/component/customSelect/singleSelect"
export default {
  name: 'select-source',
  props: ["init"],
  components: {
    vSelect
  },
  data () {
    return {
      sourceType:[
        {text:'视频',code:1,chosed:true},
        {text:'音频',code:2,chosed:false},
        {text:'手绘本',code:3,chosed:false},
      ],
      sourceForm:[
//        {text:'节目单',code:1,chosed:false},
        {text:'单个资源',code:2,chosed:true},
      ],

      sourceType_code:'',
      sourceForm_code:'',

      initState:false,
    }
  },
  mounted () {
    this.initmethods();
  },
  watch:{
    init(ev){
      if(ev === true){
        this.initAll();
      }
    }
  },
  computed: {
  },
  methods: {
    sendData () {
      let that = this;
      let data = {sourceType: that.sourceType_code, sourceForm: that.sourceForm_code};
      that.$emit("sourceCondition", data);
    },
    initmethods(){
      let that = this;
      that.sourceType.forEach((obj,i)=>{
        if (obj.chosed === true){
         that.sourceType_code = obj.code;
        }
      });
      that.sourceForm.forEach((obj,i)=>{
        if (obj.chosed === true){
          that.sourceForm_code = obj.code;
        }
      });
      that.sendData();
    },
    initAll(){
      let that = this;
      that.sourceType.forEach((obj,i)=>{
        if(i === 0){
          obj.chosed = true;
        }else {
          obj.chosed = false;
        }
      });
      that.sourceForm.forEach((obj,i)=>{
        if(i === 1){
          obj.chosed = true;
        }else {
          obj.chosed = false;
        }
      });
      that.initState = !that.initState;
      that.initmethods();
    },
    changeSourceType(item){
      let that =this;
      that.sourceType.forEach((obj,i)=>{
        obj.chosed = false;
      });
      item.chosed = true;
      that.sourceType_code = item.code;
      that.sendData();
    },
    changeSourceForm(item){
      let that =this;
      that.sourceForm.forEach((obj,i)=>{
        obj.chosed = false;
      });
      item.chosed = true;
      that.sourceForm_code = item.code;
      that.sendData();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-select-link{
    display: inline-block;
    vertical-align: middle;
  }
  .selection{
    vertical-align: middle;
    display: inline-block;
    position: relative;
    width: 180px;
    height: 30px;
    padding: 0 0 0 50px;
  }
  .label{
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 30px;
    color: #666;
    font-size: .6rem;
  }
  .select{
    display: inline-block;
    width: 80%;
    position: relative;
    font-size: .8rem;
    color: #333;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .padding-select{
    padding: 0 .6rem;
    margin: 0;
    display: block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 28px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .select span{
    display: inline-block;
    vertical-align: middle;
    height: 1.5rem;
    line-height: 28px;
    font-size: .6rem;
    color: #606266;
  }
  .select i {
    position: absolute;
    right: .4rem;
    top: 50%;
    margin: -.4rem 0 0 0;
    font-size: 14px;
    color: #ccc;
  }
  .select-wrap{
    max-height: 10rem;
    overflow: auto;
    width: 100%;
    padding-right: 0.6rem;
  }
  .selection>.el-select{
    width: 80%;
  }
  .city{
    overflow: hidden;
  }
  .tool{
    text-align: center;
  }
  .singleSelect{
    width: 80%;
    display: inline-block;
    margin-left: 15px;
  }
  .el-icon-arrow-down{
    transition:transform .3s;
    -moz-transition:-moz-transform .3s; /* Firefox 4 */
    -webkit-transition:-webkit-transform .3s; /* Safari and Chrome */
    -o-transition:-o-transform .3s; /* Opera */
  }
  .icon-active{
    transform:rotate(-180deg);
    -ms-transform:rotate(-180deg); /* Internet Explorer */
    -moz-transform:rotate(-180deg); /* Firefox */
    -webkit-transform:rotate(-180deg); /* Safari 和 Chrome */
    -o-transform:rotate(-180deg); /* Opera */
  }
  .select-focus{
    border-color: #409EFF;
  }
  @media screen and (max-width: 800px) {
    .search-select-link{
      width: 100%;
    }
    .selection{
      width: 100%;
      margin-top: 8px;
    }
    .select{
      width: 80%;
    }
  }
</style>
