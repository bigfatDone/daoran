import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {WebsiteBusinessService} from '../../business-service/website/website-business.service';
import {articleType, startFlag, terminalType} from '../../global-constant';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';

@Component({
  selector: 'c-itemBes-save',
  templateUrl: './itemBes-save.component.html'
})
export class ItemBesSaveComponent implements OnInit {

  saveItemBesForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private orderBusinessService: OrderBusinessService,
  ) {
    const itemNameFc = new FormControl('', Validators.compose([Validators.required]));
    const projectTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const iStatusFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num, Validators.minLength(2), Validators.maxLength(2)]));
    const itemSecFc = new FormControl('', Validators.compose([Validators.maxLength(255)]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveItemBesForm = this.formBuilder.group({
      itemName: itemNameFc,
      itemCode: itemCodeFc,
      projectType: projectTypeFc,
      iStatus: iStatusFc,
      itemSec: itemSecFc,
    });
  }
  modalData: any= '';
  startFlag: any = [{type: 0, name: '未启用'}, {type: 1, name: '已启用'}];
  articleType: any = [{type: 1, name: '行业资讯'}, {type: 2, name: '公司动态'}];
  projectTypeData:Array<any>= [{type: '0', name: '非OTT'}, {type: '1', name: 'OTT'}];
  iStatusData:Array<any>= [{type: '1', name: '上线'}, {type: '0', name: '下线'}];
  article: Array<any>= [articleType[0]];
  start: Array<any>= [startFlag[0]];
  ngOnInit() {
    if ( this.modalData !== '') {
      this.getDetail();
      // this.saveItemBesForm.controls['itemName'].disable();
      this.saveItemBesForm.controls['itemCode'].disable();
    }else {
      // this.saveItemBesForm.patchValue({
      //   typeName: this.article[0].type,
      //   stateName: this.start[0].type,
      // });
      this.saveItemBesForm.get(['projectType']).setValue('0');
      this.saveItemBesForm.get(['iStatus']).setValue('1');
    }
  }

  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {iProjectId: this.modalData.iProjectId};
    this.orderBusinessService.itemDetial(param, function(data){
      that.detailData = data;
      that.saveItemBesForm.patchValue({
        itemName: data.sProject,
        itemCode: data.sProjectCode,
        projectType: data.projectType.toString(),
        iStatus: data.iStatus.toString(),
        itemSec: data.projectDes,
      });
    });
  }
  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    if (this.saveItemBesForm.getRawValue().itemCode === "") {
      this.saveItemBesForm.removeControl('itemCode');
    }
    if (this.saveItemBesForm.valid) {
      if (this.modalData !== '') {
        param = {
          sProject: this.saveItemBesForm.getRawValue().itemName,
          iProjectId: this.modalData.iProjectId,
          projectDes: this.saveItemBesForm.getRawValue().itemSec,
          projectType: this.saveItemBesForm.getRawValue().projectType,
          iStatus: this.saveItemBesForm.getRawValue().iStatus,
        };
      } else {
        param = {
          sProject: this.saveItemBesForm.getRawValue().itemName,
          sProjectCode : this.saveItemBesForm.getRawValue().itemCode,
          projectDes: this.saveItemBesForm.getRawValue().itemSec,
          projectType: this.saveItemBesForm.getRawValue().projectType,
          iStatus: this.saveItemBesForm.getRawValue().iStatus,
        };
      }
      if (this.modalData !== '' ) {
        this.orderBusinessService.itemUpdate(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        this.orderBusinessService.itemAdd(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }

    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

}
