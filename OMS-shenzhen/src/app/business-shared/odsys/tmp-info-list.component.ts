import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { TmpInfoSaveComponent } from './tmp-info-save.component';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

import { carrierAttr } from '../../global-constant';

@Component({
  selector: 'c-tmp-info-list',
  templateUrl: './tmp-info-list.component.html',
  styleUrls: ['./tmp-info-list.component.scss']
})
export class TmpInfoListComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  customData: Array<any>= [{type: 0 , name: '否'}, {type: 1 , name: '是'} ];

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
    private odsysBusinessService: OdsysBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("订购模板信息");
  }

  ngOnInit() {
    this.getList();
    this.getProjects();
  }

  ngOnDestroy() {
    if (this.saveInfoModal !== null) {
      this.saveInfoModal.close();
    }
  }

  template: any = '';
  alias: any = '';
  carrier: any = '';
  carrierAttr: Array<any>= carrierAttr;
  projectCode: any = '';
  projects: Array<any>= [];

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      template: this.template,
      alias: this.alias,
      carrier: this.carrier,
      projectCode: this.projectCode,
    };
    this.odsysBusinessService.getTemList(param, function(data){
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
    t.productCode = '';
    t.template = '';
    t.alias = '';
    t.carrier = '';
    t.projectCode = '';
    t.getList();
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  getProjects() {
    let that = this;
    this.odsysBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  saveInfoModal: any = null;
  save(id) {
    let that = this;
    this.saveInfoModal = this.ngbModalService.open(TmpInfoSaveComponent, {size: 'lg'});
    if (id) {
      this.saveInfoModal.componentInstance.paramModal = id;
    }
    this.saveInfoModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    let param: any = {};
    if (id !== '') {
      param.ids = id;
    } else {
      param.ids = this.getIds();
    }
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.odsysBusinessService.delTmpInfo (param, function(data){
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
        ids.push(i.id);
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
