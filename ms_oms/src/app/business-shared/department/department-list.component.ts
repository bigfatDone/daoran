import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { ConfirmConfig } from '../../shared/modal/modal-model';
import { DepartmentBusinessService } from '../../business-service/department/department-business.service';

import { CompanySaveComponent } from './company-save.component';
import { DepartmentSaveComponent } from './department-save.component';
import { JobSaveComponent } from './job-save.component';
import {userDefaultData} from '../../global-constant';

@Component({
  selector: 'c-department-list',
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList({page: this.options.page, rows: this.options.rows, type: this.curType, name: this.options.name});
  }

  types: Array<any>= [
    {name: "公司", type: 1, text: "company"},
    {name: "部门", type: 2, text: "department"},
    {name: "职位", type: 3, text: "job"}
    ];
  curType : number = this.types[0].type;


  constructor(
    private appService: AppService,
    private departmentBusinessService: DepartmentBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("部门编辑");
  }


  ngOnInit() {
    this.userRole();
    this.defaultList();
  }

  isSysUser: boolean = false;
  isAdminUser: boolean = false;
  isSuperAdminUser: boolean = false;
  userRole() {
    if (localStorage.userInfo) {
      if (JSON.parse(localStorage.userInfo).type === null || JSON.parse(localStorage.userInfo).type === userDefaultData.type[0].id) {
        this.isSysUser = true;
      } else if (JSON.parse(localStorage.userInfo).type === null || JSON.parse(localStorage.userInfo).type === userDefaultData.type[1].id) {
        this.isSuperAdminUser = true;
      } else if (JSON.parse(localStorage.userInfo).type === null || JSON.parse(localStorage.userInfo).type === userDefaultData.type[2].id) {
        this.isAdminUser = true;
      }
    };
  }

  saveModal: any = null;

  ngOnDestroy () {
    if (this.saveModal != null) {
      this.saveModal.close();
    }
  }

  onTabChange($event: NgbTabChangeEvent) {
    console.log($event)
    this.curType = parseInt($event.nextId);
    this.dataList = [];
    this.getList({page: 1, rows: this.options.rows, type: this.curType});
  }


  getList(param) {
    let that = this;
    this.departmentBusinessService.getList(param, function(data){
      that.dataList = [];
      if (data.obj) {
        that.dataList = data.obj.results;
        that.options.page = data.obj.page;
        that.options.total = data.obj.total;
        that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
      }
    });
  }

  defaultList() {
    this.getList({page: this.options.page, rows: this.options.rows, type: this.curType, name: this.options.name});
  }

  save(data) {
    let saveComponent: any;
    switch (this.curType) {
      case this.types[0].type:
        saveComponent = CompanySaveComponent;
        break;
      case this.types[1].type:
        saveComponent = DepartmentSaveComponent;
        break;
      case this.types[2].type:
        saveComponent = JobSaveComponent;
        break;
    }
    this.saveModal = this.ngbModalService.open(saveComponent);
    if (data) {
      this.saveModal.componentInstance.title = "修改";
      this.saveModal.componentInstance.modalData = data;
    }else {
      this.saveModal.componentInstance.title = "添加";
    }
    this.saveModal.result.then((result) => {
    }, (reason) => {
      this.defaultList();
    });
  }


  delete(id, type) {
    let exitSysCfg = new ConfirmConfig('确认删除该条数据？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      if (result.status === "approved") {
        let param = {id: id, type: type};
        let that = this;
        this.departmentBusinessService.delete(param,function(data){
          that.defaultList();
        });
      }
    }, (reason) => {
    });
  }

  // 搜索
  searchCname: String;
  searchDname: String;
  searchJname: String;
  search() {
    let name: String;
    switch (this.curType) {
      case this.types[0].type:
        name = this.searchCname;
        break;
      case this.types[1].type:
        name = this.searchDname;
        break;
      case this.types[2].type:
        name = this.searchJname;
        break;
    }
    let param: any = {page: this.options.page, rows: this.options.rows, name: name, type: this.curType};
    this.getList(param);
  }
  clear () {
    let t = this;
    t.options.page = 1;
    t.options.name = '';
    this.searchCname = '';
    this.searchDname ='';
    this.searchJname = '';
    t.defaultList();
  }
}
