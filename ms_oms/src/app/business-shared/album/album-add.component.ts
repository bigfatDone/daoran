import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ProgramBusinessService } from '../../business-service/program/program-business.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';

import { programType, pageResType, resourceSort, sectData} from "../../global-constant";
import {Router} from '@angular/router';
import {ElementConfirSaveComponent} from '../page/element-confirSave.component';
import {AlbumBusinessService} from '../../business-service/album/album-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {environment} from '../../../environments/environment';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'c-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.scss']
})
export class AlbumAddComponent implements OnInit, OnDestroy {
  albumType: Array<any> = [{type: 1, name: '音乐MV'}, {type: 2, name: '儿童歌曲'}, {type: 3, name: '儿童教育'}, {type: 4, name: '戏曲'}, {type: 5, name: '手绘本'}];
  albumResType: Array<any> = [{type: 1, name: '视频'}, {type: 2, name: '音频'}, {type: 3, name: '手绘本'}];
  freeFlagData: Array<any> = [{type: 0, name: '收费'}, {type: 1, name: '免费'}];
  addAlbummForm: FormGroup;
  listTypes: Array<any> = [];
  listType: any = '';
  modalData: any = '';
  windowUrl: any;
  drawFlag = true;
  nodeList: Array<any>= [];
  programTypes: Array<any>= programType;
  programConfirModal: any = null;
  preTimeFc: any;
  imgSrcA = null;
  imgSrcB = null;
  imgSrcC = null;
  setParam: any = new FormData();
  constructor(public activeModal: NgbActiveModal,
              public albumBusinessService: AlbumBusinessService,
              public commonBusinessService: CommonBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private modalService: ModalService,
              private router: Router,
              private ngbModalService: NgbModal ) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const codeFc = new FormControl('', Validators.compose([CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const sectFc = new FormControl('', Validators.compose([Validators.required]));
    const upperCaseFc = new FormControl('', Validators.compose([Validators.required]));
    const mofifyFc = new FormControl('', Validators.compose([]));
    const totalFc = new FormControl('', Validators.compose([]));
    const alTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const alResTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const freeFlagFc = new FormControl('', Validators.compose([Validators.required]));
    const iStatusFc = new FormControl('', Validators.compose([Validators.required]));
    const publishTimeFc = new FormControl();
    const tagFc = new FormControl('', Validators.compose([]));
    const desFc = new FormControl('', Validators.compose([]));

    this.addAlbummForm = this.formBuilder.group({
      albumCode: codeFc,
      albumName: nameFc,
      sect: sectFc,
      upperCase: upperCaseFc,
      numModify: mofifyFc,
      numTotal: totalFc,
      alType: alTypeFc,
      alResType: alResTypeFc,
      freeFlag: freeFlagFc,
      publishTime: publishTimeFc,
      tagName: tagFc,
      albumDesc: desFc,
      iStatus: iStatusFc
    });
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf('draw/programList') >= 0) {
      this.drawFlag = false;
    }
  }
  imgApi: any;
  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.getAllSectList();
    this.getDetail();
    if (this.modalData !== '') {
      this.addAlbummForm.controls['alResType'].disable();
      this.addAlbummForm.patchValue({
        albumName: this.modalData.albumName,
        sect: this.modalData.sect,
        upperCase: this.modalData.upperCase,
        albumDesc: this.modalData.albumDesc,
      });
      if (this.modalData.publishTimeStr !== null) {
        const date = this.modalData.publishTimeStr;
        const xxx = date.split(' ')[0].split('-');
        this.addAlbummForm.patchValue({
          publishTime: {
            'year': parseInt(xxx[0]),
            'month': parseInt(xxx[1]),
            'day': parseInt(xxx[2])
          },
        });
      }
/*      if (this.modalData.image === null || this.modalData.image === '' ) {
        this.imgSrcA = null;
      } else {
        this.imgSrcA = this.imgApi + this.modalData.image;
      }
      if (this.modalData.imageSecond === null || this.modalData.imageSecond === '' ) {
        this.imgSrcB = null;
      } else {
        this.imgSrcB = this.imgApi + this.modalData.imageSecond;
      }*/
    } else {
      this.addAlbummForm.patchValue({
        alType: this.albumType[0].type,
        alResType: this.albumResType[0].type,
        freeFlag: this.freeFlagData[0].type,
        iStatus : 1
      });
    }
  }
  ngOnDestroy() {
    if (this.programConfirModal !== null) {
      this.programConfirModal.close();
    }
  }
  getDetail() {
    if (this.modalData !== '') {
      const that = this;
      const param = {albumCode: this.modalData.albumCode};
      this.albumBusinessService.getAlbumDetail(param, function(data){
        that.addAlbummForm.patchValue({
          albumName: data.albumName,
          sect: data.sect,
          upperCase: data.upperCase,
          numTotal: data.numTotal,
          numModify: data.numModify,
          alType: data.albumCategory,
          alResType: data.resType,
          freeFlag: data.freeFlag,
          tagName: data.tagName,
          iStatus: data.iStatus,
        });
        that.addAlbummForm.controls['tagName'].disable();
        if (data.image === null || data.image === '' ) {
          that.imgSrcA = null;
        } else {
          that.imgSrcA = environment.imgApi + data.image;
        }
        if (data.imageSecond === null || data.imageSecond === '' ) {
          that.imgSrcB = null;
        } else {
          that.imgSrcB = environment.imgApi + data.imageSecond;
        }
        if (data.imageThird === null || data.imageThird === '' ) {
          that.imgSrcC = null;
        } else {
          that.imgSrcC = environment.imgApi + data.imageThird;
        }
    /*    that.imgSrcA = environment.imgApi + data.image;
        that.imgSrcB = environment.imgApi + data.imageSecond;*/
        if (data.publishTimeStr !== null) {
          const date = data.publishTimeStr;
          const xxx = date.split(' ')[0].split('-');
          that.addAlbummForm.patchValue({
            publishTime: {
              'year': parseInt(xxx[0]),
              'month': parseInt(xxx[1]),
              'day': parseInt(xxx[2])
            },
          });
        }
      });
    }
  }
  getAllSectList() {
    const that = this;
    const param = {};
    this.albumBusinessService.getAllSectList(param, function(data){
      if (data.sectList.length > 0) {
        that.listTypes = data.sectList;
      } else {
        that.listTypes = [];
      }
    });
  }
  getNodeDetail() {
    if (this.modalData !== '') {
      const that = this;
      const param = {listCode: this.modalData};
      const selectNode = [];
      this.albumBusinessService.getProgramNodeDetail(param, function (data) {
        data.forEach(i => selectNode.push(i.nodeCode));
        that.nodeList.forEach(i => {
          if (selectNode.indexOf(i.nodeCode) > -1) {
            i.checkState = true;
          }
        });
      });
    }
  }
  upload(ev, index) {
    const evAnd = ev.target ? ev.target : ev.srcElement;
    const file = evAnd.files[0];
    this.setParam.set('file' + index, file);
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
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
  deleteLayer(param) {
    switch (param) {
      case 1 :
        this.deleteLayerFun(1);
        break;
      case 2 :
        this.deleteLayerFun(2);
        break;
      case 3 :
        this.deleteLayerFun(3);
        break;
    }
  }
  deleteLayerFun (param) {
    const that = this;
    const can = { albumCode: this.modalData.albumCode, type : param};
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    that.modalService.confirm(confirmCfg).then((result) => {
      that.albumBusinessService.delAlbumImage(can, function(data){
        if (param === 1) {
          that.imgSrcA = '';
          that.setParam.set('fileA', '');
        } else if (param === 2) {
          that.imgSrcB = '';
          that.setParam.set('fileB', '');
        } else {
          that.imgSrcC = '';
          that.setParam.set('fileC', '');
        }
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
      });
    }, (reason) => {
    });
  }
  getNodeList() {
    const that = this;
    this.albumBusinessService.getNodes(function(data) {
      that.nodeList = data;
      that.getNodeDetail();
    });
  }
  ok(): void {
    const that = this;
  //  let param: any;
    if (!!this.addAlbummForm.controls['publishTime'].value) {
      this.preTimeFc = this.addAlbummForm.controls['publishTime'].value;
      if (typeof(this.preTimeFc) === 'object' && this.preTimeFc !== '' && this.preTimeFc !== null ) {
        this.preTimeFc = this.preTimeFc.year + '-' + this.preTimeFc.month + '-' + this.preTimeFc.day;
      }
      this.setParam.set('publishTime', this.preTimeFc);
    } else {
      this.setParam.set('publishTime', '');

      //  this.addAlbummForm.removeControl('publishTime');
    }
    if (this.addAlbummForm.valid) {
/*      param =  {
        albumName: this.addAlbummForm.controls['albumName'].value,
        sect: this.addAlbummForm.controls['sect'].value,
        upperCase: this.addAlbummForm.controls['upperCase'].value,
        publishTime: this.preTimeFc,
        albumCategory: this.addAlbummForm.controls['alType'].value,
        resType: this.addAlbummForm.controls['alResType'].value,
        freeFlag: this.addAlbummForm.controls['freeFlag'].value,
        iStatus: this.addAlbummForm.controls['iStatus'].value,
        albumDesc: this.addAlbummForm.controls['albumDesc'].value,
      };*/
      this.setParam.set('albumName', this.addAlbummForm.controls['albumName'].value);
      this.setParam.set('sect', this.addAlbummForm.controls['sect'].value);
      this.setParam.set('upperCase', this.addAlbummForm.controls['upperCase'].value);
      this.setParam.set('numTotal', this.addAlbummForm.controls['numTotal'].value);
      this.setParam.set('numModify', this.addAlbummForm.controls['numModify'].value);
      this.setParam.set('albumCategory', this.addAlbummForm.controls['alType'].value);
      this.setParam.set('resType', this.addAlbummForm.controls['alResType'].value);
      this.setParam.set('freeFlag', this.addAlbummForm.controls['freeFlag'].value);
      this.setParam.set('iStatus', this.addAlbummForm.controls['iStatus'].value);
      this.setParam.set('albumDesc', this.addAlbummForm.controls['albumDesc'].value);
      if (this.modalData !== '') {
        this.setParam.set('albumCode', this.modalData.albumCode);

     //   param.albumCode = this.modalData.albumCode;
      }
      this.albumBusinessService.saveAlbumPost(this.setParam, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
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
