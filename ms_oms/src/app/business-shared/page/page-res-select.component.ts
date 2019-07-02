import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import {PageImgshowComponent} from './page-imgshow.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'c-page-res-select',
  templateUrl: './page-res-select.component.html'
})
export class pageResSelectComponent implements OnInit {

  dataList: Array<any>= [];

  oData: any = {};
  checkAllBox: Boolean = false;

  selectArr: Array<any> = [];
  selectObj: any;

  // pageEleTypeModal: any = pageEleTypeModal;

  options: any = {
    rows: 15,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private PageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
  ) {
  }

  showThisEleModal: any = null;
  lookTemplate (data) {
    let that = this;
    // console.log(data);
    if (data.template === '' || data.template === null) {
      const toastCfg = new ToastConfig(ToastType.INFO, '', '该关联暂无模板!', 2000);
      that.toastService.toast(toastCfg);
      return;
    }

    this.showThisEleModal = this.ngbModalService.open(PageImgshowComponent);
    this.showThisEleModal.componentInstance.isAddHttp = false;
    if (data) {
      this.showThisEleModal.componentInstance.oData = data;
    }
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
      that.getPageList();
    });
  }


  ngOnInit() {
    this.getPageList();
    // console.log(this.oData);
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
  sEleAlias: any = '';

  initNum: Number = 0;

  getPageList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      pageId: this.sEleCode,
      alias: this.sEleAlias,
    };
    this.PageBusinessService.pageListForElement(param, function(data){
      // console.log(data);
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
    if (this.checkAllBox) {
      this.dataList.forEach( (el, ind) => {
        if (ind === index) {
          if (this.dataList[index].checkState) {
            this.dataList[index].checkState = false;
            this.selectArr.push(this.dataList[index]);
          } else {
            this.dataList[index].checkState = true;
          }
        }
      });
    } else if ( !this.checkAllBox ) {
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
  }


  // checkSingle(ev, index) {
  //   if (!this.checkAllBox) { // 非全选页
  //     if (ev.target.checkState === false) {
  //       return;
  //     }
  //     this.dataList.forEach((el, el_index) => {
  //        if (el_index !== index) {
  //         el.checkState = !this.dataList[index].checkState;
  //       }
  //     });
  //     this.selectObj = this.dataList[index].checkState ? this.dataList[index] : '';
  //   } else if (this.checkAllBox) { // 可全选
  //     this.dataList[index].checkState = ev.target.checked;
  //     this.selectArr = [];
  //     this.dataList.forEach((el, el_index) => {
  //       // this.selectObj += this.dataList[el_index].checked ? this.dataList[el_index].pageId + ',' : '';
  //       if (this.dataList[el_index].checkState) {
  //         this.selectArr.push(this.dataList[el_index]);
  //       }
  //     });
  //     // this.selectObj = this.selectObj.slice(0, this.selectObj.length - 1);
  //   }
  //   console.log(this.selectObj)
  // }
  checkSingle(ev, index) {
    if (!this.checkAllBox) { // 非全选页
      if (ev.target.checkState === false) {
        return;
      }
      this.dataList.forEach((el, el_index) => {
         if (el_index === index) {
          el.checkState = this.dataList[index].checkState;
        }
      });
      this.selectObj = this.dataList[index].checkState ? this.dataList[index] : '';
    } else if (this.checkAllBox) { // 可全选
      this.dataList[index].checkState = ev.target.checked;
      this.selectArr = [];
      this.dataList.forEach((el, el_index) => {
        // this.selectObj += this.dataList[el_index].checked ? this.dataList[el_index].pageId + ',' : '';
        if (this.dataList[el_index].checkState) {
          this.selectArr.push(this.dataList[el_index]);
        }
      });
      // this.selectObj = this.selectObj.slice(0, this.selectObj.length - 1);
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
