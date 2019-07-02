import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { DepartmentBusinessService } from '../../business-service/department/department-business.service';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';

@Component({
  selector: 'c-company-save',
  templateUrl: './company-save.component.html'
})
export class CompanySaveComponent implements OnInit{

  saveCompanyForm: FormGroup;
  modalData: any;
  title: any;
  isNew: boolean = false;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private departmentBusinessService: DepartmentBusinessService) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    this.saveCompanyForm = this.formBuilder.group({
      cName: nameFc
    });
  }

  ngOnInit() {
    if (this.modalData && this.modalData.id != 0) {
      this.saveCompanyForm.patchValue({
        cName: this.modalData.name,
      });
    }
  }

  ok(): void {
    if (this.saveCompanyForm.valid) {
      let saveParam: any;
      saveParam = {
        name: this.saveCompanyForm.controls['cName'].value
      };
      if (this.modalData && this.modalData.id != 0) {
        saveParam.id = this.modalData.id;
      }
      let that = this;
      this.departmentBusinessService.saveCompany(saveParam,function(data){
        that.close();
      });
    }

  }

  close() {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
