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
  selector: 'c-verapk-save',
  templateUrl: './verapk-save.component.html',
  styleUrls: ['./verapk-save.component.scss']
})
export class VerapkSaveComponent implements OnInit {

  saveVerapkForm: FormGroup;
  modalData: any = '';
  start: Array<any>= [startFlag[0]];
  newFile: any = new FormData();
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private ottoperateBusinessService: OttoperateBusinessService,
              ) {
    const intVersionCodeFc = new FormControl('', Validators.compose([Validators.required,CustomValidators.num, Validators.minLength(4), Validators.maxLength(4)]));
    const strApkFileNameFc = new FormControl('', Validators.compose([]));
    this.saveVerapkForm = this.formBuilder.group({
      intVersionCode  : intVersionCodeFc,
      strApkFileName  : strApkFileNameFc,
    });
    // this.saveVerapkForm.controls['bgUrl'].disable();
  }

  ngOnInit() {
    if (this.modalData !== '') {
      this.saveVerapkForm.patchValue({
        intVersionCode: this.modalData.intVersionCode,
        strApkFileName: this.modalData.strApkFileName
      })
    }
  }
  upload(ev) {
    let evAnd = ev.target ? ev.target : ev.srcElement;
    let file = evAnd.files[0];
    this.newFile.set( "oFile", file);
/*    let reader = new FileReader();
    reader.readAsDataURL(file);*/
  }

  /**
   * 上传
   */
  ok(): void {
    let that = this;
   // let param: any;
    if (this.saveVerapkForm.valid) {
      this.newFile.set( "sid" , this.modalData.strId);
      this.newFile.set( "intVersionCode" , this.saveVerapkForm.getRawValue().intVersionCode);
/*      param = {
        strId  : this.modalData.strId,
        intVersionCode  : this.saveVerapkForm.getRawValue().intVersionCode,
        strApkFileName  : this.saveVerapkForm.getRawValue().strApkFileName,
      };*/
/*      if (this.modalData !== "") {
        param.strId = this.modalData.strId;
      }*/
// console.log(this.newFile.get('intVersionCode'));
      this.ottoperateBusinessService.uploadAPK(this.newFile, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
/*      this.ottoperateBusinessService.uploadAPK(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });*/
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请按正确格式填写完整!', 2000));
    }
  }

  checkNode($event, index) {
    // this.eleAttrs[index].checkState = $event.target.checked;
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
    let param = {id: this.modalData.id};
    this.ottoperateBusinessService.apkDetail(param, function(data){
      that.detailData = data;
      that.saveVerapkForm.patchValue({
        name: data.name,
        typeName: data.type,
        sortName: data.sort,
        bgUrl: data.path,
      });
      // that.getEleList(data.eleValue);
    });
  }

}
