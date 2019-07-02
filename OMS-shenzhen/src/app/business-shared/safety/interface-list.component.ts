import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { InterfaceSaveComponent } from './interface-save.component';
import { SafetyBusinessService } from '../../business-service/safety/safety-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

import {apiPlatform, carrierAttr} from '../../global-constant';

@Component({
  selector: 'c-interface-list',
  templateUrl: './interface-list.component.html',
  styleUrls: ['./interface-list.component.scss']
})
export class InterfaceListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  apiPlatforms: Array<any> = apiPlatform;
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private safetyBusinessService: SafetyBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("接口信息管理");
  }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    if (this.codeSaveModal !== null) {
      this.codeSaveModal.close();
    }
  }
  apiName: any = "";
  apiPlatform: any = "";
  initNum: Number = 0;
  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      apiPlatform: this.apiPlatform,
      apiName: this.apiName,
    }
    this.safetyBusinessService.getApiList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
        that.initNum = (that.options.page - 1) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.apiPlatform = '';
    t.apiName = '';
    t.getList();
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  codeSaveModal: any = null;
  save(id) {
    let that = this;
    this.codeSaveModal = this.ngbModalService.open(InterfaceSaveComponent, {size: 'lg'});
      this.codeSaveModal.componentInstance.paramModal = id;
    this.codeSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    let param: any = {};
    if (id !== '') {
      param.apiCodes = id;
    } else {
      param.apiCodes = this.getIds();
    }
    if (param.apiCodes === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.safetyBusinessService.delApiInfo (param, function(data){
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
        ids.push(i.apiCode);
      }
    });
    return ids.toString();
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
