import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {WebsiteBusinessService} from '../../business-service/website/website-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {environment} from '../../../environments/environment';
import { terminalType, startFlag} from '../../global-constant';
import {UserBusinessService} from '../../business-service/user/user-business.service';

@Component({
  selector: 'c-sys-save',
  templateUrl: './sys-save.component.html',
  styleUrls: ['./sys-save.component.scss']
})
export class SysSaveComponent implements OnInit {

  saveSysForm: FormGroup;
  modalData: any = '';
  terminal: Array<any>= [terminalType[0]];
  start: Array<any>= [startFlag[0]];
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private userBusinessService: UserBusinessService,
              ) {
    const systemFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const configKeyFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const configValueFc = new FormControl('', Validators.compose([Validators.required]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveSysForm = this.formBuilder.group({
      system: systemFc,
      configKey: configKeyFc,
      configValue: configValueFc,
    });
  }

  ngOnInit() {
    if (this.modalData !== '') {
      let that = this;
      this.getDetail();
      }else{
      this.saveSysForm.patchValue({
        typeName: this.terminal[0].type,
        stateName: this.start[0].type,
      });
    }
  }
  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    if (this.saveSysForm.getRawValue().stateName === "") {
      this.saveSysForm.removeControl('stateName');
    }
    if (this.saveSysForm.valid) {
      param = {
        system: this.saveSysForm.getRawValue().system,
        configKey: this.saveSysForm.getRawValue().configKey,
        configValue: this.saveSysForm.getRawValue().configValue,
      };
      if (this.modalData !== "") {
        param.id = this.modalData.id;
      }

      this.userBusinessService.sysSave(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  /**
   * 关闭
   */
    close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {id: this.modalData.id};
    this.userBusinessService.sysDetial(param, function(data){
      that.detailData = data;
      that.saveSysForm.patchValue({
        system: data.system,
        configKey: data.configKey,
        configValue: data.configValue,
      });
      that.saveSysForm.controls['system'].disable();
      that.saveSysForm.controls['configKey'].disable();
    });
  }

}
