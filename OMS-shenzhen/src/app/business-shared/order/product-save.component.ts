import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';

@Component({
  selector: 'c-product-save',
  templateUrl: './product-save.component.html'
})
export class ProductSaveComponent implements OnInit {

  addProgramForm: FormGroup;
  modalData: any = '';

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private orderBusinessService: OrderBusinessService,
  ) {
    const productNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const productCodeNameFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetter, Validators.minLength(1), Validators.maxLength(6)]));
    const sourceFc = new FormControl('', Validators.compose([Validators.required]));
    const sProductScodeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(2)]));
    const sProductVersionNoFc = new FormControl('', Validators.compose([Validators.maxLength(255)]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    this.addProgramForm = this.formBuilder.group({
      productName: productNameFc,
      productCodeName: productCodeNameFc,
      sSource: sourceFc,
      sProductScode: sProductScodeFc,
      sProductVersionNo: sProductVersionNoFc,
    });
  }

  sourceData: Array<any> = [{type: 1, value: "内部"}, {type: 0, value: "外部"}];
  VerStrData: Array<any> = [{type: "H", value: "高清"}, {type: "S", value: "标清"}, {type: "A", value: "安卓"}];
  versionData: Array<any> = [{iProductId: '', sProductVersionNo: '', iStatus: '1', iStatuData: [{type: '1', value: "上线", iStatu: '0'}, {type: '0', value: "下线", iStatu: '0' }] }];
  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
      // this.addProgramForm.controls['productName'].disable();
      this.addProgramForm.controls['productCodeName'].disable();
    } else {
      this.addProgramForm.patchValue({
        sSource: this.sourceData[0].type,
      });
    }
  }

  detailData: any = '';
  getDetail() {
    if (this.modalData !== '') {
      let that = this;
      this.orderBusinessService.projectDetailNew({sProductCode: this.modalData.sProductCode}, function(data){
        console.log(data)
        if (data.success) {
          that.detailData = data.obj;
          that.addProgramForm.patchValue({
            productCodeName: data.obj.sProductCode,
            productName: data.obj.sProductName,
            sProductScode: data.obj.sProductScode,
            sSource: parseInt(data.obj.sSource),
          });
          that.versionData = [];
          // JSON.parse(data.obj.versionList).forEach((i, index) => {
          //   that.versionData.push({iProductId: i.iProductId, sProductVersionNo: i.sProductVersionNo, iStatus: i.iStatus.toString(), iStatuData: [{type: '0', value: "上线", iStatu: '0'}, {type: '1', value: "下线", iStatu: '0'}] });
          // });
          that.verInfo(data.obj);
          that.renderVer();
        }

      });
    }
  }
  renderVer() {
    this.versionData = [];
    let arr = JSON.parse(this.detailData.versionList);
    if (arr.length > 0) {
      arr.forEach((i, index) => {
        this.versionData.push({iProductId: i.iProductId, sProductVersionNo: i.sProductVersionNo, iStatus: i.iStatus.toString(), iStatuData: [{type: '1', value: "上线", iStatu: '0'}, {type: '0', value: "下线", iStatu: '0'}] });
      });
    } else {
      this.versionData.push({iProductId: '', sProductVersionNo: '', iStatus: '1', iStatuData: [{type: '1', value: "上线", iStatu: '0'}, {type: '0', value: "下线", iStatu: '0'}] });
    }
  }
  verInfo(data){
    let verArr = [];
    verArr = data.sProductVerStrs.split(',');
    this.VerStrData.forEach( i => {
      for (let n of verArr) {
        if (i.type === n) {
          i.checkState = true;
        }
      }
    });
    if (verArr.indexOf('A') > -1) {
      this.vNo = true;
      this.addProgramForm.patchValue({
        sProductVersionNo: data.sProductVersionNo,
      });
    }
  }

  vNo: any = false;
  checkNode($event, index) {
    let arr = [];
    this.VerStrData[index].checkState = $event.target.checked;
    this.VerStrData.forEach( i => {
      // if (i.type === 'A' && i.checkState) {
      //   this.vNo = true;
      // } else {
      //   this.vNo = false;
      // }
      if (i.checkState) {
        arr.push(i.type)
      }
    });
    console.log(arr.indexOf('A')> -1)
    if ( arr.indexOf('A') > -1) {
      this.vNo = true;
      if (this.modalData !== '') {
        this.renderVer();
      }
    } else {
      this.vNo = false;
      this.versionData = [{iProductId: '', sProductVersionNo: '', iStatus: '1', iStatuData: [{type: '1', value: "上线", iStatu: '0'}, {type: '0', value: "下线", iStatu: '0' }] }];
    }
  }
  getVerStr(){
    let VerStr = [];
    this.VerStrData.forEach(i => {
      if (i.checkState ) {
        VerStr.push(i.type);
      }
    });
    return VerStr.toString();
  }
  /**
   * 上传
   */
  ok(): void {
    let param: any;
    let that = this;
    let arrStr = this.getVerStr();
    if (this.vNo && this.versionData.some(i => i.sProductVersionNo === '')) {
      that.toastService.toast(new ToastConfig(ToastType.WARNING, '', '版本号不能为空!', 2000));
      return;
    }
    if (this.addProgramForm.valid && arrStr !== '') {
      param = {
        sProductName: this.addProgramForm.getRawValue().productName,
        sProductCode: this.addProgramForm.getRawValue().productCodeName,
        sProductScode: this.addProgramForm.getRawValue().sProductScode,
        sSource: this.addProgramForm.getRawValue().sSource,
        sProductVerStrs: arrStr,
        // sProductVersionNo: this.addProgramForm.getRawValue().sProductVersionNo,
        versionList: JSON.stringify(this.versionData),
      };
      if (this.modalData !== '') {
        param.iProductId = this.modalData.iProductId;
      }
      // if (arrStr.indexOf("A") > -1 && this.addProgramForm.getRawValue().sProductVersionNo === '') {
      //   that.toastService.toast(new ToastConfig(ToastType.WARNING, '', '版本号不能为空!', 2000));
      //   return;
      // }
      this.orderBusinessService.addProductNewPost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 3000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }


  addVersion() {
    this.versionData.push({iProductId: '', sProductVersionNo: '', iStatus: '1', iStatuData: [{type: '1', value: "上线", iStatu: '0'}, {type: '0', value: "下线", iStatu: '0'}] });
  }
  rmVersion(i) {
    this.versionData.splice(i, 1);
  }
}
