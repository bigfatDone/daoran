import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';
import {ConfirmConfig} from '../../shared/modal/modal-model';

@Component({
  selector: 'c-add-entry-kind',
  templateUrl: './add-entry-kind.component.html'
})
export class AddEntryKindComponent implements OnInit, OnDestroy {

  addOrEditForm: FormGroup;

  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private entryBusinessService: EntryBusinessService,
  ) {
    const selectIndexFc = new FormControl('');
    const entryNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(8)]));
    const entryCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));

    this.addOrEditForm = this.formBuilder.group({
      entryName: entryNameFc,
      entryCode: entryCodeFc,
      selectIndex: selectIndexFc,
    });
  }

  modalType: String = '';
  modalData: any = {};
  kindList: Array<any> = [0]; // 分类列表

  addOrEditModal: any = null;
  ngOnDestroy() {
    if (this.addOrEditModal != null) {
      this.addOrEditModal.close();
    }
  }
  ngOnInit() {
    this.getKindList();
    this.getSlevel1();
    if (this.modalType === 'edit') {
      this.addOrEditForm.controls['entryCode'].disable();
    }
  }

  getKindList () {
    let that = this;
    let param = {};
    this.entryBusinessService.getKindListService(param, function(data){
      if (data.data.length > 0) {
        that.kindList = data.data;
      } else {
        that.kindList = [];
      }
    });
  }

  slevel1List: Array<any> = []; // 分类
  // pSlevel1: String = '';
  getSlevel1() {
    let that = this;
    this.entryBusinessService.getSlevel1Service({}, function(data){
      if (data.length > 0) {
        that.slevel1List = data;
      } else {
        that.slevel1List = [];
      }
    });
  }

  sLevel1Source: String = ''; // 原分类名
  sLevel1CodeSource: String = ''; // 原分类编码
  selectChange () {
    let that = this;
    let selectIndex = this.addOrEditForm.controls['selectIndex'].value;
    if (selectIndex !== '') {
      that.addOrEditForm.patchValue({
        entryName: that.slevel1List[selectIndex].value,
        entryCode: that.slevel1List[selectIndex].code
      });
      that.sLevel1Source = that.slevel1List[selectIndex].value;
      that.sLevel1CodeSource = that.slevel1List[selectIndex].code;
    } else {
      that.addOrEditForm.patchValue({
        entryName: '',
        entryCode: ''
      });
      that.sLevel1Source = '';
      that.sLevel1CodeSource = '';
    }
  }

  ok(): void {
    let that = this;
    let entryName = that.addOrEditForm.controls['entryName'].value;
    let entryCode = that.addOrEditForm.controls['entryCode'].value;
    if (entryName === '' || entryCode === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      return;
    }
    let reg = /^[a-z]{2}$/;
    if (!reg.test(entryCode)) {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '分类入口编码格式不正确,2位小写英文字母!', 3000));
      return;
    }
    if (that.modalType === 'add') {
      let param = {
        sLevel1: entryName,
        sLevel1Code: entryCode,
      };
      const confirmCfg = new ConfirmConfig('您确定要新增此条记录吗？新增后将无法修改分类编码。');
      this.modalService.confirm(confirmCfg).then((result) => {
        that.entryBusinessService.addLevel1Service(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '新增成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }, (reason) => {
      });
    } else if (that.modalType === 'edit') {
      let param = {
        sLevel1: entryName,
        sLevel1Code: entryCode,
        sLevel1CodeSource: that.sLevel1CodeSource,
        sLevel1Source: that.sLevel1Source,
      };
      this.entryBusinessService.editLevel1Service(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '修改成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
