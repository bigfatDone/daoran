import {Component, OnDestroy, OnInit} from '@angular/core';
import { AppService } from '../../../app.service';
import { PageBusinessService} from '../../../business-service/page/page-business.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../shared/toast/toast.service';
import {ModalService} from '../../../shared/modal/modal.service';
import {ConfirmConfig} from '../../../shared/modal/modal-model';
import {ToastConfig, ToastType} from '../../../shared/toast/toast-model';
import {MarkSaveComponent} from './mark-save.component';

@Component({
  selector: 'app-mark-manage',
  templateUrl: './mark-manage.component.html',
  styleUrls: ['./mark-manage.component.scss']
})
export class MarkManageComponent implements OnInit, OnDestroy {
  markId = '';
  markName = '';
  markType = '';
  dataList: Array <any>=[];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };
  markTypeData: Array<any> = [{type: 'fix', name: '固定样式'}, {type: 'word', name: '文案类'}];
  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private modalService: ModalService,
    private pageBusinessService: PageBusinessService,
    ) {
    this.appService.titleEventEmitter.emit('角标管理');
  }

  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    if (this.markSaveModal !== null ) {
      this.markSaveModal.close();
    }
  }
  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }
  search() {
    this.options.page = 1;
    this.getList();
  }
  getList() {
    let param: any = {
      markId: this.markId,
      markName: this.markName,
      markType: this.markType,
      page: this.options.page,
      rows: this.options.rows,
    }
    let that = this;
    this.pageBusinessService.getmarkList(param, function(data) {
      console.log(data)
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      }else {
        that.dataList = [];
      }
    });
  }
  clear() {
    this.options.page = 1;
    this.markId = '';
    this.markName = '';
    this.markType = '';
    this.getList();
  }
  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.pageBusinessService.delMark({markId: id}, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }
  markSaveModal: any = null;
  save(data) {
    let that = this;
    console.log(data)
    this.markSaveModal = this.ngbModalService.open(MarkSaveComponent, {size: 'sm'});
    this.markSaveModal.componentInstance.modalData = data;
    this.markSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
}
