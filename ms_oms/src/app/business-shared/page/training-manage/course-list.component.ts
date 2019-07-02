import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { PageBusinessService } from '../../../business-service/page/page-business.service';

@Component({
  selector: 'app-course-tab-list',
  templateUrl: './course-list.component.html',
})
export class CourseListComponent implements OnInit {
  courseCode = '';
  courseName = '';
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量,
    total: 0
  };
  dataList = [];
  constructor(public activeModal: NgbActiveModal, private toastService: ToastService, private pageBusinessService: PageBusinessService) { }

  ngOnInit() {
    this.search();
  }
  search() {
    const param = {courseCode: this.courseCode, courseName: this.courseName, resType: 1, strType: 'exercise ', page : this.options.page, rows : this.options.rows};
    const that = this;
    this.pageBusinessService.getCouseList(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
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
    this.courseCode = '';
    this.courseName = '';
    this.options.page = 1;
    this.search();
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
        selectId = i.courseCode;
      }
    }
    if (selectId !== '' ) {
      this.activeModal.close(selectId);
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
    }
  }
}
