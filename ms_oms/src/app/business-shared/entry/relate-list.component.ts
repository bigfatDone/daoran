import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { RelateSaveComponent } from './relate-save.component';

import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-relate-list',
  templateUrl: './relate-list.component.html',
})
export class RelateListComponent implements OnInit, OnDestroy {

  dataList:Array<any>= [];

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private entryBusinessService: EntryBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("关联管理");
  }


  ngOnInit() {
    this.getList();
    this.getRelateProjectsNames();
    this.getRelateProjectsCodes();
  }

  ngOnDestroy() {
    if (this.saveRelativeModal !== null) {
      this.saveRelativeModal.close();
    }
  }

  names: Array<any>= [];
  name: any = "";
  objs: Array<any>= [];
  obj: any = "";

  getRelateProjectsNames() {
    let that = this;
    this.entryBusinessService.getRelateProjects({}, function(data){
      if (data.length > 0) {
        that.names = data;
      } else {
        that.names = [];
      }
    });
  }

  getRelateProjectsCodes() {
    let that = this;
    this.entryBusinessService.getProductAreaListPost({}, function(data){
      if (data.length > 0) {
        that.objs = data;
      } else {
        that.objs = [];
      }
    });
  }

  search() {
    this.getList();
  }

  getList() {
    let that = this;
    let param = {
      sProjectCode: this.name,
      sProductCode: this.obj
    }
    this.entryBusinessService.getRelateList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    let t = this;
    t.name = '';
    t.obj = '';
    t.getList();
  }

  saveRelativeModal: any = null;
  save(data) {
    let that = this;
    this.saveRelativeModal =  this.ngbModalService.open(RelateSaveComponent);
    this.saveRelativeModal.componentInstance.modalData = data;
    this.saveRelativeModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  delete(id) {
    let exitSysCfg = new ConfirmConfig('确认删除该条数据？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      if (result.status === "approved") {
        let that = this;
        let param = {ppId: id};
        this.entryBusinessService.delRelate(param, function(data){
          that.getList();
        });
      }
    }, (reason) => {
    });
  }

}
