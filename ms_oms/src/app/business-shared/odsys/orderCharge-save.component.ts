import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState } from '../../global-constant';


@Component({
  selector: 'c-orderCharge-save',
  templateUrl: './orderCharge-save.component.html'
})
export class OrderChargeSaveComponent implements OnInit {

  saveOrderChargeForm: FormGroup;

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
    const orderProductCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(32)]));
    const productCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectNameFc = new FormControl('');
    const inNameFc = new FormControl('');
    const ottNameFc = new FormControl('');
    const carrierFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const ttpProductCodeFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveOrderChargeForm = this.formBuilder.group({
      orderProductCode: orderProductCodeFc,
      productCode:      productCodeFc,
      projectCode:      projectCodeFc,
      projectName:      projectNameFc,
      carrier:          carrierFc,
      provinceCode:     provinceCodeFc,
      ttpProductCode:   ttpProductCodeFc,
      inName:   inNameFc,
      ottName:   ottNameFc,
    });
  }

  continueTypeData: Array<any>= [{type: 0, value: '不续订'}, {type: 1, value: '续订'}];
  carrierData: any = [{type: 0, name: "OTT"}, {type: 1, name: "中国电信(ct)"}, {type: 2, name: "中国联通(unicom)"}, {type: 3, name: "广电(bc)"}, {type: 4, name: "中国移动(cm)"}];

  ngOnInit() {
    if (this.paramModal !== '') {
      this.getDetail();
    } else {
      this.saveOrderChargeForm.patchValue({carrier: this.carrierData[0].type});
    }
    this.getProjects();
    this.getProvinces();
    this.getProductList();
    this.getTtpProductList();
  }

  productList: Array<any>= [];
  getProductList() {
    let that = this;
    let param = {};
    this.odsysBusinessService.ownProductList(param, function(data){
      if (data.data.length > 0) {
        that.productList = data.data;
        that.productList.forEach( i => {
          if ( that.saveOrderChargeForm.getRawValue().productCode === i.productCode) {
            // this.saveOrderChargeForm.getRawValue().inName = i.alas;
            that.saveOrderChargeForm.get('inName').setValue(i.alas);
          }
        });
      } else {
        that.productList = [];
      }
    });
  }
  ttpProductList: Array<any>= [];
  getTtpProductList() {
    let that = this;
    let param = {}
    this.odsysBusinessService.ttpProductList(param, function(data){
      if (data.data.length > 0) {
        that.ttpProductList = data.data;
        that.ttpProductList.forEach( i => {
          if ( that.saveOrderChargeForm.getRawValue().ttpProductCode === i.productCode) {
            that.saveOrderChargeForm.get('ottName').setValue(i.productName);
          }
        });
      } else {
        that.ttpProductList = [];
      }
    });
  }
  getDetail() {
      let that = this;
      this.odsysBusinessService.orderDetail({orderProductCode: this.paramModal}, function(data){
        that.saveOrderChargeForm.patchValue({
          orderProductCode: data.orderProductCode,
          productCode:      data.productCode,
          projectCode:      data.projectCode,
          projectName:      data.projectCode,
          carrier:          data.carrier,
          provinceCode:     data.provinceCode,
          ttpProductCode:   data.ttpProductCode
        });
        that.saveOrderChargeForm.controls['orderProductCode'].disable();
        // that.getProjects();
        // that.getProvinces();
        // that.getProductList();
        // that.getTtpProductList();
      });
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

  getprojectCode() {
    this.projects.forEach( i => {
      if (i.sProductcode === this.saveOrderChargeForm.get(['projectCode']).value) {
        this.saveOrderChargeForm.get(['projectName']).setValue(i.sProductcode);
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
    let that = this;
    let pName;
    this.projects.forEach( i => {
      if (i.sProductcode === this.saveOrderChargeForm.getRawValue().projectCode) {
        pName = i.sProductName;
      }
    })
    console.log(pName)
    let param: any = {
      orderProductCode: this.saveOrderChargeForm.getRawValue().orderProductCode,
      productCode:      this.saveOrderChargeForm.getRawValue().productCode,
      // projectName:      this.saveOrderChargeForm.getRawValue().projectName,
      projectName:      pName,
      projectCode:      this.saveOrderChargeForm.getRawValue().projectCode,
      carrier:          this.saveOrderChargeForm.getRawValue().carrier,
      provinceCode:     this.saveOrderChargeForm.getRawValue().provinceCode,
      ttpProductCode:   this.saveOrderChargeForm.getRawValue().ttpProductCode,
    };
    if (this.paramModal) {
      param.op = '修改';
    } else {
      param.op = '增加';
    }
    if (this.saveOrderChargeForm.valid) {
      this.odsysBusinessService.orderEdit(param, function(data){
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
  getInName () {
    this.productList.forEach( i => {
      if ( this.saveOrderChargeForm.getRawValue().productCode === i.productCode) {
        // this.saveOrderChargeForm.getRawValue().inName = i.alas;
        this.saveOrderChargeForm.get('inName').setValue(i.alas);
      }
    });
  }
  getOttName () {
    this.ttpProductList.forEach( i => {
      if ( this.saveOrderChargeForm.getRawValue().ttpProductCode === i.productCode) {
        this.saveOrderChargeForm.get('ottName').setValue(i.productName);
      }
    });
  }
}
