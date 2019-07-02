import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import { SafetyBusinessService} from '../../business-service/safety/safety-business.service';
// import {ElementPageCheckComponent} from './element-page-check.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';

@Component({
  selector: 'c-dealer-ip',
  templateUrl: './dealer-ip.component.html',
})
export class DealerIpComponent implements OnInit, OnDestroy {
  ipDealerForm: FormGroup;
  modalData: any = '';
  paramModal: any = '';
  oneProductData: Array <any> = [0];
  pageIdStr: String = '';

  constructor(
    public activeModal: NgbActiveModal,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private modalService: ModalService,
    private appService: AppService,
    private httpService: HttpService,
    private safetyBusinessService: SafetyBusinessService,
  ) {
  }

  ngOnInit() {
    this.getDealerDetail();
    this.getAllotIps();
  }

  ngOnDestroy() {
    // if (this.showThisEleModal !== null) {
    //   this.showThisEleModal.close();
    // }
  }

  spId: any = '';
  spName: any = '';
  key: any = '';
  contacts: any = '';
  tel: any = '';
  powerId: any = '';
  getDealerDetail() {
    let that = this;
    this.safetyBusinessService.getDealerDetail({spId: this.paramModal}, function(data){
      // that.ipDealerForm.patchValue({
      that.spId = data.spId,
      that.spName = data.spName,
      that.key = data.key,
      that.contacts = data.contacts,
      that.tel = data.tel
      // });
      // that.projectName = data.projectName;
    });
  }

  dataList: Array<any>= [];
  getAllotIps() {
    let that = this;
    this.safetyBusinessService.getAllotIps({spId: this.paramModal}, function(data){
      if (data.length > 0) {
        that.dataList = data;
        // that.options.page = param.page;
        // that.options.total = data.total;
        // that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  okP () {
    let that = this;
    let param = {
      spId: this.paramModal,
      ip: this.powerId,
    };
    if (param.ip === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '授权IP不能为空！', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.safetyBusinessService.addAllotIP(param, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      that.toastService.toast(toastCfg);
      if (data.success) {
        // that.pageIdStr = '';
        that.getAllotIps();
      }
    });
  }

  delRelation (oData) {
    let that = this;
    let param = {
      id: oData
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.safetyBusinessService.delAllotIPs(param, function(data){
        // that.getPageProductRelation();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
        that.getAllotIps();
      });
    }, (reason) => {
    });
  }

  // getPageProductRelation () { // 获取产品关联页面
  //   let that = this;
  //   let param = {
  //     nodeCode: this.modalData.nodeCode,
  //     productCode: this.modalData.productCode,
  //   };
  //   // this.safetyBusinessService.getPageProductRelationService(param, function(data){
  //   //   if (data.obj.data.length > 0) {
  //   //     that.oneProductData = data.obj.data;
  //   //   } else {
  //   //     that.oneProductData = [];
  //   //   }
  //   // });
  // }



  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
