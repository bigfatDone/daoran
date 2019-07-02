import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { DepartmentBusinessService } from '../../business-service/department/department-business.service';


@Component({
  selector: 'c-department-save',
  templateUrl: './department-save.component.html'
})
export class DepartmentSaveComponent implements OnInit, AfterViewInit {


  saveDepartmentForm: FormGroup;
  modalData: any;
  title: any;
  companyList:Array<any>= [];
  cName: any = "";
  dName: any = "";

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private departmentBusinessService: DepartmentBusinessService,
              private formBuilder: FormBuilder) {
    const cnameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const dnameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));

    this.saveDepartmentForm = this.formBuilder.group({
      cName: cnameFc,
      dName: dnameFc,
    });

    this.getCompanyList();
  }

  ngOnInit() {
    if (this.modalData && this.modalData.id != 0) {
      this.saveDepartmentForm.patchValue({
        cName: this.modalData.cid,
        dName: this.modalData.name,
      });
    }
  }

  ngAfterViewInit() {
  }

  getCompanyList() {
    let param = {type: 1};
    let that = this;
    this.departmentBusinessService.getAllList(param, function(data){
      if (data.obj) {
        that.companyList = data.obj;
        if (that.modalData && that.modalData.cid != 0) {
          that.cName = that.modalData.cid;
        }
      }else {
      }
    });
  }

  ok(): void {
    if (this.saveDepartmentForm.valid) {
      let saveParam: any;
      saveParam = {
        name: this.saveDepartmentForm.controls['dName'].value,
        companyId: this.saveDepartmentForm.controls['cName'].value
      };
      if (this.modalData && this.modalData.id != 0) {
        saveParam.id = this.modalData.id;
      }
      let that = this;
      this.departmentBusinessService.saveDepartment(saveParam, function (data) {
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
