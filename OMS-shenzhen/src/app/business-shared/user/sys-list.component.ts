import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { WebsiteBusinessService } from '../../business-service/website/website-business.service';
import {terminalType, startFlag} from '../../global-constant';
import { SysSaveComponent } from './sys-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {UserBusinessService} from '../../business-service/user/user-business.service';

@Component({
  selector: 'c-sys-list',
  templateUrl: './sys-list.component.html',
  styleUrls: ['./sys-list.component.scss']
})
export class SysListComponent implements OnInit, OnDestroy {

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
    private toastService: ToastService,
    private userBusinessService: UserBusinessService,
    private modalService: ModalService) {
    this.appService.titleEventEmitter.emit("动态参数配置");
  }


  types: any = terminalType;
  system: any = "";
  states: any = startFlag;
  configKey: any = "";
  configValue: any = "";
  ngOnInit() {
    this.getList();
  }
  ngOnDestroy() {
    if (this.bannerSaveModal !== null ) {
      this.bannerSaveModal.close();
    } else if (this.bannerOpenImg !== null ) {
      this.bannerOpenImg.close();
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
      system: this.system,
      configKey: this.configKey,
      configValue: this.configValue,
    }
    this.userBusinessService.sysList(param, function(data){
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
    t.system = '';
    t.configKey = '';
    t.configValue = '';
    t.getList();
  }

  bannerSaveModal: any = null;
  save(data) {
    let that = this;
    this.bannerSaveModal = this.ngbModalService.open(SysSaveComponent, {size: 'lg'});
    this.bannerSaveModal.componentInstance.modalData = data;
    this.bannerSaveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  bannerOpenImg: any = null;
  seeMdImg(data) {
    let that = this;
    // this.bannerOpenImg = this.ngbModalService.open(BannerImgshowComponent);
    // if (data) {
    //   this.bannerOpenImg.componentInstance.oData = data;
    // }
    this.bannerOpenImg.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
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

  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      let param: any = {};
      if (id !== '') {
        param.ids = id;
      } else {
        param.ids = this.getCheckedIds();
      }
      that.userBusinessService.sysDel (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
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

}
