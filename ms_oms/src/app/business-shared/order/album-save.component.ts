import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { HistoryBusinessService } from '../../business-service/history/history-business.service';

import {programType, freeFlag, categoryAttr} from '../../global-constant';
import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-picture-add',
  templateUrl: './album-save.component.html',
  styleUrls: ['./album-save.component.scss'],
})
export class AlbumSaveComponent implements OnInit {

  saveAlbumForm: FormGroup;

  albumData: any = "";

  constructor(public activeModal: NgbActiveModal, private toastService: ToastService, private formBuilder: FormBuilder, private orderBusinessService: OrderBusinessService,) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const codeFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const desFc = new FormControl('', Validators.compose([ Validators.maxLength(140)]));

    this.saveAlbumForm = this.formBuilder.group({
      name: nameFc,
      code: codeFc,
      des: desFc,
    });
  }

  ngOnInit() {
    if ( this.albumData !== "") {
      this.getDetail();
      this.saveAlbumForm.controls["code"].disable()
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
      let param = {code: this.albumData.code};
      this.orderBusinessService.getAlbumCodeById(param, function(data){
        that.saveAlbumForm.patchValue({
          name: data.name,
          code: data.code,
          des: data.albumDesc,
        });
      });
  }

  getNodeDetail() {
    if (this.albumData !== "") {
      let that = this;
      let param = {listCode: this.albumData};
      let selectNode = [];
      // this.orderBusinessService.getProgramNodeDetail(param, function (data) {
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
    // this.orderBusinessService.getNodes(function(data) {
    //   that.nodeList = data;
    //   that.getNodeDetail();
    // });
  }
  getCategory(){
    let Category = [];
    if (this.albumData !== "") {
      this.eleAttrs.forEach(i => {
        if (i.checkState ) {
          Category.push(i.type);
        }
      });
    } else {
      this.eleAttrs.forEach(i => {
        if (i.checkState) {
          Category.push(i.type);
        }
      });
    }
    return Category.toString();
  }

  ok(): void {
    let that = this;
    let param: any;
    if (this.saveAlbumForm.valid ) {
      param =  {
        name: this.saveAlbumForm.controls["name"].value,
        code: this.saveAlbumForm.controls["code"].value,
        albumDesc: this.saveAlbumForm.controls["des"].value,
      };
      if (this.albumData !== "") {
        param.id = this.albumData.id;
      }
      this.orderBusinessService.saveAlbum(param, function(data){
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
