import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { OttoperateBusinessService } from '../../business-service/ottoperate/ottoperate-business.service';
import {terminalType, startFlag} from '../../global-constant';
import { VipSaveComponent } from './vip-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
// import {BannerImgshowComponent} from './banner-imgshow.component';

@Component({
  selector: 'c-vip-list',
  templateUrl: './vip-list.component.html',
  styleUrls: ['./vip-list.component.scss']
})
export class VipListComponent implements OnInit, OnDestroy {

  dataList: Array<any> = [];

  constructor( // 注入依赖项
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private ottoperateBusinessService: OttoperateBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("VIP文案设置");
  }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    if (this.bannerSaveModal !== null) {
      this.bannerSaveModal.close();
    }
  }

  getList() {
    let that = this;
    let param = {}
    this.ottoperateBusinessService.vipList(param, function (data) {
      if (data.data.length > 0) {
        that.dataList = data.data;
      } else {
        that.dataList = [];
      }
    });
  }

  bannerSaveModal: any = null;

  save(data) {
    let that = this;
    this.bannerSaveModal = this.ngbModalService.open(VipSaveComponent, {size: 'sm'});
    this.bannerSaveModal.componentInstance.modalData = data;
    this.bannerSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  del(id) {
    let that = this;
    console.log(id)
    let param = {
      id: id
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.ottoperateBusinessService.vipDel(param, function (data) {
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }
}
