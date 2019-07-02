import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import { objVersion } from '../../global-constant';

import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-relate-save',
  templateUrl: './relate-save.component.html'
})
export class RelateSaveComponent implements OnInit{

  saveRelateForm: FormGroup;

  modalData: any;

  constructor(public activeModal: NgbActiveModal, private entryBusinessService: EntryBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
    const nameFc = new FormControl('', Validators.compose([Validators.required]));
    const objFc = new FormControl('', Validators.compose([Validators.required]));

    this.saveRelateForm = this.formBuilder.group({
      name: nameFc,
      obj: objFc,
    });
  }

  ngOnInit() {
    this.getRelateProjectsNames();
    this.getRelateProjectsCodes();
    this.getProvincesData();

    if (this.modalData !== '') {
      this.getDetail();
      this.saveRelateForm.controls["name"].disable();
      this.saveRelateForm.controls["obj"].disable();
    }
  }

  names: Array<any>= [];
  name: any = "";

  getRelateProjectsNames() {
    let that = this;
    this.entryBusinessService.getRelateProjects({}, function(data){
      if (data.length > 0) {
        that.names = data;
      } else {
        that.names = [];
      }
    });
  }

  objs: Array<any>= [];
  obj: any = "";

  getRelateProjectsCodes() {
    let that = this;
    this.entryBusinessService.getAllProduct(function(data){
      if (data.length > 0) {
        that.objs = data;
      } else {
        that.objs = [];
      }
    });
  }

  provinces: Array<any>= [];

  getProvincesData() {
    let that = this;
    this.entryBusinessService.getRelateProvinces(function(data) {
      if (data.length > 0) {
        that.provinces = data;
        if (that.modalData !== "") {
          that.getProvinceInfo(that.modalData);
        }
      } else {
        that.provinces = [];
      }
    });
  }

  getProvinceInfo(data) {
    let areaInfo = data.provinceStr;
    let arr = areaInfo.split(",");
    this.provinces.forEach(i => {
      for(let n of arr) {
        if (i.sAreaName === n) {
          i.checkState = true;
          i.disabled = true;
        }
      }
    });
  }

  getProvincesIds() {
    let arr = [];
    this.provinces.forEach(i => {
      if (i.checkState) {
        arr.push(i.iAreaId);
      }
    })
    return arr.toString();
  }

  getAbledProvincesIds() {
    let arr = [];
    this.provinces.forEach(i => {
      if (i.checkState && !i.disabled) {
        arr.push(i.iAreaId);
      }
    })
    return arr.toString();
  }

  provincesDetailData(idArr) {
    if (idArr) {
      this.provinces.forEach(i => {
        if (idArr.indexOf(i.sAreaCode) !== -1) {
          i.checkState = true;
          i.disabled = true;
        }
      });
    }
  }

  checkAll($event) {
    this.provinces.forEach(i => {
      if (!i.disabled) {
        i.checkState = $event.target.checked;
      }
    });
  }

  isAllChecked() {
    if (this.provinces.length > 0) {
      return this.provinces.every(_ => _.checkState);
    }
  }

  isAllDisabled() {
    if (this.provinces.length > 0) {
      return this.provinces.every(_ => _.disabled);
    }
  }

  checkSingle($event, index) {
    this.provinces[index].checkState = $event.target.checked;
  }

  getDetail() {
    let that = this;
    let param = {ppId: this.modalData.ppId};
    this.entryBusinessService.getRelateInfo(param, function(data){
      if (data) {
        that.saveRelateForm.patchValue({
          name: data.projectCode,
          obj: that.modalData.productCode,
        });
        that.provincesDetailData(that.modalData.provinceCodeList);
      };
    });
  }

  ok(): void {
    let that = this;
    if (this.modalData !== "") {
      let param = {
        ppId: this.modalData.ppId,
        selectProvince: this.getAbledProvincesIds()
      };
      this.entryBusinessService.editRelateList(param, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
        that.close();
      });
    } else if (this.saveRelateForm.valid && this.modalData === "") {
      let param = {
        sProjectCode: this.saveRelateForm.controls["name"].value,
        sProductCode: this.saveRelateForm.controls["obj"].value,
        selectProvinces: this.getProvincesIds(),
      };
      if (param.selectProvinces =="") {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请至少选择一个省份信息!', 3000));
      } else {
        this.entryBusinessService.saveRelateList(param, function(data){
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000));
          that.close();
        });
      }
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
