import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import {OderRelationshipInfo} from './order-relationship-info.component';
import { ConfirmConfig } from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

@Component({
  selector: 'c-order-relationship',
  templateUrl: './order-relationship.component.html',
  styleUrls: ['./order-relationship.component.scss']})
export class OrderRelationshipComponent implements OnInit {
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  taskType = '';
  taskStatus = '';
  nodeCode = '';
  nodeCodes = [];
  dataList = [];
  taskId = '';
  relarteSaveModal: any;
  createBeginTime = '';
  createEndTime = '';
  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private odsysBusinessService: OdsysBusinessService) {
    this.appService.titleEventEmitter.emit('订购关系');
  }
  ngOnInit() {
    this.getNode();
    this.search();
  }
  getNode() {
    const that = this;
    this.odsysBusinessService.getNodeDetail(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }
  getList() {
    const that = this;
    const param = {
      page: this.options.page,
      rows: this.options.rows,
      taskType : this.taskType,
      taskStatus : this.taskStatus,
      nodeCode : this.nodeCode,
      taskId : this.taskId,
      createBeginTime: this.createBeginTime,
      createEndTime: this.createEndTime
    };
    this.odsysBusinessService.getTaskInfoList(param, function(data){
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
  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }
  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }
  AddOrSave(data) {
    const that = this;
    this.relarteSaveModal = this.ngbModalService.open(OderRelationshipInfo, { size: 'lg' });
    if (data) {
      this.relarteSaveModal.componentInstance.modalData = data;
    }
    this.relarteSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }
  clear() {
    this.options = {
      rows: 20,
      page: 1,     // 当前页
      pageCount: 0, // 页码数量
    };
    this.taskType = '';
    this.taskStatus = '';
    this.nodeCode = '';
    this.dataList = [];
    this.taskId = '';
    this.createBeginTime = '';
    this.createEndTime = '';
    this.search();
  }
  delSingle(id) {
    const that = this;
    const param = {taskId: id};
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.odsysBusinessService.delTaskInfo (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }
  delALL() {
    const that = this;
    const delArr = [];
    this.dataList.forEach(x => {
      if (x.checkState) {
        delArr.push(x.taskId);
      }
    });
    const param = {taskId: delArr.join()};
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.odsysBusinessService.delTaskInfo(param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }

}
