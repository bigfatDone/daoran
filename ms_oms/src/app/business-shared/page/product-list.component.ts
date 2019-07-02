import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import { PageBusinessService} from '../../business-service/page/page-business.service';
import {Router} from '@angular/router';

import { ProductSaveComponent } from './product-save.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import {pageEleTypeModal} from '../../global-constant';
import {OrderBusinessService} from '../../business-service/order/order-business.service';



@Component({
  selector: 'c-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit, OnDestroy {

  dataList: Array<any> = [];
  productNameList: Array<any> = [];
  nodeCodes: Array<any>= [];
  itemCodes: Array<any>= [];
  productCodes: Array<any>= [];
  nodeCode: any = "";
  productSaveModal: any = null;
  drawFlag= true;
  windowUrl: any;

  // options: any = {
  //   rows: 20, // 每页条数数量
  //   page: 1,     // 当前页
  //   pageCount: 0,// 页码数量
  // };
  pCode: String = ""; // 指定产品编码
  pageId: String = ""; // 指定页面编码


  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private router: Router,
    private toastService: ToastService,
    private httpService: HttpService,
    private PageBusinessService: PageBusinessService,
  ) {
    this.appService.titleEventEmitter.emit("产品页面管理");
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/productList") >= 0 ) {
      this.drawFlag = false;
      this.appService.titleEventEmitter.emit("手绘本-产品页面管理")
    }
  }

  saveNewProcuct(data) {
    // console.log(data)
    this.productSaveModal = this.ngbModalService.open(ProductSaveComponent, {size: 'lg'});
    if (data) {
      this.productSaveModal.componentInstance.modalData = data;
    }
    this.productSaveModal.result.then((result) => {
    }, (reason) => {
      let param = {productCode: this.pCode, pageId: this.pageId};
      this.getPageProduct(param);
    });
  }

  getItems() {
    let that = this;
    this.PageBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.itemCodes = data;
      } else {
        that.itemCodes = [];
      }
    });
  }

  getAllProduct() {
    let that = this;
    this.PageBusinessService.getAllProductAuth(function(data){
      if (data.length > 0) {
        that.productCodes = data;
      } else {
        that.productCodes = [];
      }
    });
  }

  copy (str) {
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
    textArea.value = str;
    document.body.appendChild(textArea);
    textArea.select();
    let successful = document.execCommand('copy');
    let msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
    this.toastService.toast(new ToastConfig(ToastType.INFO, '', msg, 2000));
    document.body.removeChild(textArea);
  }

  getProductName (param) {
    let that = this;
    this.PageBusinessService.getProductName(param, function(data){
      // console.log(data)
      if (data.obj.length > 0) {
        that.productNameList = data.obj;
      } else {
        that.productNameList = [];
      }
    });
  }
  getPageProduct (param) {
    let that = this;
    this.PageBusinessService.getPageProduct(param, function(data){
      // console.log(data)
      if (data.obj.data.length > 0 ) {
        that.dataList = data.obj.data;
      } else {
        that.dataList = [];
      }
    });
  }
  // 指定节点
  getSelectNodePoints() {
    let that = this;
    this.PageBusinessService.getNodeDetail(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }

  search() {
    // let productCode = pCode;
    let param = {productCode: this.pCode, pageId: this.pageId, itemCode: this.nodeCode};
    // let param = {productCode: 'lxyy', pageId: this.pageId};
    this.getPageProduct(param);
  }

  clear () {
    // this.options.page = 1;
    this.pCode = '';
    this.pageId = '';
    this.nodeCode = '';
    this.getPageProduct({});
  }

  getSelectDataList(productCode) {
    // let param = {productCode: productCode, pageId: this.pageId};
    // let param = {productCode: 'lxyy', pageId: this.pageId}; // todo:test
    // this.getPageProduct(param);
  }

  ngOnInit() {
    // this.getProductName({});
    this.getPageProduct({});
    this.getSelectNodePoints();
    this.getItems();
    this.getAllProduct();
  }

  ngOnDestroy() {
    if (this.productSaveModal != null) {
      this.productSaveModal.close();
    }
  }
}
