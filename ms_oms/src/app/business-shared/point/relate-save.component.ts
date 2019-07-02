import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import {areaType} from '../../global-constant';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
@Component({
  selector: 'c-relate-save',
  templateUrl: './relate-save.component.html'
})
export class RelateSaveComponent implements OnInit {

  saveRelateForm: FormGroup;
  relateData: any = "";
  productCode: any =  "";
  productCodes: Array<any>= [];
  sProvinceCode: any = "";
  sProvinceCodes: Array<any>= [];
  sCityCode: any = "";
  sCityCodes: Array<any>= [];
  areaType: any = [{type: 1, name: '省份'}, {type: 2, name: '地市'}];
  area: Array<any>= [areaType[0]];
  areaFlag: any = "";
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private orderBusinessService: OrderBusinessService,
  ) {
    const codeNameFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num, Validators.minLength(1), Validators.maxLength(6)]));
    const aliasNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const projectNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const areaTypeFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveRelateForm = this.formBuilder.group({
      codeName: codeNameFc,
      aliasName: aliasNameFc,
      projectName: projectNameFc,
      areaType: areaTypeFc,
    });
  }
  ngOnInit() {
    let that = this;
    this.getNodeDetail();
    this.getAllProduct();
    this.getProvinces();
    this.saveRelateForm.patchValue({
      areaType: this.area[0].type
    });
    if (this.relateData !== '') {
      this.areaFlag = this.relateData.areaType ;
      this.getDetail();
      this.getCitys();
    }
  }
  nodeData: Array<any> = [];
  getNodeDetail() {
    let that = this;
    this.orderBusinessService.nodeInfoList({},function(data){
      if (data.data.length > 0) {
        that.nodeData = data.data;
      } else {
        that.nodeData = [];
      }
    });
  };
  itemData: Array<any> = [];
  getItem() {
    let that = this;
    let param;
    that.nodeData.forEach(i => {
      if (i.alias === this.saveRelateForm.controls['aliasName'].value) {
        this.saveRelateForm.patchValue({
          codeName: i.nodeCode,
        })
      }
    })
    param = {
      nodeCode: this.saveRelateForm.controls['codeName'].value,
    }
    this.orderBusinessService.getProjectInfoList(param, function(data){
      if (data.length > 0) {
        that.itemData = data;
      } else {
        that.itemData = [];
      }
    });
  }

  /**
   * 上传
   */
  ok(): void {
    let param: any;
    let that = this;
    let provinceNodes: Array<any>= [];
    let productNodes: Array<any>= [];
    let cityNodes: Array<any>= [];
    if (this.relateData !== "") {
      param = {
        nodeCode: this.saveRelateForm.getRawValue().codeName,
        alias: this.saveRelateForm.getRawValue().aliasName,
        project: this.saveRelateForm.getRawValue().projectName,
        areaType: this.saveRelateForm.getRawValue().areaType,
        selectProducts: this.getAbledProductsIds(),
        selectProvinces: this.getAbledProvincesIds(),
        selectCitys: this.getAbledCitysIds(),
      };
      this.orderBusinessService.editRurePost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    }else if (this.saveRelateForm.valid && this.relateData === "") {
      this.sProvinceCodes.forEach(i => {
        if (i.checkState) {
          provinceNodes.push(i.sAreaCode);
        }
      });
      this.productCodes.forEach(i => {
        if (i.checkState) {
          productNodes.push(i.sProductcode);
        }
      });
      this.sCityCodes.forEach(i => {
        if (i.checkState) {
          cityNodes.push(i.cityCode);
        }
      });
      param = {
        nodeCode: this.saveRelateForm.getRawValue().codeName,
        alias: this.saveRelateForm.getRawValue().aliasName,
        project: this.saveRelateForm.getRawValue().projectName,
        areaType: this.saveRelateForm.getRawValue().areaType,
        selectProducts: productNodes.toString(),
        selectProvinces: provinceNodes.toString(),
        selectCitys: cityNodes.toString(),
      };
      if (param.selectProvinces == "" && param.selectCitys == "" ){
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请至少选择一个省市信息!', 3000));
      }else {
        this.orderBusinessService.addRelatePost(param, function(data){
          let msg = data;
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', msg, 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    }else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    }
  }
  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

  isAllChecked() {
    if (this.productCodes.length > 0) {
      return this.productCodes.every(_ => _.checkState);
    }
  }
  productDisabled() {
    if (this.productCodes.length > 0) {
      return this.productCodes.every(_ =>  _.disabled);
    }
  }
  isAllDisabled() {
    if (this.productCodes.length > 0) {
      return this.productCodes.every(_ => _.disabled);
    }
  }

  checkAll($event) {
    this.productCodes.forEach(i => {
      if (!i.disabled) {
        i.checkState = $event.target.checked;
      }
    });
  }
  checkNode($event, index) {
    this.productCodes[index].checkState = $event.target.checked;
  }

  provinceChecked() {
    if (this.sProvinceCodes.length > 0) {
      return this.sProvinceCodes.every(_ => _.checkState);
    }
  }

  provinceDiabled() {
    if (this.sProvinceCodes.length > 0) {
      return this.sProvinceCodes.every(_ => _.disabled);
    }
  }

  provinceCheckAll($event) {
    this.sProvinceCodes.forEach(i => {
      if (!i.disabled) {
        i.checkState = $event.target.checked;
      }
    });
  }
  provinceCheckNode($event, index) {
    this.sProvinceCodes[index].checkState = $event.target.checked;
  }
  cityChecked() {
    if (this.sCityCodes.length > 0) {
      return this.sCityCodes.every(_ => _.checkState);
    }
  }
  cityDisabled() {
    if (this.sCityCodes.length > 0) {
      return this.sCityCodes.every(_ => _.disabled);
    }
  }

  cityCheckAll($event) {
    this.sCityCodes.forEach(i => {
      if (!i.disabled) {
        i.checkState = $event.target.checked;
      }
    });
  }
  cityCheckNode($event, index) {
    this.sCityCodes[index].checkState = $event.target.checked;
  }
  getAllProduct() {
    let that = this;
    this.orderBusinessService.getAllProduct(function(data){
      if (data.length > 0) {
        that.productCodes = data;
      } else {
        that.productCodes = [];
      }if (that.relateData !== "") {
        that.getProjectInfo(that.relateData);
      }
    });
  }
  getProjectInfo(data) {
    let projectInfo = data.projectStr;
    let arr = projectInfo.split(",");
    this.productCodes.forEach(i => {
      for(let n of arr) {
        if (i.sProductName === n) {
          i.checkState = true;
          i.disabled = true;
        }
      }
    });
  }
  getAbledProductsIds() {
    let arr = [];
    this.productCodes.forEach(i => {
      if (i.checkState && !i.disabled) {
        arr.push(i.sProductcode);
      }
    })
    return arr.toString();
  }
  getProvinces() {
    let that = this;
    let singleP;
    this.orderBusinessService.getProvinces(function(data){
      that.sProvinceCodes = [];
      if (data.length > 0) {
        if (that.saveRelateForm.getRawValue().areaType === 1) {
          that.sProvinceCodes = data;
        }else if (that.saveRelateForm.getRawValue().areaType === 2) {
          singleP = data[18];
          that.sProvinceCodes.push(singleP);
        }
      } else {
        that.sProvinceCodes = [];
      }if (that.relateData !== "") {
        that.getProvinceInfo(that.relateData);
      }
    });
  }
  getProvinceInfo(data) {
    let areaInfo = data.areaStr;
    let arr = areaInfo.split(",");
    this.sProvinceCodes.forEach(i => {
      for(let n of arr) {
        if (i.sAreaName === n) {
          i.checkState = true;
          i.disabled = true;
        }
      }
    });
  }
  getAbledProvincesIds() {
    let arr = [];
    this.sProvinceCodes.forEach(i => {
      if (i.checkState && !i.disabled) {
        arr.push(i.sAreaCode);
      }
    })
    return arr.toString();
  }

  getCitys() {
    let that = this;
    this.orderBusinessService.getCitys(function(data){
      if (data.length > 0) {
        that.sCityCodes = data;
      } else {
        that.sCityCodes = [];
      }
      if (that.relateData !== "") {
        that.getCityInfo(that.relateData);
      }
    });
  }
  getCityInfo(data) {
    let areaInfo = data.areaStr;
    let arr = areaInfo.split(",");
    this.sCityCodes.forEach(i => {
      for(let n of arr) {
        if (i.cityName === n) {
          i.checkState = true;
          i.disabled = true;
        }
      }
    });
  }
  getAbledCitysIds() {
    let arr = [];
    this.sCityCodes.forEach(i => {
      if (i.checkState && !i.disabled) {
        arr.push(i.cityCode);
      }
    })
    return arr.toString();
  }
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {nodeCode: this.relateData.nodeCode};
    this.orderBusinessService.detailRelatePost(param, function(data){
      that.detailData = data;
      that.saveRelateForm.patchValue({
        codeName: data.nodeCode,
        aliasName: data.alias,
        projectName: data.project,
        areaType: data.areaType
      });
      that.saveRelateForm.controls['aliasName'].disable();
      that.saveRelateForm.controls['codeName'].disable();
      that.saveRelateForm.controls['projectName'].disable();
      // that.getItem();
    });
  }

}
