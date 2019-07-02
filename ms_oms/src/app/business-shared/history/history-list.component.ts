import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';

import { pageEleAttr } from "../../global-constant";
import { HistoryBusinessService} from '../../business-service/history/history-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {HistoryDetailComponent} from './history-detail.component';

@Component({
  selector: 'c-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private HistoryBusinessService: HistoryBusinessService,
    ) {
    this.appService.titleEventEmitter.emit("历史运营元素管理");
  }

  code: String = '';
  name: String = '';
  eleCategory: String = '';
  state: String = '';

  // eleCategoryList: Array<any> = pageEleAttr.splice(1, pageEleAttr.length);
  eleCategoryList: Array<any> = [{type: 1, name: "音乐MV"}, {type: 2, name: "儿童歌曲"}, {type: 3, name: "儿童教育"}, {type: 4, name: "戏曲"}, {type: 5, name: "手绘本"}];
  statusList: Array<any> = [{id: 0, name: "隐藏"}, {id: 1, name: "显示"}];

  options: any = {
    rows: 20,
    pageCount: 0, // 页码数量
    page: 1,      // 当前页
  };

  onPageChanged($event) {
    // console.log($event);
    this.options.page = $event;
    this.getList();
  }

  ngOnInit() {
    this.getList();
  }
  search() {
    this.options.page = 1;
    this.getList();
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
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

  getSids () {
    let strArr = [];
    this.dataList.forEach(x => {
      if (x.checkState) {
        strArr.push(x.id);
      }
    });
    let sIds = strArr.join();
    return sIds;
  }

  showOrHide (status) {
    let that = this;
    let sIds = this.getSids();
    if (sIds === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的运营元素!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    let param = {
      ids: sIds,
      state: status
    };
    if (status === 1) {
      const confirmCfg = new ConfirmConfig('\n' + '确定要显示选择的运营元素吗？');
      this.modalService.confirm(confirmCfg).then((result) => {
        that.HistoryBusinessService.updateStateService(param, function(data){
          // console.log(data);
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
          that.toastService.toast(toastCfg);
          that.getList();
        });
      }, (reason) => {
      });
    } else if (status === 0) {
      const confirmCfg2 = new ConfirmConfig('\n' + '确定要隐藏选择的运营元素吗？');
      this.modalService.confirm(confirmCfg2).then((result) => {
        that.HistoryBusinessService.updateStateService(param, function(data){
          // console.log(data);
          const toastCfg2 = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
          that.toastService.toast(toastCfg2);
          that.getList();
        });
      }, (reason) => {
      });
    }
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.code = '';
    t.name = '';
    t.eleCategory = '';
    t.state = '';
    t.getList();
  }
  initNum: Number = 0;
  getList() {
    let that = this;
    let param = {
      id: that.code,
      newAlias: that.name,
      eleCategory: that.eleCategory,
      state: that.state,
      page: that.options.page,
      rows: that.options.rows,
    };
    this.HistoryBusinessService.getListDataService(param, function(data){
      // console.log(data);
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
        that.initNum = (that.options.page - 1) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  historyModal: any = null;

  goDetail (data) {
    this.historyModal = this.ngbModalService.open(HistoryDetailComponent, {size: 'lg'});
    this.historyModal.componentInstance.modalData = data;
    this.historyModal.result.then((result) => {
    }, (reason) => {
      this.getList();
    });
  }

  getIds () {
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
    let param: any = {};
    if (id !== '') {
      param.ids = id;
    } else {
      param.ids = this.getIds();
    }
    if (param.ids === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.HistoryBusinessService.del (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }

  ngOnDestroy() {
    if (this.historyModal != null) {
      this.historyModal.close();
    }
  }

}
