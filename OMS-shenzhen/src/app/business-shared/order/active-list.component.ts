import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { WebsiteBusinessService } from '../../business-service/website/website-business.service';
import {terminalType, startFlag} from '../../global-constant';
import { ActiveSaveComponent } from './active-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
// import {BannerImgshowComponent} from './banner-imgshow.component';

@Component({
  selector: 'c-active-list',
  templateUrl: './active-list.component.html',
  styleUrls: ['./active-list.component.scss']
})
export class ActiveListComponent implements OnInit, OnDestroy {

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
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("活动管理");
  }


  types: any = terminalType;
  type: any = "";
  states: any = startFlag;
  code: any = "";
  name: any = "";
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    if (this.activeSaveModal !== null ) {
      this.activeSaveModal.close();
    }
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
      code: this.code,
      name: this.name,
    }
    this.orderBusinessService.getCodeList(param, function(data){
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
    t.code = '';
    t.name = '';
    t.getList();
  }

  activeSaveModal: any = null;
  save(data) {
    let that = this;
    this.activeSaveModal = this.ngbModalService.open(ActiveSaveComponent, {size: 'lg'});
    this.activeSaveModal.componentInstance.activeData = data;
    this.activeSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
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

  // del(id) {
  //   let that = this;
  //   let param = {
  //     ids: id
  //   };
  //   // if (param.ids === '') {
  //   //   const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
  //   //   that.toastService.toast(toastCfg);
  //   //   return;
  //   // }
  //   const confirmCfg = new ConfirmConfig('是否确认删除？');
  //   this.modalService.confirm(confirmCfg).then((result) => {
  //     that.orderBusinessService.delGoCode (param, function(data){
  //       that.getList();
  //       that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
  //     });
  //   }, (reason) => {
  //     that.getList();
  //   });
  // }

  getIds () {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.code);
      }
    });
    return ids.toString();
  }

  del(id) {
    let that = this;
    let param: any = {};
    if (id !== '') {
      param.codes = id;
    } else {
      param.codes = this.getIds();
    }
    if (param.codes === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.orderBusinessService.delGoCode (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
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

}
