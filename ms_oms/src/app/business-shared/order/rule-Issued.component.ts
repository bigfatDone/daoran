import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

@Component({
  selector: 'c-rule-issued',
  templateUrl: './rule-issued.component.html'
})
export class RuleIssuedComponent implements OnInit {

  saveIssuedForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private orderBusinessService: OrderBusinessService,
              private formBuilder: FormBuilder) {

    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const productFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveIssuedForm = this.formBuilder.group({
      nodeCode: nodeCodeFc,
      product: productFc,
      province: provinceFc,
      area: areaFc,
    });
  }

  ngOnInit() {
    let that = this;
    this.getSelectNodePoints();
    this.areasMulData = [{id: 'all', name: '全部'}];
    this.saveIssuedForm.patchValue({
      area: this.areasMulData[0].id,
    })
  }

  nodeCodes: Array<any>= [];
  getSelectNodePoints() {
    let that = this;
    this.orderBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }

  products: Array<any>= [];
  // getProducts() {
  //   let that = this;
  //   let param = {nodeCode: this.saveIssuedForm.getRawValue().nodeCode};
  //   this.orderBusinessService.getCurNodePro(param, function(data){
  //     if (data) {
  //       that.products = data.projectCodeList;
  //       that.provinces = data.provinceList;
  //     } else {
  //       that.areas = [];
  //     }
  //   });
  // }
  getAlls() {
    this.getpri();
    this.provinces = [];
    this.products = [];
    this.saveIssuedForm.patchValue({
      province: '',
      product: '',
    })
  }

  getpri() {
    let that = this;
    let param = {
      itemCode: this.saveIssuedForm.getRawValue().nodeCode,
    };
    this.orderBusinessService.projectProvince(param, function(data){
      if (data) {
        that.provinces = data;
      } else {
        that.areas = [];
      }
    });
  }
  getpro() {
    let that = this;
    let param = {
      itemCode: this.saveIssuedForm.getRawValue().nodeCode,
      provinceCode: this.saveIssuedForm.getRawValue().province,
    };
    this.orderBusinessService.projectProvinceProduct(param, function(data){
      if (data) {
        that.products = data;
      }
    });
  }

  provinces: Array<any>= [];

  areas: Array<any>= [];
  areasMulData: IMultiSelectOption[] = [];
  getAreas() {
    this.products = [];
    this.saveIssuedForm.patchValue({
      product: '',
    });
    this.getpro();
    this.areas = [];
    let that = this;
    if (this.saveIssuedForm.getRawValue().province !== "") {
      let param = {provinceCode: this.saveIssuedForm.getRawValue().province};
      this.orderBusinessService.getCurCitys(param, function(data){
        if (data !== null) {
          that.areas = data;
        } else {
          that.areas = [];
        }
        that.getAreasMulData();
      });
    }
  }

  getAreasMulData() {
    this.areasMulData = [];
    let arr = [];
    arr.push({id: 'all', name: '全部'});
    this.areas.forEach(i => arr.push({id: i.sAreaCode, name: i.sAreaName}));
    arr.push({id: 'else', name: '其他'});
    this.areasMulData = arr;
  }

  mulTexts: IMultiSelectTexts = {
    defaultTitle: "请先选择省份"
  };

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 25,
  };


  ok(): void {
    let newNodeCode = {};
    this.nodeCodes.forEach( i => {
      if (this.saveIssuedForm.getRawValue().nodeCode === i.sProjectCode) {
        newNodeCode = {"sNodeCode": i.sProjectCode, name: i.sProject};
      }
    });

    let newProjects = {};
    this.products.forEach( i => {
      if (this.saveIssuedForm.getRawValue().product === i.productCode) {
        newProjects = {"sProjectCode": i.productCode, name: i.name};
      }
    });

    let newProvince = {};
    this.provinces.forEach( i => {
      if (this.saveIssuedForm.getRawValue().province === i.provinceCode) {
        newProvince = {"sProvinceCode": i.provinceCode, name: i.name};
      }
    });

    let newAreas = [];
    if (this.saveIssuedForm.getRawValue().area.indexOf('all') !== -1 && this.saveIssuedForm.getRawValue().area.length > 1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      this.toastService.toast(toastCfg);
      return;
    }
    this.areasMulData.forEach( i => {
      if (this.saveIssuedForm.getRawValue().area.indexOf(i.id) !== -1) {
        newAreas.push({"sAreas": i.id, name: i.name});
      }
    });
    if (this.saveIssuedForm.valid) {
      this.activeModal.close({
        sNodeCode: newNodeCode,
        sProjects: newProjects,
        sProvince: newProvince,
        sAreas: newAreas,
      });
      this.close();
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择完整的信息', 2000));
    }
  }


  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
