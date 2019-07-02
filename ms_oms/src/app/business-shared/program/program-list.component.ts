import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { ProgramAddComponent} from './program-add.component';
import { ProgramIntoComponent } from './program-into.component';

import { ProgramBusinessService } from '../../business-service/program/program-business.service';

import { programType, pageResType } from '../../global-constant';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
@Component({
  selector: 'c-program-list',
  templateUrl: './program-list.component.html',
})
export class ProgramListComponent implements OnInit, OnDestroy {

  dataList:Array<any>= [];
  windowUrl: any;
  drawFlag = true;
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
    private programBusinessService: ProgramBusinessService,
    private modalService: ModalService,
    private actRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router) {
    this.appService.titleEventEmitter.emit("节目单管理");
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/programList")>= 0) {
      this.drawFlag = false;
      this.appService.titleEventEmitter.emit("手绘本-节目单管理");
    }
  }

  sCode: any = "";
  sName: any = "";
  listTypes: any = programType;
  listType: any = "";
  resTypes: any = pageResType.slice(1, pageResType.length);
  resType: any = "";
  freeFlags: Array<any> = [{type: 0, name: '收费'}, {type: 1, name: '免费'}];
  freeFlag: any = '';

  ngOnInit() {
    this.actRoute.queryParams.subscribe(queryParams => {
      this.sCode = queryParams.sCode;
    });
    this.getList();
  }

  ngOnDestroy(){
    if (this.saveModal !== null) {
      this.saveModal.close();
    }
    if (this.intoResModal !== null) {
      this.intoResModal.close();
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
      listCode: this.sCode,
      listName: this.sName,
      listType: this.listType,
      resType: this.resType,
      freeFlag: this.freeFlag,
    }
    this.programBusinessService.getProgramListPost(param, function(data){
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
  copyList(id) {
    let that = this;
    let param = {
      listCode: id,
    }
    this.programBusinessService.copyList(param, function(data){
      that.getList();
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.sCode = '';
    t.sName = '';
    t.listType = '';
    t.resType = '';
    t.freeFlag = '';
    t.getList();
  }

  saveModal: any = null;
  save(id) {
    let that = this;
    this.saveModal = this.ngbModalService.open(ProgramAddComponent);
    if (id!=='') {
      this.saveModal.componentInstance.modalData = id;
    }
    this.saveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoResModal: any = null;
  intoRes(listCode, resType) {
    let that = this;
    this.intoResModal = this.ngbModalService.open(ProgramIntoComponent, {size: "lg"});
    this.intoResModal.componentInstance.modalData = {
      listCode: listCode,
      resType : resType
    }
    this.intoResModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  delete(id) {
    let exitSysCfg = new ConfirmConfig('确认删除该条数据？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      if (result.status === "approved") {
        let that = this;
        let param = {listCodes: id};
        this.programBusinessService.delProgramListPost(param,function(data){
          that.getList();
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
        });
      }
    }, (reason) => {
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
      } else {
        this.dataList[ind].checkState = false;
      }
    });
  }

}
