import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { RoleSaveComponent } from './role-save.component';
import { SafetyBusinessService } from '../../business-service/safety/safety-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

import { orderRuleWeek, timeFrame } from '../../global-constant';
import {RolePowerComponent} from './role-power.component';


@Component({
  selector: 'c-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];

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
    this.appService.titleEventEmitter.emit("角色信息管理");
  }


  ngOnInit() {
    this.getList();
    this.getProvinces();
  }

  ngOnDestroy() {
    if (this.saveConfigModal !== null) {
      this.saveConfigModal.close();
    }
  }

  roleName: any = "";
  templates: Array<any>= [];
  provinceCode: any = "";
  provinces: Array<any>= [];
  weeks: any = "";
  weeksAttr: Array<any>= orderRuleWeek;
  times: any = "";
  timesAttr: Array<any>= timeFrame;

  getProvinces() {
    let that = this;
    this.safetyBusinessService.getProvinces(function(data){
      if (data.length > 0) {
        that.provinces = data;
      } else {
        that.provinces = [];
      }
    });
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      roleName: this.roleName
    };
    this.safetyBusinessService.getRoleList(param, function(data){
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
    t.roleName = '';
    t.getList();
  }

  getAllProduct() {
    let that = this;
    // this.safetyBusinessService.getAllProduct(function(data){
    //   if (data.length > 0) {
    //     that.productCodes = data;
    //   } else {
    //     that.productCodes = [];
    //   }
    // });
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  saveConfigModal: any = null;
  save(id) {
    let that = this;
    this.saveConfigModal = this.ngbModalService.open(RoleSaveComponent, {size: 'lg'});
    if (id) {
      this.saveConfigModal.componentInstance.paramModal = id;
    }
    this.saveConfigModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  showPower(id) {
    let that = this;
    this.saveConfigModal = this.ngbModalService.open(RolePowerComponent, {size: 'lg'});
    if (id) {
      this.saveConfigModal.componentInstance.paramModal = id;
    }
    this.saveConfigModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    let param: any = {};
    if (id !== '') {
      param.roleIds = id;
    } else {
      param.roleIds = this.getIds();
    }
    if (param.roleIds === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      let param: any = {};
      if (id !== '') {
        param.roleIds = id;
      } else {
        param.roleIds = this.getIds();
      }
      that.safetyBusinessService.delRoleInfo (param, function(data){
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
        ids.push(i.roleId);
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
