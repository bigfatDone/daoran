import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import {areaType, pageResType} from '../../global-constant';
import {WebsiteBusinessService} from '../../business-service/website/website-business.service';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
@Component({
  selector: 'c-rurelate-save',
  templateUrl: './rurelate-save.component.html'
})
export class RurelateSaveComponent implements OnInit {

  saveRurelateForm: FormGroup;
  modalData: any="";
  productCode: any =  "";
  productCodes: Array<any>= [];
  sProvinceCode: any = "";
  sProvinceCodes: Array<any>= [];
  areaType: any = [{type: 1, name: '省份'}, {type: 2, name: '地市'}];
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private orderBusinessService: OrderBusinessService) {
    const codeNameFc = new FormControl('', Validators.compose([Validators.required]));
    const aliasNameFc = new FormControl('', Validators.compose([Validators.required]));
    const projectNameFc = new FormControl('', Validators.compose([Validators.required]));
    // const selectProductsNameFc = new FormControl('', Validators.compose([Validators.required]));
    // const selectProvincesNameFc = new FormControl('', Validators.compose([Validators.required]));
    // const bgImageUrlFc = new FormControl('', Validators.compose([Validators.required]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveRurelateForm = this.formBuilder.group({
      codeName: codeNameFc,
      aliasName: aliasNameFc,
      projectName: projectNameFc,
    });
  }
  ngOnInit() {
    this.getNodeDetail();
    this.getAllProduct();
    this.getProvinces();
    if (this.modalData !== "") {
      this.getDetail();
      this.saveRurelateForm.controls['aliasName'].disable();
      this.saveRurelateForm.controls['projectName'].disable();
      }
    this.saveRurelateForm.controls['codeName'].disable();
  }

  nodeData: Array<any> = [];
  getNodeDetail() {
    let that = this;
    this.orderBusinessService.getNodeDetail(function(data){
      if (data.length > 0) {
        that.nodeData = data;
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
      if (i.alias === this.saveRurelateForm.controls['aliasName'].value) {
        this.saveRurelateForm.patchValue({
          codeName: i.nodeCode,
        })
      }
    })
    param = {
      nodeCode: this.saveRurelateForm.controls['codeName'].value,
    }
    this.orderBusinessService.getProjectInfoList(param, function(data){
      if (data.length > 0) {
        that.itemData = data;
      } else {
        that.itemData = [];
      }
    });
  }
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {nodeCode: this.modalData.nodeCode};
    this.orderBusinessService.rurelateDetailPost(param, function(data){
      that.detailData = data;
      that.saveRurelateForm.patchValue({
        codeName: data.nodeCode,
        aliasName: data.alias,
        projectName: data.project,
      });
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
    if (this.saveRurelateForm.getRawValue().selectProductsName === "") {
      this.saveRurelateForm.removeControl('selectProductsName');
    }
    if (this.saveRurelateForm.getRawValue().selectProvincesName === "") {
      this.saveRurelateForm.removeControl('selectProvincesName');
    }
    if (this.modalData !== "") {
      param = {
        nodeCode: this.saveRurelateForm.getRawValue().codeName,
        alias: this.saveRurelateForm.getRawValue().aliasName,
        project: this.saveRurelateForm.getRawValue().projectName,
        selectProducts: this.getAbledProductsIds(),
        selectProvinces: this.getAbledProvincesIds(),
      };
      this.orderBusinessService.editRurelatePost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    }else if (this.saveRurelateForm.valid && this.modalData === "") {
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
      param = {
        nodeCode: this.saveRurelateForm.getRawValue().codeName,
        alias: this.saveRurelateForm.getRawValue().aliasName,
        project: this.saveRurelateForm.getRawValue().projectName,
        selectProducts: productNodes.toString(),
        selectProvinces: provinceNodes.toString(),
      };
      if (param.selectProvinces == ""){
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请至少选择一个省市信息!', 3000));
      }else {
        this.orderBusinessService.addRurelatePost(param, function(data){
          let msg = data.msg;
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', msg, 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    }else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整!', 2000));
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
  projectDisabled() {
    if (this.productCodes.length > 0) {
      return this.productCodes.every(_ => _.disabled);
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

  provinceDisabled() {
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
  provinceDiabled() {
    if (this.sProvinceCodes.length > 0) {
      return this.sProvinceCodes.every(_ => _.disabled);
    }
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
      }if (that.modalData !== "") {
        that.getProjectInfo(that.modalData);
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
      if (data.length > 0) {
        that.sProvinceCodes = data;
      } else {
        that.sProvinceCodes = [];
      }if (that.modalData !== "") {
        that.getProvinceInfo(that.modalData);
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

}
