import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { ProductSaveComponent } from './product-save.component';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

@Component({
  selector: 'c-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit, OnDestroy {

  dataList:Array<any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  source: any = "";
  sourceData: Array<any> = [{type: 1, value: "内部"}, {type: 0, value: "外部"}];
  productCode: any = "";
  productCodes: Array<any>= [];
  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("全局产品管理");
  }


  ngOnInit() {
    this.getList();
    this.getAllProduct();
  }
  ngOnDestroy() {
    if (this.productSaveModal !== null) {
      this.productSaveModal.close();
    }
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      sProductName: this.productCode,
      source: this.source,
    }
    this.orderBusinessService.productListNewPost(param, function(data){
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
    let t = this;
    t.options.page = 1;
    t.productCode = '';
    t.source = '';
    t.getList();
  }

  getAllProduct() {
    let that = this;
    this.orderBusinessService.getAllProduct(function(data){
      if (data.length > 0) {
        that.productCodes = data;
      } else {
        that.productCodes = [];
      }
    });
  }
  search() {
    this.options.page = 1;
    this.getList();
  }

  productSaveModal: any = null;
  save(data) {
    let that = this;
    this.productSaveModal = this.ngbModalService.open(ProductSaveComponent, {size: 'lg'});
    this.productSaveModal.componentInstance.modalData = data;
    this.productSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoRes() {

  }

  edit() {
    this.ngbModalService.open(ProductSaveComponent, {size: 'lg'}).result.then((result) => {
    }, (reason) => {

    });
  }
  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      let param = {sProductCode: id};
      that.orderBusinessService.delProductNewPost (param, function(data){
        that.getList();
        let msg = data;
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', msg,2000));
      });
    }, (reason) => {
      that.getList();
    });
  }

}
