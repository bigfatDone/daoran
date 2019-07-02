import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import {Router} from '@angular/router';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import {AddTemplateComponent} from './template-add.component';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit, OnDestroy {

  dataList: Array <any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  stencilName = '';
  pageSaveModal: any;
  imgApi: any;
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.appService.titleEventEmitter.emit('产品页面配置');
  }
  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.getlist();
  }
  getlist() {
    const that = this;
    const param = {
      stencilName: this.stencilName,
      page: this.options.page,
      rows:  this.options.rows,
    };
    this.pageBusinessService.getStencilInfoListByWhere(param, function(data){
      if (data.data.length > 0) {
        that.dataList =  data.data;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }
  save(data) {
    this.pageSaveModal = this.ngbModalService.open(AddTemplateComponent, {size: 'lg'});
    this.pageSaveModal.componentInstance.SaveTempData = data;
    this.pageSaveModal.result.then((result) => {
      this.getlist();
    }, (reason) => {
      this.getlist();
    });
  }
  conf(stencilId) {
    this.router.navigate(['/app/page/configTemplate'], {
      queryParams: {
        type: stencilId,
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
    this.stencilName = '';
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
      const param = {stencilId: data.stencilId};
      this.pageBusinessService.deleteStencilInfo(param, function(res){
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
