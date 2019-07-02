import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import {AddTemplateComponent} from './template-add.component';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import {ActivatedRoute, Router} from '@angular/router';
import {FloorComponent} from './template-district/floor.component';
@Component({
  selector: 'app-template-config',
  templateUrl: './template-config.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateConfigComponent implements OnInit, OnDestroy {

  TemplateList = [{isTrue: false}, {isTrue: false}, {isTrue: false}, {isTrue: false}];
  dataList = [];
  typeMoudel: any;
  layout: any;
  productPageId: any;
  showThisEleModal: any;
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.appService.titleEventEmitter.emit('配置模板页面');
    activatedRoute.queryParams.subscribe(queryParams => {
      this.typeMoudel = queryParams.type;
      this.productPageId = queryParams.productPageId;
    });
  }
  ngOnInit() {
    this.getlist();
  }
  getlist() {
    const that = this;
    const param = {
      stencilName: '',
    };
    this.pageBusinessService.getStencilInfoListByWhere(param, function(data){
      if (data.data.length > 0) {
        that.dataList =  data.data;
        for (let i = 0 ; i < that.dataList.length; i++) {
          if (that.dataList[i].stencilId === that.typeMoudel) {
            that.TemplateList[i].isTrue = true;
          }
        }
      } else {
        that.dataList = [];
      }
    });
  }
  close() {
    history.go(-1);
  }
  ngOnDestroy() {
  }
}
