import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { environment } from '../../../environments/environment';
import {ElementSaveComponent} from './element-save.component';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import {ModalService} from '../../shared/modal/modal.service';
import {ElementUploadImgComponent} from './element-uploadImg.component';

@Component({
  selector: 'c-element-editPreinstall',
  templateUrl: './element-editPreinstall.component.html',
})
export class ElementEditPreinstall implements OnInit, OnDestroy {

  dataList: Array<any>= [];

  modalData: any;
  limitLength: any = "";

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private pageBusinessService: PageBusinessService,
              private ngbModalService: NgbModal,
              private modalService: ModalService
              ) {
  }

  ngOnInit() {
    this.getList();
  }


  ngOnDestroy() {
    if (this.preSaveModal !== null) {
      this.preSaveModal.close();
    }
  }
  getList() {
    let that = this;
    let param = {elementId: this.modalData.elementId};
    this.pageBusinessService.getPreList(param, function(data) {
      if (data.length > 0) {
        that.dataList = data;
        that.limitLength = that.dataList.length;
      } else {
        that.dataList = [];
      }
    });
  }

  preSaveModal: any = null;
  preSave(id) {
    let that = this;
    this.preSaveModal = this.ngbModalService.open(ElementSaveComponent, {size: 'lg'});
    this.preSaveModal.componentInstance.modalData = {
      id: id,
      preFlag: true,
      type: "2",
      eleType: this.modalData.eleType
    }
    this.preSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  addInfo() {
    let that = this;
    if (this.limitLength >= 7){
      that.toastService.toast(new ToastConfig(ToastType.WARNING, '', '最多只能预设7条', 2000));
    }else {
      this.preSaveModal = this.ngbModalService.open(ElementSaveComponent, {size: 'lg'});
      this.preSaveModal.componentInstance.modalData = {
        // id: this.modalData.elementId,
        id: this.modalData,
        preAddFlag: true,
        type: "1",
        eleType: this.modalData.eleType
      },
        this.preSaveModal.result.then((result) => {
        }, (reason) => {
          that.getList();
        });
    }
  }

  upload(data) {
    let that = this;
    this.preSaveModal = this.ngbModalService.open(ElementUploadImgComponent, {size: 'lg'});
    this.preSaveModal.componentInstance.modalData = {
      data: data,
      preFlag: true,
      eleType: this.modalData.eleType
    } ;
    this.preSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  ok(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }

  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.pageBusinessService.elePrePost({id: id.id, preState: "2"}, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
