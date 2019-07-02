import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';


@Component({
  selector: 'c-order-relationship-info',
  templateUrl: './order-relationship-info.component.html',
  styleUrls: ['./order-relationship-info.component.scss']
})
export class OderRelationshipInfo implements OnInit {

  saveOrderChargeForm: FormGroup;
  projectsArr = [];
  provincesArr = [];
  param: any = {};
  preTimeFc: any = '';
  preHourFc: any = '';
  preMiuFc: any = '';
  preSecFc: any = '';
  insertTimeFc: any = '';
  modalData: any = null;
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private odsysBusinessService: OdsysBusinessService,
  ) {
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCode = new FormControl('', Validators.compose([Validators.required]));
    const taskTypeFun = new FormControl('1', Validators.compose([Validators.required]));
    const taskStatusFun = new FormControl('0', Validators.compose([Validators.required]));
    const filePathFc = new FormControl('', Validators.compose([]));
    const createTimeFc = new FormControl('', Validators.compose([]));
    const preHourFc = new FormControl('', Validators.compose([Validators.required]));
    const preMiuFc = new FormControl('', Validators.compose([Validators.required]));
    const preSecFc = new FormControl('', Validators.compose([Validators.required]));
    const selectedDateFc = new FormControl('', Validators.compose([Validators.required]));

    this.saveOrderChargeForm = this.formBuilder.group({
      projectCode:  projectCode,
      provinceCode: provinceCodeFc,
      taskType : taskTypeFun,
      taskStatus : taskStatusFun,
      filePath : filePathFc,
      selectedDate : selectedDateFc,
      preHourFc: preHourFc,
      preMiuFc: preMiuFc,
      preSecFc: preSecFc,
    });
  }
  ngOnInit() {
    this.init();
  }
  init() {
    console.log(this.modalData);
    const that = this;
    this.odsysBusinessService.getAllProject(function(data){
      if (data.data.length > 0) {
        that.projectsArr = data.data;
        that.saveOrderChargeForm.get(['projectCode']).setValue(data.data[0].sProjectCode);
        if (that.modalData !== null) {
          that.saveOrderChargeForm.get(['projectCode']).setValue(that.modalData.projectCode);
        }
        that.getProvince();
      } else {
        that.projectsArr = [];
      }
    });
    if (that.modalData !== null) {
      const date = that.modalData.createTimeStr;
      const xxx = date.split(' ')[0].split('-');
      const xxxL = date.split(' ')[1].split(':');
      const times = {'year': parseInt(xxx[0]), 'month': parseInt (xxx[1]), 'day': parseInt (xxx[2])};
      that.saveOrderChargeForm.get(['selectedDate']).setValue(times);
      that.saveOrderChargeForm.patchValue({
        taskType : that.modalData.taskType,
        taskStatus : that.modalData.taskStatus,
        filePath : that.modalData.filePath,
        selectedDate : times,
        preHourFc: xxxL[0],
        preMiuFc: xxxL[1],
        preSecFc: xxxL[2],
      });
    }
  }
  getProvince() {
    const that = this;
    const param = {
      projectCode: that.saveOrderChargeForm.controls['projectCode'].value,
    };
    that.odsysBusinessService.getProvinceinfo(param, function(data){
      if (data.length > 0) {
        that.provincesArr = data;
        that.saveOrderChargeForm.get(['provinceCode']).setValue(data[0].provinceCode);
      } else {
        that.provincesArr = [];
      }
    });
  }
  uploadFile(ev) {
    const file = ev.target.files[0];
    if (file) {
      const param = new FormData();
      const that = this;
      param.append('file', file);
      this.odsysBusinessService.uploadRelationship(param, function(data){
        console.log(data);
        that.saveOrderChargeForm.patchValue({'filePath': data});
      });
    }
  }
  ok() {
    const that = this;
    this.preTimeFc = this.saveOrderChargeForm.controls['selectedDate'].value;
    this.preHourFc = this.saveOrderChargeForm.controls['preHourFc'].value;
    this.preMiuFc = this.saveOrderChargeForm.controls['preMiuFc'].value;
    this.preSecFc = this.saveOrderChargeForm.controls['preSecFc'].value;
    if (typeof(this.preTimeFc) === 'object' && this.preTimeFc !== '' && this.preTimeFc !== null ) {
      this.preTimeFc = this.preTimeFc.year + '-' + this.preTimeFc.month + '-' + this.preTimeFc.day;
    }
    this.insertTimeFc = this.preTimeFc + ' ' + this.preHourFc + ':' + this.preMiuFc + ':' + this.preSecFc;
    this.param = {
      projectCode: this.saveOrderChargeForm.controls['projectCode'].value,
      provinceCode: this.saveOrderChargeForm.controls['provinceCode'].value,
      taskType: this.saveOrderChargeForm.controls['taskType'].value,
      taskStatus: this.saveOrderChargeForm.controls['taskStatus'].value,
      filePath: this.saveOrderChargeForm.controls['filePath'].value,
      createTime: this.insertTimeFc,
    };
    if (parseInt(this.preHourFc) > 23) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '小时不能大于23', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.modalData !== null) {
      this.param.taskId = this.modalData.taskId;
    }
    console.log(this.param);
    if (this.saveOrderChargeForm.valid) {
      that.odsysBusinessService.saveTaskInfoRelationship(that.param, function(data){
        if (that.modalData !== null) {
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '修改成功！', 2000));
        } else {
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '新增成功！', 2000));
        }
        that.activeModal.dismiss({ status: 'closed' });
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    }
  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
