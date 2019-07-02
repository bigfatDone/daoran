import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageEleTypeModal, pageTypeData } from '../../global-constant';

@Component({
  selector: 'c-page-union',
  templateUrl: './page-union.component.html'
})
export class PageUnionComponent implements OnInit {

  dataList: Array<any>= [];
  modelData: any = '';

  modalType: any;
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

  pageTypes: Array<any>=pageTypeData;
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

  getPageList() {
    let that = this;
    let param: any = {
      page: this.options.page,
      rows: this.options.rows,
      pageId: this.sPageId,
      alias: this.sAlias,
      pageType: this.sPageType,
    }
    if (this.modelData !== '') {
      param.id = this.modelData;
    }
    this.pageBusinessService.UnionList(param, function(data){
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
    t.sPageId = '';
    t.sAlias = '';
    t.sPageType = '';
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
    // if (this.fromProcuctList) {
    //   this.dataList.forEach( (el, ind) => {
    //     if (ind === index) {
    //       if (this.dataList[index].checkState) {
    //         this.dataList[index].checkState = false;
    //       } else {
    //         this.dataList[index].checkState = true;
    //       }
    //     }
    //   });
    // } else if ( !this.fromProcuctList ) {
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
    // }
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

  chooseData: Array<any> = [];
  ok(): void {
    let selectId = [];
    for (let i of this.dataList){
      if (i.checkState) {
        selectId.push({
          id: i.pageId,
          name: i.alias
        });
        // selectId = i.pageId;
      }
    }
    if (selectId !== [] ) {
      this.activeModal.close(selectId);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
