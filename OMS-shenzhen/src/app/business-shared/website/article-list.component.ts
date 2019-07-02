import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { WebsiteBusinessService } from '../../business-service/website/website-business.service';
import {articleType, startFlag} from '../../global-constant';
import { ArticleSaveComponent } from './article-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {PageEditComponent} from '../page/page-edit.component';
import {RurelateSaveComponent} from '../order/rurelate-save.component';

@Component({
  selector: 'c-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {

  dataList:Array<any>= [];

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }
  // onPageChanged($event) {
  //   let curPage = $event.type;
  //   if ( typeof $event.type != "number" ) {
  //     curPage = 1;
  //   }
  // }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private websiteBusinessService: WebsiteBusinessService,
    private toastService: ToastService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("文章管理");
  }


  types: any = articleType;
  type: any = "";
  states: any = startFlag;
  state: any = "";
  title: any = "";
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    if (this.articleSaveModal !== null ) {
      this.articleSaveModal.close();
    }
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      title: this.title,
      type: this.type,
      state: this.state,
    }
    this.websiteBusinessService.articleListPost(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.title = '';
    t.type = '';
    t.state = '';
    t.getList();
  }

  articleSaveModal: any = null;
  save(data) {
    let that = this;
    this.articleSaveModal = this.ngbModalService.open(ArticleSaveComponent, {size: 'lg'});
    this.articleSaveModal.componentInstance.articleData = data;
    this.articleSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoRes() {

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
  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }
  getCheckedIds() {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.id);
      }
    });
    return ids.toString();
  }

  del() {
    let that = this;
    let param = {
      ids: this.getCheckedIds()
    };
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.websiteBusinessService.delArticleePost (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }

  updateStatus(status) {
    let that = this;
    let param = {
      ids: this.getCheckedIds(),
      state: status
    };
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    let txt = status === 0 ? "暂停" : "启用";
    const confirmCfg = new ConfirmConfig('是否确认' + txt + '？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.websiteBusinessService.updataArticlePost(param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', txt + '成功！', 2000));
      });
    }, (reason) => {
    });
  }

}
