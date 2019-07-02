import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import { objVersion } from '../../global-constant';

import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-objver-save',
  templateUrl: './objver-save.component.html'
})
export class ObjverSaveComponent implements OnInit {

  saveObjForm: FormGroup;

  modalData: any;

  constructor(public activeModal: NgbActiveModal, private entryBusinessService: EntryBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
    const nameFc = new FormControl('', Validators.compose([Validators.required]));
    const versionFc = new FormControl('', Validators.compose([Validators.required]));
    const codeFc = new FormControl('');
    const shortCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));

    this.saveObjForm = this.formBuilder.group({
      name: nameFc,
      version: versionFc,
      code: codeFc,
      shortCode: shortCodeFc,
    });
  }

  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    }
    // this.getAllProduct();
    this.getAllPost();
    this.saveObjForm.controls['code'].disable();
    this.saveObjForm.controls['shortCode'].disable();
  }

  allProduct: Array<any>= [];
  getAllProduct() {
    let that = this;
    this.entryBusinessService.getAllProduct(function(data){
      if (data.length) {
        that.allProduct = data;
      } else {
        that.allProduct = [];
      }
      // that.getProjectInfo();
    });
  }
  verData: Array<any> = [];
  getAllPost() {
    // this.allProduct.forEach( i => {
    //   if (i.productNameVer === this.saveObjForm.controls['name'].value) {
    //     this.saveObjForm.patchValue({
    //       code: i.productVerCode,
    //     });
    //   };
    // })
    let that = this;
    let param = {
      // sProductCode: this.saveObjForm.controls['name'].value,
    }
    this.entryBusinessService.getProductOptionList(param, function(data){
      if (data.length) {
        that.verData = data;
      } else {
        that.verData = [];
      }
      // that.getProjectInfo();
    });
  }
  verStrData: Array<any> = [];
  getVerPost() {
    this.verData.forEach( i => {
      if (i.sProductName === this.saveObjForm.controls['name'].value) {
        this.saveObjForm.patchValue({
          code: i.sProductCode,
          shortCode: i.sProductScode,
        });
      };
    })
    let that = this;
    let param = {
      sProductCode: this.saveObjForm.controls['code'].value,
    }
    this.entryBusinessService.getVersionList(param, function(data){
      if (data.length) {
        that.verStrData = data;
      } else {
        that.verStrData = [];
      }
      // that.getProjectInfo();
    });
  }


  versions: Array<any>= [];
  versionStr: any;
  getVerData () {
    this.versions = [];
    objVersion.forEach(i => {
      let copyI = Object.assign({}, i);
      this.versions.push(copyI);
    });
  }

  getDetailVerData () {
    this.versions = [];
    objVersion.forEach(i => {
      let copyI = Object.assign({}, i);
      if (this.versionStr.indexOf(copyI.value) !== -1) {
        copyI.checkState = true;
        copyI.disabled = true;
      }
      this.versions.push(copyI);
    });
  }

  checkVersion(ev, index) {
    this.versions[index].checkState = ev.target.checked;
  }

  getVer(){
    let ver = [];
    if (this.modalData !== "") {
      this.versions.forEach(i => {
        if (i.checkState && (!i.disabled)) {
          ver.push(i.value);
        }
      });
    } else {
      this.versions.forEach(i => {
        if (i.checkState) {
          ver.push(i.value);
        }
      });
    }
    return ver.toString();
  }

  detailInfo: any;
  getDetail() {
    let that = this;
    let param = {productSCode: this.modalData};
    this.entryBusinessService.getProductDetail(param, function(data){
      that.saveObjForm.patchValue({
        name: data.sProductName,
        code: data.sProductCode,
        shortCode: data.sProductScode,
      });
      that.detailInfo = data;
      that.versionStr = data.sProductVer;
      that.getDetailVerData();
    });
  }

  ok(): void {
    let that = this;
    if (this.saveObjForm.valid) {
      let param = {
        productName : this.saveObjForm.controls["name"].value,
        productCode : this.saveObjForm.controls["code"].value,
        productSCode : this.saveObjForm.controls["shortCode"].value,
        version : this.saveObjForm.controls["version"].value,
      };
      this.entryBusinessService.addProduct(param, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
