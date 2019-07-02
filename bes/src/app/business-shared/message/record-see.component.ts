import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {MessageBusinessService} from '../../business-service/message/message-business.service';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';


@Component({
  selector: 'c-record-see',
  templateUrl: './record-see.component.html'
})
export class RecordSeeComponent implements OnInit {

  seeRecordForm: FormGroup;

  modalData: any = '';

  projects: Array<any>= [];
  itemData: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private messageBusinessService: MessageBusinessService,
  ) {
    const SysIDFc = new FormControl('', Validators.compose([Validators.required]));
    const LoginIPFc = new FormControl('', Validators.compose([Validators.required]));
    const UserCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const UserNameFc = new FormControl('', Validators.compose([Validators.required]));
    const OperationTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const OperationFc = new FormControl('', Validators.compose([Validators.required]));
    const CreateDateFc = new FormControl('', Validators.compose([Validators.required]));
    this.seeRecordForm = this.formBuilder.group({
      SysID: SysIDFc,
      LoginIP: LoginIPFc,
      UserCode: UserCodeFc,
      UserName: UserNameFc,
      OperationType: OperationTypeFc,
      Operation: OperationFc,
      CreateDate: CreateDateFc,
    });
  }

  styleData: Array<any> = [{type: 0, value: '按次数' }, {type: 1, value: '按金币' }];
  freshStyleData: Array<any> = [{type: 0, value: '不刷新' }, {type: 1, value: '按天刷新' }, {type: 2, value: '订购按天刷新，未订购不刷新' }, {type: 3, value: '次数累计按天刷新' }];

  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.seeRecordForm.patchValue({
        style: this.styleData[0].type,
        freshStyle: this.freshStyleData[0].type,
      });
    }
  }

  activeData: any;
  getDetail() {
      let that = this;
      this.messageBusinessService.seeUserLogs({LogID: this.modalData.logID}, function(data){
        that.activeData = data;
        that.seeRecordForm.patchValue({
          SysID: data.sysID,
          LoginIP: data.loginIP,
          UserCode: data.userCode,
          UserName: data.userName,
          OperationType: data.operationType,
          Operation: data.operation,
          CreateDate: data.createDateStr,
        });
      });
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
