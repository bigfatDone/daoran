import {Component, OnDestroy, OnInit, ElementRef} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import {CustomValidators} from '../../../shared/custom-validator/custom-validator';
import {PageBusinessService} from '../../../business-service/page/page-business.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'c-training-list-save',
  templateUrl: './training-list-save.component.html',
  styleUrls: ['./training-list-save.component.scss']
})
export class TrainingListSaveComponent implements OnInit, OnDestroy {

  saveTraningForm: FormGroup;
  TraningTempData: any;
  jsonAttribute = {
    day : ''
  };
  imgSrcA = '';
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private toastService: ToastService,
              private el: ElementRef,
              private formBuilder: FormBuilder) {
    const planNameFC = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const desFc = new FormControl('', Validators.compose([Validators.required]));
    const jsonAttributeday = new FormControl('', Validators.compose([Validators.required]));
    const iStatusFC = new FormControl(0, Validators.compose([Validators.required]));
    const answerFC = new FormControl('');

    this.saveTraningForm = this.formBuilder.group({
      planName: planNameFC,
      des : desFc,
      jsonAttributeday : jsonAttributeday,
      iStatus : iStatusFC,
      answer: answerFC
    });
  }

  newFile: any = new FormData();

  ngOnInit() {
    const that = this;
    if (this.TraningTempData !== '') {
      this.saveTraningForm.patchValue({
        planName: this.TraningTempData.planName,
        des: this.TraningTempData.des,
        iStatus: this.TraningTempData.iStatus,
        answer: this.TraningTempData.answer,
        jsonAttributeday: this.TraningTempData.jsonAttribute.day,
      });
      this.imgSrcA = environment.imgApi + this.TraningTempData.image;
    }
  }

  ngOnDestroy() {

  }
  add0(m) {return m < 10 ? '0' + m : m; }
  format(shijianchuo) {
  const time = new Date(shijianchuo);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const h = time.getHours();
  const mm = time.getMinutes();
  const s = time.getSeconds();
  return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':'+ this.add0(s);
}
  ok() {
    const that = this;
    if (this.saveTraningForm.valid) {
      if (this.imgSrcA === '') {
        const toastCfg = new ToastConfig(ToastType.WARNING, '', '请上传图片!', 2000);
        that.toastService.toast(toastCfg);
        return;
      }
      const reg = /^([1-9][0-9]*)$/;
      if (!reg.test(this.saveTraningForm.getRawValue().jsonAttributeday)) {
        const toastCfg = new ToastConfig(ToastType.WARNING, '', '训练天数输入有误，请输入大于0的正整数!', 2000);
        that.toastService.toast(toastCfg);
        return;
      }
      if (that.TraningTempData !== '') {
        const jsonAttribute = {
          day : this.saveTraningForm.getRawValue().jsonAttributeday,
          courseNum : that.TraningTempData.jsonAttribute.courseNum
        };
        this.newFile.set('planCode', this.TraningTempData.planCode);
        this.newFile.set('create',   this.TraningTempData.create);
        this.newFile.set('createTime', this.format(this.TraningTempData.createTime));
        this.newFile.set('authCompany', this.TraningTempData.authCompany);
        this.newFile.set('image', this.TraningTempData.image);
        this.newFile.set('planName', this.saveTraningForm.getRawValue().planName);
        this.newFile.set('jsonAttribute', JSON.stringify(jsonAttribute));
        this.newFile.set('des', this.saveTraningForm.getRawValue().des);
        this.newFile.set('iStatus', this.saveTraningForm.getRawValue().iStatus);
        this.newFile.set('answer', this.saveTraningForm.getRawValue().answer);
        this.pageBusinessService.editPlan(this.newFile, function (data) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '修改成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        const jsonAttribute = {
          day : this.saveTraningForm.getRawValue().jsonAttributeday,
          courseNum : 0
        };
        this.newFile.set('planName', this.saveTraningForm.getRawValue().planName);
        this.newFile.set('jsonAttribute', JSON.stringify(jsonAttribute));
        this.newFile.set('des', this.saveTraningForm.getRawValue().des);
        this.newFile.set('iStatus', this.saveTraningForm.getRawValue().iStatus);
        this.newFile.set('answer', this.saveTraningForm.getRawValue().answer);
        this.newFile.set('image', '');
        this.pageBusinessService.editPlan(this.newFile, function (data) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '新增成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }

    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }


  upload(ev, index) {
    const evAnd = ev.target ? ev.target : ev.srcElement;
    const file = evAnd.files[0];
    this.newFile.set('file' + index, file);
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
      }
    };
  }


  close(): void {
    this.activeModal.dismiss({status: 'closed'});
  }
}
