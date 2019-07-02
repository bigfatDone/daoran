import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { DepartmentBusinessService } from '../../business-service/department/department-business.service';

@Component({
  selector: 'c-job-save',
  templateUrl: './job-save.component.html'
})
export class JobSaveComponent implements OnInit{

  saveJobForm: FormGroup;
  modalData: any;
  title: any;
  companyList:Array<any>=[];
  departmentList:Array<any>=[];
  cName: any = "";
  dName: any = "";
  jName: any = "";

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private departmentBusinessService: DepartmentBusinessService,
              private formBuilder: FormBuilder) {
    const cnameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const dnameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const jnameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    this.saveJobForm = this.formBuilder.group({
      cName: cnameFc,
      dName: dnameFc,
      jName: jnameFc
    });
  }

  ngOnInit() {
    this.getCompanyList();
    if (this.modalData && this.modalData.id != 0) {
      this.saveJobForm.patchValue({
        cName: this.modalData.cid,
        dName: this.modalData.did,
        jName: this.modalData.name,
      });
    }
  }

  getCompanyList() {
    let param = {type: 1};
    let that = this;
    this.departmentBusinessService.getAllList(param, function(data){
      if (data.obj) {
        that.companyList = data.obj;
        if (that.modalData && that.modalData.id != 0) {
          that.cName = that.modalData.cid;
          that.getDepartmentList();
        }
      }else {
      }
    });
  }

  getDepartmentList() {
    let param = {type: 2, id: this.saveJobForm.controls['cName'].value};
    let that = this;
    this.departmentBusinessService.getAllList(param, function(data){
      if (data.obj) {
        that.departmentList = data.obj;
        if (that.modalData && that.modalData.id != 0) {
          that.dName = that.modalData.did;
        }
      }else {
      }
    });
  }

  /**
   * 上传
   */
  ok(): void {
    if (this.saveJobForm.valid) {
      let saveParam: any;
      saveParam = {
        name: this.saveJobForm.controls['jName'].value,
        departmentId: this.saveJobForm.controls['dName'].value
      };
      if (this.modalData && this.modalData.id != 0) {
        saveParam.id = this.modalData.id;
      }
      let that = this;
      this.departmentBusinessService.saveJob(saveParam, function (data) {
        that.close();
      });
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
