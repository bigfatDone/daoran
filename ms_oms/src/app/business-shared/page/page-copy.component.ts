import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {PageBusinessService} from '../../business-service/page/page-business.service';
import {number} from '../../shared/custom-validator/number/number';
import {environment} from '../../../environments/environment';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'c-page-copy',
  templateUrl: './page-copy.component.html'
})
export class PageCopyComponent implements OnInit {

  copyPageForm: FormGroup;
  copyData: any = '';

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    // const codeNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const codeNameFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(16)]));
    const aliasNameFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl([], Validators.compose([Validators.required]));

    this.copyPageForm = this.formBuilder.group({
      codeName: codeNameFc,
      aliasName: aliasNameFc,
      province: provinceFc,
      area: areaFc,
    });
  }


  ngOnInit() {
    this.getDetail();
    // this.areasMulData = [{id: 'all', name: '全部'}];
    // this.copyPageForm.patchValue({
    //   area: this.areasMulData[0].id,
    // });
  }
  provinces: Array<any> = [];
  getpri(){
    let that = this;
    let param = {
      // nodeCode: this.saveIssuedForm.getRawValue().nodeCode,
    };
    this.pageBusinessService.getallPri(param, function(data){
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
    this.copyPageForm.patchValue({
      area: [],
    });
    if (this.copyPageForm.getRawValue().province !== "") {
      let param = {provinceCode: this.copyPageForm.getRawValue().province};
      this.pageBusinessService.getCurCitys(param, function(data){
        if (data !== null) {
          that.areas = data;
        } else {
          that.areas = [];
        }
        that.mulTexts  = {
          defaultTitle: "请选择区域"
        };
        if (that.copyPageForm.getRawValue().province === that.detailData.provinceCode) {
          that.copyPageForm.patchValue({
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
  /**
   * 上传
   */
  ok(): void {
    let param: any;
    let that = this;
    let areaCode = (this.copyPageForm.controls["area"].value).join();
    if (areaCode.indexOf('all') !== -1 && areaCode.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.copyPageForm.valid) {
      param = {
        pageId: this.copyData.pageId,
        pageIdNew: this.copyPageForm.getRawValue().codeName,
        aliasNew: this.copyPageForm.getRawValue().aliasName,
        provinceCode: this.copyPageForm.getRawValue().province,
        areas: this.copyPageForm.getRawValue().area,
      };

      this.pageBusinessService.pageCopyPost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请按照正确格式填写内容!', 2000));
    }
  }


  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {pageId: this.copyData.pageId};
    this.pageBusinessService.copyDetial(param, function(data){
      that.detailData = data;
      that.copyPageForm.patchValue({
        codeName: that.detailData.pageId,
        aliasName: that.detailData.alias,
        province: that.detailData.provinceCode,
      });
      // that.getEleList(data.eleValue);
      that.getpri();
      that.getAreas();
    });
  }
}


