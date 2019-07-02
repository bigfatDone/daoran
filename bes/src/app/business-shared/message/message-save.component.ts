import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { MessageBusinessService } from '../../business-service/message/message-business.service';

import {programType, freeFlag, categoryAttr} from '../../global-constant';

@Component({
  selector: 'c-message-save',
  templateUrl: './message-save.component.html',
  styleUrls: ['./message-save.component.scss'],
})
export class MessageSaveComponent implements OnInit {

  moduleData: Array<any>= [{type:'crm', value: '客服管理系统'},{type:'jit', value: '运营管理系统'},{type:'cms', value: '内容管理系统'},{type:'bas', value: '经分系统'},{type:'bls', value: '结算系统'},{type:'tag', value: '标签系统'}];
  saveMessageForm: FormGroup;

  modalData: any = "";

  constructor(public activeModal: NgbActiveModal, public messageBusinessService: MessageBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
   // const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const titleFc = new FormControl('', Validators.compose([Validators.required, ]));
    const contentFc = new FormControl('', Validators.compose([ Validators.required]));

    this.saveMessageForm = this.formBuilder.group({
     // name: nameFc,
      title: titleFc,
      content: contentFc,
    });
  }

  ngOnInit() {
    if ( this.modalData !== "") {
      this.getDetail();
      this.saveMessageForm.controls['code'].disable();
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
    this.moduleData[index].checkState = $event.target.checked;
  }
  detailInfo: any;
  getDetail() {
      let that = this;
      let param = {wallName: this.modalData.wallName};
      // this.messageBusinessService.getPictureInfo(param, function(data){
      //   that.saveMessageForm.patchValue({
      //     code: data.wallName,
      //     des: data.wallDescription,
      //   });
      //   that.detailInfo = data;
      //   that.eleAttrStr = data.eleCategory;
      //   that.getDetailPicData ();
      // });
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
    // this.messageBusinessService.getNodes(function(data) {
    //   that.nodeList = data;
    //   that.getNodeDetail();
    // });
  }
  getModuleName(){
    let Category = [];
    if (this.modalData !== "") {
      this.moduleData.forEach(i => {
        if (i.checkState ) {
          Category.push(i.type);
        }
      });
    } else {
      this.moduleData.forEach(i => {
        if (i.checkState) {
          Category.push(i.type);
        }
      });
    }
    return Category.toString();
  }

  userInfo: any;
  ok(): void {
    let that = this;
    let param: any;
    let moduleName = this.getModuleName();
    if (localStorage.userInfo) {
      this.userInfo = JSON.parse(localStorage.userInfo);
    }
    if (this.saveMessageForm.valid && moduleName !== "" ) {
      param =  {
        title: this.saveMessageForm.controls["title"].value,
        moduleName: moduleName,
        content: this.saveMessageForm.controls["content"].value,
        creator: that.userInfo.userName,
      };
      if (this.modalData !== "") {
        param.op = "edit";
      }
      this.messageBusinessService.addMessage(param, function(data){
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
