<template>
  <div class="answerCom">
    <div class="backfix"></div>

    <div class="number_box">
      <div class="wrap clb">
        <div class="box" :class="{'active': numIndex === index+1}" v-for="(el, index) in numList">
          <span>{{el}}</span>
        </div>
      </div>
    </div>

    <div class="timeWrap">
      <div class="timeBar" :style="{width: timeBarWidth+'%', background: timeBarBackground}">
        <div class="times" :style="{borderColor: timeBarBackground}">{{times}}s</div>
      </div>
    </div>

    <!-- 单选题部分 -->
    <div class="an_box" v-if="numIndex<=8 && !showDaan">
      <div class="an_wrap">
        <div class="bgbox">
          <img src="../../assets/zyyh/imgs/questionpage_bg_board2.png" alt="" />
        </div>
        <div class="xhbox">
          <img src="../../assets/zyyh/imgs/questionpage_icon_readbook.png" alt="" />
        </div>

        <div class="mainbox" v-for="(el, index) in singleSubject" v-if="numIndex===index+1">
          <div class="question">
            <span class="s_tit">单选题</span>
            <span class="que">{{el.content}}</span>
          </div>

          <div class="answer">
            <div class="option">
              <checker v-model="singleSelect" default-item-class="item" selected-item-class="item_selected" radio-required>
                <checker-item :value="item" v-for="(item, index2) in el.items" :key="index2" @on-item-click="itemClick" @on-change="itemChange">
                  <span class="abc">{{item.value}}</span>
                  <span class="font">{{item.key}}</span>
                </checker-item>
              </checker>
            </div>
          </div>
          <div class="btnbox_com self">
            <div class="btn" @click.stop="commit(numIndex, el)">确认答案</div>
          </div>
        </div>

        <!-- 跳转多选题提示 -->
        <div class="topzzc2" v-if="showTip2" @click.stop="hideTip2()"></div>
        <div class="tantipwrap2" v-if="showTip2" @click.stop="hideTip2()">
          <div class="imgbox">
            <img src="../../assets/zyyh/imgs/questionpage_bg_switch.png" alt="" />
          </div>
          <div class="font">
            <p>下面将进入<span>多选题</span></p>
            <p>请注意选择</p>
          </div>

          <div class="btnbox_com tipbtn">
            <div class="btn" @click.stop="hideTip2()">好的</div>
          </div>
        </div>
      </div>
    </div>


    <!-- 多选题部分 -->
    <div class="an_box" v-if="numIndex>8 && !showDaan">
      <div class="an_wrap">
        <div class="bgbox">
          <img src="../../assets/zyyh/imgs/questionpage_bg_board2.png" alt="" />
        </div>
        <div class="xhbox">
          <img src="../../assets/zyyh/imgs/questionpage_icon_readbook.png" alt="" />
        </div>

        <div class="mainbox" v-for="(el, index) in multipleSubject" v-if="numIndex===index+9">
          <div class="question">
            <span class="s_tit">多选题</span>
            <span class="que">{{el.content}}</span>
          </div>

          <div class="answer">
            <div class="option">
              <checker v-model="multipleSelect" type="checkbox" default-item-class="item" selected-item-class="item_selected">
                <checker-item :value="item" v-for="(item, index2) in el.items" :key="index2" @on-item-click="itemClick2">
                  <span class="abc">{{item.value}}</span>
                  <span class="font">{{item.key}}</span>
                </checker-item>
              </checker>
            </div>
          </div>
          <div class="btnbox_com self">
            <div class="btn" @click.stop="commit(numIndex, el)">确认答案</div>
          </div>
        </div>

      </div>
    </div>

    <!-- 公布答案部分 -->
    <div class="an_box" v-if="showDaan">
      <div class="an_wrap">
        <div class="bgbox">
          <img src="../../assets/zyyh/imgs/questionpage_bg_board2.png" alt="" />
        </div>
        <div class="xhbox">
          <img src="../../assets/zyyh/imgs/questionpage_icon_readbook.png" alt="" />
        </div>

        <div class="mainbox" v-for="(el, index) in allSubject" v-if="numIndex===index+1">
          <div class="question">
            <span class="s_tit">{{numIndex<=8 ? '单选题' : '多选题'}}</span>
            <span class="que">{{el.content}}</span>
          </div>

          <div class="answer">
            <div class="option">
              <checker v-model="multipleSelect" type="checkbox" default-item-class="item" selected-item-class="item_selected">
                <checker-item :value="item" v-for="(item, index2) in el.items" :key="index2" disabled>
                  <span class="abc" :class="[{'dui': item.classType==='yes'},{'cuo': item.classType==='no'},{'pt': item.classType==='pt'}]">{{item.classType==='yes' ? '√' : (item.classType==='no' ? '×' : item.value)}}</span>
                  <span class="font">{{item.key}}</span>
                </checker-item>
              </checker>
            </div>

            <div class="daan">答案：<span>{{el.answer}}</span></div>
          </div>
          <div class="btnbox_com self">
            <div class="btn" @click.stop="next()">{{numIndex < 10 ? '下一题' : '查看结果'}}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  // import Storage from '../../libs/storage'

  import { Checker, CheckerItem } from 'vux';

  export default {
    data() {
      return {
        showTip2: false,
        numList: [1,2,3,4,5,6,7,8,9,10],
        numIndex: 1,
        timeBarWidth: 100,
        timeBarBackground: '#56d288', // 56d288, ff9c60, ff5151
        times: 30,
        singleSubject: [],
        singleSelect: {},
        multipleSubject: [],
        multipleSelect: [],
        allSubject: [],
        timer: null,
        rightNum: 0,
        showDaan: false
      }
    },
    components: {
      Checker,
      CheckerItem
    },
    methods: {
      getQueList () {
        let t = this;
        let param = {
          singleNum: 8,
          multipleNum: 2
        };
        t.$parent.showLoad = true;
        t.$http.post(window.BL.apiUrl + t.$parent.middleApi + '/act/subject/getInfo', param).then(({data}) => {
          t.$parent.showLoad = false;
          // t.$parent.log(data);
          if (data.code === 10000000) {
            t.singleSubject = data.singleSubject;
            t.multipleSubject = data.multipleSubject;
            for (let i = 0; i < t.singleSubject.length; i++) {
              t.singleSubject[i].items = [];
              t.singleSubject[i].items.push({'key': t.singleSubject[i].answerMap.A, 'value': 'A', 'classType': 'null'});
              t.singleSubject[i].items.push({'key': t.singleSubject[i].answerMap.B, 'value': 'B', 'classType': 'null'});
              if (t.singleSubject[i].answerMap.C) {
                t.singleSubject[i].items.push({'key': t.singleSubject[i].answerMap.C, 'value': 'C', 'classType': 'null'});
              }
              if (t.singleSubject[i].answerMap.D) {
                t.singleSubject[i].items.push({'key': t.singleSubject[i].answerMap.D, 'value': 'D', 'classType': 'null'});
              }
              if (t.singleSubject[i].answerMap.E) {
                t.singleSubject[i].items.push({'key': t.singleSubject[i].answerMap.E, 'value': 'E', 'classType': 'null'});
              }
            }
            for (let i = 0; i < t.multipleSubject.length; i++) {
              t.multipleSubject[i].items = [];
              t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.A, 'value': 'A', 'classType': 'null'});
              t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.B, 'value': 'B', 'classType': 'null'});
              t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.C, 'value': 'C', 'classType': 'null'});
              if (t.multipleSubject[i].answerMap.D) {
                t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.D, 'value': 'D', 'classType': 'null'});
              }
              if (t.multipleSubject[i].answerMap.E) {
                t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.E, 'value': 'E', 'classType': 'null'});
              }
              if (t.multipleSubject[i].answerMap.F) {
                t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.F, 'value': 'F', 'classType': 'null'});
              }
              if (t.multipleSubject[i].answerMap.G) {
                t.multipleSubject[i].items.push({'key': t.multipleSubject[i].answerMap.G, 'value': 'G', 'classType': 'null'});
              }
            }
            t.allSubject = t.singleSubject.concat(t.multipleSubject);
            t.timeOut();
          } else {
            t.$parent.alert('提示', data.text, () => {
              t.goUrl('/zyyhIndex');
            });
          }
        })
      },
      timeOut () {
        let t = this;
        t.timer = window.setInterval(() => {
          t.timeBarWidth-=3.1;
          t.times--;
          if (t.timeBarWidth < 70 && t.timeBarWidth > 39) {
            t.timeBarBackground = '#ff9c60';
          } else if (t.timeBarWidth < 39) {
            t.timeBarBackground = '#ff5151';
          }
          if (t.times < 1) {
            window.clearInterval(t.timer);
            // t.timeBarWidth = 100;
            // t.timeBarBackground = '#56d288';
            // t.numIndex++;
            // t.times = 30;
            t.commit(t.numIndex, t.allSubject[t.numIndex-1], true);
            t.showDaan = true;
            // window.setTimeout(() => {
            //   t.timeOut();
            // }, 500);
          }
        }, 1000);
      },
      addRecord (subjectId, result, userAnswer) {
        let t = this;
        let param = {
          actCode: 'zyyhzx',
          nodeCode: '001000',
          userId: window.BL.userId,
          subjectId: subjectId, // int
          result: result, // 0: no, 1: yes
          userAnswer: userAnswer,
        };

        t.$http.post(window.BL.apiUrl + t.$parent.middleApi + '/act/subject/record', param).then(({data}) => {
          if (data.code === 10000000) {
          } else {
            t.$parent.alert('提示', data.text, () => {
              // t.goUrl('/zyyhIndex');
            });
          }
        })
      },
      commit (i, el, timeout) {
        let t = this;
        // t.$parent.con('tit', 'str');
        if (this.numIndex > 10) {
          return;
        }
        if (t.numIndex <= 8) {
          if (t.singleSelect.value) {
            if (t.singleSelect.value === el.answer) {  // 单选对
              t.rightNum++;
              t.addRecord(el.subjectId, 1, t.singleSelect.value);
              if (el.answer === 'A') {
                t.singleSubject[i-1].items[0].classType = 'yes';
              } else if (el.answer === 'B') {
                t.singleSubject[i-1].items[1].classType = 'yes';
              }
              else if (el.answer === 'C') {
                t.singleSubject[i-1].items[2].classType = 'yes';
              } else if (el.answer === 'D') {
                t.singleSubject[i-1].items[3].classType = 'yes';
              } else if (el.answer === 'E') {
                t.singleSubject[i-1].items[4].classType = 'yes';
              }
            } else {  // 单选错
              t.addRecord(el.subjectId, 0, t.singleSelect.value);
              if (t.singleSelect.value === 'A') {
                t.singleSubject[i-1].items[0].classType = 'no';
              } else if (t.singleSelect.value === 'B') {
                t.singleSubject[i-1].items[1].classType = 'no';
              }
              else if (t.singleSelect.value === 'C') {
                t.singleSubject[i-1].items[2].classType = 'no';
              } else if (t.singleSelect.value === 'D') {
                t.singleSubject[i-1].items[3].classType = 'no';
              } else if (t.singleSelect.value === 'E') {
                t.singleSubject[i-1].items[4].classType = 'no';
              }

              if (el.answer === 'A') {
                t.singleSubject[i-1].items[0].classType = 'pt';
              } else if (el.answer === 'B') {
                t.singleSubject[i-1].items[1].classType = 'pt';
              }
              else if (el.answer === 'C') {
                t.singleSubject[i-1].items[2].classType = 'pt';
              } else if (el.answer === 'D') {
                t.singleSubject[i-1].items[3].classType = 'pt';
              } else if (el.answer === 'E') {
                t.singleSubject[i-1].items[4].classType = 'pt';
              }
            }
          } else {
            if (timeout) {  // 单选超时
              t.addRecord(el.subjectId, 1, '');
              if (el.answer === 'A') {
                t.singleSubject[i-1].items[0].classType = 'pt';
              } else if (el.answer === 'B') {
                t.singleSubject[i-1].items[1].classType = 'pt';
              }
              else if (el.answer === 'C') {
                t.singleSubject[i-1].items[2].classType = 'pt';
              } else if (el.answer === 'D') {
                t.singleSubject[i-1].items[3].classType = 'pt';
              } else if (el.answer === 'E') {
                t.singleSubject[i-1].items[4].classType = 'pt';
              }
            } else {
              t.$parent.alert('提示', '请选择答案后再提交！');
              return;
            }
          }
          window.clearInterval(t.timer);
          t.showDaan = true;
        } else if (t.numIndex > 8) {   // 多选
          let answerArr = el.answer.split("");
          if (t.multipleSelect.length > 0) {
            let sArr = [];
            let sStr = [];
            for (let k = 0; k < t.multipleSelect.length; k++) {
              sArr.push(t.multipleSelect[k].value);
            }
            sArr.sort();
            for (let k = 0; k < sArr.length; k++) {
              sStr += sArr[k];
            }
            if (sStr===el.answer) { // 多选对
              t.addRecord(el.subjectId, 1, sStr);
              t.rightNum++;
              for (let j = 0; j < answerArr.length; j++) {
                if (answerArr[j] === 'A') {
                  t.allSubject[i-1].items[0].classType = 'yes';
                } else if (answerArr[j] === 'B') {
                  t.allSubject[i-1].items[1].classType = 'yes';
                }
                else if (answerArr[j] === 'C') {
                  t.allSubject[i-1].items[2].classType = 'yes';
                } else if (answerArr[j] === 'D') {
                  t.allSubject[i-1].items[3].classType = 'yes';
                } else if (answerArr[j] === 'E') {
                  t.allSubject[i-1].items[4].classType = 'yes';
                } else if (answerArr[j] === 'F') {
                  t.allSubject[i-1].items[5].classType = 'yes';
                } else if (answerArr[j] === 'G') {
                  t.allSubject[i-1].items[6].classType = 'yes';
                }
              }
            } else { // 多选错
              let muArr = [];
              for (let mi = 0; mi < t.multipleSelect.length; mi++) {
                muArr.push(t.multipleSelect[mi].value);
              }
              muArr.sort();
              t.addRecord(el.subjectId, 0, sStr);

              for (let j = 0; j < answerArr.length; j++) {
                if (answerArr[j] === 'A') {
                  t.allSubject[i-1].items[0].classType = 'pt';
                } else if (answerArr[j] === 'B') {
                  t.allSubject[i-1].items[1].classType = 'pt';
                }
                else if (answerArr[j] === 'C') {
                  t.allSubject[i-1].items[2].classType = 'pt';
                } else if (answerArr[j] === 'D') {
                  t.allSubject[i-1].items[3].classType = 'pt';
                } else if (answerArr[j] === 'E') {
                  t.allSubject[i-1].items[4].classType = 'pt';
                } else if (answerArr[j] === 'F') {
                  t.allSubject[i-1].items[5].classType = 'pt';
                } else if (answerArr[j] === 'G') {
                  t.allSubject[i-1].items[6].classType = 'pt';
                }
              }

              for (let j = 0; j < muArr.length; j++) {
                if (muArr[j] === 'A') {
                  if (answerArr.includes('A')) {
                    t.allSubject[i-1].items[0].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[0].classType = 'no';
                  }
                } else if (muArr[j] === 'B') {
                  if (answerArr.includes('B')) {
                    t.allSubject[i-1].items[1].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[1].classType = 'no';
                  }
                }
                else if (muArr[j] === 'C') {
                  if (answerArr.includes('C')) {
                    t.allSubject[i-1].items[2].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[2].classType = 'no';
                  }
                } else if (muArr[j] === 'D') {
                  if (answerArr.includes('D')) {
                    t.allSubject[i-1].items[3].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[3].classType = 'no';
                  }
                } else if (muArr[j] === 'E') {
                  if (answerArr.includes('E')) {
                    t.allSubject[i-1].items[4].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[4].classType = 'no';
                  }
                } else if (muArr[j] === 'F') {
                  if (answerArr.includes('F')) {
                    t.allSubject[i-1].items[5].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[5].classType = 'no';
                  }
                } else if (muArr[j] === 'G') {
                  if (answerArr.includes('G')) {
                    t.allSubject[i-1].items[6].classType = 'yes';
                  } else {
                    t.allSubject[i-1].items[6].classType = 'no';
                  }
                }
              }
            }
          } else {
            if (timeout) {
              t.addRecord(el.subjectId, 0, '');
              for (let j = 0; j < answerArr.length; j++) {
                if (answerArr[j] === 'A') {
                  t.allSubject[i-1].items[0].classType = 'pt';
                } else if (answerArr[j] === 'B') {
                  t.allSubject[i-1].items[1].classType = 'pt';
                }
                else if (answerArr[j] === 'C') {
                  t.allSubject[i-1].items[2].classType = 'pt';
                } else if (answerArr[j] === 'D') {
                  t.allSubject[i-1].items[3].classType = 'pt';
                } else if (answerArr[j] === 'E') {
                  t.allSubject[i-1].items[4].classType = 'pt';
                } else if (answerArr[j] === 'F') {
                  t.allSubject[i-1].items[5].classType = 'pt';
                } else if (answerArr[j] === 'G') {
                  t.allSubject[i-1].items[6].classType = 'pt';
                }
              }
            } else {
              t.$parent.alert('提示', '请选择答案后再提交！');
              return;
            }
          }
          window.clearInterval(t.timer);
          t.showDaan = true;
        }
      },
      next () {
        let t = this;
        t.singleSelect = {};
        t.multipleSelect = [];
        t.showDaan = false;

        t.timeBarWidth = 100;
        t.timeBarBackground = '#56d288';
        if (t.numIndex === 10) {
          // 判断答对题数
          let tiNum = t.rightNum;
          // tiNum = 8;
          if (tiNum >= 6) {
            t.goUrl('/answerResults/S/' + tiNum);
          } else {
            t.goUrl('/answerResults/F/' + tiNum);
          }
          return;
        }
        if (t.numIndex === 8) {
          t.showTip2 = true;
          /*window.setTimeout(() => {
            t.showTip2 = false;
            t.numIndex++;
            t.times = 30;
            t.timeOut();
          }, 3000);*/
        } else {
          t.numIndex++;
          t.times = 30;
          t.timeOut();
        }
      },
      hideTip2 () {
        let t = this;
        t.showTip2 = false;
        t.numIndex++;
        t.times = 30;
        t.timeOut();
      },
      itemClick (value) {
        // console.log(value);
        // console.log(value.value);
        // console.log(this.singleSelect);
      },
      itemClick2 (value) {
        // console.log(value);
        // console.log(value.value);
        // setTimeout(() => {
          // this.$parent.log(this.multipleSelect);
        // }, 10);
      },
      itemChange (value) {
        // console.log(value);
      },
      goUrl (url) {
        // this.$router.replace({path: url});
        if (url === '/zyyhIndex') {
          if (window.BL.userInfo) {
            this.$router.replace({path: url+'?userInfo='+window.BL.userInfo});
          } else {
            this.$router.replace({path: url});
          }
        } else {
          this.$router.replace({path: url});
        }
      },
      stopShare () {
      }
    },
    mounted() {
      let t = this;
      t.getQueList();
      // t.addRecord(46, 1, 'B');
      // t.timeOut();
    },
    created() {
      window.BL.setTitle('答题');
      if (!window.BL.indexIn) {
        this.goUrl('/zyyhIndex');
      }
      if (!this.$parent.isWeChat) {
        this.$parent.alert('提示', '请在微信端打开应用', () => {
          this.goUrl('/zyyhIndex');
        })
      }
    }
  }
</script>
<style lang='less'>
  @import '../../assets/zyyh/answer.less';
</style>
