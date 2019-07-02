import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {articleType, startFlag, terminalType} from '../../global-constant';
import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-nodeBes-save',
  templateUrl: './nodeBes-save.component.html'
})
export class NodeBesSaveComponent implements OnInit {

  saveNodeBesForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private orderBusinessService: OrderBusinessService,
  ) {
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const snodeNameFc = new FormControl('', Validators.compose([Validators.required]));
    const internetTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeDesFc = new FormControl('', Validators.compose([Validators.maxLength(255)]));
    this.saveNodeBesForm = this.formBuilder.group({
      nodeCode: nodeCodeFc,
      nodeName: snodeNameFc,
      internetType: internetTypeFc,
      nodeDes: nodeDesFc,
    });
  }
  opFlag: any;
  modalData: any= '';
  enterTypeData: any = [{type: 1, value: '公网'}, {type: 2, value: 'VPN'}, {type: 3, value: '跳板机'}];
  ngOnInit() {
    if ( this.modalData !== '') {
      this.getDetail();
      this.saveNodeBesForm.controls['nodeCode'].disable();
      // this.saveNodeBesForm.controls['nodeName'].disable();
      this.saveNodeBesForm.controls['internetType'].disable();
    }else {
      this.saveNodeBesForm.patchValue({
        internetType: this.enterTypeData[0].type,
        // stateName: this.start[0].type,
      });
    }
  }

  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {nodeCode: this.modalData.nodeCode};
    this.orderBusinessService.nodeDetial(param, function(data){
      that.detailData = data;
      that.saveNodeBesForm.patchValue({
        nodeCode: data.nodeCode,
        nodeName: data.alias,
        internetType: data.internetType,
        nodeDes: data.nodeDes
      });
    });
  }

  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    if (this.saveNodeBesForm.valid) {
      if (that.modalData !== "" ) {
        param = {
          nodeCode: this.saveNodeBesForm.getRawValue().nodeCode,
          alias: this.saveNodeBesForm.getRawValue().nodeName,
          nodeDes: this.saveNodeBesForm.getRawValue().nodeDes,
          internetType: this.saveNodeBesForm.getRawValue().internetType,
        };
        this.orderBusinessService.nodeUpdate(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        param = {
          nodeCode: this.saveNodeBesForm.getRawValue().nodeCode,
          alias: this.saveNodeBesForm.getRawValue().nodeName,
          internetType: this.saveNodeBesForm.getRawValue().internetType,
          nodeDes: this.saveNodeBesForm.getRawValue().nodeDes,
        };
        this.orderBusinessService.nodeAdd(param, function(data){
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
