import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'c-template-add',
  templateUrl: './template-add.component.html',
  styleUrls: ['./template-list.component.scss']

})
export class AddTemplateComponent implements OnInit, OnDestroy {
  saveTemplateForm: FormGroup;
  imgSrcA: any;
  newFile: any = new FormData();
  templateData: any;
  SaveTempData: any;
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
    const stencilNameFC = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    const stencilStyleFC = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    this.saveTemplateForm = this.formBuilder.group({
      stencilName: stencilNameFC,
      stencilStyle: stencilStyleFC
    });
  }
  ngOnInit() {
    if (this.SaveTempData !== '') {
      this.saveTemplateForm.patchValue({
        stencilName: this.SaveTempData.stencilName,
        stencilStyle: this.SaveTempData.stencilStyle,
      });
      this.imgSrcA = environment.imgApi + this.SaveTempData.stencilImg;

    }

  }
  ok() {
    const that = this;
    if (this.saveTemplateForm.valid) {
      this.newFile.set('stencilName', this.saveTemplateForm.getRawValue().stencilName);
      this.newFile.set('stencilStyle', this.saveTemplateForm.getRawValue().stencilStyle);
      if (this.imgSrcA === undefined) {
        const toastCfg = new ToastConfig(ToastType.ERROR, '', '请上传模板图!', 2000);
        that.toastService.toast(toastCfg);
        return;
      }
      if (this.SaveTempData !== '') {
        this.newFile.set('stencilId', this.SaveTempData.stencilId);
        this.newFile.set('stencilImg', this.SaveTempData.stencilImg);
      }
        this.pageBusinessService.stencilInfo(this.newFile, function(data){
        if (data.success) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存模板成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        }
      });
    }else {
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
    this.activeModal.dismiss({ status: 'closed' });
  }


  ngOnDestroy() {
  }
}
