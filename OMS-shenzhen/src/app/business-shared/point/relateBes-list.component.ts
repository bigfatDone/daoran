import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';


import { OrderBusinessService } from '../../business-service/order/order-business.service';
import { areaType } from '../../global-constant';
import {RelateSaveComponent} from '../point/relate-save.component';
import {PageEditComponent} from '../page/page-edit.component';
import {RelateBesSaveComponent} from './relateBes-save.component';

@Component({
  selector: 'c-relateBes-list',
  templateUrl: './relateBes-list.component.html',
})
export class RelateBesListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  projectName: any = "";
  nodeName: any = "";

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("全局项目-节点关系管理");
  }


  ngOnInit() {
    this.getList();
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
      projectName: this.projectName,
      nodeName: this.nodeName,
    }
    this.orderBusinessService.proNodeList(param, function(data){
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
    t.projectName = '';
    t.nodeName = '';
    t.getList();
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
    this.relarteSaveModal = this.ngbModalService.open(RelateBesSaveComponent, {size: 'lg'});
    if (data) {
      this.relarteSaveModal.componentInstance.relateData = data;
    }
    this.relarteSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

}
