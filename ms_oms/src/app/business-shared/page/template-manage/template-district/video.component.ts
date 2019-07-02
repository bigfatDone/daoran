import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../../shared/modal/modal.service';
import { AppService } from '../../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../../shared/toast/toast-model';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {ElementVlistCheckComponent} from './../../element-vlist-check.component';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./district.scss']
})
export class VideoComponent implements OnInit, OnDestroy {
  saveVideo = {
    pagePartName: '小视频'
  };
  showThisEleModal: any;
  eleValue = '';
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
  ) {
  }
  ngOnInit() {
  }
  showThisEle() {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(ElementVlistCheckComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.modalType = {
      eleType: '',
      eleAttr: '',
      resType: 1,
    };
    this.showThisEleModal.result.then((result) => {
      that.eleValue = result;
    }, (reason) => {
    });
  }
  ok() {
    if (this.eleValue === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择小视频', 2000);
      this.toastService.toast(toastCfg);
      return;
    }
    this.activeModal.dismiss({ eleValue: this.eleValue });
  }
  close() {
    this.activeModal.dismiss({ eleValue: this.eleValue });
  }
  ngOnDestroy() {
  }
}
