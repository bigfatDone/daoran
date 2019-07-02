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
  selector: 'c-element-confirPic',
  templateUrl: './element-confirPic.component.html',
  styleUrls: ['./element-confirPic.component.scss']
})
export class ElementConfirPicComponent implements OnInit {

  confirSaveELeForm: FormGroup;
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              // private elementSaveComponent: ElementSaveComponent,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
    this.confirSaveELeForm = this.formBuilder.group({
    });
  }

  eleTypes: Array<any>= [pageGenre[0]];
  isHave: Array<any>= [{type: 'yes', name: '是否保存至历史运营元素'}];
  eleType: any;
  oData: any = "";
  dynrecsData: any = "";
  ngOnInit() {
  }

  checkNode($event, index) {
    this.isHave[index].checkState = $event.target.checked;
  }
  str: any = '';
  getCheck() {
    // let str = '';
    this.isHave.forEach( i => {
      if (i.checkState) {
        this.str = i.type;
      }
    });
  }
  /**
   * 上传
   */
  ok(): void {
    this.activeModal.close('yes');
  }

  /**
   * 关闭
   */
  close(): void {
    // this.activeModal.close();
    this.activeModal.close('no');
  }
}
