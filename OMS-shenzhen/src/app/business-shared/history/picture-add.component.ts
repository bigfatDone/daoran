import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { HistoryBusinessService } from '../../business-service/history/history-business.service';

import {programType, freeFlag, categoryAttr} from '../../global-constant';

@Component({
  selector: 'c-picture-add',
  templateUrl: './picture-add.component.html',
  styleUrls: ['./picture-add.component.scss'],
})
export class PictureAddComponent implements OnInit {

  savePictureForm: FormGroup;

  modalData: any = "";

  constructor(public activeModal: NgbActiveModal, public historyBusinessService: HistoryBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
   // const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const codeFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const desFc = new FormControl('', Validators.compose([ Validators.maxLength(140)]));

    this.savePictureForm = this.formBuilder.group({
     // name: nameFc,
      code: codeFc,
      des: desFc,
    });
  }

  ngOnInit() {
    if ( this.modalData !== "") {
      this.getDetail();
      this.savePictureForm.controls['code'].disable();
    }
    this.getPicData ();
  }

  nodeList: Array<any>= [];
  programTypes: Array<any>= programType;
  freeFlags: Array<any>= freeFlag;
  pageEleAt: Array<any>= categoryAttr;

  eleAttrs: Array<any>= [];
  eleAttrStr: any;

  getPicData () {
    this.eleAttrs = [];
    categoryAttr.forEach(i => {
      let copyI = Object.assign({}, i);
      this.eleAttrs.push(copyI);
    });
  }
  getDetailPicData () {
    this.eleAttrs = [];
    categoryAttr.forEach(i => {
      let copyI = Object.assign({}, i);
      if (this.eleAttrStr.indexOf(copyI.type) !== -1) {
        copyI.checkState = true;
      }
      this.eleAttrs.push(copyI);
    });
  }

  checkNode($event, index) {
    this.eleAttrs[index].checkState = $event.target.checked;
  }
  detailInfo: any;
  getDetail() {
      let that = this;
      let param = {wallName: this.modalData.wallName};
      this.historyBusinessService.getPictureInfo(param, function(data){
        that.savePictureForm.patchValue({
          code: data.wallName,
          des: data.wallDescription,
        });
        that.detailInfo = data;
        that.eleAttrStr = data.eleCategory;
        that.getDetailPicData ();
      });
  }

  getNodeDetail() {
    if (this.modalData !== "") {
      let that = this;
      let param = {listCode: this.modalData};
      let selectNode = [];
      // this.historyBusinessService.getProgramNodeDetail(param, function (data) {
      //   data.forEach(i => selectNode.push(i.nodeCode));
      //   that.nodeList.forEach(i => {
      //     if (selectNode.indexOf(i.nodeCode) > -1) {
      //       i.checkState = true;
      //     }
      //   });
      // });
    }
  }

  getNodeList() {
    let that = this;
    // this.historyBusinessService.getNodes(function(data) {
    //   that.nodeList = data;
    //   that.getNodeDetail();
    // });
  }
  getCategory(){
    let Category = [];
    this.eleAttrs.forEach(i => {
      if (i.checkState) {
        Category.push(i.type);
      }
    });
    return Category.toString();
  }

  ok(): void {
    let that = this;
    let param: any;
    let categoryVal = this.getCategory();
    if (this.savePictureForm.valid && categoryVal !== "" ) {
      param =  {
        op: "add",
        wallName: this.savePictureForm.controls["code"].value,
        wallDescription: this.savePictureForm.controls["des"].value,
        eleCategory: categoryVal,
      };
      if (this.modalData !== "") {
        param.op = "edit";
      }
      this.historyBusinessService.getPictureSave(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写正确、完整信息!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
