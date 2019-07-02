import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';

import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {HistoryBusinessService} from '../../business-service/history/history-business.service';

import { pageResType, programArtAreas, programSongType } from '../../global-constant';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'c-picture-into',
  templateUrl: './picture-info.component.html',
  styleUrls: ['./picture-info.component.scss']
})
export class PictureInfoComponent implements OnInit, OnDestroy {

  firstIn: Boolean = true;

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
    this.oldSelectData.forEach(i => this.oldRightIds.push(i.historyElementId));
    this.getLeftList(this.oldRightIds, [], "");
  }

  dataList: Array<any>= [];
  leftIds: Array<any>= [];
  leftData: Array<any>= [];
  rightIds: Array<any>= [];
  defaultData: Array<any>= []; // 左侧的数据 每次选择都先保存到这里来，点添加的时候再移动右侧selectData
  selectData: Array<any>= [];
  resultData: Array<any>= []; // 右侧的数据 存放提交的数据
  oldSelectData: Array<any>= []; // 移动到右边之前，右侧的数据
  oldRightIds: Array<any>= []; // 移动到右边之前，右侧的数据


  constructor(public activeModal: NgbActiveModal, private toastService: ToastService, private historyBusinessService: HistoryBusinessService, private formBuilder: FormBuilder, private ngbModalService: NgbModal) {
  }

  id: any = "";
  resName: any = "";
  artName: any = "";
  artAreas: Array<any>= programArtAreas;
  artArea: any = "";
  parmaId: any = "";
  newAli: any = "";


  ngOnInit() {
    this.getListResDetail();
    this.getLeftList([],[],"")
  }
  ngOnDestroy() {
  }

  searchLeft() {
    this.options.page = 1;
    this.addSelect();
  }
  clear () {
    let t = this;
    t.options.page = 1;
    this.parmaId = '';
    this.newAli = '';
    t.firstIn = true;
    // t.eleCategory = '';
    this.getLeftList([], [], "");
  }
// 获取左侧数据
  getLeftList(ids, chooseData, op) {
   // console.log(selectResCodes)
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      wallName: this.modalData.wallName,
      first: this.firstIn,
      id: this.parmaId,
      newAlias: this.newAli,
      ids: ids,
    };
    let newSelectRes = [];
    if (op === "remove") {
     // ids.forEach(i => newSelectRes.push(i.id));
      param.ids = JSON.stringify(ids);
    } else {
      param.ids = JSON.stringify(ids);
    }
    this.historyBusinessService.getPictureCan(param, function(data){
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
    //  console.log(that.firstIn)
      if (!that.firstIn) {
        if (op === "remove") {
          that.selectData = Array.from(chooseData);
          that.defaultData = Array.from(chooseData);
        } else {
          that.selectData = Array.from(that.defaultData);
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
  // 右侧数据获取
  getListResDetail ( ) {
    let that = this;
    let param = {wallName: that.modalData.wallName};
    this.historyBusinessService.getPictureAlready(param, function(data){
      if (data.data.length > 0) {
        that.selectData = Array.from(data.data);
       // that.selectData.forEach(i => that.parmaIds.push(i.id));
        } else {
        that.selectData = [];
      }
      that.defaultData = Array.from(data.data);
    //  console.log(that.parmaIds)

    });
  }

  // 右移操作
  addSelect() {
    let arrayIds = [];
    this.oldSelectData = [];
    this.oldRightIds = [];
    this.oldSelectData = Array.from(this.selectData);
    this.oldSelectData.forEach(i => this.oldRightIds.push(i.historyElementId));
    let noData = this.dataList.every(_ => _.checkState);
    let totalPage = Math.ceil(this.options.pageCount / this.options.rows);
    if (noData && this.options.page === totalPage && this.options.page > 1) {
      this.options.page--;
    }

    if (this.oldRightIds.indexOf(this.id) !== -1) {
      return this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '该资源已在列表中!', 2000));
    } else {
      arrayIds = this.oldRightIds.concat(this.leftIds);
      this.getLeftList(arrayIds,this.leftIds, '');
      // this.getLeftList(JSON.stringify(arrayIds), this.leftIds, '');
    }
  }
  // 左移操作
  removeSelect() {
    let newRightData = [];
    let newRightDataId = [];
    this.selectData.forEach(i => {
      if (this.rightIds.indexOf(i.historyElementId) === -1) {
        newRightData.push(i);
        newRightDataId.push(i.historyElementId);

      }
    })
    this.getLeftList( newRightDataId, newRightData,"remove");
  }

  // 左侧的数据处理
  leftDataCheck(value, isCheck) {
    if (isCheck) {
      this.leftIds.unshift(value.historyElementId);
      this.defaultData.unshift(value);
    } else {
      this.defaultData.splice(this.defaultData.findIndex(v => v.historyElementId === value.historyElementId), 1);
      this.leftIds.splice(this.leftIds.findIndex(v => v.historyElementId === value.historyElementId), 1);
    }
  }

  // 左侧全选
  checkAll(ev) {
    this.dataList.forEach((value, index) => {
      value.checkState = ev.target.checked;
      this.leftDataCheck(value, ev.target.checked);
    });
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
    this.leftDataCheck(value, this.dataList[index].checkState);
  }
  // 左侧单选
  checkSingle(value, ev) {
    this.leftDataCheck(value, ev.target.checked);
  }

  // 左侧全选按钮的状态判断
  isAllChecked() {
    return this.dataList.every(_ => _.checkState);
  }



  // 右侧的数据处理
  rightDataCheck(value, isCheck) {
    if (isCheck ) {
      this.rightIds.push(value.historyElementId);
      this.resultData.push(value);
    } else {
      this.resultData.splice(this.resultData.findIndex(v => v.historyElementId === value.historyElementId), 1);
      this.rightIds.splice(this.rightIds.findIndex(v => v.historyElementId === value.historyElementId), 1);
    }
  }

  // 右侧全选
  checkAllRight(ev) {
    this.selectData.forEach((value, index) => {
      value.checkState = ev.target.checked;
      this.rightDataCheck(value, ev.target.checked);
    });
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
    this.rightDataCheck(value, this.selectData[index].checkState);
  }

  // 右侧单选
  checkSingleRight(value, ev) {
    this.rightDataCheck(value, ev.target.checked);
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
    let param = {wallName: this.modalData.wallName, jsonData: JSON.stringify(this.selectData)};
    this.historyBusinessService.getPictureOk(param, function(data){
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

}




