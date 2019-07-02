import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { carrierAttr, odSysState } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';


@Component({
  selector: 'c-product-save',
  templateUrl: './product-save.component.html'
})
export class ProductSaveComponent implements OnInit {

  saveProductForm: FormGroup;

  modalData: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private activeBusinessService: ActiveBusinessService,
  ) {
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const resolutionFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const linkFc = new FormControl('', Validators.compose([Validators.required]));
    const productCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)]));
    this.saveProductForm = this.formBuilder.group({
      nodeCode: nodeCodeFc,
      provinceCode: provinceCodeFc,
      projectCode: projectCodeFc,
      resolution: resolutionFc,
      itemCode: itemCodeFc,
      link: linkFc,
      productCode: productCodeFc,
    });
  }

  resolutionData: Array<any> = [{type: 1, value: '标清' }, {type: 2, value: '高清' }];
  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.saveProductForm.patchValue({state: this.stateData[1].type});
    }
    this.nodedetailAuth();
    // this.getItemList();
    // this.getProjects();
    // this.getProvinces();
  }
  nodeData: any;
  nodedetailAuth() {
    let that = this;
    this.activeBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.nodeData = data;
      } else {
        that.nodeData = [];
      }
    });
  }
  itemChange(){
    this.saveProductForm.patchValue({
      itemCode: '',
      provinceCode: '',
      projectCode: '',
    })
    this.itemData = [];
    this.provinces = [];
    this.products = [];
    this.getItemList();
  }
  itemData: any;
  getItemList() {
    let that = this;
    let param = {itemCode: this.saveProductForm.getRawValue().nodeCode};
    // this.getPri(param);
    this.activeBusinessService.getNodeList(param, function(data){
      if (data.length > 0) {
        that.itemData = data;
      } else {
        that.itemData = [];
      }
    });
  }
  getPri() {
    let that = this;
    let param: any = {itemCode: this.saveProductForm.getRawValue().nodeCode};
    param.nodeCode = this.saveProductForm.getRawValue().itemCode;
    this.activeBusinessService.getRelatePri(param, function(data){
      that.provinces = [{provinceCode:'all',name:'全国(全部)'}];
      if (data.length > 0) {
        data.forEach( i => {
          that.provinces.push(i);
        });
      } else {
        that.provinces = [{provinceCode:'all',name:'全国'}];
      }
    });
  }
  getpro(){
    let that = this;
    let param = {
      itemCode: this.saveProductForm.getRawValue().nodeCode,
      provinceCode: this.saveProductForm.getRawValue().provinceCode,
    };
    this.activeBusinessService.getProductPro(param, function(data){
      if (data) {
        that.products = data;
      }
    });
  }

  detailData: any;
  getDetail() {
    if (this.modalData !== '') {
      let that = this;
      this.activeBusinessService.projectDetail({id: this.modalData}, function(data){
        that.detailData = data;
        let date = data.beginTime;
        that.saveProductForm.patchValue({
          nodeCode: data.itemCode,
          provinceCode: data.provinceName,
          // provinceCode: data.provinceCode,
          // projectCode: data.projectCode,
          projectCode: data.projectName,
          // resolution: data.resolution,
          resolution: data.resolutionStr,
          itemCode: data.nodeCode,
          // itemCode: data.itemCode,
          link: data.link,
          productCode: data.productCode,
        });
        that.saveProductForm.controls["nodeCode"].disable();
        that.saveProductForm.controls["itemCode"].disable();
        that.saveProductForm.controls["provinceCode"].disable();
        that.saveProductForm.controls["projectCode"].disable();
        that.saveProductForm.controls["resolution"].disable();
        that.getItemList();
        that.getpro();
      });
    }
  }

  getProjects() {
    let that = this;
    // this.activeBusinessService.getProjects(function(data){
    //   if (data.length > 0) {
    //     that.projects = data;
    //   } else {
    //     that.projects = [];
    //   }
    // });
  }

  updateProduct() {
    let that = this;
    let param = {projectCode: this.saveProductForm.getRawValue().projectCode};
    // this.activeBusinessService.getProducts(param, function(data){
    //   if (data.length > 0) {
    //     that.products = data;
    //   } else {
    //     that.products = [];
    //   }
    // });
  }

  getProvinces() {
    let that = this;
    // this.activeBusinessService.getProvinces(function(data){
    //   if (data.length > 0) {
    //     that.provinces = data;
    //   } else {
    //     that.provinces = [];
    //   }
    // });
  }

  beData:any;
  enData:any;
  ok(): void {
    let that = this;
    let param: any;
    if (this.modalData === '') {
      param = {
        itemCode: this.saveProductForm.getRawValue().nodeCode,
        provinceCode: this.saveProductForm.getRawValue().provinceCode,
        projectCode: this.saveProductForm.getRawValue().projectCode,
        resolution: this.saveProductForm.getRawValue().resolution,
        nodeCode: this.saveProductForm.getRawValue().itemCode,
        link: this.saveProductForm.getRawValue().link,
        productCode: this.saveProductForm.getRawValue().productCode,
      };
    } else {
      param = {
        nodeCode: this.detailData.nodeCode,
        provinceCode: this.detailData.provinceCode,
        projectCode: this.detailData.projectCode,
        resolution: this.detailData.resolution,
        itemCode: this.detailData.itemCode,
        link: this.saveProductForm.getRawValue().link,
        productCode: this.saveProductForm.getRawValue().productCode,
      };
    }

    if (this.modalData !== '') {
      param.id = that.modalData;
    }
    if (this.saveProductForm.valid) {
      this.activeBusinessService.projectSave(param, function(data){
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
