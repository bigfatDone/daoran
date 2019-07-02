import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { environment } from '../../../environments/environment';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
import {ProgramUploadComponent} from '../program/program-upload.component';
import {OnceUploadComponent} from './once-upload.component';

@Component({
  selector: 'c-picture-show',
  templateUrl: './picture-show.component.html',
  styleUrls: ['./picture-show.component.scss']
})
export class PictureShowComponent implements OnInit {

  dataList: Array<any>= [];

  modalData: any;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private orderBusinessService: OrderBusinessService,
              private ngbModalService: NgbModal) {
  }

  imgSrc0: any = "";
  imgSrc1: any = "";
  imgSrc2: any = "";
  imgSrc3: any = "";
  imgSrc4: any = "";
  imgSrc5: any = "";
  imgSrc6: any = "";
  imgSrc7: any = "";
  imgSrc8: any = "";
  imgSrc9: any = "";
  imgSrc10: any = "";
  imgSrc11: any = "";
  imgSrc12: any = "";
  imgSrc13: any = "";
  imgSrc14: any = "";
  imgSrc15: any = "";
  imgSrc16: any = "";
  imgSrc17: any = "";
  imgSrc18: any = "";
  imgSrc19: any = "";
  imgSrc20: any = "";
  imgSrc21: any = "";
  imgSrc22: any = "";
  imgSrc23: any = "";
  imgSrc24: any = "";
  imgSrc25: any = "";
  imgSrc26: any = "";
  imgSrc27: any = "";
  des1: any = "";
  des2: any = "";
  des3: any = "";

  imgApi: any;
  imgApiSD: any;

  newFile: any = new FormData();

  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    this.newFile.append("styleCode", "");
    // this.newFile.append("imageVaDes", "");
    // this.newFile.append("imageVbDes", "");
    // this.newFile.append("imageVcDes", "");
    this.newFile.append("file0", "");
    this.newFile.append("file1", "");
    this.newFile.append("file2", "");
    this.newFile.append("file3", "");
    this.newFile.append("file4", "");
    this.newFile.append("file5", "");
    this.newFile.append("file6", "");
    this.newFile.append("file7", "");
    this.newFile.append("file8", "");
    this.newFile.append("file9", "");
    this.newFile.append("file10", "");
    this.newFile.append("file11", "");
    this.newFile.append("file12", "");
    this.newFile.append("file13", "");
    this.newFile.append("file14", "");
    this.newFile.append("file15", "");
    this.newFile.append("file16", "");
    this.newFile.append("file17", "");
    this.newFile.append("file18", "");
    this.newFile.append("file19", "");
    this.newFile.append("file20", "");
    this.newFile.append("file21", "");
    this.newFile.append("file22", "");
    this.newFile.append("file23", "");
    this.newFile.append("file24", "");
    this.newFile.append("file25", "");
    this.newFile.append("file26", "");
    this.newFile.append("file27", "");
    this.getDetail();
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
  picData: any;
  getDetail() {
    let that = this;
    this.orderBusinessService.getTemplateImgByStyleCode({styleCode:this.modalData.styleCode},function (data) {
      if (data.obj) {
        that.picData = data.obj;
        that.imgSrc0 = that.picData.bgOnce !== "" ? that.imgApi + that.picData.bgOnce + "?random=" + Math.random() : "";
        that.imgSrc1 = that.picData.bgOnce !== "" ? that.imgApiSD + that.picData.bgOnce + "?random=" + Math.random() : "";
        that.imgSrc2 = that.picData.bgTwice !== "" ? that.imgApi + that.picData.bgTwice + "?random=" + Math.random() : "";
        that.imgSrc3 = that.picData.bgTwice !== "" ? that.imgApiSD + that.picData.bgTwice + "?random=" + Math.random() : "";
        that.imgSrc4 = that.picData.bgYjsrVcode !== "" ? that.imgApi + that.picData.bgYjsrVcode + "?random=" + Math.random() : "";
        that.imgSrc5 = that.picData.bgYjsrVcode !== "" ? that.imgApiSD + that.picData.bgYjsrVcode + "?random=" + Math.random() : "";
        that.imgSrc6 = that.picData.bgHandVcode !== "" ? that.imgApi + that.picData.bgHandVcode + "?random=" + Math.random() : "";
        that.imgSrc7 = that.picData.bgHandVcode !== "" ? that.imgApiSD + that.picData.bgHandVcode + "?random=" + Math.random() : "";
        that.imgSrc8 = that.picData.btConfirm !== "" ? that.imgApi + that.picData.btConfirm + "?random=" + Math.random() : "";
        that.imgSrc9 = that.picData.btConfirm !== "" ? that.imgApiSD + that.picData.btConfirm + "?random=" + Math.random() : "";
        that.imgSrc10 = that.picData.btConfirmFocus !== "" ? that.imgApi + that.picData.btConfirmFocus + "?random=" + Math.random() : "";
        that.imgSrc11 = that.picData.btConfirmFocus !== "" ? that.imgApiSD + that.picData.btConfirmFocus + "?random=" + Math.random() : "";
        that.imgSrc12 = that.picData.btCancel !== "" ? that.imgApi + that.picData.btCancel + "?random=" + Math.random() : "";
        that.imgSrc13 = that.picData.btCancel !== "" ? that.imgApiSD + that.picData.btCancel + "?random=" + Math.random() : "";
        that.imgSrc14 = that.picData.btCancelFocus !== "" ? that.imgApi + that.picData.btCancelFocus + "?random=" + Math.random() : "";
        that.imgSrc15 = that.picData.btCancelFocus !== "" ? that.imgApiSD + that.picData.btCancelFocus + "?random=" + Math.random() : "";
        that.imgSrc16 = that.picData.btYjsr !== "" ? that.imgApi + that.picData.btYjsr + "?random=" + Math.random() : "";
        that.imgSrc17 = that.picData.btYjsr !== "" ? that.imgApiSD + that.picData.btYjsr + "?random=" + Math.random() : "";
        that.imgSrc18 = that.picData.btYjsrFocus !== "" ? that.imgApi + that.picData.btYjsrFocus + "?random=" + Math.random() : "";
        that.imgSrc19 = that.picData.btYjsrFocus !== "" ? that.imgApiSD + that.picData.btYjsrFocus + "?random=" + Math.random() : "";
        that.imgSrc20 = that.picData.btDelete !== "" ? that.imgApi + that.picData.btDelete + "?random=" + Math.random() : "";
        that.imgSrc21 = that.picData.btDelete !== "" ? that.imgApiSD + that.picData.btDelete + "?random=" + Math.random() : "";
        that.imgSrc22 = that.picData.btDeleteFocus !== "" ? that.imgApi + that.picData.btDeleteFocus + "?random=" + Math.random() : "";
        that.imgSrc23 = that.picData.btDeleteFocus !== "" ? that.imgApiSD + that.picData.btDeleteFocus + "?random=" + Math.random() : "";
        that.imgSrc24 = that.picData.bgSucess !== "" ? that.imgApi + that.picData.bgSucess + "?random=" + Math.random() : "";
        that.imgSrc25 = that.picData.bgSucess !== "" ? that.imgApiSD + that.picData.bgSucess + "?random=" + Math.random() : "";
        that.imgSrc26 = that.picData.bgFailed !== "" ? that.imgApi + that.picData.bgFailed + "?random=" + Math.random() : "";
        that.imgSrc27 = that.picData.bgFailed !== "" ? that.imgApiSD + that.picData.bgFailed + "?random=" + Math.random() : "";
      }
    });
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
        case '0':
          that.imgSrc0 = this.result;
          break;
        case '1':
          that.imgSrc1 = this.result;
          break;
        case '2':
          that.imgSrc2 = this.result;
          break;
        case '3':
          that.imgSrc3 = this.result;
          break;
        case '4':
          that.imgSrc4 = this.result;
          break;
        case '5':
          that.imgSrc5 = this.result;
          break;
        case '6':
          that.imgSrc6 = this.result;
          break;
        case '7':
          that.imgSrc7 = this.result;
          break;
        case '8':
          that.imgSrc8 = this.result;
          break;
        case '9':
          that.imgSrc9 = this.result;
          break;
        case '10':
          that.imgSrc10 = this.result;
          break;
        case '11':
          that.imgSrc11 = this.result;
          break;

        case '12':
          that.imgSrc12 = this.result;
          break;

        case '13':
          that.imgSrc13 = this.result;
          break;

        case '14':
          that.imgSrc14 = this.result;
          break;

        case '15':
          that.imgSrc15 = this.result;
          break;

        case '16':
          that.imgSrc16 = this.result;
          break;

        case '17':
          that.imgSrc17 = this.result;
          break;

        case '18':
          that.imgSrc18 = this.result;
          break;
        case '19':
          that.imgSrc19 = this.result;
          break;

        case '20':
          that.imgSrc20 = this.result;
          break;
        case '21':
          that.imgSrc21 = this.result;
          break;

        case '22':
          that.imgSrc22 = this.result;
          break;
        case '23':
          that.imgSrc23 = this.result;
          break;
        case '24':
          that.imgSrc24 = this.result;
          break;
        case '25':
          that.imgSrc25 = this.result;
          break;
        case '26':
          that.imgSrc26 = this.result;
          break;
        case '27':
          that.imgSrc27 = this.result;
          break;
      }
    };
  }


  uploadResModel: any = null;
  excelData: Array<any> = [];
  onceUpload(){
    let that = this;
    this.uploadResModel = this.ngbModalService.open(OnceUploadComponent, {size: "lg"});
    this.uploadResModel.componentInstance.modalData = that.modalData
    this.uploadResModel.result.then((result) => {
      // this.excelData = result;
      // that.addSelect();
    }, (reason) => {
      that.getDetail();
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

  ok(): void {
    let that = this;
      this.newFile.set("styleCode", this.modalData.styleCode);
      // this.newFile.set("imageVaDes", this.des1);
      // this.newFile.set("imageVbDes", this.des2);
      // this.newFile.set("imageVcDes", this.des3);
      // if (this.validate()) {
      this.orderBusinessService.uploadPicPrePost(this.newFile, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '上传成功。', 2000));
        that.close();
      });
      // } else {
      //   this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '高标清图必须一一对应!', 2000));
      // }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
