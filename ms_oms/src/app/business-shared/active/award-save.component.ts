import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';


@Component({
  selector: 'c-award-save',
  templateUrl: './award-save.component.html'
})
export class AwardSaveComponent implements OnInit {

  saveAwardForm: FormGroup;

  modalData: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  nodeData: Array<any>= [];
  actCodeData: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private activeBusinessService: ActiveBusinessService,
  ) {
    const actCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const actNameFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const prizeNameFc = new FormControl('', Validators.compose([Validators.required]));
    const prizeLevelFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const sendFlagFc = new FormControl('', Validators.compose([Validators.required]));
    const prizeTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const styleFc = new FormControl('', Validators.compose([Validators.required]));
    const startNumFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const numeratorFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const denominatorFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const totalNumFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const leftNumFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const useCoinFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const maxNumFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    this.saveAwardForm = this.formBuilder.group({
      actCode: actCodeFc,
      actName: actNameFc,
      itemCode: itemCodeFc,
      nodeCode: nodeCodeFc,
      prizeName: prizeNameFc,
      prizeLevel: prizeLevelFc,
      sendFlag: sendFlagFc,
      prizeType: prizeTypeFc,
      style: styleFc,
      startNum: startNumFc,
      numerator: numeratorFc,
      denominator: denominatorFc,
      totalNum: totalNumFc,
      leftNum: leftNumFc,
      useCoin: useCoinFc,
      maxNum: maxNumFc,
    });
  }

  styleData: Array<any> = [{type: 0, value: '按概率' }, {type: 1, value: '按产品订购量' }, {type: 2, value: '按奖品需求量' }];
  sendFlagData: Array<any> = [{type: 1, value: '派奖' }, {type: 2, value: '不派奖' }];
  prizeTypeData: Array<any> = [{type: 0, value: '抽奖' }, {type: 1, value: '兑换' }, {type: 2, value: '砍价' }, {type: 3, value: '刮刮卡' }];
  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.saveAwardForm.patchValue({
        sendFlag: this.sendFlagData[0].type,
        prizeType: this.prizeTypeData[0].type,
        style:  this.styleData[0].type,
        startNum: 0,
        numerator: 0,
        denominator: 0,
        totalNum: 0,
        leftNum: 0,
        useCoin: 0,
        maxNum: 0,
      });
    }
    this.saveAwardForm.controls["actName"].disable();
    this.nodedetailAuth();
    // this.getProjects();
    // this.getProvinces();
  }

  nodedetailAuth() {
    let that = this;
    this.activeBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.nodeData = data;
      } else {
        that.nodeData = [];
      }
    });
  }
  getOthers() {
    this.saveAwardForm.patchValue({
      itemCode: '',
      actCode: '',
    });
    this.getItemList();
  }
  getItemList() {
    let that = this;
    let param = {
      itemCode: this.saveAwardForm.getRawValue().nodeCode,
    };
    this.activeBusinessService.getNodeList(param, function(data){
      if (data.length > 0) {
        that.projects = data;
        if (that.modalData !== '' && that.saveAwardForm.getRawValue().nodeCode === that.saveAwardData.nodeCode) {
          that.saveAwardForm.patchValue({
            itemCode: that.saveAwardData.itemCode,
          });
        }
      } else {
        that.projects = [];
      }
    });
  }
  getActCodeList() {
    let that = this;
    let param = {
      itemCode: this.saveAwardForm.getRawValue().nodeCode,
      nodeCode: this.saveAwardForm.getRawValue().itemCode,
    };
    this.activeBusinessService.getActCodeList(param, function(data){
      if (data.length > 0) {
        that.actCodeData = data;
        if (that.modalData !== '' && that.saveAwardForm.getRawValue().nodeCode === that.saveAwardData.nodeCode && that.saveAwardForm.getRawValue().itemCode === that.saveAwardData.itemCode) {
          that.saveAwardForm.patchValue({
            actCode: that.saveAwardData.actCode,
          });
        }
      } else {
        that.actCodeData = [];
      }
    });
  }
  activeName: any ='';
  getActName() {
    let that = this;
    let aCode = this.saveAwardForm.getRawValue().actCode;
    this.actCodeData.forEach(i => {
      if (i.actCode === aCode) {
        this.activeName = i.actName;
      }
    })
    this.saveAwardForm.patchValue({
      actName: that.activeName,
    })
  }
  saveAwardData: any;
  getDetail() {
      let that = this;
      this.activeBusinessService.getAwardDetail({id: this.modalData}, function(data){
        that.saveAwardData = data;
        that.saveAwardForm.patchValue({
          nodeCode: data.itemCode,
          actCode: data.actCode,
          actName: data.actName,
          itemCode: data.nodeCode,
          prizeName: data.prizeName,
          prizeLevel: data.prizeLevel,
          sendFlag: data.sendFlag,
          prizeType: data.prizeType,
          style: data.style,
          startNum: data.startNum,
          numerator: data.numerator,
          denominator: data.denominator,
          totalNum: data.totalNum,
          leftNum: data.leftNum,
          useCoin: data.useCoin,
          maxNum: data.maxNum,
        });
        that.getItemList();
        that.getActCodeList();
        // that.getActName();
      });
  }

  getProjects() {
    let that = this;
    this.activeBusinessService.getProjects(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }
  getNodeByProject() {
    let that = this;
    let param = {itemCode: this.saveAwardForm.getRawValue().itemCode};
    this.activeBusinessService.getNodeByProject(param, function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  updateProduct() {
    let that = this;
    let param = {projectCode: this.saveAwardForm.getRawValue().projectCode};
    // this.activeBusinessService.getProducts(param, function(data){
    //   if (data.length > 0) {
    //     that.products = data;
    //   } else {
    //     that.products = [];
    //   }
    // });
  }

  getProvinces() {
    let that = this;
    // this.activeBusinessService.getProvinces(function(data){
    //   if (data.length > 0) {
    //     that.provinces = data;
    //   } else {
    //     that.provinces = [];
    //   }
    // });
  }

  beData:any;
  enData:any;
  ok(): void {
    let that = this;
    let param: any = {
      actCode: this.saveAwardForm.getRawValue().actCode,
      actName: this.saveAwardForm.getRawValue().actName,
      nodeCode: this.saveAwardForm.getRawValue().itemCode,
      itemCode: this.saveAwardForm.getRawValue().nodeCode,
      prizeName: this.saveAwardForm.getRawValue().prizeName,
      prizeLevel: this.saveAwardForm.getRawValue().prizeLevel,
      sendFlag: this.saveAwardForm.getRawValue().sendFlag,
      prizeType: this.saveAwardForm.getRawValue().prizeType,
      style: this.saveAwardForm.getRawValue().style,
      startNum: this.saveAwardForm.getRawValue().startNum,
      numerator: this.saveAwardForm.getRawValue().numerator,
      denominator: this.saveAwardForm.getRawValue().denominator,
      totalNum: this.saveAwardForm.getRawValue().totalNum,
      leftNum: this.saveAwardForm.getRawValue().leftNum,
      useCoin: this.saveAwardForm.getRawValue().useCoin,
      maxNum: this.saveAwardForm.getRawValue().maxNum,
    };
    if (this.modalData !== '') {
      param.id = that.saveAwardData.id;
    }
    if (this.saveAwardForm.valid) {
      this.activeBusinessService.saveAward(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
