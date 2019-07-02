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
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./district.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {
  oData: any;
  saveCarousel = {
    pagePartName: ''
  };
  allElementList = [];
  elementList = [];
  imgApi = '';
  randoms: any;
  showThisEleModal: any;
  paramList = [];
  navArr = [{itemName: '通用元素', className: 'act', itemCode: '', provinceCode: '', cityCode: '', isOpen: false}];
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
  ngOnInit() {
    this.init();
    this.getnavList();
    this.randoms = Math.random();
    this.saveCarousel.pagePartName = this.oData.data.name;
  }
  getnavList() {
    const that = this;
    const param = {
      pagePartId: this.oData.data.pagePartId,
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
  init() {
    const that = this;
    const param = {
      pagePartId: this.oData.data.pagePartId,
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
  ok() {
    const that = this;
    this.paramList = [];
    for (let i = 0; i < this.allElementList.length; i++) {
       for (let j = 0; j < this.allElementList[i].length; j++) {
         that.paramList.push({
           pagePartId: this.oData.data.pagePartId,
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
    const param = {
      pagePartId: this.oData.data.pagePartId,
      productPageId: this.oData.data.productPageId,
      partStyleId: this.oData.data.partStyleId,
      layout: this.oData.data.layout,
      pagePartName: this.saveCarousel.pagePartName,
      partElementsJson: JSON.stringify(this.paramList)
    };
    this.pageBusinessService.savePartEle(param, function(res){
      if (res.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      }
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
  navClick(i) {
    const that = this;
    this.navArr.forEach((j) => {
      j.className = '';
    });
    this.navArr[i].className = 'act';
    /*获取导航右边的数据*/
    if  (this.navArr[i].isOpen) {
      const param = {
        pagePartId: this.oData.data.pagePartId,
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
  close() {
    this.activeModal.dismiss({ status: 'closed' });
  }
  ngOnDestroy() {
  }
}
