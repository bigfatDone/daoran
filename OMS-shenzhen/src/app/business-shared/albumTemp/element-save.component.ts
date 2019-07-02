import {Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
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
import {AlbumTempBusinessService} from '../../business-service/albumTemp/albumTemp-business.service';
import {environment} from '../../../environments/environment';


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
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private router: Router,
              private el: ElementRef,
              private albumTempBusinessService: AlbumTempBusinessService,
              ) {
    const aliasFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const eleTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const eleValueFc = new FormControl('', Validators.compose([]));
    const eleValueStrFc = new FormControl('', Validators.compose([]));
    const eleAttrFc = new FormControl('', Validators.compose([Validators.required]));
    const resTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const preinstallFc = new FormControl('');
    const selectedDateFc = new FormControl('');
    const layoutSeqFc = new FormControl('', Validators.compose([ Validators.required, CustomValidators.num,]));
    // const preHourNameFc = new FormControl('', Validators.compose([ CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    // const preMiuNameFc = new FormControl('', Validators.compose([ CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    // const preSecNameFc = new FormControl('', Validators.compose([ CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));

    this.saveEleForm = this.formBuilder.group({
      alias: aliasFc,
      eleType: eleTypeFc,
      eleValue: eleValueFc,
      eleValueStr: eleValueStrFc,
      eleAttr: eleAttrFc,
      resType: resTypeFc,
      selectedDate: selectedDateFc,
      layoutSeq: layoutSeqFc,
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
  eleAttr: any;
  imgApi: any = '';
  imgApiSD: any = '';
  ngOnInit() {
    let that = this;
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    console.log(this.modalData)
    // if (!this.drawFlag) {
    //   this.eleTypes = pageEleTypeModal.slice(0, pageEleTypeModal.length - 2);
    // } else {
      this.eleTypes = pageEleTypeModal;
    // }
    // this.saveEleForm.controls["selectedDate"].disable();
    if (this.modalData.type === 'edit') {
      this.saveEleForm.patchValue({
        alias: this.modalData.data.alias,
        eleType: this.modalData.data.eleType,
        eleValue: this.modalData.data.eleValue,
        layoutSeq: this.modalData.data.layoutSeq,
      });
      if (this.modalData.data.imageVa === null || this.modalData.data.imageVa === 'null') {
        this.imgSrcA = '';
        this.imgSrcB = '';
      } else {
        this.imgSrcA = this.imgApi + this.modalData.data.imageVa + '?random=' + Math.random();
        this.imgSrcB = this.imgApiSD + this.modalData.data.imageVa + '?random=' + Math.random();
      };
      if (this.modalData.data.imageVb === null || this.modalData.data.imageVb === 'null') {
        this.imgSrcC = '';
        this.imgSrcD = '';
      } else {
        this.imgSrcC = this.imgApi + this.modalData.data.imageVb + '?random=' + Math.random();
        this.imgSrcD = this.imgApiSD + this.modalData.data.imageVb + '?random=' + Math.random();
      };
      // this.imgSrcA = this.modalData.data.imageVa === null  ? '' : this.imgApi + this.modalData.data.imageVa;
      // this.imgSrcB = this.modalData.data.imageVa === null  ? '' : this.imgApiSD + this.modalData.data.imageVa;
      // this.imgSrcC = this.modalData.data.imageVb === null  ? '' : this.imgApi + this.modalData.data.imageVb;
      // this.imgSrcD = this.modalData.data.imageVb === null  ? '' : this.imgApiSD + this.modalData.data.imageVb;
      this.eleTypeChange();
    } else {
      this.saveEleForm.patchValue({
        alias: this.modalData.data.nextSpeicalElementAlias,
        eleType: this.eleTypes[0].type,
        resType: this.resTypes[0].type,
        eleAttr: this.eleAttrs[0].type,
      });
    }
    this.getTagList();
  }

  ngOnDestroy() {
    if (this.showThisEleModal !== null) {
      this.showThisEleModal.close();
    }
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
    });
  }

  detailData: any = null;
  insertTimeStrFc: any = '';
  eleTypeStr: String = '';
  getDetail (callback) {
    let that = this;
    let param;
    if (this.modalData.preFlag) {
      param = {id: this.modalData.id.id};
      this.pageBusinessService.elePreDetailPost(param, function(data){
        let date = data.insertTimeStr;
        let xxx = date.split(" ")[0].split("-");
        that.detailData = data;
        that.saveEleForm.patchValue({
          alias: data.alias,
          eleType: data.eleType,
          resType: data.resType,
          eleAttr: data.eleCategory,
          eleValue: data.eleValue,
          selectedDate: {
            "year": parseInt (xxx[0]),
            "month": parseInt (xxx[1]),
            "day": parseInt (xxx[2])
          },
        });
        that.tagDataList.forEach(i => {
          if ( parseInt(i.id) === parseInt(that.saveEleForm.getRawValue().eleValue)) {
            that.saveEleForm.patchValue({
              eleValueStr: i.labelName,
            });
          }
        })
        if (that.modalData.preFlag) {
          that.insertTimeStrFc = data.insertTimeStr;
          that.preTimeFc = that.insertTimeStrFc.slice(0,10);
          that.preHourFc = that.insertTimeStrFc.slice(11,13);
          that.preMiuFc = that.insertTimeStrFc.slice(14,16);
          that.preSecFc = that.insertTimeStrFc.slice(17,19);
        }
        that.eleTypeStr = data.eleType;
        that.getEleValData(data.eleValue);
        callback();
      });
    } else {
      if (this.modalData.preAddFlag) {
        param = {elementId: this.modalData.id.elementId};
      } else {
        param = {elementId: this.modalData.elementId};
      }
      this.pageBusinessService.eleDetailPost(param, function(data){
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
        callback();
      });
    }

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

  checkChange () {
    let that = this;
    if (this.modalData.type === 'edit' && this.modalData.data.eleType === this.saveEleForm.controls["eleType"].value && this.modalData.data.resType === this.saveEleForm.controls["resType"].value  ) {
      this.saveEleForm.get(['eleValue']).setValue(this.modalData.data.eleValue);
      this.firstFlag = false;
    } else {
      this.saveEleForm.get(['eleValue']).setValue("");
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

  eleTypeChange() {
    let that = this;
    let eleVal = this.saveEleForm.controls['eleType'].value;
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
    if (val4.indexOf(eleVal) !== -1) {
      this.eleAttrs = pageEleAttr.slice(1, pageEleAttr.length);
    } else if (valVideo.indexOf(eleVal) !== -1) {
      // this.eleAttrs.push( pageEleAttr[1]);
      this.eleAttrs = [pageEleAttr[1]];
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


    if (this.modalData.type === "edit") {
      if (eleVal !== this.modalData.data.eleType) {
        this.saveEleForm.get(['resType']).setValue("");
        this.saveEleForm.get(['eleAttr']).setValue("");
      } else {
        this.saveEleForm.get(['resType']).setValue(this.modalData.data.resType);
        this.saveEleForm.get(['eleAttr']).setValue(this.modalData.data.eleCategory);
      }
    } else {
      if (eleVal === "album") {
        that.saveEleForm.patchValue({
          eleAttr: this.eleAttrs[3].type,
          resType: this.resTypes[0].type,
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
      this.editOpen();
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
  editOpen(): void {
    let that = this;
    let param: any;
    if (this.saveEleForm.getRawValue().resType === "") {
      this.saveEleForm.removeControl('resType');
    }
    if (this.saveEleForm.valid) {
      param =  {
        alias: this.saveEleForm.controls["alias"].value,
        eleType: this.saveEleForm.controls["eleType"].value,
        eleCategory: this.saveEleForm.controls["eleAttr"].value,
        resType: this.saveEleForm.controls["resType"].value,
        eleValue: this.saveEleForm.controls["eleValue"].value,
      };
      let ET = this.saveEleForm.getRawValue().eleType;
      if (( ET === 'plist' || ET === 'vlist' || ET === 'res' || ET === 'album') && this.isHasAgain === 'yes') {
        param.isSaveHis = true;
      } else {
        param.isSaveHis = false;
      }
      // if (this.saveEleForm.getRawValue().eleType === 'tag') {
      //   that.tagDataList.forEach( i => {
      //     if (i.labelName === this.saveEleForm.getRawValue().eleValue) {
      //       that.tagEleValue = i.id;
      //     }
      //   })
      //   param.eleValue = that.tagEleValue;
      // }else {
      //   param.eleValue = this.saveEleForm.getRawValue().eleValue;
      // }
      if (this.modalData !== "") {
        if (this.modalData.preFlag || this.modalData.preAddFlag ) {
          this.preTimeFc = this.saveEleForm.controls["selectedDate"].value,
            this.preHourFc = this.saveEleForm.controls["preHourFc"].value,
            this.preMiuFc = this.saveEleForm.controls["preMiuFc"].value,
            this.preSecFc = this.saveEleForm.controls["preSecFc"].value
          if (typeof(this.preTimeFc) ==="object" && this.preTimeFc !=="" && this.preTimeFc !==null ) {
            this.preTimeFc = this.preTimeFc.year + "-" + this.preTimeFc.month + "-" + this.preTimeFc.day;
            // this.enDate = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
          }
          this.insertTimeFc = this.preTimeFc + " " + this.preHourFc + ":" + this.preMiuFc + ":" + this.preSecFc;
          if (this.modalData.preAddFlag) {
            param.elementId = this.modalData.id.elementId,
              param.insertTime = this.insertTimeFc,
              param.insertFlag = this.modalData.type
          } else if (this.modalData.preFlag) {
            param.elementId = this.modalData.id.elementId,
              param.id = this.modalData.id.id,
              param.insertTime = this.insertTimeFc,
              param.insertFlag = this.modalData.type
          }
          this.pageBusinessService.addPreinsertPost(param, function(data){
            const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
            that.toastService.toast(toastCfg);
            if (that.modalData.preAddFlag) {
              data.obj.preAddFlag = true;
              that.preNum += 1;
              that.responseData = data.obj;
            } else if (that.modalData.preFlag) {
              data.obj.preFlag = true;
            }
            that.eleUploadImgModal = that.ngbModalService.open(ElementAgainImgComponent, {size: 'lg'});
            that.eleUploadImgModal.componentInstance.modalData = data.obj;
            //   {
            //   id: data.obj,
            //   preAddFlag: true,
            //   eleType: that.modalData.eleType
            // }
            that.eleUploadImgModal.result.then((result) => {
              if (result === 'succ') {
                // that.defaultList();
                that.close();
              }
            }, (reason) => {
              // that.defaultList();
              // that.close();
            });

          })
        }else {
          param.elementId = this.modalData.elementId;
          this.pageBusinessService.eleAddPost(param, function(data){
            const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
            that.toastService.toast(toastCfg);

            that.eleUploadImgModal = that.ngbModalService.open(ElementAgainImgComponent, {size: 'lg'});
            that.eleUploadImgModal.componentInstance.modalData = data.obj;
            that.eleUploadImgModal.result.then((result) => {
              if (result === 'succ') {
                // that.defaultList();
                that.close();
              }
            }, (reason) => {
              // that.defaultList();
              // that.close();
            });

          });
        }
      }else {
        this.pageBusinessService.eleAddPost(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
        });
      }
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  imgSrcA: any = '';
  imgSrcB: any = '';
  imgSrcC: any = '';
  imgSrcD: any = '';
  newFile: any = new FormData();
  imgUp(ev, index) {
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
        case 'D':
          that.imgSrcD = this.result;
          break;
      }
    };
  }

  isHas: any = '';
  insertTimeFc: any;
  preTimeFc: any;
  preHourFc: any = "";
  preMiuFc: any = "";
  preSecFc: any = "";
  tagEleValue: any = "";
  preNum: any = 0;// 为了区分预设新增时，点击图片上传按钮保存后，取消图片上传，再次点击确认，防止误操作；
  responseData: any;
  ok(): void {
    console.log(this.saveEleForm.getRawValue().eleValue)
    let param: any;
    let that = this;
    // let areaCode = (this.saveEleForm.controls["area"].value).toString();
    // if (areaCode.indexOf('all') !== -1 && areaCode.indexOf(',') !== -1) {
    //   const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
    //   that.toastService.toast(toastCfg);
    //   return;
    // }
    if (this.saveEleForm.valid) {
      if (this.modalData.type === 'edit') {
        this.newFile.set('elementId', this.modalData.data.elementId);
        if (this.imgSrcA === '' && this.imgSrcB === '') {
          this.newFile.set('imageVa', '');
        } else {
          if (this.modalData.data.imageVa === null || this.modalData.data.imageVa === 'null' ||  this.modalData.data.imageVa === '') {
            this.newFile.set('imageVa', '');
          } else {
            this.newFile.set('imageVa', this.modalData.data.imageVa);
          };
        }
        if (this.imgSrcC === '' && this.imgSrcD === '') {
          this.newFile.set('imageVb', '');
        } else {
          if (this.modalData.data.imageVb === null || this.modalData.data.imageVb === 'null' || this.modalData.data.imageVb === '') {
            this.newFile.set('imageVb', '');
          } else {
            this.newFile.set('imageVb', this.modalData.data.imageVb);
          }
        }
        // this.newFile.set('imageVa', this.modalData.data.imageVa);
        // this.newFile.set('imageVb', this.modalData.data.imageVb);
      }
      this.newFile.set( "alias" , this.saveEleForm.getRawValue().alias);
      this.newFile.set( "eleType" , this.saveEleForm.getRawValue().eleType);
      this.newFile.set( "eleCategory" , this.saveEleForm.getRawValue().eleAttr);
      this.newFile.set( "resType" , this.saveEleForm.getRawValue().resType);
      this.newFile.set( "eleValue" , this.saveEleForm.getRawValue().eleValue);
      this.newFile.set( "layoutSeq" , this.saveEleForm.getRawValue().layoutSeq);
      this.newFile.set( "partId" , this.modalData.partId);
      this.newFile.set( "pageId" , this.modalData.data.pageId);

      this.albumTempBusinessService.saveSpecialElement(this.newFile, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
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

  addRelation () {
    let that =this;
    this.showThisEleModal = this.ngbModalService.open(PageAddrelationComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.oData = this.detailData;
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
  delImg( type ){
    if (type === 'one') {
      this.imgSrcA = '';
      this.imgSrcB = '';
    } else {
      this.imgSrcC = '';
      this.imgSrcD = '';
    }
  }
  // preinstallChange () {
  //   let v = this.saveEleForm.controls["preinstallType"].value;
  //   let a = this.saveEleForm.controls["selectedDate"].value;
  //   // this.saveEleForm.controls["selectedDate"].disable();
  // }
}
