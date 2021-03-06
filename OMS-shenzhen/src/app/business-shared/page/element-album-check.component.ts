import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { categoryAttr } from '../../global-constant';

@Component({
  selector: 'c-element-album-check',
  templateUrl: './element-album-check.component.html'
})
export class ElementAlbumCheckComponent implements OnInit {

  dataList: Array<any>= [];

  modalType: any;

  selectId: String = "";

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private pageBusinessService: PageBusinessService) {
  }

  ngOnInit() {
    this.getList();
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  SalbumCode: any;
  programTypes: Array<any>= categoryAttr;
  SalbumName: any = "";

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      albumCode: this.SalbumCode,
      albumName: this.SalbumName,
      albumCategory: this.modalType.eleAttr,
      resType: this.modalType.resType
    }
    this.pageBusinessService.getEleValAlbumData(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.SalbumCode = '';
    t.SalbumName = '';
    t.getList();
  }

  ok(): void {
    let selectId = "";
    for (let i of this.dataList){
      if (i.checkState) {
        selectId = i.albumCode;
      }
    }
    if (selectId !== "" ) {
      this.activeModal.close(selectId);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
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
    this.dataList[index].checkState = ev.target.checked;
  }


  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
