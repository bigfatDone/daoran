import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../../shared/modal/modal.service';
import { AppService } from '../../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../../shared/toast/toast-model';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-video',
  templateUrl: './announcement.component.html',
  styleUrls: ['./district.scss']
})
export class AnnouncementComponent implements OnInit, OnDestroy {
  saveVideo = {
    pagePartName: '公告'
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
  ok() {
    if (this.eleValue === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请输入公告内容', 2000);
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
