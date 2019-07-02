import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
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
import {AllotRoleComponent} from './allot-role.component';

@Component({
  selector: 'c-dealer-role',
  templateUrl: './dealer-role.component.html',
})
export class DealerRoleComponent implements OnInit, OnDestroy {
  roleDealerForm: FormGroup;
  modalData: any = '';
  paramModal: any = '';
  oneProductData: Array <any>= [0];
  roleIdStr: String = '';

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
      this.getDealerDetail();
      this.getAllotRoles();
      // this.roleDealerForm.controls['spId'].disable();
  }

  ngOnDestroy() {
    if (this.showRoleModal !== null) {
      this.showRoleModal.close();
    }
  }

  spId: any = '';
  spName: any = '';
  key: any = '';
  contacts: any = '';
  tel: any = '';
  getDealerDetail() {
    let that = this;
    this.safetyBusinessService.getDealerDetail({spId: this.paramModal}, function(data){
      // that.roleDealerForm.patchValue({
        that.spId = data.spId,
        that.spName = data.spName,
        that.key = data.key,
        that.contacts = data.contacts,
        that.tel = data.tel
      // });
      // that.projectName = data.projectName;
    });
  }

  dataList: Array<any>= [];
  getAllotRoles() {
    let that = this;
    this.safetyBusinessService.getAllotRoles({spId: this.paramModal}, function(data){
      if (data.length > 0) {
        that.dataList = data;
        // that.options.page = param.page;
        // that.options.total = data.total;
        // that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  showRoleModal: any = null;
  showRole() {
    this.showRoleModal = this.ngbModalService.open(AllotRoleComponent, {size: 'lg'});
    // this.showRoleModal.componentInstance.fromProcuctList = true;
    this.showRoleModal.result.then((result) => {
      this.roleIdStr = result; // 页面编码
      /*if (this.pageIdStr !== '') {
        this.okP();
      }*/
    }, (reason) => {
    });
  }

  okP () {
    let that = this;
    let param = {
      spId: this.paramModal,
      roleIds: this.roleIdStr,
    };
    if (param.roleIds === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要关联的角色!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.safetyBusinessService.addAllotRoles(param, function(data){
      if (data.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.roleIdStr = '';
        that.getAllotRoles();
      }
    });
  }

  delRelation (oData) {
    let that = this;
    let param = {
      id: oData,
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.safetyBusinessService.delAllotRole(param, function(data){
        that.getPageProductRelation();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
        that.getAllotRoles();
      });
    }, (reason) => {
    });
  }

  getPageProductRelation () { // 获取产品关联页面
    let that = this;
    let param = {
      nodeCode: this.modalData.nodeCode,
      productCode: this.modalData.productCode,
    };
    // this.safetyBusinessService.getPageProductRelationService(param, function(data){
    //   if (data.obj.data.length > 0) {
    //     that.oneProductData = data.obj.data;
    //   } else {
    //     that.oneProductData = [];
    //   }
    // });
  }



  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
