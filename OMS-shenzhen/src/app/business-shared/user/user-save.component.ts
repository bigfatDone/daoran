import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import { DepartmentBusinessService } from '../../business-service/department/department-business.service';
import { UserBusinessService } from '../../business-service/user/user-business.service';
import {number} from '../../shared/custom-validator/number/number';

import {userDefaultData} from '../../global-constant';


@Component({
  selector: 'c-user-save',
  templateUrl: './user-save.component.html'
})
export class UserSaveComponent implements OnInit, AfterViewInit {

  saveUserForm: FormGroup;

  modalData:any;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private departmentBusinessService: DepartmentBusinessService,
              private userBusinessService: UserBusinessService,
              private formBuilder: FormBuilder) {
    const userNameFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(16)]));
    const realNameFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(16)]));
    const passwordFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)]));
    const rpasswordFc = new FormControl('', CustomValidators.equalTo(passwordFc));
    const userTypeFc = new FormControl(number);
    const cNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const dNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const jNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const mobilePhoneFc = new FormControl('', Validators.compose([Validators.minLength(7), Validators.maxLength(11)]));
    const emailFc = new FormControl('', Validators.compose([CustomValidators.email]));
    this.saveUserForm = this.formBuilder.group({
      userName: userNameFc,
      realName: realNameFc,
      password: passwordFc,
      rpassword: rpasswordFc,
      mobilePhone: mobilePhoneFc,
      userType: userTypeFc,
      cName: cNameFc,
      dName: dNameFc,
      jName: jNameFc,
      email: emailFc
    });
  }

  ngOnInit() {
    this.saveUserForm.get("cName").valueChanges.subscribe(val => {
      this.getSelectDataList(2, val);
    });
    this.saveUserForm.get("dName").valueChanges.subscribe(val => {
      this.getSelectDataList(3, val);
    });
    if (this.modalData) { // 修改信息前获取个人信息
      this.getUserInfo(this.modalData);
      this.saveUserForm.removeControl('password');
      this.saveUserForm.removeControl('rpassword');
    }
  }

  // getNewUserType: number;
  ngAfterViewInit() {
    this.getSelectDataList(1 , '');
    this.getUserType();
  }

  /**
   * 上传
   */
  ok(): void {
    let param: any;
    let that = this;
    if (this.saveUserForm.getRawValue().userType === userDefaultData.type[0].id) {
      this.saveUserForm.removeControl('cName');
      this.saveUserForm.removeControl('dName');
      this.saveUserForm.removeControl('jName');
    } else if (this.saveUserForm.getRawValue().userType === userDefaultData.type[1].id) {
      this.saveUserForm.removeControl('dName');
      this.saveUserForm.removeControl('jName');
    }
    if (this.saveUserForm.getRawValue().email === "") {
      this.saveUserForm.removeControl('email');
    }
    if (this.saveUserForm.getRawValue().mobilePhone === "") {
      this.saveUserForm.removeControl('mobilePhone');
    }
    if (this.saveUserForm.valid) {
      param = {
        userName: this.saveUserForm.getRawValue().userName,
        realName: this.saveUserForm.getRawValue().realName,
        password: this.saveUserForm.getRawValue().password,
        type: this.saveUserForm.getRawValue().userType,
        mobilePhone: this.saveUserForm.getRawValue().mobilePhone,
        email: this.saveUserForm.getRawValue().email,
      };
      if (this.saveUserForm.getRawValue().userType === userDefaultData.type[1].id) {
        param.companyid = this.saveUserForm.getRawValue().cName;
      } else if (this.saveUserForm.getRawValue().userType === userDefaultData.type[2].id) {
        param.positionid = this.saveUserForm.getRawValue().jName;
      }
      if (this.modalData) {
        param.id = this.modalData;
      }
      this.userBusinessService.saveUser(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '用户信息保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

  getUserInfo(id) {
    let that = this;
    this.userBusinessService.getUserInfo(id, function(data){
      if ( data.obj ) {
        that.saveUserForm.patchValue({
            userName: data.obj.userName,
            realName: data.obj.realName,
            userType: data.obj.type,
            mobilePhone: data.obj.mobilePhone,
            email: data.obj.email
          });
        if (userDefaultData.type[1].id === data.obj.type) {
          that.saveUserForm.patchValue({cName: data.obj.companyid});
        }else if (userDefaultData.type[2].id === data.obj.type) {
          that.saveUserForm.patchValue({
            cName: data.obj.companyid,
            dName: data.obj.departid,
            jName: data.obj.positionid
          });
        }
      } else {
        that.userTypeList = [];
      }
    });
  }

  companyList: any= [];
  departmentList: any= [];
  jobList: any= [];
  getSelectData(param) {
    let that = this;
    this.departmentBusinessService.getAllList(param, function(data){
      if (data.obj) {
        switch (parseInt(param.type)) {
          case 1:
            that.companyList = data.obj;
            break;
          case 2:
            that.departmentList = data.obj;
            break;
          case 3:
            that.jobList = data.obj;
            break;
        }
      }else {
      }
    });
  }
  getSelectDataList(type, id) {
    var param = {type: type, id: id};
    this.getSelectData(param);
  }

  userType: any;
  userTypeList: Array <any>= [];
  getUserType() {
    let that = this;
    this.departmentBusinessService.getPositionType(function(data){
      if ( data.obj ) {
        that.userTypeList = data.obj;
      } else {
        that.userTypeList = [];
      }
    });
  }
}
