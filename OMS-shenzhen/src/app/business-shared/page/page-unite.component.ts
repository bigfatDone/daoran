import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageEleTypeModal, pageTypeData } from '../../global-constant';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'c-page-unite',
  templateUrl: './page-unite.component.html'
})
export class PageUniteComponent implements OnInit {


  modalType: any;
  modalData: any = '';
  fromProcuctList: Boolean = false;

  selectId: String = "";

  pageEleTypeModal: any = pageEleTypeModal;

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private pageBusinessService: PageBusinessService) {
  }

  pageTypes: Array<any>= pageTypeData;
  pageType: any = "";

  ngOnInit() {
    this.getDetail();
  }

  dataList: Array<any>= [];
  dynrecsData: Array<any>= [];
  extrecsData: Array<any>= [];
  layrecsData: Array<any>= [];
  pagerecsData: Array<any>= [];
  detailData: any;
  getDetail () {
    let that = this;
    let param = {pageId: this.modalData.pageId};
    this.pageBusinessService.pageDetail(param, function(data){
      that.detailData = data;
      if(data.dynrecs == null){
        data.dynrecs = [];
      }if(data.extrecs == null){
        data.extrecs = [];
      }if(data.layrecs == null){
        data.layrecs = [];
      }if(data.pagerecs == null){
        data.pagerecs = [];
      }
      that.dataList = data.dynrecs;
      that.dynrecsData = data.dynrecs;
      that.extrecsData = data.extrecs;
      that.layrecsData = data.layrecs;
      that.pagerecsData = data.pagerecs;
    });
  }
  onTabChange($event: NgbTabChangeEvent) {
    this.dataList = [];
    if ($event.nextId === 'dynrecs') {
      this.dataList = this.dynrecsData;
    } else if ($event.nextId === 'extrecs') {
      this.dataList = this.extrecsData;
    } else if ($event.nextId === 'layrecs') {
      this.dataList = this.layrecsData;
    } else if ($event.nextId === 'pagerecs') {
      this.dataList = this.pagerecsData;
    }
  }

  search() {
    this.options.page = 1;
    // this.getPageList();
  }

  onPageChanged($event) {
    this.options.page = $event;
    // this.getPageList();
  }

  sPageId: any;
  sAlias: any;
  sPageType: any = "";
  initNum: Number = 0;

  clear () {
    let t = this;
    t.options.page = 1;
    t.sPageId = '';
    t.sAlias = '';
    t.sPageType = '';
    // t.getPageList();
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
    if (this.fromProcuctList) {
      this.dataList.forEach( (el, ind) => {
        if (ind === index) {
          if (this.dataList[index].checkState) {
            this.dataList[index].checkState = false;
          } else {
            this.dataList[index].checkState = true;
          }
        }
      });
    } else if ( !this.fromProcuctList ) {
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

  ok(): void {
    let agree = "yes";
    this.activeModal.close(agree);
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
