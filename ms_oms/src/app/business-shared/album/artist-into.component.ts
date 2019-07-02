import { Component, OnInit, ViewChild } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';

import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import {pageResType, programArtAreas, programSongType, songType} from '../../global-constant';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {AlbumBusinessService} from '../../business-service/album/album-business.service';
import {AlbumUploadComponent} from './album-upload.component';

@Component({
  selector: 'c-artist-into',
  templateUrl: './artist-into.component.html',
  styleUrls: ['./artist-into.component.scss']
})
export class ArtistIntoComponent implements OnInit {

  firstIn: Boolean = true;
  songTypes: Array<any>= songType;
  artistAreas: Array<any>= programArtAreas;

  options: any = {
    rows: 20,
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
    this.oldSelectData.forEach(i => this.oldRightIds.push(i.artistCode));
    this.getLeftList(this.oldRightIds, [], "");
  }

  dataList: Array<any>= [];
  leftIds: Array<any>= [];
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
              private formBuilder: FormBuilder,
              private ngbModalService: NgbModal,
              private router: Router) {
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/programList")>= 0) {
      this.drawFlag = false;
    }
  }


  artistCode: any = "";
  artistName: any = "";
  artistArea: any = "";
  artistType: any = "";
  artAreas: Array<any>= programArtAreas;
  SnodeCode: any = "";
  rightResCode: any = "";
  rightSnodeCode: any = "";


  ngOnInit() {
    this.getLeftList([], [], "");
    this.getListArtistDetail();
    // this.getNodeList();
    // this.getlistCode();
  }
  OnDestroy() {
    if (this.uploadResModel !== null) {
      this.uploadResModel.close();
    }
  }
  clear () {
    let t = this;
    t.options.page = 1;
    t.artistCode = '';
    t.artistName = '';
    t.artistArea = '';
    t.artistType = '';
    t.SnodeCode = '';
    t.firstIn = true;
    // t.eleCategory = '';
    this.getLeftList([], [], "");
  }
  searchLeft() {
    this.options.page = 1;
    this.addSelect();
  }

  getLeftList(resCodes, selectResCodes, op) { // 左边信息栏
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      albumCode: this.modalData.listCode,
      first: this.firstIn,
      artistCode: this.artistCode,
      artistName: this.artistName,
      artistArea: this.artistArea,
      artistType: this.artistType,
      artistCodes: resCodes.toString(),
      selectArtistCodes: selectResCodes.toString(),
      // nodeCode: this.SnodeCode,
    };
    let newSelectRes = [];
    if (op === "remove") {
      console.log(selectResCodes)
      selectResCodes.forEach(i => newSelectRes.push(i.artistCode));
      param.selectArtistCodes = newSelectRes.toString();
    } else {
      param.selectArtistCodes = selectResCodes.toString();
    }
    this.albumBusinessService.getartistList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.leftData = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
      that.leftIds = [];
      if (!that.firstIn) {
        if (op === "remove") {
          that.selectData = Array.from(selectResCodes);
          that.defaultData = Array.from(selectResCodes);
        } else {
          if (that.excelData !== []) {  // 判断是否是从Excel导入的数据
            that.defaultData = that.excelData.concat(that.defaultData);
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
      this.leftIds.unshift(value.artistCode);
      // delete value["checkState"];
      this.defaultData.unshift(value);
    } else {
      this.defaultData.splice(this.defaultData.findIndex(v => v.artistCode === value.artistCode), 1);
      this.leftIds.splice(this.leftIds.findIndex(v => v.artistCode === value.artistCode), 1);
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
      this.rightIds.push(value.artistCode);
      this.resultData.push(value);
    } else {
      this.resultData.splice(this.resultData.findIndex(v => v.artistCode === value.artistCode), 1);
      this.rightIds.splice(this.rightIds.findIndex(v => v.artistCode === value.artistCode), 1);
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
    let param = {albumCode: this.modalData.listCode, jsonData: JSON.stringify(this.selectData)};
    this.albumBusinessService.saveArtisttoalbum(param, function(data){
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

  addSelect() {   // 向右移动
    this.dataList.forEach( i => {
      if (i.checkState){
        this.leftIds.unshift(i.artistCode);
        // delete value["checkState"];
        this.defaultData.unshift(i);
      }
    })
    let excelIds = [];
    this.excelData.forEach( i => {
      excelIds.push(i.artistCode);
    })
    this.oldSelectData = [];
    this.oldRightIds = [];
    this.oldSelectData = Array.from(this.selectData);
    this.oldSelectData.forEach(i => this.oldRightIds.push(i.artistCode));

    let noData = this.dataList.every(_ => _.checkState);
    let totalPage = Math.ceil(this.options.pageCount / this.options.rows);
    if (noData && this.options.page === totalPage && this.options.page > 1) {
      this.options.page--;
    }
    if (this.oldRightIds.indexOf(this.artistCode) !== -1) {
      return this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '该资源已在列表中!', 2000));
    } else {
      if (excelIds !== []) {
        this.leftIds = this.leftIds.concat( excelIds );
      }
      this.getLeftList(this.oldRightIds, this.leftIds, '');
    }
  }

  removeSelect() {  // 左移
    this.selectData.forEach( i => {
      if (i.checkState ) {
        this.rightIds.push(i.artistCode);
        this.resultData.push(i);
      }
    })
    let newRightData = [];
    this.selectData.forEach(i => {
      if (this.rightIds.indexOf(i.artistCode) === -1) {
        newRightData.push(i);
      }
    })
    this.getLeftList("", newRightData, "remove");
  }

  getListArtistDetail () {   // 右边数据获取
    let that = this;
    let param = {albumCode: this.modalData.listCode};
    this.albumBusinessService.getListalbumArtistDetail(param, function(data){
      if (data.data.length > 0) {
        that.selectData = Array.from(data.data);
      } else {
        that.selectData = [];
      }
      that.defaultData = Array.from(data.data);
    });
  }
  // 右侧数据操作   搜索、查询、重置
  // searchRight() {
  //   let that = this;
  //   let param = {
  //     listCode: this.modalData.listCode,
  //     resType: this.modalData.resType,
  //     resCode: this.rightResCode,
  //     nodeCode: this.rightSnodeCode,
  //   };
  //   this.albumBusinessService.listresByWhere(param, function(data){
  //     if (data.data.length > 0) {
  //       that.selectData = Array.from(data.data);
  //     } else {
  //       that.selectData = [];
  //     }
  //     that.defaultData = Array.from(data.data);
  //   });
  // }
  // searchOpposite() {
  //   let that = this;
  //   let param = {
  //     listCode: this.modalData.listCode,
  //     resType: this.modalData.resType,
  //     resCode: this.rightResCode,
  //     nodeCode: this.rightSnodeCode,
  //   };
  //   this.albumBusinessService.listresByWhereSide(param, function(data){
  //     if (data.data.length > 0) {
  //       that.selectData = Array.from(data.data);
  //     } else {
  //       that.selectData = [];
  //     }
  //     that.defaultData = Array.from(data.data);
  //   });
  // }

  // rClear () {
  //   let t = this;
  //   t.options.page = 1;
  //   this.rightResCode = '';
  //   this.rightSnodeCode = '';
  //   t.firstIn = true;
  //   // t.eleCategory = '';
  //   this.getListResDetail();
  // }
  optionsModel: number[] = [];

  myTexts: IMultiSelectTexts = {
    defaultTitle: "选择"
  };

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 3,
  };

  myOptions: IMultiSelectOption[] = [];

  nodesData: Array<any>= [];
  // getNodeList() {
  //   let that = this;
  //   this.albumBusinessService.getNodeDetail(function(data) {
  //     let myOptions = [];
  //     if (data.length > 0) {
  //       that.nodesData = data;
  //       for (let i of data) {
  //         myOptions.push({id: i.nodeCode, name: i.alias});
  //       }
  //     }
  //     that.myOptions = myOptions;
  //   });
  // }

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
    if (this.rightSearchCond.length !== 0) {
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
      id: that.modalData.listCode,
      type: 'artist'
    }
    this.uploadResModel.result.then((result) => {
      this.excelData = result;
      that.addSelect();
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
}




