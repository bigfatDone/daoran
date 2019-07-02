import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { carrierAttr } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';
import {RelateSaveComponent} from './relate-save.component';

@Component({
  selector: 'c-relate-list',
  templateUrl: './relate-list.component.html',
})
export class RelateListComponent implements OnInit, OnDestroy {
  model: NgbDateStruct;

  dataList: Array<any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  beDate: any = '';
  enDate: any = '';
  itemCode: any = "";
  carrierAttr: Array<any>= carrierAttr;
  actCode: any = "";
  projects: Array<any>= [];
  actName: any = "";
  provinces: Array<any>= [];
  provinceCode: any = "";
  productCode: any = "";
  products: Array<any>= [];

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private activeBusinessService: ActiveBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("活动产品关联信息");
  }

  ngOnInit() {
    this.getList();
    this.getItemList();
    // this.getProducts();
    this.getProvinces();
  }

  ngOnDestroy() {
    if (this.activeSaveModal !== null) {
      this.activeSaveModal.close();
    }
  }

  getItemList() {
    let that = this;
    let param = {};
    this.activeBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }
  getList() {
    let that = this;
    if (typeof(this.beDate) ==="object" && this.beDate !=="" && this.beDate !== null ) {
      this.beDate = this.beDate.year + "-" + this.beDate.month + "-" + this.beDate.day;
    } else {
      this.beDate = "";
    }
    if (typeof(this.enDate) ==="object" && this.enDate !=="" && this.enDate !== null ) {
      this.enDate = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
    } else {
      this.enDate = "";
    }
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      itemCode: this.itemCode,
      actCode: this.actCode,
      relationProvinceCodes : this.provinceCode,
    }
    this.activeBusinessService.relationList(param, function(data){
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
    t.itemCode = '';
    t.actCode = '';
    t.provinceCode = '';
    t.options.page = 1;
    t.getList();
  }

  getProjects() {
    let that = this;
    // this.activeBusinessService.getProjects(function(data){
    //   if (data.length > 0) {
    //     that.projects = data;
    //   } else {
    //     that.projects = [];
    //   }
    // });
  }

  getProducts() {
    let that = this;
    // this.activeBusinessService.getProducts({}, function(data){
    //   if (data.length > 0) {
    //     that.products = data;
    //   } else {
    //     that.products = [];
    //   }
    // });
  }

  getProvinces() {
    let that = this;
    let param = {};
    this.activeBusinessService.getProvinces(param, function(data){
      if (data.length > 0) {
        that.provinces = data;
      } else {
        that.provinces = [];
      }
    });
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  activeSaveModal: any = null;
  save(id) {
    let that = this;
    this.activeSaveModal = this.ngbModalService.open(RelateSaveComponent, {size: 'lg'});
    if (id) {
      this.activeSaveModal.componentInstance.modalData = id;
    }
    this.activeSaveModal.result.then((result) => {
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
      that.activeBusinessService.relationDel (param, function(data){
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
