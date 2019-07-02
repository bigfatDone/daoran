import { Component, OnInit, ViewChild } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';

import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {AlbumBusinessService} from '../../business-service/album/album-business.service';
import {ProgramBusinessService} from '../../business-service/program/program-business.service';

import { pageResType, programArtAreas, songType } from '../../global-constant';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {environment} from '../../../environments/environment';
// import {ProgramUploadComponent} from './program-upload.component';
import {Router} from '@angular/router';
import {AlbumUploadComponent} from './album-upload.component';

@Component({
  selector: 'c-album-into',
  templateUrl: './album-into.component.html',
  styleUrls: ['./album-into.component.scss']
})
export class AlbumIntoComponent implements OnInit {

  firstIn: Boolean = true;

  options: any = {
    rows: 18,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
    size: "smaller"
  };

  modalData: any;

  onPageChanged ($event) {
    this.options.page = $event;

    this.oldSelectData = [];
    this.oldRightIds = [];
    this.oldSelectData = Array.from(this.selectData);
    this.oldSelectData.forEach(i => this.oldRightIds.push(i.resCode));
    this.getLeftList(this.oldRightIds, [], "");
  }

  dataList: Array<any>= [];
  leftIds: Array<any>= [];  // 非第一次操作右移添加时，左侧资源列表已选资源resCode(请求左侧list，传参用 )
  leftData: Array<any>= [];
  rightIds: Array<any>= [];
  defaultData: Array<any>= []; // 每次选择都先保存到这里来，点添加的时候再移动右侧selectData
  selectData: Array<any>= [];
  resultData: Array<any>= []; // 存放提交的数据
  oldSelectData: Array<any>= []; // 移动到右边之前，右侧的数据
  oldRightIds: Array<any>= []; // 移动到右边之前，右侧的数据

  windowUrl: any;
  drawFlag = true;
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private albumBusinessService: AlbumBusinessService,
              private programBusinessService: ProgramBusinessService,
              private formBuilder: FormBuilder,
              private ngbModalService: NgbModal,
              private router: Router) {
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/programList")>= 0) {
      this.drawFlag = false;
    }
  }

  resCode: any = "";
  resName: any = "";
  artName: any = "";
  songTypes: Array<any>= [];
  // songTypes: Array<any>= [{type:'01',value:'音乐MV类'},{type:'02',value:'卡拉ok类'},{type:'03',value:'综艺现场类'},{type:'04',value:'儿童教育类'},{type:'05',value:'动漫类'},{type:'06',value:'儿歌'},{type:'07',value:'戏曲'},];
  // songTypes: Array<any>= [{type:'01',value:'音乐MV类'},{type:'02',value:'卡拉ok类'},{type:'03',value:'综艺现场类'},{type:'04',value:'儿童教育类'},{type:'05',value:'动漫类'},{type:'06',value:'儿歌'},{type:'07',value:'戏曲'},];
  songType: any = "";
  artAreas: Array<any>= programArtAreas;
  artArea: any = "";
  SnodeCode: any = "";
  rightResCode: any = "";
  rightSnodeCode: any = "";


  ngOnInit() {
    if (this.modalData.resType === 1) {
      this.songTypes = [{type: '01', value: '音乐MV类'}, { type: '02', value: '卡拉ok类'}, { type: '03', value: '综艺现场类'}, {type: '04', value: '儿童教育类'},{ type: '05', value: '动漫类'}, { type: '06', value: '儿歌'}, {type: '07', value: '戏曲'}];
    } else if (this.modalData.resType === 2) {
      this.songTypes = [{type: '20', value: '汉语'}, {type: '21', value: '维语'}];
    } else if (this.modalData.resType === 3) {
      this.songTypes = [{type: '30', value: '视频类'}, {type: '31', value: '音频类'}];
    }
    this.getLeftList([], [], "");
    this.getListResDetail('1');
    this.getNodeList();
    this.getAllSectList();
  }
  OnDestroy() {
    if (this.uploadResModel !== null) {
      this.uploadResModel.close();
    }
  }
  clear () {
    const t = this;
    t.options.page = 1;
    t.resCode = '';
    t.resName = '';
    t.artName = '';
    t.songType = '';
    t.sectCode = '';
    // t.firstIn = true;
    t.myOptions = [];
    t.SnodeCode = '';
    // t.eleCategory = '';
    this.getLeftList([], [], "");
  }
  searchLeft(type) {
    this.options.page = 1;
    this.addSelect(type);
  }
  getIdList(child) {
    this.SnodeCode = child.toString();
  }
  getLeftList(resCodes, selectResCodes, op) { // 左边信息栏
    let that = this;
    let param: any = {
      page: this.options.page,
      rows: this.options.rows,
      albumCode: this.modalData.albumCode,
      resType: this.modalData.resType,
      first: this.firstIn,

      sect: this.sectCode,
      resCode: this.resCode,
      resName: this.resName,
      artistName: this.artName,
      // artName: this.artName,
      searchType: this.songType,
      resCodes: resCodes.toString(),
      selectResCodes: selectResCodes.toString(),
      nodeCode: this.SnodeCode,
    };
    let newSelectRes = [];
    if (op === "remove") {
      selectResCodes.forEach(i => newSelectRes.push(i.resCode));
      param.selectResCodes = newSelectRes.toString();
      param.flag = 'left';
    } else {
      param.selectResCodes = selectResCodes.toString();
    }
    this.albumBusinessService.getResList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.leftData = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
        if (that.firstIn) {
          that.dataList = [];
        }
      } else {
        that.dataList = [];
      }
      that.leftIds = [];
      if (!that.firstIn) {
        if (op === "remove") {
          that.selectData = Array.from(selectResCodes);
          that.defaultData = Array.from(selectResCodes);
        } else {
          if (that.excelData.length !== 0) {  // 判断是否是从Excel导入的数据
            that.defaultData = that.defaultData.concat(that.excelData);
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
      that.firstIn = false;
    });
  }

  // 左侧的数据处理
  leftDataCheck(value, isCheck) {
    if (isCheck) {
      this.leftIds.unshift(value.resCode);
      // delete value["checkState"];
      this.defaultData.unshift(value);
    } else {
      this.defaultData.splice(this.defaultData.findIndex(v => v.resCode === value.resCode), 1);
      this.leftIds.splice(this.leftIds.findIndex(v => v.resCode === value.resCode), 1);
    }
  }

  // 左侧全选
  checkAll(ev) {
    this.dataList.forEach((value, index) => {
      value.checkState = ev.target.checked;
      // this.leftDataCheck(value, ev.target.checked);
    });
  }

  // 左侧单选
  checkSingle(value, ev) {
    this.leftDataCheck(value, ev.target.checked);
  }

  checkTr(value, index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].checkState) {
          this.dataList[index].checkState = false;
        } else {
          this.dataList[index].checkState = true;
        }
      }
      // else {
      //   this.dataList[ind].checkState = false;
      // }
    });
    // this.leftDataCheck(value, this.dataList[index].checkState);
  }

  // 左侧全选按钮的状态判断
  isAllChecked() {
    return this.dataList.every(_ => _.checkState);
  }



  // 右侧的数据处理
  rightDataCheck(value, isCheck) {
    if (isCheck ) {
      this.rightIds.push(value.resCode);
      this.resultData.push(value);
    } else {
      this.resultData.splice(this.resultData.findIndex(v => v.resCode === value.resCode), 1);
      this.rightIds.splice(this.rightIds.findIndex(v => v.resCode === value.resCode), 1);
    }
  }

  // 右侧全选
  checkAllRight(ev) {
    this.selectData.forEach((value, index) => {
      value.checkState = ev.target.checked;
      // this.rightDataCheck(value, ev.target.checked);
    });
  }

  // 右侧单选
  checkSingleRight(value, ev) {
    this.rightDataCheck(value, ev.target.checked);
  }

  checkRightTr(value, index) {

    this.selectData.forEach( (el, ind) => {
      if (ind === index) {
        if (this.selectData[index].checkState) {
          this.selectData[index].checkState = false;
        } else {
          this.selectData[index].checkState = true;
        }
      }
    });
    // this.rightDataCheck(value, this.selectData[index].checkState);
  }

  // 右侧全选按钮的状态判断
  isAllCheckedRight() {
    if (this.selectData.length > 0) {
      return this.selectData.every(_ => _.checkState);
    }
  }


  ok(): void {
    let that = this;
    this.selectData.forEach((i, index) => i.sort = index + 1 );
    let param = {albumCode: this.modalData.albumCode, jsonData: JSON.stringify(this.selectData)};
    this.albumBusinessService.saveResList(param, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '资源录入成功!', 2000);
      that.toastService.toast(toastCfg);
      that.close();
    });
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

  toTop(index) {
    this.changePosition(this.selectData, index, 0);
  }

  toBottom(index) {
    this.changePosition(this.selectData, index, this.selectData.length - 1);
  }

  moveUp(index) {
    this.changePosition(this.selectData, index, index - 1);
  }

  moveDown(index) {
    this.changePosition(this.selectData, index, index + 1);
  }

  changePosition(arr, index, tindex) {
    if (index > tindex) {
      arr.splice(tindex, 0, arr[index]);
      arr.splice(index + 1, 1);
    } else {
      arr.splice(tindex + 1, 0, arr[index]);
      arr.splice(index, 1);
    }
  }

  addSelect(type) {   // 向右移动
    if (type !== 'sear') {
      this.dataList.forEach( i => {
        if (i.checkState){
          this.leftIds.unshift(i.resCode);
          // delete value["checkState"];
          this.defaultData.unshift(i);
        }
      })
    }
    let excelIds = [];
    this.excelData.forEach( i => {
      excelIds.push(i.resCode);
    })
    this.oldSelectData = [];
    this.oldRightIds = [];
    this.oldSelectData = Array.from(this.selectData);
    this.oldSelectData.forEach(i => this.oldRightIds.push(i.resCode));

    let noData = this.dataList.every(_ => _.checkState);
    let totalPage = Math.ceil(this.options.pageCount / this.options.rows);
    if (noData && this.options.page === totalPage && this.options.page > 1) {
      this.options.page--;
    }
    if (this.oldRightIds.indexOf(this.resCode) !== -1) {
      return this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '该资源已在列表中!', 2000));
    } else {
      if (excelIds !== []) {
        this.leftIds = this.leftIds.concat( excelIds );
      }
      if (type === 'sear') {
        this.getLeftList(this.oldRightIds, [], '');
      } else {
        this.getLeftList(this.oldRightIds, this.leftIds, '');
      }
    }
  }

  removeSelect() { // 左移
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
  }

  getListResDetail (type) {   // 右边数据获取
    let that = this;
    let param: any = {
      albumCode: this.modalData.albumCode,
      resType: this.modalData.resType,
      searchStatus: type,
      nodeCode: this.rightSnodeCode,
      resCode: this.rightResCode,
    };
    this.albumBusinessService.getListResDetail(param, function(data){
      if (data.data.length > 0) {
        that.selectData = Array.from(data.data);
      } else {
        that.selectData = [];
      }
      that.defaultData = Array.from(data.data);
    });
  }
  getIdListRight(child) {
    this.rightSnodeCode = child.toString();
  }
  // 右侧数据操作   搜索、查询、重置
  searchRight(searchStatus) {
    let that = this;
    let param = {
      albumCode: this.modalData.albumCode,
    // listCode: this.modalData.listCode,
      resType: this.modalData.resType,
      resCode: this.rightResCode,
      nodeCode: this.rightSnodeCode,
      searchStatus: searchStatus
    };
    this.albumBusinessService.listresByWhere(param, function(data){
      if (data.data.length > 0) {
        that.selectData = Array.from(data.data);
      } else {
        that.selectData = [];
      }
      that.defaultData = Array.from(data.data);
    });
  }
/*  searchOpposite() {
    let that = this;
    let param = {
      listCode: this.modalData.listCode,
      resType: this.modalData.resType,
      resCode: this.rightResCode,
      nodeCode: this.rightSnodeCode,
    };
    this.albumBusinessService.listresByWhereSide(param, function(data){
      if (data.data.length > 0) {
        that.selectData = Array.from(data.data);
      } else {
        that.selectData = [];
      }
      that.defaultData = Array.from(data.data);
    });
  }*/

  rClear () {
    this.options.page = 1;
    this.rightResCode = '';
    this.rightSnodeCode = '';
    // this.firstIn = true;
    this.myOptionsRight = [];
    // t.eleCategory = '';
    this.getListResDetail('1');
  }
  optionsModel: number[] = [];

  myTexts: IMultiSelectTexts = {
    defaultTitle: "选择"
  };

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 3,
  };

  myOptions = [];
  myOptionsRight = [];
  nodesData: Array<any>= [];
  getNodeList() {
    const that = this;
    this.albumBusinessService.getNodeDetail(function(data) {
      if (data.length > 0) {
        that.nodesData = data;
        for (const i of data) {
          that.myOptions.push({id: i.nodeCode, name: i.alias});
          that.myOptionsRight.push({id: i.nodeCode, name: i.alias});
        }
      }
    });
  }

  rightSearchCond: Array<any>= [];

  onSearchChange(e) {
    // this.rightSearchData = [];
    // this.selectData.forEach(i => {
    //   let curIds = i.nodeCodeStr.split(",");
    //   for (let m of curIds) {
    //     if (e.indexOf(m) > -1) {
    //       this.rightSearchData.push(i);
    //       break;
    //     }
    //   }
    // })
    // console.log(this.rightSearchData);
    this.rightSearchCond = e;
  }

  filterRdata(nodeCodeStrs) {
    if (this.rightSearchCond.length !== 0){
      let codeArr = nodeCodeStrs.split(",");
      let num = 0;
      for(let n of this.rightSearchCond){
        for(let m of codeArr){
          if(this.rightSearchCond.indexOf(m) > -1) {
            num++;
          }
        }
      }
      if (num !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }

  }
  uploadResModel: any = null;
  excelData: Array<any> = [];
  infundeRes(){
    let that = this;
    this.uploadResModel = this.ngbModalService.open(AlbumUploadComponent, {size: "lg"});
    this.uploadResModel.componentInstance.uploadData = {
      id: that.modalData.albumCode,
      type: 'album',
      resType: that.modalData.resType
    }
    this.uploadResModel.result.then((result) => {
      console.log(this.excelData)
      this.excelData = result;
      that.addSelect('');
    }, (reason) => {
    });
  }
  listCodeData: Array<any>= [];
  codeData: Array<any>= [];
  codeDataString : any;
  // getlistCode() {
  //   let that = this;
  //   let param = {listCode: this.modalData.listCode}
  //   this.albumBusinessService.getListCodeData(param, function(data) {
  //     if (data.length > 0) {
  //       for (let i of data) {
  //         that.listCodeData.push({id: i.nodeCode, name: i.alias});
  //       }
  //       for (let i of that.listCodeData) {
  //         that.codeData.push(i.name);
  //       }
  //       that.codeDataString = that.codeData.toString();
  //       }
  //   });
  // }

  sectData: Array<any> = [];
  sectCode: any = '';
  getAllSectList() {
    let that = this;
    let param = {};
    this.albumBusinessService.getAllSectList(param, function(data){
      if (data.sectList.length > 0) {
        that.sectData = data.sectList;
      } else {
        that.sectData = [];
      }
    });
  }
  resDownLoad() {
    window.open('/jit_pms/busi/album/resDownload?resType=' + this.modalData.resType);
  }
}




