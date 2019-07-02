import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import {Router} from '@angular/router';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import {PageConfigAddComponent} from '../template-manage/page-config-add.component';
import {PageConfigCopyComponent} from '../template-manage/page-config-copy.component';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import { pageType } from '../../../global-constant';

@Component({
  selector: 'app-page-config',
  templateUrl: './page-config.component.html',
  styleUrls: ['./page-config.component.scss']
})
export class PageConfigComponent implements OnInit, OnDestroy {
  options = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
    total: 0
  };
  parameter = {
    productPageId: '', // 页面编码
    productPageName: '', // 页面名称
    itemType: '', // 项目类别
    itemCode: '', // 项目编码(多选)
    provinceCode: '', // 项目省份编码(多选)
    cityCode: '', // 项目地市编码(多选)
    productType: '', // 产品模式
    productCode: '', // 产品类别
    versionNum: '', // 产品版本
    pageType: '-1' // 页面类型
  };
  TemplateAddModal: any;
  getAllProjectmyList = []; // 下拉项目列表
  getAllProvinceList = [];  // 下拉省份列表
  getAllProductTypeList = []; // 下拉产品类别列表
  getAllVersionList = []; // 下拉版本列表
  pageTypeData = pageType;
  dataList = []; // 返回数据列表
  delflag: any = false;

  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.appService.titleEventEmitter.emit('产品页面配置');
  }
  ngOnInit() {
    this.getAllProject();
    this.getAllProvince();
    this.productTypechange();
    this.getList();
    this.showkey();
  }
  getList() {
    const that = this;
    const param = {
      page: this.options.page,
      rows: this.options.rows,
      productPageId: this.parameter.productPageId,
      productPageName: this.parameter.productPageName,
      itemType: this.parameter.itemType,
      itemCode: this.parameter.itemCode,
      provinceCode: this.parameter.provinceCode,
      cityCode: this.parameter.cityCode,
      productType: this.parameter.productType,
      productCode: this.parameter.productCode,
      versionNum: this.parameter.versionNum,
      pageType: this.parameter.pageType
    };
    this.pageBusinessService.getProductPageConfigList(param, function(data){
      if (data.success) {
         that.dataList = data.obj.data;
          that.options.total = data.obj.total;
          that.options.pageCount = Math.ceil(data.obj.total / that.options.rows) * that.options.rows;
      }
    });
  }
  save(data) {
    const that = this;
    this.TemplateAddModal = this.ngbModalService.open(PageConfigAddComponent, {size: 'lg'});
    this.TemplateAddModal.componentInstance.modalData = data;
    this.TemplateAddModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  detail(data) {
    this.router.navigate(['/app/page/configTemplate'], {
      queryParams: {
        type: data.stencilId,
        productPageId: data.productPageId,
      }
    });
  }
  del(data) {
    const that = this;
    const param = {productPageId: data.productPageId};
    this.pageBusinessService.deleteProductPageInfo(param, function(res){
      if (res.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000);
        that.toastService.toast(toastCfg);
        that.getList();
      }
    });
  }
  copy(data) {
    const that = this;
    this.TemplateAddModal = this.ngbModalService.open(PageConfigCopyComponent, {size: 'lg'});
    this.TemplateAddModal.componentInstance.modelData = data;
    this.TemplateAddModal.result.then((result) => {
      that.getList();
    }, (reason) => {
      that.getList();
    });
  }
  clear() {
    this.parameter = {
      productPageId: '', // 页面编码
      productPageName: '', // 页面名称
      itemType: '', // 项目类别
      itemCode: '', // 项目编码(多选)
      provinceCode: '', // 项目省份编码(多选)
      cityCode: '', // 项目地市编码(多选)
      productType: '', // 产品模式
      productCode: '', // 产品类别
      versionNum: '', // 产品版本
      pageType: '-1' // 页面类型
    };
    this.options.page = 1;
    this.getAllProject();
    this.getAllProvince();
    this.productTypechange();
    this.getList();
  }
  checkTr(index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].checkState) {
          this.dataList[index].checkState = false;
        } else {
          this.dataList[index].checkState = true;
        }
      }
    });
  }
  expends(index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].isExpend) {
          this.dataList[index].isExpend = false;
        } else {
          this.dataList[index].isExpend = true;
        }
      }
    });
  }
  getAllVersionchange() {
    const that = this;
    this.parameter.versionNum = '';
    let param;
    if (this.parameter.productCode === '') {
      param = {};
    } else {
      param = {sProductCode: this.parameter.productCode};
    }
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
  productTypechange() {
    const that = this;
    this.parameter.productCode = '';
    let param;
    if (this.parameter.productType === '-1') {
      param = {};
    } else {
      param = {productType: this.parameter.productType};
    }
    this.pageBusinessService.getAllProductInfoListByProductType(param, function(data){
      if (data.success) {
        that.getAllProductTypeList = data.obj;
        that.getAllVersionchange();
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
  getAllProject() {
    const that = this;
    const param = {itemType: this.parameter.itemType };
    this.pageBusinessService.getAllProject(param, function(data){
      if (data.success) {
        that.getAllProjectmyList = [];
        if (data.obj != null) {
          data.obj.forEach( i => {
            that.getAllProjectmyList.push({id: i.sProjectCode, name: i.sProject});
          });
        }
      }
    });
  }
  getItemList(child) { // 获取项目编码（多选）
    this.parameter.itemCode = child.toString();
  }
  getProvinceList(child) { // 获取项目省份编码（多选）
    this.parameter.provinceCode = child.toString();
  }
  getVersion(child) { // 获取版本id
    this.parameter.versionNum = child.toString();
  }
  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }
  search() {
    this.options.page = 1;
    this.getList();
  }
  showkey() {
    const that = this;
    document.onkeydown = function (e){
      let key;
      key = e.which;
      if (key === 119) {
        that.delflag = !that.delflag;
      }
    };
  }
  ngOnDestroy() {
  }
}
