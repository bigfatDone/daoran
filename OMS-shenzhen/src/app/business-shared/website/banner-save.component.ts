import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {WebsiteBusinessService} from '../../business-service/website/website-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {environment} from '../../../environments/environment';
import { terminalType, startFlag} from '../../global-constant';

@Component({
  selector: 'c-banner-save',
  templateUrl: './banner-save.component.html',
  styleUrls: ['./banner-save.component.scss']
})
export class BannerSaveComponent implements OnInit {

  addBannerForm: FormGroup;
  terminalType: any = [{type: 1, name: 'PC端'}, {type: 2, name: '移动端'}];
  startFlag: any = [{type: 0, name: '未启用'}, {type: 1, name: '已启用'}];
  terminal: Array<any>= [terminalType[0]];
  start: Array<any>= [startFlag[0]];
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private commonBusinessService: CommonBusinessService,
              private websiteBusinessService: WebsiteBusinessService,
              ) {
    const nameFc = new FormControl('', Validators.compose([Validators.required]));
    const sortNameFc = new FormControl('', Validators.compose([Validators.required]));
    const stateNameFc = new FormControl('', Validators.compose([]));
    const typeNameFc = new FormControl('', Validators.compose([Validators.required]));
    const bgUrlFc = new FormControl('', Validators.compose([Validators.required]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    this.addBannerForm = this.formBuilder.group({
      name: nameFc,
      typeName: typeNameFc,
      sortName: sortNameFc,
      stateName: stateNameFc,
      bgUrl: bgUrlFc,
    });
    this.addBannerForm.controls['bgUrl'].disable();
  }

  ngOnInit() {
    if (this.bannerData !== '') {
      let that = this;
      this.getDetail();
      }else{
      this.addBannerForm.patchValue({
        typeName: this.terminal[0].type,
        stateName: this.start[0].type,
      });
    }
  }
  opFlag: any;
  bannerData: any = "";
  bgServiceUrl: any="";
  uploadFile(ev, type) {
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("type", type);
      this.commonBusinessService.uploadPicPost(param, function(data){
          that.addBannerForm.patchValue({"bgUrl": data});
          that.bgServiceUrl = environment.imgApi + data;
          });
    }
  }
  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    if (this.addBannerForm.getRawValue().stateName === "") {
      this.addBannerForm.removeControl('stateName');
    }
    if (this.addBannerForm.valid) {
      param = {
        name: this.addBannerForm.getRawValue().name,
        type: this.addBannerForm.getRawValue().typeName,
        sort: this.addBannerForm.getRawValue().sortName,
        state: this.addBannerForm.getRawValue().stateName,
        path: this.addBannerForm.getRawValue().bgUrl,
        op : this.changeOpFlag(),
      };
      if (this.bannerData !== "") {
        param.id = this.bannerData.id;
      }

      this.websiteBusinessService.addBannerPost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
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
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {id: this.bannerData.id};
    this.websiteBusinessService.detailBannerPost(param, function(data){
      that.detailData = data;
      that.bgServiceUrl = data.path;
      that.addBannerForm.patchValue({
        name: data.name,
        typeName: data.type,
        sortName: data.sort,
        bgUrl: data.path,
      });
      // that.getEleList(data.eleValue);
    });
  }
  changeOpFlag () {
    if (this.bannerData !== "" ) {
      this.opFlag = 2;
    } else {
      this.opFlag = 1;
    }
    return this.opFlag;
  }

}
