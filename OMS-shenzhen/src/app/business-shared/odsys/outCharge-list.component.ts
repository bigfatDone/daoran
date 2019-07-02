import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { OutChargeSaveComponent } from './outCharge-save.component';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

import { carrierAttr } from '../../global-constant';

@Component({
  selector: 'c-outCharge-list',
  templateUrl: './outCharge-list.component.html',
  styleUrls: ['./outCharge-list.component.scss']
})
export class OutChargeListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  devPlatformData: Array<any> = [{type: 0, value: '通用'}, {type: 1, value: 'Linux'}, {type: 2, value: 'Android'}];
  devPlatform: any = "";
  carrierAttr: Array<any>= carrierAttr;
  projectCode: any = "";
  projects: Array<any>= [];
  provinceCode: any = "";
  provinces: Array<any>= [];
  productCode: any = "";
  products: Array<any>= [];

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private odsysBusinessService: OdsysBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("外部计费产品配置");
  }

  ngOnInit() {
    this.getList();
    this.getNode();
    this.getAllProject();
    // this.getProjects();
    // this.getProducts();
    // this.getProvinces();
  }

  ngOnDestroy() {
    if (this.codeSaveModal !== null) {
      this.codeSaveModal.close();
    }
  }

  nodeCodes: Array<any> = [];
  nodeCode: any = '';
  getNode() {
    let that = this;
    this.odsysBusinessService.getNodeDetail(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }
  itemData: Array<any> = [];
  itemCode: any = '';
  getAllProject() {
    let that = this;
    this.odsysBusinessService.getAllProject(function(data){
      console.log(data)
      if (data.data.length > 0) {
        that.itemData = data.data;
      } else {
        that.itemData = [];
      }
    });
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      devPlatform: this.devPlatform,
      itemCode:    this.itemCode,
      nodeCode:    this.nodeCode,
      productCode: this.productCode,
    }
    this.odsysBusinessService.ttpProductList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    this.devPlatform = '';
    this.itemCode = '';
    this.nodeCode = '';
    this.productCode = '';
    this.options.page = 1;
    this.getList();
  }

  getProjects() {
    let that = this;
    this.odsysBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  getProducts() {
    let that = this;
    this.odsysBusinessService.getProducts({}, function(data){
      if (data.length > 0) {
        that.products = data;
      } else {
        that.products = [];
      }
    });
  }

  getProvinces() {
    let that = this;
    this.odsysBusinessService.getProvinces(function(data){
      if (data.length > 0) {
        that.provinces = data;
      } else {
        that.provinces = [];
      }
    });
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  codeSaveModal: any = null;
  save(id) {
    let that = this;
    this.codeSaveModal = this.ngbModalService.open(OutChargeSaveComponent, {size: 'lg'});
    this.codeSaveModal.componentInstance.paramModal = id;
    this.codeSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    let param: any = [];
    if (id !== '') {
      param.push({
        nodeCode: id.nodeCode,
        productCode: id.productCode
      });
    } else {
      param = this.getIds();
    }
    if (param.length === 0) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.odsysBusinessService.ttpProductDel ({listStr: JSON.stringify(param)}, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }

  getIds () {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push({
          nodeCode: i.nodeCode,
          productCode: i.productCode
        });
      }
    });
    return ids;
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
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
      // else {
      //   this.dataList[ind].checkState = false;
      // }
    });
  }

  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

}
