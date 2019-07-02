import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { carrierAttr, odSysState } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';
import {CustomValidators} from '../../shared/custom-validator/custom-validator';


@Component({
  selector: 'c-active-save',
  templateUrl: './active-save.component.html'
})
export class ActiveSaveComponent implements OnInit {

  saveActiveForm: FormGroup;

  modalData: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  itemData: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private activeBusinessService: ActiveBusinessService,
  ) {
    const actCodeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(14)]));
    const actCodeNodeFc = new FormControl('');
    const actNameFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const beginTimeFc = new FormControl('', Validators.compose([Validators.required]));
    const endTimeFc = new FormControl('', Validators.compose([Validators.required]));
    const styleFc = new FormControl('', Validators.compose([Validators.required]));
    const freshStyleFc = new FormControl('', Validators.compose([Validators.required]));
    const initTimesFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const addTimesFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const initCoinsFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const addCoinsFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const useCoinsFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const forHelpFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const toHelpFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.num]));
    const rmkFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveActiveForm = this.formBuilder.group({
      actCode: actCodeFc,
      actCodeNode: actCodeNodeFc,
      actName: actNameFc,
      itemCode: itemCodeFc,
      nodeCode: nodeCodeFc,
      beginTime: beginTimeFc,
      endTime: endTimeFc,
      style: styleFc,
      freshStyle: freshStyleFc,
      initTimes: initTimesFc,
      addTimes: addTimesFc,
      initCoins: initCoinsFc,
      addCoins: addCoinsFc,
      useCoins: useCoinsFc,
      forHelp: forHelpFc,
      toHelp: toHelpFc,
      rmk: rmkFc,
    });
  }

  styleData: Array<any> = [{type: 0, value: '按次数' }, {type: 1, value: '按金币' }, {type: 2, value: '按奖品' }];
  freshStyleData: Array<any> = [{type: 0, value: '不刷新' }, {type: 1, value: '按天刷新' }, {type: 2, value: '订购按天刷新，未订购不刷新' }, {type: 3, value: '次数累计按天刷新' }];

  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.saveActiveForm.patchValue({
        style: this.styleData[0].type,
        freshStyle: this.freshStyleData[0].type,
        initTimes: 0,
        addTimes: 0,
        initCoins: 0,
        addCoins: 0,
        useCoins: 0,
        forHelp: 0,
        toHelp: 0,
      });
    }
    this.nodedetailAuth();
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

  activeData: any;
  getDetail() {
    if (this.modalData !== '') {
      let that = this;
      this.activeBusinessService.getActiveDetail({actCode: this.modalData.actCode}, function(data){
        that.activeData = data;
        let dateBe = data.beginTimeStr;
        let dateEn = data.endTimeStr;
        let xxxBe = dateBe.split(" ")[0].split("-");
        let xxxEn = dateEn.split(" ")[0].split("-");
        that.saveActiveForm.patchValue({
          nodeCode: data.itemCode,
          actCode: data.actCode,
          actName: data.actName,
          itemCode: data.nodeCode,
          actCodeNode: data.actCodeNode,
          beginTime: {
            "year": parseInt (xxxBe[0]),
            "month": parseInt (xxxBe[1]),
            "day": parseInt (xxxBe[2])
          },
          endTime: {
            "year": parseInt (xxxEn[0]),
            "month": parseInt (xxxEn[1]),
            "day": parseInt (xxxEn[2])
          },
          style: data.style,
          freshStyle: data.freshStyle,
          initTimes: data.initTimes,
          addTimes: data.addTimes,
          initCoins: data.initCoins,
          addCoins: data.addCoins,
          useCoins: data.useCoins,
          forHelp: data.forHelp,
          toHelp: data.toHelp,
          rmk: data.rmk,
        });
        that.saveActiveForm.controls["nodeCode"].disable();
        that.saveActiveForm.controls["itemCode"].disable();
        that.saveActiveForm.controls["actCode"].disable();
        that.getItemList();
      });
    }
  }
  getOthers() {
    this.saveActiveForm.patchValue({
      itemCode: '',
    });
    this.getItemList();
  }
  getItemList() {
    let that = this;
    let param = {itemCode: this.saveActiveForm.getRawValue().nodeCode};
    this.activeBusinessService.getNodeList(param, function(data){
      if (data.length > 0) {
        that.itemData = data;
        if (that.modalData !== '' && that.saveActiveForm.getRawValue().nodeCode === that.activeData.nodeCode) {
          that.saveActiveForm.patchValue({
            itemCode: that.activeData.itemCode,
          });
        }
      } else {
        that.itemData = [];
      }
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
  nodeData:any;
  getNodeByProject() {
    let that = this;
    let param = {itemCode: this.saveActiveForm.getRawValue().nodeCode};
    this.activeBusinessService.getNodeByProject(param, function(data){
      if (data.length > 0) {
        that.nodeData = data;
      } else {
        that.nodeData = [];
      }
    });
  }

  updateProduct() {
    let that = this;
    let param = {projectCode: this.saveActiveForm.getRawValue().projectCode};
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
    this.beData = this.saveActiveForm.getRawValue().beginTime,
    this.enData = this.saveActiveForm.getRawValue().endTime
    if (typeof(this.beData) ==="object" && this.beData !=="" && this.beData !==null ) {
      this.beData = this.beData.year + "-" + this.beData.month + "-" + this.beData.day;
    } else {
      this.beData = '';
    }
    if (typeof(this.enData) ==="object" && this.enData !=="" && this.enData !==null ) {
      this.enData = this.enData.year + "-" + this.enData.month + "-" + this.enData.day;
    } else {
      this.enData = '';
    }
    let param: any = {
      // addFlag: 1,
      actCode: this.saveActiveForm.getRawValue().actCode,
      actCodeNode: this.saveActiveForm.getRawValue().actCodeNode,
      actName: this.saveActiveForm.getRawValue().actName,
      nodeCode: this.saveActiveForm.getRawValue().itemCode,
      itemCode: this.saveActiveForm.getRawValue().nodeCode,
      beginTime: this.beData,
      endTime: this.enData,
      style: this.saveActiveForm.getRawValue().style,
      freshStyle: this.saveActiveForm.getRawValue().freshStyle,
      initTimes: this.saveActiveForm.getRawValue().initTimes,
      addTimes: this.saveActiveForm.getRawValue().addTimes,
      initCoins: this.saveActiveForm.getRawValue().initCoins,
      addCoins: this.saveActiveForm.getRawValue().addCoins,
      useCoins: this.saveActiveForm.getRawValue().useCoins,
      forHelp: this.saveActiveForm.getRawValue().forHelp,
      toHelp: this.saveActiveForm.getRawValue().toHelp,
      rmk: this.saveActiveForm.getRawValue().rmk,
    };
    if (this.saveActiveForm.valid) {
      if (this.modalData !== ''){
        this.activeBusinessService.updateActive(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        this.activeBusinessService.saveActive(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
