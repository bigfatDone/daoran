import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { PageSaveComponent } from './page-save.component';
import { PageEditComponent } from './page-edit.component';
import { PageImgshowComponent } from './page-imgshow.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageGenre } from '../../global-constant';
// import { environment } from '../../../environments/environment';
import {PageCopyComponent} from './page-copy.component';
// import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {Router} from '@angular/router';
import {PageUniteComponent} from './page-unite.component';
@Component({
  selector: 'c-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit, OnDestroy {

  dataList: Array <any>=[];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };
  pageGenres: Array<any>= pageGenre;
  pageGenre: string = "";
  windowUrl: any;
  drawFlag = true;
  // imgApi: String = "http://192.168.1.202:80/";
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
  ) {
    this.appService.titleEventEmitter.emit("页面管理");
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/pageList")>= 0) {
      this.drawFlag = false;
      this.appService.titleEventEmitter.emit("手绘本-页面");
    }
  }
  sCode: any;
  sAlias: any;
  sBgImageUrl: any;
  sNotice: any;
  stemplate: any;
  ngOnInit() {
    let param = {page: this.options.page, rows: this.options.rows};
    this.getPageList(param);
    this.showkey();
  }
  ngOnDestroy() {
    if (this.pageSaveModal !== null) {
      this.pageSaveModal.close();
    }
  }
  // 监听F8键，控制页面“删除”按钮显隐
  delflag: any = false;
  showkey() {
    let that = this;
    document.onkeydown = function (e){
      let key;
      key = e.which;
      if (key === 119) {
        that.delflag = !that.delflag;
      }
    };
  }
  onPageChanged ($event) {
    this.options.page = $event;
    this.defaultList();
  }

  defaultList () {
    this.getPageList({
      page: this.options.page,
      rows: this.options.rows,
      pageId: this.sCode,
      alias: this.sAlias,
      bgImgUrl: this.sBgImageUrl,
      notice: this.sNotice,
      pageGenre: this.pageGenre,
      template: this.stemplate
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.sCode = '';
    t.sAlias = '';
    t.sBgImageUrl = '';
    t.sNotice = '';
    t.pageGenre = '';
    t.stemplate = '';
    this.getPageList({
      page: this.options.page,
      rows: this.options.rows,
      pageId: this.sCode,
      alias: this.sAlias,
      bgImgUrl: this.sBgImageUrl,
      notice: this.sNotice,
      pageGenre: this.pageGenre,
      template: this.stemplate
    });
  }

  getPageList(param) {
    let that = this;
    this.pageBusinessService.pageList(param, function(data) {
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

  search() {
    this.options.page = 1;
    this.defaultList();
  }

  pageSaveModal: any = null;
  addPro(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(PageSaveComponent, {size: 'lg'});
    if (data) {
      this.pageSaveModal.componentInstance.pageData = data;
    }
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  intoRes() {

  }

  // pageEditModal: any = null;
  edit(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(PageEditComponent, {size: 'lg'});
    if (data) {
      this.pageSaveModal.componentInstance.pageData = data;
    }
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }
  // pageCopyModal: any = null;
  copy(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(PageCopyComponent, {size: 'lg'});
    if (data) {
      this.pageSaveModal.componentInstance.copyData = data;
    }
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  del(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(PageUniteComponent);
    this.pageSaveModal.componentInstance.modalData = data;
    this.pageSaveModal.result.then((result) => {
      if (result === 'yes') {
        let param = {pageId: data.pageId};
        this.pageBusinessService.pageDel(param, function( data ){
          that.defaultList();
        });
      }

    }, (reason) => {
      // that.defaultList();
    });
    // const confirmCfg = new ConfirmConfig('是否确认删除？');
    // this.modalService.confirm(confirmCfg).then((result) => {
    //   if (result.status === "approved") {
    //     let param = {pageId: data.pageId};
    //     let that = this;
    //     this.pageBusinessService.pageDel(param, function(data){
    //       that.defaultList();
    //     });
    //   }
    // }, (reason) => {
    // });
  }

  // pageOpenImg: any = null;
  seeMdImg(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(PageImgshowComponent);
    this.pageSaveModal.componentInstance.oData = data;
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      // that.defaultList();
    });
    /*const confirmCfg = new ConfirmConfig('图片查看');
    this.modalService.confirm(confirmCfg).then((result) => {
    }, (reason) => {
    });*/
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
