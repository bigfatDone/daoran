import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

import { ProjectSaveComponent } from './project-save.component';

import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-project-list',
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];

  options: any = {
    rows: 10000,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private entryBusinessService: EntryBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("项目-对象管理");
  }


  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    if (this.saveProjectModal !== null) {
      this.saveProjectModal.close();
    }
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
    }
    // this.entryBusinessService.getProductListNewPost(param, function(data){ // 新的接口
    this.entryBusinessService.getProjectListPost(param, function(data){
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

  saveProjectModal: any = null;
  save(id) {
    let that = this;
    this.saveProjectModal = this.ngbModalService.open(ProjectSaveComponent);
    this.saveProjectModal.componentInstance.modalData = id;
    this.saveProjectModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoRes() {

  }

  del() {
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg);
  }

}
