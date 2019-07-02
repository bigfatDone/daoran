import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { SafetyBusinessService } from '../../business-service/safety/safety-business.service';
import {apiPlatform, carrierAttr, odSysState} from '../../global-constant';


@Component({
  selector: 'c-interface-save',
  templateUrl: './interface-save.component.html'
})
export class InterfaceSaveComponent implements OnInit {

  saveInterfaceForm: FormGroup;

  paramModal: any = '';

  apiPlatforms: Array<any> = apiPlatform;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private safetyBusinessService: SafetyBusinessService,
  ) {
    const apiCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const apiPlatformFc = new FormControl('', Validators.compose([Validators.required]));
    const apiNameFc = new FormControl('', Validators.compose([]));
    const apiDesFc = new FormControl('', Validators.compose([]));
    this.saveInterfaceForm = this.formBuilder.group({
      apiCode: apiCodeFc,
      apiPlatform: apiPlatformFc,
      apiName: apiNameFc,
      apiDes: apiDesFc,
    });
  }

  ngOnInit() {
    if (this.paramModal !== '') {
      this.getDetail();
      this.saveInterfaceForm.controls['apiCode'].disable();
      this.saveInterfaceForm.controls['apiPlatform'].disable();
    }
  }

  getDetail() {
    if (this.paramModal !== '') {
      let that = this;
      this.safetyBusinessService.getApiInfo({apiCode: this.paramModal}, function(data){
        that.saveInterfaceForm.patchValue({
          apiCode: data.apiCode,
          apiPlatform: data.apiPlatform,
          apiName: data.apiName,
          apiDes: data.apiDes,
        });
        // that.updateProduct();
      });
    }
  }

  ok(): void {
    let param: any = {
      apiCode: this.saveInterfaceForm.getRawValue().apiCode,
      apiPlatform: this.saveInterfaceForm.getRawValue().apiPlatform,
      apiName: this.saveInterfaceForm.getRawValue().apiName,
      apiDes: this.saveInterfaceForm.getRawValue().apiDes,
    };
    let that = this;
    if (this.saveInterfaceForm.getRawValue().apiDes == "") {
      this.saveInterfaceForm.removeControl('apiDes');
    }
    if (this.saveInterfaceForm.getRawValue().apiName == "") {
      this.saveInterfaceForm.removeControl('apiName');
    }
    if (this.paramModal !== '') {
      this.safetyBusinessService.editApiInfo(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      if (this.saveInterfaceForm.valid) {
        this.safetyBusinessService.addApiInfo(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      }
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
