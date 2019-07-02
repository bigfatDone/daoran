import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {number} from '../../shared/custom-validator/number/number';
import {PageBusinessService} from '../../business-service/page/page-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {pageEleAttr, pageEleTypeModal, pageGenre, pageResType} from '../../global-constant';
import { ProgramAddComponent } from './program-add.component';

@Component({
  selector: 'c-program-confirSave',
  templateUrl: './program-confirSave.component.html',
  styleUrls: ['./program-confirSave.component.scss']
})
export class ProgramConfirSaveComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              // private elementSaveComponent: ElementSaveComponent,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    // this.confirSaveELeForm = this.formBuilder.group({
    // });
  }

  eleTypes: Array<any>= [pageGenre[0]];
  eleType: any;
  oData: any = "";
  dynrecsData: any = "";
  ngOnInit() {
    this.dynrecsData = this.oData;
  }
  /**
   * 上传
   */
  ok(): void {
    this.activeModal.dismiss({ status: 'closed' });
    this.activeModal.close();
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.close();
  }
}
