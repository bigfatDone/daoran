import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';
import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-project-save',
  templateUrl: './project-save.component.html'
})
export class ProjectSaveComponent implements OnInit {

  saveProjectForm: FormGroup;

  modalData: any= '';
  projectTypeData:Array<any>= [{type: '0', name: '非OTT'}, {type: '1', name: 'OTT'}];

  constructor(public activeModal: NgbActiveModal,
              private orderBusinessService: OrderBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    const projectTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveProjectForm = this.formBuilder.group({
      itemCode: itemCodeFc,
      provinceCode: provinceCodeFc,
      projectType: projectTypeFc,
    });
  }

  ngOnInit() {
    if (this.modalData !== "") {
      this.getDetail();
    } else {
      this.saveProjectForm.get(['projectType']).setValue('0')
      this.getAllProduct();
    }
    this.getAllItem();
    // this.getProvinces();
  }
  detailData: any = null;
  productCodeStr: any = '';
  getDetail () {
    let that = this;
    let param = {
      id: this.modalData.id,
      projectCode: this.modalData.projectCode,
      provinceCode: this.modalData.provinceCode,
    };
    this.orderBusinessService.detailProjectProvinceProduce(param, function(data){
      that.detailData = data;
      that.saveProjectForm.patchValue({
        projectType: data.projectType,
        itemCode: data.projectCode,
        provinceCode: data.provinceCode,
      });
      that.productCodeStr = data.productCodes;
      that.saveProjectForm.controls["projectType"].disable();
      that.saveProjectForm.controls["itemCode"].disable();
      that.saveProjectForm.controls["provinceCode"].disable();
      that.getAllProduct();
      that.getProvinces();
    });
  }
  itemData: Array<any>= [];
  getAllItem() {
    let that = this;
    let param: any;
    this.orderBusinessService.getAllProjectInfoList({projectType: this.saveProjectForm.get(['projectType']).value}, function(data){
      if (data.length) {
        that.itemData = data;
      } else {
        that.itemData = [];
      }
    });
  }

  allProduct: Array<any>= [];
  getAllProduct() {
    let that = this;
    let param: any;
    this.orderBusinessService.getAllProductParam({projectType: this.saveProjectForm.get(['projectType']).value}, function(data){
      if (data.length) {
        that.allProduct = data;
      } else {
        that.allProduct = [];
      }
      that.renderProject(data);
    });
  }

  renderProject(data) {
    let proArr = [];
    proArr = this.productCodeStr.split(',');
    data.forEach( i => {
      for (let n of proArr) {
        if (n === i.sProductCode) {
          i.checkState = true;
        }
      }
    });
  }

  // provincesList: Array<any>= [];
  getItemPro() {
    let that = this;
    this.itemData = [];
    this.provincesList = [];
    this.saveProjectForm.get(['itemCode']).setValue('');
    this.saveProjectForm.get(['provinceCode']).setValue('');
    this.getAllItem();
    this.getAllProduct();
  }
  provincesList: Array<any>= [];
  getProvinces() {
    let that = this;
    let param: any = {
      projectCode: this.saveProjectForm.controls['itemCode'].value,
    };
    this.orderBusinessService.getProvincesNew(param, function(data){
      if (data.length > 0) {
        that.provincesList = data;
      } else {
        that.provincesList = [];
      }
    });
  }


  checkAll($event) {
    this.allProduct.forEach(i => {
      if (!i.disabled) {
        i.checkState = $event.target.checked;
      }
    });
  }

  isAllChecked() {
    if (this.allProduct.length > 0) {
      return this.allProduct.every(_ => _.checkState);
    }
  }

  isAllDisabled() {
    if (this.allProduct.length > 0) {
      return this.allProduct.every(_ => _.disabled);
    }
  }

  checkSingle($event, index) {
    this.allProduct[index].checkState = $event.target.checked;
  }

  ok(): void {
    let that = this;
    let param: any;
    let ids: Array<any>= [];
    if (this.allProduct.length > 0) {
      this.allProduct.forEach(i => {
        if ( i.checkState ) {
          ids.push(i.sProductCode);
        }
      });
    }
    param = {
      projectCode: this.saveProjectForm.controls["itemCode"].value,
      provinceCode: this.saveProjectForm.controls["provinceCode"].value,
      productCodes: ids.toString()
    };
    if (this.modalData !== '') {
      param.id = this.modalData.id;
    }
    if (this.saveProjectForm.controls["itemCode"].value !== '' && this.saveProjectForm.controls["provinceCode"].value !== '') {
      this.orderBusinessService.editProjectProvinceProduce(param, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000));
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
