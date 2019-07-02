<template>
  <div class="pages">
    <v-search @search="searchResult($event)"></v-search>
    <ul class="table-list">
      <li>
        <div class="data-title">用户总数</div>
        <div class="data-value">{{listData.userNum}}</div>
      </li>
      <li>
        <div class="data-title">会员总数</div>
        <div class="data-value">{{listData.memberNum}}</div>
      </li>
      <li>
        <div class="data-title">VIP总数</div>
        <div class="data-value">{{listData.vipNum}}</div>
        <div class="data-contrast">对比昨日  <span class="up" :class="{'down':state.yesterDayVipRate}">{{listData.yesterDayVipRate}}%<i class="el-icon-upload2" :class="{'el-icon-download':state.yesterDayVipRate}"></i> </span></div>
      </li>
      <li>
        <div class="data-title">订购成功数（累计）</div>
        <div class="data-value">{{listData.orderSuccessNum}}</div>
      </li>
      <li>
        <div class="data-title">收入流水（累计）</div>
        <div class="data-value">{{listData.money}}</div>
      </li>
      <li>
        <div class="data-title">收入流水（本月）</div>
        <div class="data-value">{{listData.moneyMonth}}</div>
        <div class="data-contrast">同比上月  <span class="up" :class="{'down':state.moneyMonthRate}">{{listData.moneyMonthRate}}%<i class="el-icon-upload2" :class="{'el-icon-download':state.moneyMonthRate}"></i> </span></div>
      </li>
      <li>
        <div class="data-title">订购成功数（本月）</div>
        <div class="data-value">{{listData.orderSuccessNumMonth}}</div>
        <div class="data-contrast">同比上月  <span class="up" :class="{'down':state.orderSuccessNumMonthRate}">{{listData.orderSuccessNumMonthRate}}%<i class="el-icon-upload2" :class="{'el-icon-download':state.orderSuccessNumMonthRate}"></i> </span></div>
      </li>
      <li>
        <div class="data-title">访问用户数（本月）</div>
        <div class="data-value">{{listData.activeUser}}</div>
        <div class="data-contrast">同比上月  <span class="up" :class="{'down':state.activeUserRate}">{{listData.activeUserRate}}%<i class="el-icon-upload2" :class="{'el-icon-download':state.activeUserRate}"></i> </span></div>
      </li>
      <li>
        <div class="data-title">点播用户数（本月）</div>
        <div class="data-value">{{listData.playUserNum}}</div>
        <div class="data-contrast">同比上月  <span class="up" :class="{'down':state.playUserNumRate}">{{listData.playUserNumRate}}%<i class="el-icon-upload2" :class="{'el-icon-download':state.playUserNumRate}"></i> </span></div>
      </li>
      <li>
        <div class="data-title">点播次数（本月）</div>
        <div class="data-value">{{listData.playNum}}</div>
        <div class="data-contrast">同比上月  <span class="up" :class="{'down':state.playNumRate}">{{listData.playNumRate}}%<i class="el-icon-upload2" :class="{'el-icon-download':state.playNumRate}"></i> </span></div>
      </li>
    </ul>
  </div>
</template>

<script>
  import vSearch from "./search"
  export default {
    name: "overviewOTT",
    components: {
      vSearch
    },
    data () {
      return {
        listData:{},
        state:{
          yesterDayVipRate:true,
        },
      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      searchResult(data){
        let that = this;
        that.listData = data;
        for(let key in that.listData){
          if(that.listData[key]>=0){
            that.state[key] = false;
          }else {
            that.state[key] = true;
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .table-list{
    margin:.5rem 0;
    padding: 0;
    display: block;
    font-size: .8rem;
  }
  .table-list li{
    height: 5rem;
    width: 9rem;
    margin: 0 0 .4rem .8rem;
    padding: .3rem .5rem;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: .5rem;
    vertical-align: top;
  }
  .data-value{
    margin: .6rem auto .4rem auto;
    text-align: center;
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .data-contrast{
    font-size: .6rem;
    color: #8c939d;
  }
  .data-contrast>.up{
    color: #f60;
  }
  .data-contrast>.down{
    color: #67C23A;
  }
</style>
