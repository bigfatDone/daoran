import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {CommonBusinessService} from '../../business-service/common/common-business.service';

@Component({
  selector: 'c-page-save',
  templateUrl: './message-see.component.html'
})
export class MessageSeeComponent implements OnInit {

  seeMessageForm: FormGroup;
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    const titleFc = new FormControl('');
    const phoneFc = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(16)]));
    const contentFc = new FormControl('', Validators.compose([Validators.minLength(0),  Validators.maxLength(128)]));
    this.seeMessageForm = this.formBuilder.group({
      titleName: titleFc,
      phoneName: phoneFc,
      contentName: contentFc,
    });
  }
  messageData: any;
  ngOnInit() {
    this.seeMessageForm.patchValue({
      titleName: this.messageData.title,
      phoneName: this.messageData.phone,
      contentName: this.messageData.content
    });
  }


  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
