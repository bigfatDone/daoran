import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { GatewaySaveComponent } from './gateway-save.component';
import { GatewayBusinessService } from '../../business-service/gateway/gateway-business.service';

import { gwTaskStates } from '../../global-constant';
import {SqllogDetailComponent} from './sqllog-detail.component';

@Component({
  selector: 'c-sqllog-list',
  templateUrl: './sqllog-list.component.html'
})
export class SqllogListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  downStatusData: Array<any>= [{type: -1, value: '全部'}, {type: 0, value: '等待下载'}, {type: 1, value: '下载中'}, {type: 2, value: '已下载'}];
  doStatusData: Array<any>= [{type: -1, value: '全部'}, {type: 0, value: '未执行'}, {type: 1, value: '执行成功'}, {type: 2, value: '执行失败'}];
  dataTypeData: Array<any>= [{type: 0, value: 'sql语句'}, {type: 1, value: '图片地址'}];

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
    this.appService.titleEventEmitter.emit("日志统计");
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

  taskId: any = "";
  nodeCode: any = "";
  downStatus: any = -1;
  doStatus: any = -1;
  dataType: any = 0;
  updateDate: any = "";
  selectedDate: any;
  taskStates: Array<any>= gwTaskStates;

  getPointList() {
    let that = this;
    this.gatewayBusinessService.pointListPost(function(data){
      if (data.length > 0) {
        // that.pointNames = data;
      } else {
        // that.pointNames = [];
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
      nodeCode: this.nodeCode,
      downLoadStatus: this.downStatus,
      ExecuteStatus: this.doStatus,
      updataDate: this.updateDate,
      dataType: this.dataType,
    }
    this.gatewayBusinessService.sqllogList(param, function(data){
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
    this.nodeCode = '',
    this.downStatus = -1,
    this.doStatus = -1,
    this.updateDate = '',
    this.dataType = 0,
    t.getList();
  }

  gwSaveModal: any = null;
  save(id) {
    this.gwSaveModal = this.ngbModalService.open(SqllogDetailComponent);
    this.gwSaveModal.componentInstance.modalData = id;
    this.gwSaveModal.result.then((result) => {
    }, (reason) => {
      this.getList();
    });
  }

  intoRes() {

  }

  del() {
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg);
  }

}
