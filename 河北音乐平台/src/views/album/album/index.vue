<template>
  <div class="urlManager-list">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup" style="margin-bottom: 5px">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="saveOpen('')"> 新增</el-button>
      <el-button type="primary" size="mini" @click="dialogImportOut = true"> 批量导出</el-button>
      <el-button type="primary" size="mini" @click="dialogImportIn = true"> 批量修改</el-button>
      <el-button type="primary" size="mini" @click="dialogImportUp = true"> 批量上传</el-button>
      <el-button type="primary" size="mini" @click="dialogImportImg = true"> 批量上传图片</el-button>
      <el-button type="primary" size="mini" @click="label()"> 批量贴标签</el-button>
      <!--<el-button type="primary" icon="el-icon-plus" size="mini" @click="saveOpen('')" title="新增" circle></el-button>-->
      <!--<el-button type="warning" icon="el-icon-delete" size="mini" @click="del('')" title="批量删除" circle></el-button>-->
    </div>
    <el-row>
      <el-table
        id="tableData"
        ref="videoTable"
        :data="tableData"
        border
        style="width: 100%"
        empty-text="暂无数据"
        @select-all="selectAll"
        @select="selectSingle"
        :height="TableHeight"
        v-loading="tableLoading">
        <!--<el-table-column-->
          <!--align="center"-->
          <!--type="selection"-->
          <!--width="50">-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          label="专辑编码">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.albumCode">{{scope.row.albumCode}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="专辑名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.albumName">{{scope.row.albumName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="流派">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.sectName">{{scope.row.sectName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标签">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <!--<p class="urlManager-normal" :title="scope.row.listType">{{scope.row.listType === 1 ? '榜单' : (scope.row.listType === 2 ? '栏目' : '专辑')}}</p>-->
              <p class="urlManager-normal" :title="scope.row.tagName">{{scope.row.tagName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="艺人">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="专辑类型">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.albumCategory">{{scope.row.albumCategoryStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="资源类型">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.resType">{{scope.row.resTypeStr}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="资源数量">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.resCount">{{scope.row.resCount}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="计费">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.freeFlag">{{scope.row.freeFlag === 0 ? '收费' : '免费'}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="修改时间">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.lastTime">{{scope.row.lastTime | dateForm}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="180px">
          <template slot-scope="scope">
            <el-button  size="mini"  @click="editVideo(scope.row)" >贴标签</el-button>
            <el-button  size="mini"  @click="intoRes(scope.row.albumCode, scope.row.resType)" >资源录入</el-button>
            <el-button  size="mini"  @click="saveOpen(scope.row.albumCode)" >修改</el-button>
            <el-button  size="mini"  type="danger"  @click="del(scope.row.albumCode)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :page-size="req.list.rows"
        :total="tableDataCount"
        :current-page="req.list.page"
        :page-sizes="[20, 100, 300, 500, 1000]"
        @current-change="tableDataPageChange">
      </el-pagination>
    </el-row>
    <!--弹窗-->
    <!-- 新增、修改 -->
    <el-dialog
      :title="saveTitle"
      :visible.sync="dialogSaveSy"
      width="800px">
      <alb-save
        v-if="dialogSaveSy"
        :modalData="modalData"
        @closeSave="closeS($event)"
      >
      </alb-save>
    </el-dialog>

    <!-- 批量导出 -->
    <el-dialog
      title="批量导出"
      :visible.sync="dialogImportOut"
      :show-close="false"
      v-loading="importOuting"
      width="700px">
      <import-out
        v-if="dialogImportOut"
        :reqList="req.list"
        @closeOut="closeOut($event)"
      >
      </import-out>
    </el-dialog>

    <!-- 批量修改 -->
    <el-dialog
      title="批量修改"
      :visible.sync="dialogImportIn"
      :show-close="false"
      v-loading="importOuting"
      width="500px">
      <import-in
        v-if="dialogImportIn"
        :reqList="req.list"
        @closeImportIn="closeIn($event)"
      >
      </import-in>
    </el-dialog>
    <!-- 批量上传 -->
    <el-dialog
      title="批量上传"
      :visible.sync="dialogImportUp"
      :show-close="false"
      v-loading="importOuting"
      width="500px">
      <import-up
        v-if="dialogImportUp"
        :reqList="req.list"
        @closeImportUp="closeUp($event)"
      >
      </import-up>
    </el-dialog>

    <!-- 多图片上传 -->
    <el-dialog
      title="图片上传"
      :visible.sync="dialogImportImg"
      :show-close="false"
      v-loading="importOuting"
      width="540px">
      <import-img
        v-if="dialogImportImg"
        :reqList="req.list"
        @closeImg="closeImg($event)"
      >
      </import-img>
    </el-dialog>

    <!--穿梭框、贴标签-->
    <el-dialog
      width="1200px"
      height="800px"
      :title="dialog.title"
      :visible.sync="dialog.show"
      @close="dialogShuttleClose">
      <div class="shuttleWrap">
        <div style="position: absolute;position: absolute;top: -42px;left: 123px;font-size: 16px;color: #967d56;">
          <span>{{this.shuttleData.albumName+"/"+this.shuttleData.albumCode}}</span>
        </div>
        <div style="width: 480px;height:600px;margin-left: 15px">
          <div style="display: inline-block;float: left;position: relative;top: -5px">
            <span>资源已有标签：</span>
          </div>
          <el-row>
            <el-table
              id="tableData"
              ref="videoTable"
              :data="resTagData"
              border
              style="width: 100%;height: 546px;overflow: auto;position: relative;"
              empty-text="暂无数据">
              <el-table-column
                label="标签分类"
                width="120">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-name" :title="scope.row.name">{{scope.row.name}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="标签描述">
                <template slot-scope="scope">
                  <div v-for = "(item, index) in scope.row.tagList" :class="{'tAct':item.checkState}" style="float: left" class="secbox">
                    <span  @click="getRes(item,index)">{{item.tagName}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div style="width: 100px;height:600px;position: relative;">
          <div class="moveWrap">
            <button class="addSelect" @click="addSelect"><i class="fa fa-angle-double-left fa-lg"></i>增加</button>
            <button class="removeSelect" @click="removeSelect()">删除<i class="fa fa-angle-double-right fa-lg"></i></button>
          </div>
        </div>
        <!--<div style="width: 580px;height:600px;border: 1px solid gray;">-->
        <div style="width: 580px;height:600px;">
          <div>
            <div style="height: 163px" class="search">
              <div style="height: 70px">
                <div style="text-align: left;margin-left: 15px;">请选择分类：</div>
                <div style="height: 50px;" class="tagType">
                  <div v-for="(item, index) in tagTypeData" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                    <span  @click="getSearch(item,index)">{{item.name}}</span>
                  </div>
                </div>
              </div>
              <div style="clear: both"></div>
              <div style="height: 20px;text-align: left">
                <div style="margin: 15px">请输入标签：<input style="height: 26px;" type="text" v-model="shuttleAllReq.searchTagName" @keyup.enter="getSearch([],'')"></div>
              </div>

            </div>

            <div style="margin-top: 55px;">
              <div style="text-align: left; margin-left: 15px">标签：</div>
              <div style="overflow: auto;height: 350px;position:relative">
                <div v-for="(item, index) in resTagAll" :class="{'tAct':item.checkState}" style="float: left;" class="secbox">
                  <span style=";" @click="getAllTagId(item,index)">{{item.tagName}}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div><button class="tagBut" @click="closeShutt">完成</button></div>
      </div>
    </el-dialog>

    <!--资源录入-->
    <el-dialog
      width="1400px"
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.show"
      @close="infoClose">
      <div class="infoWrap">
        <!--<div style="position: absolute;position: absolute;top: -65px;left: 123px;font-size: 16px;color: #967d56;">-->
          <!--<span>{{this.shuttleData.listName+"/"+this.shuttleData.listCode}}</span>-->
        <!--</div>-->
        <div style="width: 600px;height:600px;margin-left: 45px">
          <el-form
            :inline="true"
            label-width="70px"
            height="76px"
            labelPosition="right"
            class="demo-form-inline searchWrap"
            size="mini">
            <!--<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="12">-->
              <el-form-item label-width="68px" label="资源编码">
                <el-input v-model="infoSearch.resCode" placeholder="资源编码" style="width:112px" @keyup.enter.native="leftSearch"></el-input>
              </el-form-item>
            <!--</el-col>-->
            <!--<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="12">-->
              <el-form-item label-width="68px" label="资源名称">
                <el-input v-model="infoSearch.resName" placeholder="资源名称" style="width:112px" @keyup.enter.native="leftSearch"></el-input>
              </el-form-item>
            <!--</el-col>-->
              <el-form-item label-width="68px" label="艺人名称">
                <el-input v-model="infoSearch.artistName" placeholder="艺人名称" style="width:112px" @keyup.enter.native="leftSearch"></el-input>
              </el-form-item>
            <!--<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">-->
              <el-form-item label="曲目类别">
                <el-select v-model="infoSearch.searchType" style="width:112px" placeholder="请选择" @change="leftSearch">
                  <el-option label="请选择" value=""></el-option>
                  <el-option v-for="item in songTypes" :key="item.type" :label="item.value" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
            <!--</el-col>-->
            <el-form-item label="艺人流派">
              <el-select v-model="infoSearch.sect" style="width:112px" placeholder="请选择" @change="leftSearch">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in sectData" :key="item.sectCode" :label="item.sectName" :value="item.sectCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="leftSearch">查询</el-button>
                <el-button @click="leftClear">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
          <el-row>
            <el-table
              id="tableData"
              ref="videoTable"
              :data="dataList"
              border
              style="width: 100%"
              empty-text="暂无数据"
              row-class-name="tableRow"
              @select-all="selectAllL"
              @select="selectSingleL"
              height="500"
              v-loading="tableLoading">
              <el-table-column
              align="center"
              type="selection"
              width="50">
              </el-table-column>
              <el-table-column
                align="center"
                label="资源编码">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.resCode">{{scope.row.resCode}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="资源名称">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.resName">{{scope.row.resName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="曲目类别">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.songType">{{scope.row.songTypeStr}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="流派">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.sectName">{{scope.row.sectName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="艺人">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :page-size="infoSearch.rows"
              :total="infoDataCount"
              :pager-count="5"
              :current-page="infoSearch.page"
              @current-change="leftPageChange">
            </el-pagination>
          </el-row>
        </div>
        <div style="width: 100px;height:600px;position: relative;">
          <div class="moveWrap">
            <button class="addInfo" :disabled="btnFlag" @click="addInfo()">右移<i class="fa fa-angle-double-right fa-lg"></i></button>
            <button class="removeInfo" :disabled="btnFlag" @click="removeInfo()"><i class="fa fa-angle-double-left fa-lg"></i>左移</button>
          </div>
        </div>
        <!--<div style="width: 580px;height:600px;border: 1px solid gray;">-->
        <div style="width: 600px;height:600px;">
          <div class="btnGroup" style="margin-top: 48px">
            <el-button type="primary" size="mini" title="批量导入"  @click="dialogUpdata = true">批量导入</el-button>
          </div>
          <el-row>
            <el-table
              id="tableData"
              ref="videoTable"
              :data="selectData"
              border
              style="width: 100%"
              height="550px"
              empty-text="暂无数据"
              @select-all="selectAllR"
              @select="selectSingleR"
              :row-style="rowStyle"
              v-loading="tableLoading">
              <el-table-column
              align="center"
              type="selection"
              width="50">
              </el-table-column>
              <el-table-column
                align="center"
                prop="resCode"
                label="资源编码">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.resCode">{{scope.row.resCode}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="resName"
                label="资源名称">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.resName">{{scope.row.resName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="songTypeStr"
                label="曲目类别">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.songType">{{scope.row.songTypeStr}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="sectName"
                label="流派">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.sectName">{{scope.row.sectName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="artistName"
                label="艺人">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-if="selectData.length !== 1"
                align="center"
                min-width="150px"
                label="操作">
                <template slot-scope="scope">
                  <div class="doWrap">
                    <div  class = "zhi" v-if="scope.$index !== 0"  @click="toTop(scope.$index)" >置顶</div>
                    <div  class = "zhi" v-if="scope.$index !== (selectData.length - 1)" @click="toBottom(scope.$index)" >置底</div>
                    <div  class = "yi"  v-if="scope.$index !== 0" @click="moveUp(scope.$index)" >上移</div>
                    <div  class = "yi"  v-if="scope.$index !== (selectData.length - 1)" @click="moveDown(scope.$index)" >下移</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div class="infoBtn">
          <button class="botBut" @click="ok">完成</button>
          <button class="botBut" @click="infoClose">取消</button>
        </div>
      </div>
    </el-dialog>

    <!-- 资源录入批量导入-->
    <el-dialog
      width="500px"
      :visible.sync="dialogUpdata"
      @close="UpdataClose"
      :show-close="false"
      v-loading="importOuting">
      <div class="title" slot="title">
        批量导入
        <el-button @click="templateUpdata" size="mini">模板下载</el-button>
      </div>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <input type="file" id = "fileInput" name="files" @change="upload($event)" />
      </el-col>
      <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
        <!--{{fileUpdataName}}-->
      <!--</el-col>-->
      <div slot="footer" class="dialog-footer">
        <!--<el-button size="mini" @click="DownUpdataError" v-show="errorDownUpdata.length > 0">点击下载错误报告</el-button>-->
        <!--<el-button size="mini" @click="closeUpdata">取消</el-button>-->
        <el-button size="mini" @click="UpdataClose">取消</el-button>
        <el-button type="primary" size="mini" @click="updatInfo">确定</el-button>
      </div>
    </el-dialog>

    <download :isdown="isdown" :downUrl="'/cms/api/tag/downloadAlbumTagExcel.do'" :exportUrl="'/cms/api/tag/importAlbumTagExcel.do'" @closeLoad="closeLoad"></download>

  </div>
</template>

<script>
import vSearch from './components/search'
import albSave from './components/albSave'
import importOut from './components/importOut'
import importIn from './components/importIn'
import importUp from './components/importUp'
import importImg from './components/importImg'
import download from '../../../common/download.vue'

export default {
  name: 'urlManager-list',
  props: ['routeHash'],
  components: {vSearch, albSave, importOut, importIn, importUp, importImg, download},
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
    },
    getNodeStr(code) {
      // let Arr = [];
      // console.log(this.nodesData)
      // if (!!code) {
      //  let codeArr = code.split(',');
      //   this.nodesData.forEach(i => {
      //     codeArr.forEach(j => {
      //       if (j === i.nodeCode) {
      //         Arr.push(i.alias);
      //       }
      //     })
      //   })
      // };
      // return Arr.toString();
    }
  },
  data () {
    return {
      // 批量贴标签
      isdown: false,
      // 专辑
      newFile: {},
      dialogUpdata: false,
      albumCode: '',
      resType: '',
      infoSearch: {
        page: 1,
        rows: 20,
        albumCode: '',
        resType: '',
        first: true,
        resCode: '',
        resName: '',
        artistName: '',
        artistArea: '',
        resCodes: '',
        selectResCodes: '',
        nodeCode: '',
        klokFlag: '',
        searchType: '',
        sect: '',
        date: [],
      },
      songTypes: [{type:'01',value:'音乐MV类'},{type:'02',value:'卡拉ok类'},{type:'03',value:'综艺现场类'},{type:'04',value:'儿童教育类'},{type:'05',value:'动漫类'},{type:'06',value:'儿歌'},{type:'07',value:'戏曲'}],
      alInfoSearch: {
        listCode: '',
        resType: '',
        resCode: '',
        nodeCode: '',
      },
      pager: 5,
      infoDataCount: 0,
      alInfoDataCount: 0,
      dataList: [],
      nodesData: [],
      aldataList: [],
      selectData: [],
      rightIds: [],
      resultData: [],
      excelData: [], // 从Excel表导入
      dialogInfo: {
        disabledFlag: false,
        // width:'400px',
        show : false,
        title: '资源录入',
        // formLabelWidth:'120px',
      },
      axios: this.$root.axios,
      Qs: this.$root.Qs,
      dialogSaveSy: false,
      modalData: '',
      saveTitle: '',
      sectData: [],
      url: {
        getAllSectList: '/cms/api/artist/getAllSectList.do',
        programList : "/cms/busi/album/list.do",
        copylist : "/cms/busi/list/copyList.do",
        detial : "/cms/busi/list/listdetail.do",
        save : "/cms/busi/list/save.do",
        del : "/cms/busi/album/del.do",
        checkUnique : "/cms/api/sect/checkUnique.do",

        // 穿梭框-贴标签
        resTag : "/cms/api/tag/albumTag.do", // 获取资源已录入标签
        allTagList : "/cms/api/tag/allTagListForAlbum.do", // 获取全部标签列表
        tagBind : "/cms/api/tag/bindForAlbum.do", // 标签增加
        tagUnbind : "/cms/api/tag/unbindForAlbum.do", // 标签解绑
        downloadResTagExcel : "/cms/api/tag/downloadResTagExcel.do", // 下载
        importResTagExcel : "/cms/api/tag/importResTagExcel.do", // 导入
        tagSelect : "/cms/api/tagType/select.do",

        // 资源录入
        leftlist : "/cms/busi/album/resList.do", // 左
        rightlist : "/cms/busi/album/albumres.do", // 右
        nodelist : "/cms/api/node/list.do",
        // nodelist : "/cms/busi/node/nodedetail.do",
        addlist : "/cms/busi/album/addrestoalbum.do",
        listresByWhere : "/cms/busi/list/listresByWhere",
        listresByWhereSide : "/cms/busi//list/listresByWhereSide",



      },
      dialogSave: {
        disabledFlag: false,
        width:'400px',
        show : false,
        title: '新增标签类型',
        formLabelWidth:'120px',
        type: 'blank'
      },
      sorceDialog: {
        show: false,
      },
      dialogForm:{
        id    : '',
        sectCode    : '',
        sectName    : '',
      },
      // 穿梭框
      tagFirst: true,
      resTagData: [],
      tagTypeData: [],
      shuttleData: [],
      resTagAll: [],
      resAllIds: [],
      dialog: {
        disabledFlag: false,
        width:'400px',
        show : false,
        title: '新增标签类型',
        formLabelWidth:'120px',
        type: 'blank'
      },
      shuttleAllReq: {
        albumCode: '',	//是	String	资源编码
        searchTagName: '',	//否	String	标签名称（查询条件）
        searchTypeId: 0,	//否	String	类型ID（查询条件）
      },
      regName: '',
      req: {
        list: {
          albumName: '',
          albumCategory: '',
          tagTypeId: '',
          page   : 1,  //是 int 当前页码
          rows   : 20, //是 int 页面容量
        }
      },
      selectHash: {},
      errorDownLoad: '',
      fileName: '',
      fixCodeName: '',
      importantInData: [],
      fileUrl: '',
      newPlaypfCode: '',
      radio: '',
      tableSource: [],
      listChosed: [],
      tableChosed: [],
      cpList: [],
      tableData: [],
      tableSourceCount: 0,
      tableDataCount: 0,
      pageNum: 1,
      hasSelection: true,
      saveTit: '',
      sourceListLoading: false,
      dialogVisible: false,
      tableLoading: false,
      editLoading: false,
      dialogOperate: false,
      delFlag: false,
      controlFlag: false,
      lineStatus: "",
      dialogImportOut: false,
      dialogImportIn: false,
      dialogImportUp: false,
      dialogImportImg: false,
      dialogUp: false,
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      tagsData: [],
      listload: true,
      TableHeight: 600,
      ids: '',
      leftIds: [],
      defaultData: [],
      oldSelectData: [],
      oldRightIds: [],
      btnFlag: false, // 回调前  防止按钮多次点击
    }
  },
  activated () {
    this.onSubmit('clear');
    this.Resize();
    this.getNodeList();
    this.getSectList();
    // this.getTagName();
    this.newFile = new FormData();
  },
  // watch:{
  //   $route: function () {
  //     let route = this.$router.history.current.path;
  //     route = route.substr(1);
  //     console.log(this.routeHash)
  //     if (this.routeHash[route]) {
  //       this.curUrl = this.$router.history.current.path;
  //       this.getNodeCode();
  //       this.onSubmit('clear');
  //     }
  //   }
  // },
  methods: {
    label(){
      this.isdown = true;
    },
    closeLoad(){
      this.isdown = false;
      this.onSubmit('clear');
    },
    // 批量导出
    closeOut (ev) {
      this.dialogImportOut = false;
      this.onSubmit('clear');
    },
    closeIn (ev) {
      this.dialogImportIn = false;
      this.onSubmit('clear');
    },
    closeUp (ev) {
      this.dialogImportUp = false;
      this.onSubmit('clear');
      /*修改*/
    },
    closeImg (ev) {
      this.dialogImportImg = false;
      this.onSubmit('clear');
    },


    getSectList () {
      let that = this;
      let parm = {};
      let params = {jsonParam: JSON.stringify(parm)};
      that.$ajax({
        url: that.url.getAllSectList,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.sectData = res.data.data.sectList;
          } else {
            that.sectData = []
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getNode(row, column, cellValue, index) {
      let Arr = [];
      if (!!cellValue) {
        let codeArr = cellValue.split(',');
        this.nodesData.forEach(i => {
          codeArr.forEach(j => {
            if (j === i.nodeCode) {
              Arr.push(i.alias);
            }
          })
        })
      };
      return Arr.toString();
    },
    rightY() {
      let that = this;
      this.alInfoSearch.listCode = this.listCode;
      this.alInfoSearch.resType = this.resType;
      let parmas = {jsonParam: JSON.stringify(this.alInfoSearch)};
      that.$ajax({
        url: that.url.listresByWhere,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {

          if (res.obj.data.length > 0) {
            that.selectData = Array.from(res.obj.data);
          } else {
            that.selectData = [];
          }
          that.defaultData = Array.from(res.obj.data);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    rightN() {
      let that = this;
      this.alInfoSearch.listCode = this.listCode;
      this.alInfoSearch.resType = this.resType;
      let parmas = {jsonParam: JSON.stringify(this.alInfoSearch)};
      that.$ajax({
        url: that.url.listresByWhereSide,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.obj.data.length > 0) {
            that.selectData = Array.from(res.obj.data);
          } else {
            that.selectData = [];
          }
          that.defaultData = Array.from(res.obj.data);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    rightClear() {
      this.getListResDetail();
    },
    // 资源录入
    leftSearch () {
      this.addInfo();
    },
    leftClear () {
      // resCode resName artistName searchType sect
      this.infoSearch.resCode = '';
      this.infoSearch.resName = '';
      this.infoSearch.artistName = '';
      this.infoSearch.searchType = '';
      this.infoSearch.sect = '';
      this.addInfo();
      // this.getLeftList([], [], "");
    },
    infoClose () {
      this.dataList = [];
      this.selectData = [];
      this.dialogInfo.show = false;
    },
    toTop(index) {
      this.changePosition(this.selectData, index, 0);
    },

    toBottom(index) {
      this.changePosition(this.selectData, index, this.selectData.length - 1);
    },

    moveUp(index) {
      this.changePosition(this.selectData, index, index - 1);
    },

    moveDown(index) {
      this.changePosition(this.selectData, index, index + 1);
    },
    changePosition(arr, index, tindex) {
      if (index > tindex) {
        arr.splice(tindex, 0, arr[index]);
        arr.splice(index + 1, 1);
      } else {
        arr.splice(tindex + 1, 0, arr[index]);
        arr.splice(index, 1);
      }
    },
    upload(ev) {
      let evAnd = ev.target ? ev.target : ev.srcElement;
      let file = evAnd.files[0];
      this.newFile.set("infoFile", file);
    },
    updatInfo () {
      let that = this;
      this.newFile.set('albumCode', this.albumCode);
      this.newFile.set('resType', this.resType);
      let param = Object.assign({}, this.reqList);
      that.axios({
        headers: {
          // 'deviceCode': 'A95ZEF1-47B5-AC90BF3',
          'Content-Type': 'multipart/form-data'
        },
        url: '/cms/busi/album/addrestoalbumbyexcel.do',
        method:'post',
        data: that.newFile,
      }).then( res => {
        if (res.data.success) {
          that.$message({
            type: 'success',
            message: res.data.msg
          });
          that.excelData = res.data.obj;
          that.addInfo();
          that.UpdataClose();
        } else {
          that.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
        console.log(res)
      }).catch( err => {
        console.log(err);
      })
    },
    UpdataClose () {
      document.getElementById('fileInput').value = '';
      this.dialogUpdata = false;
    },
    templateUpdata () {
      window.open('/cms/busi/album/resDownload.do?resType=' + this.resType);
    },
    handleDialogUpdata (file, fileList) {
      this.isempty = true;
      if (fileList.length > 1 ) {
        fileList.splice(0, 1);
      }
      this.fileUpdataName = file.name;
      this.excelUpdata.file = file.name;
      // this. excelParam.nodeCode = this.req.list.nodeCode;
    },
    beforeUpdata () {
      this.updateNum = 0;
      this.isempty = true;
    },
    updataDone (response, file, fileList) {
      let that = this;
      // console.log(response)
      // if (response.msg === "SESSION_OUT"){
      //   window.location.href = "http://cms.daoran.tv";
      // }
      if (response.success) {
        if (response.data.path.length > 0) {
          that.importOuting = false;
          that.updateNum += 1;
          that.errorDownUpdata = response.data.path;
          that.$message({
            type: 'warning',
            message: response.msg
          });
        } else {
          that.importOuting = false;
          that.$message({
            type: 'success',
            message: response.msg
          });
          that.dialogUpdata = false;
          that.onSubmit('clear');
        }
      } else {
        that.importOuting = false;
        that.updateNum += 1;
        that.$message({
          type: 'warning',
          message: response.msg
        });
      }
    },
    closeUpdata () {
      this.select_export = [];
      this.choseAll = false;
      this.dialogUpdata = false;
      this.isempty = false;
    },
    updata (){
      let that = this;
      if (that.updateNum === 0 && that.isempty) {
        this.$refs.updata.submit();
        this.importOuting = true;
      } else {
        that.$message({
          message: '请上传正确格式的文件',
          type: 'warning'
        })
      }
    },

    rowStyle({ row, rowIndex}) {
      return 'height:10px'
    },
    clear() {

    },
    ok () {
      let that = this;
      this.selectData.forEach((i, index) => i.sort = index + 1 );
      let param = {albumCode: this.albumCode, jsonData: this.selectData};
      let parmas = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.addlist,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.data.success) {
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.dialogInfo.show = false;
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    selectAllL (selection) {
      let that = this;
      if (selection.length > 0) {
        selection.forEach( k => {
          that.dataList.forEach( i => {
            if (k.resCode === i.resCode) {
              i.checkState = true;
            }
          });
        });
      } else {
        that.dataList.forEach( i => {
          i.checkState = false;
        });
      }
    },
    selectSingleL (val, row) {
      let that = this;
      that.dataList.forEach( i => i.checkState = false);
      val.forEach( k => {
        that.dataList.forEach( i => {
          if (k.resCode === i.resCode) {
            i.checkState = true;
          }
        });
      });
    },
    selectAllR (selection) {
      let that = this;
      if (selection.length > 0) {
        selection.forEach( k => {
          that.selectData.forEach( i => {
            if (k.resCode === i.resCode) {
              i.checkState = true;
            }
          });
        });
      } else {
        that.selectData.forEach( i => {
          i.checkState = false;
        });
      }
    },
    selectSingleR (val, row) {
      let that = this;
      that.selectData.forEach( i => i.checkState = false);
      val.forEach( k => {
        that.selectData.forEach( i => {
          if (k.resCode === i.resCode) {
            i.checkState = true;
          };
        });
      });
    },
    addInfo() {   // 向右移动
      this.btnFlag = true;
      this.dataList.forEach( i => {
        if (i.checkState){
          this.leftIds.unshift(i.resCode);
          // delete value["checkState"];
          this.defaultData.unshift(i);
        }
      })
      let excelIds = [];
      if (this.excelData.length > 0) {
        this.excelData.forEach( i => {
          excelIds.push(i.resCode);
        })
      }
      this.oldSelectData = [];
      this.oldRightIds = [];
      this.oldSelectData = Array.from(this.selectData); // 右边的资源
      this.oldSelectData.forEach(i => this.oldRightIds.push(i.resCode));

      // let noData = this.dataList.every(_ => _.checkState);
      // let totalPage = Math.ceil(this.options.pageCount / this.options.rows);
      // if (noData && this.options.page === totalPage && this.options.page > 1) {
      //   this.options.page--;
      // }
      if (this.oldRightIds.indexOf(this.resCode) !== -1) {
        return this.$message({
          type: 'warning',
          message: '该资源已在列表中'
        });
        // return this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '该资源已在列表中!', 2000));
      } else {
        if (excelIds !== []) {
          this.leftIds = this.leftIds.concat( excelIds );
        }
        this.getLeftList(this.oldRightIds, this.leftIds, '');
      }
    },

    removeInfo() { //向左移动
      this.btnFlag = true;
      this.selectData.forEach( i => {
        if (i.checkState ) {
          this.rightIds.push(i.resCode);
          this.resultData.push(i);
        }
      })
      let newRightData = [];
      this.selectData.forEach(i => {
        if (this.rightIds.indexOf(i.resCode) === -1) {
          newRightData.push(i);
        }
      })
      this.getLeftList("", newRightData, "remove");
    },
    intoRes (albumCode, resType ) {
      this.dialogInfo.show = true;
      this.albumCode = albumCode;
      this.resType = resType;
      this.dataList = [];
      this.selectData = [];
      this.leftClear();
      // this.getLeftList([], [], "");
      this.getListResDetail();
    },
    getLeftList (resCodes, selectResCodes, op) { // 左边信息栏
      let that = this;
      let param = {
        page:       this.infoSearch.page,
        rows:       this.infoSearch.rows,
        albumCode:  this.albumCode,
        resType:    this.resType,
        first:      this.infoSearch.first,
        resCode:    this.infoSearch.resCode,
        resName:    this.infoSearch.resName,
        artistName: this.infoSearch.artistName,
        artistArea: this.infoSearch.artArea,
        searchType: this.infoSearch.searchType,
        sect:       this.infoSearch.sect,
        resCodes: resCodes.toString(),
        // selectResCodes: selectResCodes.toString(),
        // nodeCode: this.nodeCode,
        // klokFlag: this.klokFlag,
      };
      let newSelectRes = [];
      if (op === "remove") {
        // console.log(selectResCodes)
        selectResCodes.forEach(i => newSelectRes.push(i.resCode));
        param.selectResCodes = newSelectRes.toString();
        param.flag = 'left';
      } else {
        param.selectResCodes = selectResCodes.toString();
      }
      let parmas = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.leftlist,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.data.obj.data.length > 0) {
            res.data.obj.data.forEach( i => {
              that.$set(i, 'checkState', false)
            });
            that.dataList = res.data.obj.data;
            that.leftData = res.data.obj.data;
            that.btnFlag = false;
            // that.infoSearch.page = param.page;
            // that.infoDataCount = res.data.obj.total;
            // that.infoSearch.pageCount = Math.ceil(res.data.obj.total / that.infoSearch.rows) * that.infoSearch.rows;
          } else {
            that.dataList = [];
          }
          that.infoDataCount = res.data.obj.total;
          that.leftIds = [];
          if (!that.infoSearch.first) {
            if (op === "remove") {
              that.selectData = Array.from(selectResCodes);
              that.defaultData = Array.from(selectResCodes);
            } else {
              if (that.excelData !== []) {  // 判断是否是从Excel导入的数据
                that.defaultData = that.excelData.concat(that.defaultData);
                that.excelData = [];
              }
              that.selectData = Array.from(that.defaultData);  // 点击右转按键后右侧数据渲染
            }
            that.selectData.forEach(i => {
              if (i.checkState !== undefined) {
                delete i.checkState;
              }
            });
          }
          that.infoSearch.first = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getListResDetail () { // 右边数据获取
      let that = this;
      let param = {albumCode: this.albumCode, resType: this.resType};
      let parmas = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.rightlist,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.data.obj.length > 0) {
            res.data.obj.forEach( i => {
              that.$set(i, 'checkState', false)
            });
            that.selectData = Array.from(res.data.obj);
          } else {
            that.selectData = [];
          }
          if (!!res.attributes) {
            that.resTotal = res.data.attributes.selectNum;
            that.repeatTotal = res.data.attributes.repeatNum;
          } else {
            that.resTotal = '暂无';
            that.repeatTotal = '暂无';
          }
          that.defaultData = Array.from(res.data.obj);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getNodeList () { // 节点
      let that = this;
      that.$ajax({
        url: that.url.nodelist,
        method: "post",
        data: {},
        success: function (res) {
          if (res.data.data.nodeList.length > 0) {
            that.nodesData = res.data.data.nodeList;
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    // 穿梭框
    editVideo (row) {
      this.dialog.title = '专辑贴标签';
      this.dialog.disabledFlag = true;
      this.dialog.show  = true;
      this.dialog.type = 'edit';
      this.shuttleData = row;
      this.getResTag();
      this.getAllTag();
      this.getTagName();
    },
    getResTag () { // 左边
      this.firstFlag = false;
      let that = this;
      let parma = {albumCode: this.shuttleData.albumCode};
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      that.$ajax({
        url: that.url.resTag,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagData = res.data.data;
          that.resTagData.forEach( i => {
            i.tagList.forEach(j => {
              //j.checkState = false;
              that.$set(j, "checkState", false);
            })
          })
          that.tableLoading = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getAllTag () { // 右边
      let that = this;
      for(let i in this.shuttleAllReq) {
        if (i == 'albumCode') {
          this.shuttleAllReq[i] = this.shuttleData.albumCode;
        } else if ( i == 'searchTypeId') {
          this.shuttleAllReq[i] = this.searchTypeId;
        }
      }
      let parma = that.shuttleAllReq;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      that.$ajax({
        url: that.url.allTagList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.resTagAll = res.data.data;
          that.resTagAll.forEach( i=> {
            that.$set(i, "checkState", false);
          })
          that.tableLoading = false;
          that.tagFirst = false;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getTagName () {
      let that = this;
      that.$ajax({
        url: "/cms/api/tagType/select.do",
        method: "post",
        data: {},
        success: function (res) {
          res.data.data.forEach(item => {
            item.id = Number(item.id);
          });
          that.tagTypeData = res.data.data;
          that.tagTypeData.unshift({
            id: 0,
            name: "全部"
          });
          that.tagTypeData.forEach(i => {
            that.$set(i, "checkState", false)
          })
          that.tagTypeData[0].checkState = true;
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    dialogShuttleClose () {
      let that = this;
      this.clearSelect();
      this.onSubmit('clear');
      that.tagFirst = true;
    },
    closeShutt () {
      let that = this;
      this.clearSelect();
      this.dialog.show = false;
      this.onSubmit('clear');
      that.tagFirst = true;
    },
    clearSelect(){
      this.resIds=[];
      this.resAllIds=[];
      if (this.tagFirst) {
        this.shuttleAllReq.searchTypeId = 0;
        this.searchTypeId = 0;
      }
      // for (let i in that.dialogForm) {
      //   that.dialogForm[i] = '';
      // }
      this.resTagData.forEach(i => {
        i.tagList.forEach(j => {
          j.checkState = false;
        })
      });
      this.resTagAll.forEach(i => {
        i.checkState = false;
      });
    },
    getRes(data,index) {
      data.checkState = !data.checkState;
      this.resTagData.forEach(i => {
        i.tagList.forEach(j => {
          if (j.tagId == data.tagId) {
            if (data.checkState) {
              this.resIds.push(data.tagId)
            } else {
              this.resIds.splice(this.resIds.findIndex(v => v.tagId === data.tagId), 1);
            }
          }
        })
      })
    },
    addSelect() { // 向左增加
      let that = this;
      let params;
      let param = {
        albumCode: this.shuttleData.albumCode,
        tagIds: that.resAllIds.toString(),
      };
      that.editLoading = true;
      params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.tagBind,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: res.data.msg
              });
              // that.editLoading = false;
              // that.dialog.show = false;
              that.getResTag();
              that.getAllTag();
              that.clearSelect();
            }, 500);
          } else {
            // that.editLoading = false;
            that.$notify({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    removeSelect(){ // 向右删除
      let that = this;
      let params;
      let param = {
        albumCode: this.shuttleData.albumCode,
        tagIds: that.resIds.toString(),
      };
      that.editLoading = true;
      params = {jsonParam: JSON.stringify(param)};

      that.$ajax({
        url: that.url.tagUnbind,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$notify({
                type: 'success',
                message: res.data.msg
              });
              // that.editLoading = false;
              // that.dialog.show = false;
              that.getResTag();
              that.getAllTag();
              that.clearSelect();
            }, 500);
          }else {
            // that.editLoading = false;
            that.$notify({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    getSearch(data, index){
      let that = this;
      if (data !== []){
        data.checkState = !data.checkState;
        that.tagTypeData.forEach(i => {
          if (that.tagTypeData.indexOf(i) === index ){
            i.checkState = true;
            that.searchTypeId = i.id;
          } else {
            i.checkState = false;
          }
        })
      }
      this.getAllTag();
    },
    getAllTagId(data,index) {
      data.checkState = !data.checkState;
      this.resTagAll.forEach(i => {
        if (i.tagId == data.tagId) {
          if (data.checkState) {
            this.resAllIds.push(data.tagId)
          } else {
            this.resAllIds.splice(this.resAllIds.findIndex(v => v.tagId === data.tagId), 1);
          }
        }
      })
    },
    // 复制
    copyList(id) {
      let that = this;
      let param = {
        listCode: id,
      }
      let params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.copylist,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.success) {
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.onSubmit('clear');
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    closeS (ev) {
      this.dialogSaveSy = false;
      if (ev === 'con') {
        this.onSubmit('clear');
      }
    },
    closeDel () {
      this.listChosed = [];
    },
    Resize () {
      let that = this;
      window.onresize = function () {
        that.responHeight();
      }
    },
    sizeChange (size) {
      this.req.list.rows = size;
      this.getList();
    },
    ClearSelectItem () {
      let that = this;
      that.selectRow = {};
    },
    tableDataPageChange (page) {
      this.firstFlag = false;
      this.getList(page);
    },
    leftPageChange (page) {
      this.infoSearch.page = page;
      this.oldSelectData = [];
      this.oldRightIds = [];
      this.oldSelectData = Array.from(this.selectData);
      this.oldSelectData.forEach(i => this.oldRightIds.push(i.resCode));
      this.getLeftList(this.oldRightIds, [], "");
    },
    sourceListpageChange (page) {
      this.sorceDialog.req.page = page - 1;
      this.getSourceList();
    },
    dialogClose () {
      let that = this;
      for (let i in that.dialogForm) {
        that.dialogForm[i] = '';
      }
    },
    dialogFormSubmit () {
      let that = this;
      let params;
      let param = that.dialogForm;
      param.sectCode = that.dialogForm.sectCode.replace(/\s+/g,"");
      param.sectName = that.dialogForm.sectName.replace(/\s+/g,"");
      let reg = /^[a-zA-Z]{1,20}$/g;
      if (!reg.test(param.sectCode)) {
        this.$message({
          type: 'warning',
          message: "剧种编码只能为字母，且20个字符以内"
        });
        return;
      };
      if (param.sectName.length > 20) {
        this.$message({
          type: 'warning',
          message: "剧种名称20个字符以内"
        });
        return;
      };
      that.editLoading = true;
      if (this.dialogSave.type === "edit") {
        param.id = that.dialogForm.id;
      }
      params = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.checkUnique,
        method: "post",
        data: this.Qs.stringify(params),
        success: function (res) {
          if (res.data.data.valiFlag === 'yes') {
            that.save(params);
          } else {
            that.editLoading = false;
            that.$message({
              type: 'warning',
              message: res.data.data.valiMsg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    save(param) {
      let that = this;
      that.$ajax({
        url: that.url.save,
        method: "post",
        data: this.Qs.stringify(param),
        success: function (res) {
          if (res.data.success) {
            setTimeout((e) => {
              that.$message({
                type: 'success',
                message: res.data.msg
              });
              that.editLoading = false;
              that.dialogSave.show = false;
              that.onSubmit('clear');
            }, 500);
          }else {
            that.editLoading = false;
            that.$message({
              type: 'warning',
              message: res.data.msg
            });
          }
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    lineOper () {
      this.del('');
      this.dialogOperate = false;
    },
    closeDelTip () {
      this.dialogOperate = false;
      if (this.delFlag) {
        this.listChosed = [];
      }
      this.delFlag = false;
    },
    del (id) {
      let that = this;
      let param = {albumCode: id};
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        param = {jsonParam: JSON.stringify(param)}
        that.tableLoading = true;
        that.$ajax({
          url: that.url.del,
          method: "post",
          data: this.Qs.stringify(param),
          success: function (res) {
            that.tableLoading = false;
            that.$message({
              type: 'success',
              message: res.data.msg
            });
            that.getList();
            that.dialogOperate = false;
          },
          error: function (error) {
            that.$message.error(error);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    responHeight () {
      let dom = this.$el;
      let contain_height = document.body.offsetHeight;
      let search_height = dom.querySelector('.el-form').offsetHeight;
      let static_height = 260;
      let result_height = parseInt(contain_height - search_height - static_height);
      if (result_height >= 300) {
        this.TableHeight = Number(result_height);
      } else {
        this.TableHeight = 600;
      }
    },
    saveOpen (data) {
      if (data === '') {
        this.saveTitle = '新增专辑';
      } else {
        this.saveTitle = '修改专辑';
      }
      this.modalData = data.toString();
      this.dialogSaveSy = true;
    },
    // editVideo (row) {
    //   this.dialogSave.title = '修改剧种';
    //   this.dialogSave.disabledFlag = true;
    //   this.dialogSave.show  = true;
    //   this.dialogSave.type = 'edit';
    //   this.dialogForm.id = row.id;
    //   this.dialogForm.sectCode = row.sectCode;
    //   this.dialogForm.sectName = row.sectName;
    // },
    scrollTop (id) {
      let table = document.querySelector(id);
      let wrap = table.querySelector('.el-table__body-wrapper');
      if (wrap) {
        wrap.scrollTop = 0;
      }else {
        console.error('not found \'el-table__body-wrapper\'');
      }
    },
    getList (page) {
      this.firstFlag = false;
      let s_page = (page >= 0 ? page : this.req.list.page);
      this.req.list.page = s_page;
      let that = this;
      let parma = that.req.list;
      let parmas = {jsonParam: JSON.stringify(parma)};
      that.tableLoading = true;

      that.$ajax({
        url: that.url.programList,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          that.ResultDeal(res); // ！处理方法已独立分离
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    ResultDeal (res) {
      let that = this;
      if (!res.data.success) {
        that.tableData = [];
        return;
      }
      let selected = [];
      that.scrollTop('#tableData');
      that.tableData = res.data.obj.data || [];
      that.tableDataCount = res.data.obj.total;
      that.tableLoading = false;
      setTimeout(() => {
        that.responHeight();
      }, 500);
    },
    selectAll (selection) {
      let that = this;
      let selectall = (selection.length == that.tableData.length) ? true : false;

      if (selectall === false) {
        that.ClearSelectItem();
        that.listChosed = [];
      }else {
        that.tableData.forEach((item, index) => {
          that.selectRow[item.pid] = true;
          that.listChosed.push(item);
        });
      }
    },
    SelectCheck (val, row) {
      let result = false;
      val.forEach((item, index) => {
        if (item.pid == row.pid) {
          result = true;
        }
      });

      return result;
    },
    selectSingle (val, row) {
      let that = this;
      // if (val.length > 0){
        that.listChosed = [];
      // }
      val.forEach(i => {
        that.listChosed.push(i);
      })
    },
    handleSelectionChange (val) {
      let that = this;
      that.tableChosed = [];
      val.forEach(item => {
        that.tableChosed.push(item.pid);
      });
    },
    onSubmit (state) {
      let that = this;
      let datas = [];
      that.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      if (state == 'search') {
        that.req.list.rows = 20;
        that.req.list.page = 1;
        that.listChosed = [];
        that.ClearSelectItem();
        that.getList();
      }else if (state == 'clear') {
        for (let i in that.req.list) {
          if (i == 'rows') {
            that.req.list[i] = 20;
          }else if (i == 'page') {
            that.req.list[i] = 1;
          }else if (i == 'date') {
            that.req.list[i] = [];
          }else {
            that.req.list[i] = '';
          }
        }
        that.listChosed = [];
        that.ClearSelectItem();
        that.getList();
      }
    }
  },
}
</script>

<style scoped>
  .el-row {
    margin-top: 20px;
  }
  .urlManager-name,
  .urlManager-code,
  .urlManager-time{
    padding: 0;
    margin: 0;
  }
  .urlManager-name{
    font-size: 16px;
    color: #000;
  }
  .text-small{
    font-size: 14px;
    color: #333;
    padding: 5px 0;
  }
  .urlManager-code,
  .urlManager-time{
    color: #ccc;
  }
  .urlManager-normal{
    color: #333;
  }
  .urlManagerData-text p{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .td {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .actived {
    color: #ff9900;
  }
  .text_right {
    text-align: right;
    padding-right: 26px;
  }
  .w400 {
    display: inline-block;
    width: 400px;
  }
  .w350 {
    display: inline-block;
    width: 350px;
  }
  .tAct{
    background: #409EFF !important;
    color: white;
  }
  .tagType{
    div:first-child(1){
      margin-left:20px;
    }
  }
  .secbox{
    display: inline-block;
    min-width: 40px;
    height: 26px;
    margin: 5px 10px;
    border: 1px solid darkgray;
    border-radius: 5px;
    line-height: 12px;
    cursor: pointer;
    padding: 6px;
  }
  .shuttleWrap{
    position: relative;
    /*text-align: center;*/
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin: -22px -15px 18px -15px;
  }
  .infoWrap{
    position: relative;
    /*text-align: center;*/
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin: -22px -15px 58px -15px;
  }
  .moveWrap{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    pointer-events: auto;
    background-clip: padding-box;
    border: 1px solid #f8f8f8;
    outline: 0;
    position:relative;
  }
  .addSelect{
    position: absolute;
    top: 230px;
    left: 18px;
    border-radius: 10px 0 0 10px;
    border: none;
    width: 60px;
    height: 25px;
    cursor:pointer;
  }
  .removeSelect{
    position:absolute;
    top:300px;
    right: 2px;
    border-radius: 0 10px 10px 0;
    border: none;
    width: 60px;
    height: 25px;
    cursor:pointer;
  }
  .botBut{
    position: relative;
    left: 1086px;
    top: 5px;
    width: 60px;
    height: 25px;
    background: #409EFF;
    border: none;
    color: white;
    border-radius: 5%;

  }
  .tagBut{
    position: relative;
    left: 1086px;
    top: 23px;
    width: 60px;
    height: 25px;
    background: #409EFF;
    border: none;
    color: white;
    border-radius: 5%;

  }
  .botBut:hover{
    cursor:pointer;
  }

   .removeInfo{
     position: absolute;
     top: 300px;
     left: 18px;
     border-radius: 10px 0 0 10px;
     border: none;
     width: 60px;
     height: 25px;
     cursor:pointer;
   }
  .addInfo{
    position:absolute;
    top: 230px;
    right: 2px;
    border-radius: 0 10px 10px 0;
    border: none;
    width: 60px;
    height: 25px;
    cursor:pointer;
  }
  .urlManagerData-text{
    p {
      height: 10px;
    }
  }
  .el-row {
    margin-top:0;
  }
  .cell{max-height: 40px !important;overflow: auto !important;}
  .doWrap {
    display: flex;
  }
  .doWrap div {
    border: 1px solid gray;
    width: 38px;
    height: 24px;
    margin-right: 2px;
    border-radius: 3px;
    cursor: pointer;
  }
  .searchWrap {
    height: 76px;
  }
  .infoBtn{
    position: absolute;
    bottom: -58px;
    left: 135px;
  }
  .tableRow{
    height:30px;
  }
</style>
