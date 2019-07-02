import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {environment} from '../../../environments/environment';
import {terminalType, startFlag, pageEleTypeModal} from '../../global-constant';
import {OttoperateBusinessService} from '../../business-service/ottoperate/ottoperate-business.service';
import {ElementSaveComponent} from './element-save.component';
import {ElementPageCheckComponent} from '../page/element-page-check.component';
import {ElementVlistCheckComponent} from '../page/element-vlist-check.component';
import {ElementSingleResCheckComponent} from '../page/element-singleRes-check.component';
import {ElementArtlistCheckComponent} from '../page/element-artlist-check.component';
import {ElementwallCheckComponent} from '../page/element-wall-check.component';
import {ElementAlbumCheckComponent} from '../page/element-album-check.component';
import {ElementTagCheckComponent} from '../page/element-tag-check.component';
import {ElementCheckComponent} from './element-check.component';

@Component({
  selector: 'c-operate-save',
  templateUrl: './operate-save.component.html',
  styleUrls: ['./operate-save.component.scss']
})
export class OperateSaveComponent implements OnInit, OnDestroy {

  saveOperateForm: FormGroup;
  modalData: any = '';
  optPositonData: any = [{type: 1, name: '启动页'}, {type:2, name: '首页'}, {type:3, name: '播控页'}, {type:4, name: '退出引流页'}];
  optTypeData: any = [{type: 1, name: 'VIP'}, {type:2, name: '登录'}, {type:3, name: '活动'}];
  popupRuleData: any = [{type: 0, name: '每次启动'}, {type:1, name: '每天首次启动'}];
  optUserTypeData: any = [{type: 0, name: '游客'}, {type:1, name: '普通会员'}, {type:2, name: 'VIP会员'}, {type:3, name: '体验VIP'},{type:9, name: '全部'}];
  layerNumData: any = [{type:1, name: '低'}, {type:2, name: '中'}, {type:3, name: '高'}];
  terminal: Array<any>= [terminalType[0]];
  start: Array<any>= [startFlag[0]];
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private ngbModalService: NgbModal,
              private ottoperateBusinessService: OttoperateBusinessService,
  ) {
    const eleValueFc = new FormControl('');
    const optNameFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const optPositonFc = new FormControl('', Validators.compose([]));
    const optTypeFc = new FormControl('', Validators.compose([]));
    const popupRuleFc = new FormControl('', Validators.compose([Validators.required]));
    // const optUserTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const urlLinkFc = new FormControl('', Validators.compose([Validators.required]));
    const beginTimeFc = new FormControl('', Validators.compose([Validators.required]));
    const endTimeFc = new FormControl('', Validators.compose([Validators.required]));
    const layerNumFc = new FormControl('', Validators.compose([Validators.required]));
    const stahuorFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    const endhuorFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    const staminuteFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    const endminuteFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    this.saveOperateForm = this.formBuilder.group({
      eleValue     : eleValueFc,
      optName     : optNameFc,
      projectCode : projectCodeFc,
      optPositon  : optPositonFc,
      optType     : optTypeFc,
      popupRule   : popupRuleFc,
      // optUserType : optUserTypeFc,
      urlLink     : urlLinkFc,
      layerNum    : layerNumFc,
      beginTime   : beginTimeFc,
      endTime     : endTimeFc,
      stahuor     : stahuorFc,
      endhuor     : endhuorFc,
      staminute   : staminuteFc,
      endminute   : endminuteFc,
    });
    // this.saveOperateForm.controls['bgUrl'].disable();
  }

  huor: any = '';
  minute: any = '';
  ngOnInit() {
    this.imgApi = environment.imgApi;
    if (this.modalData !== '') {
      let that = this;
      this.getDetail();
    }else{
      this.saveOperateForm.patchValue({
        layerNum    :1,
      });
    };
    this.saveOperateForm.patchValue({
      optType    :1,
    });
    this.getOTTProduct();
  }

  ngOnDestroy() {
    if (this.eleSaveModal !== null ) {
      this.eleSaveModal.close();
    }
  }
  ottItemData: Array<any> = [];
  getOTTItem() {
    let that = this;
    let param = {sProductCode: this.saveOperateForm.getRawValue().projectCode};
    this.ottoperateBusinessService.getOTTItemNew(param, function(data){
      if (data.obj.length > 0) {
        that.ottItemData = data.obj;
        if (that.modalData !== '' && that.detailData.projectCode === that.saveOperateForm.getRawValue().projectCode) {
          that.doItem();
        }
      } else {
        that.ottItemData = [];
      }
    });
  }
  doItem() {
    let arr = [];
    if (this.detailData.itemCode !== '') {
      arr = this.detailData.itemCode.split(",");
      this.ottItemData.forEach( i => {
        arr.forEach( j => {
          if (j === i.sProjectCode) {
            i.checkState = true;
          }
        });
        i.disabled = true;
      });
    };
  }
  doOptUserType() {
    let arr = [];
    if (this.detailData.optUserType !== '') {
      arr = this.detailData.optUserType.split(",");
      this.optUserTypeData.forEach( i => {
        arr.forEach( j => {
          if (parseInt(j) === i.type) {
            i.checkState = true;
          }
        });
      });
    };
  }
  ottProData: Array<any> = [];
  getOTTProduct() {
    let that = this;
    let param = {};
    this.ottoperateBusinessService.getOTTProduct(param, function(data){
      if (data.obj.length > 0) {
        that.ottProData = data.obj;
      } else {
        that.ottProData = [];
      }
    });
  }
  getProjectName() {
    let str = '';
    this.ottProData.forEach( i => {
      if (i.sProductCode === this.saveOperateForm.getRawValue().strProjectCode) {
        str = i.sProductName;
      }
    })
    return str;
  }

  newFile: any = new FormData();
  imgSrcA: any = '';
  imgSrcB: any = '';
  upload(ev, index) {
    let evAnd = ev.target ? ev.target : ev.srcElement;
    let file = evAnd.files[0];
    this.newFile.set("file" + index, file);
    let that = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
        case 'B':
          that.imgSrcB = this.result;
          break;
        // case 'C':
        //   that.imgSrcC = this.result;
        //   break;
      }
    };
  }
  /**
   * 上传
   */
  staTimeFc: any = '';
  staHourFc: any = '';
  staMiuFc: any = '';
  stainsertTimeFc: any = '';
  endTimeFc: any = '';
  endHourFc: any = '';
  endMiuFc: any = '';
  endinsertTimeFc: any = '';
  ok(): void {
    let that = this;
    let param: any;
    if (this.saveOperateForm.getRawValue().optName === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写广告名称', 2000));
      return;
    } else if (this.saveOperateForm.getRawValue().projectCode === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写产品信息', 2000));
      return;
    }else if (this.saveOperateForm.getRawValue().projectCode === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写产品信息', 2000));
      return;
    }else if (this.getItem() === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写项目', 2000));
      return;
    }else if (this.saveOperateForm.getRawValue().optPositon === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写运营位置', 2000));
      return;
    }else if (this.saveOperateForm.getRawValue().popupRule === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写展示规则', 2000));
      return;
    }else if (!this.getOptUserType()) {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写运营对象', 2000));
      return;
    }
    // 开始时间
    this.staTimeFc = this.saveOperateForm.controls["beginTime"].value;
    this.staHourFc = this.saveOperateForm.controls["stahuor"].value;
    this.staMiuFc = this.saveOperateForm.controls["staminute"].value;
    if (typeof(this.staTimeFc) ==="object" && this.staTimeFc !=="" && this.staTimeFc !==null ) {
      this.staTimeFc = this.staTimeFc.year + "-" + this.staTimeFc.month + "-" + this.staTimeFc.day;
    }
    this.stainsertTimeFc = this.staTimeFc + " " + this.staHourFc + ":" + this.staMiuFc;
    // 结束时间
    this.endTimeFc = this.saveOperateForm.controls["endTime"].value;
    this.endHourFc = this.saveOperateForm.controls["endhuor"].value;
    this.endMiuFc = this.saveOperateForm.controls["endminute"].value;
    if (typeof(this.endTimeFc) ==="object" && this.endTimeFc !=="" && this.endTimeFc !==null ) {
      this.endTimeFc = this.endTimeFc.year + "-" + this.endTimeFc.month + "-" + this.endTimeFc.day;
    }
    this.endinsertTimeFc = this.endTimeFc + " " + this.endHourFc + ":" + this.endMiuFc;
    if (this.saveOperateForm.getRawValue().optType !== 3) {
      this.saveOperateForm.removeControl('urlLink');
    }
    if (this.saveOperateForm.valid && this.getItem() !== '' && this.getOptUserType()) {
      if (parseInt(this.staHourFc) > 23 || parseInt(this.endHourFc) > 23){
          const toastCfg = new ToastConfig(ToastType.WARNING, '', '小时不能大于23', 2000);
          that.toastService.toast(toastCfg);
          return;
      }
      if (parseInt(this.staMiuFc) > 59 || parseInt(this.endMiuFc) > 59){
          const toastCfg = new ToastConfig(ToastType.WARNING, '', '分钟不能大于60', 2000);
          that.toastService.toast(toastCfg);
          return;
      }
      this.newFile.set('eleId', this.saveOperateForm.getRawValue().eleValue);
      this.newFile.set('optName', this.saveOperateForm.getRawValue().optName);
      this.newFile.set('projectCode', this.saveOperateForm.getRawValue().projectCode);
      this.newFile.set('optPositon', this.saveOperateForm.getRawValue().optPositon);
      this.newFile.set('popupRule', this.saveOperateForm.getRawValue().popupRule);
      this.newFile.set('optUserType', this.getOptUserType());
      // this.newFile.set('urlLink', this.saveOperateForm.getRawValue().urlLink);
      this.newFile.set('layerNum', this.saveOperateForm.getRawValue().layerNum);
      this.newFile.set('beginTime', this.stainsertTimeFc);
      this.newFile.set('endTime', this.endinsertTimeFc);
      // if (this.saveOperateForm.getRawValue().optType === '') {
      //   this.newFile.set('optType', 1);
      // } else {
      //   this.newFile.set('optType', this.saveOperateForm.getRawValue().optType);
      // };
      if (this.optTypefalg) {
        // if (this.saveOperateForm.getRawValue().optType === ''){
        //   const toastCfg = new ToastConfig(ToastType.WARNING, '', '跳转类型不能必选', 2000);
        //   that.toastService.toast(toastCfg);
        //   return;
        // } else {
          this.newFile.set('optType', this.saveOperateForm.getRawValue().optType);
        // }
      } else {
        this.newFile.set('optType', '');
      }
      if (this.saveOperateForm.getRawValue().optType === 3) {
        this.newFile.set('urlLink', this.saveOperateForm.getRawValue().urlLink);
      } else {
        this.newFile.set('urlLink', '');
      }
      if (this.modalData !== "") {
        this.newFile.set('id', this.modalData.id);
        this.newFile.set('itemCode', this.getItem());
      } else {
        this.newFile.set('itemCodeStr', this.getItem());
      }
      this.ottoperateBusinessService.savePagePopup(this.newFile, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写生效时间', 2000));
    }
  }

  checkItem($event, index) {
    this.ottItemData[index].checkState = $event.target.checked;
  }
  checkNode($event, index) {
    this.optUserTypeData[index].checkState = $event.target.checked;
  }
  proChange() {
    this.ottItemData = [];
    this.getOTTItem();
  }
  getItem(){
    let Category = [];
    this.ottItemData.forEach(i => {
      if (i.checkState ) {
        Category.push(i.sProjectCode);
      }
    });
    return Category.toString();
  }
  getOptUserType(){
    let arr = [];
    this.optUserTypeData.forEach(i => {
      if (i.checkState ) {
        arr.push(i.type);
      }
    });
    return arr.toString();
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  detailData: any = null;
  imgApi: any = '';
  getDetail () {
    let that = this;
    let param = {id: this.modalData.id};
    this.ottoperateBusinessService.getPagePopupById(param, function(data){
      if (data.optImage === null || data.optImage === 'null') {
        that.imgSrcA = '';
      } else {
        that.imgSrcA = that.imgApi + data.optImage;
      };
      if (data.optImageFocus === null || data.optImageFocus === 'null') {
        that.imgSrcB = '';
      } else {
        that.imgSrcB = that.imgApi + data.optImageFocus;
      };
      let stadate = data.beginDateStr;
      let enddate = data.endDateStr;
      let xxx = stadate.split("-");
      let endxxx = enddate.split("-");
      that.detailData = data;
      if (data.optType === '2') {
        that.optTypefalg = true;
      };
      if (data.optType === 3) {
        that.urlFlag = true;
      }
      that.saveOperateForm.patchValue({
        optName     : data.optName,
        projectCode : data.projectCode,
        optPositon  : data.optPositon,
        optType     : data.optType,
        popupRule   : data.popupRule,
        // optUserType :data.optUserType,
        urlLink     : data.urlLink,
        layerNum    : data.layerNum,
        eleValue    : data.eleId,
        stahuor     : data.beginHourStr,
        staminute   : data.beginMinStr,
        endhuor     : data.endHourStr,
        endminute   : data.endMinStr,
        beginTime: {
          "year": parseInt (xxx[0]),
          "month": parseInt (xxx[1]),
          "day": parseInt (xxx[2])
        },
        endTime: {
          "year": parseInt (endxxx[0]),
          "month": parseInt (endxxx[1]),
          "day": parseInt (endxxx[2])
        },
      });
      that.getOTTItem();
      that.doOptUserType();
      that.positionChange();
      that.saveOperateForm.controls['projectCode'].disable();
    });
  }
  optTypefalg = false;
  positionChange() {
    this.saveOperateForm.patchValue({
      urlLink: '',
      optType    :1,
    })
    if (this.saveOperateForm.getRawValue().optPositon === 2 || this.saveOperateForm.getRawValue().optPositon === '2') {
      this.optTypefalg = true;
      if (this.detailData !== null) {
        this.saveOperateForm.patchValue({
          optType: this.detailData.optType,
        });
        this.getUrlLink();
      }
      // console.log(this.saveOperateForm.getRawValue().optType)
      // if (this.saveOperateForm.getRawValue().optType === 3 || this.saveOperateForm.getRawValue().optType === '3') {
      //   this.urlFlag = true;
      // };
    } else {
      this.optTypefalg = false;
      this.urlFlag = false;
    }
  }
  urlFlag = false;
  getUrlLink() {
    if (this.saveOperateForm.getRawValue().optType === 3 || this.saveOperateForm.getRawValue().optType === '3') {
      this.urlFlag = true;
      console.log(this.detailData)
      if (this.detailData !== null) {
        this.saveOperateForm.patchValue({
          urlLink: this.detailData.urlLink,
        })
      }
    } else {
      this.urlFlag = false;
      this.saveOperateForm.patchValue({
        urlLink: '',
      })
    }
  }

  eleSaveModal: any = null;
  openEle(e, type) {
    let that = this;
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    this.eleSaveModal = this.ngbModalService.open(ElementSaveComponent, {size: 'sm'});
    if (type === 'add') {
      this.eleSaveModal.componentInstance.modalData = '';
    } else {
      this.eleSaveModal.componentInstance.modalData = {elementId: this.saveOperateForm.get(['eleValue']).value};
    }
    this.eleSaveModal.result.then((result) => {
      that.saveOperateForm.get(['eleValue']).setValue(result);
    }, (reason) => {
      // that.getList();
    });
  }
  editEle() {
    let that = this;
    this.eleSaveModal = this.ngbModalService.open(ElementCheckComponent, {size: 'lg'});
    this.eleSaveModal.componentInstance.modalType = {
      // eleType: this.saveOperateForm.controls['eleType'].value,
      // eleAttr: this.saveOperateForm.controls['eleAttr'].value,
      // resType: this.saveOperateForm.controls['resType'].value,
    };
    this.eleSaveModal.result.then((result) => {
      that.saveOperateForm.get(['eleValue']).setValue(result);
      // if (this.saveEleForm.controls['eleType'].value === 'tag') {
      //   that.tagDataList.forEach( i => {
      //     if (i.id === this.saveEleForm.getRawValue().eleValue) {
      //       that.saveEleForm.patchValue({
      //         eleValueStr: i.labelName,
      //       })
      //     }
      //   })
      // }
    }, (reason) => {
    });
  }

}
