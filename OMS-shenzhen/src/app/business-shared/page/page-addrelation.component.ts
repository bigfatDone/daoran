import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {pageResSelectComponent} from './page-res-select.component';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';
import {ElementConfirRelateComponent} from './element-confirRelate.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'c-page-addrelation',
  templateUrl: './page-addrelation.component.html',
  styleUrls: ['./page-addrelation.component.scss']
})
export class PageAddrelationComponent implements OnInit, OnDestroy {

  oData: any = {};
  addForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
  ) {
    const pageIdFc = new FormControl('', Validators.compose([Validators.required]));
    const partTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const layoutSeqFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(999), CustomValidators.number]));


    this.addForm = this.formBuilder.group({
      pageId: pageIdFc,
      partType: partTypeFc,
      layoutSeq: layoutSeqFc,
    });
  }

  partTypeList: Array<any> = [
    {type: 'video', name: '小视频分区'},
    {type: 'pagerec', name: '页面分区'},
    {type: 'dynrec', name: '轮播分区'},
    {type: 'layrec', name: '平铺分区'},
    {type: 'extrec', name: '扩展分区 '},
  ];

  partTypeChange () {
    // let partType = this.addForm.controls['partType'].value;
    // let pageId = this.addForm.controls['pageId'].value;
    // console.log(partType);
    // console.log(pageId);
  }

  template: String = '';
  pageName: String = '';
  partIdFc: String = '';
  partTypeFc: String = '';
  layoutSeqFc: String = '';
  msgFlag: String = '';
  opFlag: String = ''
  showThisPage () {
    let that = this;
    this.pageAddModal = this.ngbModalService.open(pageResSelectComponent, {size: 'lg'});
    this.pageAddModal.componentInstance.oData = this.oData;
    this.pageAddModal.componentInstance.checkAllBox = false;
    this.pageAddModal.result.then((result) => {
      // t.pageId = result.pageId;
      that.pageName = result.alias;
      if (result.template !== '') {
        that.template = environment.imgApi + result.template;
      } else {
        that.template = result.template;
      }
      that.partIdFc = result.pageId;
      that.addForm.patchValue({
        pageId: result.pageId,
      });
    }, (reason) => {
      // that.defaultList();
    });
  }

  ngOnInit() {
   // console.log(this.oData);
  }

  pageAddModal: any = null;
  confirRetateData: any = "";
  ngOnDestroy() {
    if (this.pageAddModal !== null) {
      this.pageAddModal.close();
    }
  }
  getListResDetail ( ) {
    let that = this;
    let param = {
      pageId: that.partIdFc,
      partType: this.addForm.controls['partType'].value,
      layoutSeq: this.addForm.controls['layoutSeq'].value,
    };
    if (that.partIdFc === '' || this.addForm.controls['partType'].value === '' || this.addForm.controls['layoutSeq'].value === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请把数据添加完整', 2000);
      that.toastService.toast(toastCfg);
      return;
    }
    this.pageBusinessService.getPartRelate(param, function(data){
        that.confirRetateData = data.obj;
        that.msgFlag = data.msg;
      if (data.msg === "1" ) {
        that.pageAddModal = that.ngbModalService.open(ElementConfirRelateComponent, {size: 'sm'});
        that.pageAddModal.componentInstance.oData = that.confirRetateData;
        that.pageAddModal.result.then((result) => {
          that.opFlag = result;
          that.ok();
        }, (reason) => {});
      }else if (data.msg === "2" ) {
        that.ok ();
      }
    });
  }

  ok () {
    let that = this;
    let param = {
      op: "1",
      pageId: this.addForm.controls['pageId'].value,
      partType: this.addForm.controls['partType'].value,
      layoutSeq: this.addForm.controls['layoutSeq'].value,
      elementId: this.oData.elementId,
    };
    if (that.msgFlag == "1" && that.opFlag == "2"){
      param.op = "2";
    }
    if (this.addForm.valid) {
      this.pageBusinessService.partElementSaveService(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '添加成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请将信息填写完整!', 2000);
      that.toastService.toast(toastCfg);
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
