import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../shared/http/http.service';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../../../shared/toast/toast-model';

@Component({
  selector: 'app-mark-tab-list',
  templateUrl: './mark-tab-list.component.html',
  styleUrls: ['./mark-tab-list.component.scss']
})
export class MarkTabListComponent implements OnInit {
  markName = '';
  markType = '';
  markId = '';
  apiList = '/busi/mark/list';
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  dataList = [];
  markTypeData: Array<any> = [{type: 'fix', name: '固定样式'}, {type: 'word', name: '文案类'}];
  constructor(public activeModal: NgbActiveModal, private httpService: HttpService, private toastService: ToastService) { }

  ngOnInit() {
    this.search();
  }
  search() {
    const param = {markId: this.markId, markName: this.markName, markType: this.markType, page : this.options.page, rows : this.options.rows};
    const that = this;
    this.httpService.postFormData(this.apiList, param, function (successful, data, res) {
      if (successful) {
        that.dataList = data.obj.data;
        that.options.page = param.page;
        that.options.total = data.obj.total;
        that.options.pageCount = Math.ceil(data.obj.total / that.options.rows) * that.options.rows;
      }
    }, function (successful, msg, err) {
    }, false);
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
  clear() {
    this.markName = '';
    this.markType = '';
    this.markId = '';
  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  onPageChanged($event) {
    this.options.page = $event;
    this.search();
  }
  ok() {
    let selectId = '';
    for (const i of this.dataList){
      if (i.checkState) {
        selectId = i.markId;
      }
    }
    if (selectId !== '' ) {
      this.activeModal.close(selectId);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
    }
  }
}
