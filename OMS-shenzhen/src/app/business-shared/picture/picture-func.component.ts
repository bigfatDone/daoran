import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import { PictureBusinessService } from '../../business-service/picture/picture-business.service';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'c-picture-func',
  templateUrl: './picture-func.component.html',
})
export class PctureFuncComponent implements OnInit, OnDestroy {
  funcForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private ngbModalService: NgbModal,
    private toastService: ToastService,
    private modalService: ModalService,
    private appService: AppService,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private PictureBusinessService: PictureBusinessService,
  ) {
    const groupNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)]));

    this.funcForm = this.formBuilder.group({
      groupName: groupNameFc,
    });
  }

  groupName: String = 'jjjj';
  modalType: String = '';
  modalTypeName: String = '';
  modalData: any;

  okP () {
    let that = this;
  }

  ngOnInit() {
  }

  // showModal: any;
  ngOnDestroy() {
    // if (this.showModal !== null) {
    //   this.showModal.close();
    // }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
