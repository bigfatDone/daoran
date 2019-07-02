import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { ObjverSaveComponent } from './objver-save.component';

import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-objver-list',
  templateUrl: './objver-list.component.html',
})
export class ObjverListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];

  options: any = {
    rows: 10000,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private entryBusinessService: EntryBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("对象-版本管理");
  }


  ngOnInit() {
    this.getList();
    this.getObjsData();
  }

  ngOnDestroy(){
    if(this.saveProductModal !== null) {
      this.saveProductModal.close();
    }
  }

  sProductCode: any = "";
  sProductCodes: Array<any>= [];
  getObjsData () {
    let that = this;
    this.entryBusinessService.getProductAreaListPost({} , function(data){
      if (data.length) {
        that.sProductCodes = data;
      } else {
        that.sProductCodes = [];
      }
    });
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      sProductName: this.sProductCode,
    }
    this.entryBusinessService.getProductListNewPost(param, function(data){
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
    t.sProductCode = '';
    t.getList();
  }

  saveProductModal: any = null;
  save(id) {
    let that = this;
    this.saveProductModal = this.ngbModalService.open(ObjverSaveComponent);
    this.saveProductModal.componentInstance.modalData = id;
    this.saveProductModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoRes() {

  }

  delete(id) {
    let exitSysCfg = new ConfirmConfig('确认删除该条数据？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      if (result.status === "approved") {
        let that = this;
        let param = {productSCode: id};
        this.entryBusinessService.delProduct(param, function(data){
          that.getList();
        });
      }
    }, (reason) => {
    });
  }

}
