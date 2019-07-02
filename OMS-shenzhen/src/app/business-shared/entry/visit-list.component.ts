import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import {Router} from '@angular/router';

import { VisitSaveComponent } from './visit-save.component';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';
import { ToastService } from '../../shared/toast/toast.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {VisitDetailsComponent} from './visit-details.component';

@Component({
  selector: 'c-visit-list',
  templateUrl: './visit-list.component.html',
})
export class VisitListComponent implements OnInit, OnDestroy {

  dataList: Array <any>= [] ;
  drawFlag = true;
  windowUrl: any;

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private router: Router,
    private entryBusinessService: EntryBusinessService,
    private modalService: ModalService,
    private toastService: ToastService,
    ) {
    this.appService.titleEventEmitter.emit("访问入口");
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/visitList") >= 0 ) {
      this.drawFlag = false;
      this.appService.titleEventEmitter.emit("手绘本-访问入口");
    }
  }

  visitListModal: any = null;
  ngOnDestroy() {
    if (this.visitListModal != null) {
      this.visitListModal.close();
    }
  }

  projectsList: Array<any>= [];
  pProject: any = "";
  getProjects() {
    let that = this;
    this.entryBusinessService.projectAuth({}, function(data){
      if (data.length > 0) {
        that.projectsList = data;
      } else {
        that.projectsList = [];
      }
    });
  }

  productList: Array<any>= [];
  pProduct: any = "";
  getProducts() {
    let that = this;
    this.entryBusinessService.getProductAreaListPost({}, function(data){
      if (data.length > 0) {
        that.productList = data;
      } else {
        that.productList = [];
      }
    });
  }

  productVerList: Array<any> = [{name: '高清', ver: 'H'},{name: '标清', ver: 'S'},{name: '安卓', ver: 'A'}];
  pProductVer: any = "";


  provincesList: Array<any>= [];
  pProvinces: any = "";
  getProvinces() {
    let that = this;
    this.entryBusinessService.getProvinces(function(data){
      if (data.length > 0) {
        that.provincesList = data;
      } else {
        that.provincesList = [];
      }
    });
  }

  slevel1List: Array<any> = []; // 分类
  pSlevel1: String = '';
  getSlevel1() {
    let that = this;
    this.entryBusinessService.getSlevel1Service({}, function(data){
      if (data.length > 0) {
        that.slevel1List = data;
      } else {
        that.slevel1List = [];
      }
    });
  }

  entryName: String = "";

  selectChange (code) {
  }

  search(){
    this.options.page = 1;
    this.getList();
  }

  clear () {
    this.options.page = 1;
    this.pProject = '';
    this.pProduct = '';
    this.pProductVer = '';
    this.pProvinces = '';
    this.pSlevel1 = '';
    this.entryName = '';
    this.getList();
  }

  ngOnInit() {
    this.getProjects();
    this.getProducts();
    this.getProvinces();
    this.getSlevel1();
    this.getList();
  }

  initNum: Number = 0;
  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      sProjectCode: this.pProject,
      sProductCode: this.pProduct,
      sProductVer: this.pProductVer,
      provinceCode: this.pProvinces,
      sLevel1: this.pSlevel1,
      sEntryName: this.entryName,
    }
    this.entryBusinessService.getEntermanageList(param, function(data) {
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
        that.initNum = (that.options.page - 1) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  save (type, data) {
    if (type === "add") {
      this.visitListModal = this.ngbModalService.open(VisitSaveComponent);
      this.visitListModal.componentInstance.modalType = type;
      this.visitListModal.componentInstance.projectsList = this.projectsList;
      this.visitListModal.componentInstance.slevel1List = this.slevel1List;
      this.visitListModal.result.then((result) => {
      }, (reason) => {
        this.clear();
        this.options.page = 1;
        this.getList();
        this.getProjects();
        this.getSlevel1();
      });
    } else if (type === 'edit') {
      this.visitListModal = this.ngbModalService.open(VisitSaveComponent);
      this.visitListModal.componentInstance.modalType = type;
      this.visitListModal.componentInstance.modalData = data;
      this.visitListModal.componentInstance.projectsList = this.projectsList;
      this.visitListModal.componentInstance.slevel1List = this.slevel1List;

      this.visitListModal.result.then((result) => {
      }, (reason) => {
        // this.clear();
        // this.options.page = 1;
        this.getList();
        this.getProjects();
        this.getSlevel1();
      });
    }
  }

  details (iId) {
    this.visitListModal = this.ngbModalService.open(VisitDetailsComponent);
    this.visitListModal.componentInstance.iId = iId;

    this.visitListModal.result.then((result) => {
    }, (reason) => {
      // this.clear();
      // this.options.page = 1;
      this.getList();
    });

  }

  delete(id) {
    let that = this;
    let param = {
      iId: id
    };
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.entryBusinessService.delEnterManageService(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
        that.getList();
      });
    }, (reason) => {
    });
  }

  codyLink (link) {
    // document.execCommand("Copy");
    let textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    let successful = document.execCommand('copy');
    let msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
    this.toastService.toast(new ToastConfig(ToastType.INFO, '', msg, 2000));
    document.body.removeChild(textArea);
  }

}
