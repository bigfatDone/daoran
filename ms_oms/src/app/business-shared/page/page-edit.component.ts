import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {PageBusinessService} from '../../business-service/page/page-business.service';
import {number} from '../../shared/custom-validator/number/number';
import {environment} from '../../../environments/environment';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {ElementSaveComponent} from './element-save.component';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {PageUnionComponent} from './page-union.component';

@Component({
  selector: 'c-page-edit',
  templateUrl: './page-edit.component.html',
  styleUrls: ['./page-edit.component.scss']
})
export class PageEditComponent implements OnInit, OnDestroy {

  editPageForm: FormGroup;
  pageGenre: Array<any> = [{type: 1, name: "首页"}, {type: 2, name: "栏目"}, {type: 3, name: "榜单"}, {type: 4, name: "功能"}, {type: 5, name: "专题"}, {type: 6, name: "活动"}];
  // pageGenre: Array<any> = [{type: 1, name: "首页"}, {type: 2, name: "栏目"}, {type: 3, name: "榜单"}, {type: 4, name: "功能"}, {type: 5, name: "专题"}];

  eleType: any;
  pageData: any;

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    const codeNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const aliasNameFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    const abbreNameFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(16)]));
    const noticeFc = new FormControl('', Validators.compose([Validators.minLength(0), Validators.maxLength(120)]));
    const eleTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const bgImageUrlFc = new FormControl();
    const templateFc = new FormControl();
    const bgImageFc = new FormControl();
    const tgImageFc = new FormControl();
    const videoNameFc = new FormControl();
    const unValueFc = new FormControl();
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl([], Validators.compose([Validators.required]));

    this.editPageForm = this.formBuilder.group({
      codeName: codeNameFc,
      aliasName: aliasNameFc,
      abbreName: abbreNameFc,
      notice: noticeFc,
      eleType: eleTypeFc,
      bgUrl: bgImageUrlFc,
      tpUrl: templateFc,
      bgImg: bgImageFc,
      tpImg: tgImageFc,
      videoName: videoNameFc,
      province: provinceFc,
      unValue: unValueFc,
      area: areaFc,
    });
  }


  imgSrcA: any = "";
  imgSrcB: any = "";
  imgSrcC: any = "";
  newFile: any = new FormData();
  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    this.getDetail();
    this.editPageForm.controls["codeName"].disable();
    this.editPageForm.controls["bgUrl"].disable();
    this.editPageForm.controls["tpUrl"].disable();
    // this.editPageForm.controls["videoName"].disable();
  }
  ngOnDestroy() {
    if (this.eleSaveModal !== null) {
      this.eleSaveModal.close();
    }
  }

  upload(ev, index) {
    let evAnd = ev.target ? ev.target : ev.srcElement;
    let file = evAnd.files[0];
    this.newFile.set( "file" + index, file);
    let that = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
        case 'B':
          that.imgSrcB = this.result;
          break;
        case 'C':
          that.imgSrcC = this.result;
          break;
      }
    };
  }
  /**
   * 上传
   */
  ok(): void {
    let param: any;
    let that = this;
    let areaCode = (this.editPageForm.controls["area"].value).join();
    if (areaCode.indexOf('all') !== -1 && areaCode.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.editPageForm.valid) {
      // param = {
      //   pageId: this.editPageForm.getRawValue().codeName,
      //   alias: this.editPageForm.getRawValue().aliasName,
      //   abbreviation: this.editPageForm.getRawValue().abbreName,
      //   pageType: this.editPageForm.getRawValue().eleType,
      //   notice: this.editPageForm.getRawValue().notice,
      //   bgImageUrl: this.editPageForm.getRawValue().bgUrl,
      //   template: this.editPageForm.getRawValue().tpUrl,
      //   op: "修改",
      //   provinceCode: this.editPageForm.getRawValue().province,
      //   parentPageId: this.editPageForm.getRawValue().unValue,
      //   // areas: this.editPageForm.getRawValue().area,
      //   areas: areaCode,
      // };
      this.newFile.set( "pageId" , this.editPageForm.getRawValue().codeName);
      this.newFile.set( "alias" , this.editPageForm.getRawValue().aliasName);
      this.newFile.set( "abbreviation" , this.editPageForm.getRawValue().abbreName);
      this.newFile.set( "pageType" , this.editPageForm.getRawValue().eleType);
      this.newFile.set( "notice" , this.editPageForm.getRawValue().notice);
      this.newFile.set( "op" , "修改");
      this.newFile.set( "provinceCode" , this.editPageForm.getRawValue().province);
      this.newFile.set( "areas" , areaCode);
      this.newFile.set( "parentPageId" , this.editPageForm.getRawValue().unValue);

      this.pageBusinessService.pageAddNewPost(this.newFile, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  bgServiceUrl: any="";
  tpServiceUrl: any="";
  uploadFile(ev, type) {
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("type", type);
      this.commonBusinessService.uploadPicPost(param, function(data){
        if(type === 'bgImg') {
          that.editPageForm.patchValue({"bgUrl": data});
          that.bgServiceUrl = environment.imgApi + data;
        } else if (type === 'temp') {
          that.editPageForm.patchValue({"tpUrl": data});
          that.tpServiceUrl = environment.imgApi + data;
        }
      });
    }
  }

  resultStr: any = "";
  showThisEleModal: any = null;
  showThisEle() {
    let that = this;
    this.showThisEleModal = this.ngbModalService.open(PageUnionComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.modelData = this.pageData.pageId;
    this.showThisEleModal.result.then((result) => {
      that.editPageForm.get(['unValue']).setValue(result[0].id);
      that.resultStr = result[0].name;
    }, (reason) => {
    });
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  detailData: any;
  dynrecsData: Array<any>= [];
  extrecsData: Array<any>= [];
  layrecsData: Array<any>= [];
  pagerecsData: Array<any>= [];

  imgApi: any;
  imgApiSD: any;
  getDetail () {
    let that = this;
    let param = {pageId: this.pageData.pageId};
    this.pageBusinessService.pageDetail(param, function(data){
      that.detailData = data;
      if(data.dynrecs == null){
        data.dynrecs=[];
      }if(data.extrecs == null){
        data.extrecs=[];
      }if(data.layrecs == null){
        data.layrecs=[];
      }if(data.pagerecs == null){
        data.pagerecs=[];
      }
      that.dynrecsData = data.dynrecs;
      that.extrecsData = data.extrecs;
      that.layrecsData = data.layrecs;
      that.pagerecsData = data.pagerecs;
      // that.bgUrlData = data.bgImage;
      // that.tpUrlData = data.template;
      // that.bgServiceUrl = environment.imgApi + data.bgImage;
      // that.tpServiceUrl = environment.imgApi + data.template;
      that.resultStr = data.parentPageAlias;
      that.editPageForm.patchValue({
        codeName: that.detailData.pageId,
        aliasName: that.detailData.alias,
        abbreName:  that.detailData.abbreviation,
        eleType: that.detailData.pageType,
        notice: that.detailData.notice,
        // bgUrl: that.detailData.bgImage,
        // tpUrl: that.detailData.template,
        videoName: that.detailData.video,
        province: that.detailData.provinceCode,
        unValue: that.detailData.parentPageId,
      });
      let strA = data.bgImage !== null ? (data.bgImage !== '' ? that.imgApi + data.bgImage + "?random=" + Math.random() : "") : '';
      let strB = data.bgImage !== null ? (data.bgImage !== '' ? that.imgApiSD + data.bgImage + "?random=" + Math.random() : "") : '';
      let strC = data.template !== null ? (data.template !== '' ? that.imgApi + data.template + "?random=" + Math.random() : '') : '';
      that.imgSrcA = strA;
      that.imgSrcB = strB;
      that.imgSrcC = strC;
      that.getpri();
      that.getAreas();
    });
  }

  provinces: Array<any> = [];
  getpri(){
    let that = this;
    let param = {
      // nodeCode: this.saveIssuedForm.getRawValue().nodeCode,
    };
    this.pageBusinessService.getProductNoAuth(param, function(data){
      if (data) {
        that.provinces = data;
      } else {
        that.provinces = [];
      }
    });
  }

  mulTexts: IMultiSelectTexts = {
    defaultTitle: "请先选择省份"
  };

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 25,
  };
  areas: Array<any>= [];
  areasMulData: IMultiSelectOption[] = [];
  getAreas() {
    this.areas = [];
    let that = this;
    this.editPageForm.patchValue({
      area: [],
    });
    if (this.editPageForm.getRawValue().province !== "") {
      let param = {provinceCode: this.editPageForm.getRawValue().province};
      this.pageBusinessService.getCurCitys(param, function(data){
        if (data !== null) {
          that.areas = data;
        } else {
          that.areas = [];
        }
        that.mulTexts  = {
          defaultTitle: "请选择区域"
        };
        if (that.editPageForm.getRawValue().province === that.detailData.provinceCode && that.detailData.areas) {
          that.editPageForm.patchValue({
            area: that.detailData.areas.split(','),
          });
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

  pageEntry: any= true;
  eleSaveModal: any = null;
  modify(id) {
    let that = this;
    this.eleSaveModal = this.ngbModalService.open(ElementSaveComponent, {size: 'lg'});
    this.eleSaveModal.componentInstance.modalData = id;
    this.eleSaveModal.result.then((result) => {
    }, (reason) => {
      that.getDetail();
    });
  }

  sortFlag: any = true;
  saveSort (type) {
    this.sortFlag = true;
    let that = this;
    let dynrecsLen = this.dynrecsData.length;
    let extrecsLen = this.extrecsData.length;
    let layrecsLen = this.layrecsData.length;
    let pagerecsLen = this.pagerecsData.length;
    if (type === 'dynrecs') {
      this.dynrecsData.forEach(i => {
        if (i.layoutSeqNew == '' || i.layoutSeqNew == null) {
          this.sortFlag = false;
        }
      });
      if (this.sortFlag) {
        this.dynrecsData.forEach(i => {
          let _index = this.dynrecsData.indexOf(i);
            for ( let j = 0; j < dynrecsLen; j++ ){
              if ( j !== _index ){
                if (i.layoutSeqNew == this.dynrecsData[j].layoutSeqNew) {
                  this.sortFlag = false;
                }
              }
            }
        });
      }
    } else if (type === 'extrecs') {
      this.extrecsData.forEach(i => {
        if (i.layoutSeqNew == '' || i.layoutSeqNew == null) {
          this.sortFlag = false;
        }
      });
      if (this.sortFlag) {
        this.extrecsData.forEach(i => {
          let _index = this.extrecsData.indexOf(i);
          for ( let j = 0; j < extrecsLen; j++ ){
            if ( j !== _index) {
              if (i.layoutSeqNew == this.extrecsData[j].layoutSeqNew) {
                this.sortFlag = false;
              }
            }
          }
        });
      }
    } else if (type === 'layrecs') {
      this.layrecsData.forEach(i => {
        if (i.layoutSeqNew == '' || i.layoutSeqNew == null) {
          this.sortFlag = false;
        }
      });
      if (this.sortFlag) {
        this.layrecsData.forEach(i => {
          let _index = this.layrecsData.indexOf(i);
          for ( let j = 0; j < layrecsLen; j++ ){
            if ( j !== _index ) {
              if (i.layoutSeqNew == this.layrecsData[j].layoutSeqNew) {
                this.sortFlag = false;
              }
            }
          }
        });
      }
    } else if ( type === 'pagerecs') {
      this.pagerecsData.forEach(i => {
        if (i.layoutSeqNew == '' || i.layoutSeqNew == null) {
          this.sortFlag = false;
        }
      });
      if (this.sortFlag) {
        this.pagerecsData.forEach(i => {
          let _index = this.pagerecsData.indexOf(i);
          for ( let j = 0; j < pagerecsLen; j++ ){
            if ( j !== _index ) {
              if (i.layoutSeqNew == this.pagerecsData[j].layoutSeqNew) {
                this.sortFlag = false;
              }
            }
          }
        });
      }
    }
    let param;
    if (this.sortFlag) {
      if (type === 'dynrecs') {
        param = {jsonParam: JSON.stringify({eleArray: this.dynrecsData})};
      } else if (type === 'extrecs') {
        param = {jsonParam: JSON.stringify({eleArray: this.extrecsData})};
      } else if (type === 'layrecs') {
        param = {jsonParam: JSON.stringify({eleArray: this.layrecsData})};
      } else if ( type === 'pagerecs') {
        param = {jsonParam: JSON.stringify({eleArray: this.pagerecsData})};
      }
      this.pageBusinessService.sortElementPost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.getDetail();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '排序数据不能为空，且不能相同', 2000));
    }
  }
}


