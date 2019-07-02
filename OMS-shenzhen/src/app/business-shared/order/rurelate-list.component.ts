import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { RuleSaveComponent } from './rule-save.component';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import {RurelateSaveComponent} from './rurelate-save.component';

@Component({
  selector: 'c-rurelate-list',
  templateUrl: './rurelate-list.component.html',
})
export class RurelateListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  nodeCode: any = "";
  nodeCodes: Array<any>= [];
  productCode: any = "";
  productCodes: Array<any>= [];
  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("规则关联管理");
  }


  ngOnInit() {
    this.getList();
    this.getSelectNodePoints();
    this.getAllProduct();
  }
  ngOnDestroy() {
    if (this.rurelateSaveModal !== null) {
      this.rurelateSaveModal.close();
    }
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      sNodeCode: this.nodeCode,
      sProjectCode: this.productCode,
    }
    this.orderBusinessService.rurelateListPost(param, function(data){
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
    t.nodeCode = '';
    t.productCode = '';
    t.getList();
  }

  rurelateSaveModal: any = null;
  save(data) {
    let that = this;
    this.rurelateSaveModal = this.ngbModalService.open(RurelateSaveComponent, {size: 'lg'});
    this.rurelateSaveModal.componentInstance.modalData = data;
    this.rurelateSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoRes() {

  }

  del() {
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg);
  }

  getSelectNodePoints() {
    let that = this;
    this.orderBusinessService.getNodeDetail(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
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

}
