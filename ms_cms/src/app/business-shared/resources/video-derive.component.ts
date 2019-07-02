import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import {artInfo, basicVidInfo, basicAudInfo, basicPatInfo, otherInfo} from '../../global-constant';
import {ResourcesBusinessService} from '../../business-service/resources/resources-business.service';

@Component({
  selector: 'c-video-derive',
  templateUrl: './video-derive.component.html',
  styleUrls: ['./video-derive.component.scss'],
})
export class VideoDeriveComponent implements OnInit {

  deriveVideoForm: FormGroup;
  deriveData: any = "";
  modalData: any = "";


  constructor(public activeModal: NgbActiveModal,  public resourcesBusinessService: ResourcesBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
   // const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const codeFc = new FormControl('', Validators.compose([Validators.required, CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const desFc = new FormControl('', Validators.compose([]));

    this.deriveVideoForm = this.formBuilder.group({
     // name: nameFc,
      code: codeFc,
      des: desFc,
    });
  }

  ngOnInit() {
    // if ( this.modalData !== "") {
    //   this.getDetail();
    //   this.deriveVideoForm.controls['code'].disable();
    this.getDeriveData ();
  }

  nodeList: Array<any>= [];
  // basicInfos: Array<any>= basicInfo;
  // artAInfos: Array<any>= artAInfo;
  // otherInfos: Array<any>= otherInfo;

  basicVidInfos: Array<any>= [];
  basicAudInfos: Array<any>= [];
  basicPatInfos: Array<any>= [];
  artInfos: Array<any>= [];
  otherInfos: Array<any>= [];
  ArtInfos: Array<any>= [];
  basicInfoStr: any;
  artInfoStr: any;
  otherInfoStr: any;

  getDeriveData () {
    this.basicVidInfos = [];
    this.basicAudInfos = [];
    this.basicPatInfos = [];
    this.artInfos = [];
    this.otherInfos = [];
    this.ArtInfos = [];
    basicVidInfo.forEach(i => {
      let copyI = Object.assign({}, i);
      this.basicVidInfos.push(copyI);
    });
    basicAudInfo.forEach(i => {
      let copyI = Object.assign({}, i);
      this.basicAudInfos.push(copyI);
    });
    basicPatInfo.forEach(i => {
      let copyI = Object.assign({}, i);
      this.basicPatInfos.push(copyI);
    });
    artInfo.forEach(i => {
      let copyI = Object.assign({}, i);
      this.artInfos.push(copyI);
    });
    otherInfo.forEach(i => {
      let copyI = Object.assign({}, i);
      this.otherInfos.push(copyI);
    });
  }
  // getDetailData () {
  //   this.basicInfos = [];
  //   basicInfo.forEach(i => {
  //     let copyI = Object.assign({}, i);
  //     if (this.basicInfoStr.indexOf(copyI.type) !== -1) {
  //       copyI.checkState = true;
  //       copyI.disabled = true;
  //     }
  //     this.basicInfos.push(copyI);
  //   });
  // }
  isAllChecked() {
    this.basicVidInfos.every(_ => _.checkState);
    this.basicAudInfos.every(_ => _.checkState);
    this.basicPatInfos.every(_ => _.checkState);
    this.artInfos.every(_ => _.checkState);
    this.otherInfos.every(_ => _.checkState);
  }
  // this.basicVidInfos = [];
  // this.basicAudInfos = [];
  // this.basicPatInfos = [];
  checkAll(ev) {
    this.basicVidInfos.forEach(x => x.checkState = ev.target.checked);
    this.basicAudInfos.forEach(x => x.checkState = ev.target.checked);
    this.basicPatInfos.forEach(x => x.checkState = ev.target.checked);
    this.artInfos.forEach(x => x.checkState = ev.target.checked);
    this.otherInfos.forEach(x => x.checkState = ev.target.checked);
  }
  checkBasicVidInfo($event, index) {
    this.basicVidInfos[index].checkState = $event.target.checked;
  }
  checkBasicAudInfo($event, index) {
    this.basicAudInfos[index].checkState = $event.target.checked;
  }
  checkBasicPatInfo($event, index) {
    this.basicPatInfos[index].checkState = $event.target.checked;
  }
  checkArtInfo($event, index) {
    this.artInfos[index].checkState = $event.target.checked;
  }
  checkOtherInfo($event, index) {
    this.otherInfos[index].checkState = $event.target.checked;
  }

  getVidparmas() {
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    let arr = [];
    this.basicVidInfos.forEach(i => {
      if (i.checkState ) {
        arr1.push(i.type);
      }
    })
    this.artInfos.forEach(i => {
      if (i.checkState ) {
        arr2.push(i.type);
      }
    })
    this.otherInfos.forEach(i => {
      if (i.checkState ) {
        arr3.push(i.type);
      }
    })
    arr = arr1.concat(arr2).concat(arr3);
    return arr.toString();
  }

  getAudparmas() {
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    let arr = [];
    this.basicAudInfos.forEach(i => {
      if (i.checkState ) {
        arr1.push(i.type);
      }
    })
    this.artInfos.forEach(i => {
      if (i.checkState ) {
        arr2.push(i.type);
      }
    })
    this.otherInfos.forEach(i => {
      if (i.checkState ) {
        arr3.push(i.type);
      }
    })
    arr = arr1.concat(arr2).concat(arr3);
    return arr.toString();
  }

  getPatparmas() {
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    let arr = [];
    this.basicPatInfos.forEach(i => {
      if (i.checkState ) {
        arr1.push(i.type);
      }
    })
    this.artInfos.forEach(i => {
      if (i.checkState ) {
        arr2.push(i.type);
      }
    })
    this.otherInfos.forEach(i => {
      if (i.checkState ) {
        arr3.push(i.type);
      }
    })
    arr = arr1.concat(arr2).concat(arr3);
    return arr.toString();
  }

  ok(): void {
    let that = this;
    let param: any;
    let dataparam: any = "";
    dataparam = {
      artistArea:this.deriveData.artistArea,
      artistCode:this.deriveData.artistCode,
      artistName:this.deriveData.artistName,
      beginDate:this.deriveData.beginDate,
      endDate:this.deriveData.endDate,
      cpId:this.deriveData.cpId,
      // videoCode:this.deriveData.videoCode,
      // videoType:this.deriveData.videoType,
      // videoName:this.deriveData.videoName,
    }
    if (this.deriveData.flag === "video"){
        dataparam.videoCode = this.deriveData.videoCode,
        dataparam.videoType = this.deriveData.videoType,
        dataparam.videoName =this.deriveData.videoName,
          param =  {
            search: dataparam,
            exportField: this.getVidparmas(),
          };
      param={jsonParam:JSON.stringify(param)};
      this.resourcesBusinessService.videoExcel(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        window.open("/cms"+ data.data.path);
      });
    } else if(this.deriveData.flag === "audio"){
      dataparam.audioCode = this.deriveData.audioCode,
      dataparam.audioType = this.deriveData.audioType,
      dataparam.audioName =this.deriveData.audioName,
        param =  {
          search: dataparam,
          exportField: this.getAudparmas(),
        };
      param={jsonParam:JSON.stringify(param)};
      this.resourcesBusinessService.audioExcel(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        window.open("/cms"+ data.data.path);
      });
    } else if(this.deriveData.flag === "draw"){
      dataparam.paintCode = this.deriveData.paintCode,
      dataparam.paintType = this.deriveData.paintType,
      dataparam.paintName =this.deriveData.paintName,
        param =  {
          search: dataparam,
          exportField: this.getPatparmas(),
        };
      param={jsonParam:JSON.stringify(param)};
      this.resourcesBusinessService.drawExcel(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        window.open("/cms"+ data.data.path);
      });
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
