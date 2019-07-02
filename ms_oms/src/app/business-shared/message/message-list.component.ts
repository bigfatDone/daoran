import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { MessageBusinessService } from '../../business-service/message/message-business.service';
import {terminalType, startFlag} from '../../global-constant';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

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
    private messageBusinessService: MessageBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("消息列表");
  }


  types: any = terminalType;
  type: any = "";
  states: any = startFlag;
  state: any = "";
  name: any = "";
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
  }

  search() {
    this.options.page = 1;
    this.getList();
  }
  userInfo: any;
  getList() {
    let that = this;
    if (localStorage.userInfo) {
      this.userInfo = JSON.parse(localStorage.userInfo);
    }
    let param = {
      userName: this.userInfo.userName,
      moduleName: 'jit',
    }
    this.messageBusinessService.mineMessageAll(param, function(data){
      if (data.obj.length > 0) {
        data.obj.forEach( i => {
          let arr = i.content.replace(/\n/g, "<br/>");
          i.content = arr;
          that.dataList.push(i);
        })
      } else {
        that.dataList = [];
      }
    });
  }

}
