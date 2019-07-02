import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { orderRuleWeek, timeFrame, orderRuleSource, carrierAttr } from '../../global-constant';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {SafetyBusinessService} from '../../business-service/safety/safety-business.service';

@Component({
  selector: 'c-role-save',
  templateUrl: './role-save.component.html'
})
export class RoleSaveComponent implements OnInit {

  paramModal: any = '';

  provinces: Array<any>= [];
  weeks: Array<any>= orderRuleWeek;
  times: Array<any>= timeFrame;
  carrierAttr: Array<any>= carrierAttr;
  templates: Array<any>= [];

  saveRoleForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private safetyBusinessService: SafetyBusinessService,
  ) {
    const roleIdFc = new FormControl('', Validators.compose([]));
    const roleNameFc = new FormControl('', Validators.compose([Validators.required]));
    const roleDesFc = new FormControl([], Validators.compose([]));
    this.saveRoleForm = this.formBuilder.group({
      roleId: roleIdFc,
      roleName: roleNameFc,
      roleDes: roleDesFc,
    });
  }

  ngOnInit () {
    if (this.paramModal !== '') {
      this.getRoleDetail();
    }
  }

  getRoleDetail() {
    if (this.paramModal !== '') {
      let that = this;
      this.safetyBusinessService.getRoleDetail({roleId: this.paramModal}, function(data){
        that.saveRoleForm.patchValue({
          roleId: data.roleId,
          roleName: data.roleName,
          roleDes: data.roleDes,
        });
      });
    }
  }

  sourcesData: IMultiSelectOption[] = [];
  resetSources () {
       orderRuleSource.forEach(i => {
      this.sourcesData.push({id: i.value, name: i.name});
    });
  }

  ok(): void {
    let param: any;
    let that = this;
    if (this.saveRoleForm.getRawValue().roleId === "") {
      this.saveRoleForm.removeControl('roleId');
    }
    if (this.saveRoleForm.getRawValue().roleDes === "") {
      this.saveRoleForm.removeControl('roleDes');
    }
    if (this.saveRoleForm.valid) {
      param = {
        // roleId: this.saveRoleForm.getRawValue().roleId,
        roleName: this.saveRoleForm.getRawValue().roleName,
        roleDes: this.saveRoleForm.getRawValue().roleDes,
      };
      if (this.paramModal) {
        param.roleId = this.saveRoleForm.getRawValue().roleId;
        this.safetyBusinessService.editRoleInfo(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }else {
        this.safetyBusinessService.addRoleInfo(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
