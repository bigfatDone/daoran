import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AddEntryKindComponent } from './add-entry-kind.component';
import { AddEntryKindvalueComponent } from './add-entry-kindvalue.component';
import {Router} from '@angular/router';
@Component({
  selector: 'c-visit-save',
  templateUrl: './visit-save.component.html'
})
export class VisitSaveComponent implements OnInit, OnDestroy {

  addOrEditProgramForm: FormGroup;

  drawFlag = true;
  windowUrl: any;
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private ngbModalService: NgbModal,
    private entryBusinessService: EntryBusinessService,
    private router: Router,
  ) {
    const entryNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    // const seqnoFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2), CustomValidators.number]));
    const seqnoFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));
    const accessPathFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(999)]));
    const projectFc = new FormControl('', Validators.compose([Validators.required]));
    const productScodeFc = new FormControl('', Validators.compose([Validators.required]));
    const productVerFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const cityCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const sLevel1Fc = new FormControl('', Validators.compose([Validators.required]));
    const level1ValueFc = new FormControl('', Validators.compose([Validators.required]));
    const enterDescribeFc = new FormControl('');

    this.addOrEditProgramForm = this.formBuilder.group({
      entryName: entryNameFc,
      projectCode: projectFc,
      productScode: productScodeFc,
      productVer: productVerFc,
      provinceCode: provinceCodeFc,
      cityCode: cityCodeFc,
      sLevel1: sLevel1Fc,
      level1Value: level1ValueFc,
      seqno: seqnoFc,
      accessPath: accessPathFc,
      enterDescribe: enterDescribeFc,
    });
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/visitList") >= 0 ) {
      this.drawFlag = false;
    }
  }
  productVerList: Array<any> = [{name: '高清', ver: 'H'},{name: '标清', ver: 'S'},{name: '安卓', ver: 'A'}];

  modalType: String = '';
  modalData: any = {};
  projectsList: Array<any> = []; // 项目
  slevel1List: Array<any> = []; // 入口分类

  getSlevel1() {
    let that = this;
    this.entryBusinessService.getSlevel1Service({}, function(data){
      if (data.length > 0) {
        that.slevel1List = data;
      } else {
        that.slevel1List = [];
      }
    });
  }

  addOrEditModal: any = null;
  addOrEditKindValModal: any = null;
  ngOnDestroy() {
    if (this.addOrEditModal != null) {
      this.addOrEditModal.close();
    }
    if (this.addOrEditKindValModal != null) {
      this.addOrEditKindValModal.close();
    }
  }
  ngOnInit() {
    if (this.modalType === 'edit') {
      this.getDetail();
      } else if (this.modalType === 'add') {
      this.firstLoad = false;
      if (!this.drawFlag) {
        this.getProducts();
        this.getProvince(true);
      }
    }
  }

  getProjects() {
    let that = this;
    this.entryBusinessService.projectAuth({}, function(data){
      if (data.length > 0) {
        that.projectsList = data;
      } else {
        that.projectsList = [];
      }
    });
  }
  productList: Array<any>= [];
  pProduct: any = "";
  getProducts() {
    let that = this;
    this.entryBusinessService.getProductAreaListPost({}, function(data){
      if (data.length > 0) {
        that.productList = data;
      } else {
        that.productList = [];
      }
    });
  }
  // provincesList: Array<any>= [];
  // pProvinces: any = "";
  // getProvinces() {
  //   let that = this;
  //   this.entryBusinessService.getProvinces(function(data){
  //     if (data.length > 0) {
  //       that.provincesList = data;
  //     } else {
  //       that.provincesList = [];
  //     }
  //   });
  // }

  addOrEditKind (type) {
    this.addOrEditModal = this.ngbModalService.open(AddEntryKindComponent);
    this.addOrEditModal.componentInstance.modalType = type;
    this.addOrEditModal.result.then((result) => {
    }, (reason) => {
      this.getSlevel1();
    });
  }

  addOrEditKindValue (type) {
    this.addOrEditKindValModal = this.ngbModalService.open(AddEntryKindvalueComponent);
    this.addOrEditKindValModal.componentInstance.modalType = type;
    this.addOrEditKindValModal.result.then((result) => {
    }, (reason) => {
      this.getSLevel1Value();
    });
  }

  firstLoad: Boolean = true;
  detailData: any = {};
  getDetail () { // 修改获取详情
    let that = this;
    let param = {
      iId: that.modalData.iId
    };
    that.entryBusinessService.getEnterManageInfoService(param, function(data){
      that.detailData = data;
      that.addOrEditProgramForm.patchValue({
        entryName: data.sEntryName,
        projectCode: data.sProjectCode,
        productScode: data.sProductScode,
        productVer: data.sProductVer,
        provinceCode: data.sProvinceCode,
        cityCode: data.sCityCode,
        sLevel1: data.sLevel1,
        level1Value: data.sLevel1Value,
        seqno: data.sSeqno,
        accessPath: data.sAccessPath,
        enterDescribe: data.sEnterDescribe,
      });
      if (that.drawFlag) {
        that.getProjectObj(that.firstLoad);
        that.getProductDetail(that.firstLoad);
        that.getProvince(that.firstLoad);
        that.getProvinceDetail(that.firstLoad);
        that.getSLevel1Value();
        that.firstLoad = false;
      } else if ( !that.drawFlag) {
        that.getProducts()
        that.getProvince(that.firstLoad);
        that.getProvinceDetail(that.firstLoad);
        that.getSLevel1Value();
      }
    });
  }

  projectNameChange () { // 项目变化
    // this.getProjectObj(false);
    this.getProvince(false);
  }

  getProjectObjData: Array<any> = [];
  getProjectObj (isFirst) { // 获取产品
    let that = this;
    let param = {
      projectCode : this.addOrEditProgramForm.controls['projectCode'].value,
      provinceCode: this.addOrEditProgramForm.controls['provinceCode'].value
    }
    this.entryBusinessService.getEnterProductList(param, function(data){
      if (data.productsData.length > 0) {
        that.getProjectObjData = data.productsData;
        if (!isFirst) {
          that.addOrEditProgramForm.patchValue({
            // productScode: data.productsData[0].sProductScode,
            productScode: '',
            productVer: '',
            // provinceCode: '',
            // cityCode: '',
          });
          // that.getProductDetail(false);
          that.productDetailData = [];
          // that.provinceData = [];
          // that.provinceDetailData = [];
        }
      } else {
        that.getProjectObjData = [];
        that.addOrEditProgramForm.patchValue({
          productScode: '',
          productVer: '',
          // provinceCode: '',
          // cityCode: '',
        });
        that.productDetailData = [];
        // that.provinceData = [];
        // that.provinceDetailData = [];
        // that.getProductDetail(false);
      }
    });
  }

  projectObjChange () { // 产品变化
    // let productScode = this.addOrEditProgramForm.controls['productScode'].value;
    this.getProductDetail(false);
  }

  productDetailData: Array<any> = [];
  getProductDetail (isFirst) { // 获取产品版本
    let that = this;
    let param = {
      projectCode: this.addOrEditProgramForm.controls['projectCode'].value,
      productScode: this.addOrEditProgramForm.controls['productScode'].value
    }
    this.entryBusinessService.getEnterVer(param, function(data){
      if (data.produlver.length > 0) {
        that.productDetailData = data.produlver;
        if (!isFirst) {
          that.addOrEditProgramForm.patchValue({
            productVer: '',
            // provinceCode: '',
            // cityCode: '',
            // productVer: data.produlver[0].value,
          });
          // that.getProvince(false);
          // that.provinceData = [];
          // that.provinceDetailData = [];
        }
      } else {
        that.productDetailData = [];
        that.addOrEditProgramForm.patchValue({
          productVer: '',
          // provinceCode: '',
          // cityCode: '',
        });
        // that.getProvince(false);
        // that.provinceData = [];
        // that.provinceDetailData = [];
      }
    });
  }

  productVerChange () { // 产品版本变化
    // this.getProvince(false);
  }

  provinceData: Array<any> = [];
  getProvince (isFirst) { // 获取省份
    let that = this;
    let param;
    if (!this.drawFlag) {
      this.entryBusinessService.getProvinces(function(data){
        if (data.length > 0) {
          that.provinceData = data;
          if (!isFirst) {
            that.addOrEditProgramForm.patchValue({
              provinceCode: '',
              cityCode: '',
              productScode: '',
              productVer: '',
            });
            // that.getProvinceDetail(false);
            // that.provinceData = [];
            that.provinceDetailData = [];
            that.getProjectObjData = [];
            that.productDetailData = [];
          }
        } else {
          // that.provinceData = [];
          that.addOrEditProgramForm.patchValue({
            provinceCode: '',
            cityCode: '',
            productScode: '',
            productVer: '',
          });
          // that.getProvinceDetail(false);
          that.provinceDetailData = [];
          that.getProjectObjData = [];
          that.productDetailData = [];
        }
      });
    } else {
      param = {
        projectCode: this.addOrEditProgramForm.controls['projectCode'].value,
        // productScode: this.addOrEditProgramForm.controls['productScode'].value,
        // sProductVer: this.addOrEditProgramForm.controls['productVer'].value,
      }
      this.entryBusinessService.getEnterProvinces(param, function(data){
        if (data.privincesData.length > 0) {
          that.provinceData = data.privincesData;
          if (!isFirst) {
            that.addOrEditProgramForm.patchValue({
              provinceCode: '',
              cityCode: '',
              productScode: '',
              productVer: '',
              // provinceCode: data.privincesData[0].sAreaCode,
            });
            // that.getProvinceDetail(false);
            that.provinceDetailData = [];
            that.getProjectObjData = [];
            that.productDetailData = [];
          }
        } else {
          that.provinceData = [];
          that.addOrEditProgramForm.patchValue({
            provinceCode: '',
            cityCode: '',
            productScode: '',
            productVer: '',
          });
          // that.getProvinceDetail(false);
          that.provinceDetailData = [];
          that.getProjectObjData = [];
          that.productDetailData = [];
        }
      });
    }
  }

  provinceChange () { // 省份变化
    this.getProvinceDetail(false);
    if (this.drawFlag){
      this.getProjectObj(false);
    }
  }

  provinceDetailData: Array<any> = [];
  getProvinceDetail (isFirst) { // 获取地市
    let that = this;
    let param = {
      provinceCode: this.addOrEditProgramForm.controls['provinceCode'].value,
    };
    if (param.provinceCode)
    this.entryBusinessService.getEnterArea(param, function(data){
      if (data.provinCity.length > 0) {
        that.provinceDetailData = data.provinCity;
        if (!isFirst) {
          if (!that.drawFlag) {
            that.addOrEditProgramForm.patchValue({
              cityCode: '',
              // cityCode: data.provinCity[0].value,
            });
            that.productDetailData = [];
          } else {
            that.addOrEditProgramForm.patchValue({
              productScode: '',
              cityCode: '',
              productVer: '',
              // cityCode: data.provinCity[0].value,
            });
            that.getProjectObjData = [];
            that.productDetailData = [];
          }
        }
      } else {
        if (!that.drawFlag) {
          that.addOrEditProgramForm.patchValue({
            cityCode: '',
            // cityCode: data.provinCity[0].value,
          });
          that.productDetailData = [];
        } else {
          that.addOrEditProgramForm.patchValue({
            productScode: '',
            cityCode: '',
            productVer: '',
            // cityCode: data.provinCity[0].value,
          });
          that.getProjectObjData = [];
          that.productDetailData = [];
        }
      }
    });
  }

  sLevel1Change () { // 入口分类变化
    this.addOrEditProgramForm.patchValue({
      level1Value: '',
    });
    this.getSLevel1Value();
  }

  SLevel1ValueData: Array<any> = [];
  getSLevel1Value () { // 获取分类值
    let that = this;
    let param = {
      sLevel1Code: this.addOrEditProgramForm.controls['sLevel1'].value,
    }
    this.entryBusinessService.getSlevel1DetailService(param, function(data){
      if (data.sleve1Valuelist.length > 0) {
        that.SLevel1ValueData = data.sleve1Valuelist;
        // that.addOrEditProgramForm.patchValue({
        //   level1Value: data.sleve1Valuelist[0].value,
        // });
      } else {
        that.SLevel1ValueData = [];
        that.addOrEditProgramForm.patchValue({
          level1Value: '',
        });
      }
    });
  }


  ok(): void {
    let that = this;
    // let param: any = {};
    let reg = /^[0-9]*$/;
    let sSeqno = this.addOrEditProgramForm.getRawValue().seqno;
    if (!reg.test(sSeqno)) {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '序号不正确，请输入2位数字!', 2000));
      return;
    }
    let param = {
      sEntryName: this.addOrEditProgramForm.getRawValue().entryName,
      sProjectCode: this.addOrEditProgramForm.getRawValue().projectCode,
      sProductScode: this.addOrEditProgramForm.getRawValue().productScode,
      sProductVer: this.addOrEditProgramForm.getRawValue().productVer,
      sProvinceCode: this.addOrEditProgramForm.getRawValue().provinceCode,
      sCityCode: this.addOrEditProgramForm.getRawValue().cityCode,
      sLevel1: this.addOrEditProgramForm.getRawValue().sLevel1,
      sLevel1Value: this.addOrEditProgramForm.getRawValue().level1Value,
      sSeqno: this.addOrEditProgramForm.getRawValue().seqno,
      sAccessPath: this.addOrEditProgramForm.getRawValue().accessPath,
      sEnterDescribe: this.addOrEditProgramForm.getRawValue().enterDescribe,
    };
    /*console.log(this.addOrEditProgramForm.valid);
    console.log(this.addOrEditProgramForm.controls["entryName"].valid);
    console.log(this.addOrEditProgramForm.controls["projectCode"].valid);
    console.log(this.addOrEditProgramForm.controls["productScode"].valid);
    console.log(this.addOrEditProgramForm.controls["productVer"].valid);
    console.log(this.addOrEditProgramForm.controls["provinceCode"].valid);
    console.log(this.addOrEditProgramForm.controls["cityCode"].valid);
    console.log(this.addOrEditProgramForm.controls["sLevel1"].valid);
    console.log(this.addOrEditProgramForm.controls["level1Value"].valid);
    console.log(this.addOrEditProgramForm.controls["accessPath"].valid);
    console.log(this.addOrEditProgramForm.controls["enterDescribe"].valid);
    console.log(this.addOrEditProgramForm.controls["seqno"].valid);
    console.log(param);*/
    if (this.addOrEditProgramForm.valid) {
      if (this.modalType === 'add') {
        this.entryBusinessService.addEnterManageService(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '新增信息成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else if (this.modalType === 'edit') {
        param['iId'] = this.detailData.iId;
        this.entryBusinessService.editEnterManageService(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '修改信息成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }

  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
