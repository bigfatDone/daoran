<template>
  <div class="urlManager-list">
    <v-search
      labelPosition="right"
      :formInline="req.list"
      @vSearch="onSubmit($event)"></v-search>
    <div class="btnGroup" style="margin-bottom: 5px">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="saveOpen('')"> 新增</el-button>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="label()"> 批量贴标签</el-button>
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
        <!--<el-table-column-->
          <!--align="center"-->
          <!--label="节目单编码">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="urlManagerData-text">-->
              <!--<p class="urlManager-normal" :title="scope.row.listCode">{{scope.row.listCode}}</p>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          label="节目单名称">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.listName">{{scope.row.listName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="节目单类型">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.listType">{{scope.row.listType === 1 ? '榜单' : (scope.row.listType === 2 ? '栏目' : '专辑')}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标签">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.tagName">{{scope.row.tagName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="资源类型">
          <template slot-scope="scope">
            <div class="urlManagerData-text">
              <p class="urlManager-normal" :title="scope.row.resType">{{scope.row.resType === 1 ? '视频' : (scope.row.resType === 2 ? '音频' : '手绘本')}}</p>
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
        <!--<el-table-column-->
          <!--align="center"-->
          <!--label="修改时间">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="urlManagerData-text">-->
              <!--<p class="urlManager-normal" :title="scope.row.lastTime">{{scope.row.lastTime}}</p>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="操作" min-width="180px">
          <template slot-scope="scope">
            <el-button  size="mini"  @click="editVideo(scope.row)" >贴标签</el-button>
            <el-button  size="mini"  @click="copyList(scope.row.listCode)" >复制</el-button>
            <el-button  size="mini"  @click="intoRes(scope.row.listCode, scope.row.resType)" >资源录入</el-button>
            <el-button  size="mini"  @click="saveOpen(scope.row.listCode)" >修改</el-button>
            <el-button  size="mini"  type="danger"  @click="del(scope.row.listCode)" >删除</el-button>
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
    <!-- 节目单新增、修改 -->
    <el-dialog
      :title="saveTitle"
      :visible.sync="dialogSaveSy"
      width="700px">
      <pro-save
        v-if="dialogSaveSy"
        :modalData="modalData"
        @closeSave="closeS($event)"
      >
      </pro-save>
    </el-dialog>

    <!--穿梭框-->
    <el-dialog
      width="1200px"
      height="800px"
      :title="dialog.title"
      :visible.sync="dialog.show"
      @close="dialogShuttleClose">
      <div class="shuttleWrap">
        <div style="position: absolute;position: absolute;top: -42px;left: 123px;font-size: 16px;color: #967d56;">
          <span>{{this.shuttleData.listName+"/"+this.shuttleData.listCode}}</span>
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
              <!--<el-form-item label="资源类型">-->
                <!--<el-select v-model="formInline.resType" placeholder="请选择" @change="onSubmit">-->
                  <!--<el-option v-for="item in resTypeData" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-form-item label="节点">-->
              <!--<el-select v-model="infoSearch.nodeCode" placeholder="请选择" @change="onSubmit">-->
                <!--<el-option v-for="item in freeFlagData" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
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
              :row-style="{height:'0px'}"
              style="width: 100%"
              empty-text="暂无数据"
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
                label="艺人名称">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="计费">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.vip">{{scope.row.vip === 0 ? '收费' : '免费'}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="CP商">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.cpName">{{scope.row.cpName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :formatter="getNode"
                prop="nodeCodeStr"
                width="120px"
                class-name="nodeCol"
                style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden;"
                label="节点信息">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.nodeCodeNameStr">{{scope.row.nodeCodeNameStr === 'null' ? '' : scope.row.nodeCodeNameStr}}</p>
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
          <el-form
            :inline="true"
            label-width="70px"
            labelPosition="right"
            class="demo-form-inline"
            size="mini">
            <el-form-item label-width="82px" label="资源编码">
              <el-input v-model="alInfoSearch.resCode" style="width:100px" placeholder="资源编码"></el-input>
            </el-form-item>
            <el-form-item label="节点信息">
              <el-select v-model="alInfoSearch.nodeCode" style="width:142px" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in nodesData" :key="item.nodeCode" :label="item.alias" :value="item.nodeCode"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="rightY">正选</el-button>
                <el-button type="primary" @click="rightN">反选</el-button>
                <el-button @click="rightClear">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
          <div class="btnGroup">
            <el-button type="primary" size="mini" title="批量导入"  @click="dialogUpdata = true">批量导入</el-button>
          </div>
          <el-row>
            <el-table
              id="tableData"
              ref="videoTable"
              :data="selectData"
              border
              size = "small"
              style="width: 100%"
              empty-text="暂无数据"
              height="550px"
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
                prop="artistName"
                label="艺人名称">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.artistName">{{scope.row.artistName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="vip"
                label="计费">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.vip">{{scope.row.vip === 0 ? '收费' : '免费'}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :formatter="getNode"
                prop="nodeCodeStr"
                width="100px"
                class-name="nodeCol"
                style="white-space: nowrap;text-overflow:ellipsis;overflow:hidden;"
                label="已注入节点">
                <template slot-scope="scope">
                  <div class="urlManagerData-text">
                    <p class="urlManager-normal" :title="scope.row.nodeCodeNameStr">{{scope.row.nodeCodeNameStr === 'null' ? '' : scope.row.nodeCodeNameStr}}</p>
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
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="UpdataClose">取消</el-button>
        <el-button type="primary" size="mini" @click="updatInfo">确定</el-button>
      </div>
    </el-dialog>
    <download :isdown="isdown" :downUrl="'/cms/api/tag/downloadListTagExcel.do'" :exportUrl="'/cms/api/tag/importListTagExcel.do'" @closeLoad="closeLoad"></download>
  </div>
</template>

<script>
import vSearch from './components/search'
import proSave from './components/proSave'
import download from '../../../common/download.vue'

export default {
  name: 'urlManager-list',
  props: ['routeHash'],
  components: {
    vSearch,
    proSave,
    download
  },
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
      let Arr = [];
      if (!!code) {
       let codeArr = code.split(',');
        this.nodesData.forEach(i => {
          codeArr.forEach(j => {
            if (j === i.nodeCode) {
              Arr.push(i.alias);
            }
          })
        })
      };
      return Arr.toString();
    }
  },
  data () {
    return {
       // 批量贴标签
      isdown: false,
      // 节目单
      newFile: {},
      dialogUpdata: false,
      listCode: '',
      resType: '',
      infoSearch: {
        page: 1,
        rows: 20,
        listCode: '',
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
      },
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
      url: {
        programList : "/cms/busi/list/list.do",
        copylist : "/cms/busi/list/copyList.do",
        detial : "/cms/busi/list/listdetail.do",
        save : "/cms/busi/list/save.do",
        del : "/cms/busi/list/delLists.do",
        checkUnique : "/cms/api/sect/checkUnique.do",

        // 穿梭框-贴标签
        resTag : "/cms/api/tag/listTag.do", // 获取资源已录入标签
        allTagList : "/cms/api/tag/allTagListForList.do", // 获取全部标签列表
        tagBind : "/cms/api/tag/bindForList.do", // 标签增加
        tagUnbind : "/cms/api/tag/unbindForList.do", // 标签解绑
        downloadResTagExcel : "/cms/api/tag/downloadResTagExcel.do", // 下载
        importResTagExcel : "/cms/api/tag/importResTagExcel.do", // 导入
        tagSelect : "/cms/api/tagType/select.do",

        // 资源录入
        leftlist : "/cms/busi/list/reslist.do", // 左
        rightlist : "/cms/busi/list/listres.do", // 右
        nodelist : "/cms/api/node/list.do",
        // nodelist : "/cms/busi/node/nodedetail.do",
        addlist : "/cms/busi/list/addrestolist.do",
        listresByWhere : "/cms/busi/list/listresByWhere.do",
        listresByWhereSide : "/cms/busi/list/listresByWhereSide.do",

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
        listCode: '',	//是	String	资源编码
        searchTagName: '',	//否	String	标签名称（查询条件）
        searchTypeId: 0,	//否	String	类型ID（查询条件）
      },
      searchTypeId: 0,
      regName: '',
      req: {
        list: {
          tagTypeId    : '',
          freeFlag    : '',
          listType    : '',
          resType    : '',
          listCode    : '',
          listName    : '',
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
      isIndeterminate: false,
      importOuting: false,
      choseAll: false,
      select_export: [],
      tagsData: [],
      listload: true,
      TableHeight: 600,
      ids: '',
      nodoStr: '',
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
    // this.getTagName();
    this.newFile = new FormData();
  },
  methods: {
    label(){
      this.isdown = true;
    },
    closeLoad(){
      this.isdown = false;
      this.onSubmit('clear');
      /*修改*/
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
      this.nodoStr = Arr.toString();
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
          if (res.data.obj.data.length > 0) {
            that.selectData = Array.from(res.data.obj.data);
          } else {
            that.selectData = [];
          }
          that.defaultData = Array.from(res.data.obj.data);
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
          if (res.data.obj.data.length > 0) {
            that.selectData = Array.from(res.data.obj.data);
          } else {
            that.selectData = [];
          }
          that.defaultData = Array.from(res.data.obj.data);
        },
        error: function (error) {
          that.$message.error(error);
        }
      });
    },
    rightClear() {
      this.infoSearch.page = 1;
      this.infoSearch.firstIn = true;
      this.alInfoSearch.resCode = '';
      this.alInfoSearch.nodeCode = '';
      this.getListResDetail();
    },
    // 资源录入
    leftSearch () {
      this.addInfo();
    },
    leftClear () {
      this.infoSearch.resCode = '';
      this.infoSearch.resName = '';
      this.infoSearch.artistName = '';
      // this.getLeftList([], [], "");
      this.addInfo();
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
      this.newFile.set('listCode', this.listCode);
      this.newFile.set('resType', this.resType);
      let param = Object.assign({}, this.reqList);
      that.axios({
        headers: {
          // 'deviceCode': 'A95ZEF1-47B5-AC90BF3',
          'Content-Type': 'multipart/form-data'
        },
        url: '/cms/busi/list/addrestolistbyexcel.do',
        method:'post',
        data: that.newFile,
      }).then( res => {
        if (res.data.success) {
          that.$message({
            type: 'success',
            message: res.data.msg
          })
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
      window.open('/cms/busi/list/download.do');
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
      let param = {listCode: this.listCode, jsonData: this.selectData};
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
            that.onSubmit('clear');
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
    intoRes (listCode, resType ) {
      this.dialogInfo.show = true;
      this.listCode = listCode;
      this.resType = resType;
      this.dataList = [];
      this.selectData = [];
      this.infoSearch.page = 1;
      this.alInfoSearch.nodeCode = '';
      this.alInfoSearch.resCode = '';
      // this.getLeftList([], [], "");
      this.leftClear();
      this.getListResDetail();
    },
    getLeftList (resCodes, selectResCodes, op) { // 左边信息栏
      let that = this;
      let param = {
        page: this.infoSearch.page,
        rows: this.infoSearch.rows,
        listCode: this.listCode,
        resType: this.resType,
        first: that.infoSearch.first,
        resCode: this.infoSearch.resCode,
        resName: this.infoSearch.resName,
        artistName: this.infoSearch.artistName,
        artistArea: this.infoSearch.artArea,
        resCodes: resCodes.toString(),
        selectResCodes: selectResCodes.toString(),
        nodeCode: this.nodeCode,
        klokFlag: this.klokFlag,
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
      let param = {listCode: this.listCode, resType: this.resType};
      let parmas = {jsonParam: JSON.stringify(param)};
      that.$ajax({
        url: that.url.rightlist,
        method: "post",
        data: this.Qs.stringify(parmas),
        success: function (res) {
          if (res.data.obj.data.length > 0) {
            res.data.obj.data.forEach( i => {
              that.$set(i, 'checkState', false)
            });
            that.selectData = Array.from(res.data.obj.data);
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
          that.defaultData = Array.from(res.data.obj.data);
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
//            console.log(res.data.success)  可能是接口的問題·
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
      this.dialog.title = '节目单贴标签';
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
      let parma = {listCode: this.shuttleData.listCode,};
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
        if (i == 'listCode') {
          this.shuttleAllReq[i] = this.shuttleData.listCode;
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
    addSelect() {
      let that = this;
      let params;
      let param = {
        listCode: this.shuttleData.listCode,
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
    removeSelect(){
      let that = this;
      let params;
      let param = {
        listCode: this.shuttleData.listCode,
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
      let param = {listCodes: id};
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
        this.saveTitle = '新增节目单';
      } else {
        this.saveTitle = '修改节目单';
      }
      this.modalData = data.toString();
      this.dialogSaveSy = true;
    },
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
//            debugger;
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
  .nodeCol .cell{
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
  .nodeCol /deep/ .cell{
    box-sizing: border-box;
    white-space: nowrap!important;
    word-break: break-all;
    line-height: 23px;
  }
  .shuttleWrap .el-table .cell {
    height: 30px !important;
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
  .cell{max-height: 30px !important;overflow: auto !important;}
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

</style>
