import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../../shared/modal/modal.service';
import { AppService } from '../../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../../shared/toast/toast-model';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {ElementCheckComponent} from './../../../ottoperate/element-check.component';
import {ElementSaveComponent} from '../../element-save.component';
import {AddDistrictComponent} from '../add-district.component';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./district.scss']
})
export class FloorComponent implements OnInit, OnDestroy {
  oData: any;
  modalType: any;
  isShow = 0;
  pagePartName = '楼层标题';
  elementList = [];
  imgApi = '';
  showThisEleModal: any;
  navSetArr = [{itemName: '楼层设置', className: 'act'}, {itemName: '楼层样式', className: ''}];
  floorType = '';
  portTypeArr = [{type: '1', name: '猜你喜欢'}, {type: '2', name: '热门推荐'}, {type: '3', name: '相似歌手推荐'}, {type: '4', name: '大家都在看'}, {type: '5', name: '当地红剧'}];
  portType = '1';
  showNum = 0;
  fileA = '';
  newFile: any = new FormData();
  boxActClass = 2;
  floorStyle = 2;
  allElementList = [];
  paramList = [];
  floorTitle = '';
  navArr = [{itemName: '通用元素', className: '', itemCode: '', provinceCode: '', cityCode: '', isOpen: false}];

  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
  }
  ok() {
    const that = this;
    if (this.floorType === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择楼层类型', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.showNum <= 0) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '显示个数必须大于0', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.paramList = [];
    if (this.oData !== '') {
      for (let i = 0; i < this.allElementList.length; i++) {
        for (let j = 0; j < this.allElementList[i].length; j++) {
          that.paramList.push({
            pagePartId: this.oData.pagePartId,
            eleId: this.allElementList[i][j].elementInfo.elementId,
            layoutSeq: this.allElementList[i][j].layoutSeq,
            isNewElement: this.allElementList[i][j].isNewElement,
            name: this.allElementList[i][j].elementInfo.alias,
            itemCode: this.navArr[i].itemCode,
            provinceCode: this.navArr[i].provinceCode,
            cityCode: this.navArr[i].cityCode,
          });
        }
      }
      this.newFile.set( 'pagePartId', this.oData.pagePartId);
      this.newFile.set( 'floorImg', this.oData.floorImg);
      this.newFile.set( 'layout', this.oData.layout);
    } else {
      for (let i = 0; i < this.allElementList.length; i++) {
        for (let j = 0; j < this.allElementList[i].length; j++) {
          that.paramList.push({
            eleId: this.allElementList[i][j].elementInfo.elementId,
            layoutSeq: this.allElementList[i][j].layoutSeq,
            isNewElement: this.allElementList[i][j].isNewElement,
            name: this.allElementList[i][j].elementInfo.alias,
            itemCode: this.navArr[i].itemCode,
            provinceCode: this.navArr[i].provinceCode,
            cityCode: this.navArr[i].cityCode,
          });
        }
      }
    }
    this.newFile.set( 'floorType', this.floorType);
    this.newFile.set( 'interfaceType', this.portType);
    this.newFile.set( 'showNum', this.showNum);
    this.newFile.set( 'floorStyle', this.floorStyle);
    this.newFile.set( 'pagePartName', this.pagePartName);
    this.newFile.set( 'floorTitle', this.floorTitle);
    this.newFile.set( 'productPageId', this.modalType.productPageId);
    this.newFile.set( 'partElementsJson', JSON.stringify(this.paramList));
    this.pageBusinessService.saveFloorPart(this.newFile, function(data){
      if (data.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      }
    });
  }
  navClick(i) {
    const that = this;
    this.navSetArr.forEach((j) => {
      j.className = '';
    });
    this.navArr.forEach((j) => {
      j.className = '';
    });
    this.navSetArr[i].className = 'act';
    this.isShow = i;
  }
  navClick2(i) {
    this.isShow = 2;
    const that = this;
    this.navSetArr.forEach((j) => {
      j.className = '';
    });
    this.navArr.forEach((j) => {
      j.className = '';
    });
    this.navArr[i].className = 'act';
    if (this.oData !== '') {
      /*获取导航右边的数据*/
      if  (this.navArr[i].isOpen) {
        const param = {
          pagePartId: this.oData.pagePartId,
          itemCode: this.navArr[i].itemCode
        };
        this.pageBusinessService.getPartDetial(param, function(res){
          if (res.success) {
            that.allElementList[i] = res.obj;
            that.navArr[i].isOpen = false;
            that.elementList = that.allElementList[i];
          }
        });
      } else {
        that.elementList = that.allElementList[i];
      }
    } else {
      that.elementList = that.allElementList[i];
    }
  }
  ngOnInit() {
    const that = this;
    console.log(this.oData)
    if (this.oData !== '') {
      that.init();
      that.getnavList();
      that.showNum = that.oData.showNum;
      that.floorStyle = that.oData.floorStyle;
      that.floorType = that.oData.floorType;
      that.pagePartName = that.oData.pagePartName;
      that.boxActClass = that.oData.floorStyle;
      that.floorStyle = that.oData.floorStyle;
      that.portType = that.oData.interfaceType;
      that.floorTitle = that.oData.floorTitle;
      if (that.oData.floorImg !== null) {
        that.fileA = environment.imgApi + that.oData.floorImg;
      }
    } else {
      that.elementList = [];
      that.allElementList.push([]);
    }
  }
  init() {
    const that = this;
    const param = {
      pagePartId: this.oData.pagePartId,
    };
    this.pageBusinessService.getPartDetial(param, function(res){
      if (res.success) {
        if (res.obj !== []) {
          that.elementList = res.obj;
          that.allElementList.push(res.obj);
        } else {
          that.elementList = [];
          that.allElementList.push([]);
        }
      }
    });
  }
  getnavList() {
    const that = this;
    const param = {
      pagePartId: this.oData.pagePartId,
    };
    this.pageBusinessService.getPartEleItem(param, function(res){
      if (res.success) {
        for (let i = 0; i < res.obj.length; i++) {
          res.obj[i].isOpen = true;
          that.navArr.push(res.obj[i]);
        }
      }
    });
  }
  close() {
    this.activeModal.dismiss({ status: 'closed' });
  }
  imgUp(ev, index) {
    const evAnd = ev.target ? ev.target : ev.srcElement;
    const file = evAnd.files[0];
    this.newFile.set( 'fileA', file);
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      switch (index) {
        case 'A':
          that.fileA = this.result;
          break;
      }
    };
  }
  boxAct(i) {
    this.boxActClass = i;
    this.floorStyle = i;
  }
  addDistrict() {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(AddDistrictComponent, {size: 'lg'});
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
      that.navArr.push({itemName: reason.item.split(',')[1], className: '', itemCode: reason.item.split(',')[0], provinceCode: reason.province, cityCode: reason.area, isOpen: false});
      that.allElementList.push([]);
    });
  }
  newElement() {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(ElementCheckComponent, {size: 'lg'});
    this.showThisEleModal.result.then((result) => {
      that.getElement(result);
    }, (reason) => {
    });
  }
  getElement(id) {
    const that = this;
    const param = {elementId: id};
    const val = {elementInfo: {elementId: ''}, layoutSeq: 0, isNewElement: 'yes'};
    this.pageBusinessService.eleDetailPost(param, function(data){
      val.layoutSeq = that.elementList.length;
      val.elementInfo = data;
      that.elementList.push(val);
    });
  }
  modify(Data, index) {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(ElementSaveComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.modalData = Data;
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
      const param = {elementId: Data.elementId};
      that.pageBusinessService.eleDetailPost(param, function(data){
        if (that.elementList[index].IsNewElement === 'yes') {
          data.IsNewElement = 'yes';
        }
        data.layoutSeq = Data.layoutSeq;
        that.elementList[index].elementInfo = data;
      });
    });
  }
  up(i) {
    const temp = this.elementList[i - 1];
    const templayoutSeq = this.elementList[i - 1].layoutSeq;
    const templayoutSeq2 = this.elementList[i].layoutSeq;
    this.elementList[i - 1] = this.elementList[i];
    this.elementList[i] = temp;
    this.elementList[i].layoutSeq = templayoutSeq2;
    this.elementList[i - 1].layoutSeq = templayoutSeq;
  }
  down(i) {
    const temp = this.elementList[i + 1];
    const templayoutSeq = this.elementList[i + 1].layoutSeq;
    const templayoutSeq2 = this.elementList[i].layoutSeq;
    this.elementList[i + 1] = this.elementList[i];
    this.elementList[i] = temp;
    this.elementList[i + 1].layoutSeq = templayoutSeq;
    this.elementList[i].layoutSeq = templayoutSeq2;
  }
  del(i, data) {
    const that = this;
    if (this.elementList.length === 1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '至少需要一个模块元素!', 2000);
      this.toastService.toast(toastCfg);
      return;
    }
    this.elementList.splice(i, 1);
    this.elementList.forEach((value, index) => {
      value.layoutSeq = index;
    });
    if (data.pagePartId !== undefined) {
      const param = {pagePartId: data.pagePartId, elementId: data.elementInfo.elementId};
      this.pageBusinessService.deletePartElement(param, function(res){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', res.msg, 2000);
        that.toastService.toast(toastCfg);
      });
    }
  }
  ngOnDestroy() {
  }
}
