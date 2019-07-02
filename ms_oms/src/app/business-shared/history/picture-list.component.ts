import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';


import { HistoryBusinessService } from '../../business-service/history/history-business.service';
import {PictureAddComponent} from './picture-add.component';
import { PictureInfoComponent } from './picture-info.component';
import { pageResType, categoryAttr, freeFlag } from '../../global-constant';

@Component({
  selector: 'c-picture-list',
  templateUrl: './picture-list.component.html',
})
export class PictureListComponent implements OnInit, OnDestroy {

  dataList:Array<any>= [];
  eleAttrs: Array<any>= [];

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
    private historyBusinessService: HistoryBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("照片墙管理");
  }

  sCode: any = "";
  sName: any = "";
  eleCategory: any = "";
  freeFlags: any = freeFlag;
  freeFlag: any = "";

  ngOnInit() {
    this.getList();
    this.getPicData ();
  }

  ngOnDestroy() {
    if (this.saveModal !== null) {
      this.saveModal.close();
    }else if (this.intoResModal !== null) {
      this.intoResModal.close();
    }
  }
  getPicData () {
    this.eleAttrs = [];
    categoryAttr.forEach(i => {
      let copyI = Object.assign({}, i);
      this.eleAttrs.push(copyI);
    });
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
      wallName: this.sName,
      eleCategory: this.eleCategory,
    }
    this.historyBusinessService.getPictureList(param, function(data){
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
    t.sName = '';
    t.eleCategory = '';
    t.getList();
  }

  saveModal: any = null;
  save(id) {
    let that = this;
    this.saveModal = this.ngbModalService.open(PictureAddComponent);
    if (id !=='') {
      this.saveModal.componentInstance.modalData = id;
    }
    this.saveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoResModal: any = null;
  intoRes(data) {
    let that = this;
    this.intoResModal = this.ngbModalService.open( PictureInfoComponent, {size: "lg"});
    this.intoResModal.componentInstance.modalData = data;
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
        let param = {wallName: id};
        this.historyBusinessService.delPicture(param, function (data){
          that.getList();
        });
      }
    }, (reason) => {
    });
  }

}
