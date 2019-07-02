import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState } from '../../global-constant';


@Component({
  selector: 'c-code-save',
  templateUrl: './code-save.component.html'
})
export class CodeSaveComponent implements OnInit {

  saveCodeForm: FormGroup;

  paramModal: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private odsysBusinessService: OdsysBusinessService,
  ) {
    const carrierFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const productCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const stateFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveCodeForm = this.formBuilder.group({
      carrier: carrierFc,
      provinceCode: provinceCodeFc,
      productCode: productCodeFc,
      state: stateFc,
      projectCode: projectCodeFc,
    });
  }

  ngOnInit() {
    if (this.paramModal !== '') {
      this.getDetail();
    } else {
      this.saveCodeForm.patchValue({state: this.stateData[1].type});
    }
    this.getDetail();
    this.getProjects();
    this.getProvinces();
  }

  getDetail() {
    if (this.paramModal !== '') {
      let that = this;
      this.odsysBusinessService.getProjectsDetail({id: this.paramModal}, function(data){
        that.saveCodeForm.patchValue({
          projectCode: data.projectCode,
          carrier: data.carrier,
          provinceCode: data.provinceCode,
          productCode: data.productCode,
          state: data.useStatus
        });
        that.updateProduct();
      });
    }
  }

  getProjects() {
    let that = this;
    this.odsysBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  updateProduct() {
    let that = this;
    let param = {projectCode: this.saveCodeForm.getRawValue().projectCode};
    this.odsysBusinessService.getProducts(param, function(data){
      if (data.length > 0) {
        that.products = data;
      } else {
        that.products = [];
      }
    });
  }

  getProvinces() {
    let that = this;
    this.odsysBusinessService.getProvinces(function(data){
      if (data.length > 0) {
        that.provinces = data;
      } else {
        that.provinces = [];
      }
    });
  }

  ok(): void {
    let param: any = {
      carrier: this.saveCodeForm.getRawValue().carrier,
      provinceCode: this.saveCodeForm.getRawValue().provinceCode,
      productCode: this.saveCodeForm.getRawValue().productCode,
      useStatus: this.saveCodeForm.getRawValue().state,
    };
    let that = this;
    if (this.paramModal) {
      param.id = this.paramModal;
    }
    if (this.saveCodeForm.valid) {
      this.odsysBusinessService.orderProcodeSavePost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
