import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-add-district',
  templateUrl: './add-district.component.html',
})
export class AddDistrictComponent implements OnInit, OnDestroy {
  item: '';
  itemList = [];
  province: '';
  provinceList = [];
  area: '';
  areaList = [];
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
  }
  getAllArea() {
    const that = this;
    let param;
    if (this.province === '') {
      param = {};
    } else {
      param = {provinceCode: this.province};
    }
    this.pageBusinessService.getCitys(param, function(data){
      if (data.success) {
        if (data.obj != null) {
          that.area = '';
          that.areaList = data.obj;
        } else {
          that.areaList = [];
        }
      }
    });
  }
  getAllProject() {
    const that = this;
    const param = {itemType: '' };
    this.pageBusinessService.getAllProject(param, function(data){
      if (data.success) {
        if (data.obj != null) {
          that.item = '';
          that.itemList = data.obj;
        }
      }
    });
  }
  getAllProvince() {
    const that = this;
    this.pageBusinessService.getProvinces({}, function(data){
      if (data.success) {
        if (data.obj != null) {
          that.province = '';
         that.provinceList = data.obj;
         that.getAllArea();
        }
      }
    });
  }
  ok() {
    const that = this;
    if (this.item === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择项目', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.province === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择省份', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.area === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择区域', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const param = { item: this.item, province: this.province, area: this.area };
    this.activeModal.dismiss(param);
  }
  close() {
    this.activeModal.dismiss({ status: 'closed' });
  }
  ngOnInit() {
    this.getAllProject();
    this.getAllProvince();
  }
  ngOnDestroy() {
  }
}
