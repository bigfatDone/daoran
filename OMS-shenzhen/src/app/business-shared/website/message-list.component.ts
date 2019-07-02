import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { WebsiteBusinessService } from '../../business-service/website/website-business.service';
import {readFlag} from '../../global-constant';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {MessageSeeComponent} from './message-see.component';

@Component({
  selector: 'c-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, OnDestroy {

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
    private websiteBusinessService: WebsiteBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("留言管理");
  }


  // types: any = articleType;
  // type: any = "";
  states: any = readFlag;
  state: any = "";
  title: any = "";
  phone: any = "";
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    if (this.messageSeeModal !== null ) {
      this.messageSeeModal.close();
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
      title: this.title,
      phone: this.phone,
      state: this.state,
    }
    this.websiteBusinessService.messageListPost(param, function(data){
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
    t.title = '';
    t.phone = '';
    t.state = '';
    t.getList();
  }

  intoRes() {

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

  getCheckedIds() {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.id);
      }
    });
    return ids.toString();
  }

  del() {
    let that = this;
    let param = {
      ids: this.getCheckedIds()
    };
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.websiteBusinessService.delMessagePost (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }

  updateStatus(status) {
    let that = this;
    let param = {
      ids: this.getCheckedIds(),
      state: status
    };
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    let txt = status === 0 ? "未读" : "已读";
    const confirmCfg = new ConfirmConfig('是否标为' + txt + '？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.websiteBusinessService.updataMessagePost(param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', txt + '成功！', 2000));
      });
    }, (reason) => {
    });
  }
  messageSeeModal: any = null;
  seeMessage(data) {
    let that = this;
    this.messageSeeModal = this.ngbModalService.open(MessageSeeComponent, {size: 'lg'});
    if (data) {
      this.messageSeeModal.componentInstance.messageData = data;
    }
    this.messageSeeModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

}
