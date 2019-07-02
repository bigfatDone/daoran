import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { RecordSeeComponent } from './record-see.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {MessageBusinessService} from '../../business-service/message/message-business.service';

@Component({
  selector: 'c-record-list',
  templateUrl: './record-list.component.html',
})
export class RecordListComponent implements OnInit, OnDestroy {
  model: NgbDateStruct;

  dataList: Array<any>= [];
  options: any = {
    rows: 18,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  beDate: any = '';
  enDate: any = '';
  SysID: any = '';
  LoginIP: any = '';
  UserCode: any = '';
  UserName: any = '';
  OperationType: any = '';
  Operation: any = '';
  projects: Array<any>= [];
  itemData: Array<any>= [];
  actName: any = '';
  provinces: Array<any>= [];
  productCode: any = '';
  products: Array<any>= [];

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private messageBusinessService: MessageBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("活动基本信息");
  }

  SysIDData: Array<any> = [{type:'OMS',value:'OMS'}, {type:'CRM',value:'CRM'}, {type:'CAS',value:'CAS'}, {type:'CMS',value:'CMS'}];
  OperationTypeData: Array<any> = [{type:'login', value:'login'} ,{type:'query', value:'query'}, {type:'updata', value: 'updata'}, {type:'delete',value: 'delete'}, {type:'insert',value: 'insert'}];

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    if (this.recordSeeModal !== null) {
      this.recordSeeModal.close();
    }
  }

  getList() {
    let that = this;
    let beDateStr = '';
    let enDateStr = '';
    if (typeof(this.beDate) ==="object" && this.beDate !=="" && this.beDate !== null ) {
      beDateStr = this.beDate.year + "-" + this.beDate.month + "-" + this.beDate.day;
    } else {
      beDateStr = '';
    }
    if (typeof(this.enDate) ==="object" && this.enDate !=="" && this.enDate !== null ) {
      enDateStr = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
    } else {
      enDateStr = '';
    }
    let param = {
      SysID:         this.SysID,
      LoginIP:       this.LoginIP,
      UserCode:      this.UserCode,
      UserName:      this.UserName,
      OperationType: this.OperationType,
      Operation:     this.Operation,
      beginTime: beDateStr,
      endTime: enDateStr,
      page:          this.options.page,
      rows:          this.options.rows,
    }
    this.messageBusinessService.userLogs(param, function(data){
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
    t.SysID = '';
    t.LoginIP = '';
    t.UserCode = '';
    t.UserName = '';
    t.OperationType = '';
    t.Operation = '';
    t.beDate = '';
    t.enDate = '';
    t.getList();
  }


  search() {
    this.options.page = 1;
    this.getList();
  }

  recordSeeModal: any = null;
  see(data) {
    let that = this;
    this.recordSeeModal = this.ngbModalService.open(RecordSeeComponent, {size: 'lg'});
    this.recordSeeModal.componentInstance.modalData = data;
    this.recordSeeModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      let param: any = {};
      if (id !== '') {
        param.actCode = id;
      } else {
        param.actCode = this.getIds();
      }
      // that.messageBusinessService.delActive (param, function(data){
      //   that.getList();
      //   that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      // });
    }, (reason) => {
      that.getList();
    });
  }

  getIds () {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.actCode);
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
