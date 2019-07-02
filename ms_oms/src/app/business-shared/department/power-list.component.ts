import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { DepartmentBusinessService } from '../../business-service/department/department-business.service';

import { PowerSaveComponent } from './power-save.component';

@Component({
  selector: 'c-power-list',
  templateUrl: './power-list.component.html',
})
export class PowerListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];

  constructor(
    private appService: AppService,
    private departmentBusinessService: DepartmentBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("岗位权限");
  }


  ngOnInit() {
    this.defaultList();
    this.getSelectDataList(1,"");
  }

  powerSaveModal: any = null;

  ngOnDestroy () {
    if (this.powerSaveModal != null) {
      this.powerSaveModal.close();
    }
  }

  getList(param) {
    let that = this;
    this.departmentBusinessService.getPowList(param, function(data){
      if (data.obj) {
        that.dataList = data.obj;
      } else {
        that.dataList = [];
      }
    });
  }

  defaultList() {
    this.getList({ company: this.cName, department: this.dName, position: this.jName});
  }

  clear () {
    let t = this;
    t.cName = '';
    t.dName = '';
    t.jName = '';
    this.getList({ company: this.cName, department: this.dName, position: this.jName});
  }

  save(id, type) {
    let that = this;
    this.powerSaveModal = that.ngbModalService.open(PowerSaveComponent);
    this.powerSaveModal.componentInstance.type = type;
    this.powerSaveModal.componentInstance.postId = id;
    this.powerSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  companyList: any= [];
  departmentList: any= [];
  jobList: any= [];
  cName: String = "";
  dName: String = "";
  jName: String = "";

  getSelectData(param) {
    let that = this;
    this.departmentBusinessService.getAllList(param, function(data){
      if (data.obj) {
        switch (parseInt(param.type)) {
          case 1:
            that.companyList = data.obj;
            break;
          case 2:
            that.dName = '';
            that.departmentList = data.obj;
            break;
          case 3:
            that.jobList = data.obj;
            break;
        }
      }else {
      }
    });
  }
  getSelectDataList(type, id) {
    let param = {type: type, id: id};
    this.getSelectData(param);
  }
}
