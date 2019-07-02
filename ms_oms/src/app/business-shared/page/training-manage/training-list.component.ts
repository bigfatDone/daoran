import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import { PageImgshowComponent } from './../page-imgshow.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { pageGenre } from '../../../global-constant';
import {PageCopyComponent} from './../page-copy.component';
import {Router} from '@angular/router';
import {PageUniteComponent} from './../page-unite.component';
import {AlbumTempSaveComponent} from './../albumTemp-save.component';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import {TrainingListSaveComponent} from './training-list-save.component';
import {TrainingDetailSaveComponent} from './training-detail.component';
import { ConfirmConfig } from '../../../shared/modal/modal-model';

@Component({
  selector: 'c-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit, OnDestroy {

  dataList: Array <any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  planName = '';
  pageSaveModal: any;
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.appService.titleEventEmitter.emit('训练管理');
  }
  ngOnInit() {
    this.getlist();
  }
  getlist() {
    const that = this;
    const param = {
      planName: this.planName,
      page: this.options.page,
      rows:  this.options.rows,
    };
    this.pageBusinessService.listPlan(param, function(data){
      if (data.data.length > 0) {
        for (let i = 0; i < data.data.length; i++) {
          data.data[i].jsonAttribute = JSON.parse(data.data[i].jsonAttribute);
        }
        that.dataList =  data.data;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }
  save(data) {
    this.pageSaveModal = this.ngbModalService.open(TrainingListSaveComponent, {size: 'lg'});
    this.pageSaveModal.componentInstance.TraningTempData = data;
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      this.getlist();
    });
  }
  detail(data) {
    this.router.navigate(['/app/page/trainingdetail'], {
      queryParams: {
        planName: data.planName,
        day : data.jsonAttribute.day,
        planCode : data.planCode,
        create : data.create,
      }
    });
  }
  search() {
    this.getlist();
  }
  onPageChanged($event) {
    this.options.page = $event;
    this.getlist();
  }
  clear() {
    this.planName = '';
    this.options.page = 1;
    this.search();
  }
  checkTr(index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].checkState) {
          this.dataList[index].checkState = false;
        } else {
          this.dataList[index].checkState = true;
        }
      } else {
        this.dataList[ind].checkState = false;
      }
    });
  }
  del(data) {
    const that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      const param = {planCode: data.planCode};
      this.pageBusinessService.deletePlan(param, function(res){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
        that.getlist();
      });
    }, (reason) => {
    });
  }
  ngOnDestroy() {
  }
}
