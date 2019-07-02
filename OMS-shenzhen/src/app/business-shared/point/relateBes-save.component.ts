import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import {areaType} from '../../global-constant';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
@Component({
  selector: 'c-relateBes-save',
  templateUrl: './relateBes-save.component.html'
})
export class RelateBesSaveComponent implements OnInit {

  saveRelateBesForm: FormGroup;
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
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveRelateBesForm = this.formBuilder.group({
      itemCode: itemCodeFc,
      nodeCode: nodeCodeFc,
    });
  }
  ngOnInit() {
    let that = this;
    this.getProvinces();
    this.getItemList();
    this.getNodeList();
    this.saveRelateBesForm.patchValue({
      // areaType: this.area[0].type
    });
    if (this.relateData !== '') {
      this.saveRelateBesForm.controls['itemCode'].disable();
      this.saveRelateBesForm.controls['nodeCode'].disable();
      this.getDetail();
    }
  }

  itemListData: Array<any> = [];
  nodeListData: Array<any> = [];
  getItemList() {
    let that = this;
    let param = {}
    this.orderBusinessService.itemInfoList(param, function(data){
      if (data.data.length > 0) {
        that.itemListData = data.data;
      } else {
        that.itemListData = [];
      }
    });
  }
  getNodeList() {
    let that = this;
    let param = {}
    this.orderBusinessService.nodeInfoList(param, function(data){
      if (data.data.length > 0) {
        that.nodeListData = data.data;
      } else {
        that.nodeListData = [];
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
        projectCode: this.saveRelateBesForm.getRawValue().itemCode,
        nodeCode: this.saveRelateBesForm.getRawValue().nodeCode,
        provinceCodeStrs: this.getAbledProvincesIds(),
      };
      this.orderBusinessService.proNodeUpdate(param, function(data){
        let msg = data.msg;
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', msg, 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    }else if (this.saveRelateBesForm.valid && this.relateData === "") {
      this.sProvinceCodes.forEach(i => {
        if (i.checkState) {
          provinceNodes.push(i.sAreaCode);
        }
      });
      param = {
        projectCode: this.saveRelateBesForm.getRawValue().itemCode,
        nodeCode: this.saveRelateBesForm.getRawValue().nodeCode,
        provinceCodeStrs: provinceNodes.toString(),
      };
      if (param.selectProvinces === "") {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请至少选择一个省市信息!', 3000));
      }else {
        this.orderBusinessService.proNodeAdd(param, function(data){
          let msg = data.msg;
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
    this.orderBusinessService.getProvinces(function(data){
      that.sProvinceCodes = [];
      if (data.length > 0) {
       that.sProvinceCodes = data;
       } else {
        that.sProvinceCodes = [];
      }
      if (that.relateData !== "") {
        that.getProvinceInfo(that.relateData);
      }
    });
  }
  getProvinceInfo(data) {
    let areaInfo = data.provinceCodeStrs;
    let arr = areaInfo.split(",");
    this.sProvinceCodes.forEach(i => {
      for(let n of arr) {
        if (i.sAreaCode === n) {
          i.checkState = true;
        }
      }
    });
  }
  getAbledProvincesIds() {
    let arr = [];
    this.sProvinceCodes.forEach(i => {
      if (i.checkState) {
        arr.push(i.sAreaCode);
      }
    })
    return arr.toString();
  }
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {
      projectCode: this.relateData.projectCode,
      nodeCode: this.relateData.nodeCode,
    };
    this.orderBusinessService.proNodeDetial(param, function(data){
      that.detailData = data;
      that.saveRelateBesForm.patchValue({
        itemCode: data.projectCode,
        nodeCode: data.nodeCode,
      });
    });
  }

}
