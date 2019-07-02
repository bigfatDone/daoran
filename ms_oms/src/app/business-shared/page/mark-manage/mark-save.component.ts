import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import { HttpService } from '../../../shared/http/http.service';
import { PageBusinessService} from '../../../business-service/page/page-business.service';
import {ToastConfig, ToastType} from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import {ConfirmConfig} from '../../../shared/modal/modal-model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'c-mark-save',
  templateUrl: './mark-save.component.html',
  styleUrls: ['./mark-save.component.scss']
})
export class MarkSaveComponent implements OnInit {
  saveMarkForm: FormGroup;
  modalData: any = '';
  markTypeData: Array<any> = [{type: 'fix', name: '固定样式'}, {type: 'word', name: '文案类'}];
  constructor(
    public activeModal: NgbActiveModal,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private modalService: ModalService,
    private appService: AppService,
    private httpService: HttpService,
    private pageBusinessService: PageBusinessService,
    private formBuilder: FormBuilder
  ) {
    const codeNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const aliasNameFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveMarkForm = this.formBuilder.group({
      markName: codeNameFc,
      markType: aliasNameFc,
    });
  }

  imgApi: any = '';
  imgApiSD: any = '';
  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    if (this.modalData !== '') {
      this.getDetail();
    }
  }
  detailData: any = null;
  getDetail () {
    let that = this;
    let param = {markId: this.modalData.markId};
    this.pageBusinessService.getMarkInfo(param, function(data){
      that.detailData = data;
      if (data.imgHD === null || data.imgHD === 'null') {
        that.imgSrcA = '';
      } else {
        that.imgSrcA = that.imgApi + data.imgHD;
      };
      if (data.imgSD === null || data.imgSD === 'null') {
        that.imgSrcB = '';
      } else {
        that.imgSrcB = that.imgApiSD + data.imgSD;
      };
      that.saveMarkForm.patchValue({
        markName: data.markName,
        markType: data.markType,
      });
    });
  }
  newFile: any = new FormData();
  imgSrcA: any = '';
  imgSrcB: any = '';
  upload(ev, index) {
    let evAnd = ev.target ? ev.target : ev.srcElement;
    let file = evAnd.files[0];
    this.newFile.set("file" + index, file);
    let that = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
        case 'B':
          that.imgSrcB = this.result;
          break;
        // case 'C':
        //   that.imgSrcC = this.result;
        //   break;
      }
    };
  }
  ok () {
    let that = this;
    if (this.saveMarkForm.valid) {
      this.newFile.set("markName", this.saveMarkForm.getRawValue().markName);
      this.newFile.set("markType", this.saveMarkForm.getRawValue().markType);
      if (this.modalData !== '') {
        this.newFile.set("markId", this.modalData.markId);
      }
      this.pageBusinessService.saveMark(this.newFile, function (data) {
        const toastCfg = new ToastConfig( data.success ? ToastType.SUCCESS : ToastType.WARNING, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        if (data.success) {
          that.close();
        }
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
