import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { pageEleTypeModal, pageTypeData } from '../../../global-constant';

@Component({
  selector: 'app-page-to',
  templateUrl: './page-to.component.html'
})
export class PageTOComponent implements OnInit {
  dataList: Array<any>= [];
  modalType: any;
  fromProcuctList: Boolean = false;
  selectId: String = '';
  pageEleTypeModal: any = pageEleTypeModal;
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  sPageId: any;
  sAlias: any;
  initNum: Number = 0;
  pageType: any = '';
  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private pageBusinessService: PageBusinessService) {
  }
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
  getPageList() {
    const that = this;
    const param = {
      page: this.options.page,
      rows: this.options.rows,
      productPageId: this.sPageId,
      productPageName: this.sAlias,
      itemType: '',
      itemCode: '',
      provinceCode: '',
      cityCode: '',
      productType: '',
      productCode: '',
      versionNum: '',
      pageType: 1
    };
    this.pageBusinessService.getProductPageConfigList(param, function(data){
      if (data.success) {
        that.dataList = data.obj.data;
        that.options.total = data.obj.total;
        that.options.pageCount = Math.ceil(data.obj.total / that.options.rows) * that.options.rows;
      }
    });
  }

  clear () {
    const t = this;
    t.options.page = 1;
    t.sPageId = '';
    t.sAlias = '';
    t.getPageList();
  }

  checkAll(ev) {
    this.selectId = '';
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
    this.dataList.forEach((el, el_index) => {
      if (el_index === index) {
        el.checkState = ev.target.checked;
      } else {
        el.checkState = false;
      }
    });
  }

  ok(): void {
    const selectId = [];
    for (const i of this.dataList){
      if (i.checkState) {
        selectId.push({
          id: i.productPageId,
          name: i.productPageName
        });
      }
    }
    if (selectId.length > 0 ) {
      this.activeModal.close(selectId);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
