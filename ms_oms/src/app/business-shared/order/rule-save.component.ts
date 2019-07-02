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

@Component({
  selector: 'c-rule-save',
  templateUrl: './rule-save.component.html',
  styleUrls: ['./rule-save.component.scss'],
})
export class RuleSaveComponent implements OnInit, OnDestroy{

  modalData: any = "";

  saveRuleForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private orderBusinessService: OrderBusinessService,
              private formBuilder: FormBuilder) {
    const pointFc = new FormControl('', Validators.compose([Validators.required]));
    const productFc = new FormControl('', Validators.compose([Validators.required]));
    const provinceFc = new FormControl('', Validators.compose([Validators.required]));
    const areaFc = new FormControl('', Validators.compose([Validators.required]));
    const strategyFc = new FormControl('', Validators.compose([Validators.required]));
    // const sourceFc = new FormControl([], Validators.compose([]));
    const sourceValueFc = new FormControl([], Validators.compose([]));
    const weekFc = new FormControl([], Validators.compose([Validators.required,]));
    const limitFc = new FormControl(0, Validators.compose([Validators.required, CustomValidators.numLimit]));
    const percentFc = new FormControl(100, Validators.compose([Validators.required, CustomValidators.numLimit100]));
    const orderModeFc = new FormControl(1, Validators.compose([Validators.required]));

    this.saveRuleForm = this.formBuilder.group({
      point: pointFc,
      product: productFc,
      province: provinceFc,
      area: areaFc,
      strategy: strategyFc,
      // source: sourceFc,
      sourceValue: sourceValueFc,
      week: weekFc,
      //time: timeFc,
      limit: limitFc,
      percent: percentFc,
      orderMode: orderModeFc,
    });
  }
  orderModeData: Array<any> = [{type: 1, value: '正常接口调用'}, {type: 2, value: '模拟统一页面'}, {type: 3, value: '客户端模拟订购'}];
  orderRuleSource: Array<any> = [];
  ngOnInit() {
    this.orderRuleSource = [].concat(orderRuleSource) ;
    this.resetSources();
    this.resetWeeks();
    this.getDetail();

    if (this.modalData === "") {
      let sourceStr = [];
      this.saveRuleForm.removeControl("point");
      this.saveRuleForm.removeControl("product");
      this.saveRuleForm.removeControl("province");
      this.saveRuleForm.removeControl("area");
      this.myOptions.push({id: 'all', name: '全部'});
      this.saveRuleForm.patchValue({
        sourceValue: this.myOptions[0].id,
      });
    } else {
      this.saveRuleForm.controls["point"].disable();
      this.saveRuleForm.controls["product"].disable();
      this.saveRuleForm.controls["province"].disable();
    }
  }

  ngOnDestroy() {
    if (this.updateIssuedModal !== null) {
      this.updateIssuedModal.close();
    }
    this.times.forEach(item => {
      item.disabled = false;
    });
    this.orderRuleSource.forEach( i => {
      i.checkState = false;
    })
  }

  orderRuleDetail: any;
  getDetail() {
    let that = this;
    that.times.forEach(item => {
      item.checkState = false;
      item.disabled = false;
    });
    if (this.modalData) {
      let param = {sId: this.modalData.sId};
      this.orderBusinessService.getOrderRuleDetail(param, function(data){
        if (data) {
          that.orderRuleDetail = data;
          // that.getCurNodeInfo(data.sNodeCode);
          // 订购入口
          let sourceStr = data.sSources.split(",");
          let sourceValueStr = data.sourceValue.split(",");
          let sourceInt = [];
          let sourceValue = [];
          let weekStr = data.sWeeks.split(",");
          let weekInt = [];
          weekStr.forEach( i => weekInt.push(parseInt(i)));


          let timeStr = data.sTimes.split(",");
          let hash    = {};
          //let timeInt = [];
          timeStr.forEach( i => {
            //timeInt.push(parseInt(i));
            hash[i] = true;
          });
          that.times.forEach(item => {
            let judge = hash[item.name] || hash[item.id] || false;
            judge ? item.checkState = true : item.checkState = false;
          });

          if (hash[24]) {
            that.times.forEach(item => {
              if (item.id != 24) {
                item.disabled = true;
              }
            });
          }

          that.saveRuleForm.patchValue({
            point: data.itemName,
            product: data.productName,
            province: data.provinceName,
            area: data.sAreas.split(","),
            // province: data.sProvinceCode,
            strategy: data.iType,
            // source: sourceInt,
            week: weekInt,
            //time: timeInt,
            limit: data.iLimitNum,
            percent: data.iChance,
            orderMode: parseInt(data.orderMode),
          });
          sourceStr.forEach( i => sourceInt.push(parseInt(i)));
          sourceValueStr.forEach( i => sourceValue.push(i));
         that.orderRuleSource.forEach( i => {
            sourceInt.forEach( j => {
              if (i.value === j) {
                i.checkState = true;
              }
            })
          })
          if (sourceInt.length === 1 && (sourceInt[0] == '3' || sourceInt[0] == '4')) {
            that.sourceFlag = true;
            that.getEnterDetail({sourceCode: sourceInt.toString()});
          } else {
            that.sourceFlag = false;
            // that.myOptions = [{id: 'all', name: '全部'}];
            // that.saveRuleForm.patchValue({
            //   sourceValue: that.myOptions[0].id,
            // });
          }
          that.getCurNodeAreas();
        }
      });
    }
  }

  provinces: Array<any>= [];
  curNodeData: any;
  productArr: Array<any>= [];
  productStr: any;
  provinceStr: any;
  getCurNodeInfo(sNodeCode) {
    let that = this;
    let param = {nodeCode: sNodeCode};
    this.orderBusinessService.getCurNodePro(param, function(data){
      that.provinces = data.provinceList;
      that.productArr = data.projectCodeList;
      that.provinces.forEach( i => {
        if(that.orderRuleDetail.sProvinceCode === i.id){
          that.provinceStr = i.name;
        }
      })
      that.productArr.forEach( i => {
        if(that.orderRuleDetail.sProjectCode === i.id){
          that.productStr = i.name;
        }
      })
      if (data) {
        that.saveRuleForm.patchValue({
          point: data.alias,
          product: that.productStr,
          province: that.provinceStr,
        });
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
    if (this.modalData !== ''){
      param = {provinceCode: this.orderRuleDetail.sProvinceCode};
    } else {
      param = {provinceCode: this.saveRuleForm.getRawValue().province};
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

  strategys: Array<any>= orderRuleStrategy;

  sources: IMultiSelectOption[] = [];
  resetSources () {
    this.sources = [];
    orderRuleSource.forEach(i => {
      this.sources.push({id: i.value, name: i.name});
    });
  }
  sourcesTexts: IMultiSelectTexts = {
    defaultTitle: "选择订购入口"
  };

  weeks: IMultiSelectOption[] = [];
  resetWeeks () {
    this.weeks = [];
    orderRuleWeek.forEach(i => {
      this.weeks.push({id: i.value, name: i.name});
    });
  }
  weeksTexts: IMultiSelectTexts = {
    defaultTitle: "选择星期"
  };

  /*times: IMultiSelectOption[] = timeFrame;
  timesTexts: IMultiSelectTexts = {
    defaultTitle: "选择时段"
  };*/
  times: Array<any> = timeFrame;
  timeChange (e, i){
    let el = e.target;
    let that = this;
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

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 25,
  };

  resultData: Array<any>= [];
  selectIssuedData: Array<any>=  [];
  updateIssuedModal: any = null;
  updateIssued() {
    let that = this;
    this.updateIssuedModal = this.ngbModalService.open(RuleIssuedComponent);
    this.updateIssuedModal.result.then((result) => {
      that.resultData.push(result);
      let areas = [];
      result.sAreas.forEach(i => areas.push(i.name));
      that.selectIssuedData.push(result.sNodeCode.name + "--" + result.sProjects.name + "--" + result.sProvince.name + "--" + areas.toString());
    }, (reason) => {
    });
  }

  delSelect(index) {
    this.selectIssuedData.splice(index, 1);
    this.resultData.splice(index, 1);
  }

  ok(): void {
    let that = this;
    let param: any;
    let sourceValueStr = [];
    let timeInt = [];
    that.times.forEach(item => {
      if(item.checkState){
        timeInt.push(item.id);
      }
    });
    if (this.saveRuleForm.getRawValue().sourceValue.toString() === '') {
      sourceValueStr = [ 'all'];
    } else {
      // sourceValueStr = this.saveRuleForm.getRawValue().sourceValue.toString();
      let sourceCode = [];
      if (typeof this.saveRuleForm.controls["sourceValue"].value !== 'string') {
        this.saveRuleForm.controls["sourceValue"].value.forEach(i => {
          sourceValueStr.push(i);
          // let reg = /^[0-9]*$/;
          // if (!reg.test(i)) {
          //   sourceValueStr.push(i);
          // }
        });
      }
    }
    if (sourceValueStr.toString().indexOf('all') !== -1 && sourceValueStr.toString().indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', 'code值：全部不能与单一活动/专辑code同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    let weeks = (this.saveRuleForm.controls["week"].value).join();
    if (weeks.indexOf('8') !== -1 && weeks.indexOf(',') !== -1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '星期：每天不能与单一星期同时选择！', 3000);
      that.toastService.toast(toastCfg);
      return;
    }
    if (this.saveRuleForm.getRawValue().sourceValue === "") {
      this.saveRuleForm.removeControl('sourceValue');
    }
    if (this.saveRuleForm.valid && timeInt.length > 0 && this.getSourceStr().toString() !== '') {
      let areaIds = [];
      let jsonData = [];
      this.resultData.forEach(i => {
        areaIds = [];
        i.sAreas.forEach(i => areaIds.push(i.sAreas));
        jsonData.push({
          itemCode: i.sNodeCode.sNodeCode,
          sProjectCode: i.sProjects.sProjectCode,
          sProvinceCode: i.sProvince.sProvinceCode,
          sAreas: areaIds.toString()
        });
      });
      param = {
        iType: this.saveRuleForm.getRawValue().strategy,
        // sSources: this.saveRuleForm.getRawValue().source.toString(),
        sSources: this.getSourceStr().toString(),
        // sourceValue: sourceValueStr,
        sWeeks: this.saveRuleForm.getRawValue().week.toString(),
        //sTimes: this.saveRuleForm.getRawValue().time.toString(),
        sTimes: timeInt.toString(),
        iLimitNum: this.saveRuleForm.getRawValue().limit,
        iChance: this.saveRuleForm.getRawValue().percent,
        orderMode: this.saveRuleForm.getRawValue().orderMode,
      };
      if (this.sourceFlag) {
        param.sourceValue = sourceValueStr;
      } else {
        param.sourceValue = 'all';
      }
      if (this.modalData !== "") {
        param.sId = this.modalData.sId;
        param.itemCode = this.orderRuleDetail.itemCode;
        param.sProjectCode = this.orderRuleDetail.sProjectCode;
        param.sProvinceCode = this.orderRuleDetail.sProvinceCode;
        param.sAreas = this.saveRuleForm.getRawValue().area.toString();
        this.orderBusinessService.editOrderRule(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '修改成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        param.jsonData = JSON.stringify(jsonData);
        this.orderBusinessService.saveOrderRule(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '添加成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      }
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整!', 2000));
    }

  }


  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  checkNode($event, index) {
    this.orderRuleSource[index].checkState = $event.target.checked;
    this.getEnter();
  }
  getEnter() {
    let arr = this.getSourceStr();
    if (arr.length === 1 && (arr[0] == '3' || arr[0] == '4')) {
      this.sourceFlag = true;
      this.getEnterDetail({sourceCode: arr.toString()});
    } else {
      this.sourceFlag = false;
    }
  }
  getSourceStr() {
    let arr = [];
    this.orderRuleSource.forEach( i => {
      if (i.checkState) {
        arr.push(i.value);
      }
    })
    return arr;
  }
  sourceFlag: any = false;
  // enterCodeChange (ev, ind) {
  //   let sourceCode = [];
  //     // sourceCode = this.saveRuleForm.controls['source'].value;
  //     if (sourceCode.length === 1 && (sourceCode[0] == '3' || sourceCode[0] == '4')) {
  //       this.sourceFlag = true;
  //       this.getEnterDetail({sourceCode: sourceCode});
  //     } else {
  //       this.sourceFlag = false;
  //     }
  //   // }
  //   // this.cityTip = '请先选择省份';
  //   // this.getEnterDetail({sourceCode: sourceCode});
  // }

  myOptions: IMultiSelectOption[] = [];
  myTexts: IMultiSelectTexts = {
    defaultTitle: "请选择code值"
  };
  mySettingsCode: IMultiSelectSettings = {
    dynamicTitleMaxItems: 24,
    displayAllSelectedText: false
  };
  getEnterDetail (param) {
    let that = this;
    this.orderBusinessService.templateStyleAllCode(param, function(data){
      that.saveRuleForm.patchValue({
        sourceValue: []
      });
      if (data !== null) {
        if (data.length > 0) {
          // that.citysList = data;
          let sourseArr = [];
          sourseArr.push({id: 'all', name: '全部'});
          for (let i of data) {
            sourseArr.push({id: (i.code).toString(), name: i.name});
          }
          // that.myTexts = {
          //   defaultTitle: "请选择code值"
          // };
          that.myOptions = sourseArr;
          if (that.modalData !== '' ) {
            if (that.getSourceStr().toString() === that.orderRuleDetail.source){
              let sourceValueStr = that.orderRuleDetail.sourceValue.split(",");
              that.saveRuleForm.patchValue({
                sourceValue: sourceValueStr,
              });
            } else {
              that.saveRuleForm.patchValue({
                sourceValue: "all",
              });
            }
          } else {
            that.saveRuleForm.patchValue({
              sourceValue: "all",
            });
          }
        } else {
          that.myTexts = {
            defaultTitle: "请选择"
          };
          that.myOptions = [{id: 'all', name: '全部'}];
        }
        if ( that.modalData !== '') {
          // let sourceStr = that.orderRuleDetail.sourceValue.split(",");
          // let sourceValueInt = [];
          // sourceStr.forEach( i => sourceValueInt.push(i));
          // that.saveRuleForm.patchValue({
          //   sourceValue: sourceValueInt,
          // });
          let sourceValues = (that.orderRuleDetail.sourceValue).split(",");
          if (that.getSourceStr().toString() === that.orderRuleDetail.sSources){
            that.saveRuleForm.patchValue({
              sourceValue: sourceValues,
            });
          } else {
            that.saveRuleForm.patchValue({
              sourceValue: 'all',
            });
          }
        } else {
          that.saveRuleForm.patchValue({
            sourceValue: 'all',
          });
        }
      } else {
        that.myTexts = {
          defaultTitle: "请选择"
        };
        that.myOptions = [{id: 'all', name: '全部'}];
      }
    });
    // that.firstFlag = false;
  }
}
