import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';


import { OrderBusinessService } from '../../business-service/order/order-business.service';
import { areaType } from '../../global-constant';
import {RelateSaveComponent} from '../point/relate-save.component';
import {PageEditComponent} from '../page/page-edit.component';

@Component({
  selector: 'c-relate-list',
  templateUrl: './relate-list.component.html',
})
export class RelateListComponent implements OnInit, OnDestroy {

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
  area: any = "";
  areas: Array<any>= areaType;

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("关联管理");
  }


  ngOnInit() {
    this.getList();
    this.getSelectNodePoints();
    this.getAllProduct();
  }
  ngOnDestroy() {
    if (this.relarteSaveModal !== null ) {
      this.relarteSaveModal.close();
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
    this.orderBusinessService.relateListPost(param, function(data){
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

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    return this.dataList.every(_ => _.checkState);
  }
  relarteSaveModal: any = null;
  save(data) {
    let that = this;
    this.relarteSaveModal = this.ngbModalService.open(RelateSaveComponent, {size: 'lg'});
    if (data) {
      this.relarteSaveModal.componentInstance.relateData = data;
    }
    this.relarteSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  del() {
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg);
  }

}
