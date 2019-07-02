import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import {orderRuleWeek, timeFrame, orderRuleSource, carrierAttr } from '../../global-constant';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'c-tmp-config-save',
  templateUrl: './tmp-config-save.component.html'
})
export class TmpConfigSaveComponent implements OnInit, OnDestroy {

  paramModal: any = '';

  provinces: Array<any>= [];
  weeks: Array<any>= orderRuleWeek;
  times: Array<any>= timeFrame;
  carrierAttr: Array<any>= carrierAttr;
  templates: Array<any>= [];

  saveTmpConfigForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private odsysBusinessService: OdsysBusinessService,
  ) {
    const templateFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceCodeFc = new FormControl('', Validators.compose([Validators.required]));
    // const timeFc = new FormControl([], Validators.compose([Validators.required]));
    const weekFc = new FormControl([], Validators.compose([Validators.required]));
    const sourcesFc = new FormControl([], Validators.compose([Validators.required]));
    const carrierFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveTmpConfigForm = this.formBuilder.group({
      template: templateFc,
      provinceCode: provinceCodeFc,
      // time: timeFc,
      week: weekFc,
      sources: sourcesFc,
      carrier: carrierFc,
    });
  }

  ngOnInit () {
    this.getProvinces();
    this.getTmpConfigDetail();
    this.resetSources();
    this.resetWeeks();
    // this.getTimeData();
  }
  ngOnDestroy() {
    this.times.forEach(item => {
      item.disabled = false;
      item.checkState = false;
    });
  }

  getTmpConfigDetail() {
    if (this.paramModal !== '') {
      let that = this;
      this.odsysBusinessService.getTmpConfigDetail({id: this.paramModal}, function(data){
        let sourcesInt = [];
        let sourcesStr = data.sources.split(',');
        sourcesStr.forEach(i => sourcesInt.push(parseInt(i)));
        // let timeInt = [];
        // let timeStr = data.times.split(',');
        // timeStr.forEach(i => timeInt.push(parseInt(i)));
        let weekInt = [];
        let weekStr = data.weeks.split(',');
        weekStr.forEach(i => weekInt.push(parseInt(i)));


        let timeStr = data.times.split(",");
        let hash    = {};
        timeStr.forEach( i => {
          hash[i] = true;
        });

        that.times.forEach(item => {
          let judge = hash[item.id] || hash[item.id] || false;
          judge ? item.checkState = true : item.checkState = false;
        });

        if (hash[24]) {
          that.times.forEach(item => {
            if (item.id != 24) {
              item.disabled = true;
            }
          });
        }

        that.updateTmp();

        that.saveTmpConfigForm.patchValue({
          template: data.template,
          provinceCode: data.provinceCode,
          sources: sourcesInt,
          // time: timeInt,
          week: weekInt,
          carrier: data.carrier
        });
        // that.getDetailTimeData();
      });
    }
  }

  // times: Array<any> = timeFrame;
  timeChange (e, i){
    let el = e.target;
    let that = this;
    that.times.forEach( item =>  item.disabled = false );
    if(el.value == 24){
      that.times[i].checkState = el.checked;
      if(el.checked){
        that.times.forEach(item => {
          if(item.id != 24){
            item.disabled = true;
            item.checkState = false;
          }
        });
      }else {
        that.times.forEach(item => {
          if(item.id != 24){
            item.disabled = false;
          }
        });
      }
    }else{
      that.times[i].checkState = el.checked;
    }
  }

  getProvinces() {
    let that = this;
    this.odsysBusinessService.getProvinces(function(data){
      if (data.length > 0) {
        that.provinces = data;
      } else {
        that.provinces = [];
      }
    });
  }

  updateTmp () {
    let that = this;
    let param = {carrier: this.saveTmpConfigForm.getRawValue().carrier};
    this.odsysBusinessService.getTemplateList(param, function(data){
      that.templates = data;
    });
  }

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 25,
  };

  sourcesData: IMultiSelectOption[] = [];
  resetSources () {
    this.sourcesData = [];
    orderRuleSource.forEach(i => {
      this.sourcesData.push({id: i.value, name: i.name});
    });
  }

  weekData: IMultiSelectOption[] = [];
  resetWeeks () {
    this.weekData = [];
    orderRuleWeek.forEach(i => {
      this.weekData.push({id: i.value, name: i.name});
    });
  }

  timeData: IMultiSelectOption[] = timeFrame;

  MulTexts: IMultiSelectTexts = {
    defaultTitle: "请选择"
  };
  ok(): void {
    let param: any;
    let that = this;
    let times = [];
    that.times.forEach(item => {
      if(item.checkState){
        times.push(item.id);
      }
    });
    let weeks = (this.saveTmpConfigForm.controls["week"].value).join();
    if (weeks.indexOf('8') !== -1 && weeks.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '星期：每天不能与单一星期同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.saveTmpConfigForm.valid && times.length > 0) {
      param = {
        template: this.saveTmpConfigForm.getRawValue().template,
        provinceCode: this.saveTmpConfigForm.getRawValue().provinceCode,
        weeks: this.saveTmpConfigForm.getRawValue().week.toString(),
        times: times.toString(),
        sources: this.saveTmpConfigForm.getRawValue().sources.toString(),
      };
      if (this.paramModal) {
        param.id = this.paramModal;
      }
      this.odsysBusinessService.saveTmpConfig(param, function(data){
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
