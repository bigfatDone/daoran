import {Component, OnDestroy, OnInit} from '@angular/core';
// import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
// import {ElementPageCheckComponent} from './element-page-check.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import {SafetyBusinessService} from '../../business-service/safety/safety-business.service';
import {RoleInterfaceComponent} from './role-interface.component';
import {AllotRoleComponent} from './allot-role.component';

@Component({
  selector: 'c-role-power',
  templateUrl: './role-power.component.html',
})
export class RolePowerComponent implements OnInit, OnDestroy {
  //saveUserForm: FormGroup;
  modalData:any;
  oneProductData:Array <any>=[0];
  paramModal: any = '';

  constructor(
    public activeModal: NgbActiveModal,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private modalService: ModalService,
    private appService: AppService,
    private httpService: HttpService,
    private safetyBusinessService: SafetyBusinessService,
  ) {
  }

  ngOnInit() {
    this.getRoleDetail();
    this.getAllotAPIs();
  }

  ngOnDestroy() {
    if (this.showInterfaceModal !== null) {
      this.showInterfaceModal.close();
    }
  }
  roleId: any = '';
  roleName: any = '';
  getRoleDetail() {
      let that = this;
      this.safetyBusinessService.getRoleDetail({roleId: this.paramModal}, function(data){
          that.roleId = data.roleId,
          that.roleName = data.roleName
      });
  }
  interfaceStr: any = '';
  showInterfaceModal: any = null;
  showInterface() {
    this.showInterfaceModal = this.ngbModalService.open(RoleInterfaceComponent, {size: 'lg'});
    // this.showRoleModal.componentInstance.fromProcuctList = true;
    this.showInterfaceModal.componentInstance.modalData = this.dataList;
    this.showInterfaceModal.result.then((result) => {
      this.interfaceStr = result; // 页面编码
      // if (this.interfaceStr !== '') {
      //   this.okP();
      // }
    }, (reason) => {
    });
  }

  okP () {
    let that = this;
    let param = {
      roleId: this.paramModal,
      apiCodes: this.interfaceStr,
    };
    if (param.apiCodes === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要关联的接口!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.safetyBusinessService.addAllotAPIs(param, function(data){
      if (data.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.interfaceStr = '';
        that.getAllotAPIs();
      }
    });
  }

  delRelation (oData) {
    let that = this;
    let param = {
      id: oData
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.safetyBusinessService.delAllotAPI(param, function(data){
        that.getAllotAPIs();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }
  dataList: Array<any> = [];
  getAllotAPIs () { // 获取分配接口列表
    let that = this;
    let param = {
      roleId: this.paramModal,
    };
    this.safetyBusinessService.getAllotAPIs(param, function(data){
      if (data.length > 0) {
        that.dataList = data;
      } else {
        that.dataList = [];
      }
    });
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
