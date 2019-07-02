import {Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {PageTOComponent} from '../template-manage/page-to.component';
import { musicData, drawData, functionData, pageType } from '../../../global-constant';
import {ElementCheckComponent} from './../../ottoperate/element-check.component';
import {environment} from '../../../../environments/environment';
import {ElementSaveComponent} from '../element-save.component';

@Component({
  selector: 'app-page-config-add',
  templateUrl: './page-config-add.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class PageConfigAddComponent implements OnInit, OnDestroy {
  pageConfigSaveForm: FormGroup;
  dataList: Array <any>= []; // 模板的list
  pageType = pageType;
  boxActClass = 0;
  showThisEleModal: any;
  resultStr: any;
  commonTypeArr = [{type: 'music', values: '音乐'}, {type: 'draw', values: '绘本'}];
  typeArr = functionData;
  imgSrcA: any;
  imgSrcB: any;
  imgApi: any;
  getAllProjectmyList = []; // 下拉项目列表
  getAllProvinceList = [];  // 下拉省份列表
  getAllProductTypeList = []; // 下拉产品类别列表
  getAllVersionList = []; // 下拉版本列表
  setParam: any = new FormData();
  elementList = [];
  modalData: any;
  defaultListByProject: any; // 默认选中下拉项目列表
  defaultListByProvince: any; // 默认选中下拉省份列表
  defaultListByVersion: any; // 默认选中下拉版本列表
  isFirst = true;
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) {
    const productPageNameFC = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    const itemTypeFC = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFC = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFC = new FormControl('', Validators.compose([Validators.required]));
    const productCodeFC = new FormControl('', Validators.compose([Validators.required]));
    const productTypeFC = new FormControl('', Validators.compose([Validators.required]));
    const versionNumFC = new FormControl('');
    const pageTypeFC = new FormControl(1, Validators.compose([Validators.required]));
    const parentPageFC = new FormControl('');
    const pageMoldFC = new FormControl('music', Validators.compose([Validators.required]));
    const moldValueFC = new FormControl('collection', Validators.compose([Validators.required]));
    const stencilIdFC = new FormControl('', Validators.compose([Validators.required]));

    this.pageConfigSaveForm = this.formBuilder.group({
      productPageName: productPageNameFC,
      itemType: itemTypeFC,
      itemCode: itemCodeFC,
      provinceCode: provinceCodeFC,
      productType: productTypeFC,
      productCode: productCodeFC,
      versionNum: versionNumFC,
      pageType: pageTypeFC, // 页面类型
      parentPage: parentPageFC, // 页面指向
      pageMold: pageMoldFC, // 通用类型
      moldValue: moldValueFC, // 类型值
      stencilId: stencilIdFC, // 选择模板
    });
  }
  ngOnInit() {
    if (this.modalData !== '') {
      this.getIdDetail(this.modalData.productPageId);
      this.pageConfigSaveForm.patchValue({
        productPageName: this.modalData.productPageName,
        itemType: this.modalData.itemType,
        itemCode: this.modalData.itemCode,
        provinceCode: this.modalData.provinceCode,
        productType: this.modalData.productType,
        productCode: this.modalData.productCode,
        versionNum: this.modalData.versionNum,
        pageType: this.modalData.pageType,
        parentPage: this.modalData.parentPage,
        pageMold: this.modalData.pageMold,
        moldValue: this.modalData.moldValue,
      });
      this.defaultListByProject = this.modalData.itemCode;
      this.defaultListByProvince = this.modalData.provinceCode;
      this.defaultListByVersion = this.modalData.versionNum;
      this.resultStr = this.modalData.parentPageName; // 页面指向显示的名称
      if (this.pageConfigSaveForm.controls['pageType'].value === 3) {
        this.typeArr = functionData;
      } else if (this.pageConfigSaveForm.controls['pageType'].value === 4) {
        this.commonTypeArr = [{type: 'music', values: '音乐'}, {type: 'draw', values: '绘本'}];
        switch (this.pageConfigSaveForm.controls['pageMold'].value) {
          case 'music':
            this.typeArr = musicData;
            break;
          case 'draw':
            this.typeArr = drawData;
            break;
        }
      }
      if (this.modalData.bgImgHD !== null) {
        this.imgSrcA = environment.imgApi +  this.modalData.bgImgHD;
      }
      if (this.modalData.bgImgSD !== null) {
        this.imgSrcB = environment.imgApi +  this.modalData.bgImgSD;
      }
      this.pageConfigSaveForm.controls['pageType'].disable();
    }
    this.imgApi = environment.imgApi;
    this.getAllProject();
    this.getAllProvince();
    this.productStylechange();
    this.getTempaltelist();
  }
  getIdDetail(productPageId) {
    const that = this;
    const param = {productPageId: productPageId};
    this.pageBusinessService.getProductPageConfigDetail(param, function(data){
      if (data.success) {
        that.elementList  = data.obj.configPagePartEleList;
      }
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
        that.elementList[index] = data;
      });
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
    this.pageBusinessService.eleDetailPost(param, function(data){
      data.layoutSeq = that.elementList.length;
      data.IsNewElement = 'yes';
      that.elementList.push(data);
    });
  }
  checkChange() {
    switch (this.pageConfigSaveForm.controls['pageType'].value) {
      case 3:
        this.typeArr = functionData;
        this.pageConfigSaveForm.get('moldValue').setValue('collection');
        break;
      case 4:
        this.commonTypeArr = [{type: 'music', values: '音乐'}, {type: 'draw', values: '绘本'}];
        this.pageConfigSaveForm.get('pageMold').setValue('music');
        this.typeArr = musicData;
        this.pageConfigSaveForm.get('moldValue').setValue('topic');
        break;
    }
  }
  commonChange() {
    switch (this.pageConfigSaveForm.controls['pageMold'].value) {
      case 'music':
        this.typeArr = musicData;
        this.pageConfigSaveForm.get('moldValue').setValue('topic');
        break;
      case 'draw':
        this.typeArr = drawData;
        this.pageConfigSaveForm.get('moldValue').setValue('free');
        break;
    }
  }
  showThisEle() {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(PageTOComponent, {size: 'lg'});
    this.showThisEleModal.result.then((result) => {
      that.pageConfigSaveForm.get(['parentPage']).setValue(result[0].id);
      that.resultStr = result[0].name;
    }, (reason) => {
    });
  }
  ok() {
    const that = this;
    if (this.pageConfigSaveForm.controls['productPageName'].value === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请输入页面名称', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.pageConfigSaveForm.controls['itemType'].value === '' || this.pageConfigSaveForm.controls['itemCode'].value === '' || this.pageConfigSaveForm.controls['provinceCode'].value === '') {
      console.log(this.pageConfigSaveForm.controls['itemType'].value);
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请将项目输入完整', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.pageConfigSaveForm.controls['productType'].value === '' || this.pageConfigSaveForm.controls['productCode'].value === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请将产品输入完整', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.modalData !== '') {
      this.setParam.set('productPageId', this.modalData.productPageId);
      this.setParam.set('bgImgHD', this.modalData.bgImgHD);
      this.setParam.set('bgImgSD', this.modalData.bgImgSD);
    }
    this.setParam.set('productPageName', this.pageConfigSaveForm.controls['productPageName'].value);
    this.setParam.set('itemType', this.pageConfigSaveForm.controls['itemType'].value);
    this.setParam.set('itemCode', this.pageConfigSaveForm.controls['itemCode'].value);
    this.setParam.set('provinceCode', this.pageConfigSaveForm.controls['provinceCode'].value);
    this.setParam.set('versionNum', this.pageConfigSaveForm.controls['versionNum'].value);
    this.setParam.set('productType', this.pageConfigSaveForm.controls['productType'].value);
    this.setParam.set('productCode', this.pageConfigSaveForm.controls['productCode'].value);
    this.setParam.set('pageType', this.pageConfigSaveForm.controls['pageType'].value);

    if (this.pageConfigSaveForm.controls['pageType'].value === 1 || this.pageConfigSaveForm.controls['pageType'].value === 2) {
      this.setParam.set('stencilId', this.pageConfigSaveForm.controls['stencilId'].value);
      this.setParam.set('parentPage', this.pageConfigSaveForm.controls['parentPage'].value);
      this.setParam.delete('pageMold');
      this.setParam.delete('moldValue');
      this.setParam.delete('eletementIdAndLayoutSeqJson');
    } else {
      this.setParam.delete('stencilId');
      this.setParam.delete('parentPage');
      this.setParam.set('pageMold', this.pageConfigSaveForm.controls['pageMold'].value);
      this.setParam.set('moldValue', this.pageConfigSaveForm.controls['moldValue'].value);
      this.setParam.set('eletementIdAndLayoutSeqJson', JSON.stringify(this.elementList));
    }
    this.pageBusinessService.saveProductPageConfig(this.setParam, function(data){
      if (data.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      }
    });
  }
  getTempaltelist() {
    const that = this;
    const param = {
      stencilName: '',
      page: 1,
      rows:  20,
    };
    this.pageBusinessService.getStencilInfoListByWhere(param, function(data){
      if (data.data.length > 0) {
        that.dataList =  data.data;
        if (that.modalData !== '') {
          that.pageConfigSaveForm.get(['stencilId']).setValue(that.modalData.stencilId);
          data.data.forEach( (el, ind) => {
            if (el.stencilId === that.modalData.stencilId) {
              that.boxActClass = ind;
            }
          });
        } else {
          that.pageConfigSaveForm.get(['stencilId']).setValue(data.data[0].stencilId);
        }
      } else {
        that.dataList = [];
      }
    });
  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  upload(ev, index) {
    const evAnd = ev.target ? ev.target : ev.srcElement;
    const file = evAnd.files[0];
    this.setParam.set('file' + index, file);
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
        case 'B':
          that.imgSrcB = this.result;
          break;
      }
    };
  }
  getAllVersionchange() {
    const that = this;
    this.pageConfigSaveForm.get(['versionNum']).setValue('');
    const param = {sProductCode: this.pageConfigSaveForm.get('productCode').value};
    this.pageBusinessService.detailVersionList(param, function(data){
      if (data.success) {
        that.getAllVersionList = [];
        if (data.obj != null) {
          data.obj.forEach( i => {
            that.getAllVersionList.push({id: i.iProductId, name: i.sProductVersionNo});
          });
        }
      }
    });
  }
  productStylechange() {
    const that = this;
    if (this.modalData !== '' && this.isFirst) {
      this.isFirst = false;
    } else {
      this.pageConfigSaveForm.get(['productCode']).setValue('');
    }
    const  param = {productType: this.pageConfigSaveForm.controls['productType'].value};
    this.pageBusinessService.getAllProductInfoListByProductType(param, function(data){
      if (data.success) {
        that.getAllProductTypeList = data.obj;
        that.getAllVersionchange();
      }
    });
  }
  getAllProject() {
    const that = this;
    const param = {itemType: this.pageConfigSaveForm.controls['itemType'].value };
    this.pageBusinessService.getAllProject(param, function(data){
      if (data.success) {
        that.getAllProjectmyList = [];
        data.obj.forEach( i => {
          that.getAllProjectmyList.push({id: i.sProjectCode, name: i.sProject});
        });
      }
    });
  }
  getAllProvince() {
    const that = this;
    this.pageBusinessService.getProvinces({}, function(data){
      if (data.success) {
        that.getAllProvinceList = [];
        if (data.obj != null) {
          data.obj.forEach( i => {
            that.getAllProvinceList.push({id: i.sAreaCode, name: i.sAreaName});
          });
        }
      }
    });
  }
  getItemList(child) {
    this.pageConfigSaveForm.get(['itemCode']).setValue(child.toString());
  }
  getProvinceList(child) { // 获取省份id
    this.pageConfigSaveForm.get(['provinceCode']).setValue(child.toString());
  }
  getVersion(child) { // 获取版本id
    this.pageConfigSaveForm.get(['versionNum']).setValue(child.toString());
  }
  del(data, i) {
    const that = this;
    this.elementList.splice(i, 1);
    this.elementList.forEach((value, index) => {
      value.layoutSeq = index;
    });
    if (data.pagePartId !== undefined) {
      const param = {pagePartId: data.pagePartId, elementId: data.elementId};
      this.pageBusinessService.deletePartElement(param, function(res){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', res.msg, 2000);
        that.toastService.toast(toastCfg);
      });
    }
  }
  ngOnDestroy() {
  }
  boxAct(i, item) {
    this.boxActClass = i;
    this.pageConfigSaveForm.get(['stencilId']).setValue(item.stencilId);
  }
}
