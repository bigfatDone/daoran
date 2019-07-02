import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { carrierAttr, odSysState } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';


@Component({
  selector: 'c-relate-save',
  templateUrl: './relate-save.component.html'
})
export class RelateSaveComponent implements OnInit {

  saveRelateForm: FormGroup;

  modalData: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private activeBusinessService: ActiveBusinessService,
  ) {
    const actCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const projectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    // const relationProvinceCodesFc = new FormControl('', Validators.compose([Validators.required]));
    // const relationProjectCodesFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveRelateForm = this.formBuilder.group({
      actCode: actCodeFc,
      projectCode: projectCodeFc,
      nodeCode: nodeCodeFc,
      itemCode: itemCodeFc,
      // relationProvinceCodes: relationProvinceCodesFc,
      // relationProjectCodes: relationProjectCodesFc,
    });
  }

  styleData: Array<any> = [{type: 1, value: '按概率' }, {type: 2, value: '按产品订购量' }];
  sendFlagData: Array<any> = [{type: 1, value: '派奖' }, {type: 2, value: '不派奖' }];
  prizeTypeData: Array<any> = [{type: 0, value: '抽奖' }, {type: 1, value: '兑换' }, {type: 2, value: '砍价' }];
  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.saveRelateForm.patchValue({state: this.stateData[1].type});
    }
    this.nodedetailAuth();
  }
  itemData: Array<any> = [];
  nodedetailAuth() {
    let that = this;
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
    let that = this;
    that.itemData = [];
    that.appointProduct = [];
    that.ActCodeData = [];
    that.relatePriData = [];
    that.relateProductData = [];
    let param: any = {
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
  appointProduct: any;
  getProjectList() {
    let that = this;
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
  ActCodeData: any;
  getActCodeList() {
    let that = this;
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
  relatePriData: Array<any>= [];
  getRelatePri(param) {
    let that = this;
    if (this.modalData === ''){
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
    });
  }
  relateProductData: Array<any>= [];
  priIds: Array<any>= [];
  getRelateProductEvt($event, index) {
    this.relatePriData[index].checkState = $event.target.checked;
    this.getRelateProductData();
  }
  getRelateProductData() {
    let that = this;
    this.priIds = [];
    this.projectArr = [];
    this.relatePriData.forEach(i => {
      if (i.checkState) {
        this.priIds.push(i.provinceCode);
      }
    })
    let param = {
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
          editProjectArr = that.relationProjectStr.split(",");
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
            })
          };
        }
      } else {
        that.relateProductData = [];
      }
    });
  }
  projectArr: Array<any> = [];
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
      })
    };
  }

  relationProvinceStr: any;
  relationProjectStr: any;
  editProjectStr: Array<any> = [];
  relateData: any;
  getDetail() {
    if (this.modalData !== '') {
      let that = this;
      this.activeBusinessService.relationDetail({id: this.modalData}, function(data){
        that.relateData = data;
        that.saveRelateForm.patchValue({
          // actCode: data.actCode,
          // projectCode: data.projectCode,
          nodeCode: data.itemCode,
          // itemCode: data.itemCode,
        });
        that.relationProvinceStr = data.relationProvinceCodes,
        that.relationProjectStr = data.relationProjectCodes,
        that.getItemList();
        that.getProPri();
        that.getActCodeList();
        // that.getRelateProductData();
      });
    }
  }
  beData:any;
  enData:any;
  proIds: Array<any>= [];
  ok(): void {
    this.priIds = [];
    this.proIds = [];
    let that = this;
    let proStr = [];
    this.relatePriData.forEach(i => {
      if (i.checkState) {
        this.priIds.push(i.provinceCode);
      }
    })
    this.projectArr.forEach( i => {
      proStr.push(i.productCode);
    })
    let param: any = {
      actCode: this.saveRelateForm.getRawValue().actCode,
      projectCode: this.saveRelateForm.getRawValue().projectCode,
      itemCode: this.saveRelateForm.getRawValue().nodeCode,
      nodeCode: this.saveRelateForm.getRawValue().itemCode,
      relationProvinceCodes: this.priIds.toString(),
      relationProjectCodes: proStr.toString(),
    };
    if (this.modalData !== '') {
      param.id = this.modalData;
      param.createTime = this.relateData.createTime;
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
}
