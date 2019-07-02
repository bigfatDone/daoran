import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState, concodeTypeData } from '../../global-constant';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';


@Component({
  selector: 'c-outCharge-save',
  templateUrl: './outCharge-save.component.html'
})
export class OutChargeSaveComponent implements OnInit {

  saveOutChargeForm: FormGroup;

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
    const codeTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const cpIdFc = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(4)]));
    const devPlatformFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const priceFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numFc, Validators.maxLength(5)]));
    const productCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(32)]));
    const productNameFc = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(32)]));
    const iNameFc = new FormControl('');
    const nNameFc = new FormControl('');
    this.saveOutChargeForm = this.formBuilder.group({
      codeType:     codeTypeFc,
      cpId:        cpIdFc,
      devPlatform: devPlatformFc,
      itemCode:     itemCodeFc,
      nodeCode:    nodeCodeFc,
      price:       priceFc,
      productCode: productCodeFc,
      productName: productNameFc,
      iName: iNameFc,
      nName: nNameFc,
    });
  }

  // continueTypeData: Array<any>= [{type: 0, value: '不续订'}, {type: 1, value: '续订'}];
  concodeTypeData: Array<any>= concodeTypeData;
  devPlatformData: Array<any> = [{type: 0, value: '通用'}, {type: 1, value: 'Linux'}, {type: 2, value: 'Android'}];
  ngOnInit() {
    if (this.paramModal !== '') {
      this.getDetail();
    } else {
      this.saveOutChargeForm.patchValue({
        devPlatform: this.devPlatformData[0].type,
        codeType: this.concodeTypeData[0].type,
      });
    }
    this.getAllProject();
    // this.getProvinces();
  }

  detailData: any;
  getDetail() {
      let that = this;
      this.odsysBusinessService.ttpProductDetail({productCode: this.paramModal.productCode, nodeCode: this.paramModal.nodeCode}, function(data){
        that.detailData = data;
        that.saveOutChargeForm.patchValue({
          codeType:     data.codeType,
          cpId:        data.cpId,
          devPlatform: data.devPlatform,
          itemCode:    data.itemCode,
          nodeCode:    data.nodeCode,
          price:       data.price,
          productCode: data.productCode,
          productName: data.productName
        });
        that.getNodeList();
        that.saveOutChargeForm.controls['productCode'].disable();
        that.saveOutChargeForm.controls['itemCode'].disable();
        that.saveOutChargeForm.controls['nodeCode'].disable();
      });
  }

  itemData: Array<any> = [];
  getAllProject() {
    let that = this;
    this.odsysBusinessService.getAllProject(function(data){
      if (data.data.length > 0) {
        that.itemData = data.data;
        that.itemData.forEach( i => {
          if (that.saveOutChargeForm.getRawValue().itemCode === i.sProjectCode) {
            that.saveOutChargeForm.get('iName').setValue(i.sProject);
          }
        });
      } else {
        that.itemData = [];
      }
    });
  }

  getOthers() {
    this.itemData.forEach( i => {
      if (this.saveOutChargeForm.getRawValue().itemCode === i.sProjectCode) {
        this.saveOutChargeForm.get('iName').setValue(i.sProject);
      }
    });
    this.saveOutChargeForm.patchValue({
      nodeCode: '',
    });
    this.getNodeList();
  }
  getnName () {
    this.nodeData.forEach( i => {
      if (this.saveOutChargeForm.getRawValue().nodeCode === i.nodeCode) {
        this.saveOutChargeForm.get('nName').setValue(i.alias);
      }
    });
  }
  nodeData: Array<any> = [];
  getNodeList() {
    let that = this;
    let param = {itemCode: this.saveOutChargeForm.getRawValue().itemCode};
    this.odsysBusinessService.getNodeList(param, function(data){
      if (data.length > 0) {
        that.nodeData = data;
        if (that.paramModal !== '' && that.saveOutChargeForm.getRawValue().itemCode === that.detailData.itemCode) {
          that.saveOutChargeForm.patchValue({
            // itemCode: that.activeData.itemCode,
          });
        }
        that.nodeData.forEach( i => {
          if (that.saveOutChargeForm.getRawValue().nodeCode === i.nodeCode) {
            that.saveOutChargeForm.get('nName').setValue(i.alias);
          }
        });
      } else {
        that.nodeData = [];
      }
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
      codeType:    this.saveOutChargeForm.getRawValue().codeType,
      cpId:        this.saveOutChargeForm.getRawValue().cpId,
      devPlatform: this.saveOutChargeForm.getRawValue().devPlatform,
      itemCode:    this.saveOutChargeForm.getRawValue().itemCode,
      nodeCode:    this.saveOutChargeForm.getRawValue().nodeCode,
      price:       this.saveOutChargeForm.getRawValue().price,
      productCode: this.saveOutChargeForm.getRawValue().productCode,
      productName: this.saveOutChargeForm.getRawValue().productName,
    };
    let that = this;
    if (this.paramModal) {
      param.flag = 'update';
    } else {
      param.flag = 'add';
    }
    if (this.saveOutChargeForm.valid) {
      this.odsysBusinessService.ttpProductEdit(param, function(data){
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
