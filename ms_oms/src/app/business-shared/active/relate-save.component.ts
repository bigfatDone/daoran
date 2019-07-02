import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { carrierAttr, odSysState, orderRuleWeek, timeFrame } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';
import {IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { HttpService } from '../../shared/http/http.service';

@Component({
  selector: 'c-relate-save',
  templateUrl: './relate-save.component.html'
})
export class RelateSaveComponent implements OnInit, OnDestroy {

  saveRelateForm: FormGroup;
  modalData: any = '';
  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;
  itemData: Array<any> = [];
  relateProductData: Array<any>= [];
  priIds: Array<any>= [];
  projectArr: Array<any> = [];
  relationProvinceStr: any;
  relationProjectStr: any;
  editProjectStr: Array<any> = [];
  relateData: any;
  proIds: Array<any>= [];
  appointProduct: any;
  ActCodeData: any;
  relatePriData: Array<any>= [];
  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 25,
  };
  areasTexts: IMultiSelectTexts = {
    defaultTitle: '请先选择区域'
  };
  areasMulData: IMultiSelectOption[] = [{id: 'all', name: '全部'}, {id: 'else', name: '其他'}]; // 区域list
  weekData: IMultiSelectOption[] = [];
  MulTexts: IMultiSelectTexts = {
    defaultTitle: '请选择'
  };
  weeks: Array<any>= orderRuleWeek;
  times: Array<any>= timeFrame;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private activeBusinessService: ActiveBusinessService,
              private httpService: HttpService,
  ) {
    const actCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl([], Validators.compose([Validators.required]));
    const weekFc = new FormControl([], Validators.compose([Validators.required]));

    this.saveRelateForm = this.formBuilder.group({
      actCode: actCodeFc,
      projectCode: projectCodeFc,
      nodeCode: nodeCodeFc,
      itemCode: itemCodeFc,
      area: areaFc,
      week: weekFc,
    });
  }
  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.saveRelateForm.patchValue({state: this.stateData[1].type});
    }
    this.nodedetailAuth();
    this.resetWeeks();

  }
  timeChange (e, i) {
    const el = e.target;
    const that = this;
    that.times.forEach( item =>  item.disabled = false );
    if (el.value === '24') {
      that.times[i].checkState = el.checked;
      if (el.checked) {
        that.times.forEach(item => {
          if (item.id !== '24') {
            item.disabled = true;
            item.checkState = false;
          }
        });
      }else {
        that.times.forEach(item => {
          if (item.id !== '24') {
            item.disabled = false;
          }
        });
      }
    }else {
      that.times[i].checkState = el.checked;
    }
  }
  resetWeeks() {
    this.weekData = [];
    orderRuleWeek.forEach(i => {
      this.weekData.push({id: i.value, name: i.name});
    });
  }
  getArea() {
    const that = this;
    this.areasMulData = [];
    if (this.priIds.length === 1) {
      const param = {provinceCode: that.priIds[0]};
      this.httpService.postFormData('/busi/orderrule/getCitys', param, function (successful, data, res) {
        const newAreasMulData = [{id: 'all', name: '全部'}];
        if (data.obj !== null) {
          data.obj.forEach(i => newAreasMulData.push({id: i.sAreaCode, name: i.sAreaName}));
        }
        newAreasMulData.push({id: 'else', name: '其他'});
        that.areasMulData = newAreasMulData;
      }, function (successful, msg, err) {
      }, false);
    } else {
      that.saveRelateForm.patchValue({area: ['all']});
      that.areasMulData = [{id: 'all', name: '全部'}];
    }
  }
  nodedetailAuth() {
    const that = this;
    this.activeBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }
  getOther() {
    this.saveRelateForm.patchValue({
      actCode: '',
      projectCode: '',
      itemCode: '',
    });
    this.projectArr = [];
    this.relatePriData.forEach(i => {
      i.checkState = false;
    });
    this.relateProductData .forEach(i => {
      i.checkState = false;
    });
    this.getItemList();
  }
  getItemList() {
    const that = this;
    that.itemData = [];
    that.appointProduct = [];
    that.ActCodeData = [];
    that.relatePriData = [];
    that.relateProductData = [];
    const param: any = {
      itemCode: this.saveRelateForm.getRawValue().nodeCode,
    };
    this.activeBusinessService.getNodeList(param, function(data){
      if (data.length > 0) {
        that.itemData = data;
        if (that.modalData !== '' && that.saveRelateForm.getRawValue().nodeCode === that.relateData.itemCode) {
          that.saveRelateForm.patchValue({
            itemCode: that.relateData.nodeCode,
            projectCode: that.relateData.projectCode,
            actCode: that.relateData.actCode
          });
          that.getProjectList();
          that.getActCodeList();
        }
      } else {
        that.itemData = [];
      }
    });
  }
  getProPri () {
    let param: any = {};
    if (this.saveRelateForm.getRawValue().itemCode === '') {
      param = {
        itemCode: this.relateData.itemCode,
        nodeCode: this.relateData.nodeCode
      };
    } else {
      param = {
        nodeCode: this.saveRelateForm.getRawValue().itemCode,
        itemCode: this.saveRelateForm.getRawValue().nodeCode
      };
    }
    this.getProjectList();
    this.getRelatePri(param);
  }
  getProjectList() {
    const that = this;
    let param: any = {};
    if (this.saveRelateForm.getRawValue().itemCode === '') {
      param = {
        itemCode: this.relateData.itemCode,
        nodeCode: this.relateData.nodeCode
      };
    } else {
      param = {
        nodeCode: this.saveRelateForm.getRawValue().itemCode,
        itemCode: this.saveRelateForm.getRawValue().nodeCode
      };
    }
    this.getRelatePri(param);
    this.activeBusinessService.getProjectList(param, function(data){
      if (data !== null) {
        that.appointProduct = data;
        if (that.modalData !== '' && that.saveRelateForm.getRawValue().itemCode === that.relateData.itemCode) {
          that.saveRelateForm.patchValue({
            projectCode: that.relateData.projectCode
          });
        }
      } else {
        that.appointProduct = [];
      }
    });
  }
  getActCodeList() {
    const that = this;
    that.ActCodeData = [];
    let param: any = {};
    if (this.saveRelateForm.getRawValue().itemCode === '') {
      param = {
        itemCode: this.saveRelateForm.getRawValue().nodeCode,
        nodeCode: this.relateData.nodeCode
      };
    } else {
      param = {
        itemCode: this.saveRelateForm.getRawValue().nodeCode,
        nodeCode: this.saveRelateForm.getRawValue().itemCode
      };
    }
    this.activeBusinessService.getActCodeList(param, function(data){
      if (data.length > 0) {
        that.ActCodeData = data;
        if (that.modalData !== '' && that.saveRelateForm.getRawValue().itemCode === that.relateData.nodeCode && that.saveRelateForm.getRawValue().nodeCode === that.relateData.itemCode) {
          that.saveRelateForm.patchValue({
            actCode: that.relateData.actCode
          });
        }
      } else {
        that.ActCodeData = [];
      }
    });
  }
  getRelatePri(param) {
    const that = this;
    if (this.modalData === '') {
      param.nodeCode =  this.saveRelateForm.getRawValue().itemCode;
    }
    that.relatePriData = [];
    this.activeBusinessService.getRelatePri(param, function(data){
      if (data.length > 0) {
        that.relatePriData = data;
        if (that.modalData !== '' &&  that.saveRelateForm.getRawValue().nodeCode === that.relateData.itemCode) {
          data.forEach(i => {
            if (that.relationProvinceStr.indexOf(i.provinceCode) !== -1) {
              i.checkState = true;
            }
          });
          that.getRelateProductData();
        }
      } else {
        that.relatePriData = [];
      }
      that.getArea();
    });
  }
  getRelateProductEvt($event, index) {
    this.relatePriData[index].checkState = $event.target.checked;
    this.getRelateProductData();
  }
  getRelateProductData() {
    const that = this;
    this.priIds = [];
    this.projectArr = [];
    this.relatePriData.forEach(i => {
      if (i.checkState) {
        this.priIds.push(i.provinceCode);
      }
    });
    const param = {
      itemCode: this.saveRelateForm.getRawValue().nodeCode,
      provinceCode: this.priIds.toString(),
    };
    let arr = [];
    this.activeBusinessService.getRelateProduct(param, function(data){
      if (data.length > 0) {
        that.relateProductData = data;
        if (that.modalData !== '' &&  that.saveRelateForm.getRawValue().nodeCode === that.relateData.itemCode) {
          if (!!that.relationProjectStr) {
            arr = that.relationProjectStr.split(',');
            data.forEach(i => {
              arr.forEach( k => {
                if (k === i.productCode) {
                  i.checkState = true;
                }
              });
            });
          }
          let editProjectArr = [];
          that.editProjectStr = [];
          editProjectArr = that.relationProjectStr.split(',');
          editProjectArr.forEach( i => {
            data.forEach(j => {
              if (j.productCode === i ) {
                that.editProjectStr.push(j);
              }
            });
          });
          that.projectArr = that.editProjectStr;
          if (that.projectArr.length > 0) {
            that.projectArr.forEach(i => {
              i.checkState = true;
            });
          }
        }
      } else {
        that.relateProductData = [];
      }
    });
    that.getArea();
  }
  getEventProduct($event, index) {
    this.relateProductData[index].checkState = $event.target.checked;
    if (this.relateProductData[index].checkState) {
      if (this.projectArr.indexOf(this.relateProductData[index]) === -1) {
        this.projectArr.push(this.relateProductData[index]);
      }
    } else {
      if (this.projectArr.indexOf(this.relateProductData[index]) > -1) {
        this.projectArr.splice(this.projectArr.findIndex(v => v === this.relateProductData[index]), 1);
      }
    }
    if (this.projectArr.length > 0) {
      this.projectArr.forEach(i => {
        i.checkState = true;
      });
    }
  }
  getDetail() {
    if (this.modalData !== '') {
      const that = this;
      this.activeBusinessService.relationDetail({id: this.modalData}, function(data){
        that.relateData = data;
        const relationAreaCodes = [];
        const relationAreaCodesStr = data.relationAreaCodes.split(',');
        relationAreaCodesStr.forEach(i => relationAreaCodes.push(i));
        const weekInt = [];
        const weekStr = data.sWeeks.split(',');
        weekStr.forEach(i => weekInt.push(parseInt(i)));
        // 处理时段
        const hash = {};
        if (!!data.sTimes) {
          const timeStr = data.sTimes.split(',');
          timeStr.forEach( i => {
            hash[i] = true;
          });
        }
        that.times.forEach(item => {
          const judge = hash[item.id] || hash[item.id] || false;
          judge ? item.checkState = true : item.checkState = false;
        });
        if (hash['24']) {
          that.times.forEach(item => {
            if (item.id !== '24') {
              item.disabled = true;
            }
          });
        }
        // 处理时段
        const priIDs = [];
        const priIDsStr = data.relationProvinceCodes.split(',');
        priIDsStr.forEach(i => priIDs.push(i));
        that.priIds = priIDs;
        that.saveRelateForm.patchValue({
          // actCode: data.actCode,
          // projectCode: data.projectCode,
          nodeCode: data.itemCode,
          // itemCode: data.itemCode,
          area: relationAreaCodes,
          week: weekInt,
        });
        that.relationProvinceStr = data.relationProvinceCodes;
        that.relationProjectStr = data.relationProjectCodes;
        that.getItemList();
        that.getProPri();
        that.getActCodeList();
        that.getArea();
        // that.getRelateProductData();
      });
    }
  }
  ok(): void {
    this.priIds = [];
    this.proIds = [];
    const that = this;
    const proStr = [];
    this.relatePriData.forEach(i => {
      if (i.checkState) {
        this.priIds.push(i.provinceCode);
      }
    });
    this.projectArr.forEach( i => {
      proStr.push(i.productCode);
    });
    const times = [];
    this.times.forEach(item => {
      if (item.checkState) {
        times.push(item.id);
      }
    });
    const param: any = {
      actCode: this.saveRelateForm.getRawValue().actCode,
      projectCode: this.saveRelateForm.getRawValue().projectCode,
      itemCode: this.saveRelateForm.getRawValue().nodeCode,
      nodeCode: this.saveRelateForm.getRawValue().itemCode,
      relationProvinceCodes: this.priIds.toString(),
      relationProjectCodes: proStr.toString(),
      relationAreaCodes: this.saveRelateForm.getRawValue().area.toString(),
      sWeeks: this.saveRelateForm.getRawValue().week.toString(),
      sTimes: times.toString(),
    };
    if (this.modalData !== '') {
      param.id = this.modalData;
      param.createTime = this.relateData.createTime;
    }
    const weeks = (this.saveRelateForm.controls['week'].value).join();
    if (weeks.indexOf('8') !== -1 && weeks.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '星期：每天不能与单一星期同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    console.log(this.saveRelateForm.getRawValue().area)
    if (this.saveRelateForm.getRawValue().area.toString().indexOf('all') !== -1 && this.saveRelateForm.getRawValue().area.toString().indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if ( times.toString() === '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '时间值不能为空！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.priIds.toString() === '' ||  proStr.toString() === '') {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      return;
    }
    if (this.saveRelateForm.valid) {
      this.activeBusinessService.relationSave(param, function(data){
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
  ngOnDestroy() {
    this.times.forEach(item => {
      item.disabled = false;
      item.checkState = false;
    });
  }
}
