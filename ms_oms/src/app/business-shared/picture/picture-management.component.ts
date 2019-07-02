import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PictureBusinessService } from '../../business-service/picture/picture-business.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';

import { PctureFuncComponent } from './picture-func.component';
import { PctureUploadingComponent } from './picture-uploading.component';

@Component({
  selector: 'c-picture-management',
  templateUrl: './picture-management.component.html',
  styleUrls: ['./picture-management.component.scss']
})
export class PictureManagementComponent implements OnInit, OnDestroy {

  constructor(
    // public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private ngbModalService: NgbModal,
    private pictureBusinessService: PictureBusinessService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
  }

  showModal: any = null;
  ngOnDestroy() {
    if (this.showModal !== null) {
      this.showModal.close();
    }
  }

  options: any = {
    rows: 15,
    pageCount: 0, // 页码数量
    page: 1,      // 当前页
    total: 15
  };

  imgList: Array<any> = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  imgName: String = '';

  search () {}

  uploading () {
    this.showModal = this.ngbModalService.open(PctureUploadingComponent, {size: 'lg'});
    this.showModal.componentInstance.modalData = {
    };
    this.showModal.result.then((result) => {
    }, (reason) => {
      // this.options.page = 1;
      // this.getList();
    });
  }

  checkAll () {}

  cancelCheck () {}

  moveGroup () {
    this.showModal = this.ngbModalService.open(PctureFuncComponent, {size: 'lg'});
    this.showModal.componentInstance.modalType = 'moveGroup';
    this.showModal.componentInstance.modalTypeName = '移动';
    this.showModal.componentInstance.modalData = {
    };
    this.showModal.result.then((result) => {
    }, (reason) => {
      // this.options.page = 1;
      // this.getList();
    });
  }

  delete () {}

  addGroup () {
    this.showModal = this.ngbModalService.open(PctureFuncComponent, {size: 'lg'});
    this.showModal.componentInstance.modalType = 'addGroup';
    this.showModal.componentInstance.modalTypeName = '添加';
    this.showModal.componentInstance.modalData = {
    };
    this.showModal.result.then((result) => {
    }, (reason) => {
      // this.options.page = 1;
      // this.getList();
    });
  }

  editGroup () {
    this.showModal = this.ngbModalService.open(PctureFuncComponent, {size: 'lg'});
    this.showModal.componentInstance.modalType = 'editGroup';
    this.showModal.componentInstance.modalTypeName = '修改';
    this.showModal.componentInstance.modalData = {
    };
    this.showModal.result.then((result) => {
    }, (reason) => {
      // this.options.page = 1;
      // this.getList();
    });
  }
}
