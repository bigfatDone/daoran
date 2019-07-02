import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { pageEleType, pageEleTypeModal, pageResType, pageEleAttr } from '../../global-constant';
import { ElementPageCheckComponent } from '../page/element-page-check.component';
import { ElementVlistCheckComponent } from '../page/element-vlist-check.component';
import { ElementArtlistCheckComponent } from '../page/element-artlist-check.component';
import { ElementSingleResCheckComponent } from '../page/element-singleRes-check.component';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';
import { PageImgshowComponent } from '../page/page-imgshow.component';
import { PageAddrelationComponent } from '../page/page-addrelation.component';
import {ElementConfirSaveComponent} from '../page/element-confirSave.component';
import {ElementAgainImgComponent} from '../page/element-againImg.component';

// import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
// import { DatepickerI18n, DatepickerI18nType } from '../../shared/datepickerI18n/datepickerI18n';
import {Router} from '@angular/router';
import {ElementwallCheckComponent} from '../page/element-wall-check.component';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {num} from '../../shared/custom-validator/num/number';
import {ElementAlbumCheckComponent} from '../page/element-album-check.component';
import {ElementTagCheckComponent} from '../page/element-tag-check.component';
import {environment} from '../../../environments/environment';
import {OttoperateBusinessService} from '../../business-service/ottoperate/ottoperate-business.service';

@Component({
  selector: 'c-element-save',
  templateUrl: './element-save.component.html',
  styleUrls: ['./element-save.component.scss'],
  // providers: [DatepickerI18nType, { provide: NgbDatepickerI18n, useClass: DatepickerI18n }]
})
export class ElementSaveComponent implements OnInit, OnDestroy {

  saveEleForm: FormGroup;

  windowUrl: any;
  drawFlag = true;
  modalData: any;
  preData: any = "";
  preFlag = false;
  preAddFlag = false;
  firstFlag = true;
  modalType: String = 'editPreinstall'; // editPreinstall
  checkEleList: Boolean = true; // 元素值input分 点击选取true 和 直接输入false

  constructor(public activeModal: NgbActiveModal,
              private modalService: ModalService,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private ottoperateBusinessService: OttoperateBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private router: Router) {
    const aliasFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const eleTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const eleValueFc = new FormControl('', Validators.compose([]));
    const eleValueStrFc = new FormControl('', Validators.compose([]));
    const eleAttrFc = new FormControl('', Validators.compose([]));
    const resTypeFc = new FormControl('');
    const preinstallFc = new FormControl('');
    const selectedDateFc = new FormControl('');
    const preHourNameFc = new FormControl('', Validators.compose([ CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    const preMiuNameFc = new FormControl('', Validators.compose([ CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    const preSecNameFc = new FormControl('', Validators.compose([ CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));

    this.saveEleForm = this.formBuilder.group({
      alias: aliasFc,
      eleType: eleTypeFc,
      eleValue: eleValueFc,
      eleValueStr: eleValueStrFc,
      eleAttr: eleAttrFc,
      resType: resTypeFc,
      preHourFc: preHourNameFc,
      preMiuFc: preMiuNameFc,
      preSecFc: preSecNameFc,
      selectedDate: selectedDateFc,
    });
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("/draw/")>= 0) {
      this.drawFlag = false;
    }
  }

  resTypes: Array<any>= [pageResType[0]];
  resType: any;
  eleTypes: Array<any>= [];
  eleType: any;
  eleAttrs: Array<any>= [pageEleAttr[0]];
  eleAndroid: Array<any>= [{type: 6, name: '应用内页'}];
  eleAttr: any;

  imgApi: any = '';
  imgApiSD: any = '';
  ngOnInit() {
    let that = this;
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    if (!this.drawFlag) {
      this.eleTypes = pageEleTypeModal.slice(0, pageEleTypeModal.length - 2);
    } else {
      this.eleTypes = pageEleTypeModal;
    }
    this.saveEleForm.patchValue({
      eleType: this.eleTypes[0].type,
      resType: this.resTypes[0].type,
      eleAttr: this.eleAttrs[0].type,
      preinstallType: 'now',
    });
    // this.saveEleForm.controls["selectedDate"].disable();
    this.getAndroidVal();
  }

  ngOnDestroy() {
    if (this.showThisEleModal !== null) {
      this.showThisEleModal.close();
    }
  }

  eleValueData: Array<any>= [];
  getAndroidVal() {
    let that = this;
    let param = {};
    this.pageBusinessService.androidVal(param, function(data){
      if (data !== null) {
        that.eleValueData = data.obj;
        if (that.modalData !== '') {
          that.getDetail(function(){
            that.eleTypeChange();
          });
        }
      } else {
        that.eleValueData = [];
      }
    });
  }
  tagDataList: Array<any> = [];
  getTagList() {
    let that = this;
    let param = {}
    this.pageBusinessService.getLabelList(param, function(data){
      if (data !== null) {
        that.tagDataList = data.data;
      } else {
        that.tagDataList = [];
      }
      if (that.modalData !== '') {
        that.getDetail(function(){
          that.eleTypeChange();
        });
      }
    });
  }

  detailData: any = null;
  insertTimeStrFc: any = '';
  eleTypeStr: String = '';
  getDetail (callback) {
    let that = this;
    let param;
    param = {elementId: this.modalData.elementId};
    this.ottoperateBusinessService.getElementInfo(param, function(data){
      that.detailData = data;
      that.saveEleForm.patchValue({
        alias: data.alias,
        eleType: data.eleType,
        resType: data.resType,
        eleAttr: data.eleCategory,
        eleValue: data.eleValue,
      });
      // that.tagDataList.forEach(i => {
      //   if (parseInt(i.id) === parseInt(that.saveEleForm.getRawValue().eleValue)) {
      //     that.saveEleForm.patchValue({
      //       eleValue: i.labelName,
      //     });
      //   }
      // })
      if (that.modalData.preAddFlag) {
        that.insertTimeStrFc = data.insertTimeStr;
      }
      that.eleTypeStr = data.eleType;
      that.getEleValData(data.eleValue);
      that.doImg();
      callback();
    });

  }
  doImgList: Array<any> = [];
  doImg() {
    // this.detailData
    console.log(this.detailData)
    this.imgDataArray = [];
    for (let i = 0; i < 3; i++) {
      if ( i === 0 ) {
        if ( !!this.detailData.imageVa) {
          this.imgDataArray.push({
            file1: this.imgApi + this.detailData.imageVa,
            file2: this.imgApiSD + this.detailData.imageVa,
            desc: this.detailData.imageVaDes,
          })
          // this.imgDataArray[i].file1 = this.imgApi + this.detailData.imageVa;
          // this.imgDataArray[i].file2 = this.imgApiSD + this.detailData.imageVa;
          // this.imgDataArray[i].desc = this.detailData.imageVaDes;
        } else {
          this.imgDataArray.push({
            file1: '',
            file2: '',
            desc: '',
          })
        };
      } else if ( i === 1) {
        if ( !!this.detailData.imageVb) {
          this.imgDataArray.push({
            file1: this.imgApi + this.detailData.imageVb,
            file2: this.imgApiSD + this.detailData.imageVb,
            desc: this.detailData.imageVbDes,
          })
        } else {
          this.imgDataArray.push({
            file1: '',
            file2: '',
            desc: '',
          })
        };
      } else if ( i === 2 ) {
        if ( !!this.detailData.imageVc) {
          this.imgDataArray.push({
            file1: this.imgApi + this.detailData.imageVc,
            file2: this.imgApiSD + this.detailData.imageVc,
            desc: this.detailData.imageVcDes,
          })
        } else {
          this.imgDataArray.push({
            file1: '',
            file2: '',
            desc: '',
          })
        };
      }

    };
    // this.doImgList.push (this.detailData);
  }

  eleValData: Array<any> = [];
  getEleValData(id) {
    let that = this;
    let param;
    let eleType = this.saveEleForm.controls['eleType'].value;
    if (eleType === "page") {
      param = {eleValue: id};
      this.pageBusinessService.getEleValPageData(param, function(data){
        if(data.data.length > 0) {
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    } else if (eleType === "vlist" || eleType === "plist") {
      param = {eleValue: id};
      this.pageBusinessService.getEleValListData(param, function(data){
        if(data.data.length > 0){
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    } else if (eleType === "res") {
      param = {eleValue: id, resType: this.detailData.resType};
      this.pageBusinessService.getEleValResData(param, function(data){
        if(data.data.length > 0){
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    }
    else if (eleType === "album") {
      param = {eleValue: id};
      this.pageBusinessService.getEleValAlbData(param, function(data){
        if(data.data.length > 0){
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    }else if (eleType === "tag") {
      param = {label: id};
      this.pageBusinessService.getLabelResource(param, function(data){
        if (data.data.length > 0) {
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    }

  }

  pageEleList: Array<any>= [];
  getEleList(ids) {
    let param = {eleValue: ids};
    let that = this;
    this.pageBusinessService.getEleList(param, function(data) {
      if (data.data.length > 0) {
        that.pageEleList = data.data;
      }
    });
  }

  checkEleValChange () {
    let that = this;
    // if (this.detailData !== null && this.detailData.eleType === this.saveEleForm.controls["eleType"].value && this.detailData.resType === this.saveEleForm.controls["resType"].value  ) {
    //   this.saveEleForm.get(['eleValue']).setValue(this.detailData.eleValue);
    //   this.firstFlag = false;
    // }
    // else {
    //   this.saveEleForm.get(['eleValue']).setValue("");
    // }
    if (this.saveEleForm.controls["eleType"].value === 'tag') {
      that.tagDataList.forEach(i => {
        if ( parseInt(i.id) === parseInt(that.saveEleForm.getRawValue().eleValue)) {
          that.saveEleForm.patchValue({
            eleValueStr: i.labelName,
          });
        }
      });
    }
  }
  checkChange () {
    let that = this;
    if (this.detailData !== null && this.detailData.eleType === this.saveEleForm.controls["eleType"].value && this.detailData.resType === this.saveEleForm.controls["resType"].value  ) {
      this.saveEleForm.get(['eleValue']).setValue(this.detailData.eleValue);
      this.firstFlag = false;
    } else {
      if (this.saveEleForm.controls["eleType"].value === 'Android') {
        this.saveEleForm.get(['eleValue']).setValue("order");
      } else {
        this.saveEleForm.get(['eleValue']).setValue("");
      }
    }
    if (this.saveEleForm.controls["eleType"].value === 'tag') {
      that.tagDataList.forEach(i => {
        if (parseInt(i.id) === parseInt(that.saveEleForm.getRawValue().eleValue)) {
          that.saveEleForm.patchValue({
            eleValueStr: i.labelName,
          });
        }
      })
    }
  }
  toLinkFlag: any = false; // 元素值是否显示查看按钮
  AndroidFlag: any = false; // 元素类型为安卓时  元素值显示安卓的对应值
  eleTypeChange() {
    let that = this;
    let eleVal = this.saveEleForm.controls['eleType'].value;
    if (eleVal === 'plist' || eleVal === 'album') {
      this.toLinkFlag = true;
    } else {
      this.toLinkFlag = false;
    };
    if (eleVal === 'Android') {
      this.AndroidFlag = true;
    } else {
      this.AndroidFlag = false;
    };
    // let val1 = ["page", "act", "link", "art"];
    let val1 = ["page", "act", "link", "art","wall",];
    let val2 = ["vlist", "plist", "res","album","tag"];
    let valVideo = ["video"];

    // 资源类型
    this.resTypes = [];
    if (val1.indexOf(eleVal) !== -1) {
      this.resTypes.push(pageResType[0]);
    } else if (val2.indexOf(eleVal) !== -1) {
      if (this.drawFlag !==false) {
        for (let i of pageResType) {
          if (i.type !== 0) {
            this.resTypes.push(i);
          }
        }
      }else {
        this.resTypes.push( pageResType[3]);
      }
    } else if (valVideo.indexOf(eleVal) !== -1) {
      this.resTypes.push( pageResType[1]);
    }

    // 元素属性
    let val4 = ["vlist", "plist", "res","album"];
    let val5 = ["Android",];
    if (val4.indexOf(eleVal) !== -1) {
      this.eleAttrs = pageEleAttr.slice(1, pageEleAttr.length);
    } else if (valVideo.indexOf(eleVal) !== -1) {
      // this.eleAttrs.push( pageEleAttr[1]);
      this.eleAttrs = [pageEleAttr[1]];
    } else if (val5.indexOf(eleVal) !== -1) {
      // this.eleAttrs.push( pageEleAttr[1]);
      this.eleAttrs = this.eleAndroid;
    } else {
      this.eleAttrs = [pageEleAttr[0]];
    }


    // 元素值
    // let val3 = ["page", "vlist", "plist", "res", "art",];
    let val3 = ["page", "vlist", "plist", "res", "art","wall","album","tag","video"];
    if (val3.indexOf(eleVal) !== -1) {
      this.checkEleList = true;
    } else {
      this.checkEleList = false;
    }


    if (this.modalData !== "") {
      if (eleVal !== this.detailData.eleType) {
        if (eleVal === 'Android') {
          this.saveEleForm.get(['resType']).setValue("0");
          this.saveEleForm.get(['eleAttr']).setValue(6);
        } else {
          this.saveEleForm.get(['resType']).setValue("");
          this.saveEleForm.get(['eleAttr']).setValue("");
        }
      } else {
        this.saveEleForm.get(['resType']).setValue(this.detailData.resType);
        this.saveEleForm.get(['eleAttr']).setValue(this.detailData.eleCategory);
      }
    } else {
      if (eleVal === "album") {
        that.saveEleForm.patchValue({
          eleAttr: this.eleAttrs[3].type,
          resType: this.resTypes[0].type,
        });
      } else if (eleVal === "Android") {
        console.log(this.eleValueData[0].type)
        that.saveEleForm.patchValue({
          eleAttr: this.eleAttrs[0].type,
          eleValue: this.eleValueData[0].type,
        });
      } else {
        this.saveEleForm.get(['resType']).setValue(this.resTypes[0].type);
        this.saveEleForm.get(['eleAttr']).setValue(this.eleAttrs[0].type);
      }
    }

    this.checkChange();
  }

  resultStr: any;
  showThisEleModal: any = null;
  showThisEle() {
    let that = this;
    if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[0].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementPageCheckComponent, {size: 'lg'});
    } else if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[1].type || this.saveEleForm.controls['eleType'].value === pageEleTypeModal[2].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementVlistCheckComponent, {size: 'lg'});
    } else if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[3].type || this.saveEleForm.controls['eleType'].value === pageEleTypeModal[10].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementSingleResCheckComponent, {size: 'lg'});
    } else if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[6].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementArtlistCheckComponent, {size: 'lg'});
    }else if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[7].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementwallCheckComponent, {size: 'lg'});
    }else if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[8].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementAlbumCheckComponent, {size: 'lg'});
    }else if (this.saveEleForm.controls['eleType'].value === pageEleTypeModal[9].type) {
      this.showThisEleModal = this.ngbModalService.open(ElementTagCheckComponent, {size: 'lg'});
    }
    this.showThisEleModal.componentInstance.modalType = {
      eleType: this.saveEleForm.controls['eleType'].value,
      eleAttr: this.saveEleForm.controls['eleAttr'].value,
      resType: this.saveEleForm.controls['resType'].value,
    };
    this.showThisEleModal.result.then((result) => {
      that.saveEleForm.get(['eleValue']).setValue(result);
      if (this.saveEleForm.controls['eleType'].value === 'tag') {
        that.tagDataList.forEach( i => {
              if (i.id === this.saveEleForm.getRawValue().eleValue) {
                that.saveEleForm.patchValue({
                  eleValueStr: i.labelName,
                })
              }
            })
      }
    }, (reason) => {
    });
  }

  imgDataArray: Array<any> = [{file1: '', file2: '', desc: ''}];
  newFile: any = new FormData();
  imgUp(ev, index, type) {
    let evAnd = ev.target ? ev.target : ev.srcElement;
    let file = evAnd.files[0];
    if (index === 0) {
      if (type === 'hd') {
        this.newFile.set( "fileA", file);
      } else {
        this.newFile.set( "fileB", file);
      }
    } else if (index === 1) {
      if (type === 'hd') {
        this.newFile.set( "fileC", file);
      } else {
        this.newFile.set( "fileD", file);
      }
    } else {
      if (type === 'hd') {
        this.newFile.set( "fileE", file);
      } else {
        this.newFile.set( "fileF", file);
      }
    }
    // this.newFile.set( "file" + index, file);
    let that = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      switch (index) {
        case 0:
          if (type === 'hd') {
            that.imgDataArray[index].file1 = this.result;
            console.log(that.imgDataArray[index].file1)
          } else {
            that.imgDataArray[index].file2 = this.result;
            console.log(that.imgDataArray[index].file2)
          }
          break;
        case 1:
          if (type === 'hd') {
            that.imgDataArray[index].file1 = this.result;
          } else {
            that.imgDataArray[index].file2 = this.result;
          }
          break;
        case 2:
          if (type === 'hd') {
            that.imgDataArray[index].file1 = this.result;
          } else {
            that.imgDataArray[index].file2 = this.result;
          }
          break;
      }
    };
  }
  addImg() {
    this.imgDataArray.push({
      file1: '',
      file2: '',
      desc: '',
    })
  }
  delImg(index) {
    let that = this;
    if ( this.modalData ! === '') {
      const confirmCfg = new ConfirmConfig('是否确认删除？');
      this.modalService.confirm(confirmCfg).then((result) => {
        let param: any = {};
        if (this.modalData.preFlag) {
          param.primaryId = this.modalData.data.id,
            param.op = 1
        } else {
          param.primaryId = this.modalData.elementId,
            param.op = 0
        };
        let ind = '';
        if (index === 0) {
          ind = 'A';
        } else if (index === 1) {
          ind = 'B';
        } else if (index === 2 ) {
          ind = 'C';
        }
        param.imageABC = ind;
        this.pageBusinessService.deleteImage(param, function(data){
          if (that.modalData.preFlag) {
            that.modalData.data = data;
          } else {
            that.modalData = data;
          }
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
          that.getDetail(function(){
            that.eleTypeChange();
          });
        });
      }, (reason) => {
        // that.getList();
      });
    } else {
      this.imgDataArray.splice(index, 1);
    }

  }

  isHasAgain: any = '';
  eleUploadImgModal: any = null;
  upload(data) {
    this.showThisEleModal = this.ngbModalService.open(ElementConfirSaveComponent, {size: 'sm'});
    this.showThisEleModal.componentInstance.oData = {
      oData: this.relationList,
      eleType: this.saveEleForm.controls['eleType'].value,
      eleValue: this.saveEleForm.controls['eleValue'].value,
      detailData: this.detailData,
    };
    this.showThisEleModal.result.then((result) => {
      this.isHasAgain = result;
      let that = this;
      // if (!this.modalData.preAddFlag) {
      //   this.eleUploadImgModal = this.ngbModalService.open(ElementAgainImgComponent, {size: 'lg'});
      //   if (this.modalData.preFlag) {
      //     this.eleUploadImgModal.componentInstance.modalData = this.modalData;
      //   } else {
      //     this.eleUploadImgModal.componentInstance.modalData = data;
      //   }
      //   this.eleUploadImgModal.result.then((result) => {
      //     if (result === 'succ'){
      //       // that.defaultList();
      //       that.close();
      //     }
      //   }, (reason) => {
      //     // that.defaultList();
      //     // that.close();
      //   });
      // }
    }, (reason) => {
    });
  }

  isHas: any = '';
  ok(type): void {
    let that =this;
    if (this.modalData !== "") {
      this.showThisEleModal = this.ngbModalService.open(ElementConfirSaveComponent, {size: 'sm'});
      this.showThisEleModal.componentInstance.oData = {
        oData: this.relationList,
        eleType: this.saveEleForm.controls['eleType'].value,
        eleValue: this.saveEleForm.controls['eleValue'].value,
        detailData: this.detailData,
      };
      this.showThisEleModal.result.then((result) => {
        this.isHas = result;
        this.edit(null);
      }, (reason) => {
      });
    } else {
      if (!!type) { // 新增时，点关联管理，先确认，获取参数后再获取关联数据；
        this.edit(function () {
          that.openRelation();
        });
      } else {
        this.edit(null);
      }
    }
  }
  insertTimeFc: any;
  preTimeFc: any;
  preHourFc: any = "";
  preMiuFc: any = "";
  preSecFc: any = "";
  tagEleValue: any = "";
  preNum: any = 0; // 为了区分预设新增时，点击图片上传按钮保存后，取消图片上传，再次点击确认，防止误操作；
  responseData: any;
  saveData:any = '';
  edit(callback): void {
    let that = this;
    let param: any;
    // if (this.saveEleForm.getRawValue().resType === "") {
    //   this.saveEleForm.removeControl('resType');
    // }
    if (this.saveEleForm.valid) {
      param =  {
        // alias: this.saveEleForm.getRawValue().alias,
        // eleType: this.saveEleForm.getRawValue().eleType,
        // resType: this.saveEleForm.getRawValue().resType,
        // eleValue: this.saveEleForm.getRawValue().eleValue,
      };
      this.newFile.set( "alias", this.saveEleForm.getRawValue().alias);
      this.newFile.set( "eleType", this.saveEleForm.getRawValue().eleType);
      this.newFile.set( "resType", this.saveEleForm.getRawValue().resType);
      this.newFile.set( "eleCategory", this.saveEleForm.getRawValue().eleAttr);
      this.newFile.set( "eleValue", this.saveEleForm.getRawValue().eleValue);
      // let ET = this.saveEleForm.getRawValue().eleType;
      // if (( ET === 'plist' || ET === 'vlist' || ET === 'res' || ET === 'album') && this.isHas === 'yes') {
      //   param.isSaveHis = true;
      //   this.newFile.set( "isSaveHis", true);
      // } else {
      //   param.isSaveHis = false;
      //   this.newFile.set( "isSaveHis", false);
      // }
      this.ottoperateBusinessService.saveElement(this.newFile, function(data){
        console.log(data.elementId)
        that.saveData = data.obj;
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.activeModal.close(data.elementId);
        // that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

  addRelation () {
    let that =this;
    if (this.modalData !== '') {
      this.openRelation();
    } else {
      this.ok('relation');
    }
  }

  openRelation() {
    let that = this;
    console.log(that.saveData);
    this.showThisEleModal = this.ngbModalService.open(PageAddrelationComponent, {size: 'lg'});
    if (this.modalData !== '') {
      this.showThisEleModal.componentInstance.oData = this.detailData;
    } else {
      this.showThisEleModal.componentInstance.oData = this.saveData;
    }
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
      that.getRelationList(that.modalData.elementId);
    });
  }
  lookTemplate (data) {
    let that = this;
    if (data.template === '' || data.template === null) {
      const toastCfg = new ToastConfig(ToastType.INFO, '', '该关联暂无模板!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }

    this.showThisEleModal = this.ngbModalService.open(PageImgshowComponent);
    if (data) {
      this.showThisEleModal.componentInstance.oData = data;
    }
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
      // that.defaultList();
    });
  }

  relationList: Array<any> = [];
  getRelationList (id) {
    let that = this;
    let param = {
      elementId: id
    };

    this.pageBusinessService.getRelationService(param, function(data){
      that.relationList = data.data;
    });
  }

  delRelationPart (data) {
    let that = this;
    let param = {
      partId: data.partId,
      elementId: data.elementId
    };

    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.pageBusinessService.delRelationPartService(param, function(data2){
        that.getRelationList(data.elementId);
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
      });
    }, (reason) => {
    });
  }

  // preinstallChange () {
  //   let v = this.saveEleForm.controls["preinstallType"].value;
  //   let a = this.saveEleForm.controls["selectedDate"].value;
  //   // this.saveEleForm.controls["selectedDate"].disable();
  // }
  toLink(e) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    if (this.saveEleForm.getRawValue().eleType === 'plist') {
      this.router.navigate(['/app/program/programList'], {queryParams: { sCode: this.saveEleForm.getRawValue().eleValue}});
    } else if (this.saveEleForm.getRawValue().eleType === 'album') {
      this.router.navigate(['/app/album/albumList'], {queryParams: { sCode: this.saveEleForm.getRawValue().eleValue}});
    }
  }
}
