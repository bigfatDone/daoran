import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState } from '../../global-constant';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';


@Component({
  selector: 'c-inCharge-save',
  templateUrl: './inCharge-save.component.html'
})
export class InChargeSaveComponent implements OnInit {

  saveInChargeForm: FormGroup;

  paramModal: any = '';

  continueTypeData: Array<any>= [{type: 0, value: '不续订'}, {type: 1, value: '续订'}];
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private odsysBusinessService: OdsysBusinessService,
  ) {
    const alasFc = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(32)]));
    const productCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(16)]));
    const continueTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const monthNumFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const dayNumFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const feePriceFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numFc]));
    const desFc = new FormControl('', Validators.compose([Validators.maxLength(255)]));
    const pNameFc = new FormControl('');

    this.saveInChargeForm = this.formBuilder.group({
      alas:         alasFc,
      productCode:  productCodeFc,
      continueType: continueTypeFc,
      projectCode:  projectCodeFc,
      monthNum:     monthNumFc,
      dayNum:  dayNumFc,
      feePrice:     feePriceFc,
      des:          desFc,
      pName:          pNameFc,
    });
  }

  ngOnInit() {
    if (this.paramModal !== '') {
      this.getDetail();
    } else {
      this.saveInChargeForm.patchValue({continueType: this.continueTypeData[0].type});
    }
    // this.getDetail();
    this.getProjects();
    // this.getProvinces();
  }

  getDetail() {
      let that = this;
      this.odsysBusinessService.ownProductDetail({productCode: this.paramModal}, function(data){
        that.saveInChargeForm.patchValue({
          alas:         data.alas,
          productCode:  data.productCode,
          continueType: data.continueType,
          projectCode:  data.projectCode,
          monthNum:     data.monthNum,
          dayNum:     data.dayNum,
          feePrice:     data.feePrice,
          des:          data.des
        });
        that.updateProduct();
        that.saveInChargeForm.controls['productCode'].disable();
      });
  }

  getProjects() {
    let that = this;
    this.odsysBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
        that.projects.forEach( i => {
          if (that.saveInChargeForm.controls['projectCode'].value === i.sProductcode) {
            that.saveInChargeForm.get('pName').setValue(i.sProductName);
          }
        });
      } else {
        that.projects = [];
      }
    });
  }

  updateProduct() {
    let that = this;
    this.projects.forEach( i => {
      if (this.saveInChargeForm.controls['projectCode'].value === i.sProductcode) {
        this.saveInChargeForm.get('pName').setValue(i.sProductName);
      }
    });
    // let param = {projectCode: this.saveInChargeForm.getRawValue().projectCode};
    // this.odsysBusinessService.getProducts(param, function(data){
    //   if (data.length > 0) {
    //     that.products = data;
    //   } else {
    //     that.products = [];
    //   }
    // });
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
      alas:         this.saveInChargeForm.getRawValue().alas,
      productCode:  this.saveInChargeForm.getRawValue().productCode,
      continueType: this.saveInChargeForm.getRawValue().continueType,
      projectCode:  this.saveInChargeForm.getRawValue().projectCode,
      monthNum:     this.saveInChargeForm.getRawValue().monthNum,
      dayNum:     this.saveInChargeForm.getRawValue().dayNum,
      feePrice:     this.saveInChargeForm.getRawValue().feePrice,
      des:          this.saveInChargeForm.getRawValue().des,
    };
    let that = this;
    if (this.paramModal) {
      param.flag = 'update';
    } else {
      param.flag = 'add';
    }
    if (this.saveInChargeForm.valid) {
      this.odsysBusinessService.ownProductEdit(param, function(data){
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
