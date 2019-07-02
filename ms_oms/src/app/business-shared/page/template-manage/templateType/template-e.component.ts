import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../../shared/modal/modal.service';
import { AppService } from '../../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../../shared/toast/toast-model';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../../shared/modal/modal-model';
import { NgbActiveModal, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
@Component({
  selector: 'c-template-e',
  templateUrl: './template-e.component.html',
  styleUrls: ['./../template-list.component.scss']
})
export class TemplateEComponent implements OnInit, OnDestroy {
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
  }
  ngOnInit() {
  }
  ngOnDestroy() {
  }
}
