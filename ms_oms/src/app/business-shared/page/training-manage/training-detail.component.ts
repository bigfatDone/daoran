import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import {Router, ActivatedRoute} from '@angular/router';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../shared/modal/modal-model';
import {AddCourseComponent} from './add-course.component';
import {CourseUploadComponent} from './course-upload.component';
@Component({
  selector: 'c-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailSaveComponent implements OnInit, OnDestroy {
  params = {
    planName: '',
    day: '',
    planCode: '',
    create: '',
    data: {}
  };
  courseList = [];
  pageSaveModal: any;

  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,

  ) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.params.planName = queryParams.planName;
      this.params.day = queryParams.day;
      this.params.planCode = queryParams.planCode;
      this.params.create = queryParams.create;
      this.appService.titleEventEmitter.emit('训练详情');
    });

  }
  ngOnInit() {
    this.getCourseList();
  }
  getCourseList() {
    const that = this;
    const param = {
      planCode: this.params.planCode
    };
    this.pageBusinessService.getListPlanCourseEntity(param, function(data){
      if (data.data.length > 0) {
        that.courseList =  data.data;
      } else {
        that.courseList = [];
      }
    });
  }
  addCourse(data, daynum) {
    const that = this;
    if (data === null) {
      data = [];
    }
    this.pageSaveModal = this.ngbModalService.open(AddCourseComponent, {size: 'sm'});
    this.pageSaveModal.componentInstance.CourseTempData = data;
    this.pageSaveModal.componentInstance.CourseTempType = 'add';
    this.pageSaveModal.componentInstance.planCode = that.params.planCode;
    this.pageSaveModal.componentInstance.dateNum = daynum;
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      this.getCourseList();
    });
  }
  close() {
    this.router.navigate(['/app/page/trainingList'], {});
  }
  edit(data) {
    const that = this;
    this.pageSaveModal = this.ngbModalService.open(AddCourseComponent, {size: 'sm'});
    this.pageSaveModal.componentInstance.CourseTempData = data;
    this.pageSaveModal.componentInstance.CourseTempType = 'edit';
    this.pageSaveModal.componentInstance.planCode = that.params.planCode;
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      this.getCourseList();
    });
  }

  del(id) {
    const that = this;
    const param = {
      id: id
    };
    this.pageBusinessService.delCourseToPlan(param, function(data){
      if (data.success) {
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
        that.toastService.toast(toastCfg);
        that.getCourseList();
      }
    });
  }
  infundeRes() {
    this.pageSaveModal = this.ngbModalService.open(CourseUploadComponent, {size: 'lg'});
    this.pageSaveModal.componentInstance.planCode = this.params.planCode;
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      this.getCourseList();
    });

  }
  ngOnDestroy() {

  }
}
