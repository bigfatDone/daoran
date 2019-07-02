import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { HistoryBusinessService } from '../../business-service/history/history-business.service';

import {programType, freeFlag, categoryAttr} from '../../global-constant';
import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-active-save',
  templateUrl: './active-save.component.html',
  styleUrls: ['./active-save.component.scss'],
})
export class ActiveSaveComponent implements OnInit {

  saveActiveForm: FormGroup;

  activeData: any = "";

  constructor(public activeModal: NgbActiveModal, private orderBusinessService: OrderBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
    const nameFc = new FormControl('', Validators.compose([Validators.required,]));
    const codeFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline]));
    const desFc = new FormControl('', Validators.compose([ Validators.maxLength(140)]));

    this.saveActiveForm = this.formBuilder.group({
      name: nameFc,
      code: codeFc,
      des: desFc,
    });
  }

  ngOnInit() {
    if ( this.activeData !== "") {
      this.getDetail();
      this.saveActiveForm.controls["code"].disable();
    }
  }
  getDetail() {
      let that = this;
      let param = {code: this.activeData.code};
      this.orderBusinessService.getGoCodeById(param, function(data){
        that.saveActiveForm.patchValue({
          name: data.name,
          code: data.code,
          des: data.goDesc,
        });
      });
  }

  ok(): void {
    let that = this;
    let param: any;
    if (this.saveActiveForm.valid) {
      param =  {
        name: this.saveActiveForm.controls["name"].value,
        code: this.saveActiveForm.controls["code"].value,
        goDesc: this.saveActiveForm.controls["des"].value,
      };
      if (this.activeData !== "") {
        param.id = this.activeData.id;
      }
      this.orderBusinessService.saveCode(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写正确、完整信息!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
