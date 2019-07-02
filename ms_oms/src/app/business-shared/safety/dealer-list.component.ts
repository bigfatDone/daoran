import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { DealerSaveComponent } from './dealer-save.component';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

import { carrierAttr } from '../../global-constant';
import {SafetyBusinessService} from '../../business-service/safety/safety-business.service';
import {DealerRoleComponent} from './dealer-role.component';
import {DealerIpComponent} from './dealer-ip.component';

@Component({
  selector: 'c-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.scss']
})
export class DealerListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  productCode: any = "";
  productCodes: Array<any>= [];
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
    this.appService.titleEventEmitter.emit("服务提供商信息管理");
  }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    if (this.saveDealerModal !== null) {
      this.saveDealerModal.close();
    }
  }

  spId: any = '';
  spName: any = '';
  carrier: any = '';
  carrierAttr: Array<any>= carrierAttr;
  projectCode: any = '';
  projects: Array<any>= [];

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      spId: this.spId,
      spName: this.spName,
    };
    this.safetyBusinessService.getDealerList(param, function(data){
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
    t.spId = '';
    t.spName = '';
    t.options.page = 1;
    t.getList();
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  // getProjects() {
  //   let that = this;
  //   this.safetyBusinessService.getProjects(function(data){
  //     if (data.length > 0) {
  //       that.projects = data;
  //     } else {
  //       that.projects = [];
  //     }
  //   });
  // }

  saveDealerModal: any = null;
  save(id) {
    let that = this;
    this.saveDealerModal = this.ngbModalService.open(DealerSaveComponent, {size: 'lg'});
    if (id) {
      this.saveDealerModal.componentInstance.paramModal = id;
    }
    this.saveDealerModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  toRole(id) {
    let that = this;
    this.saveDealerModal = this.ngbModalService.open(DealerRoleComponent, {size: 'lg'});
    if (id) {
      this.saveDealerModal.componentInstance.paramModal = id;
    }
    this.saveDealerModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  toIp(id) {
    let that = this;
    this.saveDealerModal = this.ngbModalService.open(DealerIpComponent, {size: 'lg'});
    if (id) {
      this.saveDealerModal.componentInstance.paramModal = id;
    }
    this.saveDealerModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    let param: any = {};
    if (id !== '') {
      param.spIds = id;
    } else {
      param.spIds = this.getIds();
    }
    if (param.spIds === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.safetyBusinessService.delSp (param, function(data){
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
        ids.push(i.spId);
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
