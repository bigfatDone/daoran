import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {number} from '../../shared/custom-validator/number/number';
import {PageBusinessService} from '../../business-service/page/page-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {pageEleAttr, pageEleTypeModal, pageGenre, pageResType} from '../../global-constant';
import { environment } from '../../../environments/environment';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {ElementPageCheckComponent} from './element-page-check.component';
import {ElementVlistCheckComponent} from './element-vlist-check.component';
import {ElementSingleResCheckComponent} from './element-singleRes-check.component';
import {ElementArtlistCheckComponent} from './element-artlist-check.component';
import {ElementwallCheckComponent} from './element-wall-check.component';
import {ElementAlbumCheckComponent} from './element-album-check.component';
import {ElementTagCheckComponent} from './element-tag-check.component';
import {PageUnionComponent} from './page-union.component';

@Component({
  selector: 'c-page-save',
  templateUrl: './page-save.component.html',
  styleUrls: ['./page-save.component.scss']
})
export class PageSaveComponent implements OnInit, OnDestroy {

  savePageForm: FormGroup;
  pageGenre: Array<any> = [{type: 1, name: "首页"}, {type: 2, name: "栏目"}, {type: 3, name: "榜单"}, {type: 4, name: "功能"}, {type: 5, name: "专题"}, {type: 6, name: "活动"}];
  // pageGenre: Array<any> = [{type: 1, name: "首页"}, {type: 2, name: "栏目"}, {type: 3, name: "榜单"}, {type: 4, name: "功能"}, {type: 5, name: "专题"}];
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    const codeNameFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(16)]));
    const aliasNameFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    const abbreNameFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(16)]));
    const noticeFc = new FormControl('', Validators.compose([Validators.minLength(0),  Validators.maxLength(128)]));
    const eleTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const bgUrlFc = new FormControl('');
    const tpUrlFc = new FormControl('');
    const unValueFc = new FormControl('');
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl([], Validators.compose([Validators.required]));
    this.savePageForm = this.formBuilder.group({
      codeName: codeNameFc,
      aliasName: aliasNameFc,
      abbreName: abbreNameFc,
      notice: noticeFc,
      eleType: eleTypeFc,
      bgUrl: bgUrlFc,
      tpUrl: tpUrlFc,
      unValue: unValueFc,
      province: provinceFc,
      area: areaFc,
    });
  }

  eleTypes: Array<any>= [pageGenre[0]];
  eleType: any;

  imgSrcA: any = "";
  imgSrcB: any = "";
  imgSrcC: any = "";
  newFile: any = new FormData();
  ngOnInit() {
    this.savePageForm.controls['bgUrl'].disable();
    this.savePageForm.controls['tpUrl'].disable();
    this.savePageForm.patchValue({
      eleType: this.eleTypes[0].type
    });
    this.getpri();
    // this.areasMulData = [{id: 'all', name: '全部'}];
    // this.savePageForm.patchValue({
    //   area: this.areasMulData[0].id,
    // });
  }
  ngOnDestroy() {
    if (this.showThisEleModal !== null) {
      this.showThisEleModal.close();
    }
  }

  bgServiceUrl: any = "";
  tpServiceUrl: any = "";
  uploadFile(ev, type) {
    let file = ev.target.files[0];
    // console.log("ev.target:"+ev.target);
    // console.log(file)
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("type", type);
      this.commonBusinessService.uploadPicPost(param, function(data){
        if(type === 'bgImg') {
          that.savePageForm.patchValue({"bgUrl": data});
          that.bgServiceUrl = environment.imgApi + data;
        } else if (type === 'temp') {
          that.savePageForm.patchValue({"tpUrl": data});
          that.tpServiceUrl = environment.imgApi + data;
        }
      });
    }
  }

  resultStr: any = '';
  showThisEleModal: any = null;
  showThisEle() {
    let that = this;
    this.showThisEleModal = this.ngbModalService.open(PageUnionComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.modelData = '';
    this.showThisEleModal.result.then((result) => {
      that.savePageForm.get(['unValue']).setValue(result[0].id);
      that.resultStr = result[0].name;
      // that.tagDataList.forEach( i => {
      //   if (i.id === this.saveEleForm.getRawValue().eleValue) {
      //     that.saveEleForm.patchValue({
      //       eleValueStr: i.labelName,
      //     })
      //   }
      // })
    }, (reason) => {
    });
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
    let areaCode = (this.savePageForm.controls["area"].value).toString();
    if (areaCode.indexOf('all') !== -1 && areaCode.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.savePageForm.valid) {
      // param = {
      //   pageId: this.savePageForm.getRawValue().codeName,
      //   alias: this.savePageForm.getRawValue().aliasName,
      //   abbreviation: this.savePageForm.getRawValue().abbreName,
      //   pageType: this.savePageForm.getRawValue().eleType,
      //   notice: this.savePageForm.getRawValue().notice,
      //   bgImageUrl: this.savePageForm.getRawValue().bgUrl,
      //   template: this.savePageForm.getRawValue().tpUrl,
      //   op: "添加",
      //   provinceCode: this.savePageForm.getRawValue().province,
      //   areas: areaCode,
      //   parentPageId: this.savePageForm.getRawValue().unValue,
      // };
      this.newFile.set( "pageId" , this.savePageForm.getRawValue().codeName);
      this.newFile.set( "alias" , this.savePageForm.getRawValue().aliasName);
      this.newFile.set( "abbreviation" , this.savePageForm.getRawValue().abbreName);
      this.newFile.set( "pageType" , this.savePageForm.getRawValue().eleType);
      this.newFile.set( "notice" , this.savePageForm.getRawValue().notice);
      this.newFile.set( "op" , "添加");
      this.newFile.set( "provinceCode" , this.savePageForm.getRawValue().province);
      this.newFile.set( "areas" , areaCode);
      this.newFile.set( "parentPageId" , this.savePageForm.getRawValue().unValue);

      this.pageBusinessService.pageAddNewPost(this.newFile, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
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
    // displayAllSelectedText: true
  };
  areas: Array<any>= [];
  areasMulData: IMultiSelectOption[] = [];
  getAreas() {
    this.areas = [];
    let that = this;
    if (this.savePageForm.getRawValue().province !== "") {
      let param = {provinceCode: this.savePageForm.getRawValue().province};
      this.savePageForm.patchValue({
        area: [],
      });
      this.pageBusinessService.getCurCitys(param, function(data){
        if (data !== null) {
          that.areas = data;
        } else {
          that.areas = [];
        }
        that.mulTexts  = {
          defaultTitle: "请选择区域"
        };
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

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
