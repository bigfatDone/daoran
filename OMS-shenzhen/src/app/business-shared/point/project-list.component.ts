import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { ProjectSaveComponent } from './project-save.component';

import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-project-list',
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];
  projectTypeData:Array<any>= [{type: '0', name: '非OTT'}, {type: '1', name: 'OTT'}];
  projectType: any = '';

  options: any = {
    rows: 20,
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
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("项目-省份-产品维护");
  }


  ngOnInit() {
    this.getProvinces();
    this.getList();
  }

  ngOnDestroy() {
    if (this.saveProjectModal !== null) {
      this.saveProjectModal.close();
    }
  }

  provincesList: Array<any>= [];
  pProvinces: any = "";
  getProvinces() {
    let that = this;
    this.orderBusinessService.getProvinces(function(data){
      if (data.length > 0) {
        that.provincesList = data;
      } else {
        that.provincesList = [];
      }
    });
  }

  projectName: any= '';
  provinceCode: any= '';
  productNames: any= '';
  getList() {
    let that = this;
    let param = {
      projectName: this.projectName,
      provinceCode: this.provinceCode,
      productNames: this.productNames,
      projectType: this.projectType,
      page: this.options.page,
      rows: this.options.rows,
    }
    this.orderBusinessService.listProjectProvinceProduce(param, function(data){
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

  search() {
    this.options.page = 1;
    this.getList();
  }
  clear() {
    this.projectName = '';
    this.provinceCode = '';
    this.productNames = '';
    this.projectType = '';
    this.options.page = 1;
    this.getList();
  }

  saveProjectModal: any = null;
  save(id) {
    let that = this;
    this.saveProjectModal = this.ngbModalService.open(ProjectSaveComponent);
    this.saveProjectModal.componentInstance.modalData = id;
    this.saveProjectModal.result.then((result) => {
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

}
