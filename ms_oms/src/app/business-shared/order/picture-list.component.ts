import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { PictureSaveComponent } from './picture-save.component';
import { PictureShowComponent } from './picture-show.component';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';


@Component({
    selector: 'c-picture-list',
    templateUrl: './picture-list.component.html',
})

export class PictureListComponent implements OnInit, OnDestroy {

    dataList:Array<any>= [];
    options: any = {
      rows: 20,
      page: 1,     // 当前页
      pageCount: 0, // 页码数量
    };
    productCode: any = "";
    productCodes: Array<any>= [];

    styleName: any = '';
    styleDes: any = '';
    template: any = '';
    onPageChanged ($event) {
      this.options.page = $event;
      this.defaultList();
    }

    constructor(
      private appService: AppService,
      private ngbModalService: NgbModal,
      private toastService: ToastService,
      private router: Router,
      private orderBusinessService: OrderBusinessService,
      private modalService: ModalService) {
      this.appService.titleEventEmitter.emit("订购模板风格图片管理");
    }

    ngOnInit() {
      this.defaultList();
      this.getTemplate();
    }


    ngOnDestroy() {
        // if (this.productSaveModal !== null) {
        //     this.productSaveModal.close();
        // }
    }

  sTemplate: any= [];
  getTemplate() {
    let that = this;
    this.orderBusinessService.getDiyOrderTemplateList(function(data){
      if (data.length > 0) {
        that.sTemplate = data;
      } else {
        that.sTemplate = [];
      }
    });
  }

  //修改的弹窗和新增的弹窗一样 只不过要多传递一个 styleCode字段
    pictureSaveModal: any = null;
    // 新增页面弹窗
    save(data) {
        let that = this;
        this.pictureSaveModal = this.ngbModalService.open(PictureSaveComponent, {size: 'lg'});
        this.pictureSaveModal.componentInstance.modalData = data;
        this.pictureSaveModal.result.then((result) => {
        }, (reason) => {
          that.defaultList();
        });
    }

  upload(data) {
    let that = this;
    this.pictureSaveModal = this.ngbModalService.open(PictureShowComponent, {size: 'lg'});
    this.pictureSaveModal.componentInstance.modalData = data;
    this.pictureSaveModal.result.then((result) => {
    }, (reason) => {
        that.defaultList();
    });
  }

  getCheckedIds() {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.styleCode);
      }
    });
    return ids.toString();
  }
    //删除
  del(id) {
    let that = this;
    let param = {styleCode : ''};
    if (id !== '') {
      param.styleCode = id.styleCode;
    }else {
      param.styleCode = this.getCheckedIds();
    }
    if (param.styleCode === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.orderBusinessService.delTemplateImg(param, function(data){
        that.defaultList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }

    //重置
    clear () {
      let t = this;
      t.options.page = 1;
      t.styleName = '';
      t.styleDes = '';
      t.template = '';
      this.getEleList({
        page: this.options.page,
        rows: this.options.rows,
        styleName: this.styleName,
        styleDes: this.styleDes,
        template: this.template,
      });
    }

    search() {
      this.options.page = 1;
      this.defaultList();
    }

    defaultList () {
      this.getEleList({
        page: this.options.page,
        rows: this.options.rows,
        styleName: this.styleName,
        styleDesc: this.styleDes,
        template: this.template,
      });
    }

    getEleList(param) {
      let that = this;
      this.orderBusinessService.pictureList(param, function(data) {
        if (data.data.length > 0) {
          that.dataList = data.data;
          // that.options.page = param.page;
          that.options.total = data.total;
          that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
          // that.dataList.forEach( i => {
          //   console.log(i.preCount)
          //   if ( parseInt(i.preCount) > 0 ) {
          //     that.preFlag = false;
          //   }
          // });
        } else {
          that.dataList = [];
        }
      });
    }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

  checkTr(index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].checkState) {
          this.dataList[index].checkState = false;
        } else {
          this.dataList[index].checkState = true;
        }
      }
      // else {
      //   this.dataList[ind].checkState = false;
      // }
    });
  }

  }
