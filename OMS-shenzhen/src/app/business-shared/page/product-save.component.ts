import {Component, OnDestroy, OnInit} from '@angular/core';
// import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import { PageBusinessService} from '../../business-service/page/page-business.service';
import {ElementPageCheckComponent} from './element-page-check.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';

@Component({
  selector: 'c-product-save',
  templateUrl: './product-save.component.html',
})
export class ProductSaveComponent implements OnInit, OnDestroy {
  //saveUserForm: FormGroup;
  modalData:any;
  oneProductData:Array <any>=[0];
  pageIdStr: String = '';

  constructor(
    public activeModal: NgbActiveModal,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private modalService: ModalService,
    private appService: AppService,
    private httpService: HttpService,
    private PageBusinessService: PageBusinessService,
  ) {
  }

  showThisEleModal: any = null;
  showThisEle() {
    this.showThisEleModal = this.ngbModalService.open(ElementPageCheckComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.fromProcuctList = true;
    this.showThisEleModal.result.then((result) => {
      this.pageIdStr = result; // 页面编码
      /*if (this.pageIdStr !== '') {
        this.okP();
      }*/
    }, (reason) => {
    });
  }

  okP () {
    let that = this;
    let param = {
      itemCode: this.modalData.itemCode,
      productCode: this.modalData.productCode,
      pageIdStr: this.pageIdStr,
    };
    if (param.pageIdStr === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要关联的页面!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.PageBusinessService.saveProductPage(param, function(data){
      if (data.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.pageIdStr = '';
        that.getPageProductRelation();
      }
    });
  }

  delRelation (oData) {
    let that = this;
    let param = {
      itemCode: this.modalData.itemCode,
      productCode: this.modalData.productCode,
      pageIdStr: oData.pageId
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.PageBusinessService.delPageProductRelationService(param, function(data){
        that.getPageProductRelation();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }

  getPageProductRelation () { // 获取产品关联页面
    let that = this;
    let param = {
      itemCode: this.modalData.itemCode,
      productCode: this.modalData.productCode,
    };
    this.PageBusinessService.getPageProductRelationService(param, function(data){
      if (data.obj.data.length > 0) {
        that.oneProductData = data.obj.data;
      } else {
        that.oneProductData = [];
      }
    });
  }

  ngOnInit() {
    this.getPageProductRelation();
  }

  ngOnDestroy() {
    if (this.showThisEleModal !== null) {
      this.showThisEleModal.close();
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
