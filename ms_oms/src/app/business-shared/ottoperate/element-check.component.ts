import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {pageEleType, pageEleTypeModal, pageResType, pageTypeData} from '../../global-constant';
import {OttoperateBusinessService} from '../../business-service/ottoperate/ottoperate-business.service';
import {ElementSaveComponent} from '../page/element-save.component';

@Component({
  selector: 'c-element-check',
  templateUrl: './element-check.component.html'
})
export class ElementCheckComponent implements OnInit {

  dataList: Array<any>= [];

  modalType: any;
  fromProcuctList: Boolean = false;

  selectId: String = "";
  eleTypes: Array<any>= pageEleType;
  resTypes: Array<any>= pageResType;

  pageEleTypeModal: any = pageEleTypeModal;
  eleSaveModal: any;
  options: any = {
    rows: 15,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private ottoperateBusinessService: OttoperateBusinessService,
              private ngbModalService: NgbModal,

              // private pageBusinessService: PageBusinessService
  ) {
  }

  pageTypes: Array<any> = pageTypeData;
  pageType: any = "";

  ngOnInit() {
    this.getPageList();
  }

  search() {
    this.options.page = 1;
    this.getPageList();
  }

  onPageChanged($event) {
    this.options.page = $event;
    this.getPageList();
  }

  sPageId: any;
  sAlias: any;
  sPageType: any = "";
  initNum: Number = 0;
  eleType: string = "";
  sCode: string = "";
  resType: string = "";
  getPageList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      elementId: this.sCode,
      alias: this.sAlias,
      eleType: this.eleType,
      resType: this.resType
    }
    this.ottoperateBusinessService.elementList(param, function(data){
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

  clear () {
    let t = this;
    t.options.page = 1;
    t.sCode = '';
    t.sAlias = '';
    t.eleType = '';
    t.resType = '';
    t.getPageList();
  }
  addElement() {
    const that = this;
    this.eleSaveModal = this.ngbModalService.open(ElementSaveComponent, {size: 'lg'});
    this.eleSaveModal.componentInstance.modalData = '';
    this.eleSaveModal.result.then((result) => {
    }, (reason) => {
      that.getPageList();
    });
  }
  checkAll(ev) {
    this.selectId = '';
    // this.dataList.forEach(x => x.checked = ev.target.checked);
    this.dataList.forEach((el, el_index) => {
      el.checked = ev.target.checked;
      el.checkState = ev.target.checked;
      if (ev.target.checked) {
        this.selectId += (this.dataList[el_index].elementId + ',');
      }
    });
    this.selectId = this.selectId.slice(0, this.selectId.length - 1);
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
      } else {
        this.dataList[ind].checkState = false;
      }
    });
  }
  checkSingle(ev, index) {
    if (!this.fromProcuctList) { // 运营元素管理
      this.dataList.forEach((el, el_index) => {
        if (el_index === index) {
          el.checkState = ev.target.checked;
        } else {
          el.checkState = false;
        }
      });
    } else if (this.fromProcuctList) { // 产品页面关联管理
      this.dataList[index].checkState = ev.target.checked;
      // this.selectId = '';
      // this.dataList.forEach((el, el_index) => {
      //   this.selectId += this.dataList[el_index].checked ? this.dataList[el_index].elementId + ',' : '';
      // });
      // this.selectId = this.selectId.slice(0, this.selectId.length - 1);
    }
  }

  ok(): void {
    if (!this.fromProcuctList) {  //运营元素管理
      let selectId = "";
      for (let i of this.dataList){
        if (i.checkState) {
          selectId = i.elementId;
        }
      }
      if (selectId !== "" ) {
        this.activeModal.close(selectId);
      } else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
    }else if( this.fromProcuctList ) {  // 产品页面关联管理
      let selectId = [];
      for (let i of this.dataList){
        if (i.checkState) {
          selectId.push(i.elementId);
        }
      }
      let selectIdString = selectId.toString();
      if (selectIdString !== "") {
      this.activeModal.close(selectIdString);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
