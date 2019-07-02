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
import {Router} from '@angular/router';

@Component({
  selector: 'c-element-confirSave',
  templateUrl: './element-confirSave.component.html',
  styleUrls: ['./element-confirSave.component.scss']
})
export class ElementConfirSaveComponent implements OnInit {

  confirSaveELeForm: FormGroup;
  drawFlag = true;
  windowUrl:any;
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private pageBusinessService: PageBusinessService,
              private commonBusinessService: CommonBusinessService,
              // private elementSaveComponent: ElementSaveComponent,
              private toastService: ToastService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.confirSaveELeForm = this.formBuilder.group({
    });
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/elementList") >= 0 ) {
      this.drawFlag = false;
    }
  }

  eleTypes: Array<any>= [pageGenre[0]];
  isHave: Array<any>= [{type: 'yes', name: '保存至历史运营元素'}];
  eleType: any;
  oData: any = "";
  hisFlag = false;
  dynrecsData: any = "";
  ngOnInit() {
    this.dynrecsData = this.oData.oData;
    let ET = this.oData.eleType;
    if ((ET === 'plist' || ET === 'vlist' || ET === 'res' || ET === 'album') && (ET !== this.oData.detailData.eleType || this.oData.eleValue !== this.oData.detailData.eleValue)) {
      this.hisFlag = true;
    }
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
    this.getCheck();
    this.activeModal.close(this.str);
  }

  /**
   * 关闭
   */
  close(): void {
    // this.activeModal.close();
    this.activeModal.dismiss({ status: 'closed' });
  }
}
