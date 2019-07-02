import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { environment } from '../../../environments/environment';
import {ElementConfirSaveComponent} from './element-confirSave.component';
import {ElementConfirPicComponent} from './element-confirPic.component';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import {ModalService} from '../../shared/modal/modal.service';
import {Router} from '@angular/router';

@Component({
  selector: 'c-element-uploadImg',
  templateUrl: './element-uploadImg.component.html',
  styleUrls: ['./element-uploadImg.component.scss']
})
export class ElementUploadImgComponent implements OnInit, OnDestroy {

  dataList: Array<any>= [];
  drawFlag = true;
  windowUrl:any;

  modalData: any;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private pageBusinessService: PageBusinessService,
              private ngbModalService: NgbModal,
              private router: Router,
              private modalService: ModalService) {
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/elementList") >= 0 ) {
      this.drawFlag = false;
    }
  }

  imgSrcA: any = "";
  imgSrcB: any = "";
  imgSrcC: any = "";
  imgSrcD: any = "";
  imgSrcE: any = "";
  imgSrcF: any = "";
  inputFileA: any = "";
  inputFileB: any = "";
  inputFileC: any = "";
  inputFileD: any = "";
  inputFileE: any = "";
  inputFileF: any = "";
  des1: any = "";
  des2: any = "";
  des3: any = "";
  imgSizeA: any = "";
  imgSizeB: any = "";
  imgSizeC: any = "";

  delAdisabled: boolean = false;
  delBdisabled: boolean = false;
  delCdisabled: boolean = false;

  imgApi: any;
  imgApiSD: any;

  newFile: any = new FormData();

  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    if (this.modalData.preFlag) {
      this.newFile.append("id", "");
    } else {
      this.newFile.append("elementId", "");
    }
    this.newFile.append("imageVaDes", "");
    this.newFile.append("imageVbDes", "");
    this.newFile.append("imageVcDes", "");
    this.newFile.append("fileA", "");
    this.newFile.append("fileB", "");
    this.newFile.append("fileC", "");
    this.newFile.append("fileD", "");
    this.newFile.append("fileE", "");
    this.newFile.append("fileF", "");
    this.getDetail();
  }
  ngOnDestroy() {
    if (this.showThisEleModal !== null) {
      this.showThisEleModal.close();
    }
  }

  // getDetail () {
    // let that = this;
    // let param = {elementId: this.modalData.elementId};
    // this.pageBusinessService.eleDetailPost(param, function(data){
    //   // that.detailData = data;
    //   // that.getEleList(data.eleValue);
    //   callback();
    // });
  // }
  getDetail() {
    if (this.modalData !== "") {
      if (this.modalData.preFlag) {
        let strA = this.modalData.data.imageVa !== null ? this.imgApi + this.modalData.data.imageVa + "?random=" + Math.random(): "";
        let strD = this.modalData.data.imageVa !== null ? this.imgApiSD + this.modalData.data.imageVa + "?random=" + Math.random() : "";
        let strB = this.modalData.data.imageVb !== null ? this.imgApi + this.modalData.data.imageVb + "?random=" + Math.random(): "";
        let strE = this.modalData.data.imageVb !== null ? this.imgApiSD + this.modalData.data.imageVb + "?random=" + Math.random(): "";
        let strC = this.modalData.data.imageVc !== null ? this.imgApi + this.modalData.data.imageVc + "?random=" + Math.random() : "";
        let strF = this.modalData.data.imageVc !== null ? this.imgApiSD + this.modalData.data.imageVc + "?random=" + Math.random(): "";

        this.inputFileA = "";
        this.inputFileB = "";
        this.inputFileC = "";
        this.inputFileD = "";
        this.inputFileE = "";
        this.inputFileF = "";
        this.imgSrcA = strA;
        this.imgSrcB = strB;
        this.imgSrcC = strC;
        this.imgSrcD = strD;
        this.imgSrcE = strE;
        this.imgSrcF = strF;
        this.des1 = this.modalData.data.imageVaDes === null ? '' : this.modalData.data.imageVaDes;
        this.des2 = this.modalData.data.imageVbDes === null ? '' : this.modalData.data.imageVbDes;
        this.des3 = this.modalData.data.imageVcDes === null ? '' : this.modalData.data.imageVcDes;
        this.imgSizeA = this.modalData.data.imageVaSize;
        this.imgSizeB = this.modalData.data.imageVbSize;
        this.imgSizeC = this.modalData.data.imageVcSize;
      } else {
        let strA = this.modalData.imageVa !== null ? this.imgApi + this.modalData.imageVa + "?random=" + Math.random() : "";
        let strD = this.modalData.imageVa !== null ? this.imgApiSD + this.modalData.imageVa + "?random=" + Math.random() : "";
        let strB = this.modalData.imageVb !== null ? this.imgApi + this.modalData.imageVb + "?random=" + Math.random() : "";
        let strE = this.modalData.imageVb !== null ? this.imgApiSD + this.modalData.imageVb + "?random=" + Math.random(): "";
        let strC = this.modalData.imageVc !== null ? this.imgApi + this.modalData.imageVc + "?random=" + Math.random(): "";
        let strF = this.modalData.imageVc !== null ? this.imgApiSD + this.modalData.imageVc  + "?random=" + Math.random(): "";

        this.inputFileA = "";
        this.inputFileB = "";
        this.inputFileC = "";
        this.inputFileD = "";
        this.inputFileE = "";
        this.inputFileF = "";
        this.imgSrcA = strA;
        this.imgSrcB = strB;
        this.imgSrcC = strC;
        this.imgSrcD = strD;
        this.imgSrcE = strE;
        this.imgSrcF = strF;
        this.des1 = this.modalData.imageVaDes === null ? '' : this.modalData.imageVaDes;
        this.des2 = this.modalData.imageVbDes === null ? '' : this.modalData.imageVbDes;
        this.des3 = this.modalData.imageVcDes === null ? '' : this.modalData.imageVcDes;
        this.imgSizeA = this.modalData.imageVaSize;
        this.imgSizeB = this.modalData.imageVbSize;
        this.imgSizeC = this.modalData.imageVcSize;
      }
      if (this.imgSrcA === '') {
        this.delAdisabled = true;
      };
      if (this.imgSrcB === '') {
        this.delBdisabled = true;
      };
      if(this.imgSrcC === '') {
        this.delCdisabled = true;
      };
    }
  }

  upload(ev, index) {
    let evAnd = ev.target ? ev.target : ev.srcElement;
    let file = evAnd.files[0];
    this.newFile.set("file"+index, file);
    let that = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
        case 'B':
          that.imgSrcB = this.result;
          break;
        case 'C':
          that.imgSrcC = this.result;
          break;
        case 'D':
          that.imgSrcD = this.result;
          break;
        case 'E':
          that.imgSrcE = this.result;
          break;
        case 'F':
          that.imgSrcF = this.result;
          break;
      }
    };
  }

  delete(index) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      let param: any = {};
      if (this.modalData.preFlag) {
        param.primaryId = this.modalData.data.id,
        param.op = 1
      } else {
        param.primaryId = this.modalData.elementId,
        param.op = 0
      };
      param.imageABC = index;
      this.pageBusinessService.deleteImage(param, function(data){
        if (that.modalData.preFlag) {
          that.modalData.data = data;
        } else {
          that.modalData = data;
        }
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
        that.getDetail();
      });
    }, (reason) => {
      // that.getList();
    });

  }
  validate() {
    let bool1 = true;
    let bool2 = true;
    let bool3 = true;
    if ((this.newFile.get("fileA") !== "" && this.newFile.get("fileD") === "") || (this.newFile.get("fileA") === "" && this.newFile.get("fileD") !== "") || (this.newFile.get("fileA") === "" && this.newFile.get("fileD") === "")) {
      bool1 = false;
    }
    if ((this.newFile.get("fileB") !== "" && this.newFile.get("fileE") === "" ) || (this.newFile.get("fileB") === "" && this.newFile.get("fileE") !== "") || (this.newFile.get("fileB") === "" && this.newFile.get("fileE") === "") ) {
      bool2 = false;
    }
    if ((this.newFile.get("fileC") !== "" && this.newFile.get("fileF") === "") || (this.newFile.get("fileC") === "" && this.newFile.get("fileF") !== "") || (this.newFile.get("fileC") === "" && this.newFile.get("fileF") === "")) {
      bool3 = false;
    }
    return bool1 || bool2 || bool3;
  }

  isFileEmpty () {
    if (this.newFile.get("fileA") === '' && this.newFile.get("fileB") === '' && this.newFile.get("fileC") === '' && this.newFile.get("fileD") === '' && this.newFile.get("fileE") === '' && this.newFile.get("fileF") === '') {
      return true;
    } else {
      return false;
    }
  }

  showThisEleModal: any = null;
  isHas: any = '';
  ok(): void {
    let ET = this.modalData.eleType;
    let pa, pb, pc;
    if (this.modalData.preFlag) {
      pa = this.modalData.data.imageVa;
      pb = this.modalData.data.imageVb;
      pc = this.modalData.data.imageVc;
      if ((ET === 'plist' || ET === 'vlist' || ET === 'res' || ET === 'album') && (this.newFile.get("fileA") !== '' || this.newFile.get("fileB") !== '' || this.newFile.get("fileC") !== '' || this.newFile.get("fileD") !== '' || this.newFile.get("fileE") !== '' || this.newFile.get("fileF") !== '') && this.drawFlag) {
        this.showThisEleModal = this.ngbModalService.open(ElementConfirPicComponent, {size: 'sm'});
        this.showThisEleModal.result.then((result) => {
          this.isHas = result;
          this.edit();
        }, (reason) => {
        });
      } else {
        this.edit();
      }
    } else {
      pa = this.modalData.imageVa;
      pb = this.modalData.imageVb;
      pc = this.modalData.imageVc;
      if (((ET === 'plist' || ET === 'vlist' || ET === 'res' || ET === 'album') && (pa !== null ||  pb !== null ||  pc !== null)) && (this.newFile.get("fileA") !== '' || this.newFile.get("fileB") !== '' || this.newFile.get("fileC") !== '' || this.newFile.get("fileD") !== '' || this.newFile.get("fileE") !== '' || this.newFile.get("fileF") !== '') && this.drawFlag) {
        this.showThisEleModal = this.ngbModalService.open(ElementConfirPicComponent, {size: 'sm'});
        this.showThisEleModal.result.then((result) => {
          this.isHas = result;
          this.edit();
        }, (reason) => {
        });
      } else {
        this.edit();
      }
    }
  }
  edit () {
    let that = this;
    let ET = this.modalData.eleType;
    if (( ET === 'plist' || ET === 'vlist' || ET === 'res' || ET === 'album') && this.isHas === 'yes') {
      this.newFile.set("isSaveHis", true);
    } else {
      this.newFile.set("isSaveHis", false);
    }
    if (this.modalData.preFlag) {
      this.newFile.set("id", this.modalData.data.id);
      this.newFile.set("eleType", this.modalData.data.eleType);
      this.newFile.set("imageVaDes", this.des1);
      this.newFile.set("imageVbDes", this.des2);
      this.newFile.set("imageVcDes", this.des3);
      // if (this.isFileEmpty()) {
      //   that.close();
      // } else {
      //   if (this.validate()) {
      this.pageBusinessService.uploadPicPrePost(this.newFile, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '上传成功。', 2000));
        that.close();
      });
      // } else {
      //   this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '高标清图必须一一对应!', 2000));
      // }
      // }
    }else {
      this.newFile.set("elementId", this.modalData.elementId);
      this.newFile.set("eleType", this.modalData.eleType);
      this.newFile.set("imageVaDes", this.des1);
      this.newFile.set("imageVbDes", this.des2);
      this.newFile.set("imageVcDes", this.des3);
      // if (this.isFileEmpty()) {
      //   that.close();
      // } else {
      //   if (this.validate()) {
      this.pageBusinessService.uploadPicPost(this.newFile, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '上传成功。', 2000));
        that.close();
      });
      // } else {
      //   this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '高标清图必须一一对应!', 2000));
      // }
      // }
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
