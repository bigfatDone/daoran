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

    <template v-if="dateModel == 2">
      <div class="date-input-group">
        <el-date-picker
          v-model="startDate"
          type="date"
          :clearable="false"
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
  export default {
    name: 'search-date-ott',
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
        startDate: '',
        endDate: '',
        startDate_2: "",
        endDate_2: "",
        singleDate: "",
        select:[
          {id: 'today', text:' 今天' ,status: false, visiable: this.buttons.indexOf("today") >= 0},
          {id: 'yesterday', text:' 昨日' ,status: false, visiable: this.buttons.indexOf("yesterday") >= 0},
          {id: 'lastweek', text: '上星期', status: false, visiable: this.buttons.indexOf("lastweek") >= 0},
          {id: 'sevenday', text: '近7天', status: false, visiable: this.buttons.indexOf("sevenday") >= 0},
          {id: 'lastmonth', text: '上一月', status: false, visiable: this.buttons.indexOf("lastmonth") >= 0},
          {id: 'nearthirty', text: '近30天', status: false, visiable: this.buttons.indexOf("nearthirty") >= 0},
          {id: 'nearsixty', text: '近60天', status: false, visiable: this.buttons.indexOf("nearsixty") >= 0},
        ],

        pickerOptions0: {//限定开始时间为今天之前
          disabledDate: (time) => {
            if (this.endDate != "") {
              return time.getTime() >= Date.now() || time.getTime() >  new Date(this.endDate);
            } else {
              return time.getTime() >= Date.now();
            }

          }
        },
        pickerOptions1: {//限定结束时间不能在开始时间之前
          disabledDate: (time) => {
            // return time.getTime() < new Date(this.startDate).getTime() -3600 * 2000 * 24 || time.getTime() > Date.now();
            return time.getTime() < new Date(this.startDate).getTime()-3600 * 1000 * 24 || time.getTime() > Date.now()-3600 * 1000 * 24;
          }
        },
      }
    },
    mounted () {
      this.initDate();
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
      dateSet (id){
        let that =this;
        that.select.forEach((item,index)=>{
          if(item.id === id){
            item.status = true;
          }else {
            item.status = false;
          }
        });
        if (id === 'today'){
          that.today();
        }else if (id === 'yesterday'){
          that.yesterday();
        }else if (id === 'lastweek'){
          that.lastweek();
        }else if(id === 'lastmonth'){
          that.lastmonth();
        }else if(id === 'sevenday'){
          that.nearDays(7);
        }else if(id === 'nearthirty'){
          that.nearDays(30);
        }else if(id === 'nearsixty'){
          that.nearDays(60);
        }
      },
      nearDays (near) {
        let that =this;
        const setdate = new Date();
        let lastweekStart=that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24 * near),"yyyy-MM-dd");
        let lastweekEnd=that.$dateFormat(setdate.setTime(setdate.getTime() + 3600 * 1000 * 24 * (near - 1)),"yyyy-MM-dd");
        that.startDate = lastweekStart;
        that.endDate = lastweekEnd;
        let date = {
          dateSart:lastweekStart,
          dateEnd:lastweekEnd
        };
        //that.getRelDate(1, null);
        //that.$emit("getDate", date);
        if (that.dateModel < 3) {
          that.$emit("getDate", date);
        } else {
          that.getRelDate(1, null);
        }
      },
      getDate () {
        let that = this;
        that.select.forEach((item,index)=>{
          item.status = false;
        });
        let date = {};

        if (that.dateModel == 2) {
          date = {
            dateSart: that.startDate,
            dateEnd: that.endDate
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
      today(){
        let that =this;
        const setdate = new Date();
        let today=that.$dateFormat(setdate.setTime(setdate.getTime()),"yyyy-MM-dd");
        that.startDate = today;
        that.endDate = today;
        let date = {
          dateSart:today,
          dateEnd:today
        };
        if (that.dateModel < 3) {
          that.$emit("getDate", date);
        } else {
          that.getRelDate(1, null);
        }
      },
      yesterday(){
        let that =this;
        const setdate = new Date();
        let yesterday=that.$dateFormat(setdate.setTime(setdate.getTime() - 3600 * 1000 * 24),"yyyy-MM-dd");
        that.startDate = yesterday;
        that.endDate = yesterday;
        let date = {
          dateSart:yesterday,
          dateEnd:yesterday
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
          dateSart:lastweekStart,
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
          dateSart:lastmonthStart,
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
    padding: .3rem 0;
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
  @media screen and (min-width: 640px) {
    .date-input-group{
      margin: 0;
      width: 350px;
      display: inline-block;
    }
  }
</style>
