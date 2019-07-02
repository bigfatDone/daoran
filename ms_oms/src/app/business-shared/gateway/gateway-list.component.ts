import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { GatewaySaveComponent } from './gateway-save.component';
import { GatewayBusinessService } from '../../business-service/gateway/gateway-business.service';

import { gwTaskStates } from '../../global-constant';

@Component({
  selector: 'c-gateway-list',
  templateUrl: './gateway-list.component.html'
})
export class GatewayListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private gatewayBusinessService: GatewayBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("网关任务");
  }


  ngOnInit() {
    this.getPointList();
    this.getList();
  }

  ngOnDestroy() {
    if (this.gwSaveModal !== null) {
      this.gwSaveModal.close();
    }
  }

  taskId: any;
  pointName: any = "";
  pointNames: Array<any>;
  state: any = "";
  taskStates: Array<any>= gwTaskStates;

  getPointList() {
    let that = this;
    this.gatewayBusinessService.pointListPost(function(data){
      if (data.length > 0) {
        that.pointNames = data;
      } else {
        that.pointNames = [];
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
      taskId: this.taskId,
      nodeCode: this.pointName,
      state: this.state,
    }
    this.gatewayBusinessService.gwListPost(param, function(data){
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
    t.taskId = '';
    t.pointName = '';
    t.state = '';
    t.getList();
  }

  gwSaveModal: any = null;
  save() {
    this.gwSaveModal = this.ngbModalService.open(GatewaySaveComponent);
    this.gwSaveModal.result.then((result) => {
    }, (reason) => {

    });
  }

  intoRes() {

  }

  del() {
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg);
  }

}
