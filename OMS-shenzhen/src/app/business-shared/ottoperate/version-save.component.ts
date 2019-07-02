import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {environment} from '../../../environments/environment';
import { terminalType, startFlag} from '../../global-constant';
import {OttoperateBusinessService} from '../../business-service/ottoperate/ottoperate-business.service';

@Component({
  selector: 'c-version-save',
  templateUrl: './version-save.component.html',
  styleUrls: ['./version-save.component.scss']
})
export class VersionSaveComponent implements OnInit {

  saveVersionForm: FormGroup;
  modalData: any = '';
  intMustUpdateData: any = [{type: 0, name: '强制升级'}, {type: 1, name: '不强制升级'}];
  startFlag: any = [{type: 0, name: '未启用'}, {type: 1, name: '已启用'}];
  terminal: Array<any>= [terminalType[0]];
  start: Array<any>= [startFlag[0]];
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private ottoperateBusinessService: OttoperateBusinessService,
              ) {
    const strVersionNameFc = new FormControl('', Validators.compose([Validators.required]));
    const strProjectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    // const strItemCodeStrsFc = new FormControl('', Validators.compose([Validators.required]));
    const dtUpdateTimeFc = new FormControl('', Validators.compose([Validators.required]));
    const intMustUpdateFc = new FormControl('', Validators.compose([Validators.required]));
    const strMsgFc = new FormControl('', Validators.compose([Validators.required]));
    const huorFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    // const huorFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));
    const minuteFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(1), Validators.maxLength(2)]));
    // const minuteFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));
    this.saveVersionForm = this.formBuilder.group({
      strVersionName  : strVersionNameFc,
      strProjectCode  : strProjectCodeFc,
      // strItemCodeStrs : strItemCodeStrsFc,
      dtUpdateTime    : dtUpdateTimeFc,
      intMustUpdate   : intMustUpdateFc,
      strMsg          : strMsgFc,
      huor            : huorFc,
      minute          : minuteFc,
    });
    // this.saveVersionForm.controls['bgUrl'].disable();
  }

  huor: any = '';
  minute: any = '';
  ngOnInit() {
    if (this.modalData !== '') {
      let that = this;
      this.getDetail();
      }else{
      this.saveVersionForm.patchValue({
        typeName: this.terminal[0].type,
        stateName: this.start[0].type,
      });
    }
    // this.getOTTItem();
    this.getOTTProduct();
  }
  ottItemData: Array<any> = [];
  getOTTItem() {
    let that = this;
    let param = {sProductCode: this.saveVersionForm.getRawValue().strProjectCode};
    this.ottoperateBusinessService.getOTTItemNew(param, function(data){
      if (data.obj.length > 0) {
        that.ottItemData = data.obj;
        if (that.modalData !== '' && that.detailData.strProjectCode === that.saveVersionForm.getRawValue().strProjectCode) {
          that.doItem();
        }
      } else {
        that.ottItemData = [];
      }
    });
  }
  doItem() {
    let arr = [];
    if (this.detailData.strItemCode !== '') {
      arr = this.detailData.strItemCode.split(",");
      this.ottItemData.forEach( i => {
        arr.forEach( j => {
          if (j === i.sProjectCode) {
            i.checkState = true;
          }
        });
        i.disableed = true;
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
      if (i.sProductCode === this.saveVersionForm.getRawValue().strProjectCode) {
        str = i.sProductName;
      }
    })
    return str;
  }
  /**
   * 上传
   */
  preTimeFc: any = '';
  preHourFc: any = '';
  preMiuFc: any = '';
  insertTimeFc: any = '';
  ok(): void {
    let that = this;
    let param: any;
    this.preTimeFc = this.saveVersionForm.controls["dtUpdateTime"].value;
    this.preHourFc = this.saveVersionForm.controls["huor"].value;
    this.preMiuFc = this.saveVersionForm.controls["minute"].value;
    if (typeof(this.preTimeFc) ==="object" && this.preTimeFc !=="" && this.preTimeFc !==null ) {
      this.preTimeFc = this.preTimeFc.year + "-" + this.preTimeFc.month + "-" + this.preTimeFc.day;
    }
    this.insertTimeFc = this.preTimeFc + " " + this.preHourFc + ":" + this.preMiuFc;
    if (this.saveVersionForm.valid ) {
      if (parseInt(this.preHourFc) > 23){
        const toastCfg = new ToastConfig(ToastType.WARNING, '', '小时不能大于23', 2000);
        that.toastService.toast(toastCfg);
        return;
      }
      if (parseInt(this.preMiuFc) > 59){
        const toastCfg = new ToastConfig(ToastType.WARNING, '', '分钟不能大于59', 2000);
        that.toastService.toast(toastCfg);
        return;
      }
      param = {
        strVersionName  : this.saveVersionForm.getRawValue().strVersionName,
        strProjectCode  : this.saveVersionForm.getRawValue().strProjectCode,
        strProjectName  : this.getProjectName(),
        strItemCodeStrs : this.getItem(),
        dtModifyTime    : this.insertTimeFc,
        intMustModify   : this.saveVersionForm.getRawValue().intMustUpdate,
        strMsg          : this.saveVersionForm.getRawValue().strMsg,
      };
      if (this.modalData !== "") {
        param.strId = this.modalData.strId;
      }

      this.ottoperateBusinessService.apkSave(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请按正确格式填写完整!', 2000));
    }
  }

  checkNode($event, index) {
    this.ottItemData[index].checkState = $event.target.checked;
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

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  detailData: any;
  getDetail () {
    let that = this;
    let param = {strId: this.modalData.strId};
    this.ottoperateBusinessService.apkDetail(param, function(data){
      if (data.success) {
        let date = data.obj.dtModifyTimeStr;
        let xxx = date.split(" ")[0].split("-");
        let x = date.split(" ")[1].split(":");
        that.detailData = data.obj;
        that.saveVersionForm.patchValue({
          strVersionName: data.obj.strVersionName,
          strProjectCode: data.obj.strProjectCode,
          intMustUpdate: data.obj.intMustModify,
          huor: x[0],
          minute: x[1],
          strMsg: data.obj.strMsg,
          dtUpdateTime: {
            "year": parseInt (xxx[0]),
            "month": parseInt (xxx[1]),
            "day": parseInt (xxx[2])
          },
        });
      }
      that.saveVersionForm.controls['strProjectCode'].disable();
      that.getOTTItem();
    });
  }

}
