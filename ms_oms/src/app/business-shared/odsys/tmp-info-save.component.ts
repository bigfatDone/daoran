import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { CommonBusinessService } from '../../business-service/common/common-business.service';
import { carrierAttr } from '../../global-constant';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'c-tmp-info-save',
  templateUrl: './tmp-info-save.component.html',
  styleUrls: ['./tmp-info-save.component.scss']
})
export class TmpInfoSaveComponent implements OnInit{

  customData: Array<any>= [{type: 0 , name: '否'}, {type: 1 , name: '是'} ];

  paramModal: any = '';

  projectName: any = '';

  saveTmpInfo: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private odsysBusinessService: OdsysBusinessService,
              private commonBusinessService: CommonBusinessService,
  ) {
    const templateFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const aliasFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)]));
    const carrierFc = new FormControl('', Validators.compose([Validators.required ]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required ]));
    const tmpImgFc = new FormControl('', Validators.compose([Validators.required ]));
    const customNameFc = new FormControl('', Validators.compose([Validators.required ]));
    this.saveTmpInfo = this.formBuilder.group({
      template: templateFc,
      alias: aliasFc,
      carrier: carrierFc,
      projectCode: projectCodeFc,
      templateImg: tmpImgFc,
      customName: customNameFc,
    });
    this.saveTmpInfo.controls['templateImg'].disable();
  }

  ngOnInit () {
    this.getProjects();
    if (this.paramModal !== '') {
      this.getTmpDetail();
      this.saveTmpInfo.controls['customName'].disable();
    } else {
      this.saveTmpInfo.patchValue({
        customName: this.customData[0].type,
      });
    }
  }

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];

  getProjects() {
    let that = this;
    this.odsysBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  projectChange(value) {
    this.projects.forEach(i => {
      if (value === i.sProductcode) {
        this.projectName = i.sProductName;
      }
    });
  }

  imgServiceUrl: any="";
  uploadFile(ev) {
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("type", "temp");
      this.commonBusinessService.uploadPicPost(param, function(data){
        that.saveTmpInfo.patchValue({"templateImg": data});
        that.imgServiceUrl = environment.imgApi + data;
      });
    }
  }

  getTmpDetail() {
    let that = this;
    this.odsysBusinessService.getTmpDetail({id: this.paramModal}, function(data){
      that.saveTmpInfo.patchValue({
        template: data.template,
        alias: data.alias,
        carrier: data.carrier,
        projectCode: data.projectCode,
        templateImg: data.templateImg,
        customName: data.diyFlag,
      });
      that.projectName = data.projectName;
      that.imgServiceUrl = environment.imgApi + data.templateImg;
    });
  }

  ok(): void {
    let param: any;
    let that = this;
    if (this.saveTmpInfo.valid) {
      param = {
        template: this.saveTmpInfo.getRawValue().template,
        alias: this.saveTmpInfo.getRawValue().alias,
        carrier: this.saveTmpInfo.getRawValue().carrier,
        projectCode: this.saveTmpInfo.getRawValue().projectCode,
        projectName: this.projectName,
        templateImg: this.saveTmpInfo.getRawValue().templateImg,
        diyFlag: this.saveTmpInfo.getRawValue().customName,
      };
      if (this.paramModal !== '') {
        param.id = this.paramModal;
      }
      this.odsysBusinessService.saveTmpInfo(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
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
}
