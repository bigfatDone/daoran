import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState } from '../../global-constant';


@Component({
  selector: 'c-inOutCharge-save',
  templateUrl: './inOutCharge-save.component.html'
})
export class InOutChargeSaveComponent implements OnInit {

  saveInOutChargeForm: FormGroup;

  paramModal: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;
  continueTypeData: Array<any>= [{type: 0, value: '不续订'}, {type: 1, value: '续订'}];

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private odsysBusinessService: OdsysBusinessService,
  ) {
    const ttpProductCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const ttpProductNameFc = new FormControl('', Validators.compose([Validators.required]));
    const productCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const productNameFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveInOutChargeForm = this.formBuilder.group({
      ttpProductCode: ttpProductCodeFc,
      productCode:    productCodeFc,
      ttpProductName: ttpProductNameFc,
      productName:    productNameFc,
    });
  }

  ngOnInit() {
    if (this.paramModal !== '') {
      this.getDetail();
    } else {
      this.saveInOutChargeForm.patchValue({state: this.stateData[1].type});
    }
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
      } else {
        that.ttpProductList = [];
      }
    });
  }

  getDetail() {
      let that = this;
      this.odsysBusinessService.productOwnTipDetail({productCode: this.paramModal.productCode, ttpProductCode: this.paramModal.ttpProductCode}, function(data){
        that.saveInOutChargeForm.patchValue({
          ttpProductCode: data.ttpProductCode,
          ttpProductName: data.ttpProductCode,
          productCode:    data.productCode,
          productName:    data.productCode,
          // productCode:    data.productCode,
          // productCode:    data.productCode,
        });
        that.getProductList();
        that.getTtpProductList();
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

  productChange() {
    this.productList.forEach( i => {
      if (i.productCode === this.saveInOutChargeForm.controls['productName'].value) {
        this.saveInOutChargeForm.get(['productCode']).setValue(i.productCode);
      }
    })

  }
  ttpProductChange() {
    this.ttpProductList.forEach( i => {
      if (i.productCode === this.saveInOutChargeForm.controls['ttpProductName'].value) {
        this.saveInOutChargeForm.get(['ttpProductCode']).setValue(i.productCode);
      }
    })

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
      ttpProductCode:  this.saveInOutChargeForm.getRawValue().ttpProductCode,
      productCode:      this.saveInOutChargeForm.getRawValue().productCode,
    };
    let that = this;
    if (this.paramModal) {
      param.op = '修改';
    } else {
      param.op = '增加';
    }
    if (this.saveInOutChargeForm.valid) {
      this.odsysBusinessService.productOwnTipEdit(param, function(data){
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
