import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { CommonBusinessService } from '../../business-service/common/common-business.service';
import { carrierAttr } from '../../global-constant';
import {environment} from '../../../environments/environment';
import {SafetyBusinessService} from '../../business-service/safety/safety-business.service';

@Component({
  selector: 'c-dealer-save',
  templateUrl: './dealer-save.component.html',
  styleUrls: ['./dealer-save.component.scss']
})
export class DealerSaveComponent implements OnInit {

  paramModal: any = '';

  projectName: any = '';

  saveDealerInfo: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private safetyBusinessService: SafetyBusinessService,
              private commonBusinessService: CommonBusinessService,
  ) {
    const spIdFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const spNameFc = new FormControl('', Validators.compose([Validators.minLength(1), Validators.maxLength(64)]));
    const keyFc = new FormControl('', Validators.compose([Validators.required ]));
    const contactsFc = new FormControl('', Validators.compose([]));
    const telFc = new FormControl('', Validators.compose([Validators.minLength(1), Validators.maxLength(12)]));
    const spDesFc = new FormControl('', Validators.compose([]));
    this.saveDealerInfo = this.formBuilder.group({
      spId: spIdFc,
      spName: spNameFc,
      key: keyFc,
      contacts: contactsFc,
      tel: telFc,
      spDes: spDesFc,
    });
    // this.saveDealerInfo.controls['templateImg'].disable();
  }

  ngOnInit () {
    this.getProjects();
    if (this.paramModal !== '') {
      this.getDealerDetail();
      this.saveDealerInfo.controls['spId'].disable();
    }
  }

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];

  getProjects() {
    let that = this;
    this.safetyBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  idSpId: any = '';
  isExist() {
    let param;
    let that = this;
    this.safetyBusinessService.isIdExist({spId: this.saveDealerInfo.getRawValue().spId}, function(data){

    });
  }

  getDealerDetail() {
    let that = this;
    this.safetyBusinessService.getDealerDetail({spId: this.paramModal}, function(data){
      that.saveDealerInfo.patchValue({
        spId: data.spId,
        spName: data.spName,
        key: data.key,
        contacts: data.contacts,
        tel: data.tel,
        spDes: data.spDes,
      });
      // that.projectName = data.projectName;
    });
  }

  ok(): void {
    let param: any;
    let that = this;
    if (this.saveDealerInfo.getRawValue().spName === "") {
      this.saveDealerInfo.removeControl('spName');
    }
    if (this.saveDealerInfo.getRawValue().contacts === "") {
      this.saveDealerInfo.removeControl('contacts');
    }
    if (this.saveDealerInfo.getRawValue().tel === "") {
      this.saveDealerInfo.removeControl('tel');
    }
    if (this.saveDealerInfo.getRawValue().spDes === "") {
      this.saveDealerInfo.removeControl('spDes');
    }
    if (this.saveDealerInfo.valid) {
      param = {
        spId: this.saveDealerInfo.getRawValue().spId,
        spName: this.saveDealerInfo.getRawValue().spName,
        key: this.saveDealerInfo.getRawValue().key,
        contacts: this.saveDealerInfo.getRawValue().contacts,
        tel: this.saveDealerInfo.getRawValue().tel,
        spDes: this.saveDealerInfo.getRawValue().spDes,
      };
      if (this.paramModal !== '') {
        // param.id = this.paramModal;
        this.safetyBusinessService.editSp(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 3000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }else {
        this.safetyBusinessService.saveSp(param, function(data){
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
