import { Component, OnInit, OnDestroy } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { orderRuleStrategy, orderRuleSource, orderRuleWeek, timeFrame } from '../../global-constant';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { RuleIssuedComponent } from './rule-Issued.component';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import {number} from '../../shared/custom-validator/number/number';

@Component({
  selector: 'c-config-save',
  templateUrl: './config-save.component.html',
  styleUrls: ['./config-save.component.scss'],
})
export class ConfigSaveComponent implements OnInit, OnDestroy{

  modalData: any = "";

  saveConfigForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private orderBusinessService: OrderBusinessService,
              private formBuilder: FormBuilder) {
    const pointFc = new FormControl('', Validators.compose([Validators.required]));
    const productFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const sourcesFc = new FormControl('', Validators.compose([Validators.required]));
    const sourceValueFc = new FormControl([], Validators.compose([Validators.required]));
    const templateCodeFc = new FormControl([], Validators.compose([Validators.required]));
    const weekFc = new FormControl([], Validators.compose([Validators.required]));
    const areaFc = new FormControl([], Validators.compose([Validators.required]));
    const onceFir = new FormControl([], Validators.compose([]));
    const onceSec = new FormControl([], Validators.compose([]));
    const twiceFir = new FormControl([], Validators.compose([]));
    const twiceSec = new FormControl([], Validators.compose([]));
    const yjsrFir = new FormControl([], Validators.compose([]));
    const yjsrSec = new FormControl([], Validators.compose([]));
    const sgsrFir = new FormControl([], Validators.compose([]));
    const sgsrSec = new FormControl([], Validators.compose([]));
    this.saveConfigForm = this.formBuilder.group({
      point: pointFc,
      product: productFc,
      province: provinceFc,
      area: areaFc,
      sources: sourcesFc,
      week: weekFc,
      sourceValue: sourceValueFc,
      templateCode: templateCodeFc,
      onceFir: onceFir,
      onceSec: onceSec,
      twiceFir: twiceFir,
      twiceSec: twiceSec,
      yjsrFir: yjsrFir,
      yjsrSec: yjsrSec,
      sgsrFir: sgsrFir,
      sgsrSec: sgsrSec,
    });
  }
  nodeCode: any = "";
  nodeCodes: Array<any>= [];
  times: Array<any>= timeFrame;
  weeks: Array<any>= orderRuleWeek;
  productCode: any = "";
  templateCodes: Array<any>= [];
  templateCode: any = "";
  productCodes: Array<any>= [];
  sourceValueData: Array<any>= [];
  sProvinceCode: any = "";
  sProvinceCodes: Array<any>= [];
  enters: Array<any>= [{id: '0', name: '产品GO'}, {id: '1', name: '播放GO'}, {id: '2', name: '访问GO'}, {id: '3', name: '活动GO'}, {id: '4', name: '专辑GO'}, {id: '10', name: '全部'}];
  defaultPlans: Array<any>= [{id: "{once:1}", name: '一次确认'}, {id: "twice:{step1:0, step2:1}", name: '二次确认'}, {id: "yjsr:{step1:1, step2:2}", name: '一键输入'}, {id: "hand:{step1:1, step2:3}", name: '手工验证'}];
  isOk: Array<any>= [{id: 0, name: '取消'}, {id: 1, name: '确认'}];
  yjsrData: Array<any>= [{id: 0, name: '取消'}, {id: 1, name: '确认'}, {id: 2, name: '一键输入'}];
  sgsrData: Array<any>= [{id: 0, name: '取消'}, {id: 1, name: '确认'}, {id: 3, name: '手工输入'}];
  ngOnInit() {
    this.getSelectNodePoints();
    this.getTemplateStyle();
    this.resetWeeks();

    if (this.modalData !== "") {
      this.getDetail();
    } else {
      this.myOptions = [{id: 'all', name: '全部'}];
      this.saveConfigForm.patchValue({
        sourceValue: this.myOptions[0].id,
        week: [8],
        // sourceValue: 'all',
        onceFir: this.isOk[1].id,
        twiceFir: this.isOk[1].id,
        twiceSec: this.isOk[1].id,
        yjsrFir: this.isOk[1].id,
        yjsrSec: this.yjsrData[2].id,
        sgsrFir: this.isOk[1].id,
        sgsrSec: this.sgsrData[2].id,
      });
      // 时段默认选择全天
      this.times.forEach(item => {
        if (item.id == 24) {
          item.checkState = true;
        } else {
          item.disabled = true;
        }
      });
    }
  }

  ngOnDestroy() {
    this.times.forEach(item => {
      item.disabled = false;
      item.checkState = false;
    });
  }

  configDetail: any;
  firstFlag = true;
  getDetail() {
    let that = this;
    if (this.modalData) {
      let param = {id: this.modalData};
      this.orderBusinessService.getTemplateStyleEntityById(param, function(data){
        if (data) {
          that.configDetail = data;
          // 处理周
          let weekInt = [];
          let weekStr;
          if (data.weeks) {
            weekStr = data.weeks.split(',');
            weekStr.forEach(i => weekInt.push(parseInt(i)));
          };
          // 处理时段
          let hash    = {};
          if (!!data.times) {
            let timeStr = data.times.split(",");
            timeStr.forEach( i => {
              hash[i] = true;
            });

          }
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
          let sourceValues = (that.configDetail.sourceValue).split(",");
          let defaultPlanObj = JSON.parse(that.configDetail.defaultPlan);
          let onceFirVal = defaultPlanObj.once;
          let twiceFirVal = defaultPlanObj.twice.step1;
          let twiceSecVal = defaultPlanObj.twice.step2;
          let yjsrFirVal = defaultPlanObj.yjsr.step1;
          let yjsrSecVal = defaultPlanObj.yjsr.step2;
          let sgsrFirVal = defaultPlanObj.hand.step1;
          let sgsrSecVal = defaultPlanObj.hand.step2;
          that.saveConfigForm.patchValue({
            point: that.configDetail.itemCode,
            product: that.configDetail.projectCode,
            province: that.configDetail.provinceCode,
            area: that.configDetail.areas.split(","),
            sources: that.configDetail.sources,
            sourceValue: sourceValues,
            templateCode: that.configDetail.styleCode,
            week: weekInt,
            onceFir: onceFirVal,
            twiceFir: twiceFirVal,
            twiceSec: twiceSecVal,
            yjsrFir: yjsrFirVal,
            yjsrSec: yjsrSecVal,
            sgsrFir: sgsrFirVal,
            sgsrSec: sgsrSecVal,
          });
          that.getpri();
          that.getpro();
          that.enterCodeChange ();
          that.getCurNodeAreas();
        }
      });
    }
  }
  getSelectNodePoints() {
    let that = this;
    // this.orderBusinessService.getNodeDetail(function(data){
    this.orderBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.nodeCodes = data;
      } else {
        that.nodeCodes = [];
      }
    });
  }
  getTemplateStyle() {
    let that = this;
    this.orderBusinessService.templateStyle(function(data){
      if (data.length > 0) {
        that.templateCodes = data;
      } else {
        that.templateCodes = [];
      }
    });
  }
  nodeCodeChange () {
    let that = this;
    that.sProvinceCodes = [];
    that.productCodes = [];
    that.areasMulData = [];
    that.saveConfigForm.patchValue({
      province: '',
      product: '',
      area: []
    })
    this.getpri();
  }

  getpri() {
    let that = this;
    let param ;
    if (this.modalData !== '' && this.saveConfigForm.getRawValue().point === this.configDetail.itemCode) {
      param = {
        itemCode: this.configDetail.itemCode,
      };
    }else {
      param = {
        itemCode: this.saveConfigForm.getRawValue().point,
      };
    }
    this.orderBusinessService.projectProvince(param, function(data){
      if (data) {
        that.sProvinceCodes = data;
        // that.sProvinceCodes.unshift({
        //   provinceCode: '100',
        //   name: '全国'
        // });
      } else {
        // that.areas = [];
      }
    });
  }
  proChange() {
    let that = this;
    that.productCodes = [];
    that.areasMulData = [];
    that.saveConfigForm.patchValue({
      product: '',
      area: ['all']
    })
    this.getpro();
    this.getCurNodeAreas();
  }
  getpro() {
    let that = this;
    let param;
    if (this.modalData !== '' && this.saveConfigForm.controls['point'].value === that.configDetail.itemCode && this.saveConfigForm.controls['province'].value === that.configDetail.provinceCode ) {
      param = {
        itemCode: that.configDetail.itemCode,
        provinceCode: that.configDetail.provinceCode,
      };
    } else {
      param = {
        itemCode: this.saveConfigForm.controls['point'].value,
        provinceCode: this.saveConfigForm.controls['province'].value,
      };
    }
    this.orderBusinessService.projectProvinceProduct(param, function(data){
      if (data) {
        that.productCodes = data;
      }
    });
  }
  areasTexts: IMultiSelectTexts = {
    defaultTitle: "请先选择省份"
  };
  areasMulData: IMultiSelectOption[] = [];
  getCurNodeAreas() {
    this.areasMulData = [];
    let that = this;
    let param;
    if (this.modalData !== '' && this.saveConfigForm.getRawValue().province === this.configDetail.provinceCode){
      param = {provinceCode: this.configDetail.provinceCode};
    } else {
      param = {provinceCode: this.saveConfigForm.getRawValue().province};
    }
    this.orderBusinessService.getCurCitys(param, function(data){
      let newAreaData = [];
      newAreaData.push({id: 'all', name: '全部'});
      if (data) {
        data.forEach(i => newAreaData.push({id: i.sAreaCode, name: i.sAreaName}));
        // newAreaData.push({id: 'else', name: '其他'});
      } else {
        // newAreaData = [];
      }
      newAreaData.push({id: 'else', name: '其他'});
      that.areasMulData = newAreaData;
    });
  }
  getNodeDetail (param) {
    let that = this;
    that.productCodes = [];
    that.sProvinceCodes = [];
    this.orderBusinessService.getNodeDetailApiServce(param, function(data){
      that.productCodes = data.projectCodeList;
      that.sProvinceCodes = data.provinceList;
    });
  }

  enterCodeChange () {
    let sourceCode = '';
    if (this.modalData !== '' && this.firstFlag) {
      sourceCode = this.configDetail.sources;
    } else {
      sourceCode = this.saveConfigForm.controls['sources'].value;
    }
    this.getEnterDetail({sourceCode: sourceCode});
  }

  rightSearchCond3: Array<any>= [];
  onSearchChange(e, type) {
     if (type === 'sourceValue') {
      this.rightSearchCond3 = e;
    }
  }
  myOptions: IMultiSelectOption[] = [];
  myTexts: IMultiSelectTexts = {
    defaultTitle: "请先选择订购入口"
  };
  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 24,
    displayAllSelectedText: false
  };
  sourseArr: Array<any> = [{id: 'all', name: '全部'}]
  getEnterDetail (param) {
    let that = this;
    // if (param.sourceCode) {
    //   that.saveConfigForm.patchValue({
    //     provinceCode: param.sourceCode
    //   });
    // }
    let sources = this.saveConfigForm.controls['sources'].value;
    // if (sources === '') return;
    this.orderBusinessService.templateStyleAllCode(param, function(data){
      that.sourseArr = [{id: 'all', name: '全部'}];
      that.myOptions = [];
      that.saveConfigForm.patchValue({
        sourceValue: [],
      });
      if (data !== null) {
        if (data.length > 0) {
          for (let i of data) {
            that.sourseArr.push({id: i.code, name: i.name});
          }
          that.myOptions = that.sourseArr;
          if (that.modalData !== '') {
            let sourceValues = (that.configDetail.sourceValue).split(",");
            // let sourceValues = that.configDetail.sourceValue;
            if (that.saveConfigForm.controls['sources'].value === that.configDetail.sources) {
              that.saveConfigForm.patchValue({
                sourceValue: sourceValues,
              });
            } else {
              that.saveConfigForm.patchValue({
                sourceValue: "all",
              });
            }
          } else {
            that.saveConfigForm.patchValue({
              sourceValue: "all",
            });
          }
        } else {
          that.myTexts = {
            defaultTitle: "请选择"
          };
          that.myOptions = [{id: 'all', name: '全部'}];
          that.saveConfigForm.patchValue({
            sourceValue: "all",
          });
        }
      } else {
        that.myTexts = {
          defaultTitle: "请选择"
        };
        that.myOptions = [{id: 'all', name: '全部'}];
        that.saveConfigForm.patchValue({
          sourceValue: "all",
        });
      }
    });
    that.firstFlag = false;
  }

  // sourcesTexts: IMultiSelectTexts = {
  //   defaultTitle: "选择订购入口"
  // };
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

  ok(): void {
    let that = this;
    let param;
    let times = [];
    that.times.forEach(item => {
      if(item.checkState){
        times.push(item.id);
      }
    });
    // if (times == []) {
    //   times = [24];
    // }
    if (this.saveConfigForm.getRawValue().area.toString().indexOf('all') !== -1 && this.saveConfigForm.getRawValue().area.toString().indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '区域：全部不能与单一区域同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    let weeks = (this.saveConfigForm.controls["week"].value).join();
    if (weeks.indexOf('8') !== -1 && weeks.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '星期：每天不能与单一星期同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if ( times.toString() == '') {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '时间值不能为空！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    // let sourceCode = (this.saveConfigForm.controls["sourceValue"].value).join();
    let sourceCode = [];
    if (typeof this.saveConfigForm.controls["sourceValue"].value === "object") {
      this.saveConfigForm.controls["sourceValue"].value.forEach(i => {
        sourceCode.push(i);
        // let reg = /^[0-9]*$/;
        // if (!reg.test(i)) {
        //   sourceCode.push(i);
        // }
      });
    }
    if (sourceCode.toString().indexOf('all') !== -1 && sourceCode.toString().indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', 'code值：全部不能与单一活动/专辑code同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    let onceFirVal = this.saveConfigForm.getRawValue().onceFir;
    let twiceFirVal = this.saveConfigForm.getRawValue().twiceFir;
    let twiceSecVal = this.saveConfigForm.getRawValue().twiceSec;
    let yjsrFirVal = this.saveConfigForm.getRawValue().yjsrFir;
    let yjsrSecVal = this.saveConfigForm.getRawValue().yjsrSec;
    let sgsrFirVal = this.saveConfigForm.getRawValue().sgsrFir;
    let sgsrSecVal = this.saveConfigForm.getRawValue().sgsrSec;
    let defaultPlanVal = {once: onceFirVal, twice: {step1: twiceFirVal, step2: twiceSecVal}, yjsr: { step1: yjsrFirVal, step2: yjsrSecVal}, hand: { step1: sgsrFirVal, step2: sgsrSecVal}}
    if (this.saveConfigForm.valid) {
      let areaIds = [];
      let jsonData = [];
      param = {
        itemCode: this.saveConfigForm.getRawValue().point,
        projectCode: this.saveConfigForm.getRawValue().product,
        provinceCode: this.saveConfigForm.getRawValue().province,
        weeks: this.saveConfigForm.getRawValue().week.toString(),
        times: times.toString(),
        sources: this.saveConfigForm.getRawValue().sources,
        sourceValue: sourceCode.toString(),
        styleCode: this.saveConfigForm.getRawValue().templateCode,
        defaultPlan: JSON.stringify(defaultPlanVal),
        areas: this.saveConfigForm.getRawValue().area.toString()
      };
      if (this.modalData !== '') {
        param.id = this.modalData;
      }
      this.orderBusinessService.saveTemplate(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '添加成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整!', 2000));
    }

  }


  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
