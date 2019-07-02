import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageEleTypeModal, pageTypeData } from '../../global-constant';
import {PageEditComponent} from './page-edit.component';
import {ElementTagProgramComponent} from './element-tag-program.component';

@Component({
  selector: 'c-element-tag-check',
  templateUrl: './element-tag-check.component.html'
})
export class ElementTagCheckComponent implements OnInit {

  dataList: Array<any>= [];
  tagRes: Array<any>= [{value: 1, name: '单资源'}, {value: 2, name: '节目单资源'}, {value: 3, name: '专辑资源'},];
  tagres: any = 1;

  modalType: any;
  fromProcuctList: Boolean = false;

  selectId: String = "";

  pageEleTypeModal: any = pageEleTypeModal;

  options: any = {
    rows: 12,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService) {
  }

  pageTypes: Array<any> = pageTypeData;
  pageType: any = "";

  ngOnInit() {
    this.getPageList();
    this.getLabelType();
  }

  search() {
    this.options.page = 1;
    this.getPageList();
  }

  onPageChanged($event) {
    this.options.page = $event;
    this.getPageList();
  }

  sTagName: any = "";
  sTagType: any = "";
  sTagCode: any = "";
  initNum: Number = 0;

  tagresFc: any = '1';
  tagResChange() {
    let that = this;
    this.tagresFc = this.tagres;
    // if ()
  }

  tagData: Array<any> = [];
  getLabelType() {
    let that = this;
    this.pageBusinessService.getLabelType(function(data){
      if (data !== null ) {
        that.tagData = data;
      } else {
        that.tagData = [];
      }
    });
  }

  getPageList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      labelType: this.sTagType,
      labelName: this.sTagName,
      labelCode: this.sTagCode,
    }
    this.pageBusinessService.getLabelList(param, function(data){
      if (data !== null) {
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
    t.sTagName = '';
    t.sTagType = '';
    t.sTagCode = '';
    t.getPageList();
  }

  checkAll(ev) {
    this.selectId = '';
    // this.dataList.forEach(x => x.checked = ev.target.checked);
    this.dataList.forEach((el, el_index) => {
      el.checked = ev.target.checked;
      el.checkState = ev.target.checked;
      if (ev.target.checked) {
        this.selectId += (this.dataList[el_index].pageId + ',');
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
      //   this.selectId += this.dataList[el_index].checked ? this.dataList[el_index].pageId + ',' : '';
      // });
      // this.selectId = this.selectId.slice(0, this.selectId.length - 1);
    }
  }

  ok(): void {  //运营元素管理
      let selectId = "";
      for (let i of this.dataList){
        if (i.checkState) {
          selectId = i.id;
        }
      }
      if (selectId !== "" ) {
        this.activeModal.close({id: selectId, tag: this.tagres});
      } else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  pageSaveModal: any = null;
  edit(data, type) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(ElementTagProgramComponent, {size: 'lg'});
    this.pageSaveModal.componentInstance.modalData = {
      data: data,
      tagType: type
    };
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      // that.getPageList();
    });
  }
}
