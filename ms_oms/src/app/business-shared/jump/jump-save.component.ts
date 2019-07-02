import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import {JumpBusinessService} from '../../business-service/jump/jump-business.service';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import { orderRuleWeek, userStatus, timeFrame } from "../../global-constant";
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import {operatingElementCheckComponent} from './operating-element-check.component';
import {operatingAccessidCheckComponent} from './operating-accessid-check.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'c-jump-save',
  templateUrl: './jump-save.component.html',
  styleUrls: ['./jump-save.component.scss'],
})
export class JumpSaveComponent implements OnInit, OnDestroy {

  addOrEditJumpForm: FormGroup;
  jumpSaveModal: any = null;
  modalData: any = null;
  modalType: String = 'add';
  midifyData: any;

  nodeCodeList: Array<any> = [];
  nodeCode: String = ""; // 指定节点编码

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private jumpBusinessService: JumpBusinessService,
              private orderBusinessService: OrderBusinessService,
              private ngbModalService: NgbModal,
              ) {
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const areaCodeFc = new FormControl([], Validators.compose([Validators.required]));
    const userStatusFc = new FormControl('', Validators.compose([Validators.required]));
    const weeksFc = new FormControl([], Validators.compose([Validators.required]));
    //const timeFrameFc = new FormControl([], Validators.compose([Validators.required]));

    this.addOrEditJumpForm = this.formBuilder.group({
      nodeCode: nodeCodeFc,
      projectCode: projectCodeFc,
      provinceCode: provinceCodeFc,
      areaCode: areaCodeFc,
      userStatus: userStatusFc,
      weeks: weeksFc,
      //timeFrame: timeFrameFc,
    });
  }

  productDataToPipe: any;
  provinceDataToPipe: any;

  ngOnInit() {
    let that = this;
    this.getNodeCode({});
    if (this.modalType === 'modify') {
      this.addOrEditJumpForm.controls["provinceCode"].disable();
      let weekArr = (this.midifyData.weeks).split(',');
      let weekIn = [];
      for (let i of weekArr) {
        weekIn.push(parseInt(i));
      }
      let timesArr = (this.midifyData.times).split(',');
      let hash    = {};
      timesArr.forEach( i => {
        hash[i] = true;
      });
      that.myOptions2.forEach(item => {
        let judge = hash[item.name] || hash[item.id] || false;
        judge ? item.checkState = true : item.checkState = false;
      });
      if (hash[24]) {
        that.myOptions2.forEach(item => {
          if (item.id != 24) {
            item.disabled = true;
          }
        });
      }
      this.addOrEditJumpForm.patchValue({
        weeks: weekIn,
        //timeFrame: timesIn,
        userStatus: this.midifyData.userStatus,
        // provinceCode: this.midifyData.provinceCode,
      });
      this.accessName = this.midifyData.accessId;
      this.accessIds = this.midifyData.accessId;
      this.elementName = this.midifyData.elementId;
      this.elementId = this.midifyData.elementId;
      this.nodeCodeChange();
      this.provinceChange(null, 'modify');
    }
    this.productDataToPipe = {
      type: 'product',
      data: this.modalData.productData
    };
    this.provinceDataToPipe = {
      type: 'province',
      data: this.modalData.provinceData
    };
  }

  ngOnDestroy() {
    if (this.jumpSaveModal != null) {
      this.jumpSaveModal.close();
    }
    this.myOptions2.forEach(item => {
      item.disabled = false;
      item.checkState = false;
    });
  }

  elementCodeData: any = {}; // 元素编码
  elementName: String = ''; // 元素编码
  elementId: String = ''; // 元素编码

  // showThisEleModal: any = null;
  showThisEle() {
    this.jumpSaveModal = this.ngbModalService.open(operatingElementCheckComponent, {size: 'lg'});
    this.jumpSaveModal.componentInstance.checkAllBox = false;
    this.jumpSaveModal.result.then((result) => {
      this.elementCodeData = result; // 元素编码
      this.elementName = result.alias; // 元素编码
      this.elementId = result.elementId; // 元素编码
    }, (reason) => {
    });
  }

  accessIdData: any = {};
  accessName: String = '';
  accessIds: String = '';
  // showThisAccessIdModal: any = null;
  showThisAccessId() {
    this.jumpSaveModal = this.ngbModalService.open(operatingAccessidCheckComponent, {size: 'lg'});
    if (this.modalType === 'modify') {
      this.jumpSaveModal.componentInstance.checkAllBox = false;
    } else {
      this.jumpSaveModal.componentInstance.checkAllBox = true;
    }
    this.jumpSaveModal.result.then((result) => {
      this.accessIdData = result; // 元素编码
      // this.accessId = this.accessIdData.alias;
      this.accessName = '';
      this.accessIds = '';
      if (this.modalType === 'modify') {
        this.accessName = result.sEntryName;
        this.accessIds = result.sAccessId;
      } else if (this.modalType === 'add') {
        this.accessIdData.forEach((el, el_index) => {
          this.accessName += el.sEntryName + ',';
          this.accessIds += el.sAccessId + ',';
        });
        this.accessName = this.accessName.slice(0, this.accessName.length - 1);
        this.accessIds = this.accessIds.slice(0, this.accessIds.length - 1);
      }
    }, (reason) => {
    });
  }

  // optionsModel: number[] = [];
  myOptions: IMultiSelectOption[] = [];
  myTexts: IMultiSelectTexts = {
    defaultTitle: "选择星期"
  };
  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 8,
  };

  myOptions2 = timeFrame.slice(0); // 处理下拉多选数据-星期
  timeChange (e, i){
    let el = e.target;
    let that = this;
    if(el.value == 24){
      that.myOptions2[i].checkState = el.checked;
      if(el.checked){
        that.myOptions2.forEach(item => {
          if(item.id != 24){
            item.disabled = true;
            item.checkState = false;
          }
        });
      }else {
        that.myOptions2.forEach(item => {
          if(item.id != 24){
            item.disabled = false;
          }
        });
      }
    }else{
      that.myOptions2[i].checkState = el.checked;
    }
  }
  /*myOptions2: IMultiSelectOption[] = [];
  myTexts2: IMultiSelectTexts = {
    defaultTitle: "选择时段"
  };*/
  mySettings2: IMultiSelectSettings = {
    dynamicTitleMaxItems: 25,
  };

  myOptions3: IMultiSelectOption[] = [];
  myTexts3: IMultiSelectTexts = {
    defaultTitle: "请选择区域"
  };
  mySettings3: IMultiSelectSettings = {
    dynamicTitleMaxItems: 20,
    displayAllSelectedText: true
  };

  rightSearchCond1: Array<any>= [];
  rightSearchCond2: Array<any>= [];
  rightSearchCond3: Array<any>= [];
  onSearchChange(e, type) {
    if (type === 'weeks') {
      this.rightSearchCond1 = e;
    } else if (type === 'timeframe') {
      this.rightSearchCond2 = e;
    } else if (type === 'area') {
      this.rightSearchCond3 = e;
    }
  }

  // citysList: Array<any> = [];
  // cityTip: String = '请先选择省份';

  provinceChange (provinceCodeIn, type) {
    let that = this;
    if (provinceCodeIn) {
      that.addOrEditJumpForm.patchValue({
        provinceCode: provinceCodeIn.id
      });
    }
    let provinceCode;
    if (type === 'modify') {
      provinceCode = this.midifyData.provinceCode;
    } else {
      provinceCode = this.addOrEditJumpForm.controls['provinceCode'].value;
    }
    if (provinceCode === '') return;
    this.jumpBusinessService.getCitysService({provinceCode: provinceCode}, function(data){
      that.addOrEditJumpForm.patchValue({
        areaCode: []
      });
      if (data !== null) {
        if (data.length > 0) {
          // that.citysList = data;
          let areaArr = [];
          areaArr.push({id: 'all', name: '全部'});
          for (let i of data) {
            areaArr.push({id: i.sAreaCode, name: i.sAreaName});
          }
          areaArr.push({id: 'else', name: '其他'});
          that.myTexts3 = {
            defaultTitle: "请选择区域"
          };
          that.myOptions3 = areaArr;
        } else {
          that.myTexts3 = {
            defaultTitle: "请选择区域"
          };
          that.myOptions3 = [{id: 'all', name: '全部'}, {id: 'else', name: '其他'}];
          // that.cityTip = '该省份暂无区域数据';
        }
      } else {
        that.myTexts3 = {
          defaultTitle: "请选择区域"
        };
        that.myOptions3 = [{id: 'all', name: '全部'}, {id: 'else', name: '其他'}];
        // that.cityTip = '该省份暂无区域数据';
      }
      // if (that.modalType === 'modify' && type === 'set') {
      if (that.modalType === 'modify' ) {
        let areas = (that.midifyData.areas).split(",");
        that.addOrEditJumpForm.patchValue({
          areaCode: areas
        });
      }
    });
  }

  projectCodeList: Array<any> = [];
  provinceList: Array<any> = [];

  nodeCodeChange () {
    let nodeCode = '';
    this.projectCodeList = [];
    this.provinceList = [];
    this.myOptions3 = [];
    this.myTexts3 = {
      defaultTitle: "请先选择省份"
    };
    if (this.modalType === 'modify') {
      nodeCode = this.midifyData.itemCode;
    } else if (this.modalType === 'add') {
      nodeCode = this.addOrEditJumpForm.controls['nodeCode'].value;
    }
    this.addOrEditJumpForm.patchValue({
      provinceCode: '',
      projectCode: '',
    })
    this.getpri();
  }
  getPproAll() {
    this.projectCodeList = [];
    this.addOrEditJumpForm.patchValue({
      projectCode: '',
    })
    this.getpro();
    this.provinceChange(null, null);
  }

  getpro(){
    let that = this;
    let param = {
      itemCode: this.addOrEditJumpForm.getRawValue().nodeCode,
      provinceCode: this.addOrEditJumpForm.getRawValue().provinceCode,
    };
    this.orderBusinessService.projectProvinceProduct(param, function(data){
      if (data) {
        that.projectCodeList = data;
      }
    });
  }

  getpri(){
    let that = this;
    let param: any = {};
    if (this.modalType === 'modify') {
      param.itemCode = this.midifyData.itemCode;

    } else {
      param.itemCode = this.addOrEditJumpForm.getRawValue().nodeCode;
    }
    this.orderBusinessService.projectProvince(param, function(data){
      if (data) {
        that.provinceList = data;
      } else {
        // that.areas = [];
      }
    });
  }

  modifyFirst: Boolean = true;
  getNodeDetail (param) {
    let that = this;
    this.jumpBusinessService.getNodeDetailApiServce(param, function(data){
      that.projectCodeList = data.projectCodeList;
      that.addOrEditJumpForm.patchValue({
        projectCode: ''
        // projectCode: that.projectCodeList[0].id
      });
      that.provinceList = data.provinceList;
      if (that.modalType === 'modify' && that.modifyFirst) {
        // that.addOrEditJumpForm.patchValue({
        //   projectCode: that.midifyData.provinceCode
        // });
        let obj = {id: that.midifyData.provinceCode, name: that.midifyData.provinceName};
        that.provinceChange(obj, 'set');
        that.modifyFirst = false;
      }
    });
  }

  userStatusList: Array<any> = [];
   getNodeCode (param) { // 指定节点
    let that = this;
    let myOptions = []; // 处理下拉多选数据-星期
    for (let i of orderRuleWeek) {
      myOptions.push({id: i.value, name: i.name});
    }
    that.myOptions = myOptions;

    that.userStatusList = userStatus;
     this.addOrEditJumpForm.patchValue({
       userStatus: that.userStatusList[4].value,
     });
    this.jumpBusinessService.projectAuth(param, function(data){
      if (data !== null) {
        if (data.length > 0) {
          that.nodeCodeList = data;
        } else {
          that.nodeCodeList = [];
        }
      }
    });
  }

  clearEle () {
    this.elementName = ''; // 元素编码
    this.elementId = ''; // 元素编码
  }

  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    let areaCode = (this.addOrEditJumpForm.controls["areaCode"].value).join();
    if (areaCode.indexOf('all') !== -1 && areaCode.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }

    let weeks = (this.addOrEditJumpForm.controls["weeks"].value).join();
    if (weeks.indexOf('8') !== -1 && weeks.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '星期：每天不能与单一星期同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    /*let timeFrame = (this.addOrEditJumpForm.controls["timeFrame"].value).join();
    if (timeFrame.indexOf('24') !== -1 && timeFrame.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '时段：全天不能与单一时段同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }*/
    let times = [];
    that.myOptions2.forEach(item => {
      if(item.checkState){
        times.push(item.id);
      }
    });
    if (this.modalType === 'add') {
      if (this.addOrEditJumpForm.valid && this.accessIds !== '' && times.length > 0) {
        param =  {
          itemCode: this.addOrEditJumpForm.controls["nodeCode"].value,
          projectCode: this.addOrEditJumpForm.controls["projectCode"].value,
          provinceCode: this.addOrEditJumpForm.controls["provinceCode"].value,
          areas: areaCode,
          weeks: weeks,
          times: times.toString(),
          userStatus: this.addOrEditJumpForm.controls["userStatus"].value,
          elementId: this.elementName,
          elementId2: this.elementId,
          accessId: this.accessName,
          accessId2: this.accessIds,
        };
        this.jumpBusinessService.addProductSkipService(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      }
    } else if (this.modalType === 'modify') {
      let provinceCode = this.addOrEditJumpForm.controls["provinceCode"].value;
      let userStatus = this.addOrEditJumpForm.controls["userStatus"].value;
      if (this.accessIds !== '' && areaCode !== '' && weeks !== '' && timeFrame !== '' && userStatus !== '') {
        param =  {
          sId: this.midifyData.id,
          itemCode: this.midifyData.itemCode,
          projectCode: this.midifyData.projectCode,
          provinceCode: this.midifyData.provinceCode,
          areas: areaCode,
          weeks: weeks,
          times: times.toString(),
          userStatus: userStatus,
          elementId: this.elementName,
          elementId2: this.elementId,
          accessId: this.accessName,
          accessId2: this.accessIds,
        };
        this.jumpBusinessService.editProductSkipService(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      }
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
