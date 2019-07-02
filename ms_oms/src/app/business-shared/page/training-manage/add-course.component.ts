import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {CourseListComponent} from './course-list.component';
@Component({
  selector: 'c-add-course',
  templateUrl: './add-course.component.html'
})
export class AddCourseComponent implements OnInit, OnDestroy {
  saveCourseForm: FormGroup;
  CourseTempData: any;
  pageSaveModal: any;
  CourseTempType: any;
  planCode: any;
  dateNum: any;
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
    const course = new FormControl('', Validators.compose([Validators.required]));
    const num = new FormControl('', Validators.compose([Validators.required]));
    this.saveCourseForm = this.formBuilder.group({
      courseCode: course,
      sort: num,
    });
  }
  ngOnInit() {
    if (this.CourseTempType === 'add') {
      this.saveCourseForm.patchValue({
        sort: this.CourseTempData.length + 1,
      });
    } else {
      this.saveCourseForm.patchValue({
        sort: this.CourseTempData.sort,
        courseCode: this.CourseTempData.courseCode
      });
    }

  }
  ok() {
    const that = this;
    let param = {};
    if (this.saveCourseForm.valid) {
      if (that.CourseTempType === 'add') {
         param = {
          planCode: this.planCode,
          courseCode: this.saveCourseForm.get('courseCode').value,
          dateNum: this.dateNum,
          sort: this.saveCourseForm.get('sort').value};
      } else {
         param = {
          courseCode: this.saveCourseForm.get('courseCode').value,
          dateNum: this.CourseTempData.dateNum,
          planCode: this.planCode,
          sort: this.saveCourseForm.get('sort').value,
          id : this.CourseTempData.id,
           create: this.CourseTempData.create
         };
      }
      this.pageBusinessService.editCourseToPlan(param, function(data){
        if (data.success) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存课程成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        }
      });
    }else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }
  courseList() {
    const that = this;
    this.pageSaveModal = this.ngbModalService.open(CourseListComponent, {size: 'lg'});
    this.pageSaveModal.result.then((result) => {
      that.saveCourseForm.patchValue({
        courseCode: result,
      });
    }, (reason) => {
    });
  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }


  ngOnDestroy() {
  }
}
