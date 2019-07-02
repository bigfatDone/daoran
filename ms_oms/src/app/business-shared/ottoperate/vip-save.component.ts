import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {OttoperateBusinessService} from '../../business-service/ottoperate/ottoperate-business.service';

@Component({
  selector: 'c-vip-save',
  templateUrl: './vip-save.component.html',
  styleUrls: ['./vip-save.component.scss']
})
export class VipSaveComponent implements OnInit {

  saveVipForm: FormGroup;
  modalData: any = '';
  locationData: any = [{type: 1, name: '顶部VIP'}, {type: 2, name: '未订购用户'}, {type: 3, name: 'VIP用户'}];
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private ottoperateBusinessService: OttoperateBusinessService,
              ) {
    const titleFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)]));
    const locationFc = new FormControl('', Validators.compose([Validators.required]));
    const tipsFc = new FormControl('', Validators.compose([]));
    this.saveVipForm = this.formBuilder.group({
      title     : titleFc,
      location  : locationFc,
      tips      : tipsFc,
    });
  }
  ngOnInit() {
    if (this.modalData !== '') {
      let that = this;
      this.getDetail();
      }
  }
  ok(): void {
    const that = this;
    let param: any;
    if (this.saveVipForm.valid ) {
      param = {
        title : this.saveVipForm.getRawValue().title,
        displayLocation : this.saveVipForm.getRawValue().location,
        tipSlogans : this.saveVipForm.getRawValue().tips,
      };
      if (this.modalData !== "") {
        param.id = this.modalData.id;
      }
      this.ottoperateBusinessService.vipSave(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请按正确格式填写完整!', 2000));
    }
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
    let param = {id: this.modalData.id};
    this.ottoperateBusinessService.vipDetail(param, function(data){
      console.log(data);
      if (data.id !== '') {
        that.saveVipForm.patchValue({
          title: data.title,
          location: data.displayLocation,
          tips: data.tipSlogans,
        });
      }
    });
  }

}
