import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { OttoperateBusinessService } from '../../business-service/ottoperate/ottoperate-business.service';
import {terminalType, startFlag} from '../../global-constant';
import { OperateSaveComponent } from './operate-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {VerapkSaveComponent} from './verapk-save.component';
// import {BannerImgshowComponent} from './banner-imgshow.component';

@Component({
  selector: 'c-version-list',
  templateUrl: './operate-list.component.html',
  styleUrls: ['./operate-list.component.scss']
})
export class OperateListComponent implements OnInit, OnDestroy {

  dataList:Array<any>= [];

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }
  // onPageChanged($event) {
  //   let curPage = $event.type;
  //   if ( typeof $event.type != "number" ) {
  //     curPage = 1;
  //   }
  // }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private ottoperateBusinessService: OttoperateBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("OTT广告管理");
  }

  optPositonData: Array<any> = [{type: 1, value: '启动页'}, {type: 2, value: '首页'}];
  types: any = terminalType;
  type: any = "";
  states: any = startFlag;
  state: any = "";
  name: any = "";


  optName: any = "";
  itemCode: any = "";
  projectCode: any = "";
  optPositon: any = "";
  ngOnInit() {
    this.getList();
    this.getOTTItem();
    this.getOTTProduct();
  }
  ngOnDestroy() {
    if (this.bannerSaveModal !== null ) {
      this.bannerSaveModal.close();
    } else if (this.bannerOpenImg !== null ) {
      this.bannerOpenImg.close();
    }
  }

  getpro() {
    this.projectCode = '';
    this.ottProData = [];
    this.getOTTProduct();
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
      optName: this.optName,
      itemCode: this.itemCode,
      projectCode: this.projectCode,
      optPositon: this.optPositon,
    }
    this.ottoperateBusinessService.listPagePopup(param, function(data){
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
  ottItemData: Array<any> = [];
  getOTTItem() {
    let that = this;
    let param = {};
    this.ottoperateBusinessService.getOTTItem(param, function(data){
      if (data.obj.length > 0) {
        that.ottItemData = data.obj;
      } else {
        that.ottItemData = [];
      }
    });
  }
  ottProData: Array<any> = [];
  getOTTProduct() {
    let that = this;
    let param = {};
    this.ottoperateBusinessService.getOTTProduct(param, function(data){
      if (data.obj.length > 0) {
        that.ottProData = data.obj;
      } else {
        that.ottProData = [];
      }
    });
  }

  clear () {
    this.optName = '';
    this.itemCode = '';
    this.projectCode = '';
    this.optPositon = '';
    this.options.page = 1;
    this.getList();
  }

  bannerSaveModal: any = null;
  save(data) {
    let that = this;
    this.bannerSaveModal = this.ngbModalService.open(OperateSaveComponent, {size: 'sm'});
    this.bannerSaveModal.componentInstance.modalData = data;
    this.bannerSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  bannerOpenImg: any = null;

  getCheckedIds() {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.id);
      }
    });
    return ids.toString();
  }

  del(id) {
    let that = this;
    let param = {
      id: id
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.ottoperateBusinessService.delPagePopup (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
      that.getList();
    });
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

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  // updateStatus(status) {
  //   let that = this;
  //   let param = {
  //     ids: this.getCheckedIds(),
  //     state: status
  //   };
  //   if (param.ids === '') {
  //     const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
  //     that.toastService.toast(toastCfg);
  //     return;
  //   }
  //   let txt = status === 0 ? "暂停" : "启用";
  //   const confirmCfg = new ConfirmConfig('是否确认' + txt + '？');
  //   this.modalService.confirm(confirmCfg).then((result) => {
  //     this.ottoperateBusinessService.updataBannerPost(param, function(data){
  //       that.getList();
  //       that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', txt + '成功！', 2000));
  //     });
  //   }, (reason) => {
  //   });
  // }

}
