import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ElementSaveComponent } from './element-save.component';
import { ElementUploadImgComponent } from './element-uploadImg.component';
import { ElementEditPreinstall } from './element-editPreinstall.component';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageEleType, pageResType, pageEleAttr, pageEleTypeModal} from '../../global-constant';

@Component({
  selector: 'c-element-list',
  templateUrl: './element-list.component.html',
})
export class ElementListComponent implements OnInit, OnDestroy {

  dataList: Array <any>=[];
  drawFlag = true;
  windowUrl:any;
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  eleTypes: Array<any>= pageEleType;
  eleType: string = "";

  resTypes: Array<any>= pageResType;
  resType:  string = "";

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private router: Router,
    private toastService: ToastService,
    private pageBusinessService: PageBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("运营元素管理");
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/elementList") >= 0 ) {
      this.appService.titleEventEmitter.emit("手绘本-运营元素管理");
      this.drawFlag = false;
      this.eleTypes = pageEleTypeModal;
    }
  }

  ngOnInit() {
    this.defaultList();
  }

  ngOnDestroy() {
    if (this.eleSaveModal !== null) {
      this.eleSaveModal.close();
    } else if (this.eleUploadImgModal !== null) {
      this.eleUploadImgModal.close();
    }
  }

  onPageChanged ($event) {
    this.options.page = $event;
    this.defaultList();
  }

  sCode: any;
  sAlias: any;
  search() {
    this.options.page = 1;
    this.defaultList();
  }

  defaultList () {
    this.getEleList({
      page: this.options.page,
      rows: this.options.rows,
      elementId: this.sCode,
      alias: this.sAlias,
      eleType: this.eleType,
      resType: this.resType
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.sCode = '';
    t.sAlias = '';
    t.eleType = '';
    t.resType = '';
    this.getEleList({
      page: this.options.page,
      rows: this.options.rows,
      elementId: this.sCode,
      alias: this.sAlias,
      eleType: this.eleType,
      resType: this.resType
    });
  }

  // preFlag = true;
  getEleList(param) {
    let that = this;
    this.pageBusinessService.eleListPost(param, function(data) {
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
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

  eleSaveModal: any = null;
  save(id) {
    let that = this;
    this.eleSaveModal = this.ngbModalService.open(ElementSaveComponent, {size: 'lg'});
    this.eleSaveModal.componentInstance.modalData = id;
    this.eleSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.pageBusinessService.eleDelPost({elementId: id}, function(data){
        that.defaultList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }

  preinstall (data) {
    let that = this;
    this.eleSaveModal = this.ngbModalService.open(ElementEditPreinstall, {size: 'lg'});
    this.eleSaveModal.componentInstance.modalData = data;
    this.eleSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  eleUploadImgModal: any = null;
  upload(data) {
    let that = this;
    this.eleUploadImgModal = this.ngbModalService.open(ElementUploadImgComponent, {size: 'lg'});
    this.eleUploadImgModal.componentInstance.modalData = data;
    this.eleUploadImgModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
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
}
