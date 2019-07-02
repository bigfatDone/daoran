<template>
  <div class="search-date-contian">
    <el-button-group>
        <el-button
          v-for="(item,index) in select"
          v-if="item.visiable"
          :key="item.text"
          @click="dateSet(item.id)"
          class="date-fast-group"
          :class="{ active: item.status }">{{item.text}}</el-button>
    </el-button-group>

    <template v-if="dateModel == 3">
      <div class="date-input-group">
        <el-date-picker
          v-model="startDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="起始日期"
          :picker-options="pickerOptions0"
          @change="getRelDate('1', $event, 'clear')"
          @focus="focus">
        </el-date-picker>
        <span class="date-font">至</span>
        <el-date-picker
          v-model="endDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
          :picker-options="pickerOptions1"
          @change="getRelDate('2', $event, 'clear')"
          @focus="focus">
        </el-date-picker>
      </div>
      <span class="date-font">对比:</span>
      <div class="date-input-group">
        <el-date-picker
          v-model="startDate_2"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="对比起始日期"
          @change="getRelDate('3', $event, 'clear')"
          @focus="focus">
        </el-date-picker>
        <span class="date-font">至</span>
        <el-date-picker
          v-model="endDate_2"
          type="date"
          :disabled="true"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
          @focus="focus">
        </el-date-picker>
      </div>
    </template>

    <template v-if="dateModel == 2" >
      <div class="date-input-group">
        <!-- 按天 -->
        <div class='date' v-show='hide == 0'>
          <el-date-picker
            v-model="startDate"
            type="date"
            :clearable="false"
            range-separator="至"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
            :picker-options="pickerOptions0"
            @change="getDate()"
            @focus="focus">
          </el-date-picker>
          <span class="date-font">至</span>
          <el-date-picker
            v-model="endDate"
            type="date"
            :clearable="false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            :picker-options="pickerOptions1"
            @change="getDate()"
            @focus="focus">
          </el-date-picker>
        </div>
        <!-- 按周 -->
        <div class='weekDate' v-show='hide == 1'>
          <el-date-picker
            v-model="startDate"
            type="week"
            :clearable="false"
            range-separator="至"
            format="yyyy-MM-dd"
            placeholder="起始日期"
            :picker-options="pickerOptions2"
            @change="getDate()"
            @focus="focus">
          </el-date-picker>
           <span class="week-day" icon='el-icon-date'><img class="picker" src="@/img/date.png" />{{startDate}}&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;{{endDate}}</span>
        </div>
        <!-- 按月 -->
        <div class='monthDate' v-show='hide == 2'>
          <el-date-picker
            v-model="startDate"
            type="month"
            :clearable="false"
            format="yyyy-MM"
            placeholder="起始日期"
            :picker-options="pickerOptions3"
            @change="getMonth()"
            @focus="focus">
          </el-date-picker>
        </div>
        <!-- 按季度 -->
        <div v-show=" hide == 3" class="quarter-wrapper">
          <span class="quarter" @click.stop="showQuarter()"><img class="picker" src="@/img/date.png" />{{quarterDate}}</span>
          <el-card class="box-card" v-show="quarterContentStatus == 1">
            <div slot="header" class="clearfix header">
              <el-button icon="el-icon-arrow-left" type="text" @click.stop="pre()"></el-button>
              <span>{{nowYear}}</span>
              <el-button icon="el-icon-arrow-right" type="text" @click.stop="next()"></el-button>
            </div>
            <div class="quarter-item">
              <el-button :disabled="oneActive == 1" @click="quarter(1)">第一季度</el-button>
              <el-button :disabled="twoActive == 1" @click="quarter(2)">第二季度</el-button>
            </div>
            <div class="quarter-item">
              <el-button :disabled="threeActive == 1" @click="quarter(3)">第三季度</el-button>
              <el-button :disabled="fourActive == 1" @click="quarter(4)">第四季度</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </template>

    <template v-if="dateModel == 1">
      <div class="date-input-group">
        <el-date-picker
          v-model="singleDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="日期"
          @change="getDate()"
          @focus="focus">
        </el-date-picker>
      </div>
    </template>
  </div>
</template>

<script>
import { constants } from 'os';
  export default {
    name: 'search-date-select',
    props: {
      buttons: {
        type: String,
        default: "yesterday,lastweek,lastmonth"
      },
      dateModel: { // 1：只有一个日期 | 2：一个开始日期，一个结束日期 | 4：两个开始日期，两个结束日期
        type: String,
        default: "2"
      },
      defaultStartDate: {
        type: String,
        default: ""
      },
      defaultEndDate: {
        type: String,
        default: ""
      },
      defaultDate: {
        type: String,
        default: ""
      },
      init:{
        default:false
      }
    },
    data () {
      return{
        hide: 0,
        startDate: '',
        endDate: '',
        startDate_2: "",
        endDate_2: "",
        singleDate: "",
        weekEnd: '',
        quarterContentStatus: 0,// 季度全部选项
        quarterDate: "",
        nowYear: "", // 当前选择年
        maxYear: "", // 今年
        oneActive: false,// 第一季度选项状态
        twoActive: false,// 第二季度选项状态
        threeActive: false,// 第三季度选项状态
        fourActive: false,// 第四季度选项状态
        dateType: 'week',// 当前日期类型
        select:[
          {id: 'yesterday', text:' 按天' ,status: false, visiable: this.buttons.indexOf("yesterday") >= 0},
          {id: 'lastweek', text: '上星期', status: false, visiable: this.buttons.indexOf("lastweek") >= 0},
          {id: 'sevenday', text: '按周', status: false, visiable: this.buttons.indexOf("sevenday") >= 0},
          {id: 'lastmonth', text: '上一月', status: false, visiable: this.buttons.indexOf("lastmonth") >= 0},
          {id: 'nearthirty', text: '按月', status: false, visiable: this.buttons.indexOf("nearthirty") >= 0},
          {id: 'nearsixty', text: '按季度', status: false, visiable: this.buttons.indexOf("nearsixty") >= 0},
        ],

        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            if (this.endDate != "") {
              return time.getTime() > Date.now()-3600 * 1000 * 24 || time.getTime() >  new Date(this.endDate);
            } else {
              return time.getTime() > Date.now()-3600 * 1000 * 24;
            }
          },
        },
        pickerOptions1: {//限定结束时间不能在开始时间之前
          disabledDate: (time) => {
            return time.getTime() < new Date(this.startDate).getTime()-3600 * 1000 * 24 || time.getTime() > Date.now()-3600 * 1000 * 24;
          },
        },
        pickerOptions2: {// 日期一个星期之前
          disabledDate: (time) => {
            const setdate = new Date();// 当前时间
            let day = setdate.getDay(); // 当前星期
             if( day == 0) {
                day = 7;
              } else {
                day = day;
              }
            return time.getTime() > Date.now()-3600 * 1000 * 24 * day;
          },
          firstDayOfWeek: 1
        },
        pickerOptions3: {// 日期一个月之前
          disabledDate: (time) => {
            return time.getTime() > Date.now()-3600 * 1000 * 24*30;
          },
        },
      }
    },
    mounted () {
      this.initDate();
      document.addEventListener("click", this.hideQuarter);// 实现点击全局隐藏季度
    },
    destroyed() {
      document.removeEventListener("click", this.hideQuarter);// 退出之后销毁全局事件
    },
    watch:{
      init(ev){
        if(ev === true){
          this.initDate();
        }
      }
    },
    methods: {
      focus (obj) {
        let that = this;
        obj.blur();
      },
      dateSet (id){  //设置选择时间
        let that =this;
        that.select.forEach((item,index)=>{
          if(item.id === id){
            item.status = true;
          }else {
            item.status = false;
          }
        });
        if (id === 'yesterday'){
          that.yesterday();
        }else if (id === 'lastweek'){
          that.lastweek();
        }else if(id === 'lastmonth'){
          that.lastmonth();
        }else if(id === 'sevenday'){
          that.weekDays(7);
        }else if(id === 'nearthirty'){
          that.monthDays(30);
        }else if(id === 'nearsixty'){
          that.initQuarterDate()
          // that.nearDays(60);
        }
      },
     /*  nearDays (near) {
        let that =this;
        const setdate = new Date();
        let lastweekStart=that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24 * near),"yyyy-MM-dd");
        let lastweekEnd=that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24 * (near - 1)),"yyyy-MM-dd");
        that.startDate = lastweekStart;
        that.endDate = lastweekEnd;
        let date = {
          dateStart:lastweekStart,
          dateEnd:lastweekEnd
        };
        //that.getRelDate(1, null);
        //that.$emit("getDate", date);
        if (that.dateModel < 3) {
          that.$emit("getDate", date);
        } else {
          that.getRelDate(1, null);
        }
      }, */
      weekDays (near) {// 获取上一个周的时间
        this.hide = 1;
        let that =this;
        const setdate = new Date();// 当前时间
        let day = setdate.getDay(); // 当前星期
         if( day == 0) {
           day = 6;
        } else {
          day = day -1;
        }
        let lastweekStart=that.$dateFormat(setdate.setTime(setdate.getTime()- 3600 * 1000 * 24 * (near+day)),"yyyy-MM-dd");
        let lastweekEnd=that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24 * 6),"yyyy-MM-dd");
        that.startDate = lastweekStart;
        that.endDate = lastweekEnd;
        that.dateType = 'week';
        let data = {
          dateStart:lastweekStart,
          dateEnd:'',
          dateType: that.dateType
        };
        if (that.dateModel < 3) {
          that.$emit("getDate", data);
        } else {
          that.getRelDate(1, null);
        }
      },
      monthDays (near) {// 设置按月份的时间格式
        this.hide = 2;
        let that =this;
        const setdate = new Date();
        let lastweekStart=that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24 * near),"yyyy-MM-dd");
        lastweekStart = lastweekStart.split('-')
        lastweekStart[lastweekStart.length-1] = '01'
        that.startDate = lastweekStart.join('-');
         let date = {
          dateStart:this.startDate,
          dateEnd:'',
          dateType:'month'
        };
        if (this.dateModel < 3) {
          this.$emit("getDate", date);
        } else {
          this.getRelDate(1, null);
        }
      },
      weekCheck() { // 检查周格式
        let startWeek = new Date(this.startDate).getTime();
        let endWeek = new Date().getDay();
        if( endWeek == 0) {
           endWeek = 6;
        } else {
          endWeek = endWeek -1;
        }
        this.startDate = this.$dateFormat(startWeek - 3600 * 1000 * 24 * 1,"yyyy-MM-dd")
        this.endDate = this.$dateFormat(startWeek + 3600 * 1000 * 24 * 5,"yyyy-MM-dd")
        let date = {
          dateStart:this.startDate,
          dateEnd:'',
          dateType:'week'
        };
        if (this.dateModel < 3) {
          this.$emit("getDate", date);
        } else {
          this.getRelDate(1, null);
        }
      },
      // 向父组件传月值
      getMonth() {
        let year = this.startDate.getFullYear();
        let month = this.startDate.getMonth()+1;
        if(month < 10 ){
          month = '0'+month;
        }
        let startDate = year+'-'+month+'-'+'01';
        let date = {
          dateStart:startDate,
          dateEnd:'',
          dateType:'month'
        };
        this.$emit("getDate", date);
      },
      // 向父组件传递所有数据
      getDate () {
        let that = this;
        if(this.hide == 0){
          that.dateType = 'daily'
        } else if(this.hide == 1) {
          this.weekCheck()
        }
          that.select.forEach((item,index)=>{
            item.status = false;
          });
          let date = {};

          if (that.dateModel == 2) {
            date = {
              dateStart: that.startDate,
              dateEnd: that.endDate,
              dateType: that.dateType
            }
          } else if (that.dateModel == 1) {
            date = {
              singleDate: that.singleDate
            }
          }
          that.$emit("getDate", date);
      },
      getRelDate (type, date, clear) {
        let that = this;

        if (clear && clear == "clear") {
          that.select.forEach((item,index)=>{
            item.status = false;
          });
        }
        if (that.startDate == null || that.endDate == null || that.startDate_2 == null || that.endDate_2 == null) {
          return;
        }

        let start = new Date(that.startDate.replace(/\-/g, "\/")).getTime();
        let end = new Date(that.endDate.replace(/\-/g, "\/")).getTime();
        let diff = (end - start) / 86400000;
        if (type < 3) {
          let end_2 = that.$dateFormat(start - 3600 * 1000 * 24,"yyyy-MM-dd");
          let start_2 = that.$dateFormat(start - 3600 * 1000 * 24 * (diff + 1),"yyyy-MM-dd");
          that.endDate_2 = end_2;
          that.startDate_2 = start_2;
        } else {
          let end_temp = new Date(that.startDate_2.replace(/\-/g, "\/")).getTime();
          let end_2 = that.$dateFormat(end_temp + 3600 * 1000 * 24 * diff,"yyyy-MM-dd");
          that.endDate_2 = end_2;
        }

        let result = {
          start_date_1: that.startDate,
          end_date_1: that.endDate,
          start_date_2: that.startDate_2,
          end_date_2: that.endDate_2
        };

        that.$emit("getDate", result);
      },
      yesterday(){
        this.hide = 0;
        let that =this;
        const setdate = new Date();
        let yesterday=that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
        that.startDate = yesterday;
        that.endDate = yesterday;
        let date = {
          dateStart:yesterday,
          dateEnd:yesterday,
          dateType:'daily'
        };
        if (that.dateModel < 3) {
          that.$emit("getDate", date);
        } else {
          that.getRelDate(1, null);
        }
      },
      lastweek(){
        let that =this;
        const setdate = new Date();
        let day = setdate.getDay();
        let lastweekStart=that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24*(6+day)),"yyyy-MM-dd");
        let lastweekEnd=that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24*6),"yyyy-MM-dd");

        that.startDate = lastweekStart;
        that.endDate = lastweekEnd;
        let date = {
          dateStart:lastweekStart,
          dateEnd:lastweekEnd
        };
        if (that.dateModel < 3) {
          that.$emit("getDate", date);
        } else {
          that.getRelDate(1, null);
        }
      },
      lastmonth(){
        let that =this;
        const setdate = new Date();
        let years = setdate.getFullYear();
        let month = setdate.getMonth();
        if (month === 0){
          month = 12;
          years=years-1;
        }
        const mon = new Date(years,month,0);
        let day =mon.getDate();
        const monthStart = new Date(years,month-1,1);
        const monthEnd = new Date(years,month-1,day);
        let lastmonthStart=that.$dateFormat(monthStart.setTime(monthStart.getTime()),"yyyy-MM-dd");
        let lastmonthEnd=that.$dateFormat(monthEnd.setTime(monthEnd.getTime()),"yyyy-MM-dd");
        that.startDate = lastmonthStart;
        that.endDate = lastmonthEnd;
        let date = {
          dateStart:lastmonthStart,
          dateEnd:lastmonthEnd
        };
        if (that.dateModel < 3) {
          that.$emit("getDate", date);
        } else {
          that.getRelDate(1, null);
        }
      },
      initDate(){
        let that = this;
        const end = new Date();

        if (that.defaultDate != "") {
          that.dateSet(that.defaultDate);
          return;
        } else {
          if (that.defaultEndDate != "") {
            that.endDate = that.defaultEndDate;
          } else {
            that.endDate = that.$dateFormat(end.setTime(end.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
          }
          if (that.defaultStartDate != "") {
            that.startDate = that.defaultStartDate;
          } else {
            that.startDate = that.$dateFormat(end.setTime(end.getTime() - 3600 * 1000 * 24 * 6),"yyyy-MM-dd");
          }
        }

        if (that.dateModel < 3) {
          that.getDate();
        } else {
          that.getRelDate(1, null);
        }
      },
      // 季度方法
      showQuarter() {
        this.quarterContentStatus = 1
      },
      // 季度方法隐藏
      hideQuarter() {
        this.quarterContentStatus = 0
      },
      pre() {// 月减
        --this.nowYear
        this.checkQuarter();
      },
      next() {// 月加
        if( this.nowYear < this.maxYear ){
          ++this.nowYear
        }
        this.checkQuarter();
      },
      quarter(val) {// 季度显示框赋值
        let startDate = '';
        this.quarterContentStatus = 0;
        switch(val) {
          case 1:
            this.quarterDate = this.nowYear +' '+'第一季度';
            startDate = this.nowYear+'-01'+'-01';
            break;
          case 2:
            this.quarterDate = this.nowYear +' '+'第二季度';
            startDate = this.nowYear+'-04'+'-01';
            break;
          case 3:
            this.quarterDate = this.nowYear +' '+'第三季度';
            startDate = this.nowYear+'-07'+'-01';
            break;
          case 4:
            this.quarterDate = this.nowYear +' '+'第四季度';
            startDate = this.nowYear+'-10'+'-01';
            break;
        }
        let data = {
          dateStart:startDate,
          dateEnd:'',
          dateType:'quarter'
        };
        if (this.dateModel < 3) {
          this.$emit("getDate", data);
        } else {
          this.getRelDate(1, null);
        }
      },
      initQuarterDate() {// 初始化季度
        let startDate = '';
        this.hide = 3;
        let date = new Date();
        let year =  date.getFullYear();
        let month = date.getMonth() + 1;
        this.nowYear = year;
        this.maxYear = date.getFullYear();
        this.checkQuarter();
         if(month < 4) {
          this.quarterDate = (this.nowYear-1)+' '+'第四季度';
          startDate = (this.nowYear-1)+'-10'+'-01';
          } else if ( month < 7 ) {
            this.quarterDate = this.nowYear+' '+'第一季度';
            startDate = this.nowYear+'-01'+'-01';
          } else if (month < 10 ) {
            this.quarterDate = this.nowYear+' '+'第二季度';
            startDate = this.nowYear+'-04'+'-01';
          } else {
            this.quarterDate = this.nowYear+' '+'第三季度';
            startDate = this.nowYear+'-07'+'-01';
          }
        let data = {
          dateStart:startDate,
          dateEnd:'',
          dateType:'quarter'
        };
        if (this.dateModel < 3) {
          this.$emit("getDate", data);
        } else {
          this.getRelDate(1, null);
        }
      },
      checkQuarter() {// 季度显示选项
        let date = new Date();
        let month = date.getMonth() + 1;
        console.log(month)
        console.log(this.nowYear)
        let year =  date.getFullYear();
        console.log(year)
        if( this.nowYear ==  year) {
          if(month < 4) {
            this.oneActive = 1;
            this.twoActive = 1;
            this.threeActive = 1;
            this.fourActive = 1;
          } else if ( month < 7 ) {
            this.twoActive = 1;
            this.threeActive = 1;
            this.fourActive = 1;
          } else if (month < 10 ) {
            this.threeActive = 1;
            this.fourActive = 1;
          } else {
            this.fourActive = 1;
          }
        } else {
          this.oneActive = 0;
          this.twoActive = 0;
          this.threeActive = 0;
          this.fourActive = 0;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .date-font{
    margin: 0 .2rem 0 .2rem;
    font-size: .5rem;
  }
  .el-date-editor.el-input{
    width: 42%;
    min-width: 130px;
  }
  .date-input-group{
    display: block;
  }
  .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .search-date-contian{
    display: inline-block;
  }
  .week-day{
    height: 27px;
    line-height: 27px;
    padding-right: 30px;
    margin-left: -225px;
    border-radius: 4px;
    font-size: 12px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    color: #606266;
    display: inline-block;
  }
  .date-input-group {
    position: relative;
  }
  .date-input-group .box-card {
    position: absolute;
    z-index: 99;
  }
  .box-card {
        margin-top: 10px;
  }
  .quarter{
    height: 28px;
    line-height: 28px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 4px;
    font-size: 12px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    color: #606266;
    display: inline-block;
    z-index: 99;
    position: relative;
    background-color: #fff;
  }
  .quarter-item {
    margin-bottom: 20px;
  }
  .header {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .weekDate span {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .quarter-wrapper span {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .picker {
    height: 12px;
    position: absolute;
    left: 4px;
    top: 7px;
  }
  @media screen and (min-width: 640px) {
    .date-input-group{
      margin: 0;
      width: 350px;
      display: inline-block;
    }
  }
</style>
<style>
  .box-card .el-card__header {
    padding: 0;
    font-size: 14px;
  }
  .box-card .el-button--text {
    color: #909396;
  }
  .weekDate .el-date-editor.el-input {
    min-width: 220px;
    opacity: 0;
    z-index: 999;
  }
</style>

