import { Component } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import { ModalService } from '../../shared/modal/modal.service';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';

import { DepartmentBusinessService } from '../../business-service/department/department-business.service';
import { UserBusinessService } from '../../business-service/user/user-business.service';

@Component({
  selector: 'c-user-password',
  templateUrl: './user-password.component.html'
})
export class UserPasswordComponent {

  userPwdForm: FormGroup;

  modalData:any;
  isReset:boolean;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private departmentBusinessService: DepartmentBusinessService,
              private userBusinessService: UserBusinessService,
              private router: Router,
              private modalService: ModalService,
              private formBuilder: FormBuilder) {
    // const passwordFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterCase, Validators.minLength(6), Validators.maxLength(15)]));
    const opasswordFc = new FormControl('', Validators.compose([Validators.required]));
    const passwordFc = new FormControl('', Validators.compose([Validators.required]));
    const rpasswordFc = new FormControl('', CustomValidators.equalTo(passwordFc));
    this.userPwdForm = this.formBuilder.group({
      opassword: opasswordFc,
      password: passwordFc,
      rpassword: rpasswordFc,
    });
  }

  ok(): void {
    let param: any;
    let that = this;
    if (this.userPwdForm.valid) {
      param = {
        id: String(this.modalData),
        oldPassword: this.userPwdForm.getRawValue().opassword,
        newPassword: this.userPwdForm.getRawValue().password,
        newPasswordToo: this.userPwdForm.getRawValue().rpassword,
      };
      this.userBusinessService.saveUserPwd(param, function(data){
        that.close();
        if (!that.isReset) {
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '密码修改成功!', 2000));
          // const alertCfg = new AlertConfig(AlertType.INFO, '消息', '密码修改成功！');
          // that.modalService.alert(alertCfg).then((result) => {
          //     if (result.status === "approved") {
          //       console.log("修改成功")
          //       // that.logout();
          //     }
          //   }, (reason) => {
          //     // that.logout();
          //   }
          // );
        }
        });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整!', 2000));
    }
  }

  logout() {
    let that = this;
    this.userBusinessService.userLogout(function(){
      that.router.navigate(['/login']);
    });
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

}
