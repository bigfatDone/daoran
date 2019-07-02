import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ProgramBusinessService } from '../../business-service/program/program-business.service';

import { programType, freeFlag, pageResType, resourceSort } from '../../global-constant';
import {Router} from '@angular/router';
import {ElementConfirSaveComponent} from '../page/element-confirSave.component';
import {environment} from '../../../environments/environment';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'c-program-add',
  templateUrl: './program-add.component.html',
  styleUrls: ['./program-add.component.scss']
})
export class ProgramAddComponent implements OnInit, OnDestroy {

  saveProgramForm: FormGroup;

  modalData: any = '';
  windowUrl: any;
  drawFlag = true;
  nodeList: Array<any>= [];
  programTypes: Array<any>= programType;
  freeFlags: Array<any>= freeFlag;
  freeFlagsData: Array<any>= [{type: 0, name: '收费'}, {type: 1, name: '免费'}];
  pageResTypes: Array<any>= pageResType.slice(1, pageResType.length);
  hdbpageResTypes: Array<any>= pageResType.slice(3, pageResType.length);
  resourceSorts: Array<any>= resourceSort;
  programConfirModal: any = null;
  imgSrcA = null;
  imgSrcB = null;
  imgSrcC = null;
  imgSrcD = null;
  Layer1 = true;
  Layer2 = true;
  setParam: any = new FormData();
  constructor(public activeModal: NgbActiveModal,private modalService: ModalService, public programBusinessService: ProgramBusinessService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router, private ngbModalService: NgbModal ) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const upperFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const codeFc = new FormControl('', Validators.compose([CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const programTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const freeFlagFc = new FormControl('', Validators.compose([Validators.required]));
    const pageResTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const resourceSortFc = new FormControl('', Validators.compose([]) );
    const desFc = new FormControl('', Validators.compose([]));
    const imageDes = new FormControl('', Validators.compose([]));
    const imageSecondDes = new FormControl('', Validators.compose([]));

    this.saveProgramForm = this.formBuilder.group({
      name: nameFc,
      upper: upperFc,
      code: codeFc,
      programType: programTypeFc,
      freeFlag: freeFlagFc,
      pageResType: pageResTypeFc,
      resourceSort: resourceSortFc,
      des: desFc,
      imageDes: imageDes,
      imageSecondDes: imageSecondDes,
    });
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf('draw/programList') >= 0) {
      this.drawFlag = false;
    }
  }
  ngOnInit() {
    this.getNodeList();
    this.getDetail();
    if (this.drawFlag) {
      this.saveProgramForm.patchValue({
        programType: this.programTypes[0].type,
        freeFlag: this.freeFlags[0].type,
        pageResType: this.pageResTypes[0].type,
        resourceSort: this.resourceSorts[0].value,
      });
    }else if (!this.drawFlag) {
      this.saveProgramForm.patchValue({
        programType: this.programTypes[0].type,
        freeFlag: this.freeFlags[0].type,
        pageResType: this.hdbpageResTypes[0].type,
        resourceSort: this.resourceSorts[0].value,
      });
    }

  }
  ngOnDestroy() {
    if (this.programConfirModal !== null) {
      this.programConfirModal.close();
    }
  }
  checkAll($event) {
    this.nodeList.forEach(i => i.checkState = $event.target.checked);
  }
  isAllChecked() {
    if (this.nodeList.length > 0) {
      return this.nodeList.every(_ => _.checkState);
    }
  }
  checkNode($event, index) {
    this.nodeList[index].checkState = $event.target.checked;
  }
  getDetail() {
    if (this.modalData !== '') {
      const that = this;
      const param = {listCode: this.modalData};
      this.programBusinessService.getProgramDetail(param, function(data){
        console.log(data);
        console.log('test');
        that.saveProgramForm.patchValue({
          name: data.listName,
          upper: data.upperCase,
          code: data.listCode,
          programType: data.listType,
          freeFlag: data.freeFlag,
          pageResType: data.resType,
          resourceSort: data.sortType,
          des: data.listDes,
          imageDes: data.imageDes,
          imageSecondDes: data.imageSecondDes,
        });

        if (data.image === null || data.image === '' ) {
          that.imgSrcA = null;
          that.imgSrcC = null;
        } else {
          that.imgSrcA = environment.imgApi + data.image;
          that.imgSrcC = environment.imgApiSD + data.image;
        }
        if (data.imageSecond === null || data.imageSecond === '' ) {
          that.imgSrcB = null;
          that.imgSrcD = null;
        } else {
          that.imgSrcB = environment.imgApi + data.imageSecond;
          that.imgSrcD = environment.imgApiSD + data.imageSecond;
        }

    /*    that.imgSrcA = environment.imgApi + data.image;
        that.imgSrcC = environment.imgApiSD + data.image;
        that.imgSrcB = environment.imgApi + data.imageSecond;
        that.imgSrcD = environment.imgApiSD + data.imageSecond;*/
        that.saveProgramForm.controls['code'].disable();
        that.saveProgramForm.controls['pageResType'].disable();
      });
    }
  }
  getNodeDetail() {
    if (this.modalData !== '') {
      const that = this;
      const param = {listCode: this.modalData};
      const selectNode = [];
      this.programBusinessService.getProgramNodeDetail(param, function (data) {
        data.forEach(i => selectNode.push(i.nodeCode));
        that.nodeList.forEach(i => {
          if (selectNode.indexOf(i.nodeCode) > -1) {
            i.checkState = true;
          }
        });
      });
    }
  }
  getNodeList() {
    const that = this;
    this.programBusinessService.getNodes(function(data) {
      that.nodeList = data;
      that.getNodeDetail();
    });
  }
  ok(): void {
    const that = this;
    const selectNodes: Array<any> = [];
    if (this.saveProgramForm.valid) {
      this.nodeList.forEach(i => {
        if (i.checkState) {
          selectNodes.push(i.nodeCode);
        }
      });
      this.setParam.set('flag', 1);
      this.setParam.set('listCode', this.saveProgramForm.controls['code'].value);
      this.setParam.set('listName', this.saveProgramForm.controls['name'].value);
      this.setParam.set('upperCase', this.saveProgramForm.controls['upper'].value);
      this.setParam.set('listType', this.saveProgramForm.controls['programType'].value);
      this.setParam.set('freeFlag', this.saveProgramForm.controls['freeFlag'].value);
      this.setParam.set('listDes', this.saveProgramForm.controls['des'].value);
      this.setParam.set('resType', this.saveProgramForm.controls['pageResType'].value);
      this.setParam.set('sortType', this.saveProgramForm.controls['resourceSort'].value);
      this.setParam.set('selectNodes', selectNodes.toString());
      this.setParam.set('imageDes', this.saveProgramForm.controls['imageDes'].value);
      this.setParam.set('imageSecondDes', this.saveProgramForm.controls['imageSecondDes'].value);
      if (this.modalData !== '') {
        this.setParam.set('flag', 2);
      }
      this.programBusinessService.saveProgramPost(this.setParam, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
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
        case 'D':
          that.imgSrcD = this.result;
          break;
      }
    };
  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  deleteLayer(param) {
    switch (param) {
      case 1 :
        this.deleteLayerFun(1);
        break;
      case 2 :

        this.deleteLayerFun(2);
        break;
    }
  }
  deleteLayerFun (param) {
    const that = this;
    const can = { listCode: this.modalData, type : param};
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.programBusinessService.deleteLayer(can, function(data){
        if (param === 1) {
          that.imgSrcA = '';
          that.imgSrcC = '';
          that.saveProgramForm.patchValue({
            imageDes: '',
          });
          that.setParam.set('imageDes', '');
          that.setParam.set('fileA', '');
          that.setParam.set('fileC', '');
        } else {
          that.imgSrcB = '';
          that.imgSrcD = '';
          that.saveProgramForm.patchValue({
            imageSecondDes: '',
          });
          that.setParam.set('imageSecondDes', '');
          that.setParam.set('fileB', '');
          that.setParam.set('fileD', '');
        }
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
      });
    }, (reason) => {
    });
  }
  toblur () {
    const that = this;
    const param = {listName: this.saveProgramForm.controls['name'].value};
    this.programBusinessService.getUpperCase(param, function(data){
      that.saveProgramForm.patchValue({
      upper: data
    });
    });
  }
}
