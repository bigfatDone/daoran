import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { RuleSaveComponent } from './rule-save.component';

import { OrderBusinessService } from '../../business-service/order/order-business.service';
import { ProgramBusinessService } from '../../business-service/program/program-business.service';

import { orderRuleStrategy, orderRuleWeek, orderRuleState } from "../../global-constant"
import {ConfigSaveComponent} from './config-save.component';

@Component({
  selector: 'c-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  // sourceData: Array<any> = [ {type: '3', name: '活动'}, {type: '4', name: '专辑'}];
  sourceData: Array<any>= [{id: '0', name: '产品GO'}, {id: '1', name: '播放GO'}, {id: '2', name: '访问GO'}, {id: '3', name: '活动GO'}, {id: '4', name: '专辑GO'}, {id: '10', name: '全部'}];

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
    private toastService: ToastService,
    private ngbModalService: NgbModal,
    private orderBusinessService: OrderBusinessService,
    private programBusinessService: ProgramBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("订购模板风格配置");
  }

  ngOnInit() {
    this.getList();
    this.getSelectNodePoints();
    this.getAllProduct();
    this.getProvinces();
  }

  ngOnDestroy() {
    if (this.saveRuleModal !== null) {
      this.saveRuleModal.close();
    }
  }

  nodeCode: any = "";
  nodeCodes: Array<any>= [];
  productCode: any = "";
  productCodes: Array<any>= [];
  sProvinceCode: any = "";
  sProvinceCodes: Array<any>= [];
  sources: any = "";
  strategys: Array<any>= orderRuleStrategy;
  week: any = "";
  weeks: Array<any>= orderRuleWeek;
  state: any = "";
  states: Array<any>= orderRuleState;


  search() {
    this.options.page = 1;
    this.getList();
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      itemCode: this.nodeCode,
      projectCode: this.productCode,
      provinceCode: this.sProvinceCode,
      sources: this.sources,
      weeks: this.week
    }
    this.orderBusinessService.templateStyleList(param, function(data){
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
    t.sProvinceCode = '';
    t.sources = '';
    t.week = '';
    t.getList();
  }

  getSelectNodePoints() {
    let that = this;
    this.orderBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }

  getAllProduct() {
    let that = this;
    this.orderBusinessService.getAllProductAuth(function(data){
      if (data.length > 0) {
        that.productCodes = data;
      } else {
        that.productCodes = [];
      }
    });
  }

  getProvinces() {
    let that = this;
    this.orderBusinessService.getProvincesAuth(function(data){
      if (data.length > 0) {
        that.sProvinceCodes = data;
      } else {
        that.sProvinceCodes = [];
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

  saveRuleModal: any = null;
  save(data) {
    let that = this;
    this.saveRuleModal = this.ngbModalService.open(ConfigSaveComponent);
    this.saveRuleModal.componentInstance.modalData = data;
    this.saveRuleModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  updateStatus(status) {
    let that = this;
    let param = {
      ids: this.getCheckedIds(),
      isEnable: status
    };
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    let txt = status === 0 ? "暂停" : "启用";
    const confirmCfg = new ConfirmConfig('是否确认' + txt + '？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.orderBusinessService.isEnable(param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', txt + '成功！', 2000));
      });
    }, (reason) => {
    });
  }

  getCheckedIds() {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.id);
      }
    });
    return ids.toString();
  }

  delete(id) {
    let that = this;
    let param = {ids : ''};
    if (id !== '') {
      param.ids = id;
    }else {
      param.ids = this.getCheckedIds();
    }
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.orderBusinessService.delTemplateStyle(param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }


}
