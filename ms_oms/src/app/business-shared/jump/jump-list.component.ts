import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import { JumpBusinessService} from '../../business-service/jump/jump-business.service';

import { JumpSaveComponent } from './jump-save.component';
import { userStatus } from "../../global-constant";
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'c-jump-list',
  templateUrl: './jump-list.component.html',
  styleUrls: ['./jump-list.component.scss']
})
export class JumpListComponent implements OnInit, OnDestroy {

  dataList:Array<any>=[];

  productNameList: Array<any> = [];
  procuctCode: String = ""; // 指定产品编码

  nodeCodeList: Array<any> = [];
  nodeCode: String = ""; // 指定节点编码

  provincesList: Array<any> = [];
  provincesCode: String = ""; // 省份

  // userStatusList: Array<any> = [{type: '', name: "请选择"}, {type: 9, name: "全部"}, {type: 0, name: "未订购"}, {type: 1, name: "已订购"}, {type: 2, name: "处理中"}, {type: 3, name: "免费赠送"}];
  userStatusList: Array<any> = userStatus;
  userStatus: String = ""; // 用户状态

  statusList: Array<any> = [{type: '', name: "请选择"}, {type: 0, name: "暂停"}, {type: 1, name: "启动"}];
  status: String = ""; // 状态

  AccessId: String = "";
  element: String = ""; // 运营元素

  inputVal: String = ""; 表单联查
  filterData: Array<any> = [];
  selectVal: String = '请选择';

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private JumpBusinessService: JumpBusinessService,
    config: NgbDropdownConfig
    ) {
    this.appService.titleEventEmitter.emit("产品跳转");
  }

  options: any = {
    rows: 20,
    pageCount: 0, // 页码数量
    page: 1,      // 当前页
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  ngOnInit() {
    this.getProductName({});
    this.getNodeCode({});
    this.getProvinces({});
    this.getList();
  }
  search() {
    this.options.page = 1;
    this.getList();
    // this.procuctCode = '';
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

  startOrPauseProductSkip(status) { // 启动
    let that = this;
    let sIds = this.getSids();
    if (sIds === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    let param = {
      sIds: sIds,
      status: status
    };
    if (status === 1) {
      const confirmCfg = new ConfirmConfig('\n' + '确定要启用选择的产品跳转规则信息吗？');
      this.modalService.confirm(confirmCfg).then((result) => {
        that.JumpBusinessService.startOrPauseProductSkipServce(param, function(data){
          // console.log(data);
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '启用成功!', 2000);
          that.toastService.toast(toastCfg);
          that.getList();
        });
      }, (reason) => {
      });
    } else if (status === 0) {
      const confirmCfg2 = new ConfirmConfig('\n' + '确定要暂停选择的产品跳转规则信息吗？');
      this.modalService.confirm(confirmCfg2).then((result) => {
        that.JumpBusinessService.startOrPauseProductSkipServce(param, function(data){
          // console.log(data);
          const toastCfg2 = new ToastConfig(ToastType.SUCCESS, '', '暂停成功!', 2000);
          that.toastService.toast(toastCfg2);
          that.getList();
        });
      }, (reason) => {
      });
    }
  }

  delProductSkip() { // 删除
    let that = this;
    let sIds = this.getSids();
    // console.log(strArr)
    // console.log(sIds)
    if (sIds === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    let param = {
      sIds: sIds
    };
    const confirmCfg = new ConfirmConfig('确定要删除选择的产品跳转信息吗？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.JumpBusinessService.delProductSkipServce(param, function(data){
        // console.log(data);
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
        that.getList();
      });
    }, (reason) => {
    });
  }

  pipeProvinceData:any;
  getProvinces (param) { // 省份
    let that = this;
    this.JumpBusinessService.getProvincesAuth(param, function(data){
      // console.log(data)
      if (data.obj.length > 0) {
        that.provincesList = data.obj;
        that.pipeProvinceData = {
          type: 'province',
          data: data.obj
        };
      } else {
        that.provincesList = [];
      }
    });
  }

  pipeProductData: any;
  getProductName (param) { // 指定产品
    let that = this;
    this.JumpBusinessService.getProductAuth(param, function(data){
      // console.log(data)
      if (data.obj.length > 0) {
        that.productNameList = data.obj;
        that.pipeProductData = {
          type: 'product',
          data: data.obj
        };
        that.testInput();
      } else {
        that.productNameList = [];
      }
    });
  }

  pipeNodeCodeData: any;
  getNodeCode (param) { // 指定节点
    let that = this;
    this.JumpBusinessService.projectAuth(param, function(data){
      // console.log(data)
      if (data.length > 0) {
        that.nodeCodeList = data;
        // that.pipeNodeCodeData = {
        //   type: 'nodeCode',
        //   data: data.obj
        // };
      } else {
        that.nodeCodeList = [];
      }
    });
  }

  getSelectDataList(data) {
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.nodeCode = '';
    t.procuctCode = '';
    t.provincesCode = '';
    t.AccessId = '';
    t.element = '';
    t.userStatus = '';
    t.status = '';
    t.getList();
  }
  initNum: Number = 0;
  getList() {
    let that = this;
    let param = {
      itemCode: that.nodeCode,
      projectCode: that.procuctCode,
      provinceCode: that.provincesCode,
      accessId: that.AccessId,
      elementId: that.element,
      userStatus: that.userStatus,
      status: that.status,
      page: that.options.page,
      rows: that.options.rows,
    };
    this.JumpBusinessService.productSkipListPost(param, function(data){
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

  jumpSaveModal: any = null;
  save() {
    this.jumpSaveModal = this.ngbModalService.open(JumpSaveComponent, {size: 'lg'});
    this.jumpSaveModal.componentInstance.modalType = 'add';
    this.jumpSaveModal.componentInstance.modalData = {
      provinceData: this.provincesList,
      productData: this.productNameList,
    };
    this.jumpSaveModal.result.then((result) => {
    }, (reason) => {
      this.clear();
      this.options.page = 1;
      this.getList();
    });
  }
  modify(data) {
    this.jumpSaveModal = this.ngbModalService.open(JumpSaveComponent, {size: 'lg'});
    this.jumpSaveModal.componentInstance.modalType = 'modify';
    this.jumpSaveModal.componentInstance.midifyData = data;

    this.jumpSaveModal.componentInstance.modalData = {
      provinceData: this.provincesList,
      productData: this.productNameList,
    };
    this.jumpSaveModal.result.then((result) => {
    }, (reason) => {
      // this.clear();
      // this.options.page = 1;
      this.getList();
    });
  }

  ngOnDestroy() {
    if (this.jumpSaveModal != null) {
      this.jumpSaveModal.close();
    }
  }

  del() {
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg);
  }

  testInput() {
    console.log(this.inputVal);
    console.log('test');
    this.filterData = [];
    this.productNameList.forEach( item => {
      if (item.sProductName.search(this.inputVal) !== -1) {
        this.filterData.push(item);
      }
    });
  }
  testLi(data) {
    console.log('testLi');
    this.selectVal = data;
  }
  test() {
    return true;
  }
  jumpFather(ev) {
    console.log(ev);
  }
}
