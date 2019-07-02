<template>
  <div class="chart-subscript">
    <div class="title">指标：</div>
    <el-popover
      placement="bottom-start"
      trigger="click"
      v-model="status"
      @show="showlist()"
      @hide="hidelist()">
      <el-radio-group
        class="radio"
        v-for="item in selectsub"
        :key="item.code"
        @change="changeRadio(item.code,item.chartType)"
        v-model="radio">
          <el-radio
            class="radio"
            :label="item.code">{{item.text}}</el-radio>
      </el-radio-group>
      <el-tooltip class="item" effect="light" popper-class="tooltips-auto" :content="tooltips" placement="top-start" slot="reference">
        <el-button type="text">{{text}}<i :class="['mgL8',{'el-icon-arrow-down':downActive ,'el-icon-arrow-up': upActive }]"></i> </el-button>
      </el-tooltip>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: 'chart-subscript',
    props:['selectsub'],
    data () {
      return {
        downActive:true,
        upActive:false,
        radio:'',
        text:'',
        tooltips:'',
        status:false,
        type:''
      }
    },
    mounted () {
      this.setText();
    },
    methods: {
      showlist(){
        let that =this;
        that.upActive = true;
        that.downActive = false;
      },
      hidelist(){
        let that =this;
        that.upActive = false;
        that.downActive = true;
      },
      setText(){
        let that = this;
        that.selectsub.forEach((item,index)=>{
          if (that.radio ===''){
            that.text=item.text;
            that.radio=item.code;
            that.type=item.chartType;
            that.tooltips=item.tooltip;
          }else{
            if (item.code === that.radio){
              that.text=item.text;
              that.tooltips=item.tooltip;
            }
          }
        });

        that.$emit("getSub", {
          type:that.type,
          radio:that.radio
        });
      },
      changeRadio(code,type){
        let that = this;
        that.radio=code;
        that.type=type;
        that.setText();
        that.status=false;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title{
    display: inline-block;
    height: 22px;
    padding-right: 5px;
    line-height: 22px;
    vertical-align: middle;
    color: #787a7d;
    font-size: .6rem;
  }
  .mgL8{
    margin-left: 8px;
  }
  .radio{
    display: block;
    padding: 3px 0;
  }
</style>
