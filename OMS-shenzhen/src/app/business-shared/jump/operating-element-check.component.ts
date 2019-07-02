import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { pageEleTypeModal, pageResType } from '../../global-constant';
// import { PageBusinessService } from '../../business-service/page/page-business.service';
import {JumpBusinessService} from '../../business-service/jump/jump-business.service';

@Component({
  selector: 'c-operating-element-check',
  templateUrl: './operating-element-check.component.html'
})
export class operatingElementCheckComponent implements OnInit {

  dataList: Array<any>= [];

  modalType: any;
  checkAllBox: Boolean = false;

  selectArr: Array<any> = [];
  selectObj: any;

  // pageEleTypeModal: any = pageEleTypeModal;

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private jumpBusinessService: JumpBusinessService
  ) {
  }

  pageEleTypes: Array<any>=pageEleTypeModal;
  pageResTypes: Array<any>=pageResType;

  ngOnInit() {
    this.getPageList();
    // this.selectObj.elementId = '';
  }

  search() {
    this.options.page = 1;
    this.getPageList();
  }

  selectChange (code) {
  }

  onPageChanged($event) {
    this.options.page = $event;
    this.getPageList();
  }

  sEleCode: any = '';
  sAlias: any = '';
  sPageEleType: any = "";
  sPageResType: any = "";
  initNum: Number = 0;

  getPageList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      elementId: this.sEleCode,
      alias: this.sAlias,
      eleType: this.sPageEleType,
      resType: this.sPageResType,
    };
    this.jumpBusinessService.getPageListService(param, function(data){
      // console.log(123)
      // console.log(data)
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = that.options.page;
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
    this.selectObj = '';
    t.options.page = 1;
    t.sEleCode = '';
    t.sAlias = '';
    t.sPageEleType = '';
    t.sPageResType = '';
    t.getPageList();
  }

  checkAll(ev) {
    // this.selectArr = [];
    // this.dataList.forEach(x => x.checked = ev.target.checked);
    this.dataList.forEach((el, el_index) => {
      el.checkState = ev.target.checked;
      if (ev.target.checked) {
        this.selectArr.push(this.dataList[el_index]);
      }
    });
    // this.selectArr = this.dataList;
    // this.selectId = this.selectId.slice(0, this.selectId.length - 1);
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
    this.selectObj = this.dataList[index].checkState ? this.dataList[index] : '';
  }

  checkSingle(ev, index) {
    if (!this.checkAllBox) { // 非全选页
      if (ev.target.checked === false) {
        return;
      }
      this.dataList.forEach((el, el_index) => {
        if (el_index !== index) {
          el.checkState = !this.dataList[index].checkState;
        }
      });
      this.selectObj = this.dataList[index].checkState ? this.dataList[index] : '';
    }
  }

  isEmptyObject (obj) {
    for (let key in obj){
      return false; // 返回false，不为空对象
    }
    return true; // 返回true，为空对象
  }

  ok(): void {
    if (this.checkAllBox === false) {
      if (!this.isEmptyObject(this.selectObj)) {
        this.activeModal.close(this.selectObj);
      } else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
    } else if (this.selectArr.length > 0) {
      this.activeModal.close(this.selectArr);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
