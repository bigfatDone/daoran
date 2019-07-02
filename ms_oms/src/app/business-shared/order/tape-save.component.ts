import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { orderRuleStrategy, orderRuleSource, orderRuleWeek, timeFrame } from '../../global-constant';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { RuleIssuedComponent } from './rule-Issued.component';
import { OrderBusinessService } from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-tape-save',
  templateUrl: './tape-save.component.html',
  styleUrls: ['./tape-save.component.scss'],
})
export class TapeSaveComponent implements OnInit, OnDestroy{

  modalData: any = "";

  saveTapeForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private orderBusinessService: OrderBusinessService,
              private formBuilder: FormBuilder) {
    const pointFc = new FormControl('', Validators.compose([Validators.required]));
    const productFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl('', Validators.compose([Validators.required]));
    const strategyFc = new FormControl('', Validators.compose([Validators.required]));
    const sourceFc = new FormControl([], Validators.compose([Validators.required]));
    const weekFc = new FormControl([], Validators.compose([Validators.required]));
    // const limitFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLimit]));
    const limitFc = new FormControl('', Validators.compose([Validators.required]));
    const percentFc = new FormControl(100, Validators.compose([Validators.required, CustomValidators.numLimit100]));

    this.saveTapeForm = this.formBuilder.group({
      point: pointFc,
      product: productFc,
      province: provinceFc,
      limit: limitFc
    });
  }

  ngOnInit() {
    // this.getAllProduct();
    // this.getProvinces();
    // this.resetSources();
    // this.resetWeeks();
    // this.getDetail();
    if (this.modalData !== "") {
      this.getDetail();
    } else {
      this.getSelectNodePoints();
    }
    // else {
    //   this.saveTapeForm.controls["point"].disable();
    //   this.saveTapeForm.controls["product"].disable();
    // }
  }

  ngOnDestroy() {
  }

  nodeCode: any = "";
  nodeCodes: Array<any>= [];
  productCode: any = "";
  productCodes: Array<any>= [];
  sProvinceCode: any = "";
  sProvinceCodes: Array<any>= [];

  orderRuleDetail: any;
  getDetail() {
    let that = this;
    if (this.modalData) {
      let param = {id: this.modalData.id};
      this.orderBusinessService.detailsGrail(param, function(data){
        if (data) {
          that.orderRuleDetail = data;
          // that.getNodeDetail({nodeCode: data.nodeCode});
          that.saveTapeForm.patchValue({
            point: data.itemCode,
            product: data.projectCode,
            province: data.provinceCode,
            // area: data.sAreas.split(","),
            // province: data.sProvinceCode,
            // strategy: data.iType,
            limit: data.percentLimit,
          });
          that.getSelectNodePoints();
          that.getpri();
          that.getpro();
        }
      });
    }
  }

  getSelectNodePoints() {
    let that = this;
    // this.orderBusinessService.getNodeDetail(function(data){
    this.orderBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }

  // getAllProduct() {
  //   let that = this;
  //   this.orderBusinessService.getAllProduct(function(data){
  //     if (data.length > 0) {
  //       that.productCodes = data;
  //     } else {
  //       that.productCodes = [];
  //     }
  //   });
  // }
  //
  // getProvinces() {
  //   let that = this;
  //   this.orderBusinessService.getProvinces(function(data){
  //     if (data.length > 0) {
  //       that.sProvinceCodes = data;
  //     } else {
  //       that.sProvinceCodes = [];
  //     }
  //   });
  // }

  nodeCodeChange () {
    let itemCode = '';
    this.sProvinceCodes = [];
    this.productCodes = [];
    this.saveTapeForm.patchValue({
      province: '',
      product: '',
    })
    itemCode = this.saveTapeForm.controls['point'].value;
    this.getpri();
  }
  // getNodeDetail (param) {
  //   let that = this;
  //   this.orderBusinessService.getNodeDetailApiServce(param, function(data){
  //     // console.log(data);
  //     that.productCodes = data.projectCodeList;
  //     that.saveTapeForm.patchValue({
  //       projectCode: ''
  //       // projectCode: that.projectCodeList[0].id
  //     });
  //     that.sProvinceCodes = data.provinceList;
  //   });
  // }

  getpri(){
    let that = this;
    let param = {
      itemCode: this.saveTapeForm.controls['point'].value,
    };
    if (this.modalData !== '' && this.saveTapeForm.controls['point'].value === that.orderRuleDetail.itemCode){
      param.itemCode = that.orderRuleDetail.itemCode;
    }
    this.orderBusinessService.projectProvince(param, function(data){
      if (data) {
        that.sProvinceCodes = data;
        // if (that.modalData !== '') {
        //   that.saveTapeForm.patchValue({
        //     province: that.orderRuleDetail.provinceCode,
        //     // projectCode: that.projectCodeList[0].id
        //   });
        // }
      } else {
        // that.areas = [];
      }
    });
  }
  proChange() {
    let that = this;
    that.productCodes = [];
    that.saveTapeForm.patchValue({
      product: '',
    })
    this.getpro();
  }

  getpro() {
    let that = this;
    let param;
    if (this.modalData !== '' && this.saveTapeForm.controls['point'].value === that.orderRuleDetail.itemCode && this.saveTapeForm.controls['province'].value === that.orderRuleDetail.provinceCode) {
      param = {
        itemCode: that.orderRuleDetail.itemCode,
        provinceCode: that.orderRuleDetail.provinceCode,
      };
    } else {
      param = {
        itemCode: this.saveTapeForm.controls['point'].value,
        provinceCode: this.saveTapeForm.controls['province'].value,
      };
    }
    this.orderBusinessService.projectProvinceProduct(param, function(data){
      if (data) {
        that.productCodes = data;
        // if (that.modalData !== '') {
        //   that.saveTapeForm.patchValue({
        //     product: that.orderRuleDetail.projectCode
        //     // projectCode: that.projectCodeList[0].id
        //   });
        // }
      }
    });
  }


  ok(): void {
    let that = this;
    let param: any;
    if (this.saveTapeForm.valid) {
      param = {
        itemCode: this.saveTapeForm.getRawValue().point,
        projectCode: this.saveTapeForm.getRawValue().product,
        provinceCode: this.saveTapeForm.getRawValue().province,
        percentLimit: this.saveTapeForm.getRawValue().limit,
      };
      if (this.modalData !== "") {
        param.id = this.modalData.id;
        param.status = this.modalData.status;
        this.orderBusinessService.editOrderGrail(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '修改成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        // param.jsonData = JSON.stringify(jsonData);
        this.orderBusinessService.addOrderGrail(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '添加成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整!', 2000));
    }

  }


  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
