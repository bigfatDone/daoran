import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { courseData } from '../../global-constant';

@Component({
  selector: 'c-element-course',
  templateUrl: './element-course.component.html'
})
export class ElementCourseComponent implements OnInit {

  dataList: Array<any>= [];
  courseCode = '';
  courseName = '';
  resType = '1';
  resTypeData: any;
  strType = '';
  strTypeData = courseData;
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
    total: 0
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private pageBusinessService: PageBusinessService) {
  }

  ngOnInit() {
    if (this.resTypeData !== '') {
      this.resType = this.resTypeData;
    }
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



  getList() {
    const that = this;
    let param ;
    if (this.strType !== '') {
       param = {
        courseCode: this.courseCode,
        courseName: this.courseName,
        resType: this.resType,
        page: this.options.page,
        rows:  this.options.rows,
         strType: this.strType
      };
    } else {
       param = {
        courseCode: this.courseCode,
        courseName: this.courseName,
        resType: this.resType,
        page: this.options.page,
        rows:  this.options.rows,
      };
    }
    this.pageBusinessService.getCouseList(param, function(data){
      if (data.data.length > 0) {
        that.dataList =  data.data;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    this.options.page = 1;
    this.courseCode = '';
    this.courseName = '';
    this.strType = '';
    this.getList();
  }

  ok(): void {
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
