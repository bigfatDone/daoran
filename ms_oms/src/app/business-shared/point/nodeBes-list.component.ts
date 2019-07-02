import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import {articleType, startFlag} from '../../global-constant';
import { NodeBesSaveComponent } from './nodeBes-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {PageEditComponent} from '../page/page-edit.component';
import {RurelateSaveComponent} from '../order/rurelate-save.component';
import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-nodeBes-list',
  templateUrl: './nodeBes-list.component.html',
})
export class NodeBesListComponent implements OnInit, OnDestroy {
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
    private orderBusinessService: OrderBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("全局节点管理");
  }

  nodeCode: any = "";
  nodeName: any = "";
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    if (this.articleSaveModal !== null ) {
      this.articleSaveModal.close();
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
      nodeCode: this.nodeCode,
      alias: this.nodeName,
    }
    this.orderBusinessService.nodeInfoList(param, function(data){
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
    this.nodeCode = '',
    this.nodeName = '',
    t.getList();
  }

  articleSaveModal: any = null;
  save(data) {
    let that = this;
    this.articleSaveModal = this.ngbModalService.open(NodeBesSaveComponent, {size: 'lg'});
    this.articleSaveModal.componentInstance.modalData = data;
    this.articleSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
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

}
