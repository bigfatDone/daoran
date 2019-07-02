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
import { ElementSaveComponent } from './element-save.component';

@Component({
  selector: 'c-element-confirRelate',
  templateUrl: './element-confirRelate.component.html',
  styleUrls: ['./element-confirRelate.component.scss']
})
export class ElementConfirRelateComponent implements OnInit {

  confirRelateELeForm: FormGroup;
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    const chooseFc = new FormControl('', Validators.compose([Validators.required]));
    this.confirRelateELeForm = this.formBuilder.group({
      choose: chooseFc,
    });
  }
  eleType: any;
  oData: any = "";
  dynrecsData: any = "";
  chooseNum: string="";
  ngOnInit() {
    this.confirRelateELeForm.patchValue({
      choose: 2,
    })
    this.dynrecsData = this.oData;
  }
  /**
   * 上传
   */
  ok(): void {
    this.chooseNum = this.confirRelateELeForm.controls["choose"].value,
    this.activeModal.close(this.chooseNum);
  }

  /**
   * 关闭
   */
  close(): void {
    // this.activeModal.close();
    this.activeModal.dismiss({ status: 'closed' });
  }
}
