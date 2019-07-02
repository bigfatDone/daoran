import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {apiPlatform} from '../../global-constant';
import {SafetyBusinessService} from '../../business-service/safety/safety-business.service';
import {PageBusinessService} from '../../business-service/page/page-business.service';

@Component({
  selector: 'c-role-interface',
  templateUrl: './role-interface.component.html'
})
export class RoleInterfaceComponent implements OnInit {

  dataList: Array<any>= [];

  modalType: any;
  modalData: any = '';
  fromProcuctList: Boolean = false;

  selectId: String = "";

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private safetyBusinessService: SafetyBusinessService,) {
  }

  apiPlatforms: Array<any> = apiPlatform;

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

  apiName: any = "";
  apiPlatform: any = "";
  initNum: Number = 0;

  getPageList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      apiPlatform: this.apiPlatform,
      apiName: this.apiName,
    }
    this.safetyBusinessService.getApiList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
        that.initNum = (that.options.page - 1) * that.options.rows;
        data.data.forEach( i => {
          for (let n of that.modalData) {
            if ( i.apiCode === n.apiCode) {
              i.checkState = true;
            }
          }
        })
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.apiPlatform = '';
    t.apiName = '';
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
      }
      // else {
      //   this.dataList[ind].checkState = false;
      // }
    });
  }


  checkSingle(ev, index) {
      this.dataList[index].checkState = ev.target.checked;
      // this.selectId = '';
      // this.dataList.forEach((el, el_index) => {
      //   this.selectId += this.dataList[el_index].checked ? this.dataList[el_index].pageId + ',' : '';
      // });
      // this.selectId = this.selectId.slice(0, this.selectId.length - 1);
  }

  ok(): void {
      let selectId = [];
      for (let i of this.dataList){
        if (i.checkState) {
          selectId.push(i.apiCode);
        }
      }
      let selectIdString = selectId.toString();
      if (selectIdString !== "") {
        this.activeModal.close(selectIdString);
      } else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
