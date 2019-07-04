<template>
  <div class="audio-list">
    <el-row>
      <el-table
        :data="dataList"
        border
        style="width: 100%;"
        empty-text="暂无数据">
        <el-table-column
          label="全部消息">
          <template slot-scope="scope">
            <p class="m_title">{{scope.row.title}}</p>
            <p v-html="scope.row.content"></p>
            <p>{{scope.row.createDate}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'message-list',
  filters: {
    dateForm (dateCamp) {
      let dataDeal = (m) => {
        return m < 10 ? '0' + m : m
      };

      let time = new Date(dateCamp);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return y+'-'+dataDeal(m)+'-'+dataDeal(d)+' '+dataDeal(h)+':'+dataDeal(mm)+':'+dataDeal(s);
    }
  },
  watch : {
    // tableData (data) {
    //   let that = this;
    //   data.forEach(item => {
    //     let text = '';
    //     that.artistArea.forEach(type => {
    //       if(item.artistArea == type.type){
    //         item.areaText = type.name;
    //       }
    //     });
    //   });
    //   data.forEach(item => {
    //     let text = '';
    //     that.artistType.forEach(type => {
    //       if(item.artistType == type.type){
    //         item.artistText = type.name;
    //       }
    //     });
    //   });
    // }
  },
  data () {
    return {
      img_pre: 'http://60.205.178.172/HD/',
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      url: {
        messageList : "/cms/api/system/mineMessageAll.do",
        getUserName : "/cms/api/getUserName.do",
        unreadMessageNum : "/cms/api/system/unreadMessageNum.do",
        mineMessage : "/cms/api/system/mineMessage.do",
        updateMessage : "/cms/api/system/updateMessage.do",
      },
      req: {
        list: {
          moduleName: 'cms',
        }
      },
      dataList: [],
      cpList: [],
      tableData: [],
      pageNum: 1,
      TableHeight: 400,
      hasSelection: true,
      saveTit: '',
      dialogVisible: false,
      tableLoading: true,
      artistType: this.$root.staticData.artType,
      artistArea: this.$root.staticData.artArea,
      dialogImportOut: false,
      isIndeterminate: false,
      choseAll: false,
      select_export: [],
      condition_export_all: [
        'artistName',
        'artistCode',
        'artistType',
        'artistArea',
        'lastTime',
        'foreignName',
        'alias',
        'country',
        'nation',
        'starSign',
        'animalSign',
        'birthArea',
        'birthday',
        'occupation',
        'graduateUnvers',
        'ibec',
        'representative',
        'des',
      ],
      condition_export_base: [
        {key: 'videoName', text: '资源名称'},
        {key: 'videoCode', text: '资源编码'},
        {key: 'videoType', text: '曲目类别'},
        {key: 'lastTime', text: '最近更新时间'},
        {key: 'cpId', text: 'cp商'},
        {key: 'fileSize', text: '大小'},
        {key: 'allTime', text: '时长'},
        {key: 'resolution', text: '分辨率'},
      ],
      // condition_export_artist: [
      //   {key: 'artistName', text: '艺人名称'},
      // ],
      condition_export_artist: [
        {type: "artistName", name: "艺人名称"},
        {type: "artistCode", name: "艺人编码"},
        {type: "artistType", name: "艺人类型"},
        {type: "artistArea", name: "所属地区"},
        {type: "lastTime", name: "最近更新时间"},
        {type: "foreignName", name: "外文名"},
        {type: "alias", name: "别名"},
        {type: "country", name: "国籍"},
        {type: "nation", name: "民族"},
        {type: "starSign", name: "星座"},
        {type: "animalSign", name: "生肖"},
        {type: "birthArea", name: "出生地"},
        {type: "birthday", name: "出生日期"},
        {type: "occupation", name: "职业"},
        {type: "graduateUnvers", name: "毕业院校"},
        {type: "ibec", name: "经纪公司"},
        {type: "representative", name: "代表作"},
        {type: "des", name: "描述"}
        ],
      condition_export_more: [
        {key: 'foreignName', text: '别名(外文名)'},
        {key: 'language', text: '语种'},
        {key: 'publishArea', text: '发行地区'},
        {key: 'lyricist', text: '作词'},
        {key: 'composer', text: '作曲'},
        {key: 'arranger', text: '编曲'},
        {key: 'producer', text: '制作人'},
        {key: 'directorMV', text: 'MV导演'},
        {key: 'albumName', text: '专辑'},
        {key: 'publishTime', text: '发行时间'},
        {key: 'redordCompany', text: '唱片公司'},
      ]
    }
  },
  mounted () {
    // this.getList();
  },
  activated () {
    // if (this.route == 'audio' || this.route == 'vedio') {
    //   this.$store.commit('_routerAudioChange', '');
    // this.onSubmit('clear');
    // }
    this.getList();
  },
  computed: {
    route () {
      return this.$store.state.RouteState.routerAudioChange;
    }
  },
  directives: {
    // tabelLoadmore: {
    //   // 指令的定义
    //   bind(el, binding) {
    //     let that = this;
    //     const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
    //
    //     SELECTWRAP_DOM.addEventListener('scroll', function() {
    //       let sign = 0;
    //       const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) && this.scrollTop > sign)
    //
    //       if(CONDITION) {
    //         binding.value();
    //       }else {
    //         return false;
    //       }
    //     });
    //   }
    // }
  },
  methods: {
    sendParams (type, id) {
      this.$store.commit('_routerAudioChange', type);
      if (type === 'audio') {
        this.$router.push({ path: '/audio', query: {artistCode: id} });
      } else if (type === 'video') {
        this.$router.push({ path: '/video', query: {artistCode: id} });
      }
    },
    edit (index, row) {
      let artistCode = row.artistCode;
      //this.$router.push({ name: 'edit', params: { audioCode: audioCode }});
      this.$router.push({ path: '/artist/edit', query: {artistCode: artistCode} });
    },
    getList () {
      let that = this;
      let parmas = that.req.list;
      that.dataList = [];
      this.axios({
        headers: {
          'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        },
        url: that.url.messageList,
        method:'post',
        data: this.Qs.stringify(parmas)
      }).then(res=>{
        res.data.obj.forEach( i => {
          let arr = i.content.replace(/\n/g, "<br/>");
          i.content = arr;
          that.dataList.push(i);
        })
      }).catch(err=>{
        console.log(err);
      })
    },
  }
}
</script>

<style scoped>
  .el-table_1_column_1{
    height: 50px;
    .cell{
      font-size: 20px;
    }
  }
  .m_title {
    font-weight: 700;
  }
</style>
