import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { HistoryBusinessService } from '../../business-service/history/history-business.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';
import { ImgshowComponent } from './imgshow.component';

@Component({
  selector: 'c-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  modalData: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private ngbModalService: NgbModal,
    private historyBusinessService: HistoryBusinessService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    // console.log(this.modalData);
    this.getDetail();
  }

  showThisEleModal: any = null;
  ngOnDestroy() {
    if (this.showThisEleModal !== null) {
      this.showThisEleModal.close();
    }
  }

  detailData: any = {};
  eleTypeStr: String = '';

  imgSrcVaHd: String = '';
  imgSrcVaSd: String = '';

  imgSrcVbHd: String = '';
  imgSrcVbSd: String = '';

  imgSrcVcHd: String = '';
  imgSrcVcSd: String = '';

  getDetail () {
    let that = this;
    let param = {id: this.modalData.id};
    this.historyBusinessService.getElementDetailService(param, function(data){
      that.detailData = data.obj;
      that.eleTypeStr = data.obj.eleType;
      that.getEleValData(data.obj);

      that.imgSrcVaHd = data.obj.imageVaHdSrc;
      that.imgSrcVaSd = data.obj.imageVaSdSrc;
      that.imgSrcVbHd = data.obj.imageVbHdSrc;
      that.imgSrcVbSd = data.obj.imageVbSdSrc;
      that.imgSrcVcHd = data.obj.imageVcHdSrc;
      that.imgSrcVcSd = data.obj.imageVcSdSrc;
      // callback();
    });
  }
  eleValData: Array<any> = [0];

  getEleValData(data) {
    let that = this;
    let param;
    let eleType = data.eleType;
    // console.log(eleType);
    if (eleType === "vlist" || eleType === "plist") {
      param = {eleValue: data.eleValue};
      this.historyBusinessService.getElelistService(param, function(data){
        if(data.data.length > 0){
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    } else if (eleType === "res") {
      param = {eleValue: data.eleValue, resType: data.resType};
      this.historyBusinessService.getEleresService(param, function(data){
        if(data.data.length > 0){
          that.eleValData = data.data;
        } else {
          that.eleValData = [];
        }
      });
    }
  }

  showImg (src) {
    let that = this;
    // console.log(src);
    if (src === '' || src === null) {
      const toastCfg = new ToastConfig(ToastType.INFO, '', '暂无图片哦!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.showThisEleModal = this.ngbModalService.open(ImgshowComponent);
    if (src) {
      this.showThisEleModal.componentInstance.oData = {template: src};
      this.showThisEleModal.componentInstance.isAddHttp = false;
    }
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
    });
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
