import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {ConfirmConfig} from '../../shared/modal/modal-model';

@Component({
  selector: 'c-add-entry-kindvalue',
  templateUrl: './add-entry-kindvalue.component.html'
})
export class AddEntryKindvalueComponent implements OnInit, OnDestroy {

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
    const selectDetailIndexFc = new FormControl('');
    const sLevel1ValueFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const sLevel1ValueCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(4)]));

    this.addOrEditForm = this.formBuilder.group({
      sLevel1Value: sLevel1ValueFc,
      sLevel1ValueCode: sLevel1ValueCodeFc,
      selectIndex: selectIndexFc,
      selectDetailIndex: selectDetailIndexFc,
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
      this.addOrEditForm.controls['sLevel1ValueCode'].disable();
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

  slevel1DetailList: Array<any> = [];
  getSlevel1Detail (sLevel1Code) {
    let that = this;
    let param = {
      sLevel1Code: sLevel1Code
    };
    that.entryBusinessService.getSlevel1DetailService(param, function(data){
      if (data.sleve1Valuelist !== null && data.sleve1Valuelist.length > 0) {
        that.slevel1DetailList = data.sleve1Valuelist;
      } else {
        that.slevel1DetailList = [];
      }
    });
  }

  sLevel1: String = ''; // 分类名
  sLevel1Code: String = ''; // 分类编码
  selectChange () {
    let that = this;
    let selectIndex = this.addOrEditForm.controls['selectIndex'].value;
    if (selectIndex !== '') {
      /*that.addOrEditForm.patchValue({
        entryName: that.slevel1List[selectIndex].value,
        entryCode: that.slevel1List[selectIndex].code
      });*/
      that.sLevel1 = that.slevel1List[selectIndex].value;
      that.sLevel1Code = that.slevel1List[selectIndex].code;
      that.getSlevel1Detail(that.sLevel1Code);
    } else {
      that.addOrEditForm.patchValue({
        sLevel1Value: '',
        sLevel1ValueCode: '',
        selectDetailIndex: ''
      });
      that.slevel1DetailList = [];
      that.sLevel1 = '';
      that.sLevel1Code = '';
    }
  }

  sLevelValueSource: String = ''; // 原分类值名称
  sLevelValueCodeSource: String = ''; // 原分类值编码
  selectDetailChange () {
    let that = this;
    let selectDetailIndex = this.addOrEditForm.controls['selectDetailIndex'].value;
    if (selectDetailIndex !== '') {
      that.addOrEditForm.patchValue({
        sLevel1Value: that.slevel1DetailList[selectDetailIndex].code,
        sLevel1ValueCode: that.slevel1DetailList[selectDetailIndex].value
      });
      that.sLevelValueSource = that.slevel1DetailList[selectDetailIndex].code;
      that.sLevelValueCodeSource = that.slevel1DetailList[selectDetailIndex].value;
    } else {
      that.addOrEditForm.patchValue({
        sLevel1Value: '',
        sLevel1ValueCode: ''
      });
      that.sLevelValueSource = '';
      that.sLevelValueCodeSource = '';
    }
  }

  ok(): void {
    let that = this;
    let sLevel1Value = that.addOrEditForm.controls['sLevel1Value'].value;
    let sLevel1ValueCode = that.addOrEditForm.controls['sLevel1ValueCode'].value;
    if (sLevel1Value === '' || sLevel1ValueCode === '' || that.sLevel1Code === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      return;
    }
    let reg = /^[a-z]{1,4}$/;
    if (!reg.test(sLevel1ValueCode)) {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '分类值编码格式不正确,4位小写英文字母!', 3000));
      return;
    }
    if (that.modalType === 'add') {
      let param = {
        sLevel1: that.sLevel1,
        sLevel1Code: that.sLevel1Code,
        sLevel1Value: sLevel1Value,
        sLevel1ValueCode: sLevel1ValueCode,
      };
      const confirmCfg = new ConfirmConfig('您确定要新增此条记录吗？新增后将无法修改分类值编码。');
      this.modalService.confirm(confirmCfg).then((result) => {
        that.entryBusinessService.addLevelValuelService(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '新增成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }, (reason) => {
      });
    } else if (that.modalType === 'edit') {
      let param = {
        sLevel1: that.sLevel1,
        sLevel1Code: that.sLevel1Code,
        sLevel1Value: sLevel1Value,
        sLevel1ValueCode: sLevel1ValueCode,
        sLevelValueSource: that.sLevelValueSource,
        sLevelValueCodeSource: that.sLevelValueCodeSource,
      };
      this.entryBusinessService.editLevelValueService(param, function(data){
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
